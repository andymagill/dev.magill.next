#!/usr/bin/env node
const { spawn } = require('child_process');

// Message substring to filter from Vitest/Vite output
const FILTER = "The CJS build of Vite's Node API is deprecated";

const args = process.argv.slice(2);
// Default to --run flag (exit after tests) unless watching is explicitly requested
const hasWatchFlag = args.includes('--watch') || args.includes('-w');
const vitestArgs = hasWatchFlag ? args : ['--run', ...args];
// Prefer local binary if available. Use a shell on Windows to avoid EINVAL
// when spawning .cmd shims (spawn of .cmd can fail on some Node/Windows setups).
const cmd = 'npx';
const cp = spawn(cmd, ['vitest', ...vitestArgs], {
	stdio: ['inherit', 'pipe', 'pipe'],
	shell: true,
});

function filterAndPrint(stream, dest) {
	stream.on('data', (chunk) => {
		const text = String(chunk);
		const lines = text.split(/\r?\n/).filter(Boolean);
		for (const line of lines) {
			if (line.includes(FILTER)) continue;
			dest.write(line + '\n');
		}
	});
}

filterAndPrint(cp.stdout, process.stdout);
filterAndPrint(cp.stderr, process.stderr);

cp.on('close', (code) => {
	process.exit(code);
});
