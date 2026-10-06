# Devlog — Kettlewick

## 2026-09-24
- **FEAT:** FEAT-007
- **Landed:** first cost review (REVIEW-2026-09-24): $0.025 all in for the window, about 90% margin on the paying agency; the texts are the real cost, not the model. First week live: 22 asks, 20 drafted, 2 fell back to the template, owners edited 6 of 20. /close: RESUME rewritten around the payment links.
- **Next:** read the three payment-link answers by 2026-09-30; the 2026-10-03 check-ins.
- **Surprises / decisions:** a timed-out call writes no ledger line, so a run of timeouts would look like a quiet week. Ola logs timeouts by 2026-10-01.

## 2026-09-23
- **FEAT:** _no FEAT — the roadmap_
- **Landed:** ROADMAP-2026-09-23 and the NO-list. Pre-fit at nine owners, so one item, find fit, in three bets: the payment links, the Sunday-night cancellation, the check-ins. Five requests declined with the grade and a re-open signal each. /revalidate on IDEA-002 before weighing it: one carer has asked, not three; re-paused to 2026-12-14.
- **Next:** shape bet 2 (a line to the owner before 8pm on Sunday) once the links are answered.

## 2026-09-22
- **FEAT:** _no FEAT — the deep drift pass_
- **Landed:** DRIFT-2026-09-22: mixed. About one part in six of the work since EVID-004 tested the bet; FEAT-007 built around it. The re-aim is already running (the links).
- **Next:** move the canvas heartbeat's experiment line from the card form to the links.
- **Surprises / decisions:** Ola's pushback is in the audit: the voice of the ask may be part of why an owner pays, and the links can't separate that from the price. First live fallback at 07:41: a timeout, and the template went out as declared.

## 2026-09-21
- **FEAT:** FEAT-007, FEAT-003
- **Landed:** the first Monday with drafted asks. After the morning's cover, Marta sent payment links for October to the three owners who filled two Mondays and haven't paid.
- **Next:** answers by 2026-09-30.

## 2026-09-20
- **FEAT:** FEAT-003
- **Landed:** MONEY-2026-09-20. The rail is a payment link per agency, not the card form; no billing system before three paying customers. Refund posture decided calmly: DEC-006, the first month back, no questions.
- **Next:** send the links Monday, after the cover.
- **Surprises / decisions:** FEAT-003 stays building and goes live when three agencies have paid through a link. The card form was the rail for an answer we didn't have yet.

## 2026-09-19
- **FEAT:** FEAT-007
- **Landed:** shipped to the nine owners in the morning. /ship: smoke green before the deploy, `/healthz` and the day view checked on a phone after it. The recipe is written down at last (PRAC-002), with the uptime check and the kill switch (unset `ASK_MODEL`).
- **Next:** watch Monday's asks.
- **Surprises / decisions:** deploy-on-push offered and declined until the card form is live.

## 2026-09-18
- **FEAT:** FEAT-007
- **Landed:** eval run 14 of 14, pass^2 on the five model cases.
- **Next:** ship in the morning.
- **Surprises / decisions:** the first dev drafts made up a visit length ("a quick 30-minute one") and leaned on carers ("we're really stuck"). Both became cases, and the number check and the no-guilt word list came from them.

## 2026-09-17
- **FEAT:** FEAT-007
- **Landed:** /red-team on the draft (RT-2026-09-17), and the --paths pass on every shipped FEAT. A first name from the owner's sheet can inject a sentence into one draft in five; the owner's read caught it. The money path is untested, honestly: FEAT-003 has taken no real money.
- **Next:** names checked at import; the injected name as an eval case.
- **Surprises / decisions:** the draft route has no session check. It reads no data; the worst case is the template for a day. Shipping with it open, on the record; the check comes with FEAT-003's accounts.

## 2026-09-16
- **FEAT:** FEAT-007
- **Landed:** the draft call wired, through the cost logger; EXTR-001's cut done: `src/ask/facts.js` builds what the model sees from an allow-list.
- **Next:** the eval set.
- **Surprises / decisions:** the agent's first version sent the whole visit to the prompt, copying the template's shape. The test written the night before, for what must *not* reach the model, went red on its first run. Written up as PRAC-001.

