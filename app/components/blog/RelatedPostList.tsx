import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import postService from '@/utils/PostService';
import { Post as PostType } from '@/utils/types';

interface RelatedPostListProps {
	tags: string;
	currentSlug?: string;
	maxResults?: number;
}

/**
 * Server component: fetches posts at build time and renders list markup.
 */
export default function RelatedPostList({
	tags,
	currentSlug,
	maxResults = 4,
}: RelatedPostListProps) {
	if (!tags) return null;

	const inputTags = tags
		.split(',')
		.map((t) => t.trim().toLowerCase())
		.filter(Boolean);

	if (inputTags.length === 0) return null;

	// Fetch all posts and filter by tags
	const allPosts: PostType[] = postService.getPosts();

	const scored = allPosts
		.filter((p) => p.slug !== currentSlug)
		.map((p) => {
			const pTags = (p.tags || []).map((t) => t.toLowerCase()).filter(Boolean);
			const shared = pTags.filter((t) => inputTags.includes(t)).length;
			return { post: p, score: shared };
		})
		// sort by descending shared tags, then by title for deterministic order
		.sort(
			(a, b) => b.score - a.score || a.post.title.localeCompare(b.post.title)
		);

	const top = scored.slice(0, maxResults).map((s) => s.post);

	if (top.length === 0) return null;

	return (
		<ul className='m-0 flex list-none gap-6 p-0 max-xs:flex-col'>
			{top.map((p, i) => (
				<li
					// Hidden until the RelatedPosts `group` sets data-related-visible=1,
					// then revealed with a per-item staggered delay.
					className='group/item basis-1/4 translate-y-[10px] scale-[0.98] opacity-0 transition-[opacity,translate,scale] delay-(--reveal-delay) duration-[450ms] ease-[ease] [--reveal-delay:calc(var(--index,0)_*_150ms_+_1000ms)] group-data-[related-visible=1]:translate-y-0 group-data-[related-visible=1]:scale-100 group-data-[related-visible=1]:opacity-100 focus-within:-translate-y-1 hover:-translate-y-1 focus-visible:-translate-y-1 max-[880px]:basis-1/2 max-xs:basis-full'
					key={p.slug}
					style={{ ['--index' as any]: i } as React.CSSProperties}
				>
					<Link
						href={`/post/${p.slug}/`}
						className='group/link flex flex-col items-start gap-3 text-inherit no-underline outline-none max-xs:flex-row max-xs:*:basis-1/2'
					>
						<div>
							<Image
								src={p.image || '/images/magill-dev-thumb.jpg'}
								alt={`Preview of ${p.title}`}
								width={72}
								height={72}
								className='block aspect-video h-auto w-full border-[1.5px] border-transparent object-cover transition-[scale,border-color] duration-200 ease-[ease] group-focus-within/item:scale-[1.04] group-focus-within/item:border-foreground group-hover/item:scale-[1.04] group-hover/item:border-foreground group-focus/link:scale-[1.04] group-focus/link:border-foreground'
							/>
						</div>
						<div>
							<h3 className='mb-1 text-[0.88rem] transition-[color,text-decoration] duration-[160ms] group-focus-within/item:underline group-hover/link:underline group-focus/link:underline'>
								{p.title}
							</h3>
						</div>
					</Link>
				</li>
			))}
		</ul>
	);
}
