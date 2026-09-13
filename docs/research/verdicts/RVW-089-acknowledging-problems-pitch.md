---
id: RVW-089
type: verdict
owner: pm
status: recorded
created: 2026-08-24
verdict: REJECT
route: n/a
sources:
  - https://hbr.org/2025/11/research-acknowledging-problems-can-strengthen-your-pitch-to-investors
---

# RVW-089 — "candour about setbacks raises more" — real, but it is RVW-037 again, in the wrong domain

## The claim
- **Source:** `docs/research/inbox/hbr-acknowledging-problems-strengthens-pitch.md` — Christopher
  Bingham & Jayaram S. Uparna, HBR, Nov 2025.
- **Core assertion:** Borrowers who candidly acknowledged setbacks, debt or past mistakes secured
  funding at *higher* rates than those who didn't disclose. 30,000+ entrepreneurial loan requests on
  a peer-to-peer lending platform.

## Step 3 — attribution: ✅ VERIFIED
Article exists, authors and date correct, sample confirmed (30,000+ P2P loan requests). The inbox
file records it as fetched and read on 2026-08-20, and the finding is if anything *stronger* than
the file claimed — candid borrowers also **received lower interest rates and defaulted less often.**
The inbox file also flagged its own limitation honestly and up front, which is why this verdict is
short: the hard work was already done and it was done correctly.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — it agrees with #6 and with BOSS's anti-hype voice. |
| 2 | Evidence grade | Large-N observational, real outcomes. Good. **But adjacent-domain:** a retail lender skimming a loan request is not a partner in a pitch meeting — different stakes, different selection, different reader. |
| 3 | Duplicate or sharpen? | 🔴 **This is the killing finding. Substantially duplicative of [[RVW-037]], which is already shipped** — `mentor-capital` carries *"Calibrate every claim to the evidence behind it. Overclaiming doesn't just risk credibility, it measurably lowers what founders raise (HBR 2025 — see RVW-037)... name the real strength plainly, don't inflate it and don't hide it."* The same paragraph already says *don't hide it*, and the raise section already names **risks** as part of the data room's minimum honest shape. |
| 4 | Who serves / harms? | Would serve the same founders RVW-037 already serves. |
| 5 | Cost / ceremony | Net **heavier**: a second HBR citation in the same paragraph, doing nearly the same work, with a weaker domain match. |

## Verdict: REJECT
The claim is true and honestly reported. It still does not earn a place, for two reasons that
compound: **BOSS already ships this posture, better-sourced**, and the new evidence comes from
**peer-to-peer lending, not equity investment.**

The seductive part was the upgrade the inbox file named — turning FEAT-025's *"render holes rather
than fill them"* from *"this is right"* into *"this is right and it works."* **That upgrade is
illusory.** A P2P-lending result cannot establish "it works" for investors, and bolting it on would
make an argument that currently rests on Principle #6 — which needs no prop — *look* more evidenced
while becoming more attackable. That is borrowed authority, the exact move step 3 exists to catch.
Adding it would have been BOSS doing to itself what it spent this session catching elsewhere.

## If REJECT / NOT-YET
- **Why not:** duplicate-in-effect of an already-shipped, already-vetted heuristic, plus a domain
  mismatch that the citation's headline ("to Investors") papers over.
- **Recorded so it does not resurface:** if equity-setting evidence for proactive disclosure ever
  appears, it is a **sharpening of RVW-037**, not a new claim, and belongs in that lineage.

## Notes
- Prior related verdicts: [[RVW-037]] (ADAPT, shipped v0.90.0 — the incumbent).
- ⚠️ RVW-037's `route:` line points at `stages/L2-v1/template/.claude/agents/mentor-pitch.md`, **which
  no longer exists** — that seat was consolidated into the shipped `mentor-capital` ("one partner
  covers all three"). The *content* survived the consolidation intact; only the verdict's routing
  record is stale. Noted, not fixed here.
- BOSS version when recorded: 0.227.0
