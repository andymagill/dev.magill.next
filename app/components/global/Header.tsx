//  /app/components/global/Header.tsx
import Navigation from './Navigation';
import NavButton from './NavButton';

// Header styles
import styles from './Header.module.scss';

const Header: React.FC = () => {
	return (
		<>
			<header id='header' className={`${styles.header} header`}>
				<NavButton />
				<Navigation />
			</header>
		</>
	);
};

export default Header;
