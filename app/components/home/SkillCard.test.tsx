import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SkillCard from './SkillCard';
import skillsData from '@/content/skills.json';

describe('SkillCard', () => {
	it('renders the category heading and each technology as a list item', () => {
		render(<SkillCard title='Languages' items={['TypeScript', 'PHP', 'C#']} />);

		expect(
			screen.getByRole('heading', { name: 'Languages' })
		).toBeInTheDocument();

		const items = within(screen.getByRole('list')).getAllByRole('listitem');
		expect(items.map((li) => li.textContent)).toEqual([
			'TypeScript',
			'PHP',
			'C#',
		]);
	});

	it('has unique, non-empty items in every category of the skills data', () => {
		expect(skillsData.skills.length).toBeGreaterThan(0);
		for (const { title, items } of skillsData.skills) {
			expect(title).not.toBe('');
			expect(items.length).toBeGreaterThan(0);
			// Items are used as React keys, so duplicates would collide.
			expect(new Set(items).size).toBe(items.length);
		}
	});
});
