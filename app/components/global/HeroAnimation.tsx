'use client';

import React, { useEffect, useState, useMemo } from 'react';
import styles from './HeroAnimation.module.scss';

interface HeroAnimationProps {}

/** Seeded random generator */
const seededRandom = (seed: number, index: number): number => {
	const x = Math.sin((seed + index) * 12.9898) * 43758.5453;
	return x - Math.floor(x);
};

interface ParticlePreset {
	id: string;
	top: number; // percentage (allows -10% to 110%)
	left: number; // percentage
	size: number; // vmin
	hue: number; // degrees
	duration: number; // seconds
	baseDelay: number; // base negative delay before elapsed offset
	colorIdx: number; // palette index
}

interface ParticleRender extends ParticlePreset {
	delay: number;
}

interface AnimationState {
	startTime: number;
	seed: number;
	gradientOffsets: { c0: number; c1: number; c2: number };
	particles: ParticlePreset[];
}

const PARTICLE_COUNT = 20;

/**
 * Create deterministic presets for every particle so we can hydrate them from localStorage
 * and simply offset their animation delay by the elapsed time on subsequent pageviews.
 */
const buildParticlePresets = (seed: number): ParticlePreset[] => {
	const presets: ParticlePreset[] = [];
	for (let i = 0; i < PARTICLE_COUNT; i++) {
		const r = (offset: number) => seededRandom(seed, i * 10 + offset);
		const duration = 30 + r(1) * 30;
		const baseDelay = -r(2) * duration;
		presets.push({
			id: `p-${i}`,
			top: r(3) * 90 - 30,
			left: r(4) * 20 - 10,
			size: 10 + r(5) * 70,
			hue: r(6) * 60 - 30,
			duration,
			baseDelay,
			colorIdx: Math.floor(r(7) * 4),
		});
	}
	return presets;
};

const HeroAnimation: React.FC<HeroAnimationProps> = () => {
	const [gradientState, setGradientState] = useState<AnimationState | null>(null);
	const [elapsedMs, setElapsedMs] = useState<number | null>(null);
	const [particles, setParticles] = useState<ParticleRender[]>([]);

	// Hydrate the persisted animation state, compute the elapsed offset, and render particles only once per mount.
	useEffect(() => {
		const storedState = localStorage.getItem('heroAnimationState_v2');
		const now = Date.now();
		let seed: number;
		let currentState: AnimationState;
		let needsPersist = false;

		if (storedState) {
			currentState = JSON.parse(storedState);
			if (!currentState.startTime) {
				currentState.startTime = now;
				needsPersist = true;
			}
			seed = currentState.seed;
		} else {
			seed = Math.floor(Math.random() * 1000000);
			currentState = {
				startTime: now,
				seed,
				gradientOffsets: {
					c0: seededRandom(seed, 37) * 8 - 4,
					c1: seededRandom(seed, 38) * 10 - 5,
					c2: seededRandom(seed, 39) * 6 - 3,
				},
				particles: [],
			};
			needsPersist = true;
		}

		const presets = currentState.particles && currentState.particles.length
			? currentState.particles
			: buildParticlePresets(seed);
		if (!currentState.particles?.length) {
			currentState.particles = presets;
			needsPersist = true;
		}

		if (needsPersist) {
			localStorage.setItem('heroAnimationState_v2', JSON.stringify(currentState));
		}
		
		const elapsed = now - currentState.startTime;
		const elapsedSeconds = elapsed / 1000;
		const renderParticles = presets.map((preset) => ({
			...preset,
			delay: preset.baseDelay - elapsedSeconds,
		}));

		// Delay the render commits until the next frame to avoid synchronous setState warnings.
		const raf = requestAnimationFrame(() => {
			setGradientState(currentState);
			setElapsedMs(elapsed);
			setParticles(renderParticles);
		});
		return () => cancelAnimationFrame(raf);
	}, []);

	// Translate persisted gradient offsets into CSS custom properties and keep the animation aligned to the stored clock.
	const styleVars = useMemo(() => {
		if (!gradientState || elapsedMs === null) return {};
		return {
			'--gradient-c0-offset': `${gradientState.gradientOffsets.c0}%`,
			'--gradient-c1-offset': `${gradientState.gradientOffsets.c1}%`,
			'--gradient-c2-offset': `${gradientState.gradientOffsets.c2}%`,
			'--animation-delay': `-${elapsedMs}ms`,
		} as React.CSSProperties;
	}, [gradientState, elapsedMs]);

	return (
		<div className={`${styles.heroAnimation} heroAnimation`} style={styleVars}>
			{particles.map((p) => (
				<div
					key={p.id}
					className={styles.particle}
					style={{
						'--top': `${p.top}%`,
						'--left': `${p.left}%`,
						'--size': `${p.size}vmin`,
						'--hue': `${p.hue}deg`,
						'--duration': `${p.duration}s`,
						'--delay': `${p.delay}s`,
						// Base colors based on the design system/palette roughly matching the previous gradients
						// We can use a few base HSLs and rotate them
						'--base-color': getBaseColor(p.colorIdx),
					} as React.CSSProperties}
				/>
			))}
		</div>
	);
};

function getBaseColor(idx: number): string {
	const colors = [
		'hsl(30 45% 60% / 0.5)',
		'hsl(90 45% 60% / 0.5)',
		'hsl(150 45% 60% / 0.5)',
		'hsl(210 45% 60% / 0.5)',
		'hsl(270 45% 60% / 0.5)',
	];
	return colors[idx % colors.length];
}

export default HeroAnimation;
