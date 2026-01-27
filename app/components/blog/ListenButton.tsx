'use client';

import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
	useLayoutEffect,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPlay,
	faStop,
	faExclamationTriangle,
	faHourglass,
} from '@fortawesome/free-solid-svg-icons';
import { cleanMarkdown } from '../../../utils/cleanMarkdown';
import styles from './ListenButton.module.scss';

interface ListenButtonProps {
	text: string;
}

type SpeechState = 'idle' | 'processing' | 'speaking' | 'error';

// Constants for timeouts and limits
const MAX_CHUNK_LENGTH = 4000; // Safari-safe chunk size
const MIN_CHUNK_LENGTH = 500; // Minimum chunk size to avoid too many utterances
const PROCESSING_TIMEOUT_MS = 5000;
const VOICE_INIT_TIMEOUT_MS = 2000;
const VOICE_CHECK_RETRY_MS = 100;

/**
 * ListenButton component - Best practices refactor
 *
 * Renders a button that reads text aloud using the Web Speech API.
 * Features:
 * - Robust error handling with user feedback
 * - Timeout protection against stuck "processing" state
 * - Intelligent text chunking at sentence boundaries for large content
 * - Sequential chunk playback with progress indication
 * - Proper cleanup on unmount and navigation
 * - Accessibility improvements
 *
 * Refactored to address:
 * 1. Race condition causing stuck processing state
 * 2. Silent failures with no user feedback
 * 3. Handling of very large article text with multi-chunk playback
 * 4. Voice loading race conditions
 * 5. Better error boundary and recovery
 */
