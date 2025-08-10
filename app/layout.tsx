// Root layout for Next.js application.
// Handles global providers, error boundaries, and site-wide structure.
// This is the entry point for all pages and wraps the app with Analytics, Header, Footer, etc.

// app/layout.tsx

import type { Metadata } from 'next';
import AnalyticsWrapper from './components/global/AnalyticsWrapper';
import ErrorBoundary from '@/app/components/global/ErrorBoundary';
import Header from './components/global/Header';
import Footer from './components/global/Footer';
import { LayoutProvider } from './components/providers/LayoutProvider';
import { AuthProvider } from './contexts/AuthContext';

import { Outfit } from 'next/font/google';
import './globals.css';
import './utilities.css';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
	robots: 'index,follow',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={outfit.className}>
				<ErrorBoundary>
					<AnalyticsWrapper>
						<AuthProvider>
							<LayoutProvider>
								<div className='site'>
									<Header />

									{children}

									<Footer />
								</div>
							</LayoutProvider>
						</AuthProvider>
					</AnalyticsWrapper>
				</ErrorBoundary>
			</body>
		</html>
	);
}
