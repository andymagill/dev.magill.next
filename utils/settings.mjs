/**
 * App Settings
 */
export const settings = {
	title: 'Andrew Magill, Solutions & Forward-Deployed Engineer',
	description:
		'Integration architecture, technical discovery, and implementation case studies from regulated B2B platforms.',
	author: 'Andrew Magill',
	siteUrl: process.env.__NEXT_PRIVATE_ORIGIN || 'https://magill.dev',
	defaultImage: '/images/blog/clarissa-watson-pencil-unsplash.jpg',
	siteThumb: '/images/magill-dev-thumb.jpg',
	// GTM ID moved to environment variable for security and flexibility.
	// Use `NEXT_PUBLIC_GTM_ID` to expose to client-side code in Next.js.
	gtmId: process.env.NEXT_PUBLIC_GTM_ID || undefined,
};
