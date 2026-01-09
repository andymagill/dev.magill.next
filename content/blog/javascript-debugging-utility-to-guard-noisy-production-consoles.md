---
title: Creating a JavaScript Debugging Utility to Guard Noisy Production Consoles
description: Stop drowning in console logs. Keep your production console clean and actionable. This guide introduces a simple JavaScript debugging utility to quiet noisy production environments and streamline your workflow.
image: /images/blog/console-guarding.jpg
tags: JavaScript, Debugging, Observability
created: 1756928574
lastUpdated:
---

The first step to recovery is admitting you have a problem. It starts with one `console.log()` and next thing you know, the console looks like an index of real world customer data. I don't want to feel like I work in a digital junkyard, so I built a reusable JavaScript logger utility that's ready for any environment, and knows when to shut up.

## The Solution: A Production-Guarded Logger

Creating a function that wraps `console.log()` gives us a single point of control for all our future logging needs. The most complex part of this function is a simple environment check. A lot of build tools like Webpack or Vite can inject a `process.env.NODE_ENV` variable that can be either _'development'_ or _'production'_. We'll use that to control logging behavior.

```javascript
class Logger {
	log(message, ...optionalParams) {
		if (process.env.NODE_ENV !== 'production') {
			const timestamp = new Date().toISOString();
			console.log(`[${timestamp}]`, message, ...optionalParams);
		}
	}
}
```

Now our new logging buddy will automatically go quiet in a live environment!

## **Adding Bells and Whistles**

If we want a truly useful logger, we should match the different levels of severity that what we have with the native `console` object. There's **info**, **warn**, **error**, and **debug**, each with a specific purpose. A single log function could take a level argument, a message, and dispatch the corresponding console method:

```javascript
const logger = (() => {
	// Check the environment once
	const isProd = process.env.NODE_ENV === 'production';

	// Return an object with methods for each log level
	return {
		debug: (message, ...optionalParams) => {
			if (!isProd) {
				console.debug('DEBUG:', message, ...optionalParams);
			}
		},
		info: (message, ...optionalParams) => {
			console.info('INFO:', message, ...optionalParams);
		},
		warn: (message, ...optionalParams) => {
			console.warn('WARN:', message, ...optionalParams);
		},
		error: (message, ...optionalParams) => {
			console.error('ERROR:', message, ...optionalParams);
		},
	};
})();
```

Notice I'm now using arrow functions to return the object methods, within an immediately invoking function so lazy me doesn't even need to initialize it. Also, I only production-guarded _debug_ messages, while _info_, _warn_, and _error_ remain active since they are typically useful for monitoring. Now I've got a rock solid, reusable logger I can use throughout my application.

```javascript
// Example usage:
logger.info('Flooding Torpedo Tubes...');
logger.debug('A secret value:', mySecretVariable);
logger.warn("Don't touch that!");
logger.error('Goodbye World!');
```

## The Closing Tag

Spending a little time to create a centralized logger, I've made my codebase cleaner and debugging life a lot easier. Now, I have a single place to control logging and maintain debugging consistency thoughout my application code. It's a simple change that helps improve the overall health of my projects.

## References

- **Console API** — MDN Web Docs  
  https://developer.mozilla.org/en-US/docs/Web/API/Console

- **process.env (Node.js)** — Node.js Documentation  
  https://nodejs.org/api/process.html#processenv

- **Logging best practices** — The Twelve-Factor App (logs as event streams)  
  https://12factor.net/logs
