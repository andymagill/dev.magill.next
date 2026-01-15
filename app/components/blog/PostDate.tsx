/**
 * PostDate Component
 *
 * Renders a created date or lastUpdated date based on timestamps
 *
 * @param props - Component props containing created and lastUpdated parameter
 * @returns Rendered PostDate component
 */

/**
 * Formats a Unix timestamp into a human-readable date string
 *
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted date string or null if timestamp is invalid
 */
const formatDate = (timestamp: string): string | null => {
	if (!timestamp) return null;

	// Support either a Unix timestamp in seconds (numeric string) or an ISO timestamp.
	const date = /^[0-9]+$/.test(timestamp)
		? new Date(Number(timestamp) * 1000)
		: new Date(timestamp);

	// Use UTC timezone to make formatting deterministic in tests/environments.
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC',
	});
};

/**
 * Determines display date and text based on publish and update timestamps
 *
 * @param created - Unix timestamp for publish date
 * @param lastUpdated - Unix timestamp for last update
 * @returns Object containing display text and formatted date
 */
const getPostDate = (created: string, lastUpdated: string) => {
	// Get current ISO timestamp for fallback
	const now = new Date().toISOString();

	// Check if post was updated and update is newer than creation
	const isUpdated = lastUpdated && lastUpdated > created;

	// Return object with all display properties:
	// - displayDateTime: ISO timestamp to show (update/create/current date)
	// - displayText: Label to show ("Updated on" or "Published on")
	// - displayDate: Formatted date string for display
	return {
		displayDateTime: isUpdated ? lastUpdated : created || now,
		displayText: isUpdated ? 'Updated on' : 'Published on',
		displayDate: formatDate(isUpdated ? lastUpdated : created || now),
	};
};

interface PostDateProps {
	created: string;
	lastUpdated?: string;
}

/**
 * PostDate component that displays the publish or modified date
 *
 * @param props - Component props containing created and lastUpdated dates
 * @returns Rendered PostDate component
 */
export default function PostDate({ created, lastUpdated }: PostDateProps) {
	// Format both dates
	const publishedDate = formatDate(created);
	const updatedDate = lastUpdated ? formatDate(lastUpdated) : null;
	const showUpdated = updatedDate && updatedDate !== publishedDate;

	// Hide the entire section if no dates are available
	if (!publishedDate && !updatedDate) {
		return null;
	}

	return (
		<span>
			{publishedDate && (
				<>
					Published on <time dateTime={created}>{publishedDate}</time>
				</>
			)}
			{publishedDate && showUpdated && (
				<span className="mx-4"> • </span>
			)}
			{showUpdated && (
				<>
					Updated on <time dateTime={lastUpdated}>{updatedDate}</time>
				</>
			)}
		</span>
	);
}
