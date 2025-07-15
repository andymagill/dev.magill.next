// app/components/blog/ShareButtons.tsx
'use client';

import React from 'react';
import { useEffect, useState, useRef } from 'react';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faFacebook,
	faLinkedin,
	faXTwitter,
	faReddit,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import styles from './ShareButtons.module.scss';

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
	let [url, setUrl] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const shareButtonsRef = useRef<HTMLDivElement>(null);
	const titleParam = encodeURIComponent(title);

	// get current url
	useEffect(() => {
		setUrl(window.location.href);
	}, []);

	// Intersection Observer for viewport reveal animation
	useEffect(() => {
		// Check if IntersectionObserver is available (not in test environment)
		if (typeof IntersectionObserver === 'undefined') {
			setIsVisible(true);
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

	return (
		// Button container with viewport reveal animation
		<div
			ref={shareButtonsRef}
			className={`${styles.shareButtonList} ${isVisible ? styles.visible : ''}`}
		>
			<h3>Share This Post</h3>
			<p>
				If you found this post interesting, please consider sharing it to your
				social networks.
			</p>
			{/*
        Render links for each platform
        */}
			<div className={styles.wrapper}>
				<a
					className={styles.shareButton}
					href={facebookLink}
					target='_blank'
					rel='noopener noreferrer'
					data-share-platform='facebook'
				>
					<FontAwesomeIcon icon={faFacebook} aria-hidden='true' />
					<span>Share on Facebook</span>
				</a>

				<a
					className={styles.shareButton}
					href={linkedInLink}
					target='_blank'
					rel='noopener noreferrer'
					data-share-platform='linkedin'
				>
					<FontAwesomeIcon icon={faLinkedin} aria-hidden='true' />
					<span>Share on LinkedIn</span>
				</a>

				<a
					className={styles.shareButton}
					href={xTwitterLink}
					target='_blank'
					rel='noopener noreferrer'
					data-share-platform='twitter'
				>
					<FontAwesomeIcon icon={faXTwitter} aria-hidden='true' />
					<span>Share on X</span>
				</a>

				<a
					className={styles.shareButton}
					href={redditLink}
					target='_blank'
					rel='noopener noreferrer'
					data-share-platform='reddit'
				>
					<FontAwesomeIcon icon={faReddit} aria-hidden='true' />
					<span>Share on Reddit</span>
				</a>

				<a
					className={styles.shareButton}
					href={emailLink}
					target='_blank'
					rel='noopener noreferrer'
					data-share-platform='email'
				>
					<FontAwesomeIcon icon={faEnvelope} aria-hidden='true' />
					<span>Share by Email</span>
				</a>
			</div>
		</div>
	);
};

// export the component
export default ShareButtons;
