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
	// If IntersectionObserver is not available (e.g. tests/older browsers),
	// start visible to avoid calling setState synchronously inside effect.
	const [visible, setVisible] = useState(() =>
		typeof IntersectionObserver === 'undefined' ? true : false
	);

	useEffect(() => {
		// If already marked visible (fallback), no observer needed
		if (visible) return;

		if (typeof IntersectionObserver === 'undefined') {
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
	}, [visible]);

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
