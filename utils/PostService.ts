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

		if (tag) {
			const normalizedTag = tag.toLowerCase().trim();
			return slugs.filter((slug) => {
				const { tags } = this.getPost(slug);
				return tags.some((t) => t.toLowerCase().trim() === normalizedTag);
			});
		}

		return slugs;
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
