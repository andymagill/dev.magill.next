---
title: 'Vibe-Coding Gone Wrong: Debugging AI-Generated Code'
description: A systematic approach to finding and fixing bugs in AI-generated code, from identifying the problem to deploying the fix.
image: /images/blog/exterminator.jpg
tags: ai-generated-code, bug-fixing, testing
created: 1785445993
lastUpdated:
---

First step is admitting you have a problem. You were not watching your coding agent closely and now a pesky bug snuck into your project. Oh whatever shall we do? Don't just throw the error message back at the coding assistant over and over and expect a stable solution.

The ability to systematically find and resolve bugs is one of the most valuable and useful development skills we can have. The capability is so essential to complex systems that it's one of the most common requirements in job descriptions. Surprisingly, bugfixing is not often evaluated in coding interviews, and a lot of software developers don't have a firm grasp of the process.

## What's your Problem?

If we don't define the shape of the issue, we might run around the entire codebase looking for the cause. To make the best use of our time and tokens, we should identify which parts of the project are working as expected.

To accomplish this, we need instrumentation that provides deep visibility into the execution of the code. Structured logging, debuggers, and trace outputs are the typical tools that provide that visibility. This allows us to see what functionality is working as expected, and precisely how some behaviors aren't. A strong grasp of expected and actual behaviors will help prevent half-baked solutions.

## Keep it Simple, Stupid (KISS)

Incorrect behavior could be concealed by unrelated complexity. We can make our lives a bit easier by developing a minimally reproducable example (MRE). Temporarily stripping away the known-good parts can help expose the root cause of the problem. For instance, we could simplify a complex conditional to more reliably encounter the problem, and narrow the scope of our investigation. Unit tests will help identify suspicious sections, and help understand how the expected behavior should work.

## Playing the Blame Game

Once we have a better idea of what's happening, we should begin to make hypotheses around the problem. If we sufficiently performed our investigation, we should have plenty of insight to draw from. Each problem candidate should be examined one-by-one to see how it could be contributing to the problem. This resembles science more than engineering. State an assumption, test one variable at a time, and record what changes.

If we still can't find the problem, we should circle back to our investigation and incorporate more logging and tests to expose more relevant details. Don't just keep passing error messages back to your coding assistant. Keep going with that until you have strong indications of the nature of the issue.

## Test Wide, then Deep

If we have done all the above correctly, we will be an expert on this particular bug. Now that we have a good idea of the cause we can spend some time documenting and testing individual sub-units. Write sub-tests before the fix to provide a clearer picture of the expected behavior. Once it fails predictably, you have a base-truth benchmark for your solution. This helps confirm the fix meets expectations and survives future updates by both human and AI coders.

## Deploy the fix

You and your intrepid coding agent should now have enough understanding to confidently identify suitable fixes. We can now incorporate those fixes one at a time until we see the expected behavior. Once that is in-place, we can use test cases to verify that our unit tests and regression tests pass successfully. Document how you untangled the bug nest for future developers and coding agents.

## TRelated Reading

- [Minimal Reproducible Example (MRE)](https://stackoverflow.com/help/minimal-reproducible-example)
- [Unit Testing Best Practices](https://dev.to/canro91/unit-testing-best-practices-organization-test-data-1o6o)
- [What Is Structured Logging and Why Developers Need It](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/)
