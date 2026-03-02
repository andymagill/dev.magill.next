/**
 * Vitest test suite for the CodeBlock component.
 * @vitest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock highlight.js core and language modules to keep tests fast and isolated
vi.mock('highlight.js/lib/core', () => ({
	default: {
		getLanguage: vi.fn().mockReturnValue(null),
		registerLanguage: vi.fn(),
		highlight: vi
			.fn()
			.mockReturnValue({ value: '<span class="hljs-keyword">const</span>' }),
	},
}));

vi.mock('highlight.js/lib/languages/typescript', () => ({
	default: {},
}));

vi.mock('highlight.js/lib/languages/javascript', () => ({
	default: {},
}));

vi.mock('highlight.js/lib/languages/json', () => ({
	default: {},
}));

vi.mock('highlight.js/lib/languages/xml', () => ({
	default: {},
}));

vi.mock('highlight.js/lib/languages/css', () => ({
	default: {},
}));

vi.mock('highlight.js/lib/languages/scss', () => ({
	default: {},
}));

vi.mock('highlight.js/lib/languages/bash', () => ({
	default: {},
}));

import CodeBlock from './CodeBlock';
import hljs from 'highlight.js/lib/core';

describe('CodeBlock', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(hljs.getLanguage).mockReturnValue(null);
		vi.mocked(hljs.highlight).mockReturnValue({
			value: '<span class="hljs-keyword">const</span>',
		} as any);
	});

	it('renders plain code without a language class', () => {
		render(<CodeBlock>let x = 1;</CodeBlock>);
		expect(screen.getByText('let x = 1;')).toBeInTheDocument();
	});

	it('initially renders children as plain text before highlighting', () => {
		render(<CodeBlock className='lang-tsx'>const x = 1;</CodeBlock>);
		// Before the async effect resolves, raw children should be visible
		expect(screen.getByText('const x = 1;')).toBeInTheDocument();
	});

	it('applies highlighted HTML after effect runs for a supported language', async () => {
		render(<CodeBlock className='lang-tsx'>const x = 1;</CodeBlock>);
		await waitFor(() => {
			expect(hljs.highlight).toHaveBeenCalledWith('const x = 1;', {
				language: 'tsx',
			});
		});
		const code = document.querySelector('code');
		expect(code?.innerHTML).toContain('hljs-keyword');
	});

	it('registers the language when not already registered', async () => {
		vi.mocked(hljs.getLanguage).mockReturnValue(null);
		render(<CodeBlock className='lang-ts'>type X = string;</CodeBlock>);
		await waitFor(() => {
			expect(hljs.registerLanguage).toHaveBeenCalledWith('ts', expect.any(Object));
		});
	});

	it('skips registration when language is already registered', async () => {
		vi.mocked(hljs.getLanguage).mockReturnValue({} as any);
		render(<CodeBlock className='lang-json'>{'{ }'}</CodeBlock>);
		await waitFor(() => {
			expect(hljs.highlight).toHaveBeenCalled();
		});
		expect(hljs.registerLanguage).not.toHaveBeenCalled();
	});

	it('does not highlight for an unsupported language', async () => {
		render(<CodeBlock className='lang-ruby'>{'puts "hello"'}</CodeBlock>);
		// No highlight call since "ruby" is not in the supported language map
		await new Promise((r) => setTimeout(r, 50));
		expect(hljs.highlight).not.toHaveBeenCalled();
		expect(screen.getByText('puts "hello"')).toBeInTheDocument();
	});

	it('forwards className to the code element', () => {
		render(<CodeBlock className='lang-css'>{'body { color: red; }'}</CodeBlock>);
		const code = document.querySelector('code');
		expect(code).toHaveClass('lang-css');
	});
});
