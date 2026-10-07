# /pretotype — publishing a page-shaped test

### Publishing a fake door in one turn (no deploy, no host, no cost)

Savoia's whole argument is that a demand test must be **cheap and fast** — and the usual reason a
fake door never happens is the *page*: design it, build it, find somewhere to put it. If the founder
is running a **fake door**, **Pinocchio** or **Impresario** pattern, offer to publish the page as an
**Artifact** instead: a real, shareable URL in this turn.

**Compose it from what BOSS already holds** — don't interview them for copy they've written already:
the canvas's **People** (who it's for), **Problem** (the tension, in their words), and **Promises**
(the value), plus **`docs/BRAND.md`** voice and the design tokens if they exist. If the brand doc holds
`story:`, that one line is your subhead, as written. Its ★ learned rows are real words a person said;
one can sit on the page only quoted exactly, credited as the row credits it, and only after the
founder says that person would be fine seeing it in public. A row is evidence, not permission. **No brand doc?**
Seed one — it is a living, lens-neutral file that any skill can start and none owns (the skeleton is
`.claude/skills/canvas/templates/brand-doc.md`); mark it `nascent` and move on. A fake door
generated from a nascent brand should read *plainer* than the real thing will, never invent
personality to fill the gap. One screen: what
it is, who it's for, one honest claim, one call to action.

**Capture is external, and you must say so plainly.** A published page is sandboxed — it makes no
network calls and **stores nothing**, so it cannot collect an email by itself. That is a hard limit,
not a detail to gloss:

> "The page can't collect emails on its own. Make a free form first — Tally, Formspark, a Google
> Form — and I'll wire the button to it. Your signup count lives there; that's your metric."

The button is an ordinary link out to that form. **Never imply the page is capturing anything it
isn't** — a fake door that silently drops signups is worse than no test, because the founder acts on
a zero that was really a plumbing bug.

**Then, in order:** publish → **tell them it is private until they share it** (that's a real step,
not an assumption) → they send the URL to the audience the canvas named → the count accrues in the
form tool → they bring it back and you write it into the pretotype log (step 6 in
[`SKILL.md`](SKILL.md)).

**What this is not.** It is not a host. The moment someone says yes, the product needs a real home —
that's `/ship`, which arrives with `boss unlock mvp`. Keep the handoff explicit so demand-testing and
delivery stay separate; **needing a host is a result, not a prerequisite.**

**And it is not the only page BOSS builds — know which one you want.** `/landing --demand` builds the
same door *in the repo*: version-controlled, on-brand from the token system, deployed through `/ship`.
Both of those are MVP verbs. The split is about what the page has to survive, not about which is
better — and the rungs they sit on say the same thing the table does:

| | **Publish here (Artifact)** | **`/landing --demand`** |
|---|---|---|
| Available | now, in Quickstart | at MVP, once a first feature has shipped |
| Cost to first URL | this turn — no host, no account | a deploy |
| Lives in | the artifact, not the repo | the repo, under version control |
| Best when | you are testing and expect to throw it away | the page will outlive the test, or the brand matters |

**Default to publishing here for the test.** A demand test that waits on a deploy is the delay Savoia's
whole argument is about, and most fake doors *should* be thrown away. Reach for `/landing` when the page
is going to stick around — and **if you find yourself wanting it to stick around before anyone has said
yes, that is the pretotype telling you something.**

**The line a fake door does not cross** (`ai-ux-patterns.md`, PRINCIPLE #6). Testing demand for
something that doesn't exist yet is honest. These are not:
- impersonating a real company, or borrowing one's branding to seem legitimate;
- implying the thing is **live and purchasable** when it isn't, or taking money for it;
- fabricated social proof — invented testimonials, fake user counts, "join 10,000 others";
- manufactured urgency, fake scarcity, or confirmshaming the decline ("no thanks, I like wasting time").
- The full set for a fake door: `boss craft deceptive-patterns --surface social-proof-and-claims`.

The test is whether you could **follow up honestly**: if someone signs up and you email them "we're
building this, you're on the list" — does that match what the page led them to believe? If not, the
page is lying, and the signal it produces is worthless anyway.
