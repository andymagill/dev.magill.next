import React from 'react';

const Services: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<section>
			<div className='flex'>{children}</div>
		</section>
	);
};

export default Services;
