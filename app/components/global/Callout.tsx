import React from 'react';
import Image from 'next/image';

const Callout: React.FC<{
	title: string;
	description: string;
	icon: string;
}> = ({ title, description, icon }) => {
	return (
		<section className='glass px-[1.5em] py-[1em]'>
			<Image
				src={icon}
				alt={title}
				width={64}
				height={64}
				// Dark mode: flatten the icon to white (filter order matters, so not contrast-*/brightness-*)
				className='float-left mr-1 max-w-full dark:[filter:contrast(0%)_brightness(2)]'
			/>
			<h3 className='my-2 max-w-[200px] leading-6'>{title}</h3>
			<p className='text-left text-[1.11em]'>{description}</p>
		</section>
	);
};

export default Callout;
