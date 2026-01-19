'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import styles from './ListenButton.module.scss';

interface ListenButtonProps {
	text: string;
}

/**
 * ListenButton component
 *
 * Provides a button to read aloud the given text using the browser's Speech Synthesis API.
 * Shows a play or stop icon and label depending on whether speech is active.
 * Hides button until Web Speech API compatibility is confirmed and voices are loaded.
 * Cancels speech on mount/unmount to prevent speech from persisting across navigation.
 */
const ListenButton: React.FC<ListenButtonProps> = ({ text }) => {
	// Track whether speech synthesis is currently active
	const [isSpeaking, setIsSpeaking] = useState(false);
	// Track when the component has mounted on the client
	const [mounted, setMounted] = useState(false);
	// Track if Web Speech API is supported and available
	const [isSupported, setIsSupported] = useState(false);
	// Track if voices have been loaded
	const [voicesLoaded, setVoicesLoaded] = useState(false);
	// Cache selected voice to avoid repeated lookups
	const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

	// Preferred voices in order
	const preferredVoices = [
		'Microsoft Sonia Online (Natural) - English (United Kingdom)',
		'Google UK English Female',
		'Google UK English',
		'Google US English Female',
		'Google US English',
		'Microsoft Zira - English (United States)',
		'en-US',
		'en_US',
		'English (United States)',
		'English US',
		'enUS',
	];

	/**
	 * Effect 1: Mount/unmount lifecycle and compatibility check
	 * Only perform mount/unmount side-effects here
	 */
	useEffect(() => {
		try {
			// Check if speechSynthesis API exists
			const hasSpeechSynthesis = !!window.speechSynthesis;
			if (!hasSpeechSynthesis) {
				console.log('[ListenButton] Web Speech API not available in this browser');
				setMounted(true);
				setIsSupported(false);
				return;
			}

			console.log('[ListenButton] Web Speech API is available, compatibility check passed');
			setIsSupported(true);
			setMounted(true);

			// Cancel any ongoing speech
			window.speechSynthesis.cancel();

			return () => {
				// Cleanup: cancel speech on unmount
				try {
					window.speechSynthesis?.cancel();
				} catch (err) {
					console.error('[ListenButton] Error canceling speech on unmount', err);
				}
			};
		} catch (err) {
			console.error('[ListenButton] Error during compatibility check', err);
			setMounted(true);
			setIsSupported(false);
		}
	}, []);

	/**
	 * Effect 2: Load voices asynchronously
	 * Web Speech API loads voices asynchronously, especially in production.
	 * Listen for voiceschanged event to know when voices are ready.
	 */
	useEffect(() => {
		if (!isSupported) return;

		const loadVoices = () => {
			try {
				const voices = window.speechSynthesis?.getVoices?.() || [];
				if (voices.length > 0) {
					console.log(`[ListenButton] Voices loaded: ${voices.length} available`);
					setVoicesLoaded(true);
				} else {
					console.log('[ListenButton] No voices available yet, waiting for voiceschanged event');
				}
			} catch (err) {
				console.error('[ListenButton] Error loading voices', err);
				setVoicesLoaded(false);
			}
		};

		// Try to load voices immediately
		loadVoices();

		// Also listen for voiceschanged event (fires when voices become available)
		window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);

		return () => {
			window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
		};
	}, [isSupported]);

	// Helper to select the best available voice
	function getPreferredVoice(): SpeechSynthesisVoice | null {
		// Return cached voice if available
		if (selectedVoiceRef.current) {
			return selectedVoiceRef.current;
		}

		try {
			const voices = window.speechSynthesis?.getVoices?.() || [];
			
			if (voices.length === 0) {
				console.log('[ListenButton] No voices available for selection');
				return null;
			}

			// Try to find a preferred voice by name or lang
			for (const pref of preferredVoices) {
				const byName = voices.find((v) => v.name === pref);
				if (byName) {
					console.log(`[ListenButton] Selected voice by name: ${pref}`);
					selectedVoiceRef.current = byName;
					return byName;
				}
				const byLang = voices.find((v) => v.lang === pref);
				if (byLang) {
					console.log(`[ListenButton] Selected voice by lang: ${pref}`);
					selectedVoiceRef.current = byLang;
					return byLang;
				}
			}

			// Fallback: any en-US voice
			const enVoice = voices.find(
				(v) => v.lang && v.lang.toLowerCase().startsWith('en-us')
			);
			if (enVoice) {
				console.log(`[ListenButton] Selected fallback en-US voice: ${enVoice.name}`);
				selectedVoiceRef.current = enVoice;
				return enVoice;
			}

			// Fallback: first available voice
			if (voices[0]) {
				console.log(`[ListenButton] Selected first available voice: ${voices[0].name}`);
				selectedVoiceRef.current = voices[0];
				return voices[0];
			}

			return null;
		} catch (err) {
			console.error('[ListenButton] Error selecting preferred voice', err);
			return null;
		}
	}

	// Start reading the text aloud
	const handleListen = () => {
		try {
			if (!window.speechSynthesis) {
				console.error('[ListenButton] Web Speech API not available');
				return;
			}

			// Cancel any ongoing speech
			window.speechSynthesis.cancel();
			console.log('[ListenButton] Starting speech synthesis');

			// Create utterance
			const utterance = new window.SpeechSynthesisUtterance(text);

			// Set preferred voice if available
			const voice = getPreferredVoice();
			if (voice) {
				utterance.voice = voice;
			} else {
				console.log('[ListenButton] No voice selected, using browser default');
			}

			// Configure utterance properties
			utterance.pitch = 1.25;

			// Set event handlers
			utterance.onstart = () => {
				console.log('[ListenButton] Speech started');
				setIsSpeaking(true);
			};

			utterance.onend = () => {
				console.log('[ListenButton] Speech ended');
				setIsSpeaking(false);
			};

			utterance.onerror = (event) => {
				console.error(`[ListenButton] Speech synthesis error: ${event.error}`);
				setIsSpeaking(false);
			};

			// Attempt to speak
			window.speechSynthesis.speak(utterance);
		} catch (err) {
			console.error('[ListenButton] Error in handleListen', err);
			setIsSpeaking(false);
		}
	};

	// Stop reading aloud
	const handleStop = () => {
		try {
			window.speechSynthesis.cancel();
			console.log('[ListenButton] Speech stopped by user');
			setIsSpeaking(false);
		} catch (err) {
			console.error('[ListenButton] Error in handleStop', err);
		}
	};

	// Only render button when: component is mounted, API is supported, and voices are loaded
	if (!mounted || !isSupported || !voicesLoaded) {
		return null;
	}

	return (
		<button
			className={
				isSpeaking
					? `${styles.listenButton} ${styles.speaking}`
					: styles.listenButton
			}
			onClick={isSpeaking ? handleStop : handleListen}
			type='button'
			aria-pressed={isSpeaking}
			aria-label={isSpeaking ? 'Stop reading' : 'Play reading'}
		>
			{/* Icon: Play when idle, Stop when speaking */}
			<span
				aria-hidden='true'
				style={{
					marginRight: '0.5em',
					display: 'inline-flex',
					alignItems: 'center',
				}}
			>
				<FontAwesomeIcon icon={isSpeaking ? faStop : faPlay} />
			</span>
			{/* Button label */}
			{isSpeaking ? 'stop' : 'listen'}
		</button>
	);
};

export default ListenButton;
