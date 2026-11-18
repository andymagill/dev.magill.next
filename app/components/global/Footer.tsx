import React from 'react';
import Navigation from './Navigation';
import { settings } from '@/utils/settings.mjs';

const Footer: React.FC = () => {
	return (
		<footer>
			<div className='m-auto max-w-inner p-gap'>
				<Navigation />

				<div className='px-[1em] py-[0.5em] text-center text-[0.75em]'>
					<p>
						Copyright © {new Date().getFullYear()}, {settings.title}. All other
						copyrighted materials are property of their respective copyright
						holders.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
