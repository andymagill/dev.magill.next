// layout.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

// Mock the imported components
vi.mock('./components/global/AnalyticsWrapper', () => ({
	default: ({ children }: React.PropsWithChildren) => (
		<div data-testid='analytics-wrapper'>{children}</div>
	),
}));

vi.mock('./components/global/ErrorBoundary', () => ({
	default: ({ children }: React.PropsWithChildren) => (
		<div data-testid='error-boundary'>{children}</div>
	),
}));

vi.mock('./components/global/Header', () => ({
	default: () => <header data-testid='header'>Header Component</header>,
}));

vi.mock('./components/global/Footer', () => ({
	default: () => <footer data-testid='footer'>Footer Component</footer>,
}));

vi.mock('./components/providers/LayoutProvider', () => ({
	LayoutProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid='layout-provider'>{children}</div>
	),
}));

vi.mock('./contexts/AuthContext', () => ({
	AuthProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid='auth-provider'>{children}</div>
	),
}));

// Mock the font
vi.mock('next/font/google', () => ({
	Outfit: () => ({ className: 'mock-outfit-font' }),
}));

describe('RootLayout', () => {
	it('renders all essential layout components', () => {
		render(
			<RootLayout>
				<div data-testid='page-content'>Page Content</div>
			</RootLayout>
		);

		// Check if all the layout components are rendered
		expect(screen.getByTestId('analytics-wrapper')).toBeInTheDocument();
		expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
		expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
		expect(screen.getByTestId('layout-provider')).toBeInTheDocument();
		expect(screen.getByTestId('header')).toBeInTheDocument();
		expect(screen.getByTestId('footer')).toBeInTheDocument();

		// Check if the children are rendered
		expect(screen.getByTestId('page-content')).toBeInTheDocument();
		expect(screen.getByText('Page Content')).toBeInTheDocument();
	});

	it('renders HTML structure with correct language', () => {
		const { container } = render(
			<RootLayout>
				<div>Content</div>
			</RootLayout>
		);

		const html = container.querySelector('html');
		expect(html).toHaveAttribute('lang', 'en');
	});

	it('applies the font class to the body', () => {
		const { container } = render(
			<RootLayout>
				<div>Content</div>
			</RootLayout>
		);

		const body = container.querySelector('body');
		expect(body).toHaveClass('mock-outfit-font');
	});
});
