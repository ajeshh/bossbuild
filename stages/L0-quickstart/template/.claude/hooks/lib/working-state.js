// Working state — the work in flight, read from its records, for the session start to hand back
// after a compaction or a /clear (IDEA-153).
//
// WHY THIS EXISTS. A compaction keeps a summary of the chat, the files touched last, and whatever
// lives outside the message history (CLAUDE.md, auto memory). It drops path-scoped rules until a
// matching file is read again, and it drops every task that was found mid-session and never written
// down. BOSS's working-state file lived in exactly that place (`.claude/rules/feature-context.md`,
// `paths: src/**`), and BOSS's own copy rotted for three weeks because a separate file is one more
// thing to keep. So the state moved into the records it belongs to — a FEAT's *Found while building*
// and *Open questions*, a program's *Rules every change carries*, *Tasks* and *Open questions* — and
// this reads them back. The record wins over the summary; the summary is the chat's memory, the
// record is the work's.
//
// WHICH WORK: the worktree this session is in, when its name is a record id (`idea-153`,
// `feat-012`, `prog-002`); otherwise every FEAT with `status: building`; otherwise the venture idea
// (`kind: venture` — a Quickstart project has no FEAT yet, and its idea doc is the whole state).
// A record's `program:` brings its program along.
//
// Read-only, zero-dep, bounded (well under the host's 10,000-character cap on injected context —
// past it the host swaps the text for a file path and a 2,000-character preview), and never throws:
// any surprise returns null and the caller says nothing.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from './yaml.js';
import { recordFiles, recordFile } from './record-files.js';

export const STATE_CAP = 4000;      // the whole block
const LINE_CAP = 220;               // one item
const ITEMS_CAP = 6;                // per list; the rest are counted and pointed at
const MAX_BUILDING = 2;             // FEATs in full; more are named

const PROGRAMS = 'docs/programs';
const LEGACY = '.claude/rules/feature-context.md';

const read = (p) => { try { return readFileSync(p, 'utf8').replace(/\r\n?/g, '\n'); } catch { return null; } };
const clip = (s) => { const t = s.replace(/\s+/g, ' ').trim(); return t.length > LINE_CAP ? `${t.slice(0, LINE_CAP - 1).trimEnd()}…` : t; };
const bodyOf = (text) => text.replace(/^---\n[\s\S]*?\n---\n/, '');
// A template's own example lines — `- [ ] (task — what…)`, `- (the question · …)`, `- [ ] …` — are not work.
const placeholder = (s) => /^\(.*\)$|^…$|^\.\.\.$/.test(s.trim());

