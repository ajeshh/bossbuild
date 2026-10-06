---
id: DEC-005
type: decision
owner: "@marta"
decided_by: founder
status: decided
created: 2026-09-13
reversibility: one-way
scope: venture
revisit_by: 2026-12-01
program: PROG-001
relates: FEAT-007, DEC-003
---

# DEC-005 — The model never sees a client

## Context
FEAT-007 puts a hosted model in the cover flow: when a visit is uncovered, it drafts the ask to the
three carers in the owner's words. The warmest draft would use what the schedule already holds: the
client's name, the street, the note that says "hoist, two carers". That is health information about
someone who never signed up for Kettlewick and never will. Once a prompt carrying it reaches the
model provider, it is out of our hands. The provider keeps inputs for up to 30 days under its
terms, and nothing we write later recalls them.

## Decision
The prompt is built in code from four fields and nothing else: the visit's **day**, its **time**
(phrased by code, as "tomorrow at 9"), its **area** (the name the owner already uses in her
spreadsheet's area column, never a street or a postcode), and the **first names of the three carers**
being asked. A client's name, address and care notes never reach the model. The carer's ask card shows
the client's first name, and the app puts it there; the model doesn't write it. Ola and I decided it
together. Ola wrote the four-field rule into the prompt builder the same evening.

## Why
Considered: send the client's first name too, the way the template card already shows it to the
carer. Chosen: four fields. Why not the name: it buys a slightly warmer sentence and costs a
subprocessor holding a list of who receives care, when, and where. A carer still sees the name,
on the card, from us. Considered: no model at all, keep the template. Rejected because owners
said they send their own text after ours "so they know it's me" (five of nine, at the two-week
check-ins), and that follow-up is the hour we promised to give back.

## Falsifier — what would prove this wrong, and by when?
If by 2026-12-01 a carer says yes to the wrong visit because the text didn't say whose it was, the four
fields are too few. The fix is still on our side: make the card's name harder to miss. We would not
send the name to the model. If owners add the client's name by hand to more than half the drafts
by the same date, the drafts are missing something carers need. We'd look at the card first.

## Consequences
- The draft can never be as specific as a text the owner writes herself. That's the price, and it
  is why the owner reads every draft before it goes (FEAT-007).
- Every future model feature inherits the allowlist. Adding a fifth field is a new DEC, not an edit.
- The eval set checks it on every run: `feat-007-fail-010` builds a prompt from a visit row that
  carries a client's name, address and note, and fails if any of the three appears.
- Relaxing this is the one-way door. Keeping it costs nothing to undo. Sending a client's details
  once can't be unsent.
