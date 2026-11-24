import React from 'react';
import type { SkillCategory } from '@/utils/types';

// One skill category: a heading plus a wrapping list of technology chips.
const SkillCard: React.FC<SkillCategory> = ({ title, items }) => {
	return (
		<section className='border border-line glass p-gap'>
			<h3 className='mt-0 mb-4'>{title}</h3>
			<ul className='m-0 flex list-none flex-wrap gap-2 p-0'>
				{items.map((item) => (
					<li
						key={item}
						className='rounded-full border border-foreground px-2 py-[0.1rem] text-[0.8rem]'
					>
						{item}
					</li>
				))}
			</ul>
		</section>
	);
};

export default SkillCard;
