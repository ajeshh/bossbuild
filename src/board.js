// boss board — a live read of what's in flight, derived entirely from files
// that already exist. NOT a maintained document: the founder never edits the
// board, they change the work (IDEA/FEAT/canvas) and the board re-renders.
//
// Design decisions (IDEA-015), held deliberately:
// - Frontmatter is truth. We read each IDEA-*/FEAT-* file's `status`, never
//   docs/ideas/INDEX.md — INDEX is itself a hand-maintained table that can
//   drift from the files. A board that trusts a drifting source lies.
// - Pure projection. No `.boss/board.json`, no second source of truth, nothing
//   to keep in sync. Concurrent / out-of-order edits can't corrupt a render.
// - The riskiest assumption sits ABOVE the columns (humane-lens override):
//   "motion but no evidence" must be more visible here than in a normal kanban,
//   not less. Empty columns are shown, not hidden — the empty cell is the
//   diagnostic.

import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { dim, bold } from './ui.js';
import { frontmatter, unquote, baseStatus, isParked } from './frontmatter.js';

// The flow, left to right. BOSS's own vocabulary, surfaced as plain words.
const COLUMNS = ['Captured', 'Taking shape', 'Building', 'Shipped'];

// A FEAT in Building past this many days is "aging" — the zombie-feature smell
// (IDEA-034 Track B). Frontmatter-true (reads `building_since:`), never guessed.
const AGING_DAYS = 21;

// The Shipped column is otherwise unbounded — every shipped item shows forever,
// which buries the live work under history. Two honest archive rules combine:
//   - DATE: a FEAT with a `shipped_on:` older than SHIPPED_WINDOW_DAYS is archived
//     (folded), regardless of count — frontmatter-true, the real "older than a
//     month" filter (stamped by /spec when status → shipped).
//   - COUNT: among the still-recent (and any undated legacy) shipped items, show at
//     most SHIPPED_RECENT so the column stays bounded even before dates exist.
// Everything folded collapses into a "+N shipped earlier" line; `--all` expands it.
const SHIPPED_RECENT = 6;
const SHIPPED_WINDOW_DAYS = 30;

