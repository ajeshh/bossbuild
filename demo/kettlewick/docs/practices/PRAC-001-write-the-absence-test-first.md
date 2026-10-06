---
id: PRAC-001
type: practice
owner: "@ola"
status: active
created: 2026-09-16
applies_to: building a model call with a coding agent
---

# PRAC-001 — Before an agent wires a model call, write the test for what must not reach it

## What we learned
On 2026-09-16 I asked the coding agent to wire FEAT-007's draft call. Its first version passed the
whole visit into the prompt: client name, street, care note, the lot. It wasn't careless. The nearest
code it could see was the ask template, which takes a visit, so it copied that. DEC-005 said four
fields and it had read DEC-005.

What caught it was a test I'd written the night before, with no code under it: build the prompt from
a visit row carrying a client name, an address, a postcode, a care note and a phone number, and fail
if any of them appear in what's sent (`test/ask.test.js`). It went red on the agent's first run, and
the agent fixed it in one turn by building from an allow-list (`src/ask/facts.js`).

## Why it works
An agent follows the nearest precedent over a rule written somewhere else. A test that runs is a
precedent it can't step around; a decision record is one it has to remember. And a test of what is
*absent* is the only kind that catches the leak: a test that the right four fields are present passes
just as well with a client's name sitting next to them.

## How to apply
- Before the prompt exists, write the test that fails if anything private is in it. List the private
  things by name, from a realistic record that has all of them.
- Build prompts from an allow-list, never from a record with fields removed, so a field added to the
  record later stays out until someone adds it on purpose.
- Keep the test in the normal suite (`npm test`), so it runs on every change, not only at eval time.
