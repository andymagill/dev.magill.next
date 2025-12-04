/**
 * App Settings
 */
export const settings = {
	title: 'Andrew Magill, Web Engineer',
	description:
		'Andrew Magill&apos;s Web Development project portfolio and professional blog',
	author: 'Andrew Magill',
	siteUrl: process.env.__NEXT_PRIVATE_ORIGIN || 'https://magill.dev',
	defaultImage: '/images/blog/clarissa-watson-pencil-unsplash.jpg',
	siteThumb: '/images/magill-dev-thumb.jpg',
	// GTM ID moved to environment variable for security and flexibility.
	// Use `NEXT_PUBLIC_GTM_ID` to expose to client-side code in Next.js.
	gtmId: process.env.NEXT_PUBLIC_GTM_ID || undefined,
};
