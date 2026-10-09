---
id: IDEA-170
type: idea
kind: capability
owner: product-lead
status: seedling
created: 2026-10-08
proof: none
proof_note: done is plain Bitsy as BOSS's mark (favicon, README, site), checked at 16px on paper and on deep
relates: DEC-024, IDEA-053, PROG-006, IDEA-164
gist: Bitsy, an 8-bit B who fell off the building's sign, climbs DEC-024's six floors, picks up one thing on each, and at the top glows, puts on shades and becomes the boss; the character is the mark, and BOSS stays the product name.
---

# IDEA-170 — Bitsy

Ajesh, 2026-10-08: *"with the levels we are introducing, i wanna make boss into also a gaming
reference… B potentially being like a 8 bit pixelated caracter… super cute and a great logo."* Then:
*"it eventually enters the building and is battling and playing the game, as it goes up a level, it
unlocks something new, and a new flair to the character… eventually it enters the boss level and
becomes the boss!!! where it wears sunglasses perhaps? … a lovable character which just grows its
legends."*

## Decided (Ajesh, 2026-10-08)

- **The name is Bitsy.** It keeps *Bit* (the B, and 8-bit) and makes it smaller. **Bitsy is the
  character; BOSS stays the product name.** Nothing ships *called* Bitsy: no package, no command, no app.
- **Our own design, not an arcade look-alike.** The first draft read as a classic arcade alien; the
  antennae and walking legs are gone.
- **USPTO checked:** Ajesh searched and found no live BITSY mark in the classes that matter. A free,
  open-source pixel-game maker uses the same name with no registration found; that's acceptable for a
  character name inside BOSS.

## The character

The B is the body. The top counter is a **visor** with two eyes; the bottom loop **smiles**. A **tuft**, the B's top serif
curled up, takes the place of antennae. It has **stubby red shoes** and **blush**. The waist stops three
pixels in from the lower loop so the two loops read as a B, even at 16px. **The right side stays clean**:
nothing is held or worn there, and nothing sits on the head, so the B's two bumps aren't confused; everything held goes in the left hand.
Colours are the site's own: persimmon, sky, deep, paper, plus gold for unlocks.

## The legend

The sign over the door reads **_OSS**. Bitsy is the B that fell off. It climbs DEC-024's floors; each
has an enemy that really does stall a project there, and Bitsy keeps what it wins. Each unlock goes on
its own part of the body:

| Floor | Enemy | Unlock | Where |
|---|---|---|---|
| 0 · Lobby | The Blank Page | visitor sticker with its name | spine |
| 1 · Security | The Leaked Key | the sticker becomes a gold badge | spine |
| 2 · Mailroom | The Pile | satchel | hip |
| 3 · Office | The Fog (a sleepy cloud: the morning-after "where was I?") | a mug of coffee | left hand |
| 4 · Studio | The Yak (a fluffy puff) | hammer, swapped for the mug, swinging as it walks | left hand |
| 5 · Boardroom | The Mirror (smug) | the glow, and the shades: one solid black bar | eyes, whole body |

Enemies are drawn soft and round, with the same face as Bitsy. Ajesh, 2026-10-08, on the first
round: the thread, the yak and the mirror were *"not cute, very distracting"*; a scarf at the waist
*"splits the B"*; shades with glints read as see-through; the sparkles go. Second round: the smile in
the bottom loop *"was fine"* (it stays); a pencil on the head was *"confusing"* and the thread unclear,
so the Office became the Fog and a mug. Third round: a badge on the right of the belly still read as
*"the weird jutting out"*, so it moved to the spine; the right side carries nothing at all.

**The boss level.** The last fight is with its own reflection, the one that says *no need to check*.
Bitsy checks. Then it glows like the neon letter it always was; the brightest letter on the sign needs
shades. It climbs into its slot and the sign reads BOSS. Being the boss is being honest with yourself
on the way up, which is the conscience's own question.

## The line it holds

Bitsy's story levels up; **the founder's floor doesn't** (DEC-024: chosen, not earned). No XP, no
streaks, no "level up!" prompts; IDEA-053 already rules out levels as assessments. The game lives in
the character, not in how BOSS treats the person using it.

## Where it is now

Two private artifacts, Ajesh's: the working sheet
(<https://claude.ai/artifact/H6XpqrU4kws9AiEo8GN1T3>) and the saved first draft
(<https://claude.ai/artifact/Gk6N3GBALzYajqet6FqDe9>). The sprites are pixel grids drawn by a small
script in the page; nothing is in the repo yet.

## Open questions

- Where does Bitsy show up first: the favicon and README mark only, or `boss unlock` too (the next
  outfit, shown once)?
- Does each HQ card (IDEA-164) show its project's Bitsy wearing its floor, or is that noise on a board
  of many projects?
- Does the legend belong on the About page, and how short can it be told?

## Tasks

- [ ] Move the sprite grids into the repo as source (one file, with the palette), once a surface uses them.
- [ ] Export plain Bitsy as favicon and mark (16, 32, 180, SVG) and check both on paper and on deep.
- [ ] Before the name goes public, confirm the npm and GitHub names don't collide with a product; keep Bitsy a character name only.
