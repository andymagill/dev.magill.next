import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	PostService,
	FileSystemPostRepository,
	MatterContentParser,
} from './PostService';
import { Post, IPostRepository, IContentParser } from './types';
import { settings } from './settings.mjs';

// Create mock interfaces for our dependencies
class MockPostRepository implements IPostRepository {
	getPostContent = vi.fn();
	getAllPostSlugs = vi.fn();
}

class MockContentParser implements IContentParser {
	parseContent = vi.fn();
}

describe('PostService', () => {
	let repository: MockPostRepository;
	let parser: MockContentParser;
	let service: PostService;

	// Common test data
	const mockSlug = 'test-post';
	const mockContent = 'This is test content';
	const mockParsedContent = {
		content: 'This is the parsed content',
		data: {
			title: 'Test Post',
			description: 'This is a test post',
			image: '/images/test.jpg',
			tags: ['test', 'blog'],
			created: '2023-01-01',
			lastUpdated: '2023-01-02',
		},
	};

	// Set up fresh mocks before each test
	beforeEach(() => {
		repository = new MockPostRepository();
		parser = new MockContentParser();
		service = new PostService(repository, parser);
	});

	// Clean up mocks after each test
	afterEach(() => {
		vi.resetAllMocks();
	});

	describe('getPost', () => {
		it('should retrieve and transform a post correctly', () => {
			// Setup mocks
			repository.getPostContent.mockReturnValue(mockContent);
			parser.parseContent.mockReturnValue(mockParsedContent);

			// Execute
			const post = service.getPost(mockSlug);

			// Verify
			expect(repository.getPostContent).toHaveBeenCalledWith(mockSlug);
			expect(parser.parseContent).toHaveBeenCalledWith(mockContent);
			expect(post).toEqual({
				content: mockParsedContent.content,
				title: mockParsedContent.data.title,
				description: mockParsedContent.data.description,
				image: mockParsedContent.data.image,
				tags: mockParsedContent.data.tags,
				slug: mockSlug,
				url: `${settings.siteUrl}/post/${mockSlug}`,
				created: mockParsedContent.data.created,
				lastUpdated: mockParsedContent.data.lastUpdated,
			});
		});

		it('should handle missing optional fields', () => {
			// Setup mocks with minimal data
			const minimalParsedContent = {
				content: 'Minimal content',
				data: {
					title: 'Minimal Post',
					created: '2023-01-01',
					// No description, image, tags, or lastUpdated
				},
			};

			repository.getPostContent.mockReturnValue(mockContent);
			parser.parseContent.mockReturnValue(minimalParsedContent);

			// Execute
			const post = service.getPost(mockSlug);

			// Verify defaults are applied
			expect(post).toEqual({
				content: minimalParsedContent.content,
				title: minimalParsedContent.data.title,
				description: '',
				image: '',
				tags: [],
				slug: mockSlug,
				url: `${settings.siteUrl}/post/${mockSlug}`,
				created: minimalParsedContent.data.created,
				lastUpdated: minimalParsedContent.data.created, // Should default to created date
			});
		});
	});

	describe('getSlugs', () => {
		it('should return all slugs when no tag is provided', () => {
			// Setup
			const mockSlugs = ['post-1', 'post-2', 'post-3'];
			repository.getAllPostSlugs.mockReturnValue(mockSlugs);

			const now = Math.floor(Date.now() / 1000);
			const getPostSpy = vi.spyOn(service, 'getPost');
			getPostSpy.mockImplementation((slug) => {
				return {
					tags: ['test'],
					slug,
					created: String(now), // Published now
				} as Post;
			});

			// Execute
			const slugs = service.getSlugs();

			// Verify
			expect(repository.getAllPostSlugs).toHaveBeenCalled();
			expect(slugs).toEqual(mockSlugs);
		});

		it('should filter slugs by tag when a tag is provided', () => {
			// Setup
			const mockSlugs = ['post-1', 'post-2', 'post-3'];
			repository.getAllPostSlugs.mockReturnValue(mockSlugs);

			// Mock getPost to return different tags for different posts
			const now = Math.floor(Date.now() / 1000);
			const getPostSpy = vi.spyOn(service, 'getPost');

			getPostSpy.mockImplementation((slug) => {
				if (slug === 'post-1') {
					return {
						tags: ['react', 'javascript'],
						slug,
						created: String(now),
					} as Post;
				} else if (slug === 'post-2') {
					return {
						tags: ['typescript', 'testing'],
						slug,
						created: String(now),
					} as Post;
				} else {
					return {
						tags: ['react', 'testing'],
						slug,
						created: String(now),
					} as Post;
				}
			});

			// Execute - filter by 'react' tag
			const reactSlugs = service.getSlugs('react');

			// Verify
			expect(reactSlugs).toEqual(['post-1', 'post-3']);
			// getPost is called 3 times for publish filtering + 3 times for tag filtering = 6 times total
			expect(getPostSpy).toHaveBeenCalledTimes(6);

			// Reset and test another tag
			getPostSpy.mockClear();

			// Execute - filter by 'typescript' tag
			const typescriptSlugs = service.getSlugs('typescript');

			// Verify
			expect(typescriptSlugs).toEqual(['post-2']);
			// getPost is called 3 times for publish filtering + 3 times for tag filtering = 6 times total
			expect(getPostSpy).toHaveBeenCalledTimes(6);
		});

		it('should handle posts with no tags', () => {
			// Setup
			const mockSlugs = ['post-1', 'post-2'];
			repository.getAllPostSlugs.mockReturnValue(mockSlugs);

			// Mock getPost to return a post with no tags
			const now = Math.floor(Date.now() / 1000);
			const getPostSpy = vi.spyOn(service, 'getPost');
			getPostSpy.mockImplementation((slug) => {
				if (slug === 'post-1') {
					return {
						content: mockParsedContent.content,
						title: mockParsedContent.data.title,
						description: mockParsedContent.data.description,
						image: mockParsedContent.data.image,
						tags: [],
						slug,
						url: `${settings.siteUrl}/${slug}`,
						created: String(now),
						lastUpdated: mockParsedContent.data.lastUpdated,
					} as Post; // No tags
				} else {
					return {
						content: mockParsedContent.content,
						title: mockParsedContent.data.title,
						description: mockParsedContent.data.description,
						image: mockParsedContent.data.image,
						tags: ['typescript'],
						slug,
						url: `${settings.siteUrl}/${slug}`,
						created: String(now),
						lastUpdated: mockParsedContent.data.lastUpdated,
					} as Post;
				}
			});

			// Execute - filter by any tag
			const typescriptSlugs = service.getSlugs('typescript');

			// Verify - should only include post-2
			expect(typescriptSlugs).toEqual(['post-2']);
		});
	});

	describe('getPosts', () => {
		it('should return posts for provided slugs', () => {
			// Setup
			const providedSlugs = ['post-1', 'post-2'];

			// Mock getPost to return different posts
			const getPostSpy = vi.spyOn(service, 'getPost');
			getPostSpy.mockImplementation((slug) => {
				return {
					content: `Content for ${slug}`,
					title: `Title for ${slug}`,
					slug,
				} as Post;
			});

			// Execute
			const posts = service.getPosts(providedSlugs);

			// Verify
			expect(posts.length).toBe(2);
			expect(posts[0].slug).toBe('post-1');
			expect(posts[1].slug).toBe('post-2');
			expect(getPostSpy).toHaveBeenCalledWith('post-1');
			expect(getPostSpy).toHaveBeenCalledWith('post-2');
		});

		it('should get all posts when no slugs are provided', () => {
			// Setup
			const mockSlugs = ['post-1', 'post-2', 'post-3'];

			// Mock getSlugs to return all slugs
			const getSlugsSpy = vi
				.spyOn(service, 'getSlugs')
				.mockReturnValue(mockSlugs);

			// Mock getPost for each slug
			const getPostSpy = vi.spyOn(service, 'getPost');
			getPostSpy.mockImplementation((slug) => {
				return {
					content: `Content for ${slug}`,
					title: `Title for ${slug}`,
					slug,
				} as Post;
			});

			// Execute - no slugs provided
			const posts = service.getPosts();

			// Verify
			expect(getSlugsSpy).toHaveBeenCalled();
			expect(posts.length).toBe(3);
			expect(posts[0].slug).toBe('post-1');
			expect(posts[1].slug).toBe('post-2');
			expect(posts[2].slug).toBe('post-3');
		});
	});

	// Integration tests with actual implementations
	describe('Integration with actual implementations', () => {
		it('should correctly instantiate with FileSystemPostRepository and MatterContentParser', () => {
			// This test ensures the exported default instance is correctly constructed
			const fileSystemRepo = new FileSystemPostRepository('test-path');
			const matterParser = new MatterContentParser();

			expect(() => new PostService(fileSystemRepo, matterParser)).not.toThrow();
		});
	});

	describe('Publication date filtering', () => {
		it('should filter out future-dated posts in getSlugs()', () => {
			// Setup
			const mockSlugs = ['published-post', 'future-post'];
			repository.getAllPostSlugs.mockReturnValue(mockSlugs);

			const now = Date.now();
			const oneHourFromNow = Math.floor((now + 3600000) / 1000); // Unix timestamp in seconds
			const oneHourAgo = Math.floor((now - 3600000) / 1000);

			const getPostSpy = vi.spyOn(service, 'getPost');
			getPostSpy.mockImplementation((slug) => {
				if (slug === 'published-post') {
					return {
						content: mockParsedContent.content,
						title: mockParsedContent.data.title,
						description: mockParsedContent.data.description,
						image: mockParsedContent.data.image,
						tags: mockParsedContent.data.tags,
						slug,
						url: `${settings.siteUrl}/${slug}`,
						created: String(oneHourAgo), // Published in the past
						lastUpdated: mockParsedContent.data.lastUpdated,
					} as Post;
				} else {
					return {
						content: mockParsedContent.content,
						title: mockParsedContent.data.title,
						description: mockParsedContent.data.description,
						image: mockParsedContent.data.image,
						tags: mockParsedContent.data.tags,
						slug,
						url: `${settings.siteUrl}/${slug}`,
						created: String(oneHourFromNow), // Scheduled for the future
						lastUpdated: mockParsedContent.data.lastUpdated,
					} as Post;
				}
			});

			// Execute
			const slugs = service.getSlugs();

			// Verify - only the published post should be included
			expect(slugs).toEqual(['published-post']);
			expect(slugs).not.toContain('future-post');
		});

		it('should filter out future-dated posts when filtering by tag', () => {
			// Setup
			const mockSlugs = ['published-post', 'future-post', 'published-post-2'];
			repository.getAllPostSlugs.mockReturnValue(mockSlugs);

			const now = Date.now();
			const oneHourFromNow = Math.floor((now + 3600000) / 1000);
			const oneHourAgo = Math.floor((now - 3600000) / 1000);

			const getPostSpy = vi.spyOn(service, 'getPost');
			getPostSpy.mockImplementation((slug) => {
				if (slug === 'published-post') {
					return {
						tags: ['react', 'javascript'],
						slug,
						created: String(oneHourAgo),
					} as Post;
				} else if (slug === 'future-post') {
					return {
						tags: ['react', 'javascript'],
						slug,
						created: String(oneHourFromNow),
					} as Post;
				} else {
					return {
						tags: ['typescript'],
						slug,
						created: String(oneHourAgo),
					} as Post;
				}
			});

			// Execute - filter by 'react' tag
			const slugs = service.getSlugs('react');

			// Verify - only the published post with 'react' tag should be included
			expect(slugs).toEqual(['published-post']);
			expect(slugs).not.toContain('future-post');
		});

		it('should include posts with created date equal to or earlier than now', () => {
			// Setup
			const mockSlugs = ['just-now-post', 'past-post'];
			repository.getAllPostSlugs.mockReturnValue(mockSlugs);

			const now = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
			const oneHourAgo = now - 3600;

			const getPostSpy = vi.spyOn(service, 'getPost');
			getPostSpy.mockImplementation((slug) => {
				if (slug === 'just-now-post') {
					return {
						content: mockParsedContent.content,
						title: mockParsedContent.data.title,
						description: mockParsedContent.data.description,
						image: mockParsedContent.data.image,
						tags: mockParsedContent.data.tags,
						slug,
						url: `${settings.siteUrl}/${slug}`,
						created: String(now), // Created exactly now
						lastUpdated: mockParsedContent.data.lastUpdated,
					} as Post;
				} else {
					return {
						content: mockParsedContent.content,
						title: mockParsedContent.data.title,
						description: mockParsedContent.data.description,
						image: mockParsedContent.data.image,
						tags: mockParsedContent.data.tags,
						slug,
						url: `${settings.siteUrl}/${slug}`,
						created: String(oneHourAgo), // Created in the past
						lastUpdated: mockParsedContent.data.lastUpdated,
					} as Post;
				}
			});

			// Execute
			const slugs = service.getSlugs();

			// Verify - both posts should be included
			expect(slugs).toContain('just-now-post');
			expect(slugs).toContain('past-post');
			expect(slugs.length).toBe(2);
		});
	});
});
