/**
 * Terms of Service Page
 */
import type { Metadata } from 'next';
import { settings } from '@/utils/settings.mjs';
import Hero from '@/app/components/global/Hero';
import styles from './page.module.scss';

const meta = {
	title: 'Terms of Service - ' + settings.title,
	description: 'Terms of Service for ' + settings.title,
	url: `${settings.siteUrl}/terms/`,
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

export default function TermsOfService() {
	return (
		<main className={styles.main}>
			<Hero>
				<h1>Terms of Service</h1>
				<p>Terms and conditions for using this website.</p>
			</Hero>

			<section className={styles.content}>
				<div className={styles.wrapper}>
					<div className={styles.prose}>
						<h2>Acceptance of Terms</h2>
						<p>
							By accessing and using this website, you accept and agree to be bound by 
							the terms and provision of this agreement.
						</p>

						<h2>Use License</h2>
						<p>
							Permission is granted to temporarily download one copy of the materials 
							on this website for personal, non-commercial transitory viewing only. 
							This is the grant of a license, not a transfer of title.
						</p>

						<h2>Disclaimer</h2>
						<p>
							The materials on this website are provided on an &apos;as is&apos; basis. 
							{settings.title} makes no warranties, expressed or implied, and hereby 
							disclaims and negates all other warranties including without limitation, 
							implied warranties or conditions of merchantability, fitness for a 
							particular purpose, or non-infringement of intellectual property or 
							other violation of rights.
						</p>

						<h2>Limitations</h2>
						<p>
							In no event shall {settings.title} or its suppliers be liable for any 
							damages (including, without limitation, damages for loss of data or 
							profit, or due to business interruption) arising out of the use or 
							inability to use the materials on this website.
						</p>

						<h2>Revisions</h2>
						<p>
							{settings.title} may revise these terms of service at any time without 
							notice. By using this website, you are agreeing to be bound by the 
							then current version of these terms of service.
						</p>

						<h2>Contact</h2>
						<p>
							If you have any questions about these Terms of Service, please contact 
							us through the information provided on this website.
						</p>

						<p className={styles.lastUpdated}>
							Last updated: {new Date().toLocaleDateString()}
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}