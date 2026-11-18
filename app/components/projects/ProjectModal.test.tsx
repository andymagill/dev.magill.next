import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProjectModal from './ProjectModal';

const baseProject = {
	title: 'Test Project',
	summary: 'a short summary',
	description: '<p>free-form description</p>',
	image: '/img.jpg',
	tags: ['tag'],
};

describe('ProjectModal', () => {
	it('renders case-study sections in place of the description when present', () => {
		render(
			<ProjectModal
				project={{
					...baseProject,
					problem: 'the problem',
					solution: 'the solution',
					outcome: 'the outcome',
				}}
				isOpen
				onClose={vi.fn()}
			/>
		);

		expect(screen.getByText('Problem')).toBeInTheDocument();
		expect(screen.getByText('the solution')).toBeInTheDocument();
		expect(screen.getByText('the outcome')).toBeInTheDocument();
		expect(screen.queryByText('My Role')).not.toBeInTheDocument();
		expect(screen.queryByText('free-form description')).not.toBeInTheDocument();
	});

	it('falls back to the description when no case-study fields are set', () => {
		render(<ProjectModal project={baseProject} isOpen onClose={vi.fn()} />);

		expect(screen.getByText('free-form description')).toBeInTheDocument();
		expect(screen.queryByText('Problem')).not.toBeInTheDocument();
	});
});
