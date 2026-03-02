'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import styles from './NavButton.module.scss';

const NavButton: React.FC = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const pathname = usePathname();

	const handleCheckboxChange = useCallback(() => {
		const header = document.getElementById('header');
		if (inputRef.current && header) {
			if (inputRef.current.checked) {
				header.style.setProperty('--header-space', '100px');
			} else {
				header.style.setProperty('--header-space', '');
			}
		}
	}, []);

	const closeNavOnNavigation = useCallback(() => {
		// Uncheck the input when the pathname changes
		if (inputRef.current) {
			inputRef.current.checked = false;
		}

		// Reset the header space
		const header = document.getElementById('header');
		if (header) {
			header.style.setProperty('--header-space', '');
		}
	}, []);

	// Close navigation and reset header when route changes
	useEffect(() => {
		closeNavOnNavigation();
	}, [pathname, closeNavOnNavigation]);

	return (
		<>
			<input
				className={styles.navButton}
				type='checkbox'
				id='navButton'
				ref={inputRef}
				onChange={handleCheckboxChange}
			/>
			<label className={styles.navButtonIcon} htmlFor='navButton'>
				{/* TODO: change the mobile button to something more recognizable */}
				<FontAwesomeIcon icon={faBars} />
			</label>
		</>
	);
};

export default NavButton;
