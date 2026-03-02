import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import postService from '@/utils/PostService';
import { Post as PostType } from '@/utils/types';
import styles from './RelatedPostList.module.scss';

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
		<ul className={styles.list}>
			{top.map((p, i) => (
				<li
					className={styles.item}
					key={p.slug}
					style={{ ['--index' as any]: i } as React.CSSProperties}
				>
					<Link href={`/post/${p.slug}/`} className={styles.link}>
						<div className={styles.imageWrap}>
							<Image
								src={p.image || '/images/magill-dev-thumb.jpg'}
								alt={`Preview of ${p.title}`}
								width={72}
								height={72}
								className={styles.image}
							/>
						</div>
						<div className={styles.content}>
							<h3 className={styles.title}>{p.title}</h3>
						</div>
					</Link>
				</li>
			))}
		</ul>
	);
}
