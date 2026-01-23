// Navigation.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navigation from './Navigation';
import styles from './Navigation.module.scss';

// Mock next/link
vi.mock('next/link', () => {
	return {
		default: ({
			children,
			href,
		}: {
			children: React.ReactNode;
			href: string;
		}) => {
			return (
				<a href={href} data-testid='next-link'>
					{children}
				</a>
			);
		},
	};
});

describe('Navigation', () => {
	it('renders all navigation links correctly', () => {
		render(<Navigation />);

		// Check if all navigation links are present (both Link and regular <a> tags)
		const nextLinks = screen.getAllByTestId('next-link');
		const allLinks = screen.getAllByRole('link');

		// Check the total number of links
		expect(allLinks).toHaveLength(6);

		// Check each link by href and text
		expect(allLinks[0]).toHaveAttribute('href', '/');
		expect(allLinks[0]).toHaveTextContent('Home');

		expect(allLinks[1]).toHaveAttribute('href', '/blog');
		expect(allLinks[1]).toHaveTextContent('Blog');

		expect(allLinks[2]).toHaveAttribute('href', '/projects');
		expect(allLinks[2]).toHaveTextContent('Projects');

		expect(allLinks[3]).toHaveAttribute(
			'href',
			'/docs/andrew-magill-developer-resume.pdf'
		);
		expect(allLinks[3]).toHaveTextContent('Resume');

		expect(allLinks[4]).toHaveAttribute('href', '//github.com/andymagill');
		expect(allLinks[4]).toHaveTextContent('GitHub');

		expect(allLinks[5]).toHaveAttribute(
			'href',
			'//www.linkedin.com/in/andrew-magill'
		);
		expect(allLinks[5]).toHaveTextContent('LinkedIn');
	});

	it('applies the correct CSS classes', () => {
		const { container } = render(<Navigation />);
		const nav = container.querySelector('nav');

		expect(nav).toHaveClass('navigation');
		expect(nav).toHaveClass(styles.navigation);
	});
});
