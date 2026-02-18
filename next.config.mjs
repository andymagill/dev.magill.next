// Next.js configuration file.
// Integrates @next/bundle-analyzer for bundle size analysis and configures static export for production builds.

import createBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = createBundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
	images: { unoptimized: true },
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production'
			? { exclude: ['error'] }
			: false,
	},
};

export default withBundleAnalyzer(nextConfig);
