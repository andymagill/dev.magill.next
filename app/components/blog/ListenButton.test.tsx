/// <reference types="vitest" />
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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

	test('renders button and enables after voices load', async () => {
		const mockCancel = vi.fn();
		const mockSpeak = vi.fn((utt: any) => {
			act(() => utt.onstart?.());
			setTimeout(() => act(() => utt.onend?.()), 10);
		});

		const voices = [{ name: 'Google US English', lang: 'en-US' }];

		(window as any).speechSynthesis = {
			getVoices: () => voices,
			speak: mockSpeak,
			cancel: mockCancel,
			addEventListener: vi.fn(),
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

		// Wait for button to be enabled
		const button = await waitFor(
			() => {
				const btn = screen.getByRole('button');
				expect(btn).not.toBeDisabled();
				return btn;
			},
			{ timeout: 3000 }
		);

		expect(button).toBeInTheDocument();
	});

	test('shows processing state and transitions to speaking', async () => {
		const mockCancel = vi.fn();
		let onStartCallback: (() => void) | undefined;
		const mockSpeak = vi.fn((utt: any) => {
			// Store callback for later invocation
			onStartCallback = () => utt.onstart?.();
			setTimeout(() => act(() => onStartCallback?.()), 50);
		});

		const voices = [{ name: 'Google US English', lang: 'en-US' }];

		(window as any).speechSynthesis = {
			getVoices: () => voices,
			speak: mockSpeak,
			cancel: mockCancel,
			addEventListener: vi.fn(),
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

	test('shows error after processing timeout', async () => {
		const mockCancel = vi.fn();
		const mockSpeak = vi.fn((_utt: any) => {
			// Don't call onstart - simulate a stall
		});

		const voices = [{ name: 'Google US English', lang: 'en-US' }];

		(window as any).speechSynthesis = {
			getVoices: () => voices,
			speak: mockSpeak,
			cancel: mockCancel,
			addEventListener: vi.fn(),
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

		const button = await waitFor(() => {
			const btn = screen.getByRole('button');
			expect(btn).not.toBeDisabled();
			return btn;
		});

		fireEvent.click(button);
		expect(button).toHaveTextContent('processing...');

		// Wait for error message to appear (after 5 second timeout)
		await waitFor(
			() => {
				expect(button).toHaveTextContent('retry');
			},
			{ timeout: 6000 }
		);

		// Error message should be visible
		const alert = screen.getByRole('alert');
		expect(alert).toHaveTextContent('initialization timeout');
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
		expect(utterance.text.length).toBeLessThanOrEqual(5000);
	});

	test('selects a preferred voice', async () => {
		const mockSpeak = vi.fn((utt: any) => {
			act(() => utt.onstart?.());
			setTimeout(() => act(() => utt.onend?.()), 10);
		});

		const voices = [
			{ name: 'Some Voice', lang: 'en-GB' },
			{ name: 'Google US English', lang: 'en-US' },
		];

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
			this.voice = undefined;
		} as any;

		render(<ListenButton text='test voice selection' />);

		const button = await waitFor(() => {
			const btn = screen.getByRole('button');
			expect(btn).not.toBeDisabled();
			return btn;
		});

		fireEvent.click(button);

		await new Promise((r) => setTimeout(r, 50));

		expect(mockSpeak).toHaveBeenCalled();
		const utt = mockSpeak.mock.calls[0][0];
		expect(utt.voice).toBeTruthy();
		expect(/en-?us/i.test(utt.voice.lang || utt.voice.name || '')).toBeTruthy();
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

