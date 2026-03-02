import React from 'react';
import Navigation from './Navigation';
import styles from './Footer.module.scss';
import { settings } from '@/utils/settings.mjs';

const Footer: React.FC = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.wrapper}>
				<Navigation />

				<div className={`${styles.copyright} ta-center fs-xs`}>
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
