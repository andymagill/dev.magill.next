---
title: Ship Fast, Don't Break - Safely Audit & Deploy AI-Generated Code
description: Safely audit and deploy AI-generated code by reviewing for common pitfalls like error swallowing, hallucinated APIs, and security anti-patterns.
image: /images/blog/shipwreck-don-kawahigashi.jpg
tags: AI Coding, Code Review, Testing, Best Practices
created: 1782797157
lastUpdated: 1784818519
---

AI coding agents can seem incredibly confident, even when they are entirely wrong, and their mistakes often look perfectly plausible at first glance. If you are blindly copying, pasting, and deploying, you aren't accelerating your workflow, you are just automating your future headaches. To safely harness the power of AI, we need a modernized code review process designed specifically to catch the unique logic gaps and structural flaws that a human typically does not make.

## Looks Great, Also Broken

AI-generated code fails because it is trying to sound plausible, not necessarily function well or match your codebase. Instead, it will:

- use `try/catch` and without rethrowing errors
- invent a method that doesn't exist
- remove attributes during a JSX refactor
- import the wrong symbol from the wrong dependency
- simulate but not replicate security best practices

Coding agents will be tempted to provide solutions that look good at first glance. To avoid rubber stamping future headaches, we should confirm the model understands the objective, the scenario, and the requirements.

The easiest way to think about it is this: review AI code the way you would review work from an eager junior developer — fast, useful, and occasionally wrong in predictable ways. Here is how we can spot the more common ways AI generated code can fail:

---

## 1) Silent error swallowing

AI loves to make failures disappear, and doesn't care how.

```ts
try {
	await saveDocument(payload);
} catch (error) {
	console.log('Ooppsie daisy!');
}
```

That may look right, but this code ignores important errors.

### What it looks like

- `catch` blocks that do nothing, or only `console.log`
- missing `return` after error handling
- helper functions that hide the original stack trace

### Safer version

```ts
try {
	await saveDocument(payload);
} catch (error) {
	logger.error({ error, payload }, 'saveDocument failed');
	throw error;
}
```

Don't ask if the code handles the error. What we really need is an error that useful and graceful.

---

## 2) Hallucinated APIs

Here's one of the most common AI mistakes: a method that smells okay but does not exist in the version you actually installed.

```ts
const result = await client.responses.createMessage({
	model: 'gpt-5',
	input: prompt,
});
```

That could be a real, valid API call, or very wishfully thinking from our AI coding agent.

### What it looks like

- method names that feel too convenient
- imports copied from nowhere else in the repo
- code that would compile in the model's imagination, but not here

### Safer version

- check the installed package docs for the exact version in the lockfile
- verify the symbol exists before trusting a generated call site
- if the API is new to the project, look for a working example in the codebase first

Anytime the AI wants to add a new library call, confirm it loads as expected before examining the usage.

---

## 3) Dependency drift

AI often writes code for the package ecosystem it wishes you had.

```ts
import { formatDate } from 'date-fns';
```

Maybe this is right, maybe it's complete nonsense. It could be the wrong import, wrong library, wrong versions for the job. This one is tricky to detect automagically, since the correct answer might not be readily apparent in the file being updated.

### What it looks like

- imports that do not match the rest of the repo
- package names that appear nowhere else in the codebase
- generated code that mixes old and new library styles
- small mismatches between the lockfile and the suggested API

### Safer version

- compare the generated import against existing usage in the repo
- confirm the package version and naming conventions
- check whether a local helper already exists and should be reused

Stuff that may seem quick and easy could be tech-debt in disguise if we haven't steered the coding agent with documented code standards and conventions.

---

## 4) Security anti-patterns

AI is very willing to trade safety for convenience. We humble humans are "absolutely right" to question whether our AI has considered the broader security picture.

### What it looks like

```ts
container.innerHTML = html;
```

or:

```ts
const fn = new Function(code);
fn();
```

These kinds of changes could turn a trivial update into a full security review.

### What it looks like

- `innerHTML`
- `eval`
- string-built SQL or shell commands
- missing CSRF handling
- direct insertion of untrusted input into markup

### Safer version

- render text, not HTML, unless you sanitize explicitly
- use vetted libraries for escaping and sanitizing
- route risky input through the narrowest possible interface
- treat AI-generated security code as untrusted until you verify it

Don't forget that [reviewing AI code](https://owasp.org/www-project-ai-testing-guide/) is not just about watching for anti-patterns and maintaiability, we also need to prevent new risks to application security and the software supply chain.

---

## Make the review executable

Developers can't rely on a mental checklist to find every AI coding mistake. Let's make our lives easier with a lightweight CI/CD scan to surface obvious problems to human eyes.

```yaml
name: ai-code-audit

on:
  pull_request:
    paths:
      - '**/*.ts'
      - '**/*.tsx'
      - '**/*.js'
      - '**/*.jsx'

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Check diff for common AI anti-patterns
        run: |
          git diff --unified=0 origin/${{ github.base_ref }}...HEAD > diff.txt

          if grep -E "\b(innerHTML|eval\(|new Function\(|catch \(|try \{|console\.(log|debug)\(|SELECT|INSERT|UPDATE|DELETE)" diff.txt >/dev/null; then
            echo "Possible AI anti-pattern found in diff"
            exit 1
          fi
```

This scan is just a tripwire. It does **not** understand your app, and it is not trying to. It looks for a few obvious red flags in the diff — unsafe HTML or code execution patterns, sloppy error handling with noisy logging, raw SQL queries, and accessibility-sensitive changes — then makes a person look at the change.

That is the point: catch the easy misses before they merge. It is not a substitute for real review, or a reliable way to enforce security standards in an automated workflow.

---

## Closing thought

The era of AI-assisted development isn't about working less; it's about working smarter. Treat your AI assistant like a brilliant but chronically overconfident junior developer, one whose work requires rigorous, structured oversight. By implementing a dedicated AI coding audit into your pipeline, you stop being a passive prompter and step back into the role of a true software architect. Developers who take advantage of the unprecedented velocity of these tools will need to maintain rigorous oversight to maintain production-grade quality.

---

## Related Resources

- METR study: [Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
- Uber cap coverage: [Uber caps employee AI spending after blowing through budget in four months](https://techcrunch.com/2026/06/02/uber-caps-employee-ai-spending-after-blowing-through-budget-in-four-months/)
- Stack Overflow survey: [AI | 2025 Stack Overflow Developer Survey](https://survey.stackoverflow.co/2025/ai)
- OWASP: [OWASP AI Testing Guide](https://owasp.org/www-project-ai-testing-guide/)
