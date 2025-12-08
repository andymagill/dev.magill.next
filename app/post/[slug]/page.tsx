/**
 * Post Page Component
 *
 * Renders a blog post with metadata, content, and sharing options
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
import React from 'react';
import Link from 'next/link';
import Markdown from 'markdown-to-jsx';

import { settings } from '@/utils/settings.mjs';
import postService from '@/utils/PostService';
import { Post as PostType } from '@/utils/types';
import Hero from '@/app/components/global/Hero';
import PostDate from '@/app/components/blog/PostDate';
import ShareButtons from '@/app/components/blog/ShareButtons';
import ListenButton from '@/app/components/blog/ListenButton';
import RelatedPosts from '@/app/components/blog/RelatedPosts';
import RelatedPostList from '@/app/components/blog/RelatedPostList';
import styles from './page.module.scss';

/**
 * Generates static paths for all blog posts at build time
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 * @returns Array of slug objects for static path generation
 */
export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
	const slugs = postService.getSlugs();
	return slugs.map((slug) => ({ slug }));
};

/**
 * Generates metadata for each blog post page
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 * @param params - Object containing slug parameter
 * @param searchParams - Search parameters from the URL
 * @returns Metadata object for the blog post
 */
export async function generateMetadata({
	params,
}: {
	// Next 16 may pass `params` as a Promise; accept either and normalize
	params: { slug: string } | Promise<{ slug: string }>;
}) {
	const resolvedParams = (params as any)?.then ? await (params as any) : params;
	const post: PostType = postService.getPost(resolvedParams.slug) as PostType;

	const meta = {
		title: `${post.title} - ${settings.title}`,
		url: `${settings.siteUrl}/post/${resolvedParams.slug}/`,
	};

	return {
		title: meta.title,
		description: post.description,
		url: meta.url,
		openGraph: {
			title: meta.title,
			description: post.description,
			url: meta.url,
			images: [
				{
					url: `${settings.siteUrl}${post.image}`,
					alt: `Preview of ${post.title}`,
				},
			],
			type: 'article',
			publishedTime: post.created,
			modifiedTime: post.lastUpdated,
		},
		twitter: {
			title: meta.title,
			description: post.description,
			images: [
				{
					url: `${settings.siteUrl}${post.image}`,
					alt: `Preview of ${post.title}`,
				},
			],
		},
	};
}

interface PostProps {
	params: { slug: string };
}

/**
 * Post page component that displays a full blog post
 *
 * @param props - Component props containing slug parameter
 * @returns Rendered blog post page
 */
export default async function Post(props: PostProps) {
	const rawParams = props.params as
		| { slug: string }
		| Promise<{ slug: string }>;
	const resolved = (rawParams as any)?.then
		? await (rawParams as any)
		: rawParams;
	const slug = resolved.slug;
	const post: PostType = postService.getPost(slug) as PostType;

	// Handle author display with fallback to settings
	const displayAuthor = (post as any)?.author ?? settings.author;

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: post.title,
		description: post.description,
		image: `${settings.siteUrl}${post.image}`,
		author: {
			'@type': 'Person',
			name: displayAuthor,
		},
		datePublished: post.created,
		dateModified: post.lastUpdated || post.created,
		url: `${settings.siteUrl}/post/${slug}/`,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `${settings.siteUrl}/post/${slug}/`,
		},
	};

	return (
		<main className={styles.main}>
			{/* JSON-LD structured data for SEO */}
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<Hero>
				<h1 className={styles.title}>{post.title}</h1>
				<p className={styles.description}>{post.description}</p>
				<p className={styles.author}>
					by <Link href='/'>{displayAuthor}</Link>
				</p>
				<p className={styles.publishDate}>
					<PostDate created={post.created} lastUpdated={post.lastUpdated} />
				</p>
				<ListenButton text={post.content} />
			</Hero>

			<article className={styles.post}>
				<Markdown>{post.content}</Markdown>
				<ShareButtons title={post.title} />
			</article>

			{/* Related posts (SSG + client reveal) */}
			<RelatedPosts className={styles.related}>
				<RelatedPostList tags={post.tags} currentSlug={post.slug} />
			</RelatedPosts>
		</main>
	);
}
