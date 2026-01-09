import React from 'react';

interface JsonLdProps {
	data: Record<string, any> | Record<string, any>[];
}

/**
 * Reusable component for injecting JSON-LD structured data into the page.
 * Standardizes the script tag boilerplate and JSON serialization.
 */
const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
};

export default JsonLd;
