import { Suspense } from 'react';
import ProjectList from './ProjectList';
import ErrorDisplay from '../global/ErrorDisplay';
import { ProjectService } from '@/utils/projectService';
import { ProjectListContainerProps } from '@/utils/types';

/**
 * Container component that handles loading project data and error states
 */
export default async function ProjectListContainer({
	file = '',
	maxProjects = 0,
}: ProjectListContainerProps): Promise<JSX.Element> {
	// Fetch data and handle errors before constructing JSX
	let projectsToRender = [] as any[];
	try {
		const data = await ProjectService.loadProjects(file);
		projectsToRender =
			maxProjects > 0 ? data.projects.slice(0, maxProjects) : data.projects;
	} catch (error) {
		return (
			<ErrorDisplay
				title='OOPSIE!'
				message='There was a problem loading projects.'
				details={(error as Error).message}
			/>
		);
	}

	return (
		<Suspense fallback={<div>Loading projects...</div>}>
			<ProjectList projects={projectsToRender} />
		</Suspense>
	);
}
