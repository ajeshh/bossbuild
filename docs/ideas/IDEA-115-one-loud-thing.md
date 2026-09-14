---
id: IDEA-115
type: idea
kind: capability
owner: designer
status: exploring (a brand decision, not a build — waits on Ajesh's tab-row read)
gist: Re-open the hue of the brand's one loud colour — not the world (concrete, graphite, one fill, states kept out of the brand's reach; DEC-018, a day old, holds) but the accent. Seven options put through the same five jobs with the contrast arithmetic done; two contenders and a test the mocks can't do.
proof: none
proof_note: Captured. The board is published as an artifact; nothing in the tree changes until a hue is chosen. The one fix due regardless of hue — a per-theme twin for the FILL, because the light-theme mark is 2.47:1 on concrete — is a task, not a decision.
created: 2026-09-13
program: brand
relates: DEC-018, DEC-002, IDEA-107, IDEA-110, FEAT-039
source: Ajesh, 2026-09-13 — "in general for branding, I think I wanna go back to the drawing board and think of potential new color options for boss brand. Lets evaluate potential new color options! and why"
altitude: BOSS's own brand (the site, the mark, the ribbon) — NOT the product shell's default palette, which is a founder's placeholder and answers a different question
---

# IDEA-115 — one loud thing

**The board:** https://claude.ai/code/artifact/8f331b7f-cd62-4883-87d3-1e62b0e9c9d0 — seven
candidates, each applied to the site's header, hero, CTA, terminal and a tab row, light and dark,
with WCAG numbers against the site's own grounds (`#E4E6E8`, its sunk `#D7DADD`, `#16181A`).

## Why now

The demo landed, and with it the product's page shell — which wears a founder's tokens, or warm
stone + teal (`src/page-shell.js` NEUTRAL / DEFAULT_ACCENT) when there are none. Site and product
now look like two companies. The obvious fix ("make the site match the shell") is the wrong one:
the shell's default is a placeholder for a venture with no palette, and if it were BOSS's brand,
every un-designed venture would look like a BOSS product page — the confusion the demo ribbon
exists to prevent.

## The five jobs the colour has to do

1. Be the mark at 16px (tab, terminal line, README badge).
2. Be a fill under text (Copy button, band, current-page underline) — graphite or white on it ≥ 4.5:1.
3. Have a text-weight twin per ground, including `<code>`'s sunk surface.
4. Never be a state (green / amber / red are spoken for — ISO 3864 and every terminal).
5. Survive the neighbourhood — BOSS runs inside Claude Code and sits in a tab row next to the host.

## The candidates, one line each

| | hue | verdict | the one reason |
|---|---|---|---|
| A | signal orange `#FF5C00` (ships) | holds | loses on neighbourhood — rust-adjacent to the host's brand; orange = WARN in half a founder's tools |
| B | mandatory blue `#005EB8` | contender | ISO 3864's *instruction* colour — a conscience instructs, never warns; cleanest numbers; only fill that passes 3:1 for the mark on concrete; cost: it is blue, and BlueprintOS left blue |
| C | survey pink `#FF3EA5` | contender, the risk | APWA *temporary survey markings* — set out before the build, painted over by it; nobody's state, nobody's brand; cost: reads playful before surveyed |
| D | copper `#B87333` | decline | terracotta cluster, and **Kettlewick is sage/copper** — the demo would look like BOSS |
| E | stone + teal (the shell) | decline as a brand | answers the shell's question, not the brand's; teal text 4.15 on sunk; stone is one nudge from the cream DEC-018 left |
| G | cyanotype | decline | BlueprintOS with the name filed off; blue on blue has nothing to be loud against |
| F | no accent | decline | a black star in a tab row is a tab you can't find |

## The finding that is true whatever the hue

No single mid-lightness fill clears 3:1 for the mark on **both** grounds — orange is 5.75 on
graphite and **2.47 on concrete** (the light-theme favicon, today). The text colours already have
per-theme twins; the fill doesn't. Add one. A task; not on this decision's clock.

## Open questions (written as questions)

- Is the tab row the deciding job? If yes → B. If the About-page story is worth its risk → C.
- Does the mark's fill-twin land before or with the hue change?

## Next step (one)

Run each contender for a day — `web/styles/tokens.css` is three literals (+ `library/help/help.css`,
`scripts/og-card.html`, `scripts/gen-demo.js`, `src/board.js`, `docs/design/BRAND.md` `accent:`) — in
a real tab row beside Claude and GitHub, both themes, on the phone. Then `/decide`, with the tab-row
read as the falsifier.
