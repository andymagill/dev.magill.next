/**
 * CodeBlock Component
 *
 * Client-side syntax highlighting for fenced code blocks in blog posts.
 * Lazily loads highlight.js per-language to keep the initial bundle small.
 * Used as a `code` override for markdown-to-jsx.
 *
 * @see https://highlightjs.org/
 * @see https://github.com/markdown-to-jsx/markdown-to-jsx#options
 */
'use client';

import React, { useEffect, useState } from 'react';

interface CodeBlockProps {
	className?: string;
	children?: React.ReactNode;
}

/**
 * Lazily returns the highlight.js language definition for the given language key.
 * Returns null when the language is not supported.
 */
async function loadLanguage(lang: string): Promise<{ default: any } | null> {
	const languages: Record<string, () => Promise<{ default: any }>> = {
		bash: () => import('highlight.js/lib/languages/bash'),
		css: () => import('highlight.js/lib/languages/css'),
		html: () => import('highlight.js/lib/languages/xml'),
		javascript: () => import('highlight.js/lib/languages/javascript'),
		js: () => import('highlight.js/lib/languages/javascript'),
		json: () => import('highlight.js/lib/languages/json'),
		jsx: () => import('highlight.js/lib/languages/javascript'),
		scss: () => import('highlight.js/lib/languages/scss'),
		sh: () => import('highlight.js/lib/languages/bash'),
		ts: () => import('highlight.js/lib/languages/typescript'),
		tsx: () => import('highlight.js/lib/languages/typescript'),
		typescript: () => import('highlight.js/lib/languages/typescript'),
		xml: () => import('highlight.js/lib/languages/xml'),
	};

	return languages[lang]?.() ?? null;
}

/**
 * Renders a syntax-highlighted code block, or falls back to plain code when
 * no language is detected (e.g. inline code snippets).
 *
 * highlight.js escapes all HTML in the source before wrapping tokens in
 * <span> tags, so `dangerouslySetInnerHTML` is safe here.
 */
export default function CodeBlock({ className, children }: CodeBlockProps) {
	const [highlighted, setHighlighted] = useState<string | null>(null);

	// markdown-to-jsx sets className like "lang-tsx" or "language-tsx"
	const lang = className?.match(/lang(?:uage)?-(\w+)/)?.[1];

	useEffect(() => {
		if (!lang || typeof children !== 'string') return;

		let cancelled = false;

		(async () => {
			const [{ default: hljs }, langModule] = await Promise.all([
				import('highlight.js/lib/core'),
				loadLanguage(lang!),
			]);

			if (cancelled || !langModule) return;

			if (!hljs.getLanguage(lang!)) {
				hljs.registerLanguage(lang!, langModule.default);
			}

			const result = hljs.highlight(children as string, { language: lang! });
			if (!cancelled) {
				setHighlighted(result.value);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [lang, children]);

	if (highlighted) {
		return (
			<code
				className={className}
				dangerouslySetInnerHTML={{ __html: highlighted }}
			/>
		);
	}

	return <code className={className}>{children}</code>;
}
