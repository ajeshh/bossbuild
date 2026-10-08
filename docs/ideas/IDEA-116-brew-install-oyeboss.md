---
id: IDEA-116
type: idea
kind: capability
owner: Ajesh
status: deferred (gated on homebrew-core notability — see falsifier)
proof: none
proof_note: Not a build — a gate. Everything BOSS controls (the tap formula, the CLI naming the formula that exists, check:published) landed; the ask is a homebrew-core formula, refused today on notability. The trigger is on the record.
gist: A bare `brew install oyeboss` — no tap prefix — means a formula in homebrew-core. Homebrew's acceptance policy refuses it today: a self-submission needs 90 forks, 90 watchers or 225 stars, and ajeshh/bossbuild is at 0/0/0. The only fix is public interest; everything BOSS controls is already in place.
created: 2026-09-14
program: distribution
relates: DEC-002, IDEA-087
---

# IDEA-116 — `brew install oyeboss`, no tap

## Current shape

Ajesh (2026-09-14): *"fix it so brew install oyeboss works."*

**Why it doesn't, and can't be made to from this repo.** Homebrew resolves a bare formula name
against homebrew-core and the taps already on the machine. `oyeboss/tap/oyeboss` is the tap-qualified
form; it works cold. A bare `brew install oyeboss` works only once `Formula/o/oyeboss.rb` is in
`Homebrew/homebrew-core`. After a tap it resolves, but Homebrew 7 refuses to load a formula from an
untrusted tap, and only a fully qualified `install`/`upgrade` trusts it on the way. There is no
third mechanism.

**The gate, read at source 2026-09-14** (docs.brew.sh/Package-Acceptance-Policy § Notability):

> A new package must demonstrate public interest beyond its author. … at least 30 forks, 30 watchers
> or 75 stars. … at least 90 forks, 90 watchers or 225 stars for a self-submission by the repository
> owner. … A code repository less than 30 days old is normally not eligible.

`gh repo view ajeshh/bossbuild` the same day: 0 stars, 0 forks, 0 watchers (public since 2026-05-21,
so the 30-day rule is clear). A PR today is closed on that line.

**What homebrew-core would also require, all already true or one command away:**
- MIT, DFSG-compatible — `LICENSE` in the repo, `license "MIT"` in the formula. (GitHub's API
  reports `license: null` for the repo; worth a look at why — it may be licensee not matching the
  copyright line. Cosmetic until a submission.)
- Immutable, checksummed source — the formula already installs the versioned npm tarball with a
  sha256 (`scripts/bump-formula.js` computes it); Node formulae in core use this shape with
  `std_npm_args`.
- No self-updating — `src/update.js` *advises* a command, it never runs one. Fine.
- Stable releases — npm versions are immutable; no git tags exist (`git tag` is empty). Core prefers
  a tag or release archive; tagging on `npm run stamp` is the cheap half to do ahead of time.

**After acceptance** the hand-step changes shape: `npm run bump:formula` + tap push becomes
`brew bump-formula-pr oyeboss --url … --sha256 …` (or core's autobump). The tap stays for the
rename map and for anyone who tapped it.

## The formula, audited (2026-09-14)

Ajesh ran `brew create --node` in a local `homebrew/core` checkout; the formula is on branch
`oyeboss` at `$(brew --repository homebrew/core)/Formula/o/oyeboss.rb`, uncommitted. It is the
tap's formula plus a functional `test do` (`boss new demo` → `CLAUDE.md` and `.boss/config.json`
exist → `boss status` says `Quickstart`; brew's test HOME is sandboxed, the registry stays clean).

- `brew style` — clean. `brew install --build-from-source` — builds. `brew test` — passes.
- `brew audit --new --strict --online` — **one finding: `oyeboss.build` was registered
  2026-08-20; homepages should exist for at least 30 days.** A second gate, calendar-shaped:
  clears **2026-09-19**. Their CI runs this audit, so a PR before then fails mechanically.

When both gates clear: bump `url`/`sha256` to the current version (`scripts/bump-formula.js`
computes the hash), `gh repo fork Homebrew/homebrew-core --remote`, commit as
`oyeboss <version> (new formula)`, push to the fork, `gh pr create --repo Homebrew/homebrew-core`.

## Falsifier

- **Trigger (both):** the homepage is 30 days old (2026-09-19) AND `ajeshh/bossbuild` reaches 225 stars, 90 forks, or 90 watchers (self-submission), or
  75 / 30 / 30 and someone who is not Ajesh submits. `npm run check:reach` carries the numbers.
- **Kill:** if by 2027-03-14 the numbers haven't moved, the tap line is the install line and this
  idea closes as "the tap is enough".

## Capture log

- 2026-09-14 — asked as a fix; found to be a gate, not a bug. Same pass fixed the adjacent thing:
  `src/update.js` emitted `brew upgrade ajeshh/boss/boss` (the pre-rename formula) and resolved only
  through the tap's `formula_renames.json`; now names `oyeboss`, and the regression test pins the
  current name rather than the dead one. Website line untouched — `brew install ajeshh/boss/oyeboss`
  is the one form that works cold.
- 2026-10-08 — Ajesh: *"30 days out, can we change it and not have ajeshh"*. The 30-day gate cleared;
  notability hasn't (0/0/0, and no one uses the repo yet), so core stays closed. What Ajesh actually
  wanted was their handle out of the command: the tap moved to a new org, `ajeshh/homebrew-boss` →
  `Oyeboss/homebrew-tap`, and every line that names it now says `brew install oyeboss/tap/oyeboss`.
  The "then plain `brew install oyeboss` works" note on `start.html` came out: Homebrew 7's tap
  trust makes it false. Read at source: `cmd/install.rb` calls `Trust.trust_fully_qualified_items!`,
  so the qualified install trusts itself and works cold (tapped, info, fetch verified, then untapped).
  The CLI's own `brew upgrade`/`uninstall` went bare (`oyeboss`): a qualified upgrade from the new
  tap exits 1 on a machine installed from the old one (dry-run, 2026-10-08). The REGRESSION test
  that pinned "tap-qualified" now pins bare `oyeboss`; the `TAP`/`FORMULA` exports nothing read are
  gone. Old clones keep pulling: `ajeshh/homebrew-boss` (https and ssh) resolves to the new repo's
  HEAD — and stops the day anything new is created at that name.
  **Ajesh's machine, once:** `scripts/bump-formula.js` now looks for `brew --repository oyeboss/tap`,
  so `npm run bump:formula` dies until `brew uninstall oyeboss && brew untap ajeshh/boss &&
  brew install oyeboss/tap/oyeboss` (or pass `--tap PATH`).