## 2026-09-15
- **FEAT:** FEAT-007
- **Landed:** the AI cost budget (`docs/ai-cost-budget.md`) and the five failure states, each falling back to the template. ONBOARD-2026-09-15: at nine owners, their first-session words, not a funnel; the next owners get a Monday-morning first session with Marta.
- **Next:** wire the call.
- **Surprises / decisions:** two of the three owners who filled once started on a day with nothing uncovered. The empty day is where the first session dies.

## 2026-09-14
- **FEAT:** FEAT-007
- **Landed:** the second-Monday nudge, sent by hand to three owners: one of three covered a visit, against a threshold of two (EVID-005). Not built. Design review of the draft sheet before code (`docs/design/reviews/FEAT-007.md`); AI rows seeded into PATTERNS. The landing page (`landing/index.html`), from BRAND and the canvas; the owner quoted on it said yes first.
- **Next:** the budget and failure states before the prompt.
- **Surprises / decisions:** one owner had covered by phone on Sunday night because our ask would have waited for 6:30. It isn't forgetting; it's quiet hours meeting a Sunday cancellation. The review also found the copy saying 7am where the rule says 6:30; fixed in the design docs.

## 2026-09-13
- **FEAT:** FEAT-007
- **Landed:** DEC-005, before a line of the prompt: the model gets four fields (day, time, area, the three carers' first names), never a client. The draft sheet prototyped on the tokens; the prototype registry started.
- **Next:** the design review, then build.

## 2026-09-12
- **FEAT:** FEAT-007
- **Landed:** FEAT-007 specced from the check-ins. EXTR-001: what a message may carry was picked off the visit by hand in three places, and the prompt would have been the fourth; routed DOWN to one allow-list in the app's core.
- **Next:** decide what the model may see, before anything else.

## 2026-09-11
- **FEAT:** _no FEAT — the two-week check-ins_
- **Landed:** called all nine owners. Five text their carers after Kettlewick's ask "so they know it's me". The template does the job and loses the voice.
- **Next:** spec the draft.
- **Surprises / decisions:** the ninth owner came from the county owners' group, unasked (IDEA-006, captured 09-10).

## 2026-09-09
- **FEAT:** _no FEAT — ops_
- **Landed:** smoke set to `npm run smoke` (`.boss/smoke.json`): one visit asked, held and covered through the core, under a second, no network. It replaces `npm run build`, which proved the bundle and nothing about cover. `DESIGN_TOKENS.md` written: the tokens existed since DEC-004 and nobody had said what each name is for.
- **Next:** the two-week check-ins.

## 2026-09-08
- **FEAT:** FEAT-003
- **Landed:** the card form works on my phone; the invoice line names the carers.
- **Next:** one real agency pays through it.
- **Surprises / decisions:** an owner asked for a register import before paying — FEAT-004 captured as ready.

## 2026-09-05
- **FEAT:** _no FEAT — a conversation_
- **Landed:** one owner pre-paid a month by bank transfer before the form existed (EVID-004).
- **Next:** build the form she used a bank transfer instead of.

## 2026-08-30
- **FEAT:** FEAT-001
- **Landed:** watched an owner cover a visit from the school gate, no call (EVID-003). Enriched Marta's persona from it.
- **Next:** the second Monday.
- **Surprises / decisions:** the office screen was the wrong bet — DEC-001 marked wrong, DEC-002 stands.

## 2026-08-28
- **FEAT:** FEAT-001, FEAT-002
- **Landed:** shipped to nine owners.
- **Next:** watch one of them on a Monday.

## 2026-07-02
- **FEAT:** FEAT-002
- **Landed:** the Monday view on a phone.
- **Surprises / decisions:** DEC-002 — phone-first; the schedule stays a spreadsheet.

## 2026-06-04
- **FEAT:** _no FEAT — calls_
- **Landed:** three calls; the persona has a real share for the first time.
- **Surprises / decisions:** nobody wants a schedule. They want the cover done.