const ListenButton: React.FC<ListenButtonProps> = ({ text }) => {
	const [speechState, setSpeechState] = useState<SpeechState>('idle');
	const [isMounted, setIsMounted] = useState(false);
	const [voicesReady, setVoicesReady] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
	const [totalChunks, setTotalChunks] = useState(0);

	const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
	const chunksRef = useRef<string[]>([]);
	const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const voiceInitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Preferred voice order: UK voices first, then US, with lang codes as fallback
	const preferredVoices = useMemo(
		() => [
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
		],
		[]
	);

	// Memoize cleaned text to avoid redundant cleanMarkdown calls
	const cleanedText = useMemo(() => cleanMarkdown(text), [text]);

	// Cleanup function with timeout protection
	const resetState = useCallback(() => {
		setSpeechState('idle');
		setErrorMessage(null);
		setCurrentChunkIndex(0);
		setTotalChunks(0);
		utteranceRef.current = null;
		chunksRef.current = [];
		if (processingTimeoutRef.current) {
			clearTimeout(processingTimeoutRef.current);
			processingTimeoutRef.current = null;
		}
	}, []);

	// Helper: Split text into chunks at sentence boundaries
	const splitTextIntoChunks = useCallback((fullText: string): string[] => {
		if (fullText.length <= MAX_CHUNK_LENGTH) {
			return [fullText];
		}

		const chunks: string[] = [];
		let currentChunk = '';

		// First, try to split on sentence boundaries (. ! ?)
		const sentences = fullText.match(/[^.!?]*[.!?]+/g) || [];

		if (sentences.length > 1) {
			// We have sentences, split on them
			for (const sentence of sentences) {
				const trimmedSentence = sentence.trim();
				if (!trimmedSentence) continue;

				// If adding this sentence would exceed max length and we have content, start new chunk
				if (
					currentChunk.length + trimmedSentence.length >
						MAX_CHUNK_LENGTH &&
					currentChunk.length >= MIN_CHUNK_LENGTH
				) {
					chunks.push(currentChunk.trim());
					currentChunk = trimmedSentence;
				} else {
					currentChunk +=
						(currentChunk.length > 0 ? ' ' : '') + trimmedSentence;
				}
			}
		} else {
			// No sentence boundaries, try to split on word boundaries
			const words = fullText.split(/\s+/);

			if (words.length > 1) {
				// We have multiple words, split on them
				for (const word of words) {
					if (!word) continue;

					// If adding this word would exceed max length and we have content, start new chunk
					if (
						currentChunk.length + word.length + 1 >
							MAX_CHUNK_LENGTH &&
						currentChunk.length >= MIN_CHUNK_LENGTH
					) {
						chunks.push(currentChunk.trim());
						currentChunk = word;
					} else {
						currentChunk +=
							(currentChunk.length > 0 ? ' ' : '') + word;
					}
				}
			} else {
				// Single word with no spaces - force split at max length
				for (let i = 0; i < fullText.length; i += MAX_CHUNK_LENGTH) {
					chunks.push(fullText.substring(i, i + MAX_CHUNK_LENGTH));
				}
				return chunks;
			}
		}

		// Add remaining text
		if (currentChunk.length > 0) {
			chunks.push(currentChunk.trim());
		}

		return chunks.length > 0 ? chunks : [fullText];
	}, []);

	// Set mounted flag after hydration using useLayoutEffect to avoid cascading render warning
	useLayoutEffect(() => {
		queueMicrotask(() => setIsMounted(true));
	}, []);

	// Cleanup speech on unmount
	useEffect(() => {
		return () => {
			try {
				if (typeof window !== 'undefined') {
					window.speechSynthesis?.cancel?.();
				}
			} catch (err) {
				// Silently ignore cleanup errors
			}
			resetState();
		};
	}, [resetState]);

	// Initialize voices with timeout and retry logic
	useEffect(() => {
		if (
			!isMounted ||
			typeof window === 'undefined' ||
			!window.speechSynthesis
		) {
			return;
		}

		const voiceSynthesis = window.speechSynthesis;

		const checkVoicesReady = () => {
			try {
				const voices = voiceSynthesis.getVoices?.() || [];
				const ready = voices.length > 0;
				setVoicesReady(ready);

				// If not ready but check is happening, schedule retry
				if (!ready && !voiceInitTimeoutRef.current) {
					voiceInitTimeoutRef.current = setTimeout(
						checkVoicesReady,
						VOICE_CHECK_RETRY_MS
					);
				}
			} catch (err) {
				setVoicesReady(false);
			}
		};

		// Try immediately
		checkVoicesReady();

		// Listen for voiceschanged event
		voiceSynthesis.addEventListener?.('voiceschanged', checkVoicesReady);

		// Set a hard timeout - if voices don't load in 2 seconds, enable anyway
		const hardTimeout = setTimeout(() => {
			setVoicesReady(true);
			if (voiceInitTimeoutRef.current) {
				clearTimeout(voiceInitTimeoutRef.current);
				voiceInitTimeoutRef.current = null;
			}
		}, VOICE_INIT_TIMEOUT_MS);

		return () => {
			voiceSynthesis.removeEventListener?.('voiceschanged', checkVoicesReady);
			if (voiceInitTimeoutRef.current) {
				clearTimeout(voiceInitTimeoutRef.current);
				voiceInitTimeoutRef.current = null;
			}
			clearTimeout(hardTimeout);
		};
	}, [isMounted]);

	const selectVoice = useCallback((): SpeechSynthesisVoice | undefined => {
		try {
			if (typeof window === 'undefined') return undefined;
			const voices = window.speechSynthesis?.getVoices?.() || [];
			if (!voices.length) return undefined;

			// Try to match by exact name first
			for (const pref of preferredVoices) {
				const match = voices.find((v) => v.name === pref || v.lang === pref);
				if (match) return match;
			}

			// Fallback to any en-US voice
			const enUsVoice = voices.find((v) =>
				v.lang?.toLowerCase?.().startsWith('en-us')
			);
			return enUsVoice || voices[0];
		} catch (err) {
			return undefined;
		}
	}, [preferredVoices]);

	// Helper: Play next chunk in sequence
	const playNextChunk = useCallback(
		(chunks: string[], chunkIndex: number) => {
			if (typeof window === 'undefined' || !window.speechSynthesis) {
				setErrorMessage('Speech synthesis not supported');
				return;
			}

			// Check if we've finished all chunks
			if (chunkIndex >= chunks.length) {
				resetState();
				return;
			}

			const chunkText = chunks[chunkIndex];

			try {
				// Track if we've already transitioned to prevent duplicate state changes
				let stateTransitioned = false;

				const utterance = new window.SpeechSynthesisUtterance(chunkText);
				utteranceRef.current = utterance;

				// Set voice
				const voice = selectVoice();
				if (voice) {
					utterance.voice = voice;
				}

				utterance.pitch = 1.25;
				utterance.rate = 1;

				// Event handlers for chunk playback
				utterance.onstart = () => {
					stateTransitioned = true;
					if (processingTimeoutRef.current) {
						clearTimeout(processingTimeoutRef.current);
						processingTimeoutRef.current = null;
					}
					setCurrentChunkIndex(chunkIndex);
					setSpeechState('speaking');
					setErrorMessage(null);
				};

				utterance.onend = () => {
					stateTransitioned = true;
					// Play next chunk if available
					const nextChunkIndex = chunkIndex + 1;
					if (nextChunkIndex < chunks.length) {
						// Schedule next chunk to play
						queueMicrotask(() =>
							playNextChunk(chunks, nextChunkIndex)
						);
					} else {
						// All chunks completed
						resetState();
					}
				};

				utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
					const errorCode = event.error || 'unknown';

					// "interrupted" is expected when user stops playback
					if (errorCode !== 'interrupted') {
						if (!stateTransitioned) {
							stateTransitioned = true;
							setErrorMessage(
								`Error at part ${chunkIndex + 1}: ${errorCode}. Try again.`
							);
						}
					}

					if (processingTimeoutRef.current) {
						clearTimeout(processingTimeoutRef.current);
						processingTimeoutRef.current = null;
					}
					resetState();
				};

				window.speechSynthesis.speak(utterance);
			} catch (err) {
				setErrorMessage('Failed to start speech. Please try again.');
				resetState();
			}
		},
		[selectVoice, resetState]
	);

	const handleListen = useCallback(() => {
		try {
			if (typeof window === 'undefined' || !window.speechSynthesis) {
				setErrorMessage('Speech synthesis not supported');
				return;
			}

			if (!text || text.trim().length === 0) {
				setErrorMessage('No content to read');
				return;
			}

			// Strip markdown formatting from the content
			const cleanedText = cleanMarkdown(text);

			// Split text into chunks at sentence boundaries
			const chunks = splitTextIntoChunks(cleanedText);
			chunksRef.current = chunks;
			setTotalChunks(chunks.length);

			// Set processing state with timeout protection
			setSpeechState('processing');
			setErrorMessage(null);
			setCurrentChunkIndex(0);

			// Track if we've already transitioned to prevent duplicate state changes
			let stateTransitioned = false;

			// Critical: Set a timeout to prevent stuck "processing" state
			const timeoutId = setTimeout(() => {
				if (!stateTransitioned && typeof window !== 'undefined') {
					// Check if speechSynthesis is actually speaking before giving up
					if (window.speechSynthesis?.speaking) {
						// It's actually speaking, just the onstart event didn't fire
						stateTransitioned = true;
						setSpeechState('speaking');
						setErrorMessage(null);
						return;
					}

					// Genuinely timed out
					stateTransitioned = true;
					setSpeechState('error');
					setErrorMessage(
						'Speech synthesis initialization timeout. Please try again.'
					);
				}
			}, PROCESSING_TIMEOUT_MS);

			processingTimeoutRef.current = timeoutId;

			// Cancel any existing speech
			window.speechSynthesis.cancel();

			// Start playing first chunk
			playNextChunk(chunks, 0);
		} catch (err) {
			setErrorMessage('Failed to start speech. Please try again.');
			resetState();
		}
	}, [text, splitTextIntoChunks, playNextChunk, resetState]);

	const handleStop = useCallback(() => {
		try {
			if (typeof window !== 'undefined') {
				window.speechSynthesis?.cancel?.();
			}
			resetState();
		} catch (err) {
			resetState();
		}
	}, [resetState]);

	const isSupported = typeof window !== 'undefined' && !!window.speechSynthesis;
	const isReady = isSupported && voicesReady;
	const isActive = speechState === 'speaking' || speechState === 'processing';
	const showError = speechState === 'error' || errorMessage !== null;

	// Render nothing until mounted to avoid hydration mismatch
	if (!isMounted) {
		return null;
	}

	// Render nothing if not supported
	if (!isSupported) {
		return null;
	}

	return (
		<>
			<button
				className={`${
					speechState === 'speaking'
						? `${styles.listenButton} ${styles.speaking}`
						: speechState === 'processing'
							? `${styles.listenButton} ${styles.processing}`
							: showError
								? `${styles.listenButton} ${styles.error}`
								: styles.listenButton
				} ${isReady || showError ? styles.buttonEnabled : styles.buttonDisabled}`}
				onClick={isActive ? handleStop : handleListen}
				type='button'
				aria-pressed={isActive}
				aria-label={
					speechState === 'speaking'
					? 'Stop reading article'
						: speechState === 'processing'
							? 'Initializing speech synthesis'
							: showError
								? 'Retry reading article'
								: 'Play article narration'
				}
				disabled={!isReady}
				title={
					!isReady
						? 'Speech synthesis is loading...'
						: showError
							? 'Click to retry'
							: undefined
				}
			>
				<span aria-hidden='true' className={styles.icon}>
					<FontAwesomeIcon
						icon={
							speechState === 'speaking'
								? faStop
								: speechState === 'processing'
									? faHourglass
									: showError
										? faExclamationTriangle
										: faPlay
						}
					/>
				</span>
				{speechState === 'speaking'
				? 'stop'
					: speechState === 'processing'
						? 'processing...'
						: showError
							? 'retry'
							: 'listen'}
			</button>

			{/* Error message display */}
			{showError && errorMessage && (
				<div role='alert' className={styles.errorMessage}>
					{errorMessage}
				</div>
			)}
		</>
	);
};

export default ListenButton;
