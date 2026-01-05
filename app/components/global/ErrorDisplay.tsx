import type { ReactElement } from 'react';

/**
 * Reusable component for displaying errors in a consistent way
 */
export default function ErrorDisplay({
	title = 'OOPSIE!',
	message = 'Something went wrong.',
	details = '',
}: {
	title?: string;
	message?: string;
	details?: string;
}): ReactElement {
	return (
		<div style={{ textAlign: 'center', margin: '2rem' }}>
			<h2>{title}</h2>
			<p className='center error'>{message}</p>
			{details && <p>{details}</p>}
		</div>
	);
}
