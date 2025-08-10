'use client';

import React from 'react';
import Link from 'next/link';
import Navigation from './Navigation';
import styles from './Footer.module.scss';
import { settings } from '@/utils/settings.mjs';
import { useIsDefaultLayout } from '@/app/components/providers/LayoutProvider';

const Footer: React.FC = () => {
	const isDefaultLayout = useIsDefaultLayout();
	
	// Only show footer in default layout
	if (!isDefaultLayout) {
		return null;
	}

	return (
		<footer className={styles.footer}>
			<div className={styles.wrapper}>
				<Navigation />

				<div className={styles.legal}>
					<Link href="/privacy">Privacy Policy</Link>
					<Link href="/terms">Terms of Service</Link>
				</div>

				<div className={styles.builtWith}>
					<p>
						Built with ❤️ by{' '}
						<Link href="https://magill.dev" target="_blank" rel="noopener noreferrer">
							Andrew Magill
						</Link>
					</p>
				</div>

				<div className={styles.copyright}>
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
