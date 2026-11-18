// app/components/blog/ShareButtons.tsx
'use client';

import React from 'react';
import { useEffect, useLayoutEffect, useState, useRef } from 'react';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faFacebook,
	faLinkedin,
	faXTwitter,
	faReddit,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import clsx from 'clsx';

/** interface ShareButtonsProps */
interface ShareButtonsProps {
	title: string;
}

/**
 * ShareButtons component
 *
 * Renders links to share the current page on social media with enhanced animations
 */
const ShareButtons: React.FC<ShareButtonsProps> = ({ title }) => {
	// Initialize `url` as empty, will be set in effect after mounting
	const [url, setUrl] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const shareButtonsRef = useRef<HTMLDivElement>(null);
	const titleParam = encodeURIComponent(title);

	// Set the URL after mounting on the client (before paint to avoid hydration mismatch)
	useLayoutEffect(() => {
		queueMicrotask(() => setUrl(window.location.href));
	}, []);

	// Intersection Observer for viewport reveal animation
	useEffect(() => {
		// Check if IntersectionObserver is available (not in test environment)
		if (typeof IntersectionObserver === 'undefined') {
			queueMicrotask(() => setIsVisible(true));
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect(); // Only animate once
				}
			},
			{
				threshold: 0.1, // Trigger when 10% of the component is visible
				rootMargin: '50px', // Start animation slightly before entering viewport
			}
		);

		if (shareButtonsRef.current) {
			observer.observe(shareButtonsRef.current);
		}

		return () => observer.disconnect();
	}, []);

	// create share urls for each platform
	const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
	const linkedInLink = `https://www.linkedin.com/shareArticle?mini=true&url=${url}`;
	const xTwitterLink = `http://x.com/share?url=${url}&text=${titleParam}`;
	const redditLink = `https://reddit.com/submit?url=${url}&title=${titleParam}`;
	const emailLink = `mailto:?subject=${titleParam}&body=${url}`;

	// Buttons fade in one after another once the container is visible.
	const shareButtonClass = clsx(
		'group/share inline-flex w-max min-w-7 cursor-pointer items-center gap-2 rounded-lg border-none bg-background-too py-2 pr-0 pl-2 text-center leading-none whitespace-nowrap text-foreground no-underline shadow-[0_2px_4px_rgba(0,0,0,0.1)] [transition:all_0.3s_ease,opacity_0.4s_ease_var(--reveal-delay,0s),translate_0.4s_ease_var(--reveal-delay,0s),scale_0.4s_ease_var(--reveal-delay,0s)] hover:bg-foreground hover:pr-3 hover:text-background hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] focus:outline-2 focus:outline-offset-2 focus:outline-foreground motion-reduce:translate-none motion-reduce:scale-none motion-reduce:opacity-100 motion-reduce:[transition:background-color_0.3s_ease,color_0.3s_ease] motion-reduce:hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)]',
		isVisible
			? 'translate-y-0 scale-100 opacity-100'
			: 'translate-y-[20px] scale-[0.8] opacity-0'
	);
	const labelClass =
		'inline-block max-w-0 overflow-hidden text-[0.875em] transition-[max-width] duration-[250ms] ease-[ease] group-hover/share:max-w-[200px]';
	const revealDelay = (index: number) =>
		({ '--reveal-delay': `${0.4 + index * 0.1}s` }) as React.CSSProperties;

	return (
		// Button container with viewport reveal animation
		<div
			ref={shareButtonsRef}
			className={clsx(
				'my-8 rounded-[0.75rem] border border-line px-6 py-8 text-center [background:var(--backgroundFade)] [transition:opacity_0.6s_ease-out_0.3s,translate_0.6s_ease-out_0.3s,scale_0.6s_ease-out_0.3s,box-shadow_0.6s_ease-out] hover:shadow-[inset_0_0_3em_0_rgba(128,128,128,0.5)] motion-reduce:translate-none motion-reduce:scale-none motion-reduce:opacity-100 motion-reduce:transition-none',
				isVisible
					? 'translate-y-0 scale-100 opacity-100'
					: 'translate-y-[20px] scale-[0.95] opacity-0'
			)}
		>
			<h3 className='mt-0 mb-0 text-[1.25rem] font-semibold text-foreground'>
				Share This Post
			</h3>
			<p className='mt-0 mb-6 text-[0.95rem] text-foreground opacity-85'>
				If you found this post interesting, please consider sharing it to your
				social networks.
			</p>
			{/*
        Render links for each platform
        */}
			<div className='flex flex-row flex-wrap justify-center gap-3'>
				<a
					className={shareButtonClass}
					style={revealDelay(0)}
					href={facebookLink}
					target='_blank'
					rel='noopener noreferrer'
					data-share-platform='facebook'
				>
					<FontAwesomeIcon icon={faFacebook} aria-hidden='true' />
					<span className={labelClass}>Share on Facebook</span>
				</a>

				<a
					className={shareButtonClass}
					style={revealDelay(1)}
					href={linkedInLink}
					target='_blank'
					rel='noopener noreferrer'
					data-share-platform='linkedin'
				>
					<FontAwesomeIcon icon={faLinkedin} aria-hidden='true' />
					<span className={labelClass}>Share on LinkedIn</span>
				</a>

				<a
					className={shareButtonClass}
					style={revealDelay(2)}
					href={xTwitterLink}
					target='_blank'
					rel='noopener noreferrer'
					data-share-platform='twitter'
				>
					<FontAwesomeIcon icon={faXTwitter} aria-hidden='true' />
					<span className={labelClass}>Share on X</span>
				</a>

				<a
					className={shareButtonClass}
					style={revealDelay(3)}
					href={redditLink}
					target='_blank'
					rel='noopener noreferrer'
					data-share-platform='reddit'
				>
					<FontAwesomeIcon icon={faReddit} aria-hidden='true' />
					<span className={labelClass}>Share on Reddit</span>
				</a>

				<a
					className={shareButtonClass}
					style={revealDelay(4)}
					href={emailLink}
					target='_blank'
					rel='noopener noreferrer'
					data-share-platform='email'
				>
					<FontAwesomeIcon icon={faEnvelope} aria-hidden='true' />
					<span className={labelClass}>Share by Email</span>
				</a>
			</div>
		</div>
	);
};

// export the component
export default ShareButtons;
