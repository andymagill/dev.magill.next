---
title: Strip Debug Logs at Build Time with Next.js Compiler Options
description: Remove debug console calls at build time so production bundles never ship noisy or sensitive logs. This guide shows a simple Next.js compiler-based approach and contrasts it with a runtime logging guard.
image: /images/blog/strip-logs.jpg
tags: JavaScript, Next.js, Build, Observability
created: 1757001185
lastUpdated:
---

I never thought I would recommend anyone get into stripping, but sometimes you gotta do what you gotta do. My [last article](/post/javascript-debugging-utility-to-guard-noisy-production-consoles) described a tamer approach, runtime guarding of debug logs. But if you really want clean logs and easier debugging, the simplest solution might just be to remove debug calls during the build process. Instead of wrapping every `console.debug()` in guards at runtime, you can tell the Next.js compiler to strip them out when you create your production build.

## Why build-time removal?

- Zero runtime overhead — no environment checks on every call.
- Debug statements can't accidentally leak because they're not in the final bundle.
- Keeps source code readable without littering it with guards.

This is a lot simpler than the [runtime-guarded logger in my previous article](/post/javascript-debugging-utility-to-guard-noisy-production-consoles), which keeps calls in the bundle but silences them in production. Build-time removal deletes the calls from the bundle entirely — more permanent, less flexible.

## Next.js compiler: removeConsole

Next.js exposes a compiler option that can remove console calls during the build. You don't need Babel or a Webpack plugin for this — the compiler can do it for us. I just need to update the `next.config.js` file:

```javascript
// filepath: /next.config.js
module.exports = {
	compiler: {
		// Remove console.* calls in production, but keep error and warn
		removeConsole:
			process.env.NODE_ENV === 'production'
				? { exclude: ['error', 'warn'] }
				: false,
	},
};
```

Next time you build with this config, _console.log_, _console.debug_, and _console.info_ will be removed from the built client bundles, while _console.error_ and _console.warn_ remain in the shipped code.

## Benefits vs runtime guarding

- No more runtime checks, smaller/cleaner production bundles.
- Impossible to accidentally log sensitive values in production because the code is removed.
- Simple configuration in next.config.js — no extra plugins or custom code.

## When to pick which

- Use the Next.js compiler removeConsole when you want absolute assurance that debug/log calls never reach production
- Use a runtime-guarded logger when you require strict code consistency across environments, or want the ability to control debug logic dynamically.

## Closing Tag

Both approaches are valid for different scenarios, and each developer will have their own preference. If your priority is safety and zero risk of leaking debug output, strip logs at build time with the Next.js compiler. If you want flexibility and occasional production introspection, consider keeping the runtime guard and a central logger.

## References

- **Console API** — MDN Web Docs  
  https://developer.mozilla.org/en-US/docs/Web/API/Console

- **Next.js: Compiler** — removeConsole option
  https://nextjs.org/docs/advanced-features/compiler
