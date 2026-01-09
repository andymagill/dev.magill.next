---
title: Let's Breakdown This Website's Tech Stack
description: Here I will ramble about the tools and technologies I used to build this website.
image: /images/blog/peter-pryharski-rusted-car-unsplash.jpg
tags: React, NextJS, JAMstack
created: 1729914553
lastUpdated:
---

When planning the implementation of [my new website](https://magill.dev/), I wanted something that could showcase my work experience in an impressive way. To accomplish this effectively, I selected a robust foundation of technologies designed to provide a platform that is fast (to build), easy (to publish) AND cheap (to host). Executing that plan produced [Magill.Dev](https://magill.dev) – a blend of modern frameworks, thoughtful design choices, and solutions to real-world development challenges. Let's take a deep dive into the tech stack:

## Stacking the Foundation

At the heart of this website lies a curated tech stack based on React and Next.js. React's component-based architecture is great for building a dynamic and interactive user interface. Next.js provided the backend and dev environment to build the site statically, which helps satisfy two of our initial requirements.

For styling, I opted for a combination of SASS and CSS Modules. SASS allowed me to write more maintainable stylesheets, while CSS Modules ensured that styles remained neatly scoped to specific components. To manage content, I chose [Markdown](https://magill.dev/simplified-content-management-with-markdown) for its simplicity and readability. This decision allowed me to focus on writing without getting bogged down in complex formatting.

## Summoning the Beast

Here are some of the challenges and problems I faced when building this website, and how I tackled them. From [handling SEO for AI crawlers](/post/ai-discoverability-structured-data-gives-rich-context-to-clueless-crawlers) to [persisting animation states](/post/persisting-animation-state-across-page-views-in-Reactjs), if you're diving into similar Next.js projects, you might find this useful:

### Dynamic Routes vs. Static Generation:

These two pillars of modern web development don't always play nice together. However, with the help of Next.js's generateStaticParams function, I managed to pre-render all my blog post pages at build time, making the website lightning fast.

```typescript
export const generateStaticParams = async () => {
	const posts = getSlugs();
	return posts.map((post) => ({ slug: post.slug }));
};
```

**More Details:**  
[Dynamic Routing](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes) in NextJS
[Deplyoing Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) in NextJS

### Async File Operations:

Synchronous file operations are too slow for a lot of scenarios, including Next.js static exports. Thankfully, switching to asynchronous operations with fs.promises saved the day.

```typescript
import { promises as fs } from 'fs';

async function getPostContent(slug: string) {
	const content = await fs.readFile(`content/blog/${slug}.md`, 'utf8');
	// Process content...
}
```

**More Details:**  
[How to Load Data from a File in Next.js](https://vercel.com/guides/loading-static-file-nextjs-api-route)

### TypeScript, My Frenemy:

This love-hate relationship involved wrestling with type mismatches. Being more explicit with my types (like the Post or Project interfaces) helped tame this beast:

```typescript
interface Post {
	title: string;
	description: string;
	content: string;
	image: string;
	tags: string[];
	created: string;
}
```

**More Details:**  
[TypeScript in 5 Minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

### Markdown Magic & Front Matter Hero:

Rendering Markdown content as HTML involved the awesome [markdown-to-jsx library](https://www.npmjs.com/package/markdown-to-jsx). Not only does this allow me to convert markdown to html auto-magically, it also allows me to insert react components and other JSX code into my blog articles. Extracting metadata from those Markdown files was made possible by the unsung hero, [gray-matter](https://www.npmjs.com/package/gray-matter).

```jsx
import matter from 'gray-matter';
import Markdown from 'markdown-to-jsx';
...
const { data, content } = matter(fileContents);
return <Markdown>{post.content}</Markdown>;

```

**More Details:**  
[Front-Matter Documentation](https://frontmatter.codes/docs)  
[Gettings Started with Markdown](https://www.markdownguide.org/getting-started/)

## Monumental Baby Steps

As I continue to develop this website, I have a handful of exciting ideas to improve it further. My highest priority is to regularly publish [interesting and informative blog content](https://magill.dev/blog). I also hope to expand the [project section](https://magill.dev/projects) of the site, showcasing more of my work in greater detail.

On the technical side, I'm looking to [enhance blogging functionality](https://github.com/andymagill/dev.magill.next/blob/master/ROADMAP.md) and UI. This might include features like improved search capabilities and tag-based filtering. For the project content, I'm exploring ways to create more engaging and dynamic presentations of my work.

Building this website has been an interesting journey. The power and flexibility of modern web development tools has enabled me to carefully tailor the development and editing experience. I'm curious where this site will take me, as I continue building it over the next few years.

### Related Links

- [Deploying Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports#configuration) from NextJS.org
- [TypeScript in 5 Minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) from TypeScriptLang.org
- [Introduction to Markdown](https://www.writethedocs.org/guide/writing/markdown/) from WriteTheDocs.Org
