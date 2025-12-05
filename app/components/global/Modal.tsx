'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './Modal.module.scss';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	size?: 'small' | 'medium' | 'large';
	closeOnOutsideClick?: boolean;
	showHeader?: boolean;
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	size = 'medium',
	closeOnOutsideClick = true,
	showHeader = true,
}) => {
	// Avoid calling setState inside an effect for mount detection; initialize from environment
	const [isMounted] = useState(() => typeof window !== 'undefined');
	const modalRef = useRef<HTMLDivElement>(null);
	const modalBodyRef = useRef<HTMLDivElement>(null);

	// Handle body scroll locking
	useEffect(() => {
		if (isOpen) {
			// Save the current scroll position before locking
			const scrollY = window.scrollY;

			// Add class to body to prevent scrolling
			document.body.classList.add('modal-open');

			// Store the scroll position as inline style
			document.body.style.top = `-${scrollY}px`;

			return () => {
				// Remove the class when modal closes
				document.body.classList.remove('modal-open');

				// Reset the body position
				document.body.style.top = '';

				// Restore scroll position
				window.scrollTo(0, scrollY);
			};
		}
	}, [isOpen]);

	// Reset modal content scroll position when modal opens with new content
	useEffect(() => {
		if (isOpen && modalBodyRef.current) {
			modalBodyRef.current.scrollTop = 0;
		}
	}, [isOpen, children]);

	// Handle ESC key for closing
	useEffect(() => {
		if (isOpen) {
			const handleEscKey = (event: KeyboardEvent) => {
				if (event.key === 'Escape') {
					onClose();
				}
			};

			document.addEventListener('keydown', handleEscKey);
			return () => {
				document.removeEventListener('keydown', handleEscKey);
			};
		}
	}, [isOpen, onClose]);

	const handleOutsideClick = (e: React.MouseEvent) => {
		if (
			closeOnOutsideClick &&
			modalRef.current &&
			e.target === modalRef.current
		) {
			onClose();
		}
	};

	const modalContent = (
		<div
			className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`}
			ref={modalRef}
			onClick={handleOutsideClick}
			role='dialog'
			aria-modal='true'
			aria-labelledby={title && showHeader ? 'modal-title' : undefined}
		>
			<div className={`${styles.modalContent} ${styles[size] || ''}`}>
				{showHeader && (
					<div className={styles.modalHeader}>
						{title && (
							<h2 id='modal-title' className={styles.modalTitle}>
								{title}
							</h2>
						)}
						<button
							className={styles.closeButton}
							onClick={onClose}
							aria-label='Close modal'
						>
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</div>
				)}

				{!showHeader && (
					<button
						className={`${styles.closeButton} ${styles.floatingClose}`}
						onClick={onClose}
						aria-label='Close modal'
					>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				)}

				<div className={styles.modalBody} ref={modalBodyRef}>
					{children}
				</div>
			</div>
		</div>
	);

	if (!isMounted) {
		return null;
	}

	return createPortal(modalContent, document.body);
};

export default Modal;
