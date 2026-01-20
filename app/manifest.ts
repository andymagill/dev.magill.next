export const dynamic = 'force-static'; // Force static generation

import type { MetadataRoute } from 'next';
import { settings } from '@/utils/settings.mjs';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: settings.title,
		short_name: settings.title,
		description: settings.description,
		start_url: '/',
		display: 'minimal-ui',
		background_color: '#ffffff',
		theme_color: '#42b01b',
		icons: [
			{
				src: '/favicon.ico',
				sizes: '48x48',
				type: 'image/x-icon',
			},
			{
				src: '/icon.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	};
}
