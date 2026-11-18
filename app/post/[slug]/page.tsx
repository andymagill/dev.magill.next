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
import { notFound } from 'next/navigation';

import { settings } from '@/utils/settings.mjs';
import postService from '@/utils/PostService';
import { Post as PostType } from '@/utils/types';
import { PostNotFoundError } from '@/utils/errors';
import { resolveParams } from '@/utils/paramResolver';
import Hero from '@/app/components/global/Hero';
import PostDate from '@/app/components/blog/PostDate';
import ShareButtons from '@/app/components/blog/ShareButtons';
import ListenButton from '@/app/components/blog/ListenButton';
import RelatedPosts from '@/app/components/blog/RelatedPosts';
import RelatedPostList from '@/app/components/blog/RelatedPostList';
import JsonLd from '@/app/components/global/JsonLd';
import MarkdownBody from '@/app/components/blog/MarkdownBody';

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
	const resolvedParams = await resolveParams(params);

	try {
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
	} catch (error) {
		if (error instanceof PostNotFoundError) {
			notFound();
		}
		throw error;
	}
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
	const resolved = await resolveParams(props.params);
	const slug = resolved.slug;

	let post: PostType;
	try {
		post = postService.getPost(slug) as PostType;
	} catch (error) {
		if (error instanceof PostNotFoundError) {
			notFound();
		}
		throw error;
	}

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
		<main>
			{/* JSON-LD structured data for SEO */}
			<JsonLd data={jsonLd} />
			<Hero>
				<h1 className='text-center'>{post.title}</h1>
				<p className='text-center text-[1.11em]'>{post.description}</p>
				<p className='text-[0.9em] whitespace-nowrap'>
					by <Link href='/'>{displayAuthor}</Link>
				</p>
				<PostDate created={post.created} lastUpdated={post.lastUpdated} />

				<ListenButton text={post.content} />
			</Hero>

			{/* `.markdown` styles the generated post HTML (see app/styles/markdown.css) */}
			<article className='markdown mx-auto my-4 max-w-blog p-gap leading-[1.75em]'>
				<MarkdownBody content={post.content} />
				<ShareButtons title={post.title} />

				{/* Filed Under Tags */}
				<div className='flex flex-wrap items-center justify-center gap-4'>
					<label className='font-semibold whitespace-nowrap'>
						Filed under:
					</label>
					<ul className='m-0 flex list-none flex-wrap justify-center gap-3 p-0'>
						{post.tags.map((tag, index) => (
							<li
								key={index}
								className='rounded-[0.25rem] bg-[#80808033] px-2 py-[0.1rem] text-[0.9em]'
							>
								{tag}
							</li>
						))}
					</ul>
				</div>
			</article>

			{/* Related posts (SSG + client reveal) */}
			<RelatedPosts>
				<RelatedPostList tags={post.tags.join(', ')} currentSlug={post.slug} />
			</RelatedPosts>
		</main>
	);
}
