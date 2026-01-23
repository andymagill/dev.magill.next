import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import RelatedPosts from './RelatedPosts';
import { describe, test, expect } from 'vitest';

describe('RelatedPosts', () => {
	test('renders children and defaults to visible when no IntersectionObserver', async () => {
		// Remove IntersectionObserver to simulate older browsers / server
		const OriginalIO = (globalThis as any).IntersectionObserver;
		delete (globalThis as any).IntersectionObserver;

		render(
			<RelatedPosts>
				<div data-testid='child'>child</div>
			</RelatedPosts>
		);

		expect(screen.getByTestId('child')).toBeInTheDocument();
		const wrapper = screen.getByText('Related Articles').parentElement;
		await waitFor(() => {
			expect(wrapper).toHaveAttribute('data-related-visible', '1');
		});

		// restore
		(globalThis as any).IntersectionObserver = OriginalIO;
	});
});
