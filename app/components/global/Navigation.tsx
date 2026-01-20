import React from 'react';
import Link from 'next/link';
import styles from './Navigation.module.scss';

const Navigation: React.FC = () => {
	return (
		<nav className={`${styles.navigation} navigation`}>
			<ul>
				<li>
					<Link href='/'>Home</Link>
				</li>
				<li>
					<Link href='/blog'>Blog</Link>
				</li>
				<li>
					<Link href='/projects'>Projects</Link>
				</li>
				<li>
					<a href='/docs/andrew-magill-developer-resume.pdf'>Resume</a>
				</li>
				<li>
					<a href='//github.com/andymagill'>GitHub</a>
				</li>
				<li>
					<a href='//www.linkedin.com/in/andrew-magill'>LinkedIn</a>
				</li>
			</ul>
		</nav>
	);
};

export default Navigation;
