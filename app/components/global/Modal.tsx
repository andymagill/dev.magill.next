'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	closeOnOutsideClick?: boolean;
	showHeader?: boolean;
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
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

	const closeButtonClass =
		'cursor-pointer text-[1.25rem] text-foreground opacity-70 transition-opacity duration-200 hover:opacity-100';

	const modalContent = (
		<div
			className={clsx(
				'fixed inset-0 z-[999] flex items-center justify-center bg-[rgba(128,128,128,0.25)] backdrop-blur-[1rem] transition-[opacity,visibility] duration-300 ease-[ease]',
				isOpen ? 'visible opacity-100' : 'invisible opacity-0'
			)}
			ref={modalRef}
			onClick={handleOutsideClick}
			role='dialog'
			aria-modal='true'
			aria-labelledby={title && showHeader ? 'modal-title' : undefined}
		>
			<div
				className={clsx(
					'relative flex max-h-[94vh] max-w-[min(94vw,1080px)] flex-col rounded-[8px] bg-background shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-transform duration-[400ms] ease-[ease]',
					isOpen ? 'translate-y-0' : 'translate-y-12'
				)}
			>
				{showHeader && (
					<div className='sticky top-0 z-10 flex items-center justify-between rounded-t-[8px] bg-background px-8 py-4'>
						{title && (
							<h2 id='modal-title' className='m-0 text-[1.25rem] font-medium'>
								{title}
							</h2>
						)}
						<button
							className={closeButtonClass}
							onClick={onClose}
							aria-label='Close modal'
						>
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</div>
				)}

				{!showHeader && (
					<button
						className={clsx(
							closeButtonClass,
							'fixed top-2 right-2 z-[1111] flex size-10 items-center justify-center rounded-full bg-background'
						)}
						onClick={onClose}
						aria-label='Close modal'
					>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				)}

				<div
					className='h-full [scrollbar-width:thin] [scrollbar-color:var(--foreground)_var(--background)] overflow-auto p-[1.2rem] sm:p-[2.4rem]'
					ref={modalBodyRef}
				>
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
