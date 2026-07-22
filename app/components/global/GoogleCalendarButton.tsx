'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

// Add calendar icon to library
library.add(faCalendar);

declare global {
	interface Window {
		calendar?: {
			schedulingButton: {
				load: (config: {
					url: string;
					color: string;
					label: string;
					target: HTMLElement;
				}) => void;
			};
		};
	}
}

export default function GoogleCalendarButton() {
	const targetRef = useRef<HTMLDivElement>(null);
	const isLoadedRef = useRef(false);

	useEffect(() => {
		// Inject CSS directly into the page
		if (!document.getElementById('gc-button-style')) {
			const style = document.createElement('style');
			style.id = 'gc-button-style';
			style.innerHTML = `
				/* Google Calendar button styling */
				button:has([data-calendar-icon]) {
					background-color: var(--foreground) !important;
					color: var(--background) !important;
					border: 2px solid var(--foreground) !important;
					border-radius: 0.75em !important;
					padding: 0.5em 1.5em !important;
					font-size: 0.88rem !important;
					font-family: inherit !important;
					cursor: pointer !important;
					transition: background-color 0.2s, color 0.2s !important;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
					display: block !important;
				}

				button:has([data-calendar-icon]):hover {
					background-color: transparent !important;
					color: var(--foreground) !important;
				}

				button:has([data-calendar-icon]):focus {
					outline: none !important;
					box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1) !important;
				}

				/* Calendar icon styling */
				span[data-calendar-icon] {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					margin-right: 0.5em !important;
				}

				span[data-calendar-icon] svg {
					width: 1em !important;
					height: 1em !important;
					fill: var(--background) !important;
				}

				button:has([data-calendar-icon]):hover span[data-calendar-icon] svg {
					fill: var(--foreground) !important;
				}

				/* Google Calendar overlay blur effect */
				div[style*="position: fixed"] {
					backdrop-filter: blur(1rem) !important;
					-webkit-backdrop-filter: blur(1rem) !important;
				}
			`;
			document.head.appendChild(style);
			console.log('[GoogleCalendarButton] CSS rules injected');
		}

		// Mark the container so we can target it
		if (
			targetRef.current &&
			!targetRef.current.hasAttribute('data-google-calendar')
		) {
			targetRef.current.setAttribute('data-google-calendar', 'true');
		}

		// Setup observer to add icon when button appears and style overlay
		const setupButtonObserver = () => {
			const addIconToButton = () => {
				// Find button by searching all buttons
				const button = Array.from(document.querySelectorAll('button')).find(
					(b) => b.textContent?.includes('Schedule')
				);

				if (button && !button.querySelector('[data-calendar-icon]')) {
					const calendarIcon = icon(faCalendar);
					const iconSpan = document.createElement('span');
					iconSpan.setAttribute('data-calendar-icon', 'true');
					iconSpan.innerHTML = calendarIcon.html[0];
					button.insertBefore(iconSpan, button.firstChild);
					console.log('[GoogleCalendarButton] Icon added via observer');
					return true;
				}
				return false;
			};

			const styleOverlay = () => {
				// Look for ALL fixed position divs (Google Calendar uses generated classes)
				const fixedElements = Array.from(
					document.querySelectorAll('div')
				).filter((el) => {
					const computed = window.getComputedStyle(el);
					return (
						computed.position === 'fixed' &&
						parseInt(computed.zIndex) > 100 && // High z-index (not background)
						el.children.length > 0 && // Has children (the content)
						!el.className.includes('Background') && // Not the background animation
						!el.hasAttribute('data-blur-styled')
					);
				});

				fixedElements.forEach((overlay) => {
					overlay.setAttribute('data-blur-styled', 'true');
					overlay.style.setProperty(
						'backdrop-filter',
						'blur(1rem)',
						'important'
					);
					overlay.style.setProperty(
						'-webkit-backdrop-filter',
						'blur(1rem)',
						'important'
					);
					// Enhance the background color for more prominent blur effect
					overlay.style.setProperty(
						'background-color',
						'rgba(128, 128, 128, 0.25)',
						'important'
					);
					console.log(
						'[GoogleCalendarButton] Overlay styled:',
						overlay.className
					);
				});
			};

			const observer = new MutationObserver(() => {
				addIconToButton();
				styleOverlay();
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});

			return observer;
		};

		// Initialize Google Calendar button when script loads
		const tryInitialize = () => {
			if (
				window.calendar?.schedulingButton &&
				targetRef.current &&
				!isLoadedRef.current
			) {
				isLoadedRef.current = true;
				console.log('[GoogleCalendarButton] Initializing Google Calendar');

				// Setup observer before loading
				const observer = setupButtonObserver();

				window.calendar.schedulingButton.load({
					url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1eVLAyEkJQ7H3o24pzhMevGobzhTexLeufmSBltUhQHxu49SAvt2Oog63LhckkwhbQYp8IiXOJ?gv=true',
					color: '#000000',
					label: 'Schedule a Call',
					target: targetRef.current,
				});

				// Also try adding icon after delays
				const addIconWithDelay = () => {
					const button = Array.from(document.querySelectorAll('button')).find(
						(b) => b.textContent?.includes('Schedule')
					);
					if (button && !button.querySelector('[data-calendar-icon]')) {
						const calendarIcon = icon(faCalendar);
						const iconSpan = document.createElement('span');
						iconSpan.setAttribute('data-calendar-icon', 'true');
						iconSpan.innerHTML = calendarIcon.html[0];
						button.insertBefore(iconSpan, button.firstChild);
						console.log('[GoogleCalendarButton] Icon added via timeout');
					}
				};

				// Style overlay with delays as well
				const styleOverlayWithDelay = () => {
					const fixedElements = Array.from(
						document.querySelectorAll('div')
					).filter((el) => {
						const computed = window.getComputedStyle(el);
						return (
							computed.position === 'fixed' &&
							parseInt(computed.zIndex) > 100 &&
							el.children.length > 0 &&
							!el.className.includes('Background') &&
							!el.hasAttribute('data-blur-styled')
						);
					});

					fixedElements.forEach((overlay) => {
						overlay.setAttribute('data-blur-styled', 'true');
						overlay.style.setProperty(
							'backdrop-filter',
							'blur(1rem)',
							'important'
						);
						overlay.style.setProperty(
							'-webkit-backdrop-filter',
							'blur(1rem)',
							'important'
						);
						overlay.style.setProperty(
							'background-color',
							'rgba(128, 128, 128, 0.25)',
							'important'
						);
						console.log(
							'[GoogleCalendarButton] Overlay styled via timeout:',
							overlay.className
						);
					});
				};

				setTimeout(addIconWithDelay, 100);
				setTimeout(addIconWithDelay, 300);
				setTimeout(addIconWithDelay, 500);
				setTimeout(addIconWithDelay, 1000);

				setTimeout(styleOverlayWithDelay, 200);
				setTimeout(styleOverlayWithDelay, 400);
				setTimeout(styleOverlayWithDelay, 600);
				setTimeout(styleOverlayWithDelay, 1200);

				// Clean up observer after 10 seconds
				setTimeout(() => {
					observer.disconnect();
				}, 10000);

				return observer;
			}
		};

		// Check if already loaded
		if (window.calendar?.schedulingButton) {
			tryInitialize();
		} else {
			// Poll for Google Calendar script to load
			const interval = setInterval(() => {
				const observer = tryInitialize();
				if (observer) {
					clearInterval(interval);
				}
			}, 100);

			setTimeout(() => clearInterval(interval), 5000);

			return () => clearInterval(interval);
		}
	}, []);

	return (
		<>
			<link
				href='https://calendar.google.com/calendar/scheduling-button-script.css'
				rel='stylesheet'
			/>
			<Script
				src='https://calendar.google.com/calendar/scheduling-button-script.js'
				strategy='afterInteractive'
			/>
			<div ref={targetRef} />
		</>
	);
}

GoogleCalendarButton.displayName = 'GoogleCalendarButton';
