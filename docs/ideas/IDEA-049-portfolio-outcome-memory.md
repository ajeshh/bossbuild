---
id: IDEA-049
type: idea
owner: product-lead
status: deferred (trigger-gated)
gist: Real incubators compound on portfolio outcomes: which bets lived, which died, what the survivors had in common. BOSS's registry knows projects exist and never learns whether they lived.
program: post-launch
proof: src/portfolio.js
created: 2026-07-02
source: fable-campaign step-back (Fable 5 deep read, 2026-07-02)
---

# IDEA-049 — Portfolio outcome memory: the incubator learns from endings

> **Capture, don't build.** DO-NOT-REHASH: the deferral is settled; this file exists so
> [[IDEA-044]] and [[IDEA-045]] are designed as its substrate, not so it gets built now.

## The gap

Real incubators compound on portfolio outcomes: which bets lived, which died, what the survivors had in
common. BOSS's registry knows projects *exist* but never learns whether they *lived* — so BOSS's advice
can never improve from its own track record. An incubator that never reads its portfolio is a scaffolder
with good manners.

## The shape (when earned)

A read-only projection over what 043/044 already record: `boss insights --portfolio` reads every
registered project's status (active/shipped/retired via [[IDEA-044]]), kill-speed, evidence grades at each
mode transition ([[IDEA-045]]), and conscience-override patterns — and answers questions like *"do my
projects that reached commitment-grade evidence before MVP survive longer?"* Facts from real dates and
real frontmatter; never scores, never predictions. The learning routes UP via `/boss-learn` as practices
("in this portfolio, canvas-before-code correlated with…"), which is Principle #1 applied to the
portfolio level — the loop's last missing rung.

## Why deferred

It needs a portfolio: **≥3 projects with recorded endings**. Today there is one live project (BOSS) and
zero recorded endings. Building the aggregation now would be analytics theater over an empty table — the
exact pseudo-signal BOSS exists to expose (and IDEA-021's fleet-learning file already holds the adjacent
"measure graduation not activity" contract; this idea inherits it).

## Build trigger

`/sunset` has recorded **3+ real endings** across registered projects (any founder, including Ajesh), OR a
real founder with a multi-project registry asks the portfolio question unprompted. Until then: 043 and 044
ship with their state shaped so this projection needs no migration (dates + grades + statuses in
frontmatter/JSON — already specified there).

## No handoff prompt

Deliberately none — a prompt would invite premature building. When the trigger fires, promote via `/spec`.
