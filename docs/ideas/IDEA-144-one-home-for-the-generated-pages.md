---
id: IDEA-144
type: idea
kind: capability
owner: Ajesh
status: shipped
gist: The generated pages (playbook, design, board, guide) live in a hidden .boss/ folder with no front page and four separate links; one stable home at .boss/index.html lists them with their age, and every page command prints that one link to bookmark.
created: 2026-10-05
program: business-profile
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

## Open questions

- Is a page's *age* enough, or should the home say a page is **stale** (its sources changed since)?
  That needs each page's source list — bigger; wait for someone to trust an old page.
- One home per machine at `~/.boss/` listing every project — hold until a founder with several projects asks.
