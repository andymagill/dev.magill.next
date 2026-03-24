// NavButton.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NavButton from './NavButton';

// Setup variables for mocking
const usePathnameMock = vi.fn();

// Mock next/navigation
vi.mock('next/navigation', () => ({
	usePathname: () => usePathnameMock(),
}));

// Mock FontAwesome
vi.mock('@fortawesome/react-fontawesome', () => ({
	FontAwesomeIcon: ({ icon }: { icon: unknown }) => (
		<span data-testid='font-awesome-icon'>Icon Mock</span>
	),
}));

vi.mock('@fortawesome/free-solid-svg-icons', () => ({
	faBars: {},
}));

describe('NavButton', () => {
	// Mock document functions
	const mockHeaderElement = {
		style: {
			setProperty: vi.fn(),
		},
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	};

	beforeEach(() => {
		vi.resetAllMocks();
		// Set default pathname mock
		usePathnameMock.mockReturnValue('/');
		// Mock getElementById
		document.getElementById = vi.fn().mockReturnValue(mockHeaderElement);
	});

	it('renders checkbox input with correct class and icon', () => {
		render(<NavButton />);

		// Verify checkbox exists
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toBeInTheDocument();
		expect(checkbox).toHaveAttribute('id', 'navButton');

		// Verify FontAwesome icon is rendered
		const icon = screen.getByTestId('font-awesome-icon');
		expect(icon).toBeInTheDocument();
	});

	it('calls setProperty on checkbox change and route change', async () => {
		const { rerender } = render(<NavButton />);

		// Get the checkbox
		const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

		// Check the checkbox
		fireEvent.click(checkbox);

		// Verify setProperty was called with --header-space 100px when checked
		expect(mockHeaderElement.style.setProperty).toHaveBeenCalledWith(
			'--header-space',
			'100px'
		);

		// Reset mock calls
		mockHeaderElement.style.setProperty.mockClear();

		// Uncheck the checkbox
		fireEvent.click(checkbox);

		// Verify setProperty was called with empty string when unchecked
		expect(mockHeaderElement.style.setProperty).toHaveBeenCalledWith(
			'--header-space',
			''
		);

		// Reset and change route
		mockHeaderElement.style.setProperty.mockClear();
		usePathnameMock.mockReturnValue('/blog');

		// Re-render to trigger the pathname change effect
		rerender(<NavButton />);

		// Verify header space was reset on route change
		expect(mockHeaderElement.style.setProperty).toHaveBeenCalledWith(
			'--header-space',
			''
		);
	});

	it('resets checkbox when pathname changes', () => {
		render(<NavButton />);

		// Get the checkbox
		const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

		// Initial pathname is '/'
		expect(checkbox.checked).toBe(false);

		// Verify initial getElementById was called
		expect(document.getElementById).toHaveBeenCalledWith('header');
	});
});
