import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

// Animated underline that slides up into place on hover.
const linkClass =
	'inline-block translate-y-0 p-2 text-[1.25rem] leading-none whitespace-nowrap text-inherit underline decoration-transparent underline-offset-[-0.2rem] transition-[color,translate,text-decoration-color,text-underline-offset] duration-[250ms] hover:-translate-y-[0.3rem] hover:decoration-white hover:underline-offset-[0.5rem]';

interface NavigationProps {
	/** Additional, non-conflicting classes from the parent (e.g. Header's mobile collapse). */
	className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
	return (
		<nav className={clsx('navigation text-center select-none', className)}>
			<ul className='inline-flex list-none flex-wrap justify-center py-3 text-center'>
				<li>
					<Link href='/' className={linkClass}>
						Home
					</Link>
				</li>
				<li>
					<Link href='/blog' className={linkClass}>
						Blog
					</Link>
				</li>
				<li>
					<Link href='/projects' className={linkClass}>
						Projects
					</Link>
				</li>
				<li>
					<a
						href='/docs/andrew-magill-developer-resume.pdf'
						className={linkClass}
					>
						Resume
					</a>
				</li>
				<li>
					<a href='//github.com/andymagill' className={linkClass}>
						GitHub
					</a>
				</li>
				<li>
					<a href='//www.linkedin.com/in/andrew-magill' className={linkClass}>
						LinkedIn
					</a>
				</li>
			</ul>
		</nav>
	);
};

export default Navigation;
