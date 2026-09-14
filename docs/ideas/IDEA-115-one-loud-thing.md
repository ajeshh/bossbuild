---
id: IDEA-115
type: idea
kind: capability
owner: designer
status: exploring (a brand decision, not a build — waits on Ajesh's tab-row read)
gist: Re-open the hue of the brand's one loud colour — not the world (concrete, graphite, one fill, states kept out of the brand's reach; DEC-018 holds) but the accent. Two rounds on one board — round one the safe field, round two the mold-breakers after Ajesh said blue is boring and adjacency doesn't matter. Lead is rani pink; the dark-first three are a different decision.
proof: none
proof_note: Captured. The board is published as an artifact; nothing in the tree changes until a hue is chosen. The one fix due regardless of hue — a per-theme twin for the FILL, because the light-theme mark is 2.47:1 on concrete — is a task, not a decision.
created: 2026-09-13
program: brand
relates: DEC-018, DEC-002, IDEA-107, IDEA-110, FEAT-039
source: Ajesh, 2026-09-13 — "in general for branding, I think I wanna go back to the drawing board and think of potential new color options for boss brand. Lets evaluate potential new color options! and why"
source_2: Ajesh, same day — "i disagree on being adjacent to claude. i dont think people care. I think it can be more interesting, and not boring mandatory blue. in general i think we can break the mold."
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

## Round two — break the mold (2026-09-13, same day)

Ajesh withdrew the adjacency argument and set blue aside. Round two, same five jobs, same arithmetic:

| | hue | verdict | the one reason |
|---|---|---|---|
| H | **rani pink `#E4007C`** | **lead** | the surveyor's set-out colour AND the vocative's colour (rani, the Rajasthani magenta) — one dye; no dev tool wears it; **the only fill on either round that passes the mark on both grounds without a twin** (3.66 / 3.89); Copy button goes white-on-pink; cost is tone, not numbers |
| I | marigold on indigo | contender, dark-first | the ink itself goes indigo, marigold sits on it at 8.4:1; light-theme mark 1.66 — the light favicon is an indigo star; marigold neighbours amber (caution) |
| J | cadmium `#FFD100` | contender, dark-first | the hard hat; graphite on it 12:1; on concrete the mark is 1.17 — needs a graphite tag; reads caution tape |
| K | chalkboard | contender, the big move | the GROUND is the brand (board `#1E2A26`, chalk, one pink chalk line); reopens DEC-018; a classroom register to keep out of the copy |
| L | flag pair — rani + lime | two loud things, on purpose | one per surface: rani on concrete (site), lime on graphite (terminal — the CLI's ✦ is already the user's green); a rule to write |
| M | IKB `#002FA7` | noted | if blue, this blue; loses the argument in the open |
| N | **ice `#D7EFFF` + persimmon `#FF5C34`** — Ajesh's pair | proposed by Ajesh | a near-complement (204° vs 12°); persimmon is the current hi-vis coral-shifted (graphite on it 5.79, works everywhere); the NEW half is the ground — concrete → ice, tinted at DEC-018's hue; risks: the tint reaches every surface, persimmon is 12° from the stop red (`--stop-ink` would move toward crimson), light mark 2.59 |

**Finding:** every yellow (marigold, cadmium, lime) is 1.1–1.7:1 on light concrete and superb on
graphite — yellow-family brands are *dark-first* brands. Choosing I, J or K means the site LEADS
dark; that is a decision to name, not a hue swap.

## Open questions (written as questions)

- Does rani read *surveyed* or *playful* to a returning founder? (The falsifier for the DEC.)
- Should the site lead dark? If yes, K is the conversation and it is DEC-018-sized.
- If two surfaces get two colours (L), what is the rule, in one sentence, and who keeps it?

## Next step (one)

Put N (Ajesh's pair) and H (rani) on the site for a day each — `web/styles/tokens.css` is three literals (+ `library/help/help.css`,
`scripts/og-card.html`, `scripts/gen-demo.js`, `src/board.js`, `docs/design/BRAND.md` `accent:`) — and
look at it in both themes, on the phone, in a tab row. If it reads surveyed, `/decide` with "does a
returning founder call it playful?" as the falsifier. If the read says the site wants to lead dark,
that is the K conversation.
