import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: '404 - Page not found',
};

export default function NotFound() {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				marginTop: '80px',
				height: '70vh',
				textAlign: 'center',
			}}
		>
			{/* Overide the default nav color */}
			<style>{`
      .navigation.navigation.navigation {
        color: var(--foreground) !important;
      }
      `}</style>
			<p>404 - Page not found </p>
			<h1>OOPSIE! </h1>
			<p>
				Sorry, there is nothing to see here, <Link href='/'>go home</Link>.
			</p>
		</div>
	);
}
