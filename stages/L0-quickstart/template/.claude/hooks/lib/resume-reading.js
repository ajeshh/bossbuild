// Resume reading — where each piece of work in flight stands, read from its record and its own git
// history, so picking work back up starts from the record rather than a page someone typed (IDEA-162).
//
// WHY NOT A FRACTION. `n/m` was tried on the four records in flight the day this was written and
// misread all four: the bottom number is how much has been written down SO FAR, and it grows as the
// work goes. It flattered a program that had found nine tasks on the way and still had a question
// open, called a record one-from-done that had sat on its last item for three commits, called a
// backlog unstarted work, and called a shipped record unfinished for lines found after it shipped.
// So the reading is three derived facts, said in words, never a ratio:
//
//   · uphill / downhill — any unanswered *Open questions* line means it's still finding out what the
//     work is (the hill chart's honest cut, read from the record, never set by hand);
//   · closing / growing / stalled — the open count replayed across the commits that touched the file;
//   · what's left inside the line — every checkbox counts as scope EXCEPT findings (*Found while
//     building*, *…after shipping*) and backlogs, which show beside it and never enter the count.
//
// Beside them: last worked = the newest commit whose message names the id (file dates lie — a sweep
// touches every record), and next = the record's `next:` line, else its first open question when
// uphill, else its first open task.
//
// Read-only, zero-dep, a handful of local git calls in all, and never throws: any surprise reads as
// nothing, and the caller says nothing.

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from './yaml.js';

export const COLD_DAYS = 14;        // in flight with no commit naming it for this long → gone cold (Ajesh, 2026-10-07)
const STALL_EDITS = 2;              // edited this many times since the last tick, with work left → stalled
const HISTORY_DAYS = 60;            // how far back the open count is replayed
const NEXT_CAP = 140;
const DAY = 86400000;

const IDEAS = 'docs/ideas';
const PROGRAMS = 'docs/programs';

const read = (p) => { try { return readFileSync(p, 'utf8').replace(/\r\n?/g, '\n'); } catch { return null; } };
const list = (d) => { try { return readdirSync(d).sort(); } catch { return []; } };
const git = (cwd, args, input) => execFileSync('git', args, {
  cwd, input, ...(input == null ? { encoding: 'utf8' } : {}), maxBuffer: 64 * 1024 * 1024, // no encoding → a Buffer (cat-file sizes are bytes)
  stdio: [input == null ? 'ignore' : 'pipe', 'pipe', 'ignore'],
});
const clip = (s, n = NEXT_CAP) => { const t = String(s).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim(); return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t; };
const base = (status) => (/^[a-z]+/i.exec(String(status || '').trim()) || [''])[0].toLowerCase();
const iso = (ms) => new Date(ms).toISOString().slice(0, 10);
const placeholder = (s) => /^\(.*\)$|^…$|^\.\.\.$/.test(s.trim());

