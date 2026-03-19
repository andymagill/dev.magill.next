// Parses Markdown content with frontmatter using gray-matter.
// Returns validated post data for use in blog and content features.

import matter from 'gray-matter';
import { IContentParser, PostContent } from './types';

export class MatterContentParser implements IContentParser {
	parseContent(content: string): PostContent {
		const parsed = matter(content);
		const { data, content: parsedContent } = parsed;

		// Normalize line endings to LF. Some markdown renderers' fence
		// detection can break on CRLF (Windows) line endings after
		// dependency upgrades — normalize here so downstream rendering
		// (e.g., `markdown-to-jsx`) sees consistent newlines.
		const normalizedContent = parsedContent
			.replace(/\r\n/g, '\n')
			.replace(/\r/g, '\n');

		// Ensure required properties are present or provide defaults
		// Normalize tags to always be an array
		const tags = data.tags
			? typeof data.tags === 'string'
				? data.tags
						.split(',')
						.map((tag: string) => tag.trim())
						.filter((tag: string) => tag.length > 0)
				: Array.isArray(data.tags)
					? data.tags
					: []
			: [];

		// Filter out undefined values to prevent RSC serialization errors
		// when frontmatter has empty properties (e.g., lastUpdated:)
		const filteredData = Object.fromEntries(
			Object.entries(data).filter(([, value]) => value !== undefined)
		);

		const validatedData = {
			title: filteredData.title || 'Untitled',
			created: filteredData.created || new Date().toISOString(),
			...filteredData,
			tags, // Override with the normalized array
		};

		return {
			content: normalizedContent,
			data: validatedData,
		};
	}
}
