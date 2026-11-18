// Header.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

// Mock the Navigation component
vi.mock('./Navigation', () => ({
	default: () => <nav data-testid='navigation'>Navigation Component</nav>,
}));

// Mock the NavButton component
vi.mock('./NavButton', () => ({
	default: () => <div data-testid='nav-button'>NavButton Component</div>,
}));

describe('Header', () => {
	it('renders with correct structure and components', () => {
		render(<Header />);

		// Check if the header element exists with correct class
		const header = screen.getByRole('banner');
		expect(header).toHaveClass('header');

		// Check if Navigation component is rendered
		expect(screen.getByTestId('navigation')).toBeInTheDocument();

		// Check if NavButton component is rendered
		expect(screen.getByTestId('nav-button')).toBeInTheDocument();
	});

	it('has the correct id attribute', () => {
		render(<Header />);
		const header = screen.getByRole('banner');
		expect(header).toHaveAttribute('id', 'header');
	});
});
