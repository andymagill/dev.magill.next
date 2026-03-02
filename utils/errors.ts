/**
 * Custom error types for the application
 */

/**
 * Thrown when a requested post is not found in the post repository
 */
export class PostNotFoundError extends Error {
	constructor(slug: string) {
		super(`Post not found: ${slug}`);
		this.name = 'PostNotFoundError';
	}
}
