import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./vitest-setup.ts'],
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, '.'),
			'@/app': resolve(__dirname, 'app'),
			'@/utils': resolve(__dirname, 'utils'),
			'@/types': resolve(__dirname, 'types'),
			'@/content': resolve(__dirname, 'content'),
		},
	},
});
