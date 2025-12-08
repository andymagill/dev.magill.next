// Flat ESLint config that composes Next's flat config safely.
// Dependency updates moved ESLint to flat config, so avoid using
// legacy `extends` keys inside the flat config objects.
const nextConfig = require('eslint-config-next');

const base = Array.isArray(nextConfig) ? [...nextConfig] : [nextConfig];

module.exports = [
	// Include Next's exported flat config first
	...base,
	// Project-specific ignores
	{
		ignores: ['node_modules/**', '.next/**', 'out/**', 'coverage/**'],
	},
	// Files scope with language options; keep rules empty to inherit from Next
	{
		files: ['**/*.{js,cjs,mjs,ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2024,
			sourceType: 'module',
		},
		rules: {},
	},
];
