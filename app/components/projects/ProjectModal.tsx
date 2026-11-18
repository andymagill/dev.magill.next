'use client';

import Image from 'next/image';
import DOMPurify from 'dompurify';
import Modal from '../global/Modal';
import styles from './ProjectModal.module.scss';
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
			<div className={styles.projectModalContent}>
				<div className={styles.projectModalImage}>
					<Image
						src={project.image}
						alt={project.title}
						width={600}
						height={400}
						className={styles.fullImage}
						priority={isOpen}
					/>
				</div>
				<div className={styles.projectModalInfo}>
					<h2 className={styles.projectModalTitle}>{project.title}</h2>
					<div className={styles.projectModalTags}>
						{project.tags.map((tag, tagIndex) => (
							<span key={tagIndex} className={styles.tag}>
								{tag}
							</span>
						))}
					</div>
					<p className={styles.projectModalSummary}>{project.summary}</p>
					{caseStudySections.length > 0 ? (
						<dl className={styles.projectModalCaseStudy}>
							{caseStudySections.map(({ label, text }) => (
								<div key={label}>
									<dt>{label}</dt>
									<dd>{text}</dd>
								</div>
							))}
						</dl>
					) : (
						<div
							className={styles.projectModalDescription}
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
