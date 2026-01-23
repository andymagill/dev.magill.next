'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './RelatedPosts.module.scss';

interface Props {
	children: React.ReactNode;
	className?: string;
}

/**
 * Client wrapper that mirrors ShareButtons: toggles a plain `visible` class
 * when the container scrolls into view so server-rendered children can animate.
 */
export default function RelatedPosts({ children, className }: Props) {
	const ref = useRef<HTMLDivElement | null>(null);
	// Track when component has mounted on client
	const [mounted, setMounted] = useState(false);
	// Start not visible, will be set after mounting
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		queueMicrotask(() => setMounted(true));

		// If IntersectionObserver is not available (e.g tests/older browsers),
		// show immediately
		if (typeof IntersectionObserver === 'undefined') {
			queueMicrotask(() => setVisible(true));
			return;
		}

		const el = ref.current;
		if (!el) return;

		const obs = new IntersectionObserver(
			([entry], o) => {
				if (entry.isIntersecting) {
					setVisible(true);
					o.disconnect();
				}
			},
			{ threshold: 0.12 }
		);

		obs.observe(el);
		return () => obs.disconnect();
	}, []);

	const wrapperClass = `${styles.container} ${className ?? ''}`.trim();

	return (
		<div
			ref={ref}
			className={wrapperClass}
			data-related-visible={visible ? '1' : '0'}
		>
			<h2 className={styles.heading}>Related Articles</h2>
			{children}
		</div>
	);
}
