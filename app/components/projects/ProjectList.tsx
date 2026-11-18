'use client';

import { useState } from 'react';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { Project as ProjectType, type ProjectCardVariant } from '@/utils/types';

export default function ProjectList({
	projects,
	variant = 'default',
}: {
	projects: ProjectType[];
	variant?: ProjectCardVariant;
}) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
		null
	);

	const openProjectModal = (project: ProjectType) => {
		setSelectedProject(project);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<section className='mx-auto my-gap w-full'>
			<div className='flex flex-wrap justify-center gap-gap'>
				{projects.map((project, index) => (
					<ProjectCard
						key={index}
						{...project}
						variant={variant}
						onClick={() => openProjectModal(project)}
					/>
				))}
			</div>

			<ProjectModal
				project={selectedProject}
				isOpen={isModalOpen}
				onClose={closeModal}
			/>
		</section>
	);
}
