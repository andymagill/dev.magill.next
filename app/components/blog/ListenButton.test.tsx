/// <reference types="vitest" />
import React from 'react';
import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from '@testing-library/react';
import ListenButton from './ListenButton';
import { vi, describe, beforeEach, test, expect } from 'vitest';

describe('ListenButton', () => {
	beforeEach(() => {
		// Ensure a clean global state for each test
		delete (window as any).speechSynthesis;
		delete (window as any).SpeechSynthesisUtterance;
		vi.restoreAllMocks();
	});

	test('renders nothing when speechSynthesis is unsupported', async () => {
		// Ensure speechSynthesis is undefined
		delete (window as any).speechSynthesis;
		const { container } = render(<ListenButton text='hello world' />);
		// Button should not render at all since API is not supported
		expect(container.querySelector('button')).toBeNull();
	});

	test('shows processing state and transitions to speaking', async () => {
		const mockCancel = vi.fn();
		let onStartCallback: (() => void) | undefined;
		let onEndCallback: (() => void) | undefined;
		const mockSpeak = vi.fn((utt: any) => {
			// Store callbacks for later invocation
			onStartCallback = () => utt.onstart?.();
			onEndCallback = () => utt.onend?.();
			setTimeout(
				() =>
					act(() => {
						onStartCallback?.();
						setTimeout(() => act(() => onEndCallback?.()), 10);
					}),
				50
			);
		});

		const voices = [{ name: 'Google US English', lang: 'en-US' }];

		const voicesChangedCallbacks: Function[] = [];

		(window as any).speechSynthesis = {
			getVoices: () => voices,
			speak: mockSpeak,
			cancel: mockCancel,
			addEventListener: vi.fn((event: string, callback: Function) => {
				// Store voiceschanged callback to trigger it manually
				if (event === 'voiceschanged') {
					voicesChangedCallbacks.push(callback);
				}
			}),
			removeEventListener: vi.fn(),
		} as any;

		(window as any).SpeechSynthesisUtterance = function (
			this: any,
			text: string
		) {
			this.text = text;
			this.voice = undefined;
			this.pitch = undefined;
			this.rate = undefined;
			this.onstart = undefined;
			this.onend = undefined;
			this.onerror = undefined;
		} as any;

		render(<ListenButton text='hello world' />);

		// Manually trigger voiceschanged callbacks to ensure voicesReady is set
		act(() => {
			voicesChangedCallbacks.forEach((cb) => cb());
		});

		const button = await waitFor(() => {
			const btn = screen.getByRole('button');
			expect(btn).not.toBeDisabled();
			return btn;
		});

		// Click to start
		fireEvent.click(button);

		// Should show processing state immediately
		expect(button).toHaveTextContent('processing...');

		// Wait for transition to speaking
		await waitFor(() => {
			expect(button).toHaveTextContent('stop');
		});
	});

	test('prevents playback of empty text', async () => {
		const mockSpeak = vi.fn();

		const voices = [{ name: 'Google US English', lang: 'en-US' }];

		(window as any).speechSynthesis = {
			getVoices: () => voices,
			speak: mockSpeak,
			cancel: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		} as any;

		(window as any).SpeechSynthesisUtterance = function () {
			this.onstart = undefined;
			this.onend = undefined;
			this.onerror = undefined;
		} as any;

		render(<ListenButton text='' />);

		const button = await waitFor(() => {
			const btn = screen.getByRole('button');
			expect(btn).not.toBeDisabled();
			return btn;
		});

		fireEvent.click(button);

		// Should not call speak
		expect(mockSpeak).not.toHaveBeenCalled();

		// Should show error
		const alert = screen.getByRole('alert');
		expect(alert).toHaveTextContent('No content to read');
	});

	test('truncates very large text', async () => {
		const mockSpeak = vi.fn((utt: any) => {
			act(() => utt.onstart?.());
			setTimeout(() => act(() => utt.onend?.()), 10);
		});

		const voices = [{ name: 'Google US English', lang: 'en-US' }];

		(window as any).speechSynthesis = {
			getVoices: () => voices,
			speak: mockSpeak,
			cancel: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		} as any;

		(window as any).SpeechSynthesisUtterance = function (
			this: any,
			text: string
		) {
			this.text = text;
		} as any;

		const largeText = 'a'.repeat(10000);
		render(<ListenButton text={largeText} />);

		const button = await waitFor(() => {
			const btn = screen.getByRole('button');
			expect(btn).not.toBeDisabled();
			return btn;
		});

		fireEvent.click(button);

		// Wait a tick
		await new Promise((r) => setTimeout(r, 50));

		expect(mockSpeak).toHaveBeenCalled();
		const utterance = mockSpeak.mock.calls[0][0];
		// With chunking, each utterance should be under 4000 chars, not truncated at 5000
		expect(utterance.text.length).toBeLessThanOrEqual(4000);
	});

	test('splits large text into multiple chunks and plays sequentially', async () => {
		const mockSpeak = vi.fn((utt: any) => {
			act(() => utt.onstart?.());
			setTimeout(() => act(() => utt.onend?.()), 10);
		});

		const voices = [{ name: 'Google US English', lang: 'en-US' }];

		(window as any).speechSynthesis = {
			getVoices: () => voices,
			speak: mockSpeak,
			cancel: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		} as any;

		(window as any).SpeechSynthesisUtterance = function (
			this: any,
			text: string
		) {
			this.text = text;
		} as any;

		// Create a large text with clear sentence boundaries
		const largeText = 'This is a sentence. '.repeat(250); // ~5000 chars with periods
		render(<ListenButton text={largeText} />);

		const button = await waitFor(() => {
			const btn = screen.getByRole('button');
			expect(btn).not.toBeDisabled();
			return btn;
		});

		fireEvent.click(button);

		// Wait for all utterances to be queued
		await new Promise((r) => setTimeout(r, 100));

		// Should be called multiple times for chunks
		expect(mockSpeak.mock.calls.length).toBeGreaterThan(1);

		// Each utterance should be under 4000 chars
		mockSpeak.mock.calls.forEach((call) => {
			const utterance = call[0];
			expect(utterance.text.length).toBeLessThanOrEqual(4000);
		});
	});

	test('cancels speech and cleans up on unmount', async () => {
		const mockCancel = vi.fn();
		const mockSpeak = vi.fn();

		const voices = [{ name: 'Google US English', lang: 'en-US' }];

		(window as any).speechSynthesis = {
			getVoices: () => voices,
			speak: mockSpeak,
			cancel: mockCancel,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		} as any;

		(window as any).SpeechSynthesisUtterance = function () {
			this.onstart = undefined;
		} as any;

		const { unmount } = render(<ListenButton text='test' />);

		unmount();

		expect(mockCancel).toHaveBeenCalled();
	});
});
