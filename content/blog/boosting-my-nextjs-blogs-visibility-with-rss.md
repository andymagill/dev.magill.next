---
title: Boosting My NextJS Blog’s Visibility with RSS
description: Let's explore how RSS can boost reach and discoverability in modern blogging as I share how I chose to integrate it into my static NextJS site.
image: /images/blog/mr-cup-fabien-barral-newspapers-unsplash.jpg
tags: RSS, SEO, NextJS
created: 1730496973
lastUpdated: 1750274194
---

RSS (Really Simple Syndication) is a useful tool for publishers, bloggers, and creators to boost their content's visibility. By adding RSS to my static NextJS blog, I’m hoping to expand my website's reach and make it easier to share my content with a broader audience. So, let’s explore the benefits of RSS and how I’ve sprinkled it on my blog like confetti at a party!

### Reach and Discoverability

RSS is the standard solution for content syndication on the web, allowing content to be shared across multiple websites and social media channels with minimal effort. I plan to use this capability to [cross-post my content](https://dev.to/help/writing-editing-scheduling#Cross-posting-Content) to the developer community site, [Dev.to](https://dev.to). This should be a good method to gain some exposure and boost my online presence—because let’s face it, shouting into the void isn’t exactly effective.

This is just one method to help prevent my content from getting lost in the digital abyss. Content aggregators can expose my posts to potential readers who probably will not stumble on my blog through other means. This gives my site extra exposure and potential backlinks that could boost SEO credibility. It’s a win-win!

### The Right Tools

I'll use the `rss` npm library to generate an RSS feed into my static NextJS blog. It's a straightforward library that simplifies the process and integrates seamlessly with my project. This way, I can focus on creating content instead of wrestling with XML schemas or other maintenance headaches.

Now, let’s get down to configuring that shiny new RSS feed of ours.

**Generate Feed Content**: To start, we can create a utility function to generate our feed content

```javascript
import { Rss } from 'rss';
import { settings } from '@/utils/settings.mjs'; // site settings
import postService from '@/utils/PostService'; // post service utility

const getPostFeed = (posts = []) => {
	// set feed values from site settings
	const feed = new Rss({
		title: settings.title,
		description: settings.description,
		site_url: settings.siteUrl,
		feed_url: `${settings.siteUrl}/feed/posts.xml`,
		language: 'en',
		date: new Date(),
	});

	// Get post data
	posts = posts.length > 0 ? posts : postService.getPosts();

	posts.map((post) => {
		// add post data to feed
		feed.item({
			title: post.title,
			guid: `${settings.siteUrl}/post/${post.slug}`,
			url: `${settings.siteUrl}/post/${post.slug}`,
			date: post.created,
			description: post.description,
			author: post.author || settings.author,
			categories: post.categories || [],
		});
	});

	return feed;
};
export { getPostFeed };
```

You can checkout my most recent version of that utility function in [this site's repo on GitHub](https://github.com/andymagill/dev.magill.next/blob/master/utils/feed.js). Someday I'll create a unit test for that function, pinky swear, but for now...

**Route the Feed**: Then, we can "feed" our blog data into an API route.tsx

```javascript
import { getPostFeed } from '@/utils/feed.mjs'; // the feed utility function from above

export async function GET() {
	const feed = getPostFeed();

	return new Response(JSON.stringify(feed.xml()), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
}
```

_Easy peasy lemon squeezy_, as the kids like to say. You can see my [latest implementation](https://github.com/andymagill/dev.magill.next/blob/master/app/feed/%5Btype%5D/route.tsx) of this includes a [dynamic route segment](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes) to serve different versions of the post feed.

**Build for Production**: Finally, lets run the build process to kick out the jams :

```bash
npm run build
```

New posts and content changes will now auto-magically show up in [the feed.xml](https://magill.dev/feed/posts.xml). Excelsior!

### Next.js Dynamic Routing for RSS Feeds

Let’s see how the RSS feed is actually served in my Next.js app, using a dynamic API route. Here’s a simplified version of my `app/feed/[type]/route.tsx` file:

```typescript
import { NextResponse } from 'next/server';
import postService from '@/utils/PostService';
import { getPostFeed } from '@/utils/feed';

export const generateStaticParams = async (): Promise<{ type: string }[]> => {
	const params = ['posts.xml', 'posts.json'].map((type) => ({ type }));
	return params;
};

export async function GET(
	request: Request,
	{ params }: { params: { type: string } }
) {
	if (params.type === 'posts.xml') {
		// Serve up the RSS feed
		const feed = getPostFeed();
		return new Response(feed.xml(), {
			headers: {
				'Content-Type': 'application/rss+xml; charset=utf-8',
			},
		});
	} else if (params.type === 'posts.json') {
		// Serve up posts as JSON
		const posts = postService.getPosts();
		return new Response(JSON.stringify(posts), {
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		});
	} else {
		return new Response('Not Found', { status: 404 });
	}
}
```

This route handles requests for both `/feed/posts.xml` (RSS) and `/feed/posts.json` (raw article data). When a request is made, it generates the RSS feed using the utility function and returns it with the correct content type. This approach leverages Next.js’s file-based routing and makes it easy to add or modify feed formats in the future (_im looking at you emerging AI protocols_).

## The Closing Tag

So, I’ve finally implemented RSS in my NextJS blog—because who doesn’t want to dive into the exciting world of content syndication, _am I right?_ Using the `rss` library to generate the feed at build-time was fairly straight-forward. As I publish fresh content, fingers crossed that this setup will help me reach an audience without resorting to begging or spamming.

### Related Links

- [What is an RSS feed? ](https://www.digitaltrends.com/computing/what-is-an-rss-feed/) From DigitalTrends
- [How Do RSS Feeds Work?](https://rss.com/blog/how-do-rss-feeds-work/) from RSS.com
- [Why am I still recommending the RSS in 2024?](https://medium.com/@kezhang404/why-am-i-still-recommending-the-rss-in-2024-33e270010829) on Medium
