'use client';

import React from 'react';
import Markdown from 'markdown-to-jsx';
import CodeBlock from './CodeBlock';

interface MarkdownBodyProps {
	content: string;
}

/**
 * Client component wrapper for markdown-to-jsx.
 *
 * markdown-to-jsx constructs React elements via an internal factory that
 * omits the `_store` property React 19 expects. Rendering it in a client
 * component avoids RSC serialization of those elements entirely.
 */
export default function MarkdownBody({ content }: MarkdownBodyProps) {
	return (
		<Markdown options={{ forceBlock: true, overrides: { code: CodeBlock } }}>
			{content}
		</Markdown>
	);
}
