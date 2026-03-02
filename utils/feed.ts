/**
 * Generates an RSS feed for blog posts using the 'rss' library.
 * This utility pulls post data and outputs a standards-compliant RSS XML feed for syndication.
 */

import Rss from 'rss';
import { settings } from '@/utils/settings.mjs';
import pkg from 'next/package.json';
import postService from '@/utils/PostService';
import { Post } from '@/utils/types';

/**
 * Generate RSS feed for blog posts
 * @param posts - Array of Post objects. If empty, all posts are fetched from postService
 * @returns Rss feed object
 */
const getPostFeed = (posts: Post[] = []): Rss => {
	// set feed values
	const feed = new Rss({
		title: settings.title,
		description: settings.description,
		site_url: settings.siteUrl,
		feed_url: `${settings.siteUrl}/feed/posts.xml`,
		language: 'en',
		copyright:
			'All rights reserved, ' + new Date().getFullYear() + ' ' + settings.title,
		pubDate: new Date(),
	});

	// get the post data
	const postsToFeed = posts.length > 0 ? posts : postService.getPosts();

	// add each post to the feed
	postsToFeed.forEach((post) => {
		feed.item({
			title: post.title,
			description: post.content,
			guid: `${settings.siteUrl}/post/${post.slug}`,
			url: `${settings.siteUrl}/post/${post.slug}`,
			date: post.created,
			author: settings.author,
			categories: post.tags,
		});
	});

	// return the feed
	return feed;
};

export { getPostFeed };
