import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShareButtons from './ShareButtons';

// Don't mock useEffect - instead mock window.location before React is imported
Object.defineProperty(window, 'location', {
	value: {
		href: 'https://test.example.com/post/test',
	},
	writable: true,
});

// Mock useState to return a fixed URL value for the URL state
vi.mock('react', async () => {
	const actual = await vi.importActual('react');
	return {
		...actual,
		useState: (initialValue: string) => {
			if (initialValue === '') {
				return ['https://test.example.com/post/test', vi.fn()];
			}
			return (actual as typeof import('react')).useState(initialValue);
		},
	};
});

describe('ShareButtons', () => {
	const mockTitle = 'Test Post Title';

	it('renders share links correctly', () => {
		const { container } = render(<ShareButtons title={mockTitle} />);

		// Verify heading
		expect(screen.getByText('Share This Post')).toBeInTheDocument();

		// Verify the explanatory text
		expect(
			screen.getByText(/If you found this post interesting/)
		).toBeInTheDocument();

		// Use a more general selector to find all share links
		const links = container.querySelectorAll('a');
		expect(links.length).toBe(5); // Facebook, LinkedIn, Twitter, Reddit, Email

		// Check specific share links by their text content
		expect(screen.getByText('Share on Facebook')).toBeInTheDocument();
		expect(screen.getByText('Share on LinkedIn')).toBeInTheDocument();
		expect(screen.getByText('Share on X')).toBeInTheDocument();
		expect(screen.getByText('Share on Reddit')).toBeInTheDocument();
		expect(screen.getByText('Share by Email')).toBeInTheDocument();
	});

	it('creates correct share URLs', () => {
		render(<ShareButtons title={mockTitle} />);
		const currentUrl = 'https://test.example.com/post/test';
		const encodedTitle = encodeURIComponent(mockTitle);

		const fbLink = screen.getByText('Share on Facebook').closest('a');
		const linkedinLink = screen.getByText('Share on LinkedIn').closest('a');
		const xLink = screen.getByText('Share on X').closest('a');
		const redditLink = screen.getByText('Share on Reddit').closest('a');
		const emailLink = screen.getByText('Share by Email').closest('a');

		expect(fbLink).toHaveAttribute(
			'href',
			`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`
		);
		expect(linkedinLink).toHaveAttribute(
			'href',
			`https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}`
		);
		expect(xLink).toHaveAttribute(
			'href',
			`http://x.com/share?url=${currentUrl}&text=${encodedTitle}`
		);
		expect(redditLink).toHaveAttribute(
			'href',
			`https://reddit.com/submit?url=${currentUrl}&title=${encodedTitle}`
		);
		expect(emailLink).toHaveAttribute(
			'href',
			`mailto:?subject=${encodedTitle}&body=${currentUrl}`
		);
	});

	it('renders share links with correct target and rel attributes', () => {
		render(<ShareButtons title={mockTitle} />);

		const fbLink = screen.getByText('Share on Facebook').closest('a');
		const linkedinLink = screen.getByText('Share on LinkedIn').closest('a');
		const xLink = screen.getByText('Share on X').closest('a');
		const redditLink = screen.getByText('Share on Reddit').closest('a');
		const emailLink = screen.getByText('Share by Email').closest('a');

		[fbLink, linkedinLink, xLink, redditLink].forEach((link) => {
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		});

		expect(emailLink).toHaveAttribute('target', '_blank');
		expect(emailLink).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('renders FontAwesome icons for each share option', () => {
		const { container } = render(<ShareButtons title={mockTitle} />);
		const svgs = container.querySelectorAll('svg');
		expect(svgs.length).toBeGreaterThanOrEqual(5);
	});
});
