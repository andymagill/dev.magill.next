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
import styles from './page.module.scss';

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
		<main className={`${styles.main} main`}>
			{/* JSON-LD structured data for SEO */}
			<JsonLd data={jsonLd} />
			<div className={`${styles.mainWrapper} mainWrapper`}>
				<Hero className='row'>
					{/* Portrait */}
					<div className={`${styles.portraitContainer} portraitContainer`}>
						{/* TODO: Create slideshow of Portraits  */}
						{/* TODO: Add intro video */}
						<Image
							src='/images/portrait-andrew-magill.jpg'
							alt={settings.title}
							className={`${styles.portrait} portrait`}
							width={300}
							height={300}
						/>
					</div>

					{/* Homepage Intro */}
					<div className={`${styles.homeIntro} homeIntro`}>
						<h1>
							<strong>Hey! I’m Andrew&nbsp;Magill,</strong>
							<br />a web engineer who builds complex systems from stakeholder
							discovery to production&nbsp;launch.
						</h1>{' '}
						<p>
							With 15+ years of hands-on implementation experience across
							Ecommerce, Pharmaceutical Marketing, and B2B healthcare, I
							untangle tricky requirements to deliver exceptional outcomes.
						</p>
						<div className={styles.ctaRow}>
							<a
								href='https://calendar.google.com/calendar/appointments/schedules/AcZssZ1eVLAyEkJQ7H3o24pzhMevGobzhTexLeufmSBltUhQHxu49SAvt2Oog63LhckkwhbQYp8IiXOJ?gv=true'
								target='_blank'
								rel='noopener noreferrer'
								className={styles.ctaPrimary}
							>
								Book some time
							</a>
							<Link href='/projects' className={styles.ctaSecondary}>
								See my work
							</Link>
						</div>
					</div>
				</Hero>

				{/* Key Skills */}
				<section className={`${styles.serviceList} serviceList`}>
					<div className={`${styles.wrapper} wrapper`}>
						<h2>Core Capabilities</h2>
						<p>
							Here’s how I help teams and stakeholders turn ambitious technical
							requirements into production-ready systems.
						</p>
						<div className={`${styles.calloutContainer} calloutContainer`}>
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
				<section className={`${styles.featuredProjects} featuredProjects`}>
					<div className={`${styles.wrapper} wrapper`}>
						<h2>Featured Case Studies</h2>
						<p>
							A look at how I solve complex technical and operational challenges
							in the wild.{' '}
						</p>
						<ProjectListContainer maxProjects={3} />
						<Link href='/projects' className={styles.viewAllButton}>
							View All Projects
						</Link>
					</div>
				</section>

				{/* Recent Posts */}
				<section className={`${styles.recentPosts} recentPosts`}>
					<div className={`${styles.wrapper} wrapper`}>
						<h2>Writing</h2>
						<p>
							Notes on integrations, compliance, and shipping AI-assisted code
							safely.
						</p>
						<PostList maxPosts={3} />
						<Link href='/blog' className={styles.viewAllButton}>
							View All Posts
						</Link>
					</div>
				</section>
			</div>
		</main>
	);
}
