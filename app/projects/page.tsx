/**
 * Projects Page
 *
 */
import type { Metadata } from 'next';

import { settings } from '@/utils/settings.mjs';
import Hero from '@/app/components/global/Hero';
import ProjectListContainer from '@/app/components/projects/ProjectListContainer';
import JsonLd from '@/app/components/global/JsonLd';

const meta = {
	title: 'Projects & Case Studies - ' + settings.title,
	description:
		'Integration and implementation case studies by Andrew Magill: the problem, the approach, and the outcome.',
	url: `${settings.siteUrl}/projects/`,
	image: settings.siteThumb,
};

export const metadata: Metadata = {
	title: meta.title,
	description: meta.description,
	openGraph: {
		title: meta.title,
		description: meta.description,
		type: 'website',
		url: meta.url,
		images: [
			{
				url: settings.siteUrl + settings.siteThumb,
				alt: 'Preview of ' + meta.title,
			},
		],
	},
	twitter: {
		title: meta.title,
		description: meta.description,
		images: [
			{
				url: settings.siteUrl + settings.siteThumb,
				alt: 'Preview of ' + meta.title,
			},
		],
	},
};

export default function Projects() {
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: meta.title,
		description: meta.description,
		url: meta.url,
	};
	return (
		<main>
			{/* JSON-LD structured data for SEO */}
			<JsonLd data={jsonLd} />

			<div>
				<Hero>
					<h1>Projects & Case Studies</h1>
					<p>
						Client platforms framed by the business problem, the integration
						approach, and the operational outcome.
					</p>
				</Hero>

				{/* Projects */}
				<section className='mt-gutter'>
					<div className='p-gap'>
						<ProjectListContainer />
					</div>
				</section>

				{/* Archive */}
				<section className='mx-auto my-gutter pt-gutter'>
					<div>
						<h2 className='mx-auto text-center'>Project Archive</h2>
						<p className='mx-auto mb-[calc(var(--gutter)*2)] text-center'>
							Earlier marketing sites, brand launches, and design work.
						</p>
						<ProjectListContainer file='-archive' variant='archive' />
					</div>
				</section>
			</div>
		</main>
	);
}
