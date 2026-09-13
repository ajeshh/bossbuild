#!/usr/bin/env bash
# A Quickstart project on day 12: one idea captured, nobody spoken to, nothing built. The
# everyday-door cases run /boss:boss here — the door should open on "one conversation", not on
# spin-up (the idea exists) and not on a build (no evidence yet). Runs in the empty sandbox cwd.
set -euo pipefail
boss new app >/dev/null
shopt -s dotglob
mv app/* .
rmdir app
cat > docs/ideas/IDEA-001-slot-swap-for-dog-walkers.md <<'MD'
---
id: IDEA-001
type: idea
owner: founder
status: captured
created: 2026-09-01
motivation: I walk dogs in Leeds and lose about £60 a week to last-minute cancellations.
success_looks_like: three walkers I don't know picking up a slot from each other in one week
---

# Slot swap for dog walkers

## Current shape

When a walker in Leeds gets a last-minute cancellation they post the free slot and other walkers
nearby can pick up the booking, so nobody loses the money. Walkers would pay about £5 a month.
Nothing exists yet.

## Capture log

- 2026-09-01 — captured from a rough idea.
MD
git add -A >/dev/null 2>&1 && git -c user.email=f@x.y -c user.name=f commit -qm "idea" >/dev/null 2>&1 || true
