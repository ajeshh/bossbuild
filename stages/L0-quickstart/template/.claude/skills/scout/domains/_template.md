---
domain: <one word — what you'll type after /scout>
for: <the question this domain answers, in one line>
kinds: <the second words, e.g. "grants <area> · deadlines">
open_first: <where the truth for this kind of question actually lives, in the order to open it>
verify_by: <how a claim here can be wrong, and how you'd catch it — open the page, run it, read the text, three skeptics>
lands: <where findings go: docs/research/<domain>/ commits; anything about people or not yours to publish stays local>
ages: <how fast it goes stale — days, weeks, a year>
sensitive_when: <when a finding here must stay on this machine>
---

# `/scout <domain>` — <the question>

A domain you add. Copy this file to `docs/research/domains/<domain>.md` and fill the eight lines
above; that is the whole of it. `/scout` reads this project's domains before the ones BOSS ships, and
a file here with the same name as a shipped one replaces it.

Write below only what this domain does **differently** from `boss craft research` — an order of
sources that matters, a trap specific to this kind of question, a landing place with a shape. If
there is nothing, leave it empty: the eight lines are enough.
