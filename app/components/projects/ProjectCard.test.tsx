import React from 'react';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import ProjectCard from './ProjectCard';
import { describe, it, expect, vi } from 'vitest';

describe('ProjectCard', () => {
	it('renders title, summary and image alt, and responds to click', async () => {
		const handleClick = vi.fn();
		render(
			<ProjectCard
				title='Test Project'
				summary='a short summary'
				description='desc'
				image='/img.jpg'
				tags={['tag']}
				onClick={handleClick}
			/>
		);

		expect(
			screen.getByRole('heading', { name: /Test Project/i })
		).toBeInTheDocument();
		expect(screen.getByText(/a short summary/i)).toBeInTheDocument();
		const img = screen.getByAltText(/Test Project/i) as HTMLImageElement;
		expect(img).toBeInTheDocument();

		fireEvent.click(screen.getByText(/Test Project/i));
		expect(handleClick).toHaveBeenCalled();
	});

	it('archive variant renders an image-only tile that still responds to click', () => {
		const handleClick = vi.fn();
		render(
			<ProjectCard
				title='Archived Project'
				summary='hidden summary'
				description='desc'
				image='/img.jpg'
				tags={[]}
				onClick={handleClick}
				variant='archive'
			/>
		);

		expect(screen.queryByRole('heading')).toBeNull();
		expect(screen.queryByText(/hidden summary/i)).toBeNull();
		const img = screen.getByAltText(/Archived Project/i);
		expect(img).toBeInTheDocument();

		fireEvent.click(img);
		expect(handleClick).toHaveBeenCalled();
	});
});
