//  /app/components/global/Header.tsx
import Navigation from './Navigation';
import NavButton from './NavButton';

// Mobile: the nav folds away (rotateX 90deg) until NavButton's checkbox (the
// `peer`) is checked. From the sm breakpoint up it is always shown.
const navClass =
	'origin-top overflow-hidden bg-always-black px-gap text-always-white transition-transform duration-[250ms] rotate-x-90 peer-checked:rotate-x-0 sm:rotate-x-0 sm:bg-transparent';

const Header: React.FC = () => {
	return (
		<>
			<header
				id='header'
				className='header absolute top-0 right-0 left-0 z-10 w-full text-center select-none'
			>
				<NavButton />
				<Navigation className={navClass} />
			</header>
		</>
	);
};

export default Header;
