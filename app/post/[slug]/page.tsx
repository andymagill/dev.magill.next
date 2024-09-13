import React from 'react';
import fs from 'fs';
import { notFound } from 'next/navigation';
import Markdown from 'markdown-to-jsx';
import getPostMetadata from '@/utils/metadata';
import Hero from '@/app/components/global/Hero';
import styles from './page.module.css';
import matter from 'gray-matter';

interface Post {
  title: string;
  description: string;
  content: string;
  image: string;
  tags: string;
}

function getPostContent(slug: string): Post {

  const file = 'content/blog/' + `${slug}.md`;
  let content;

  // If the file exists, read the file
  if (fs.existsSync(file)) {
    content = fs.readFileSync(file, 'utf8');
    console.log('File: "' + file + '" loaded.');
  }
  else {
    notFound();
  }

  const matterResult = matter(content);
  return {
    title: matterResult.data.title,
    description: matterResult.data.description,
    content: matterResult.content,
    image: matterResult.data.image,
    tags: matterResult.data.tags,
  } as Post;
}

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  const posts = getPostMetadata('content/blog');
  const params = posts.map((post) => ({ slug: post.slug }));
  return params;
};

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: any;
}): Promise<{ title: string }> {
  const id = params?.slug ? ' ⋅ ' + params?.slug : '';
  return {
    title: `${id.replaceAll('_', ' ')} - Andrew Magill's Developer Blog`,
  };
}

interface PostProps {
  params: { slug: string };
}

export default function Post(props: PostProps) {
  const slug = props.params.slug;
  const post = getPostContent(slug);

  return (
    <main>
      <Hero>
        <h1>{post.title} </h1>
      </Hero>

      <article className={styles.post}>
        <Markdown>{post.content}</Markdown>
      </article>
    </main>
  );
}