const FOUND = /\bfound\b|after shipping|while applying/i; // not "founder", not "foundations"
const BACKLOG = /backlog|maybes|saved for later/i;
const QUESTIONS = /open questions/i;
// An answered question stays in the record for its reasoning; it is not open.
const ANSWERED = /^(~~|\*?\(?(answered|settled|moot|decided|resolved)\b|\*\*(answered|settled|moot|decided|resolved)\b)/i;

/**
 * One record's text → what its lists say. Pure.
 * @returns {{ scope: {open:number, done:number}, found:number, backlog:number, questions:number, firstOpen:string|null, firstQuestion:string|null }}
 */
export function readRecord(text) {
  const out = { scope: { open: 0, done: 0 }, found: 0, backlog: 0, questions: 0, firstOpen: null, firstQuestion: null };
  const body = String(text || '').replace(/\r\n?/g, '\n').replace(/^---\n[\s\S]*?\n---\n/, '');
  let heading = '';
  let fenced = false;
  let question = null; // the top-level question being read (continuation lines join it)
  const closeQuestion = () => {
    if (question == null) return;
    const ticked = /^\[[xX]\]/.test(question);
    const q = question.replace(/^\[[ xX]\]\s*/, '').replace(/^\*\*Q\d+\*\*\s*·\s*/, '').trim();
    if (q && !ticked && !placeholder(q) && !ANSWERED.test(q)) {
      out.questions++;
      if (!out.firstQuestion) out.firstQuestion = clip(q.replace(/^\*\*Q\d+\s*·\s*/, ''));
    }
    question = null;
  };
  for (const line of body.split('\n')) {
    if (/^\s*```/.test(line)) { fenced = !fenced; continue; }
    if (fenced) continue;
    const h = /^#{2,3}\s+(.+)$/.exec(line);
    if (h) { closeQuestion(); heading = h[1]; continue; }
    if (QUESTIONS.test(heading)) {
      const top = /^[-*][ \t]+(.*)$/.exec(line);
      if (top) { closeQuestion(); question = top[1]; }
      else if (question != null && /^[ \t]{2,}\S/.test(line) && !/^[ \t]+([-*]|\d+\.)[ \t]/.test(line)) question += ` ${line.trim()}`;
      continue;
    }
    const box = /^\s*[-*]\s+\[([ xX])\]\s*(.*)$/.exec(line);
    if (!box || placeholder(box[2]) || !box[2].trim()) continue;
    const ticked = box[1] !== ' ';
    if (FOUND.test(heading)) { if (!ticked) out.found++; continue; }
    if (BACKLOG.test(heading)) { if (!ticked) out.backlog++; continue; }
    if (ticked) out.scope.done++;
    else { out.scope.open++; if (!out.firstOpen) out.firstOpen = clip(box[2]); }
  }
  closeQuestion();
  return out;
}

/**
 * The open count across the commits that touched a record, oldest first → which way it is going. Pure.
 * @param {{date:string, open:number, done:number}[]} points
 */
export function direction(points, { now = Date.now() } = {}) {
  if (!points.length) return { kind: 'new' };
  const last = points[points.length - 1];
  if (points.length === 1) return { kind: 'new' };
  let run = points.length - 1;
  while (run > 0 && points[run - 1].open === last.open && points[run - 1].done === last.done) run--;
  const edits = points.length - 1 - run;
  if (last.open > 0 && edits >= STALL_EDITS && run > 0) return { kind: 'stalled', since: points[run].date, edits };
  const cutoff = iso(now - COLD_DAYS * DAY);
  let b = 0;
  for (let i = 0; i < points.length; i++) if (points[i].date <= cutoff) b = i;
  const from = points[b];
  const found = Math.max(0, (last.open + last.done) - (from.open + from.done));
  // Closing is measured from the PEAK, not the first point: a young record grows while its scope is
  // found (PROG-005 went 3 → 11 → 4 in two days), and "3 → 4, growing" would hide the closing half.
  let peak = b;
  for (let i = b; i < points.length; i++) if (points[i].open >= points[peak].open) peak = i;
  if (points[peak].open > last.open) return { kind: 'closing', from: points[peak].open, to: last.open, since: points[peak].date, found };
  if (from.open < last.open) return { kind: 'growing', from: from.open, to: last.open, since: from.date, found };
  return { kind: 'steady' };
}

function records(projectDir) {
  const out = [];
  const take = (dir, re) => {
    for (const name of list(join(projectDir, dir))) {
      if (!re.test(name)) continue;
      const rel = `${dir}/${name}`;
      const text = read(join(projectDir, rel));
      if (!text) continue;
      const fm = parseFrontmatter(text) || {};
      const id = String(fm.id || (/^([A-Z]+-\d+)/.exec(name) || [])[1] || '').trim().toUpperCase();
      if (!id) continue;
      const title = ((/^#\s+(.+)$/m.exec(text) || [])[1] || id).replace(new RegExp(`^${id}\\s*[—–:-]\\s*`), '').trim();
      out.push({ id, rel, title, fm, status: base(fm.status), program: /^PROG-\d+$/i.test(String(fm.program || '').trim()) ? String(fm.program).trim().toUpperCase() : null, ...readRecord(text) });
    }
  };
  take(IDEAS, /^(IDEA|FEAT)-\d+.*\.md$/);
  take(PROGRAMS, /^PROG-\d+.*\.md$/);
  return out;
}

// Newest commit date naming each id, over every branch (a worktree's commits included).
function lastNamed(projectDir, ids) {
  const found = new Map();
  if (!ids.length) return found;
  let log = '';
  try { log = git(projectDir, ['log', '--all', '--format=%x00%as%x09%s%n%b']); } catch { return found; }
  const want = new Set(ids);
  const re = /\b(?:IDEA|FEAT|PROG)-\d+\b/g;
  for (const entry of log.split('\0')) {
    if (!entry) continue;
    const date = entry.slice(0, 10);
    for (const m of entry.matchAll(re)) {
      if (want.has(m[0]) && !found.has(m[0])) found.set(m[0], date);
    }
    if (found.size === want.size) break;
  }
  return found;
}

// Each path's open count at every commit that touched it within the window, oldest first.
function history(projectDir, rels, now) {
  const series = new Map(rels.map((r) => [r, []]));
  if (!rels.length) return series;
  // git speaks in repo-root paths; a project may sit in a subfolder of its repo.
  let prefix = '';
  try { prefix = git(projectDir, ['rev-parse', '--show-prefix']).trim(); } catch { return series; }
  let log = '';
  try {
    log = git(projectDir, ['log', `--since=${iso(now - HISTORY_DAYS * DAY)}`, '--format=C %as', '--raw', '--no-renames', '--no-abbrev', '--', ...rels]);
  } catch { return series; }
  const rows = []; // newest first: { date, rel, blob }
  let date = null;
  for (const line of log.split('\n')) {
    if (line.startsWith('C ')) { date = line.slice(2, 12); continue; }
    const raw = /^:\S+ \S+ \S+ (\S+) \S+\t(.+)$/.exec(line);
    const rel = raw && raw[2].startsWith(prefix) ? raw[2].slice(prefix.length) : null;
    if (rel && date && series.has(rel) && !/^0+$/.test(raw[1])) rows.push({ date, rel, blob: raw[1] });
  }
  if (!rows.length) return series;
  const blobs = new Map();
  try {
    const buf = git(projectDir, ['cat-file', '--batch'], `${[...new Set(rows.map((r) => r.blob))].join('\n')}\n`);
    let at = 0;
    while (at < buf.length) {
      const nl = buf.indexOf(10, at);
      if (nl < 0) break;
      const [sha, , size] = buf.slice(at, nl).toString('utf8').split(' ');
      const n = Number(size);
      if (!Number.isFinite(n)) break;
      blobs.set(sha, buf.slice(nl + 1, nl + 1 + n).toString('utf8'));
      at = nl + 1 + n + 1;
    }
  } catch { return series; }
  for (const r of rows.reverse()) {
    const text = blobs.get(r.blob);
    if (text == null) continue;
    const { scope } = readRecord(text);
    series.get(r.rel).push({ date: r.date, open: scope.open, done: scope.done });
  }
  return series;
}

const rank = (e) => [
  e.worktree ? 0 : 1,
  e.hill === 'downhill' ? 0 : e.hill === 'uphill' ? 1 : 2,
  e.direction.kind === 'stalled' ? 0 : e.direction.kind === 'closing' ? 1 : 2,
  e.scope.open,
];
const byRank = (a, b) => {
  const x = rank(a), y = rank(b);
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return String(b.lastWorked || '').localeCompare(String(a.lastWorked || ''));
};

/**
 * @param {string} projectDir
 * @param {{ now?: number, worktrees?: string[], coldDays?: number }} [opts] — worktree names (`idea-162`)
 * @returns {{ pickup: object[], ready: object[], stale: object[], backlogs: object[], cold: object[] }}
 */
export function resumeReading(projectDir, { now = Date.now(), worktrees = [], coldDays = COLD_DAYS } = {}) {
  const out = { pickup: [], ready: [], stale: [], backlogs: [], cold: [] };
  try {
    const all = records(projectDir);
    const open = new Set(worktrees.map((w) => String(w).toUpperCase()));
    const done = (s) => ['shipped', 'deferred', 'dropped', 'superseded', 'retired'].includes(s);
    const inFlight = [];
    for (const r of all) {
      const isProg = r.id.startsWith('PROG-');
      r.worktree = open.has(r.id);
      const live = isProg ? r.status === 'active' : !done(r.status);
      if (!r.worktree && !live) continue;
      if (!r.worktree && r.scope.open === 0 && r.scope.done > 0) { out.stale.push(r); continue; }
      if (r.worktree || (isProg ? r.scope.open > 0 : r.status === 'building')) { inFlight.push(r); continue; }
      if (isProg && r.backlog > 0) { out.backlogs.push(r); continue; }
      if (r.status === 'ready') out.ready.push(r);
    }

    const named = lastNamed(projectDir, inFlight.map((r) => r.id));
    const series = history(projectDir, inFlight.map((r) => r.rel), now);
    const cutoff = iso(now - coldDays * DAY);
    for (const r of inFlight) {
      const pts = series.get(r.rel) || [];
      const last = pts[pts.length - 1];
      if (!last || last.open !== r.scope.open || last.done !== r.scope.done) pts.push({ date: iso(now), open: r.scope.open, done: r.scope.done });
      r.direction = r.scope.open + r.scope.done ? direction(pts, { now }) : { kind: 'none' };
      r.hill = r.questions ? 'uphill' : r.scope.open ? 'downhill' : null;
      if (named.has(r.id)) r.lastWorked = named.get(r.id);
      else {
        try { r.lastWorked = git(projectDir, ['log', '-1', '--format=%as', '--', r.rel]).trim() || null; } catch { r.lastWorked = null; }
      }
      (r.worktree || !r.lastWorked || r.lastWorked >= cutoff ? out.pickup : out.cold).push(r);
    }
    for (const p of out.pickup.concat(out.cold)) {
      if (p.id.startsWith('PROG-')) p.members = inFlight.filter((r) => r.program === p.id).map((r) => r.id);
    }
    for (const r of [...inFlight, ...out.ready]) {
      r.next = r.fm.next ? clip(r.fm.next) : r.hill === 'uphill' && r.firstQuestion ? `answer: ${r.firstQuestion}` : r.firstOpen;
    }
    out.pickup.sort(byRank);
    out.cold.sort((a, b) => String(b.lastWorked || '').localeCompare(String(a.lastWorked || '')));
  } catch {
    return { pickup: [], ready: [], stale: [], backlogs: [], cold: [] };
  }
  return out;
}

const short = (d, now) => (d && d.slice(0, 4) === iso(now).slice(0, 4) ? d.slice(5) : d);
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

/** One entry's state in words — never a ratio. */
export function stateWords(e, { now = Date.now() } = {}) {
  const d = e.direction || { kind: 'none' };
  const bits = [];
  if (e.worktree) bits.push('in a worktree');
  if (d.kind === 'none') bits.push(e.questions ? 'no task list yet' : 'no task list');
  else if (d.kind === 'stalled') bits.push(`${e.scope.open} left, no tick since ${short(d.since, now)} (${plural(d.edits, 'edit')} since)`);
  else if (d.kind === 'closing') bits.push(`${d.from} → ${d.to} open since ${short(d.since, now)}${d.found ? ` (+${d.found} found on the way)` : ''}`);
  else if (d.kind === 'growing') bits.push(`growing: ${d.from} → ${d.to} open since ${short(d.since, now)}`);
  else bits.push(`${e.scope.open} left`);
  if (e.hill === 'uphill') bits.push(`uphill: ${plural(e.questions, 'question')} open`);
  else if (e.hill === 'downhill') bits.push('downhill');
  if (e.found) bits.push(`+${e.found} found, not in scope`);
  if (e.members && e.members.length) bits.push(`members in flight: ${e.members.join(', ')}`);
  return bits.join(' · ');
}

/** The reading as terminal lines (plain text; the caller colours it if it wants). */
export function readingLines(r, { now = Date.now(), limit = Infinity, coldDays = COLD_DAYS } = {}) {
  const lines = [];
  const entry = (id, words, title, next) => {
    lines.push(`  ${id}  ${words}`);
    lines.push(`      ${clip(title, 60)}${next ? ` — next: ${next}` : ''}`);
  };
  if (r.pickup.length) {
    lines.push('Pick up');
    for (const e of r.pickup.slice(0, limit)) entry(e.id, stateWords(e, { now }), e.title, e.next);
    if (r.pickup.length > limit) lines.push(`  … and ${r.pickup.length - limit} more`);
  }
  if (limit !== Infinity) return lines;
  if (r.ready.length) {
    lines.push('', 'Ready to start');
    for (const e of r.ready) entry(e.id, plural(e.scope.open, 'task'), e.title, e.next);
  }
  if (r.stale.length) {
    lines.push('', 'Status looks stale');
    for (const e of r.stale) lines.push(`  ${e.id}  every task ticked, still \`${e.status}\` — ${clip(e.title, 60)}`);
  }
  if (r.backlogs.length) {
    lines.push('', 'Backlogs, not builds');
    for (const e of r.backlogs) lines.push(`  ${e.id}  ${e.backlog} saved, none picked — ${clip(e.title, 60)}`);
  }
  if (r.cold.length) {
    lines.push('', `Gone cold (no commit naming it in ${coldDays} days)`);
    for (const e of r.cold) lines.push(`  ${e.id}  last worked ${short(e.lastWorked, now)} · ${stateWords(e, { now })} — ${clip(e.title, 60)}`);
  }
  return lines;
}
