'use client';

import React, { useEffect, useRef } from 'react';
import styles from './HeroAnimation.module.scss';

interface HeroAnimationProps {
	duration?: number;
}

const HeroAnimation: React.FC<HeroAnimationProps> = ({ duration = 32 }) => {
	const animationRef = useRef<HTMLDivElement>(null);
	const startTimeRef = useRef<number | null>(null);
	const animationFrameId = useRef<number | null>(null);
	// Do not call impure functions (performance.now) during render
	const lastFrameTimeRef = useRef<number>(0);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const storedStartTime = localStorage.getItem('heroAnimationStartTime');
		startTimeRef.current = storedStartTime
			? Number(storedStartTime)
			: performance.now();
		// initialize lastFrameTimeRef now that we're in an effect
		lastFrameTimeRef.current = performance.now();
		localStorage.setItem(
			'heroAnimationStartTime',
			startTimeRef.current.toString()
		);

		const animation = animationRef.current;
		if (!animation) return;

		const updateAnimation = () => {
			if (startTimeRef.current === null) return;

			const currentTime = performance.now();
			const elapsedTime = (currentTime - startTimeRef.current) / 1000; // Convert to seconds

			// Calculate the time since the last frame
			const timeSinceLastFrame = currentTime - lastFrameTimeRef.current;

			// Limit the frame rate to 5 FPS
			if (timeSinceLastFrame >= 200) {
				const progress = ((elapsedTime % duration) / duration) * 100;
				animation.style.setProperty('--progress', progress.toString());

				// Update the last frame time
				lastFrameTimeRef.current = currentTime;
			}

			animationFrameId.current = requestAnimationFrame(updateAnimation);
		};

		animationFrameId.current = requestAnimationFrame(updateAnimation);

		return () => {
			if (animationFrameId.current !== null) {
				cancelAnimationFrame(animationFrameId.current);
			}
		};
	}, [duration]);

	return (
		<div className={`${styles.heroAnimation} heroAnimation`} ref={animationRef}>
			<div className={styles.inner}></div>
		</div>
	);
};

export default HeroAnimation;
