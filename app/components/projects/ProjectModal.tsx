'use client';

import Image from 'next/image';
import DOMPurify from 'dompurify';
import Modal from '../global/Modal';
import { Project as ProjectType } from '@/utils/types';

interface ProjectModalProps {
	project: ProjectType | null;
	isOpen: boolean;
	onClose: () => void;
}

export default function ProjectModal({
	project,
	isOpen,
	onClose,
}: ProjectModalProps) {
	if (!project) return null;

	// Case-study framing, shown in place of the free-form description when present
	const caseStudySections = [
		{ label: 'Problem', text: project.problem },
		{ label: 'Solution', text: project.solution },
		{ label: 'Outcome', text: project.outcome },
		{ label: 'My Role', text: project.role },
	].filter((section): section is { label: string; text: string } =>
		Boolean(section.text)
	);

	return (
		<Modal isOpen={isOpen} onClose={onClose} showHeader={false}>
			<div className='flex max-h-[calc(94vh-3rem)] w-full flex-col gap-0 overflow-y-auto sm:h-full sm:flex-row sm:gap-8 sm:overflow-y-hidden'>
				<div className='w-full sm:h-full sm:flex-[2] sm:overflow-hidden'>
					<Image
						src={project.image}
						alt={project.title}
						width={600}
						height={400}
						className='h-auto max-h-[50vh] w-full rounded-[0.25rem] object-cover object-top sm:max-h-[calc(100vh-9rem)]'
						priority={isOpen}
					/>
				</div>
				<div className='mr-0 flex max-h-none w-full [scrollbar-width:thin] [scrollbar-color:var(--foreground)_var(--background)] flex-col gap-3 overflow-y-visible sm:mr-2 sm:max-h-[calc(90vh-5rem)] sm:flex-[3] sm:overflow-y-auto'>
					<h2 className='text-[1.75rem] font-bold'>{project.title}</h2>
					<div className='flex flex-wrap gap-3'>
						{project.tags.map((tag, tagIndex) => (
							<span
								key={tagIndex}
								className='rounded-full bg-foreground px-2 py-[0.1rem] text-[0.8rem] text-background'
							>
								{tag}
							</span>
						))}
					</div>
					<p className='mb-2 text-[1.1rem] font-medium'>{project.summary}</p>
					{caseStudySections.length > 0 ? (
						<dl className='flex flex-col gap-4 leading-[1.6]'>
							{caseStudySections.map(({ label, text }) => (
								<div key={label}>
									<dt className='text-[0.8rem] font-bold tracking-[0.06em] uppercase'>
										{label}
									</dt>
									<dd className='mt-1'>{text}</dd>
								</div>
							))}
						</dl>
					) : (
						<div
							className='markdown-compact'
							dangerouslySetInnerHTML={{
								__html: DOMPurify.sanitize(project.description),
							}}
						/>
					)}
				</div>
			</div>
		</Modal>
	);
}
