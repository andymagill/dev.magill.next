/**
 * Strips markdown formatting from text
 * Removes markdown syntax while preserving readable content
 *
 * @param markdown - Raw markdown text with formatting
 * @returns Plain text suitable for text-to-speech synthesis or display
 *
 * Removes:
 * - Headings (# ## ###, etc.)
 * - Bold/italic (**text**, *text*, __text__, _text_)
 * - Inline code (`code`)
 * - Code blocks (```code```)
 * - Links ([text](url))
 * - Images (![alt](url))
 * - Horizontal rules (---, ***, ___)
 * - List markers (-, *, +, 1., 2., etc.)
 * - HTML tags (<tag>)
 * - Extra whitespace
 */
export function cleanMarkdown(markdown: string): string {
	if (!markdown) return '';

	let text = markdown
		// Remove markdown headings
		.replace(/^#+\s+/gm, '')
		// Remove markdown bold and italic
		.replace(/\*\*(.+?)\*\*/g, '$1')
		.replace(/\*(.+?)\*/g, '$1')
		.replace(/__(.+?)__/g, '$1')
		.replace(/_(.+?)_/g, '$1')
		// Remove inline code
		.replace(/`(.+?)`/g, '$1')
		// Remove code blocks
		.replace(/```[\s\S]*?```/g, '[code block omitted]')
		// Remove links but keep text
		.replace(/\[(.+?)\]\(.+?\)/g, '$1')
		// Remove images
		.replace(/!\[.*?\]\(.+?\)/g, '')
		// Remove horizontal rules
		.replace(/^[-*_]{3,}$/gm, '')
		// Remove list markers
		.replace(/^\s*[-*+]\s+/gm, '')
		.replace(/^\s*\d+\.\s+/gm, '')
		// Remove HTML tags
		.replace(/<[^>]+>/g, '')
		// Remove extra whitespace
		.replace(/\n\n+/g, '\n')
		.trim();

	return text;
}
