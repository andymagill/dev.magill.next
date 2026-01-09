'use client';

import React, { useEffect, useRef } from 'react';
import styles from './HeroAnimation.module.scss';

interface HeroAnimationProps {
	duration?: number;
}

/** Seeded random generator - produces consistent values for same seed + index */
const seededRandom = (seed: number, index: number): number => {
	const x = Math.sin((seed + index) * 12.9898) * 43758.5453;
	return x - Math.floor(x);
};

interface ParticleData {
	yOffset: number;
	bgXOffset: number;
	hueRotation: number;
	delay: number;
}

interface AnimationState {
	startTime: number;
	seed: number;
	gradientOffsets: { c0: number; c1: number; c2: number };
	layerPhaseOffsets: { before: number; after: number };
	particles: {
		before: ParticleData[];
		after: ParticleData[];
	};
}

const HeroAnimation: React.FC<HeroAnimationProps> = ({ duration = 12000 }) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const now = Date.now();
		const storedState = localStorage.getItem('heroAnimationState');

		let state: AnimationState;

		// Generate particle data for both layers
		// Use mixed negative/positive delays across 60s cycle for continuous coverage
		// Half particles use large negative delays (appear late in cycle at page load)
		// Half use small/positive delays (appear early/on time)
		// Together they fill the entire 60s duration with no gaps
		const generateParticles = (seed: number, startSeedIndex: number): ParticleData[] => {
			const delayPattern = [
				-51429, // P0: ~85% through cycle
				-34286, // P1: ~57% through cycle
				-17142, // P2: ~28% through cycle
				0,      // P3: at start
				8571,   // P4: after 8.57s
				25714,  // P5: after 25.7s
				42857,  // P6: after 42.8s
			];
			
			return Array.from({ length: 7 }, (_, i) => ({
				yOffset: seededRandom(seed, startSeedIndex + i) * 70 - 35,
				bgXOffset: seededRandom(seed, startSeedIndex + 10 + i) * 10 - 5,
				hueRotation: seededRandom(seed, startSeedIndex + 20 + i) * 60 - 30,
				delay: delayPattern[i],
			}));
		};

		let shouldPersistState = false;
		if (storedState) {
			const parsed = JSON.parse(storedState);
			const savedOffsets = parsed.layerPhaseOffsets ?? { before: 0, after: -30000 };
			const needsMigration = savedOffsets.after > 0;
			const afterPhaseOffset = needsMigration
				? -36000 + (seededRandom(parsed.seed, 40) - 0.5) * 10000
				: savedOffsets.after;
			const layerPhaseOffsets = {
				before: savedOffsets.before ?? 0,
				after: afterPhaseOffset,
			};
			// Regenerate particles from stored seed to ensure consistent delays
			state = {
				...parsed,
				layerPhaseOffsets,
				particles: {
					before: generateParticles(parsed.seed, 21),
					after: generateParticles(parsed.seed, 25),
				},
			};
			shouldPersistState = needsMigration;
		} else {
			const startTime = now;
			const seed = Math.floor(Math.random() * 1000000);
			const layerPhaseJitter = (seededRandom(seed, 40) - 0.5) * 10000;
			const layerPhaseOffsets = {
				before: 0,
				after: -36000 + layerPhaseJitter,
			};

			state = {
				startTime,
				seed,
				gradientOffsets: {
					c0: seededRandom(seed, 37) * 8 - 4,
					c1: seededRandom(seed, 38) * 10 - 5,
					c2: seededRandom(seed, 39) * 6 - 3,
				},
				layerPhaseOffsets,
				particles: {
					before: generateParticles(seed, 21),
					after: generateParticles(seed, 25),
				},
			};
			shouldPersistState = true;
		}

		if (shouldPersistState) {
			localStorage.setItem('heroAnimationState', JSON.stringify(state));
		}

		// Calculate delay only once on mount
		const totalElapsed = now - state.startTime;
		const delayMs = -totalElapsed;

		// Apply single animation delay for all animations
		container.style.setProperty('--animation-delay', `${delayMs}ms`);

		// Apply gradient color stop offsets
		container.style.setProperty('--gradient-c0-offset', `${state.gradientOffsets.c0}%`);
		container.style.setProperty('--gradient-c1-offset', `${state.gradientOffsets.c1}%`);
		container.style.setProperty('--gradient-c2-offset', `${state.gradientOffsets.c2}%`);

		const beforeLayerDelay = delayMs + state.layerPhaseOffsets.before;
		const afterLayerDelay = delayMs + state.layerPhaseOffsets.after;
		container.style.setProperty('--before-layer-delay', `${beforeLayerDelay}ms`);
		container.style.setProperty('--after-layer-delay', `${afterLayerDelay}ms`);

		// Debug: expose computed timing values to console for diagnosis
		if (process.env.NODE_ENV !== 'production') {
			console.debug('HeroAnimation delays:', {
				beforeLayerDelay,
				afterLayerDelay,
				sampleBeforeParticleDelay: state.particles.before[0]?.delay,
				sampleAfterParticleDelay: state.particles.after[0]?.delay,
			});
		}

		// Apply particle data for both layers
		const applyParticles = (layer: 'before' | 'after') => {
			const particles = state.particles[layer];
			const beforeHueAvg = particles.reduce((sum, p) => sum + p.hueRotation, 0) / particles.length;

			particles.forEach((particle, i) => {
				container.style.setProperty(`--${layer}-y-offset-${i}`, `${particle.yOffset}vmin`);
				container.style.setProperty(`--${layer}-bg-x-offset-${i}`, `${particle.bgXOffset}%`);
				container.style.setProperty(`--${layer}-hue-${i}`, `${particle.hueRotation}deg`);
				container.style.setProperty(`--${layer}-particle-${i}-delay`, `${particle.delay}ms`);
			});

			container.style.setProperty(`--${layer}-hue-avg`, `${beforeHueAvg}deg`);
		};

		applyParticles('before');
		applyParticles('after');
	}, [duration]);

	return (
		<div ref={containerRef} className={`${styles.heroAnimation} heroAnimation`}></div>
	);
};

export default HeroAnimation;
