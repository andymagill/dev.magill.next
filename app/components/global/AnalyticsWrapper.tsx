'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

import { settings } from '@/utils/settings.mjs';

declare global {
	interface Window {
		dataLayer: any[];
	}
}

const GTM_ID = settings.gtmId;

const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	useEffect(() => {
		if (typeof window !== 'undefined' && window.dataLayer) {
			window.dataLayer.push({
				event: 'pageview',
				page: window.location.pathname,
			});
		}
	}, []);

	// Guard against undefined GTM_ID to prevent wasted network request
	if (!GTM_ID) {
		return <>{children}</>;
	}

	return (
		<>
			<Script
				id='gtm-script'
				strategy='afterInteractive'
				dangerouslySetInnerHTML={{
					__html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
				}}
			/>
			{children}
		</>
	);
};

export default AnalyticsWrapper;
