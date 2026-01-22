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
 * Renders a button that reads text aloud using the Web Speech API.
 * Only displays when the API is available and voices are loaded.
 * Automatically cancels speech on unmount to prevent audio persisting across navigation.
 */
const ListenButton: React.FC<ListenButtonProps> = ({ text }) => {
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [isSupported, setIsSupported] = useState(false);
	const [voicesLoaded, setVoicesLoaded] = useState(false);

	const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
	const isIntentionalStopRef = useRef(false);

	// Preferred voice order: UK voices first, then US, with lang codes as fallback
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

	// Check API support and handle cleanup on unmount
	useEffect(() => {
		const isAvailable = !!window.speechSynthesis;
		setIsSupported(isAvailable);

		if (!isAvailable) return;

		// Cancel any lingering speech on unmount
		return () => {
			try {
				window.speechSynthesis?.cancel();
			} catch (err) {
				console.error('[ListenButton] Failed to cancel speech on unmount', err);
			}
		};
	}, []);

	// Load voices asynchronously
	useEffect(() => {
		if (!isSupported) return;

		const updateVoiceStatus = () => {
			const voices = window.speechSynthesis?.getVoices?.() || [];
			setVoicesLoaded(voices.length > 0);
		};

		// Try immediately in case voices are already loaded
		updateVoiceStatus();

		// Listen for delayed voice loading
		window.speechSynthesis?.addEventListener('voiceschanged', updateVoiceStatus);
		return () => {
			window.speechSynthesis?.removeEventListener('voiceschanged', updateVoiceStatus);
		};
	}, [isSupported]);

	const selectVoice = (): SpeechSynthesisVoice | undefined => {
		const voices = window.speechSynthesis?.getVoices?.() || [];
		if (!voices.length) return undefined;

		// Try to match by exact name first
		for (const pref of preferredVoices) {
			const match = voices.find((v) => v.name === pref || v.lang === pref);
			if (match) return match;
		}

		// Fallback to any en-US voice
		const enUsVoice = voices.find((v) =>
			v.lang?.toLowerCase().startsWith('en-us')
		);
		return enUsVoice || voices[0];
	};

	const handleListen = () => {
		try {
			if (!window.speechSynthesis) return;

			window.speechSynthesis.cancel();
			const utterance = new window.SpeechSynthesisUtterance(text);
			utteranceRef.current = utterance;

			const voice = selectVoice();
			if (voice) utterance.voice = voice;
			utterance.pitch = 1.25;

			utterance.onstart = () => setIsSpeaking(true);

			utterance.onend = () => {
				utteranceRef.current = null;
				setIsSpeaking(false);
			};

			utterance.onerror = (event) => {
				// "interrupted" is expected when user stops playback
				if (event.error !== 'interrupted') {
					console.error(
						`[ListenButton] Speech synthesis error: ${event.error}`
					);
				}
				utteranceRef.current = null;
				setIsSpeaking(false);
			};

			window.speechSynthesis.speak(utterance);
		} catch (err) {
			console.error('[ListenButton] Failed to start speech synthesis', err);
			setIsSpeaking(false);
		}
	};

	const handleStop = () => {
		try {
			isIntentionalStopRef.current = true;
			window.speechSynthesis.cancel();
			setIsSpeaking(false);
		} catch (err) {
			console.error('[ListenButton] Failed to stop speech', err);
		} finally {
			setTimeout(() => {
				isIntentionalStopRef.current = false;
			}, 0);
		}
	};

	if (!isSupported || !voicesLoaded) return null;

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
			{isSpeaking ? 'stop' : 'listen'}
		</button>
	);
};

export default ListenButton;
