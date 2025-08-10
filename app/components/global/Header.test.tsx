// Header.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';
import { AuthProvider } from '@/app/contexts/AuthContext';
import styles from './Header.module.scss';

// Mock the Navigation component
vi.mock('./Navigation', () => ({
	default: () => <nav data-testid='navigation'>Navigation Component</nav>,
}));

// Mock the NavButton component
vi.mock('./NavButton', () => ({
	default: () => <div data-testid='nav-button'>NavButton Component</div>,
}));

// Mock FontAwesome
vi.mock('@fortawesome/react-fontawesome', () => ({
	FontAwesomeIcon: ({ icon }: { icon: any }) => <span data-testid="icon">{icon.iconName}</span>,
}));

vi.mock('@fortawesome/free-solid-svg-icons', () => ({
	faUser: { iconName: 'user' },
}));

// Helper function to render with auth context
const renderWithAuthProvider = (component: React.ReactElement) => {
	return render(
		<AuthProvider>
			{component}
		</AuthProvider>
	);
};

describe('Header', () => {
	it('renders with correct structure and components', () => {
		renderWithAuthProvider(<Header />);

		// Check if the header element exists with correct class
		const header = screen.getByRole('banner');
		expect(header).toHaveClass('header');
		expect(header).toHaveClass(styles.header);

		// Check if Navigation component is rendered
		expect(screen.getByTestId('navigation')).toBeInTheDocument();

		// Check if NavButton component is rendered
		expect(screen.getByTestId('nav-button')).toBeInTheDocument();
	});

	it('has the correct id attribute', () => {
		renderWithAuthProvider(<Header />);
		const header = screen.getByRole('banner');
		expect(header).toHaveAttribute('id', 'header');
	});

	it('does not show account button when not authenticated', () => {
		renderWithAuthProvider(<Header />);
		expect(screen.queryByTitle('Account Settings')).not.toBeInTheDocument();
	});

	it('does not show auth buttons when Supabase is not connected', () => {
		renderWithAuthProvider(<Header />);
		expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
		expect(screen.queryByText('Register')).not.toBeInTheDocument();
	});
});
