/**
 * Privacy Policy Page
 */
import type { Metadata } from 'next';
import { settings } from '@/utils/settings.mjs';
import Hero from '@/app/components/global/Hero';
import styles from './page.module.scss';

const meta = {
	title: 'Privacy Policy - ' + settings.title,
	description: 'Privacy Policy for ' + settings.title,
	url: `${settings.siteUrl}/privacy/`,
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

export default function PrivacyPolicy() {
	return (
		<main className={styles.main}>
			<Hero>
				<h1>Privacy Policy</h1>
				<p>How we handle your information and protect your privacy.</p>
			</Hero>

			<section className={styles.content}>
				<div className={styles.wrapper}>
					<div className={styles.prose}>
						<h2>Information We Collect</h2>
						<p>
							This website may collect basic analytics information about your visit, 
							including pages viewed, time spent on the site, and general location data. 
							We do not collect personally identifiable information unless you explicitly 
							provide it through contact forms or other interactive features.
						</p>

						<h2>How We Use Information</h2>
						<p>
							Any information collected is used solely to improve the website experience 
							and understand how visitors interact with our content. We do not sell, 
							trade, or share your information with third parties.
						</p>

						<h2>Cookies and Tracking</h2>
						<p>
							This site may use cookies for analytics purposes and to enhance your 
							browsing experience. You can control cookie settings through your browser.
						</p>

						<h2>Contact</h2>
						<p>
							If you have any questions about this Privacy Policy, please contact us 
							through the information provided on this website.
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