import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { Post as PostType, type PostListVariant } from '@/utils/types';

interface PostItemProps {
	post: PostType;
	variant?: PostListVariant;
}

const PostItem: React.FC<PostItemProps> = ({ post, variant = 'default' }) => {
	const tags = Array.isArray(post.tags) ? post.tags : [post.tags]; // Convert tags to an array
	const compact = variant === 'compact';

	return (
		<div className={clsx(compact && 'w-full xs:w-[33.3%]')}>
			<Link
				href={`/post/${post.slug}`}
				className={clsx(
					'group flex flex-col gap-[4%] text-inherit no-underline xs:items-start',
					!compact && 'xs:flex-row'
				)}
			>
				<span className='basis-[33%] overflow-y-hidden'>
					<Image
						src={post.image}
						alt={post.title}
						width={320}
						height={180}
						className='aspect-video h-auto w-full border border-line transition-[border-color] duration-300 ease-[ease] group-hover:border-foreground'
					/>
				</span>

				<span
					className={clsx('basis-[67%] py-4', compact ? 'w-full' : 'xs:py-0')}
				>
					<h3 className='group-hover:underline'>{post.title}</h3>
					<ul
						className={clsx('m-0 max-h-8 overflow-hidden', compact && 'hidden')}
					>
						{/* TODO: Change tags into buttons linking to the blog */}
						{tags.map((tag, index) => (
							<li
								key={index}
								className='inline-block list-none bg-[#80808033] px-1 py-[0.1rem] text-[0.75em] leading-4 not-first:ml-[0.2rem] not-last:mr-[0.2rem]'
							>
								{tag}
							</li>
						))}
					</ul>
					<p>{post.description}</p>
				</span>
			</Link>
		</div>
	);
};

export default PostItem;
