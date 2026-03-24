import React from 'react';
import { render, screen } from '@testing-library/react';
import RelatedPostList from './RelatedPostList';
import postService from '@/utils/PostService';
import { vi, describe, beforeEach, test, expect } from 'vitest';

vi.mock('@/utils/PostService', () => ({
	default: {
		getSlugs: vi.fn(),
		getPost: vi.fn(),
		getPosts: vi.fn(),
	},
}));

describe('RelatedPostList', () => {
	const posts = [
		{ title: 'A', slug: 'a', tags: ['tag1', 'tag2'], image: '/a.jpg' },
		{ title: 'B', slug: 'b', tags: ['tag2', 'tag3'], image: '/b.jpg' },
		{ title: 'C', slug: 'c', tags: ['tag1'], image: '/c.jpg' },
		{ title: 'D', slug: 'd', tags: [], image: '/d.jpg' },
	];

	beforeEach(() => {
		vi.mocked(postService.getPosts).mockImplementation(() => posts as any);
		vi.mocked(postService.getSlugs).mockImplementation(() =>
			posts.map((p) => p.slug)
		);
		vi.mocked(postService.getPost).mockImplementation(
			(slug) => posts.find((p) => p.slug === slug) as any
		);
	});

	test('returns null when no tags provided', () => {
		const { container } = render(<RelatedPostList tags={''} />);
		expect(container.firstChild).toBeNull();
	});

	test('filters out currentSlug and scores by shared tags and respects maxResults', () => {
		render(
			<RelatedPostList tags={'tag1,tag2'} currentSlug={'a'} maxResults={2} />
		);
		const items = screen.getAllByRole('listitem');
		// Expect two items (B and C) after excluding 'a', ordered by score then title (title ascending on tie)
		expect(items).toHaveLength(2);
		expect(items[0]).toHaveTextContent('B'); // title tie-breaker puts B before C
		expect(items[1]).toHaveTextContent('C');
	});

	test('renders fallback image when post image is missing', () => {
		const postsFallback = [
			{ title: 'One', slug: 'one', tags: ['a'], image: undefined },
		];
		vi.mocked(postService.getPosts).mockImplementation(
			() => postsFallback as any
		);
		vi.mocked(postService.getSlugs).mockImplementation(() =>
			postsFallback.map((p) => p.slug)
		);
		vi.mocked(postService.getPost).mockImplementation(
			(slug) => postsFallback.find((p) => p.slug === slug) as any
		);

		render(
			<RelatedPostList tags={'a'} currentSlug={undefined} maxResults={5} />
		);
		const imgs = screen.getAllByRole('img');
		// Should render an img; if component uses a fallback, it should be present
		expect(imgs.length).toBeGreaterThanOrEqual(1);
		const src = (imgs[0] as HTMLImageElement).src;
		expect(src.length).toBeGreaterThan(0);
	});
});
