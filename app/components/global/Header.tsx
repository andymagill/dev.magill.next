'use client';

//  /app/components/global/Header.tsx
import { useEffect } from 'react';
import Link from 'next/link';
import Navigation from './Navigation';
import NavButton from './NavButton';
import { useIsAuthenticated, useShowAuthButtons } from '@/app/components/providers/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

// Header styles
import styles from './Header.module.scss';

const Header: React.FC = () => {
	const isAuthenticated = useIsAuthenticated();
	const showAuthButtons = useShowAuthButtons();

	return (
		<>
			<header id='header' className={`${styles.header} header`}>
				<div className={styles.leftSection}>
					{isAuthenticated && (
						<Link href="/account" className={styles.accountButton} title="Account Settings">
							<FontAwesomeIcon icon={faUser} />
						</Link>
					)}
					<NavButton />
				</div>
				
				<Navigation />
				
				<div className={styles.rightSection}>
					{showAuthButtons && (
						<div className={styles.authButtons}>
							<Link href="/signin" className={styles.authButton}>Sign in</Link>
							<Link href="/register" className={styles.authButton}>Register</Link>
						</div>
					)}
				</div>
			</header>
		</>
	);
};

export default Header;
