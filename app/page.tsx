/**
 * Home Page
 *
 */

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import type { Metadata } from 'next';

import { settings } from '@/utils/settings.mjs';
import Hero from '@/app/components/global/Hero';
import Callout from '@/app/components/global/Callout';
import PostList from '@/app/components/blog/PostList';
import ProjectListContainer from '@/app/components/projects/ProjectListContainer';
import JsonLd from '@/app/components/global/JsonLd';

// Define the metadata for the page
export const metadata: Metadata = {
	title: settings.title,
	description: settings.description,
	openGraph: {
		title: settings.title,
		description: settings.description,
		type: 'website',
		images: [
			{
				url: settings.siteUrl + settings.siteThumb,
				alt: 'Preview of ' + settings.title,
			},
		],
	},
	twitter: {
		title: settings.title,
		description: settings.description,
		images: [
			{
				url: settings.siteUrl + settings.siteThumb,
				alt: 'Preview of ' + settings.title,
			},
		],
	},
};

export default function Home() {
	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: settings.title,
			description: settings.description,
			url: settings.siteUrl,
		},
		{
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: settings.author,
			url: settings.siteUrl,
			jobTitle: 'Web Solutions Engineer',
			sameAs: [
				'https://www.linkedin.com/in/andrew-magill',
				'https://github.com/andymagill',
			],
		},
	];

	return (
		<main className='min-h-0'>
			{/* JSON-LD structured data for SEO */}
			<JsonLd data={jsonLd} />
			<div className='m-auto'>
				<Hero layout='row'>
					{/* Portrait */}
					<div className='mx-auto max-w-[66%] self-start xs:w-[33%]'>
						{/* TODO: Create slideshow of Portraits  */}
						{/* TODO: Add intro video */}
						<Image
							src='/images/portrait-andrew-magill.jpg'
							alt={settings.title}
							className='h-auto w-full border-[3px] border-always-white'
							width={300}
							height={300}
						/>
					</div>

					{/* Homepage Intro */}
					<div className='basis-[67%] text-[clamp(1.5rem,2.5vw,2rem)]'>
						<h1>
							<strong>Hey there! I’m Andrew&nbsp;Magill.</strong>
							<br />
							I&apos;m a Software Developer with deep experience converting
							ambitious goals into scalable solutions.
						</h1>{' '}
						<p className='mt-6 mb-0 inline'>
							15+ years of hands-on implementation experience delivering
							exceptional outcomes across Ecommerce, Pharmaceutical Marketing,
							and B2B healthcare.
						</p>
						<div className='mt-6 flex flex-wrap gap-3'>
							<a
								href='https://calendar.google.com/calendar/appointments/schedules/AcZssZ1eVLAyEkJQ7H3o24pzhMevGobzhTexLeufmSBltUhQHxu49SAvt2Oog63LhckkwhbQYp8IiXOJ?gv=true'
								target='_blank'
								rel='noopener noreferrer'
								className='btn'
							>
								Book some time
							</a>
							<Link href='/projects' className='btn btn-outline'>
								See my work
							</Link>
						</div>
					</div>
				</Hero>

				{/* Key Skills */}
				<section className='mt-[8vmin]'>
					<div className='m-auto max-w-inner p-4'>
						<h2 className='text-center'>Core Capabilities</h2>
						<p className='text-center'>
							Here’s how I help teams and stakeholders turn ambitious technical
							requirements into production-ready systems.
						</p>
						<div className='mt-gap flex flex-col gap-gap xs:flex-row xs:*:grow xs:*:basis-0'>
							<Callout
								title='Engineering Architecture'
								description='I align cross-functional teams and business stakeholders to scope, architect, and deliver bespoke technical solutions. '
								icon='/images/icon-project.svg'
							/>

							<Callout
								title='Enterprise Integration'
								description='I build production-ready web platforms and complex third-party integrations that deliver outsized value. '
								icon='/images/icon-engineering.svg'
							/>

							<Callout
								title='Workflow Automation'
								description='I eliminate manual bottlenecks by connecting systems and automating workflows so teams can focus on growth. '
								icon='/images/icon-automation.svg'
							/>
						</div>
					</div>
				</section>

				{/* Featured Projects */}
				<section className='mt-[8vmin]'>
					<div className='mx-auto my-0 max-w-inner p-gap'>
						<h2 className='text-center'>Featured Case Studies</h2>
						<p className='text-center'>
							A look at how I solve complex technical and operational challenges
							in the wild.{' '}
						</p>
						<ProjectListContainer maxProjects={3} />
						<Link
							href='/projects'
							className='btn mx-auto mt-gap mb-0 block w-fit'
						>
							View All Projects
						</Link>
					</div>
				</section>

				{/* Recent Posts */}
				<section className='mt-[8vmin]'>
					<div className='mx-auto my-0 max-w-inner p-gap'>
						<h2 className='text-center'>Recent Writing</h2>
						<p className='text-center'>
							My thoughts on integrations, compliance, and engineering insights.
						</p>
						<PostList maxPosts={3} variant='compact' />
						<Link href='/blog' className='btn mx-auto mt-gap mb-0 block w-fit'>
							View All Posts
						</Link>
					</div>
				</section>
			</div>
		</main>
	);
}
