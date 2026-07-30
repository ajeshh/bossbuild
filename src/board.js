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
import { join } from 'node:path';
import { dim, bold } from './ui.js';

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

// Parse the first `--- ... ---` frontmatter block. Zero-dep, tolerant of the
// flat `key: value` frontmatter BOSS's templates use.
function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    const k = line.slice(0, i).trim();
    if (k) out[k] = line.slice(i + 1).trim();
  }
  return out;
}

function firstHeading(text) {
  const m = text.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : '';
}

// Owner-as-person (founder layer slice 2b, IDEA-037/FEAT-021): only a `@handle`
// counts as a founder owner for the team lens — role owners (`pm`) and blanks are
// ignored here. This is provenance (who's the DRI), surfaced ONLY when it's a team;
// deliberately NOT aggregated into a per-person count (that's the credit-score line
// mentor-humane drew — provenance, never a leaderboard).
const personOwner = (o) => {
  // Strip surrounding quotes first — a leading `@` is reserved in YAML, so the
  // convention writes `owner: "@handle"` (quoted). Both forms resolve the same.
  const v = (o || '').trim().replace(/^["']|["']$/g, '');
  return v.startsWith('@') ? v : null;
};

// A title we'd actually want on a card. Drops template placeholders
// ("<Title — one plain line>") and a leading "FEAT-NNN —" if the heading
// repeats the id. Falls back to the id.
function cardTitle(heading, id) {
  let t = (heading || '').trim();
  if (!t || t.startsWith('<')) return id;
  t = t.replace(/^(IDEA|FEAT|EXTR)-\d+\s*[—:-]\s*/i, '').trim();
  if (t.length > 52) t = t.slice(0, 51).trimEnd() + '…';
  return t || id;
}

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

function ideaColumn(status, hasRisk) {
  const s = (status || '').toLowerCase();
  if (s === 'shipped') return 'Shipped';
  if (s === 'building') return 'Building'; // promoted but no FEAT file yet
  if (hasRisk) return 'Taking shape';
  return 'Captured';
}

function featColumn(status) {
  const s = (status || '').toLowerCase();
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
    if (/^FEAT/i.test(id)) {
      if (fm.source) featSources.add(fm.source);
      feats.push({ id, title, status: fm.status, nextReview: fm.next_review, buildingSince: fm.building_since, shippedOn: fm.shipped_on, priority, owner: fm.owner });
    } else {
      ideas.push({ id, title, status: fm.status, nextReview: fm.next_review, priority, owner: fm.owner });
    }
  }

  // "Review due" is frontmatter-true, never guessed: an item carries an explicit
  // `next_review:` date (set when it was paused / by /revalidate) that has passed.
  // We deliberately do NOT infer staleness from age — a guessed signal would add
  // noise the founder learns to ignore. No date → not due. (IDEA-027.)
  const today = new Date().toISOString().slice(0, 10);
  const reviewDue = (nextReview, status) => {
    const s = (status || '').toLowerCase();
    if (s === 'shipped' || s === 'done' || s === 'killed') return false;
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
      column,
      blocked: (ft.status || '').toLowerCase() === 'blocked',
      reviewDue: reviewDue(ft.nextReview, ft.status),
      ageDays,
      aging: ageDays != null && ageDays >= AGING_DAYS,
      shippedAgeDays,
      archived: shippedAgeDays != null && shippedAgeDays > SHIPPED_WINDOW_DAYS,
      priority: ft.priority,
      owner: personOwner(ft.owner),
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
      column: ideaColumn(id.status, hasRisk),
      blocked: false,
      reviewDue: reviewDue(id.nextReview, id.status),
      priority: id.priority,
      owner: personOwner(id.owner),
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
  const lines = [];
  lines.push('');
  lines.push(`  ${bold(projectName + ' · board')}${opts.mine ? dim(' · ' + opts.mine) : ''}`);

  const counts = Object.fromEntries(COLUMNS.map((c) => [c, 0]));
  for (const c of cards) counts[c.column] = (counts[c.column] || 0) + 1;

  lines.push(`  ▸ ${evidenceLine(counts, cards.length)}`);
  // The one thing you're on now, surfaced at the top — on a long board the Building
  // column sits below a wall of Captured cards, so a founder who lost the thread has
  // to hunt for it (EVID-001, facet 3: "I forget what feature I'm building"). Longest-
  // open in-build item = the thing to finish. Silent when nothing's in build.
  const onNow = sortColumn(cards.filter((c) => c.column === 'Building' && !c.blocked), 'Building')[0];
  if (onNow) lines.push(`  ${dim('▸ on now:')} ${bold(onNow.id)} — ${onNow.title}`);
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
        lines.push(`  ${prio}${c.id.padEnd(10)} ${c.title}${cardFlagText(c)}${owner}`);
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

  lines.push('  The board is a read of the files. To change it, change the work:');
  lines.push('  `/triage` to capture · `/canvas` to pressure-test · `/spec` to build.');
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

const COLUMN_HUE = {
  Captured: '#8a8f98',
  'Taking shape': '#b8862b',
  Building: '#2f6f4f',
  Shipped: '#3a5a9b',
};

export function renderBoardHtml(projectName, { cards, hasIdeasDir }, stampedAt) {
  const counts = Object.fromEntries(COLUMNS.map((c) => [c, 0]));
  for (const c of cards) counts[c.column] = (counts[c.column] || 0) + 1;
  const evidence = hasIdeasDir ? evidenceLine(counts, cards.length) : 'no docs/ideas/ here — is this a BOSS project?';
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
    return `<div class="card${cls}">
            <div class="id">${esc(c.id)}${prio}</div>
            <div class="title">${esc(c.title)}</div>${flag}
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
    return `<section class="col" style="--hue:${COLUMN_HUE[col]}">
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

  const pills = COLUMNS.map((col) =>
    `<span class="pill" style="--hue:${COLUMN_HUE[col]}"><i></i>${esc(col)} <b>${counts[col] || 0}</b></span>`
  ).join('');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(projectName)} · board</title>
<style>
  :root {
    color-scheme: light dark;
    --bg: #f6f7f9; --panel: #ffffff; --ink: #1b1c20; --muted: #767b85;
    --line: #e7e9ee; --accent: #4b54c6; --shadow: 0 1px 2px rgba(20,22,40,.06), 0 4px 14px rgba(20,22,40,.05);
  }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #0e0f12; --panel: #17191e; --ink: #e7e8ec; --muted: #8a909b;
            --line: #25282f; --accent: #8b93ff; --shadow: 0 1px 2px rgba(0,0,0,.3), 0 6px 20px rgba(0,0,0,.35); }
  }
  * { box-sizing: border-box; }
  body { margin: 0; font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
         background: var(--bg); color: var(--ink); padding: 40px 24px 64px;
         -webkit-font-smoothing: antialiased; }
  .wrap { max-width: 1160px; margin: 0 auto; }
  header { margin: 0 0 6px; }
  .kicker { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .16em;
            color: var(--accent); margin: 0 0 5px; }
  h1 { font-size: 24px; font-weight: 680; letter-spacing: -.018em; margin: 0; display: flex; align-items: center; gap: 10px; }
  h1::before { content: ""; width: 9px; height: 9px; border-radius: 50%; background: var(--accent); flex: none;
               box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 16%, transparent); }
  .evidence { color: var(--muted); font-size: 13.5px; margin: 7px 0 0; }
  .pills { display: flex; gap: 7px; flex-wrap: wrap; margin: 18px 0 22px; }
  .pill { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted);
          background: var(--panel); border: 1px solid var(--line); border-radius: 999px; padding: 4px 11px; }
  .pill i { width: 7px; height: 7px; border-radius: 50%; background: var(--hue); }
  .pill b { color: var(--ink); font-weight: 600; }
  .banner { margin: 0 0 14px; padding: 11px 15px; border-radius: 10px; font-size: 13px;
            border: 1px solid color-mix(in srgb, var(--bar) 38%, var(--line)); background: color-mix(in srgb, var(--bar) 11%, var(--panel)); }
  .review-banner { --bar: #b8862b; } .aging-banner { --bar: #c2792f; }
  .banner code { font: 12px ui-monospace, SFMono-Regular, Menlo, monospace;
                 background: color-mix(in srgb, var(--bar) 16%, transparent); padding: 1.5px 6px; border-radius: 5px; }
  .banner .muted { color: var(--muted); }
  .board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; align-items: start; }
  @media (max-width: 820px) { .board { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .board { grid-template-columns: 1fr; } }
  .col { min-width: 0; }
  .col h2 { display: flex; align-items: center; justify-content: space-between; gap: 8px;
            font-size: 11.5px; font-weight: 650; text-transform: uppercase; letter-spacing: .07em;
            color: var(--hue); margin: 0 0 12px; padding: 0 2px 9px; border-bottom: 1.5px solid color-mix(in srgb, var(--hue) 55%, var(--line)); }
  .col h2 .n { color: var(--muted); font-weight: 600; font-size: 11px;
               background: color-mix(in srgb, var(--hue) 12%, var(--panel)); border-radius: 999px; padding: 1px 8px; }
  .cards { display: flex; flex-direction: column; gap: 9px; }
  .card { background: var(--panel); border: 1px solid var(--line); border-left: 3px solid var(--hue);
          border-radius: 9px; padding: 10px 13px 11px; box-shadow: var(--shadow);
          transition: transform .12s ease, box-shadow .12s ease; }
  .card:hover { transform: translateY(-1px); box-shadow: 0 2px 4px rgba(20,22,40,.08), 0 10px 26px rgba(20,22,40,.10); }
  .card .id { display: flex; align-items: center; justify-content: space-between; gap: 6px;
              font: 600 10px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace;
              color: color-mix(in srgb, var(--muted) 85%, transparent); letter-spacing: .04em; text-transform: uppercase; }
  /* Title carries the weight now — bold and a touch larger; the id is the quiet label. */
  .card .title { font-size: 14px; font-weight: 600; line-height: 1.38; letter-spacing: -.005em; margin-top: 4px; }
  .card .prio { font-size: 9.5px; font-weight: 700; letter-spacing: .03em; color: var(--accent);
                background: color-mix(in srgb, var(--accent) 13%, transparent); border-radius: 999px; padding: 1px 7px; }
  /* Stuck cards pull the eye: tinted panel + a heavier left bar, not just a hairline. */
  .card.is-review  { border-left-color: #b8862b; background: color-mix(in srgb, #b8862b 6%, var(--panel)); }
  .card.is-blocked { border-left-color: #b3434a; background: color-mix(in srgb, #b3434a 7%, var(--panel)); }
  .card.is-aging   { border-left-color: #c2792f; background: color-mix(in srgb, #c2792f 6%, var(--panel)); }
  .card.is-priority { border-left-color: var(--accent); }
  .flag { display: inline-flex; align-items: center; margin-top: 9px; font-size: 11px; font-weight: 600;
          padding: 2px 9px; border-radius: 999px; }
  .flag.review { background: rgba(184,134,43,.16); color: #9a6a14; }
  .flag.blocked { background: rgba(179,67,74,.16); color: #b3434a; }
  .flag.aging  { background: rgba(194,121,47,.16); color: #a5641f; }
  @media (prefers-color-scheme: dark) {
    .flag.review { color: #e0b35a; } .flag.blocked { color: #e88a90; } .flag.aging { color: #e0a566; }
  }
  .empty { color: color-mix(in srgb, var(--muted) 55%, transparent); font-size: 18px; padding: 6px 2px; }
  details.more { margin-top: 2px; }
  details.more > summary { cursor: pointer; list-style: none; font-size: 12px; color: var(--muted);
                           padding: 7px 2px; user-select: none; }
  details.more > summary::-webkit-details-marker { display: none; }
  details.more > summary::before { content: "▸ "; }
  details.more[open] > summary::before { content: "▾ "; }
  details.more .rest { margin-top: 9px; opacity: .82; }
  footer { color: var(--muted); font-size: 12px; margin: 34px 0 0; padding-top: 18px; border-top: 1px solid var(--line); }
  footer code { font: 11.5px ui-monospace, SFMono-Regular, Menlo, monospace;
                background: color-mix(in srgb, var(--muted) 14%, transparent); padding: 1.5px 6px; border-radius: 5px; }
</style></head>
<body>
  <div class="wrap">
    <header>
      <div class="kicker">Board</div>
      <h1>${esc(projectName)}</h1>
      <p class="evidence">${esc(evidence)}</p>
    </header>
    <div class="pills">${pills}</div>
    ${dueBanner}
    ${agingBanner}
    <div class="board">
${columnHtml}
    </div>
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
export function computeNext(cards) {
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
export function computeStuck(cards) {
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
      lines.push(`  ${prio}${it.id.padEnd(10)} ${it.title.padEnd(40)} → ${it.action}${age}`);
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
  const block = (label, items, flag) => {
    if (!items.length) return;
    lines.push(`  ${label} (${items.length})`);
    for (const c of items) lines.push(`    ${c.id.padEnd(10)} ${c.title.padEnd(40)} ${flag(c)}`);
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
  const { cards, hasIdeasDir } = collectBoard(projectDir);
  const counts = Object.fromEntries(COLUMNS.map((c) => [c, 0]));
  for (const c of cards) counts[c.column] = (counts[c.column] || 0) + 1;
  const { finish, start, unblock, pressure } = computeNext(cards);
  const { blocked, aging, reviewDue } = computeStuck(cards);
  // Present cards in display order (by column, then priority/age within) so a JSON
  // consumer reads them the same way the board renders.
  const ordered = COLUMNS.flatMap((col) => sortColumn(cards.filter((c) => c.column === col), col));
  return {
    project: projectName,
    hasIdeasDir,
    columns: COLUMNS,
    counts,
    total: cards.length,
    cards: ordered.map((c) => ({
      id: c.id, title: c.title, column: c.column,
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

export function board(projectDir, projectName, opts = {}) {
  const data = collectBoard(projectDir);
  if (opts.next) return console.log(renderBoardNext(projectName, data));
  if (opts.blocked) return console.log(renderBoardBlocked(projectName, data));
  if (opts.json) return console.log(JSON.stringify(boardJson(projectDir, projectName), null, 2));
  console.log(renderBoardText(projectName, data, { all: opts.all, owners: opts.owners, mine: opts.mine }));
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
