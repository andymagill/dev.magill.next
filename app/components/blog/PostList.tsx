// app/components/blog/PostList.tsx

import React from 'react';
import clsx from 'clsx';
import { Post as PostType, type PostListVariant } from '@/utils/types';
import { FC } from 'react';
import PostItem from './PostItem';
import postService from '@/utils/PostService';

interface PostListProps {
	tag?: string;
	maxPosts?: number;
	variant?: PostListVariant;
}

const PostList = ({
	tag = '',
	maxPosts = 0,
	variant = 'default',
}: PostListProps) => {
	const slugs = postService.getSlugs(tag);
	const postData: PostType[] = slugs.map((slug) => postService.getPost(slug));

	// Sort posts by created date (newest first)
	const sortedPosts = postData.sort((a, b) => {
		return new Date(b.created).getTime() - new Date(a.created).getTime();
	});

	// Limit the number of posts if maxPosts is provided
	const limitedPosts = maxPosts ? sortedPosts.slice(0, maxPosts) : sortedPosts;

	return (
		<div
			className={clsx(
				'mt-gap flex flex-col gap-gap',
				variant === 'compact' ? 'items-start xs:flex-row' : 'items-center'
			)}
		>
			{limitedPosts.map((post) => (
				<PostItem key={post.slug} post={post} variant={variant} />
			))}
		</div>
	);
};

export default PostList;
