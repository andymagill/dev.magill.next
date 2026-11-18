'use client';

import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import type { ProjectCardVariant } from '@/utils/types';

interface ProjectCardProps {
	title: string;
	summary: string;
	description: string;
	image: string;
	tags: string[];
	onClick: () => void;
	variant?: ProjectCardVariant;
}

// Classes shared by every variant, plus per-variant additions.
// Variants never override each other, so no class-merging is needed.
const styles = {
	card: {
		base: 'relative z-0 flex cursor-pointer flex-col shadow-[0_2px_5px_rgba(0,0,0,0.25)] transition-[transform,box-shadow] duration-200 ease-[ease] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]',
		default:
			'glass min-w-[260px] basis-[calc(33.333%-var(--gap))] border border-line p-gap hover:-translate-y-[5px] max-[800px]:basis-[calc(50%-1rem)] max-xs:basis-full',
		archive: 'basis-[calc(50%-var(--gap))] sm:basis-[calc(16.67%-var(--gap))]',
	},
	imageWrap: {
		base: 'overflow-hidden shadow-[inset_0_0_3vmax_var(--backgroundToo)]',
		default: 'mb-[calc(var(--gap)/2)]',
		archive: '',
	},
	image: {
		base: 'relative -z-1 h-full w-full rounded-[4%] object-cover',
		default: '',
		archive: 'aspect-[5/4] object-top',
	},
} as const;

export default function ProjectCard({
	title,
	summary,
	image,
	onClick,
	variant = 'default',
}: ProjectCardProps) {
	return (
		<div
			className={clsx(styles.card.base, styles.card[variant])}
			onClick={onClick}
		>
			<div className={clsx(styles.imageWrap.base, styles.imageWrap[variant])}>
				<Image
					src={image}
					alt={title}
					width={285}
					height={285}
					className={clsx(styles.image.base, styles.image[variant])}
				/>
			</div>
			{/* Archive tiles are image-only; the title stays available via the image alt. */}
			{variant === 'default' && (
				<>
					<h3>{title}</h3>
					<p className='mb-4 text-[1rem]'>{summary}</p>
				</>
			)}
		</div>
	);
}
