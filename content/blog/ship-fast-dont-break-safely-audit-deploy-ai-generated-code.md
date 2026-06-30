---
title: Ship Fast, Don't Break - Safely Audit & Deploy AI-Generated Code
description: Safely audit and deploy AI-generated code by reviewing for common pitfalls like error swallowing, hallucinated APIs, accessibility regressions, and security anti-patterns.
image: /images/blog/shipwreck-don-kawahigashi.jpg
tags: AI Coding, Code Review, Testing, Best Practices
created: 1782797157
lastUpdated:
---

AI models are incredibly confident, even when they are entirely wrong, and their mistakes often look perfectly plausible at first glance. If you are blindly copying, pasting, and deploying, you aren't accelerating your workflow, you are just automating your future headaches. To safely harness the power of AI, you need a modernized code review process designed specifically to catch the unique logic gaps and structural flaws only a machine would make.

## Looks Great, Also Broken

AI-generated code fails because it is trying to sound plausible, not necessarily function well or match your codebase. Instead, it will:

- use `try/catch` and without rethrowing errors
- invent a method that doesn't exist
- remomve attributes during a JSX refactor
- import the wrong symbol from the wrong dependacy
- simulate but not replicate secutiry best practices

So the real question is no longer, "does this read well?"
It is: **did the model actually understand the objective, the scenario, and the requirements?**

The easiest way to think about it is this: review AI code the way you would review work from a sharp junior developer — fast, useful, and occasionally wrong in predictable ways. Here are some of the more common ways AI generated code can fail, and how to spot them:

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

The real question is not "did the code handle the error?"
It is "did it keep the failure visible and stop the bad state from spreading?"

---

## 2) Hallucinated APIs

This is one of the most common AI mistakes: a method that sounds right but does not exist in the version you actually installed.

```ts
const result = await client.responses.createMessage({
	model: 'gpt-5',
	input: prompt,
});
```

Maybe that API exists somewhere, or maybe it never existed at all.

### What it looks like

- method names that feel too convenient
- imports copied from nowhere else in the repo
- code that would compile in the model's imagination, but not here

### Safer version

- check the installed package docs for the exact version in the lockfile
- verify the symbol exists before trusting a generated call site
- if the API is new to the project, look for a working example in the codebase first

My rule is simple: **if AI introduces a new library call, verify it before anything else**.

---

## 3) Accessibility regressions

AI can refactor JSX nicely and still remove the thing a screen reader needed.

```tsx
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

turning into:

```tsx
<input type='email' placeholder='Email' />
```

The UI still works. The accessibility is worse.

### What it looks like

- removed `label` / `htmlFor` pairings
- dropped `aria-*` attributes
- buttons turned into clickable `div`s
- focus states lost during styling cleanup

### Safer version

```tsx
<label htmlFor="email">Email</label>
<input id="email" type="email" aria-describedby="email-help" />
<p id="email-help">We'll never share this address.</p>
```

If AI touches a form, modal, or navigation component, I check for a11y regressions before I read anything else.

---

## 4) Dependency drift

AI often writes code for the package ecosystem it wishes you had.

```ts
import { formatDate } from 'date-fns';
```

That might be right. It might also be the wrong import path, wrong helper, or wrong versioned API for your project.

### What it looks like

- imports that do not match the rest of the repo
- package names that appear nowhere else in the codebase
- generated code that mixes old and new library styles
- small mismatches between the lockfile and the suggested API

### Safer version

- compare the generated import against existing usage in the repo
- confirm the package version and naming conventions
- check whether a local helper already exists and should be reused

A lot of "AI productivity" is really just "AI created extra cleanup work."

---

## 5) Security anti-patterns

AI is very willing to trade safety for convenience.

### What it looks like

```ts
container.innerHTML = html;
```

or:

```ts
const fn = new Function(code);
fn();
```

Those are the kinds of shortcuts that can turn a normal change into a security review.

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

OWASP's AI testing guidance is a good reminder that modern AI risk is not just model weirdness — it is application security.[^3]

---

## Make the review executable

Teams should not rely on memory for this.

Put a lightweight scan into CI so the obvious mistakes fail fast.

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

          if grep -E "\b(innerHTML|eval\(|new Function\(|catch \(|try \{)" diff.txt >/dev/null; then
            echo "Possible AI anti-pattern found in diff"
            exit 1
          fi

          if grep -E "aria-|htmlFor|label" diff.txt >/dev/null; then
            echo "Accessibility-sensitive change detected — require manual review"
          fi
```

This scan is just a tripwire. It does **not** understand your app, and it is not trying to. It looks for a few obvious red flags in the diff — unsafe HTML or code execution patterns, sloppy error handling, and accessibility-sensitive changes — then makes a person look at the change.

That is the point: catch the easy misses before they merge. It is not a substitute for real review, or a reliable way to enforce security standards in an automated workflow.

---

## Closing thought

The era of AI-assisted development isn't about working less; it's about working smarter. Treat your AI assistant like a brilliant but chronically overconfident junior developer, one whose work requires rigorous, structured oversight. By implementing a dedicated AI coding audit into your pipeline, you stop being a passive prompter and step back into the role of a true software architect. Developers who take advantage of the unprecedented velocity of these tools will need to maintain rigourous oversight to maintain production-grade quality.

---

## Related Resources

- METR study: [Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
- Uber cap coverage: [Uber caps employee AI spending after blowing through budget in four months](https://techcrunch.com/2026/06/02/uber-caps-employee-ai-spending-after-blowing-through-budget-in-four-months/)
- Stack Overflow survey: [AI | 2025 Stack Overflow Developer Survey](https://survey.stackoverflow.co/2025/ai)
- OWASP: [OWASP AI Testing Guide](https://owasp.org/www-project-ai-testing-guide/)

[^1]: https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/

[^2]: https://techcrunch.com/2026/06/02/uber-caps-employee-ai-spending-after-blowing-through-budget-in-four-months/

[^3]: https://owasp.org/www-project-ai-testing-guide/

[^4]: https://survey.stackoverflow.co/2025/ai
