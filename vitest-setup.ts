// Vitest config
import '@testing-library/jest-dom/vitest';

// Provide lightweight, overridable global mocks for browser APIs used in component tests.
// Tests can still override these globals when they need to assert specific behaviour.
// These are intentionally minimal to avoid coupling test behavior to real browser implementations.
const fakeVoices = [{ name: 'Google US English', lang: 'en-US' }];

// Minimal speechSynthesis mock
if (typeof (globalThis as any).speechSynthesis === 'undefined') {
	(globalThis as any).speechSynthesis = {
		getVoices: () => fakeVoices,
		speak: (utt: any) => {
			// Invoke lifecycle handlers if present so components relying on them update state
			try {
				utt.onstart?.();
				// end asynchronously to mimic real behavior
				setTimeout(() => utt.onend?.(), 0);
			} catch (e) {
				// noop
			}
		},
		cancel: () => {
			return;
		},
	} as any;
}

// Minimal SpeechSynthesisUtterance constructor
if (typeof (globalThis as any).SpeechSynthesisUtterance === 'undefined') {
	(globalThis as any).SpeechSynthesisUtterance = function (
		this: any,
		text?: string
	) {
		this.text = text;
		this.voice = undefined;
		this.pitch = undefined;
		this.onstart = undefined;
		this.onend = undefined;
		this.onerror = undefined;
	} as any;
}

// Minimal IntersectionObserver mock
if (typeof (globalThis as any).IntersectionObserver === 'undefined') {
	class MockIntersectionObserver {
		_cb: any;
		constructor(cb: any) {
			this._cb = cb;
		}
		observe() {
			return;
		}
		unobserve() {
			return;
		}
		disconnect() {
			return;
		}
		takeRecords() {
			return [] as any[];
		}
	}
	(globalThis as any).IntersectionObserver = MockIntersectionObserver;
}