// Acceptance-criteria progress (v0.171.0+). `/spec` has always shipped criteria as
// `- [ ]` checkboxes and nothing ever ticked them, so a FEAT one criterion from done
// and a FEAT nobody had started rendered identically — the "how far am I" half of
// EVID-001. `/log` ticks them; this reads them.
//
// Scoped to the "## Acceptance criteria" section ONLY. Other sections carry
// checkboxes too (a smoke list, a failure-state list), and counting those would
// silently inflate the fraction — a progress number that flatters is worse than none.
function criteriaProgress(text) {
  // NOTE: no `m` flag on the outer match — under /m, `$` means end-of-LINE, so the
  // lazy body stopped at the first criterion and every FEAT reported "1/1".
  const m = text.match(/(?:^|\n)##[ \t]+Acceptance criteria\b[^\n]*\n([\s\S]*?)(?=\n##[ \t]|$)/);
  if (!m) return null;
  const boxes = m[1].match(/^\s*[-*]\s+\[[ xX]\]/gm);
  if (!boxes || !boxes.length) return null;
  const done = boxes.filter((b) => /\[[xX]\]/.test(b)).length;
  return { done, total: boxes.length };
}

function firstHeading(text) {
  const m = text.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : '';
}

// --- the gist: one line saying what the card actually IS -------------------------------------
// Ajesh: *"its hard to see what it is… right now its a bit hard to remember ideas."* A card is an
// id and a title, and a title is a name — after sixty records, a name is not a reminder. This is
// the one line of recall the board was missing.
//
// Authored wins, derived fills the silence — the same posture `gitFirst` takes for dates, and for
// the same reason: a field someone has to remember to fill in is a rule with no mechanism, and a
// board that goes blank for 62 of 72 records is worse than one that guesses well. A `gist:` line
// in frontmatter is always preferred when present; otherwise the record's own opening prose is
// read, because every record already has one and it is the sentence its author wrote FIRST.
//
// Deliberately NOT read from `docs/ideas/INDEX.md`: the index is a hand-maintained view that
// drifted from the files in 21 rows, which is the whole reason this module reads frontmatter.
const GIST_MAX = 200;

// Markdown → one plain line. Keeps backticks (a path or a command IS the clearest half of many
// of these sentences) and drops everything that only means something to a renderer.
function flatten(md) {
  return String(md)
    .replace(/\[\[([^\]]+)\]\]/g, '$1')            // [[wiki-link]] → wiki-link
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')        // [text](url) → text
    .replace(/\*\*([^*]+)\*\*/g, '$1')               // bold
    .replace(/(^|\s)\*([^*\n]+)\*/g, '$1$2')        // italic
    .replace(/\*\*?/g, '')                          // stray markers from an unbalanced pair
    // The attribution prefix on a seed line ("Seed: Ajesh, 2026-06-20 — ") is provenance, and
    // provenance is not a reminder. The founder's own words after the dash are.
    .replace(/^(Seed|Source|Occasioned by|Captured from|From)\b[^—\n]{0,60}—\s*/i, '')
    // BOSS's own throat-clearing. These openers say what KIND of record this is, which the id
    // already said; the sentence after them says what it IS.
    .replace(/^(?:Capture,? don'?t build(?:\s*\([^)]*\))?|The read in one line|In one line|One line)\.\s*/i, '')

    // A stripped prefix must not leave a lowercase start — but `v0.189.0` and `src/board.js` are
    // lowercase on purpose and must not be "corrected" into something that does not exist.
    .replace(/^[a-z](?![0-9./])/, (c) => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

// The first sentence, or the whole thing if it is already short. Sentence-splitting stops at a
// period followed by whitespace and a capital — which keeps `v0.104.0`, `src/board.js` and an
// ellipsis intact, the three things a naive split on '.' destroys in this corpus.
const ABBREV = /(?:^|[\s(])(?:e\.g|i\.e|vs|etc|cf|approx|no|fig|Dr|Mr|Ms|St|[A-Z])\.$/;
// A sentence too short to be a reminder is a lead-in — these records open with "The read in one
// line." and "Capture, don't build (CLAUDE.md #3)." often enough that stopping at the first period
// reports the throat-clearing and drops the idea. Keep taking sentences until there's a sentence's
// worth of meaning.
const MIN_SENTENCE = 60;
function firstSentence(line) {
  let out = line;
  for (const m of line.matchAll(/[.!?]\s+(?=[A-Z(`"'])/g)) {
    const end = m.index + 1;
    if (ABBREV.test(line.slice(0, end))) continue;   // "e.g. Cursor" is not a sentence break
    if (end < MIN_SENTENCE) continue;
    out = line.slice(0, end);
    break;
  }
  if (out.length > GIST_MAX) out = out.slice(0, GIST_MAX - 1).replace(/\s+\S*$/, '') + '…';
  return out;
}

export function cardGist(text, fm = {}) {
  if (fm.gist) return flatten(unquote(fm.gist));

  // Everything after the H1. Before it is frontmatter and the title itself.
  const h1 = text.search(/^#\s+/m);
  const body = h1 === -1 ? text.replace(/^---\n[\s\S]*?\n---\n/, '') : text.slice(h1).replace(/^#[^\n]*\n/, '');

  // A disposition banner is the record's STATUS, not its subject — and `status:` already carries
  // that. Parking a record used to rewrite its own gist, because the banner becomes the first prose
  // block in the file; four cards went from saying what they were to saying "PARKED 2026-08-20".
  // Dropped whole, not sentence-by-sentence: the banner's SECOND sentence is boilerplate too.
  const BANNER = /^(?:PARKED|RE-?GRADED|RESOLVED|SUPERSEDED|ARCHIVED|DEFERRED|DECIDED|CORRECTION)\b/i;

  // A paragraph too short to say anything is a lead-in, not a gist — "The read in one line.",
  // "Capture, don't build." Skip to the next one rather than reporting the label as the answer.
  const MIN = 45;
  const paras = [];
  let para = [];
  let quoted = false;                     // is the paragraph being built inside a blockquote?
  const flush = () => { if (para.length) paras.push({ text: para.join(' '), quoted }); para = []; };
  for (const raw of body.split('\n')) {
    const isQuote = /^\s*>/.test(raw);
    const line = raw.replace(/^\s*>\s?/, '').trim();      // a blockquote can be prose, not chrome
    if (!para.length) {
      if (!line) continue;
      quoted = isQuote;
      if (/^#{1,6}\s/.test(line)) continue;                // section headings name a section, not the idea
      if (/^(\||-{3,}|```|<)/.test(line)) continue;        // table rows, rules, fences, raw HTML
      // A bullet counts, but strip its marker and any `**What:**`-style lead-in label.
      para.push(line.replace(/^[-*+]\s+/, '').replace(/^\*\*(What|The ask|Seed|Source):\*\*\s*/i, ''));
      continue;
    }
    if (!line || /^#{1,6}\s/.test(line)) { flush(); continue; }   // paragraph ends
    para.push(line);
  }
  flush();
  // A banner is a whole leading BLOCKQUOTE, not one paragraph: BOSS's park banners run several
  // paragraphs and the later ones ("two things a future session must not misread…") are as much
  // about the disposition as the first. Only a quoted opener that starts with a disposition word
  // triggers this — a leading blockquote is often the idea itself (a founder's own words), and
  // dropping those would delete the best gist in the file.
  let rest = paras;
  if (rest.length && rest[0].quoted && BANNER.test(flatten(rest[0].text))) {
    let i = 0;
    while (i < rest.length && rest[i].quoted) i++;
    rest = rest.slice(i);
  }
  const flat = rest.map((x) => flatten(x.text)).filter((t) => t && !BANNER.test(t));
  const best = flat.find((t) => t.length >= MIN) || flat[0];
  return best ? firstSentence(best) : '';
}

// Owner-as-person (founder layer slice 2b, IDEA-037/FEAT-021): only a `@handle`
// counts as a founder owner for the team lens — role owners (`pm`) and blanks are
// ignored here. This is provenance (who's the DRI), surfaced ONLY when it's a team;
// deliberately NOT aggregated into a per-person count (that's the credit-score line
// mentor-humane drew — provenance, never a leaderboard).
const personOwner = (o) => {
  const v = unquote(o);
  return v.startsWith('@') ? v : null;
};

// A title we'd actually want on a card. Drops template placeholders
// ("<Title — one plain line>") and a leading "FEAT-NNN —" if the heading
// repeats the id. Falls back to the id.
function cardTitle(heading, id) {
  let t = (heading || '').trim();
  if (!t || t.startsWith('<')) return id;
  t = t.replace(/^(IDEA|FEAT|EXTR)-\d+\s*[—:-]\s*/i, '').trim();
  return t || id;
}

// Clipping moved to the renderers. A title truncated at collect time reached the HTML board too,
// where nothing needed it — "Temple culture layer — human-agent collaboration as…" was cut by a
// terminal's width inside a card that had room to wrap. The terminal clips; the page wraps.
const clip = (t, n) => (t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t);
const TITLE_COLS = 52;

// Is the canvas's riskiest assumption actually named, or still the placeholder?
// Mirrors the conscience hook's read: the line is
// `- **Riskiest assumption:** <text or _(placeholder)_>`.
function riskiestNamed(canvasText) {
  const m = canvasText.match(/Riskiest assumption:\*\*\s*(.*)/);
  if (!m) return false;
  const v = m[1].trim();
  if (!v) return false;
  if (v.startsWith('_')) return false; // italic placeholder _(…)_
  return true;
}

// Both readers compare the status's BASE WORD, never the whole string. `docs/IDS.md` declares the
// vocabulary as `<word> (free-form detail)` and says the detail is encouraged — so `shipped
// (v0.104.0 — the one question in /close)` is well-formed, and an `=== 'shipped'` test misses it.
// That is exactly how it shipped: twelve of BOSS's own cards — eight shipped, four in build — sat
// in the Captured column looking like raw ideas nobody had touched, and the header comment three
// screens up said "frontmatter is truth" the whole time.
function ideaColumn(status, hasRisk) {
  const s = baseStatus(status);
  if (s === 'shipped') return 'Shipped';
  if (s === 'building') return 'Building'; // promoted but no FEAT file yet
  if (hasRisk) return 'Taking shape';
  return 'Captured';
}

function featColumn(status) {
  const s = baseStatus(status);
  if (s === 'shipped' || s === 'done') return 'Shipped';
  return 'Building'; // building / drafting / blocked — all in-flight
}

// Which IDEAs have actually been pressure-tested — THE one definition, exported so
// `boss board` and `boss insights` can never disagree about it (REVIEW-2026-07-28 §A1:
// insights counted an idea as canvassed on a bare `/canvas/i` substring match against the
// file body, so "next step: run /canvas" counted, and it reported 38 canvassed on this
// repo where 0 canvases exist). The bar is the same one the Taking-shape column uses:
// an `IDEA-NNN-canvas.md` file exists AND its riskiest-assumption line is really filled in.
// Counts ideas that have already GRADUATED past the canvas too — being promoted to a FEAT
// doesn't un-pressure-test an idea.
//
// Separately reports `projectCanvas`: a single project-level `docs/ideas/CANVAS.md` (how BOSS
// itself works — one venture canvas rather than one per idea). Kept as its own fact instead of
// being folded into the count, because "the project has a canvas" and "N ideas were each
// pressure-tested" are different claims and the old code fudged the first into the second.
export function canvassedIdeas(projectDir) {
  const ideasDir = join(projectDir, 'docs', 'ideas');
  const projectCanvas = existsSync(join(ideasDir, 'CANVAS.md'));
  if (!existsSync(ideasDir)) return { ids: [], projectCanvas: false };
  let files;
  try { files = readdirSync(ideasDir).filter((f) => f.endsWith('.md')); } catch { return { ids: [], projectCanvas }; }
  const ids = [];
  for (const f of files) {
    const m = f.match(/^(IDEA-\d+)-canvas\.md$/);
    if (!m) continue;
    try {
      if (riskiestNamed(readFileSync(join(ideasDir, f), 'utf8'))) ids.push(m[1]);
    } catch { /* unreadable — don't guess */ }
  }
  return { ids, projectCanvas };
}

// Build the card list from the project's docs/ideas directory. Returns
// --- when it actually shipped, derived ------------------------------------------------------
// The board had `shipped_on:` and `building_since:` from IDEA-034 and almost nothing carried
// them, because a date someone has to remember to stamp is a rule with no mechanism — the same
// failure that let 21 records drift. Git already knows: the first commit that ADDED a record is
// when it was captured, and the first commit that added its `proof:` artifact is when the thing
// actually appeared. Frontmatter still wins when present (a founder may know better than the
// repo — work done before `git init`, or a ship date that is a launch rather than a merge); this
// only fills the silence. Fails open: no git, no dates, no invented ones.
const gitFirst = (projectDir, path) => {
  if (!path || path === 'none') return null;
  try {
    return execFileSync('git', ['log', '--diff-filter=A', '--format=%as', '-1', '--', path],
      { cwd: projectDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null;
  } catch (e) {
    // Expected: not a git checkout, git not installed, path never committed. NOT expected: a
    // ReferenceError from a missing import — which is exactly how this shipped broken the first
    // time, silently turning every derived date into null with no symptom but an empty strip.
    // Same failure as v0.179.0's readLadder() swallowing a parse error. Re-throw the ones that
    // mean the code is wrong.
    if (e instanceof ReferenceError || e instanceof TypeError) throw e;
    return null;
  }
};

// { cards: [{id, title, column, blocked}], hasIdeasDir }.
export function collectBoard(projectDir) {
  const ideasDir = join(projectDir, 'docs', 'ideas');
  if (!existsSync(ideasDir)) return { cards: [], hasIdeasDir: false };

  const files = readdirSync(ideasDir).filter((f) => f.endsWith('.md'));
  const feats = [];
  const ideas = [];
  const featSources = new Set(); // IDEA ids a FEAT was promoted from

  for (const f of files) {
    if (f === 'INDEX.md' || f === 'CANVAS.md') continue;
    if (f.includes('-canvas')) continue; // canvas files are state, not cards
    const text = readFileSync(join(ideasDir, f), 'utf8');
    const fm = frontmatter(text);
    const id = fm.id || f.replace(/\.md$/, '');
    const title = cardTitle(firstHeading(text), id);
    const priority = (fm.priority || '').trim().toLowerCase() === 'high' ? 'high' : null;
    const gist = cardGist(text, fm);
    if (/^FEAT/i.test(id)) {
      if (fm.source) featSources.add(fm.source);
      feats.push({ id, title, gist, file: `docs/ideas/${f}`, status: fm.status, nextReview: fm.next_review,
        buildingSince: fm.building_since || gitFirst(projectDir, `docs/ideas/${f}`),
        shippedOn: fm.shipped_on || gitFirst(projectDir, fm.proof),
        priority, owner: fm.owner, program: fm.program || null, progress: criteriaProgress(text) });
    } else {
      ideas.push({ id, title, gist, file: `docs/ideas/${f}`, status: fm.status, nextReview: fm.next_review, priority, owner: fm.owner,
        shippedOn: fm.shipped_on || gitFirst(projectDir, fm.proof), program: fm.program || null });
    }
  }

  // "Review due" is frontmatter-true, never guessed: an item carries an explicit
  // `next_review:` date (set when it was paused / by /revalidate) that has passed.
  // We deliberately do NOT infer staleness from age — a guessed signal would add
  // noise the founder learns to ignore. No date → not due. (IDEA-027.)
  const today = new Date().toISOString().slice(0, 10);
  const reviewDue = (nextReview, status) => {
    const s = baseStatus(status);
    if (s === 'shipped' || s === 'done' || s === 'killed' || isParked(status)) return false;
    const d = (nextReview || '').trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(d) && d <= today; // YYYY-MM-DD lexical compare
  };

  // Time-in-build aging (IDEA-034 Track B) — frontmatter-true, NEVER guessed from
  // mtime. A FEAT that's been in Building past AGING_DAYS is the zombie-feature
  // smell /revalidate targets. Reads `building_since:` (stamped by /spec when it
  // sets status: building); no date → no age signal, exactly like reviewDue.
  const todayMs = Date.parse(today);
  const daysSince = (date) => {
    const d = (date || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
    const ms = Date.parse(d);
    if (Number.isNaN(ms)) return null;
    return Math.max(0, Math.floor((todayMs - ms) / 86400000));
  };
  const ageInBuild = (buildingSince, column) => (column === 'Building' ? daysSince(buildingSince) : null);
  // How long ago a FEAT shipped (frontmatter-true, IDEA-034 follow-on). Only
  // meaningful in the Shipped column; null when no `shipped_on:` is stamped.
  const shippedAge = (shippedOn, column) => (column === 'Shipped' ? daysSince(shippedOn) : null);

  const cards = [];
  for (const ft of feats) {
    const column = featColumn(ft.status);
    const ageDays = ageInBuild(ft.buildingSince, column);
    const shippedAgeDays = shippedAge(ft.shippedOn, column);
    cards.push({
      id: ft.id,
      title: ft.title,
      gist: ft.gist,
      file: ft.file,
      status: ft.status || '',
      parked: isParked(ft.status),
      column,
      blocked: (ft.status || '').toLowerCase() === 'blocked',
      reviewDue: reviewDue(ft.nextReview, ft.status),
      ageDays,
      aging: ageDays != null && ageDays >= AGING_DAYS,
      shippedAgeDays,
      shippedOn: ft.shippedOn || null,
      program: ft.program || null,
      archived: shippedAgeDays != null && shippedAgeDays > SHIPPED_WINDOW_DAYS,
      priority: ft.priority,
      owner: personOwner(ft.owner),
      // Only meaningful while in flight — a shipped FEAT is 100% by definition,
      // and an unstarted one shows nothing rather than a discouraging 0/5.
      progress: column === 'Building' && ft.progress && ft.progress.done > 0 ? ft.progress : null,
    });
  }
  for (const id of ideas) {
    // A promoted idea is represented by its FEAT card — don't double-count it.
    if (featSources.has(id.id)) continue;
    const hasRisk = files.includes(`${id.id}-canvas.md`)
      && riskiestNamed(readFileSync(join(ideasDir, `${id.id}-canvas.md`), 'utf8'));
    cards.push({
      id: id.id,
      title: id.title,
      gist: id.gist,
      file: id.file,
      status: id.status || '',
      parked: isParked(id.status),
      column: ideaColumn(id.status, hasRisk),
      blocked: false,
      reviewDue: reviewDue(id.nextReview, id.status),
      priority: id.priority,
      owner: personOwner(id.owner),
      shippedOn: id.shippedOn || null,
      program: id.program || null,
    });
  }

  // Stable, readable order: by id within each column (handled at render time).
  return { cards, hasIdeasDir: true };
}

// The line that sits above the columns. Plain and factual — never gamified
// (voice-keeper). When there's motion but nothing pressure-tested, it says so:
// that's the humane point of the surface.
function evidenceLine(counts, total) {
  if (total === 0) return 'Nothing captured yet — `/triage <thought>` starts the board.';
  if (counts.Captured > 0 && counts['Taking shape'] === 0 && counts.Building === 0) {
    const n = counts.Captured;
    return `${n} captured, nothing pressure-tested yet — what would you learn first? (\`/canvas\`)`;
  }
  return COLUMNS
    .map((c) => `${counts[c]} ${c.toLowerCase()}`)
    .join(' · ');
}

// Within-column ordering (IDEA-034 Track B + E). `priority: high` floats to the top
// of its column (the one explicit ordering signal — a property of the work, never a
// drag-to-reorder). Then: Building surfaces the longest-running first (finish what's
// been open longest), Shipped shows newest first, the rest keep stable id order.
function sortColumn(list, col) {
  const byPriority = (a, b) => (b.priority === 'high' ? 1 : 0) - (a.priority === 'high' ? 1 : 0);
  let tiebreak;
  if (col === 'Building') {
    tiebreak = (a, b) => {
      const av = a.ageDays == null ? -1 : a.ageDays;
      const bv = b.ageDays == null ? -1 : b.ageDays;
      if (av !== bv) return bv - av;
      return a.id.localeCompare(b.id, undefined, { numeric: true });
    };
  } else if (col === 'Shipped') {
    // Newest-shipped first: dated items (by shipped_on age, younger first) ahead of
    // undated legacy items, then id-desc as the proxy when no date exists.
    tiebreak = (a, b) => {
      const aa = a.shippedAgeDays, bb = b.shippedAgeDays;
      if (aa != null && bb != null) return aa - bb;
      if (aa != null) return -1;
      if (bb != null) return 1;
      return b.id.localeCompare(a.id, undefined, { numeric: true });
    };
  } else {
    tiebreak = (a, b) => a.id.localeCompare(b.id, undefined, { numeric: true });
  }
  return [...list].sort((a, b) => byPriority(a, b) || tiebreak(a, b));
}

// Decide which Shipped cards to show vs. fold. Archives anything dated older than
// the window (frontmatter-true), then caps the still-recent (+ undated legacy) to
// SHIPPED_RECENT so the column stays bounded. Returns { shown, hidden }. `--all`
// (showAll) reveals everything. Expects `sorted` already in newest-first order.
function shippedView(sorted, showAll) {
  if (showAll) return { shown: sorted, hidden: 0 };
  const live = sorted.filter((c) => !c.archived); // not date-archived
  const shown = live.slice(0, SHIPPED_RECENT);
  return { shown, hidden: sorted.length - shown.length };
}

// Soft-wrap a gist to the terminal's comfortable width. Word-boundary only — a gist cut
// mid-word is the truncation problem this line exists to solve, reproduced one level down.
function wrap(text, width) {
  const out = [];
  let line = '';
  for (const word of String(text).split(/\s+/)) {
    if (line && (line + ' ' + word).length > width) { out.push(line); line = word; }
    else line = line ? `${line} ${word}` : word;
  }
  if (line) out.push(line);
  return out;
}

// The free-form half of a status — `shipped (v0.104.0 — the one question in /close)` → the
// parenthetical. The board threw this away for its whole life while the vocabulary doc called it
// "encouraged", and it is often the most specific thing the record says about where it stands.
function statusDetail(status) {
  const m = String(status || '').trim().match(/^[a-z]+\s*[({]?\s*(.+?)\)?$/i);
  if (!m) return '';
  const rest = m[1].trim();
  return rest && rest.toLowerCase() !== baseStatus(status) ? rest : '';
}

// Days → a compact "3w" / "5d" age string for the in-build flag.
function ageLabel(days) {
  const w = Math.floor(days / 7);
  return w >= 1 ? `${w}w` : `${days}d`;
}

// One card's flag (text). Priority: blocked > review-due > aging-in-build.
function cardFlagText(c) {
  if (c.blocked) return '  · blocked';
  if (c.reviewDue) return '  · ↻ review due';
  if (c.aging) return `  · ⌛ ${ageLabel(c.ageDays)} in build`;
  return '';
}

export function renderBoardText(projectName, data, opts = {}) {
  const showAll = opts.all === true;
  const { hasIdeasDir } = data;
  // `--mine` narrows the board to the cards I own (founder layer slice 2b) — "what am
  // I on the hook for." A team lens; harmless solo (matches nothing until @owners exist).
  let cards = data.cards;
  if (opts.mine) cards = cards.filter((c) => c.owner && c.owner.toLowerCase() === opts.mine.toLowerCase());
  // Parked work leaves the flow. A `deferred`/`dropped` record is a decision that was already
  // made, and standing it beside fresh captures asks the founder to re-read a settled question
  // every time they look at the board. It is folded, never deleted — the reasoning is the point.
  const parked = cards.filter((c) => c.parked);
  cards = cards.filter((c) => !c.parked);
  const lines = [];
  lines.push('');
  lines.push(`  ${bold(projectName + ' · board')}${opts.mine ? dim(' · ' + opts.mine) : ''}`);

  const counts = Object.fromEntries(COLUMNS.map((c) => [c, 0]));
  for (const c of cards) counts[c.column] = (counts[c.column] || 0) + 1;

  lines.push(`  ▸ ${evidenceLine(counts, cards.length)}${parked.length ? dim(` · ${parked.length} parked`) : ''}`);
  // The one thing you're on now, surfaced at the top — on a long board the Building
  // column sits below a wall of Captured cards, so a founder who lost the thread has
  // to hunt for it (EVID-001, facet 3: "I forget what feature I'm building"). Longest-
  // open in-build item = the thing to finish. Silent when nothing's in build.
  const onNow = sortColumn(cards.filter((c) => c.column === 'Building' && !c.blocked), 'Building')[0];
  if (onNow) {
    const p = onNow.progress ? dim(`  [${onNow.progress.done}/${onNow.progress.total} criteria]`) : '';
    lines.push(`  ${dim('▸ on now:')} ${bold(onNow.id)} — ${clip(onNow.title, TITLE_COLS)}${p}`);
  }
  lines.push('');

  if (!hasIdeasDir) {
    lines.push('  (no docs/ideas/ here — is this a BOSS project?)');
    lines.push('');
    return lines.join('\n');
  }

  for (const col of COLUMNS) {
    const inCol = sortColumn(cards.filter((c) => c.column === col), col);
    // Cap/age-archive the otherwise-unbounded Shipped column.
    const { shown, hidden } = col === 'Shipped'
      ? shippedView(inCol, showAll)
      : { shown: inCol, hidden: 0 };
    lines.push(`  ${bold(col)} ${dim('(' + inCol.length + ')')}`);
    if (!inCol.length) {
      lines.push(`    ${dim('—')}`);
    } else {
      for (const c of shown) {
        // `⬆` gutter marks priority: high; the status flag (blocked/aging/review) is
        // orthogonal and still shown as a suffix, so a high+aging card carries both.
        const prio = c.priority === 'high' ? '⬆ ' : '  ';
        const owner = (opts.owners && c.owner) ? `   ${c.owner}` : '';
        lines.push(`  ${prio}${c.id.padEnd(10)} ${clip(c.title, TITLE_COLS)}${cardFlagText(c)}${owner}`);
        if (opts.detail && c.gist) for (const l of wrap(c.gist, 74)) lines.push(dim(`               ${l}`));
      }
      if (hidden > 0) lines.push(`    … +${hidden} shipped earlier  (\`boss board --all\`)`);
    }
    lines.push('');
  }

  // The trigger half of /revalidate: a paused item whose next_review date has
  // passed is surfaced here so the gate has something to fire on (IDEA-027).
  const due = cards.filter((c) => c.reviewDue).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  if (due.length) {
    lines.push(`  ↻ ${due.length} past review — run \`/revalidate ${due[0].id}\` (still relevant? still aligned? anything changed?)`);
    lines.push('');
  }

  // Aging-in-build banner (IDEA-034 Track B): the longest-running open FEAT. A
  // build that's sat for weeks is the zombie-feature smell — finish it or /revalidate.
  const aging = cards.filter((c) => c.aging).sort((a, b) => b.ageDays - a.ageDays);
  if (aging.length) {
    const top = aging[0];
    lines.push(`  ⌛ ${aging.length} aging in build — ${top.id} has been open ${ageLabel(top.ageDays)}. Finish it, or \`/revalidate ${top.id}\`.`);
    lines.push('');
  }

  if (parked.length) {
    lines.push(`  ${bold('Parked')} ${dim('(' + parked.length + ')')} ${dim('— decided, not queued; each carries a written re-open trigger')}`);
    for (const c of [...parked].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))) {
      lines.push(dim(`    ${c.id.padEnd(10)} ${clip(c.title, TITLE_COLS)}  · ${baseStatus(c.status)}`));
      if (opts.detail && c.gist) for (const l of wrap(c.gist, 74)) lines.push(dim(`               ${l}`));
    }
    lines.push('');
  }

  lines.push('  The board is a read of the files. To change it, change the work:');
  lines.push('  `/triage` to capture · `/canvas` to pressure-test · `/spec` to build.');
  if (!opts.detail) lines.push(dim('  `boss board --detail` for a line on each · `boss board <ID>` for one in full.'));
  lines.push('');
  return lines.join('\n');
}

// --- Visual kanban (HTML) -------------------------------------------------
// Same projection as the terminal board, rendered as a self-contained HTML
// page (no server, no deps, no JS framework). "Updated when the board is" =
// re-run the command; the file is a pure projection of the files, exactly like
// the text board. Calm palette, not a startup-bro dashboard (voice-keeper).

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Columns are a MONOCHROME progression, not four hues — and that is a design
// decision, not a simplification. BOSS's visual language locks hi-vis as the
// BRAND, never a state, and signage colour as semantic (ISO 3864: stop / caution
// / safe). A four-colour kanban spends the whole palette on pipeline position,
// which is not a hazard and does not warrant colour. So position is carried by
// WEIGHT (faint → full ink, left to right) and colour is kept for things that
// genuinely mean something: blocked (stop), aging/past-review (caution), and the
// one hi-vis mark that says "BOSS is pointing at this."
//
// Values are inlined from site/styles/tokens.css — that file is the source of
// truth but does not ship in the npm package, and this render must be a single
// self-contained file in the founder's project. Keep them in step by hand.
const COLUMN_INDEX = Object.fromEntries(COLUMNS.map((c, i) => [c, i]));

export function renderBoardHtml(projectName, { cards: allCards, hasIdeasDir }, stampedAt) {
  // Same rule as the terminal board: parked work leaves the flow but is never deleted.
  const parked = allCards.filter((c) => c.parked);
  const cards = allCards.filter((c) => !c.parked);
  const counts = Object.fromEntries(COLUMNS.map((c) => [c, 0]));
  for (const c of cards) counts[c.column] = (counts[c.column] || 0) + 1;
  const evidence = (hasIdeasDir ? evidenceLine(counts, cards.length) : 'no docs/ideas/ here — is this a BOSS project?')
    + (parked.length ? ` · ${parked.length} parked` : '');
  // Hi-vis is BOSS pointing, never decoration (VISUAL.md). The only line that
  // earns it here is the humane-lens override: motion captured, nothing proven.
  const pointing = hasIdeasDir && cards.length > 0
    && counts.Captured > 0 && counts['Taking shape'] === 0 && counts.Building === 0;
  const due = cards.filter((c) => c.reviewDue).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

  const cardHtml = (c) => {
    const cls = (c.priority === 'high' ? ' is-priority' : '')
      + (c.blocked ? ' is-blocked' : c.reviewDue ? ' is-review' : c.aging ? ' is-aging' : '');
    const flag = c.blocked
      ? '<span class="flag blocked">blocked</span>'
      : c.reviewDue
        ? '<span class="flag review">↻ review due</span>'
        : c.aging
          ? `<span class="flag aging">⌛ ${esc(ageLabel(c.ageDays))} in build</span>`
          : '';
    const prio = c.priority === 'high' ? '<span class="prio" title="priority: high">⬆ high</span>' : '';
    // One segment per acceptance criterion — countable at a glance, and honest
    // about the denominator. A continuous bar would imply a precision the ticks
    // don't have; five boxes say "five things, two done" and nothing more.
    const prog = c.progress
      ? `<div class="prog" title="${c.progress.done} of ${c.progress.total} acceptance criteria">`
        + Array.from({ length: c.progress.total }, (_, i) => `<i${i < c.progress.done ? ' class="on"' : ''}></i>`).join('')
        + `<b>${c.progress.done}/${c.progress.total}</b></div>`
      : '';
    // The gist — the line that answers "what IS this again?" (Ajesh: *"its a bit hard to remember
    // ideas"*). Always rendered, clamped to two lines so a column of cards stays scannable, and
    // opened on hover or keyboard focus. CSS-only: this page has no script and is not getting one
    // for a disclosure triangle. The `title` attribute carries the same text so a real tooltip
    // fires too, and so it survives being read by something that isn't a browser.
    const detail = statusDetail(c.status);
    const peek = [c.gist, detail && `(${detail})`].filter(Boolean).join(' ');
    const gist = c.gist
      ? `<p class="gist">${esc(c.gist)}${detail ? ` <span class="muted">(${esc(detail)})</span>` : ''}</p>`
      : '';
    const tip = esc(`${c.id} — ${c.title}${peek ? `\n\n${peek}` : ''}`);
    return `<div class="card${cls}" tabindex="0" title="${tip}">
            <div class="id">${esc(c.id)}${prio}</div>
            <div class="title">${esc(c.title)}</div>${gist}${prog}${flag}
          </div>`;
  };

  const columnHtml = COLUMNS.map((col) => {
    const inCol = sortColumn(cards.filter((c) => c.column === col), col);
    let cardsHtml;
    if (!inCol.length) {
      cardsHtml = '<div class="empty">—</div>';
    } else if (col === 'Shipped') {
      // Date-archive old ships + cap the rest; the folded ones go in a <details>.
      const { shown, hidden } = shippedView(inCol, false);
      if (!hidden) {
        cardsHtml = inCol.map(cardHtml).join('\n');
      } else {
        const shownIds = new Set(shown.map((c) => c.id));
        const rest = inCol.filter((c) => !shownIds.has(c.id));
        cardsHtml = `${shown.map(cardHtml).join('\n')}\n<details class="more"><summary>+${hidden} shipped earlier</summary>\n<div class="cards rest">${rest.map(cardHtml).join('\n')}</div></details>`;
      }
    } else {
      cardsHtml = inCol.map(cardHtml).join('\n');
    }
    return `<section class="col" style="--hue:var(--stage-${COLUMN_INDEX[col]})">
        <h2><span class="label">${esc(col)}</span> <span class="n">${inCol.length}</span></h2>
        <div class="cards">${cardsHtml}</div>
      </section>`;
  }).join('\n');

  const dueBanner = due.length
    ? `<div class="banner review-banner">↻ ${due.length} past review — run <code>/revalidate ${esc(due[0].id)}</code> <span class="muted">still relevant? still aligned? anything changed?</span></div>`
    : '';

  const agingCards = cards.filter((c) => c.aging).sort((a, b) => b.ageDays - a.ageDays);
  const agingBanner = agingCards.length
    ? `<div class="banner aging-banner">⌛ ${agingCards.length} aging in build — <code>${esc(agingCards[0].id)}</code> open ${esc(ageLabel(agingCards[0].ageDays))} <span class="muted">finish it, or</span> <code>/revalidate ${esc(agingCards[0].id)}</code></div>`
    : '';

// --- programs: the umbrella roll-up ---------------------------------------------------------
// Ajesh, thinking the shape through out loud: *"there might be a log or notes that roll up all the
// features under it."* This is that roll-up at its cheapest — a bar per program, shipped vs open,
// derived from one frontmatter line. It answers the question a column board structurally cannot:
// not "what is in flight" but "which of the things I decided to do is actually stuck."
//
// Same restraint as the timeline: this is not a completion percentage and not a burndown. An
// umbrella with nothing shipped is a fact worth seeing, not a failing grade — BOSS's own
// `public-surface` sat at 0-of-5 while `ai-native-boss` finished 6-of-6, and both are just true.
function programRollup(cards) {
  const by = new Map();
  for (const c of cards) {
    if (!c.program) continue;
    if (!by.has(c.program)) by.set(c.program, []);
    by.get(c.program).push(c);
  }
  if (!by.size) return '';
  const rows = [...by.entries()]
    .map(([name, members]) => ({
      name,
      shipped: members.filter((m) => m.column === 'Shipped').length,
      total: members.length,
    }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
    .map((p) => {
      const pct = p.total ? Math.round((p.shipped / p.total) * 100) : 0;
      const stuck = p.shipped === 0 && p.total > 1;
      return `<div class="prog${stuck ? ' stuck' : ''}">
          <div class="prog-name">${esc(p.name)}</div>
          <div class="prog-bar"><i style="width:${pct}%"></i></div>
          <div class="prog-n">${p.shipped}<span class="muted">/${p.total}</span></div>
        </div>`;
    }).join('');
  return `<section class="programs">
      <h2><span class="label">Programs</span> <span class="n">${by.size}</span></h2>
      <div class="progs">${rows}</div>
      <p class="tl-foot"><span class="muted">One frontmatter line — <code>program:</code> — grouping records that belong together.</span></p>
    </section>`;
}

// --- the shipped timeline -------------------------------------------------------------------
// Ajesh: *"there should be a timeline view of when features get shipped, so that there is a
// visual way of seeing progress."* This is EVID-001's ask in its most literal form — *"knowing
// exactly where I am, like a train line, seeing my progress"* — and it is the first thing on this
// board that looks BACKWARD. Every other element answers "what now?"; this one answers "look what
// already happened," which is the positive register the founder said was missing.
//
// It is deliberately NOT a contribution graph. `boardLine` above carries the rule this inherits —
// plain and factual, never gamified. So: no streaks, no intensity ramp, no empty-square guilt for
// a quiet fortnight. A month with one ship and a month with six are both just months with ships
// in them. The thing being shown is CADENCE, not volume, and certainly not effort.
//
// The dates are derived (see gitFirst) rather than stamped, which is the only reason this is
// worth rendering at all: a timeline built from `shipped_on:` fields nobody fills in would have
// been an empty strip pretending to be a feature.
function shippedTimeline(cards) {
  const shipped = cards
    .filter((c) => c.column === 'Shipped' && c.shippedOn)
    .sort((a, b) => a.shippedOn.localeCompare(b.shippedOn));
  if (shipped.length < 2) return '';   // one dot is not a timeline

  const monthKey = (d) => d.slice(0, 7);
  const months = [];
  const cursor = new Date(`${monthKey(shipped[0].shippedOn)}-01T00:00:00Z`);
  const end = new Date(`${monthKey(shipped[shipped.length - 1].shippedOn)}-01T00:00:00Z`);
  while (cursor <= end && months.length < 60) {
    months.push(cursor.toISOString().slice(0, 7));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  const byMonth = new Map(months.map((m) => [m, []]));
  for (const c of shipped) {
    const k = monthKey(c.shippedOn);
    if (byMonth.has(k)) byMonth.get(k).push(c);
  }

  const cols = months.map((m) => {
    const items = byMonth.get(m) || [];
    const label = new Date(`${m}-01T00:00:00Z`)
      .toLocaleDateString('en', { month: 'short', timeZone: 'UTC' });
    const marks = items.map((c) =>
      `<i title="${esc(c.id)} — ${esc(c.title)} · shipped ${esc(c.shippedOn)}"></i>`).join('');
    return `<div class="tl-m${items.length ? '' : ' quiet'}">
        <div class="tl-marks">${marks}</div>
        <div class="tl-label">${esc(label)}</div>
      </div>`;
  }).join('');

  const first = shipped[0].shippedOn;
  const last = shipped[shipped.length - 1].shippedOn;
  return `<section class="timeline">
      <h2><span class="label">Shipped over time</span> <span class="n">${shipped.length}</span></h2>
      <div class="tl">${cols}</div>
      <p class="tl-foot">${esc(first)} → ${esc(last)} <span class="muted">· dates derived from your repo, not stamped by hand</span></p>
    </section>`;
}

  const timelineHtml = shippedTimeline(cards);
  const programHtml = programRollup(cards);
  const parkedHtml = parked.length
    ? `<section class="parked">
      <details><summary>Parked <b>${parked.length}</b> <span class="muted">— decided, not queued; each carries a written re-open trigger</span></summary>
      <div class="cards">${[...parked]
        .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
        .map(cardHtml).join('\n')}</div></details>
    </section>`
    : '';

  const pills = COLUMNS.map((col) =>
    `<span class="pill" style="--hue:var(--stage-${COLUMN_INDEX[col]})"><i></i>${esc(col)} <b>${counts[col] || 0}</b></span>`
  ).join('');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(projectName)} · board</title>
<style>
  /* BOSS board — the site-and-signage world.
     Concrete ground, graphite ink, ONE hi-vis mark at ~2% coverage. Straight
     cuts (2-3px radii), not soft cards. Display type is the mono stack, because
     the tool is the product. Signage colour is reserved for real states. */
  :root {
    color-scheme: light dark;
    --bg: #E8E6E1; --panel: #F2F1EE; --sunk: #DCDAD4;
    --ink: #16181A; --muted: #5F656B; --line: #CBC9C3;
    --hivis: #FF5C00; --hivis-text: #B33900; --ink-on-hivis: #16181A;
    --caution: #7F5800; --stop: #C01818;
    --stage-0: #9AA0A6; --stage-1: #5F656B; --stage-2: #2E3236; --stage-3: #16181A;
    --mono: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
    --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #16181A; --panel: #1F2225; --sunk: #101214;
      --ink: #E6E4DF; --muted: #9AA0A6; --line: #2E3236;
      --hivis: #FF5C00; --hivis-text: #FF7A2E;
      --caution: #E8A200; --stop: #FF6B5A;
      --stage-0: #5F656B; --stage-1: #9AA0A6; --stage-2: #CBC9C3; --stage-3: #E6E4DF;
    }
  }
  * { box-sizing: border-box; }
  body { margin: 0; font: 15px/1.55 var(--sans); background: var(--bg); color: var(--ink);
         padding: 40px 24px 64px; -webkit-font-smoothing: antialiased; }
  .wrap { max-width: 1160px; margin: 0 auto; }
  header { margin: 0 0 6px; }
  /* The one hi-vis mark on the page — a stencilled block, the way site signage
     marks the thing that matters. Brand, not state. */
  .kicker { display: inline-block; font: 700 10px/1 var(--mono); text-transform: uppercase;
            letter-spacing: .18em; color: var(--ink-on-hivis); background: var(--hivis);
            padding: 5px 8px 4px; border-radius: var(--r, 2px); margin: 0 0 10px; }
  h1 { font: 650 24px/1.2 var(--mono); letter-spacing: -.02em; margin: 0; }
  .evidence { color: var(--muted); font-size: 13.5px; margin: 8px 0 0; max-width: 64ch; }
  .evidence.points { color: var(--hivis-text); font-weight: 600; }
  .pills { display: flex; gap: 8px; flex-wrap: wrap; margin: 20px 0 24px; }
  .pill { display: inline-flex; align-items: center; gap: 7px; font: 12px/1 var(--mono);
          color: var(--muted); background: var(--panel); border: 1px solid var(--line);
          border-radius: 2px; padding: 6px 10px; }
  .pill i { width: 7px; height: 7px; background: var(--hue); flex: none; }
  .pill b { color: var(--ink); font-weight: 650; }


  /* Programs — which umbrella is moving, which is stuck. Not a burndown: an umbrella
     with nothing shipped is a fact worth seeing, not a failing grade. */
  .programs { margin: 22px 0 0; border-top: 1px solid var(--line); padding-top: 16px; }
  .programs h2 { display: flex; align-items: baseline; gap: 8px; margin: 0 0 12px;
    font: 600 11px/1 var(--mono); letter-spacing: .09em; text-transform: uppercase; color: var(--muted); }
  .programs h2 .n { font-weight: 700; color: var(--ink); }
  .progs { display: grid; gap: 7px; }
  .prog { display: grid; grid-template-columns: minmax(120px, 200px) 1fr auto; gap: 12px; align-items: center; }
  .prog-name { font: 12px/1 var(--mono); color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .prog-bar { height: 8px; background: var(--sunk); border-radius: 2px; overflow: hidden; }
  .prog-bar i { display: block; height: 100%; background: var(--stage-3); }
  .prog.stuck .prog-bar { box-shadow: inset 0 0 0 1px var(--caution); }
  .prog-n { font: 11px/1 var(--mono); color: var(--ink); min-width: 34px; text-align: right; }
  .prog-n .muted { color: var(--muted); }
  /* Shipped over time — cadence, never a scoreboard. One mark per shipped item,
     stacked in its month. No intensity ramp and no empty-square guilt: a quiet
     month is a fact about the month, not a verdict on the founder. */
  .timeline { margin: 22px 0 0; border-top: 1px solid var(--line); padding-top: 16px; }
  .timeline h2 { display: flex; align-items: baseline; gap: 8px; margin: 0 0 12px;
    font: 600 11px/1 var(--mono); letter-spacing: .09em; text-transform: uppercase; color: var(--muted); }
  .timeline h2 .n { font-weight: 700; color: var(--ink); }
  .tl { display: flex; gap: 3px; align-items: flex-end; overflow-x: auto; padding-bottom: 2px; }
  .tl-m { flex: 1 0 26px; min-width: 26px; display: flex; flex-direction: column;
    justify-content: flex-end; gap: 5px; }
  .tl-marks { display: flex; flex-direction: column-reverse; gap: 2px; min-height: 8px;
    background: var(--sunk); padding: 2px; border-radius: 2px; }
  .tl-m.quiet .tl-marks { background: transparent; box-shadow: inset 0 0 0 1px var(--line); }
  .tl-marks i { display: block; height: 6px; background: var(--stage-3); border-radius: 1px; }
  /* The most recent month is the only hi-vis mark on the strip — where you are now. */
  .tl-m:last-child .tl-marks i { background: var(--hivis); }
  .tl-label { font: 10px/1 var(--mono); color: var(--muted); text-align: center;
    white-space: nowrap; overflow: hidden; }
  .tl-foot { margin: 10px 0 0; font: 11px/1.5 var(--mono); color: var(--muted); }
  .banner { margin: 0 0 14px; padding: 11px 14px; font-size: 13px; border-radius: 2px;
            border: 1px solid var(--bar); border-left-width: 3px;
            background: color-mix(in srgb, var(--bar) 8%, var(--panel)); }
  .review-banner { --bar: var(--caution); } .aging-banner { --bar: var(--caution); }
  .banner code { font: 12px var(--mono); background: color-mix(in srgb, var(--bar) 15%, transparent);
                 padding: 2px 6px; border-radius: 2px; }
  .banner .muted { color: var(--muted); }
  .board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; align-items: start; }
  @media (max-width: 820px) { .board { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .board { grid-template-columns: 1fr; } }
  .col { min-width: 0; }
  /* Position is weight, not hue: the rule and the label gain ink left to right. */
  .col h2 { display: flex; align-items: center; justify-content: space-between; gap: 8px;
            font: 650 11px/1 var(--mono); text-transform: uppercase; letter-spacing: .1em;
            color: var(--hue); margin: 0 0 12px; padding: 0 1px 9px;
            border-bottom: 2px solid var(--hue); }
  .col h2 .n { color: var(--muted); font-weight: 650; font-size: 11px; }
  .cards { display: flex; flex-direction: column; gap: 8px; }
  .card { background: var(--panel); border: 1px solid var(--line); border-left: 3px solid var(--hue);
          border-radius: 2px; padding: 11px 13px 12px; }
  .card .id { display: flex; align-items: center; justify-content: space-between; gap: 6px;
              font: 650 10px/1.3 var(--mono); color: var(--muted); letter-spacing: .06em;
              text-transform: uppercase; }
  .card { transition: border-color .12s ease; }
  .card:hover, .card:focus-visible { border-color: var(--muted); outline: none; }
  .card .title { font-size: 14px; font-weight: 600; line-height: 1.4; margin-top: 5px;
                 overflow-wrap: anywhere; }
  /* The gist — two lines at rest, all of it on hover or keyboard focus. The card is focusable so
     this is reachable by Tab, not only by a pointer; a disclosure you can only reach with a mouse
     is a disclosure half the readers do not have. */
  .card .gist { font-size: 12.5px; line-height: 1.45; color: var(--muted); margin: 7px 0 0;
                overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;
                -webkit-line-clamp: 2; line-clamp: 2; overflow-wrap: anywhere; }
  .card:hover .gist, .card:focus-within .gist, .card:focus-visible .gist { -webkit-line-clamp: unset; line-clamp: unset; }
  @media (prefers-reduced-motion: reduce) { .card { transition: none; } }
  /* Parked — folded by default. Present, subordinate, never gone: the reasoning is the point. */
  .parked { margin: 22px 0 0; border-top: 1px solid var(--line); padding-top: 16px; }
  .parked summary { cursor: pointer; list-style: none; user-select: none;
    font: 600 11px/1 var(--mono); letter-spacing: .09em; text-transform: uppercase; color: var(--muted); }
  .parked summary::-webkit-details-marker { display: none; }
  .parked summary::before { content: "+ "; }
  .parked details[open] summary::before { content: "− "; }
  .parked summary b { color: var(--ink); font-weight: 700; }
  .parked summary .muted { text-transform: none; letter-spacing: 0; font-weight: 400; }
  .parked .cards { margin-top: 12px; display: grid; gap: 8px;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); opacity: .75; }
  .parked .card { border-left-color: var(--line); }
  .card .prio { font: 700 9.5px/1 var(--mono); letter-spacing: .06em; color: var(--hivis-text);
                border: 1px solid color-mix(in srgb, var(--hivis) 45%, transparent);
                border-radius: 2px; padding: 3px 6px; }
  /* Stuck cards pull the eye with signage, which is what signage is for. */
  .card.is-review  { border-left-color: var(--caution); }
  .card.is-aging   { border-left-color: var(--caution); }
  .card.is-blocked { border-left-color: var(--stop); background: color-mix(in srgb, var(--stop) 6%, var(--panel)); }
  .prog { display: flex; align-items: center; gap: 3px; margin-top: 9px; }
  .prog i { width: 13px; height: 4px; background: var(--line); flex: none; }
  .prog i.on { background: var(--hue); }
  .prog b { font: 650 10px/1 var(--mono); color: var(--muted); margin-left: 5px; letter-spacing: .04em; }
  .flag { display: inline-flex; align-items: center; margin-top: 9px;
          font: 650 10.5px/1 var(--mono); text-transform: uppercase; letter-spacing: .07em;
          padding: 4px 7px; border-radius: 2px; }
  .flag.review, .flag.aging { color: var(--caution); border: 1px solid color-mix(in srgb, var(--caution) 40%, transparent); }
  .flag.blocked { color: var(--stop); border: 1px solid color-mix(in srgb, var(--stop) 45%, transparent); }
  /* The empty cell is the diagnostic — keep it legible, not decorative. */
  .empty { color: var(--muted); font: 12px/1 var(--mono); padding: 10px 2px; opacity: .6; }
  details.more { margin-top: 2px; }
  details.more > summary { cursor: pointer; list-style: none; font: 11.5px var(--mono);
                           color: var(--muted); padding: 8px 2px; user-select: none; }
  details.more > summary::-webkit-details-marker { display: none; }
  details.more > summary::before { content: "+ "; }
  details.more[open] > summary::before { content: "− "; }
  details.more .rest { margin-top: 8px; opacity: .8; }
  footer { color: var(--muted); font-size: 12px; margin: 34px 0 0; padding-top: 18px;
           border-top: 1px solid var(--line); max-width: 64ch; }
  footer code { font: 11.5px var(--mono); background: var(--sunk); padding: 2px 6px; border-radius: 2px; }
</style></head>
<body>
  <div class="wrap">
    <header>
      <div class="kicker">Board</div>
      <h1>${esc(projectName)}</h1>
      <p class="evidence${pointing ? ' points' : ''}">${esc(evidence)}</p>
    </header>
    <div class="pills">${pills}</div>
    ${dueBanner}
    ${agingBanner}
    <div class="board">
${columnHtml}
    </div>
    ${programHtml}
    ${timelineHtml}
    ${parkedHtml}
    <footer>
      A read of the files — to change the board, change the work (<code>/triage</code> · <code>/canvas</code> · <code>/spec</code>).
      Re-run <code>boss board --html</code> to refresh.${stampedAt ? ` &middot; ${esc(stampedAt)}` : ''}
    </footer>
  </div>
</body></html>
`;
}

// --- Agent-readable / focused views (IDEA-034 Track A) --------------------
// The board stops being only a picture for the founder and becomes state the
// agent can read and steer by: what to pick up next, what's stuck, and the whole
// projection as JSON. Lighter cousin of the V1 `/board` skill (which also reads
// smoke / evals / declared deps the CLI projection doesn't have).

// "What should I pick up?" — ordered by the flow's own logic: finish what's open
// before starting new (the focus discipline), then build what's pressure-tested,
// then pressure-test what's only captured. Blocked work is called out separately —
// it can't move without clearing the blocker first.
export function computeNext(allCards) {
  // Parked work is not work waiting to be picked up. Without this, `--next` cheerfully told the
  // agent to `/canvas` an idea whose own record says the deferral is settled and DO-NOT-REHASH.
  const cards = allCards.filter((c) => !c.parked);
  const building = cards.filter((c) => c.column === 'Building');
  const finish = sortColumn(building.filter((c) => !c.blocked), 'Building')
    .map((c) => ({ id: c.id, title: c.title, group: 'finish', action: 'finish it', age: c.ageDays, priority: c.priority || null }));
  const start = sortColumn(cards.filter((c) => c.column === 'Taking shape'), 'Taking shape')
    .map((c) => ({ id: c.id, title: c.title, group: 'start', action: '/spec to build', priority: c.priority || null }));
  const unblock = sortColumn(building.filter((c) => c.blocked), 'Building')
    .map((c) => ({ id: c.id, title: c.title, group: 'unblock', action: 'clear the blocker', priority: c.priority || null }));
  // Only suggest pressure-testing when there's nothing further along to move.
  const pressure = (finish.length || start.length)
    ? []
    : sortColumn(cards.filter((c) => c.column === 'Captured'), 'Captured')
        .slice(0, 3)
        .map((c) => ({ id: c.id, title: c.title, group: 'pressure-test', action: '/canvas', priority: c.priority || null }));
  return { finish, start, unblock, pressure };
}

// "What's not moving?" — blocked, aging-in-build, and past-review, in one place.
export function computeStuck(allCards) {
  const cards = allCards.filter((c) => !c.parked);   // deliberately stopped is not stuck
  return {
    blocked: cards.filter((c) => c.blocked),
    aging: cards.filter((c) => c.aging).sort((a, b) => b.ageDays - a.ageDays),
    reviewDue: cards.filter((c) => c.reviewDue && !c.blocked),
  };
}

export function renderBoardNext(projectName, { cards, hasIdeasDir }) {
  const lines = ['', `  ${projectName} · next`];
  if (!hasIdeasDir) { lines.push('  (no docs/ideas/ here — is this a BOSS project?)', ''); return lines.join('\n'); }
  const { finish, start, unblock, pressure } = computeNext(cards);
  if (!finish.length && !start.length && !unblock.length && !pressure.length) {
    lines.push('  ▸ nothing in flight — `/triage` to capture or `/canvas` to pressure-test.', '');
    return lines.join('\n');
  }
  lines.push('  ▸ finish before you start', '');
  const block = (label, items, withAge) => {
    if (!items.length) return;
    lines.push(`  ${label} (${items.length})`);
    for (const it of items) {
      const prio = it.priority === 'high' ? '⬆ ' : '  ';
      const age = withAge && it.age != null && it.age >= AGING_DAYS ? `  ⌛ ${ageLabel(it.age)}` : '';
      const t = it.title.length > 40 ? clip(it.title, 40) : it.title.padEnd(40);
      lines.push(`  ${prio}${it.id.padEnd(10)} ${t} → ${it.action}${age}`);
    }
    lines.push('');
  };
  block('Finish — in build', finish, true);
  block('Start — pressure-tested, ready to build', start, false);
  block('Pressure-test — only captured so far', pressure, false);
  block('Blocked — clear to move', unblock, false);
  return lines.join('\n');
}

export function renderBoardBlocked(projectName, { cards, hasIdeasDir }) {
  const lines = ['', `  ${projectName} · not moving`];
  if (!hasIdeasDir) { lines.push('  (no docs/ideas/ here — is this a BOSS project?)', ''); return lines.join('\n'); }
  const { blocked, aging, reviewDue } = computeStuck(cards);
  if (!blocked.length && !aging.length && !reviewDue.length) {
    lines.push('  ▸ nothing blocked, nothing stale — the board is moving.', '');
    return lines.join('\n');
  }
  lines.push('');
  // Titles are capped at 52 chars by cardTitle, so padEnd(40) let long ones push the flag
  // column out of alignment. Clamp to the column width instead of padding to it (§C10).
  const col = (t, w) => (t.length > w ? t.slice(0, w - 1).trimEnd() + '…' : t.padEnd(w));
  const block = (label, items, flag) => {
    if (!items.length) return;
    lines.push(`  ${label} (${items.length})`);
    for (const c of items) lines.push(`    ${c.id.padEnd(10)} ${col(c.title, 40)} ${flag(c)}`);
    lines.push('');
  };
  block('Blocked', blocked, () => '— status: blocked');
  block('Aging in build', aging, (c) => `⌛ open ${ageLabel(c.ageDays)} — finish or /revalidate`);
  block('Review due', reviewDue, (c) => `↻ run /revalidate ${c.id}`);
  return lines.join('\n');
}

// The full projection as JSON — the actual agent-readability contract. Stable,
// machine-parseable; an agent (or the `/board` skill) reads this instead of
// re-deriving state from the files.
export function boardJson(projectDir, projectName) {
  const { cards: allCards, hasIdeasDir } = collectBoard(projectDir);
  // The counts must be the ones the board RENDERS, or the agent and the founder are looking at
  // two different boards. Parked is its own number, never folded into a column total.
  const cards = allCards.filter((c) => !c.parked);
  const parked = allCards.filter((c) => c.parked);
  const counts = Object.fromEntries(COLUMNS.map((c) => [c, 0]));
  for (const c of cards) counts[c.column] = (counts[c.column] || 0) + 1;
  const { finish, start, unblock, pressure } = computeNext(cards);
  const { blocked, aging, reviewDue } = computeStuck(cards);
  // Present cards in display order (by column, then priority/age within) so a JSON
  // consumer reads them the same way the board renders.
  const ordered = COLUMNS.flatMap((col) => sortColumn(cards.filter((c) => c.column === col), col));
  // (parked cards are reported above, not smuggled back into a column)
  return {
    project: projectName,
    hasIdeasDir,
    columns: COLUMNS,
    counts,
    total: cards.length,
    parked: parked.map((c) => ({ id: c.id, title: c.title, gist: c.gist || '', status: c.status || '' })),
    cards: ordered.map((c) => ({
      id: c.id, title: c.title, column: c.column,
      gist: c.gist || '',
      status: c.status || '',
      parked: c.parked || false,
      priority: c.priority || null,
      owner: c.owner || null,
      blocked: c.blocked, reviewDue: c.reviewDue,
      aging: c.aging || false, ageDays: c.ageDays ?? null,
      archived: c.archived || false, shippedAgeDays: c.shippedAgeDays ?? null,
    })),
    next: { finish, start, pressureTest: pressure, unblock },
    stuck: {
      blocked: blocked.map((c) => c.id),
      aging: aging.map((c) => ({ id: c.id, ageDays: c.ageDays })),
      reviewDue: reviewDue.map((c) => c.id),
    },
  };
}

// One card, in full — the terminal's answer to "let me hover over that." A founder who has lost
// the thread on a single record should not have to open the file, and should not have to read the
// whole board again to find the one line they wanted (EVID-001, facet 3).
export function renderBoardCard(projectName, { cards, hasIdeasDir }, id) {
  const want = String(id || '').trim().toUpperCase();
  const lines = [''];
  if (!hasIdeasDir) return lines.concat('  (no docs/ideas/ here — is this a BOSS project?)', '').join('\n');
  // Bare numbers are what a founder actually types after reading a column of ids.
  const norm = /^\d+$/.test(want) ? want.padStart(3, '0') : want;
  const hits = cards.filter((c) => c.id.toUpperCase() === norm
    || (/^\d+$/.test(norm) && c.id.split('-')[1] === norm));
  if (!hits.length) {
    lines.push(`  ${bold(want)} ${dim('— no such card on this board.')}`);
    lines.push(dim('  `boss board` lists them; `boss board --all` includes everything shipped.'));
    return lines.concat('').join('\n');
  }
  for (const c of hits) {
    lines.push(`  ${bold(c.id)} ${dim('·')} ${c.title}`);
    lines.push('');
    if (c.gist) for (const l of wrap(c.gist, 74)) lines.push(`  ${l}`);
    lines.push('');
    const facts = [
      ['status', c.status || dim('(none)')],
      ['column', c.parked ? `${dim('parked')} ${dim('— decided, not queued')}` : c.column],
    ];
    if (c.program) facts.push(['program', c.program]);
    if (c.owner) facts.push(['owner', c.owner]);
    if (c.progress) facts.push(['criteria', `${c.progress.done}/${c.progress.total} ticked`]);
    if (c.ageDays != null) facts.push(['in build', `${ageLabel(c.ageDays)}`]);
    // Only in the Shipped column. `shippedOn` is derived from the `proof:` artifact's first commit,
    // which exists for plenty of in-flight records — printing it on a Building card claims the
    // thing shipped, which is the exact lie this release went and fixed in the columns.
    if (c.column === 'Shipped' && c.shippedOn) facts.push(['shipped', c.shippedOn]);
    for (const [k, v] of facts) lines.push(`  ${dim(k.padEnd(9))} ${v}`);
    lines.push('');
    if (c.file) lines.push(dim(`  ${c.file}`));
    lines.push(dim('  The record says more than any card can — this is the line that reminds you which one it is.'));
    lines.push('');
  }
  return lines.join('\n');
}

export function board(projectDir, projectName, opts = {}) {
  const data = collectBoard(projectDir);
  if (opts.card) return console.log(renderBoardCard(projectName, data, opts.card));
  if (opts.next) return console.log(renderBoardNext(projectName, data));
  if (opts.blocked) return console.log(renderBoardBlocked(projectName, data));
  if (opts.json) return console.log(JSON.stringify(boardJson(projectDir, projectName), null, 2));
  console.log(renderBoardText(projectName, data, { all: opts.all, owners: opts.owners, mine: opts.mine, detail: opts.detail }));
}

// Write the visual kanban to .boss/board.html and return its path.
export function boardHtml(projectDir, projectName) {
  const data = collectBoard(projectDir);
  const stampedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const html = renderBoardHtml(projectName, data, stampedAt);
  const dir = join(projectDir, '.boss');
  const out = join(dir, 'board.html');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(out, html);
  return out;
}
