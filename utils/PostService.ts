import { Post, IPostRepository, IContentParser, IPostService } from './types';
import { settings } from './settings.mjs';
import { FileSystemPostRepository } from './FileSystemPostRepository';
import { MatterContentParser } from './MatterContentParser';

// Path configuration
const BLOG_PATH = 'content/blog';

export class PostService implements IPostService {
	private postCache: Map<string, Post> = new Map();

	constructor(
		private repository: IPostRepository,
		private parser: IContentParser
	) {}

	/**
	 * Check if a post is published (created date is in the past or present)
	 * @param post - The post to check
	 * @returns true if the post should be published, false if it's scheduled for the future
	 */
	private isPublished(post: Post): boolean {
		const created = post.created;

		// Try to parse as Unix timestamp (number as string)
		const timestamp = parseInt(created, 10);
		if (!isNaN(timestamp) && timestamp > 0) {
			// Assume it's a Unix timestamp in seconds if it's a valid positive number
			const createdTime = timestamp * 1000; // Convert to milliseconds
			return createdTime <= Date.now();
		}

		// Try to parse as ISO date string or other date formats
		const createdDate = new Date(created);
		if (!isNaN(createdDate.getTime())) {
			return createdDate.getTime() <= Date.now();
		}

		// If we can't parse the date, assume it's published
		return true;
	}

	getPost(slug: string): Post {
		// Return cached post if available
		if (this.postCache.has(slug)) {
			return this.postCache.get(slug)!;
		}

		const fileContent = this.repository.getPostContent(slug);
		const { content, data } = this.parser.parseContent(fileContent);

		const post: Post = {
			content,
			title: data.title,
			description: data.description || '',
			image: data.image || '',
			tags: Array.isArray(data.tags) ? data.tags : [],
			slug: slug,
			url: `${settings.siteUrl}/post/${slug}`,
			created: data.created,
			lastUpdated: data.lastUpdated || data.created,
		};

		// Cache the post before returning
		this.postCache.set(slug, post);
		return post;
	}

	getSlugs(tag = ''): string[] {
		const slugs = this.repository.getAllPostSlugs();

		// Filter to only published posts
		const publishedSlugs = slugs.filter((slug) => {
			const post = this.getPost(slug);
			return this.isPublished(post);
		});

		if (tag) {
			const normalizedTag = tag.toLowerCase().trim();
			return publishedSlugs.filter((slug) => {
				const { tags } = this.getPost(slug);
				return tags.some((t) => t.toLowerCase().trim() === normalizedTag);
			});
		}

		return publishedSlugs;
	}

	getPosts(slugs?: string[]): Post[] {
		const slugsToUse = slugs || this.getSlugs();
		return slugsToUse.map((slug) => this.getPost(slug));
	}
}

// Create and export the default instance
const repository = new FileSystemPostRepository(BLOG_PATH);
const parser = new MatterContentParser();
const postService = new PostService(repository, parser);
export default postService;

// Export implementation classes for testing and DI
export { FileSystemPostRepository, MatterContentParser };
