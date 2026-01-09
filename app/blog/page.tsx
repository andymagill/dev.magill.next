/**
 * Blog Page
 *
 */
import type { Metadata } from 'next';

import { settings } from '@/utils/settings.mjs';
import Hero from '@/app/components/global/Hero';
import PostList from '@/app/components/blog/PostList';
import JsonLd from '@/app/components/global/JsonLd';
import styles from './page.module.scss';

const meta = {
	title: 'Rants & Ramblings - ' + settings.title,
	description:
		'A Collection of Rants and Ramblings by web developer, Andrew Magill',
	url: `${settings.siteUrl}/blog/`,
};

export const metadata: Metadata = {
	title: meta.title,
	description: meta.description,
	alternates: {
		types: {
			'application/rss+xml': `${settings.siteUrl}/feed/posts.xml`,
		},
	},
	openGraph: {
		title: meta.title,
		description: meta.description,
		type: 'website',
		url: meta.url,
		images: [
			{
				url: settings.siteUrl + settings.siteThumb,
				alt: 'Preview of ' + meta.title,
			},
		],
	},
	twitter: {
		title: meta.title,
		description: meta.description,
		images: [
			{
				url: settings.siteUrl + settings.siteThumb,
				alt: 'Preview of ' + meta.title,
			},
		],
	},
};

export default function Projects() {
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: meta.title,
		description: meta.description,
		url: meta.url,
		publisher: {
			'@type': 'Person',
			name: settings.author,
		},
	};
	return (
		<main className={styles.main}>
			{/* JSON-LD structured data for SEO */}
			<JsonLd data={jsonLd} />

			<Hero>
				<h1>A Collection of Rants & Ramblings </h1>
				<p>
					I&apos;m reluctantly betting my time that someone will find something
					useful here.{' '}
				</p>
			</Hero>

			{/* TODO: Make post index design consistent with homepage */}
			<section className={styles.postIndex}>
				<div className={styles.wrapper}>
					<PostList />
				</div>
			</section>
		</main>
	);
}
