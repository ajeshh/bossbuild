---
id: IDEA-144
type: idea
kind: capability
owner: Ajesh
status: shipped
gist: The generated pages (playbook, design, board, guide) live in a hidden .boss/ folder with no front page and four separate links; one stable home at .boss/index.html lists them with their age, and every page command prints that one link to bookmark.
created: 2026-10-05
program: PROG-003
relates: IDEA-106, IDEA-107, IDEA-065
---

# IDEA-144 — One home for the generated pages

## Current shape

Asked 2026-10-05 (Ajesh): *"where the playbook is permanently stored on the project folder, and all
the other webpages, its not easy to discover inside an app. im wondering if we should make it into a
proper home and folder so its easy to bookmark"* — then, in this repo: *"i didnt see this inside
bossbuild for bossbuild itself"*. Altitude: what BOSS ships a founder; BOSS's own copy is the same code.

What was there: four pages in `.boss/` — `playbook.html`, `design.html`, `board.html`, `help.html`. A
dot-folder is hidden in Finder and most file pickers. No front page; the family bar linked three of
the four (no guide); only `boss playbook` printed a `bookmark:` link. In this repo the design page was
three weeks old and nothing on any page said so.

**The folder is not the problem — the missing front page is.** A bookmark doesn't care that a folder is
hidden. Moving the pages to a visible folder would clutter the founder's repo and still give no one
place to start.

## Decision (Ajesh, 2026-10-05: "one stable homepage is good … yes to the rest")

- `.boss/index.html` — one card per page: generated when (file date, with age), or not generated yet
  and the command that makes it. Rewritten by every page command, so it never lists a page wrong.
- The family bar gets **Home** first and **Guide** last; the board and the guide link home.
- Every page command prints the same `bookmark:` line — the home, not the page.
- **A bookmark hint on the home page**, with the platform's shortcut. Ajesh asked for it to go away
  once bookmarked; **a page cannot know that** — no browser exposes it. So it carries a "Done" button
  that hides it, remembered in the browser (try/catch: a `file://` page may have no storage, and then
  the hint simply shows again — never an error).
- No new skill, no new command.

## Tasks

- [x] T1 `src/home.js` — the page, written by every page writer
- [x] T2 family bar: Home + Guide; board and guide link home
- [x] T3 every page command prints the home as the bookmark
- [x] T4 `.boss/index.html` (and `.boss/help.html`, missing before) in the template `.gitignore`
- [x] T5 tests; throwaway project with `BOSS_HOME` set

## Found after shipping (Ajesh, 2026-10-05)

*"The org page seems misleading in name, should show critical folders (some of it which you do), also
we should link them so people can easily open the file / folder in browser or on desktop?"*

- [x] The demo's **Organization** page (`scripts/gen-demo.js`, site only) reads as a team/org chart; it
      is about where records live. Rename it. (A misleading name is a correctness fix under the site freeze.)
- [x] Its folder cards link nowhere. On the site the demo files are public in this repo, so each card can
      link to its folder on GitHub. Linking is new site work: Ajesh's call under the freeze.
- [x] The founder's own project has no such page. The home (this IDEA) is where it belongs: a
      *where things live* section listing the critical folders and files that exist, each with what it
      holds, a count, and a link. A `file://` link opens a folder as a listing in Chrome and Firefox
      (Safari does nothing); **no web page can open Finder or Explorer**, so desktop = a Copy path button,
      plus optionally an editor link (`vscode://file/…`, which Cursor also answers).

- [x] **The demo's copy doesn't say what Kettlewick is** (Ajesh, 2026-10-05): *"cover what? which kind
      of small agencies? the problem and statement seem super confusing … not clear what the problem is,
      what the first proof is. even the name why seems out of order."* Read the opening of the demo (the
      index's "what it is" block and the playbook cover/Vision) against demo/kettlewick's records; the fix
      is in the records (they are the source), never in the renderer.
- [x] **The order of the pages** (Ajesh): *"board in the middle seems wrong since it might be frequently
      visited"*. Order by how often each is opened, not by when it was built: one `SPACES` list drives
      the family bar and the home's cards.

Done 2026-10-05: *Where things live* (both places; Open + Copy path, Ajesh's picks); the spaces ordered
Board · Playbook · Design · Guide; the demo opens with what Kettlewick does (the gist as the headline),
then what it is, the problem, the first proof, why, and the name last — rewritten in the records
(BRAND story, gist, canvas Problem, EVID-003's title), so the playbook's cover reads plainly too.

## Decided after (Ajesh, 2026-10-05: "Stalesness. One hom for every machine, if they have other projects then they should have their own home pages right")

- **Staleness, built.** Each space declares what it reads (`SPACES[].reads` in `src/page-shell.js`); a
  page is *out of date* when a file under those changed after it was written, and the card names the
  newest. Generous on purpose: a false flag costs a re-run, a missed one is a page lying. The check is
  as old as the home, so the home says when it checked (aged in the browser) — nothing rewrites it
  between page commands. Age alone no longer turns amber: an old page with nothing changed is fine.
- **No machine-wide home.** Each project has its own; a founder with several bookmarks several.
- Open, not urgent: the home re-checks only on a page command. If a stale "checked 9 days ago" turns
  out to be what people see, the session-start hook could rewrite it — wait for that to happen.
