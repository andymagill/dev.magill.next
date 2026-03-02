import fs from 'fs';
import path from 'path';
import { IPostRepository } from './types';
import { PostNotFoundError } from './errors';

export class FileSystemPostRepository implements IPostRepository {
	constructor(private basePath: string) {
		// Normalize path with forward slashes
		this.basePath = this.basePath.replace(/\\/g, '/');
	}

	getPostContent(slug: string): string {
		// Use forward slashes for consistent cross-platform paths
		const filePath = `${this.basePath}/${slug}.md`;
		try {
			return fs.readFileSync(filePath, 'utf8');
		} catch (error) {
			if (
				error instanceof Error &&
				'code' in error &&
				error.code === 'ENOENT'
			) {
				throw new PostNotFoundError(slug);
			}
			throw error;
		}
	}

	getAllPostSlugs(): string[] {
		const files = fs.readdirSync(this.basePath);
		return files
			.filter((file) => file.endsWith('.md'))
			.map((filename) => filename.replace('.md', ''));
	}
}
