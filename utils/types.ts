// Define the Post interface
export interface Post {
	title: string;
	description: string;
	content: string;
	image: string;
	tags: string[];
	slug: string;
	url: string;
	created: string;
	lastUpdated: string;
}

// Define the Project interface
export interface Project {
	title: string;
	summary: string;
	description: string;
	image: string;
	tags: string[];
}

export interface ProjectsData {
	projects: Project[];
}

// Improved props interface following Interface Segregation Principle
export interface ProjectListContainerProps {
	file?: string;
	maxProjects?: number;
}

// New interfaces for SOLID compliant post handling
export interface PostContent {
	content: string;
	data: {
		title: string;
		description?: string;
		image?: string;
		tags?: string[];
		created: string;
		lastUpdated?: string;
		[key: string]: any;
	};
}

export interface IContentParser {
	parseContent(content: string): PostContent;
}

export interface IPostRepository {
	getPostContent(slug: string): string;
	getAllPostSlugs(): string[];
}

export interface IPostService {
	getPost(slug: string): Post;
	getSlugs(tag?: string): string[];
	getPosts(slugs?: string[]): Post[];
}
