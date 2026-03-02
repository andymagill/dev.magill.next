import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: '404 - Page not found',
};

export default function NotFound() {
	return (
		<div
			data-not-found='true'
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
			{/* Override the default nav color using CSS custom property */}
			<style>{`
      [data-not-found="true"] .navigation {
        --nav-color: var(--foreground);
        color: var(--nav-color);
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
