'use client';

import React, { useState, useEffect } from 'react';
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
 * Cancels speech on mount/unmount to prevent speech from persisting across navigation.
 */
const ListenButton: React.FC<ListenButtonProps> = ({ text }) => {
	// Track whether speech synthesis is currently active
	const [isSpeaking, setIsSpeaking] = useState(false);
	// Initialize support at first render instead of setting state inside an effect
	const [speechSupported] = useState(
		() => typeof window !== 'undefined' && !!window.speechSynthesis
	);

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

	// Only perform mount/unmount side-effects here (do not set state)
	useEffect(() => {
		window.speechSynthesis?.cancel();
		return () => {
			window.speechSynthesis?.cancel();
		};
	}, []);

	// Helper to select the best available voice
	function getPreferredVoice() {
		const voices = window.speechSynthesis?.getVoices?.() || [];
		// Try to find a preferred voice by name or lang
		for (const pref of preferredVoices) {
			const byName = voices.find((v) => v.name === pref);
			if (byName) return byName;
			const byLang = voices.find((v) => v.lang === pref);
			if (byLang) return byLang;
		}
		// Fallback: any en-US voice
		const enVoice = voices.find(
			(v) => v.lang && v.lang.toLowerCase().startsWith('en-us')
		);
		if (enVoice) return enVoice;
		// Fallback: first available
		return voices[0];
	}

	// Start reading the text aloud
	const handleListen = () => {
		if (!window.speechSynthesis) return;
		window.speechSynthesis.cancel(); // Stop any ongoing speech
		const utterance = new window.SpeechSynthesisUtterance(text);
		// Set preferred voice if available
		const voice = getPreferredVoice();
		if (voice) utterance.voice = voice;
		utterance.pitch = 1.25;
		utterance.onstart = () => setIsSpeaking(true);
		utterance.onend = () => setIsSpeaking(false);
		utterance.onerror = () => setIsSpeaking(false);
		window.speechSynthesis.speak(utterance);
	};

	// Stop reading aloud
	const handleStop = () => {
		window.speechSynthesis.cancel();
		setIsSpeaking(false);
	};

	if (!speechSupported) return null;

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
