/**
 * Vitest test suite for the Post page component.
 * Mocks postService, Hero, PostDate, ShareButtons, Markdown, and next/link.
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock postService
vi.mock('@/utils/PostService', () => ({
	default: {
		getPost: vi.fn(),
		getSlugs: vi.fn(),
		getPosts: vi.fn(),
	},
}));

// Mock Hero component
vi.mock('@/app/components/global/Hero', () => ({
	default: ({ children }: { children: React.ReactNode }) => (
		<div data-testid='hero'>{children}</div>
	),
}));

// Mock PostDate component
vi.mock('@/app/components/blog/PostDate', () => ({
	default: ({
		created,
		lastUpdated,
	}: {
		created: string;
		lastUpdated: string;
	}) => (
		<span data-testid='post-date'>
			{created} / {lastUpdated}
		</span>
	),
}));

// Mock ShareButtons component
vi.mock('@/app/components/blog/ShareButtons', () => ({
	default: ({ title }: { title: string }) => (
		<div data-testid='share-buttons'>Share: {title}</div>
	),
}));

// Mock Markdown component
vi.mock('markdown-to-jsx', () => ({
	__esModule: true,
	default: ({ children }: { children: React.ReactNode }) => (
		<div data-testid='markdown'>{children}</div>
	),
}));

// Mock next/link
vi.mock('next/link', () => ({
	__esModule: true,
	default: ({
		children,
		href,
	}: {
		children: React.ReactNode;
		href: string;
	}) => (
		<a href={href} data-testid='next-link'>
			{children}
		</a>
	),
}));

// Import the Post page (default export)
import Post from './page';
import postService from '@/utils/PostService';

const mockPost = {
	title: 'Test Post',
	description: 'Test Description',
	content: 'Test Content',
	image: '/images/test.jpg',
	tags: ['tag1', 'tag2'],
	slug: 'test-post',
	url: 'http://localhost/post/test-post',
	created: '2023-01-01',
	lastUpdated: '2023-01-02',
	author: 'Test Author',
};

describe('Post page', () => {
	beforeEach(() => {
		vi.mocked(postService.getPost).mockReturnValue(mockPost);
		vi.mocked(postService.getPosts).mockReturnValue([mockPost]);
	});

	it('renders post details and content', async () => {
		// The Post component is async
		render(await Post({ params: { slug: 'test-post' } }));

		// Title, description, author
		expect(screen.getByText('Test Post')).toBeInTheDocument();
		expect(screen.getByText('Test Description')).toBeInTheDocument();
		expect(screen.getByText('by')).toBeInTheDocument();
		expect(screen.getByText('Test Author')).toBeInTheDocument();

		// Publish date
		expect(screen.getByTestId('post-date')).toHaveTextContent(
			'2023-01-01 / 2023-01-02'
		);

		// Markdown content
		expect(screen.getByTestId('markdown')).toHaveTextContent('Test Content');

		// Share buttons
		expect(screen.getByTestId('share-buttons')).toHaveTextContent(
			'Share: Test Post'
		);
	});
});