// `## Heading` → its body, up to the next heading of the same or higher level.
function sections(body) {
  const out = [];
  const re = /^(#{2,3})\s+(.+)$/gm;
  const marks = [...body.matchAll(re)];
  marks.forEach((m, i) => {
    const level = m[1].length;
    let end = body.length;
    for (const n of marks.slice(i + 1)) if (n[1].length <= level) { end = n.index; break; }
    out.push({ title: m[2].trim(), text: body.slice(m.index + m[0].length, end) });
  });
  return out;
}

// Top-level list items, each with its wrapped continuation lines joined: `- [ ] a long task that
// wraps\n  onto a second line` is one item. A nested bullet (`  - …`) belongs to its parent and is
// left in the file.
function items(text) {
  const out = [];
  for (const line of text.split('\n')) {
    const top = /^[-*][ \t]+(.*)$/.exec(line) || /^\d+\.[ \t]+(.*)$/.exec(line);
    if (top) { out.push(top[1]); continue; }
    if (out.length && /^[ \t]{2,}\S/.test(line) && !/^[ \t]+([-*]|\d+\.)[ \t]/.test(line)) out[out.length - 1] += ` ${line.trim()}`;
    else if (!line.trim() || /^\S/.test(line)) out.push(null);
  }
  return out.filter((i) => i != null);
}
// The no-list (IDEA-158). A compaction summary keeps what was done and drops what was decided NOT to
// do — and a session that has lost the "no" extends the work in good faith. So the out-of-scope lines,
// the options considered and not adopted, and a program's refusals come back first, before the open
// work: the item most likely to be acted on is the one read first.
const NO_LIST = /out of scope|not adopted|not doing|won.t do|decided not|refuses/i;

const unticked = (text) => items(text).filter((i) => /^\[ \][ \t]+/.test(i))
  .map((i) => i.replace(/^\[ \][ \t]+/, '')).filter((i) => !placeholder(i));
const bullets = (text) => items(text).filter((i) => !/^\[[ xX]\]/.test(i)).filter((i) => !placeholder(i));

function pick(secs, test, take) {
  const items = [];
  for (const s of secs) if (test.test(s.title)) items.push(...take(s.text));
  return items;
}

function listLines(label, items, path) {
  if (!items.length) return [];
  const shown = items.slice(0, ITEMS_CAP).map((i) => `    - ${clip(i)}`);
  const more = items.length - shown.length;
  return [`  ${label}:`, ...shown, ...(more ? [`    - +${more} more in ${path}`] : [])];
}


function load(projectDir, rel) {
  const text = read(join(projectDir, rel));
  if (text == null) return null;
  const fm = parseFrontmatter(text) || {};
  const body = bodyOf(text);
  const title = (body.match(/^#\s+(.+)$/m) || [])[1] || fm.id || rel;
  return { rel, fm, body, title: clip(String(title)) };
}

// A FEAT or IDEA: what is still to do and what is still undecided.
function workLines(r) {
  const secs = sections(r.body);
  const head = `${r.title} — ${r.rel}${r.fm.status ? ` (${r.fm.status})` : ''}`;
  return [
    head,
    ...listLines('Decided not to do', pick(secs, NO_LIST, bullets), r.rel),
    ...listLines('Open criteria', pick(secs, /acceptance criteria/i, unticked), r.rel),
    ...listLines('Open tasks', pick(secs, /^tasks\b/i, unticked), r.rel),
    ...listLines('Found while building', pick(secs, /found while building/i, unticked), r.rel),
    ...listLines('Open questions', pick(secs, /open questions/i, (t) => [...unticked(t), ...bullets(t)]), r.rel),
  ];
}

// A program: the rules every member keeps, then what is still open at the program's level.
function programLines(r) {
  const secs = sections(r.body);
  return [
    `Program ${r.title} — ${r.rel}`,
    ...listLines('Decided not to do', pick(secs, NO_LIST, bullets), r.rel),
    ...listLines('Rules every change carries', pick(secs, /^rules every/i, bullets), r.rel),
    ...listLines('Open tasks', pick(secs, /^tasks\b/i, unticked), r.rel),
    ...listLines('Open questions', pick(secs, /open questions/i, (t) => [...unticked(t), ...bullets(t)]), r.rel),
  ];
}

// The current shape of a venture idea (Quickstart): its top section, which `/idea` keeps sharpened.
function ventureLines(r) {
  const secs = sections(r.body);
  const first = secs.find((x) => /current shape/i.test(x.title)) || secs[0];
  const shape = first ? first.text.trim().split('\n').filter(Boolean).slice(0, 8).map((l) => `    ${clip(l)}`) : [];
  return [`${r.title} — ${r.rel} (the idea; no feature is being built yet)`, ...shape,
    ...listLines('Open questions', pick(secs, /open questions/i, (t) => [...unticked(t), ...bullets(t)]), r.rel)];
}

// The pre-IDEA-153 file, if a founder wrote in it. Read, never moved or deleted: it is theirs.
function legacyLines(projectDir) {
  const text = read(join(projectDir, LEGACY));
  if (!text) return [];
  const secs = sections(bodyOf(text));
  const found = pick(secs, /found while building/i, unticked);
  const qs = pick(secs, /open questions/i, bullets);
  if (!found.length && !qs.length) return [];
  return [`From ${LEGACY} (the older home of this list — move these into the record when convenient)`,
    ...listLines('Found while building', found, LEGACY), ...listLines('Open questions', qs, LEGACY)];
}

/**
 * @param {string} projectDir
 * @param {{ worktree?: string|null }} [opts] — the open-work name of the worktree this session is in
 * @returns {{ text: string, records: string[] } | null}
 */
export function workingState(projectDir, { worktree = null } = {}) {
  try {
    const records = [];
    const m = worktree && /^(idea|feat|prog)-(\d+)$/i.exec(worktree);
    if (m) {
      const rel = recordFile(projectDir, `${m[1]}-${m[2]}`.toUpperCase());
      if (rel) records.push(rel);
    }
    let named = [];
    if (!records.length) {
      const building = recordFiles(projectDir, ['FEAT']).map((r) => r.rel)
        .filter((rel) => /^building/.test(String((parseFrontmatter(read(join(projectDir, rel)) || '') || {}).status || '')));
      records.push(...building.slice(0, MAX_BUILDING));
      named = building.slice(MAX_BUILDING);
    }

    const blocks = [];
    const programs = new Set();
    for (const rel of records) {
      const r = load(projectDir, rel);
      if (!r) continue;
      if (/^PROG-/i.test(r.fm.id || '') || rel.startsWith(PROGRAMS)) { programs.add(rel); continue; }
      blocks.push(workLines(r));
      const prog = r.fm.program && /^PROG-\d+$/i.test(String(r.fm.program).trim()) ? recordFile(projectDir, String(r.fm.program).trim()) : null;
      if (prog) programs.add(prog);
      else if (r.fm.program) blocks[blocks.length - 1].push(`  Program: ${clip(String(r.fm.program))} (no PROG record — its members share only the name)`);
    }
    for (const rel of programs) {
      const r = load(projectDir, rel);
      if (r) blocks.push(programLines(r));
    }
    if (!blocks.length) {
      const venture = recordFiles(projectDir, ['IDEA']).map((r) => r.rel).find((rel) => /^venture$/.test(String((parseFrontmatter(read(join(projectDir, rel)) || '') || {}).kind || '')));
      const r = venture && load(projectDir, venture);
      if (r) blocks.push(ventureLines(r));
    }
    const legacy = legacyLines(projectDir);
    if (legacy.length) blocks.push(legacy);
    if (named.length) blocks.push([`Also building: ${named.join(', ')}`]);
    if (!blocks.length) return null;

    let text = blocks.map((b) => b.join('\n')).join('\n\n');
    if (text.length > STATE_CAP) text = `${text.slice(0, STATE_CAP - 60).trimEnd()}\n  … (cut here; the rest is in the records named above)`;
    return { text, records: [...records, ...programs] };
  } catch {
    return null;
  }
}
