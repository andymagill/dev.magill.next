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
					<div
						className={styles.projectModalDescription}
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(project.description),
						}}
					/>
				</div>
			</div>
		</Modal>
	);
}
