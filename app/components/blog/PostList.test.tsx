/**
 * Vitest test suite for the PostList component.
 * Uses React Testing Library and mocks PostService and PostItem for isolated testing.
 */

/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PostList from './PostList';
import postService from '@/utils/PostService';
import { Post as PostType } from '@/utils/types';

// Mock PostService
vi.mock('@/utils/PostService', () => ({
	default: {
		getSlugs: vi.fn(),
		getPost: vi.fn(),
	},
}));

// Mock the PostItem component
vi.mock('./PostItem', () => ({
	default: ({ post }: { post: any }) => (
		<div data-testid='post-item'>{post.title}</div>
	),
}));

describe('PostList', () => {
	const mockPosts: PostType[] = [
		{
			title: 'Post 1',
			description: 'Description 1',
			content: 'Content 1',
			image: '/images/post1.jpg',
		tags: ['tag1', 'tag2'],
			slug: 'post-1',
			url: 'http://localhost/post/post-1',
			created: '2023-01-01',
			lastUpdated: '2023-01-02',
		},
		{
			title: 'Post 2',
			description: 'Description 2',
			content: 'Content 2',
			image: '/images/post2.jpg',
		tags: ['tag2', 'tag3'],
			slug: 'post-2',
			url: 'http://localhost/post/post-2',
			created: '2023-01-03',
			lastUpdated: '2023-01-04',
		},
		{
			title: 'Post 3',
			description: 'Description 3',
			content: 'Content 3',
			image: '/images/post3.jpg',
		tags: ['tag1', 'tag3'],
			slug: 'post-3',
			url: 'http://localhost/post/post-3',
			created: '2023-01-05',
			lastUpdated: '2023-01-06',
		},
	];

	beforeEach(() => {
		vi.mocked(postService.getSlugs).mockImplementation((tag) => {
			if (tag) {
				return mockPosts
					.filter((post) => post.tags.includes(tag))
					.map((post) => post.slug);
			}
			return mockPosts.map((post) => post.slug);
		});

		vi.mocked(postService.getPost).mockImplementation((slug) => {
			return mockPosts.find((post) => post.slug === slug) as PostType;
		});
	});

	it('renders filtered posts when a tag is provided', async () => {
		const tag = 'tag1';
		const maxPosts = 0;

		// Render the component
		const { container } = await render(
			<PostList tag={tag} maxPosts={maxPosts} />
		);

		// Wait for the component to resolve and update the DOM
		await screen.findAllByTestId('post-item');

		// Assert the rendered output
		const postItems = container.querySelectorAll('[data-testid="post-item"]');
		expect(postItems).toHaveLength(2);
		expect(postItems[0]).toHaveTextContent('Post 3');
		expect(postItems[1]).toHaveTextContent('Post 1');
	});

	it('limits the number of posts when maxPosts is provided', async () => {
		const tag = '';
		const maxPosts = 2;

		// Render the component
		const { container } = await render(
			<PostList tag={tag} maxPosts={maxPosts} />
		);

		// Wait for the component to resolve and update the DOM
		await screen.findAllByTestId('post-item');

		// Assert the rendered output
		const postItems = container.querySelectorAll('[data-testid="post-item"]');
		expect(postItems).toHaveLength(2);
		expect(postItems[0]).toHaveTextContent('Post 3');
		expect(postItems[1]).toHaveTextContent('Post 2');
	});

	it('applies both tag filtering and maxPosts limit', async () => {
		const tag = 'tag2';
		const maxPosts = 1;

		// Render the component
		const { container } = await render(
			<PostList tag={tag} maxPosts={maxPosts} />
		);

		// Wait for the component to resolve and update the DOM
		await screen.findAllByTestId('post-item');

		// Assert the rendered output
		const postItems = container.querySelectorAll('[data-testid="post-item"]');
		expect(postItems).toHaveLength(1);
		expect(postItems[0]).toHaveTextContent('Post 2');
	});
});
