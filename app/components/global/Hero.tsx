import React from 'react';
import clsx from 'clsx';
import HeroAnimation from './HeroAnimation';

interface HeroProps {
	children: React.ReactNode;
	/** 'row' places the content side by side (reversed) from the xs breakpoint up. */
	layout?: 'stacked' | 'row';
}

// Children are page-provided markup, so their few styles are applied from here
// with arbitrary descendant variants.
const sectionClass =
	'relative text-always-white [&_h1]:mb-4 [&_h1]:text-[clamp(1.5rem,2.5vw,2rem)] [&_p_a]:underline-offset-[0.2rem] [&_p_a]:transition-[text-underline-offset] [&_p_a]:duration-200 [&_p_a:hover]:underline-offset-[0.5rem]';

const wrapperClass =
	'm-auto flex max-w-inner flex-col items-center justify-center gap-[max(0.4rem,3.6%)] px-gap pt-20 pb-[8vmax] sm:pt-[10vmax] [&_img]:mb-8 xs:[&_img]:mb-0';

const Hero: React.FC<HeroProps> = ({ children, layout = 'stacked' }) => {
	return (
		<section className={sectionClass}>
			<div
				className={clsx(
					wrapperClass,
					layout === 'row' && 'xs:flex-row-reverse'
				)}
			>
				{children}
			</div>
			<HeroAnimation />
		</section>
	);
};

export default Hero;
