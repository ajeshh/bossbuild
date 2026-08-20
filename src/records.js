// BOSS · record drift — is what your docs claim still true of your repo?
//
// WHY THIS SHIPS. BOSS's pitch is that a project keeps a memory: typed records with frontmatter,
// so that six months in you can still answer *what did we decide, and what did we build?* In
// 2026-08 BOSS audited its own memory and found **21 of 64 records wrong, 18 of them claiming
// work was unbuilt that had shipped** — one of them for a hundred releases. The rules were all
// written down. Nothing checked them, so they were preferences.
//
// A founder inherited exactly that: `docs/IDS.md` ships the closed status vocabulary and the
// file-is-truth rule, and shipped no way to tell when either had stopped being true. This is the
// missing half. **The rules travel with the mechanism now, or they are decoration.**
//
// THE ONE IDEA: a status is a CLAIM ABOUT YOUR REPO, so check it against your repo. Every record
// names a `proof:` — the path that would not exist if the thing were not done — and the check runs
// both ways:
//   · `shipped`, proof missing  -> the record claims something the repo cannot show.
//   · not shipped, proof there  -> you built it and never said so. This is the one that costs you:
//                                  it makes finished work look unfinished, and finished work that
//                                  looks unfinished gets built twice.
//
// Naming `proof:` on something you HAVEN'T built yet is the point, not busywork — it is a tripwire
// laid in advance. The day that file appears, this says your record is stale.
//
// Zero-dep. Never throws at a caller: `boss status` must not die on a malformed record. The
// deliberate reader (`boss records`) is where problems get reported loudly.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const RECORD = /^([A-Z]{3,4})-(\d+)[-.].*\.md$/;
// The seven-word ladder governs the LIFECYCLE types only. `DEC` is decided|superseded, `PRAC` is
// active|stale|retired, `EVID` carries an evidence GRADE rather than a status at all. The first
// cut of this applied the seven to every prefix and immediately reported BOSS's own three
// decisions and its one evidence file as broken — a checker that cries wolf gets switched off,
// which is how the last three checkers died. Membership is read from IDS.md, never assumed.
const VOCAB = ['seedling', 'exploring', 'ready', 'building', 'shipped', 'deferred', 'dropped'];
const LIFECYCLE = ['IDEA', 'FEAT'];
const prefixOf = (id) => String(id || '').split('-')[0].toUpperCase();

// Other types declare their own vocabulary inline in IDS.md, as `status: a | b`. If a type
// declares one, hold it to that; if it declares none, do not invent a rule for someone else's
// record type.
function vocabFor(projectDir, prefix) {
  if (LIFECYCLE.includes(prefix)) return VOCAB;
  for (const f of ['docs/IDS.md', 'IDS.md']) {
    try {
      const text = readFileSync(join(projectDir, f), 'utf8');
      const row = text.split('\n').find((l) => l.includes(`\`${prefix}-NNN\``));
      const m = row && row.match(/`status: ([a-z |\\]+)`/);
      if (m) return m[1].split('|').map((s) => s.replace(/\\/g, '').trim()).filter(Boolean);
    } catch { /* try the next location */ }
  }
  return null;   // no declared vocabulary = nothing to enforce
}

const field = (text, name) => {
  const m = text.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
};
// The base word is what the vocabulary governs. Detail after it is free-form and never compared —
// requiring an index to echo a parenthetical verbatim makes a check fire on prose edits, and a
// check that cries wolf gets switched off, which is worse than not having one.
const baseStatus = (s) => (s || '').trim().split(/[\s(]/)[0].toLowerCase();

// Every folder a BOSS project keeps typed records in. Missing folders are normal — a Quickstart
// project has ideas and evidence and nothing else yet.
const RECORD_DIRS = ['docs/ideas', 'docs/decisions', 'docs/evidence', 'docs/practices', 'docs/features'];

function readRecords(projectDir) {
  const out = [];
  for (const d of RECORD_DIRS) {
    const dir = join(projectDir, d);
    if (!existsSync(dir)) continue;
    let names = [];
    try { names = readdirSync(dir); } catch { continue; }
    for (const n of names) {
      if (!RECORD.test(n)) continue;
      try {
        const text = readFileSync(join(dir, n), 'utf8');
        if (!text.startsWith('---')) continue;
        out.push({
          file: `${d}/${n}`,
          id: field(text, 'id') || n.match(RECORD).slice(1, 3).join('-'),
          status: field(text, 'status'),
          proof: field(text, 'proof'),
          note: field(text, 'proof_note'),
          from: field(text, 'from'),
          promotedTo: field(text, 'promoted_to'),
        });
      } catch { /* unreadable record is not a drift finding */ }
    }
  }
  return out;
}

/**
 * Findings, most-actionable first. Never throws.
 * kind: 'built-not-recorded' | 'claimed-not-built' | 'no-proof' | 'off-vocabulary' | 'duplicate-id'
 */
export function recordDrift(projectDir) {
  const findings = [];
  let records = [];
  try { records = readRecords(projectDir); } catch { return findings; }

  const byId = new Map();
  for (const r of records) {
    if (!byId.has(r.id)) byId.set(r.id, []);
    byId.get(r.id).push(r);
  }
  for (const [id, rows] of byId) {
    if (rows.length > 1) {
      findings.push({ kind: 'duplicate-id', id, file: rows[0].file,
        what: `${rows.length} files claim ${id} — every reference to it is ambiguous` });
    }
  }

  for (const r of records) {
    const b = baseStatus(r.status);
    if (!r.status) continue;
    const prefix = prefixOf(r.id);
    const allowed = vocabFor(projectDir, prefix);
    if (allowed && !allowed.includes(b)) {
      findings.push({ kind: 'off-vocabulary', id: r.id, file: r.file,
        what: `status "${r.status}" is not one of: ${allowed.join(' | ')} — see docs/IDS.md` });
      continue;
    }
    // `proof:` answers "is it built?", which is a question only the lifecycle types ask. A
    // decision is not built and evidence is not shipped.
    if (!LIFECYCLE.includes(prefix)) continue;
    if (b === 'seedling' || b === 'dropped') continue;
    // `proof:` is opt-in for a founder's own records — BOSS does not get to fail someone's
    // project for not adopting a convention they never asked for. Without it, the record simply
    // cannot be checked, and that is reported by `boss records --all`, never in `boss status`.
    if (!r.proof) {
      findings.push({ kind: 'no-proof', id: r.id, file: r.file, quiet: true,
        what: 'no `proof:` — nothing to check this claim against' });
      continue;
    }
    if (r.proof === 'none') continue;
    const there = existsSync(join(projectDir, r.proof));
    if (b === 'shipped' && !there) {
      findings.push({ kind: 'claimed-not-built', id: r.id, file: r.file,
        what: `says shipped, but ${r.proof} isn't there` });
    } else if (b !== 'shipped' && there && !r.note) {
      findings.push({ kind: 'built-not-recorded', id: r.id, file: r.file,
        what: `says "${b}", but ${r.proof} is already built` });
    }
  }
  // --- the promotion, linked both ways ------------------------------------------------------
  // `FEAT` means "an idea that earned a build contract" — named slices, or a build spanning more
  // than one release. Most ideas never need one, and forcing a second document on a one-release
  // change is the ceremony BOSS exists to refuse (Principle #2). What IS enforceable is that a
  // promotion, once made, is legible from BOTH ends: a FEAT that cannot name its idea is an
  // orphan, and an idea pointing at a FEAT that does not exist is the IDEA-059 problem wearing a
  // different hat. BOSS had 5 FEATs and not one link in either direction.
  const ids = new Set(records.map((r) => r.id));
  for (const r of records) {
    if (r.id.startsWith('FEAT-') && !r.from) {
      findings.push({ kind: 'unlinked-promotion', id: r.id, file: r.file,
        what: 'no `from:` — a build contract that cannot name the idea it came from (use `from: none` if it had no idea)' });
    }
    if (r.from && r.from !== 'none' && !ids.has(r.from)) {
      findings.push({ kind: 'unlinked-promotion', id: r.id, file: r.file,
        what: `\`from: ${r.from}\` — no such record` });
    }
    for (const target of (r.promotedTo || '').split(',').map((s) => s.trim()).filter(Boolean)) {
      if (!ids.has(target)) {
        findings.push({ kind: 'unlinked-promotion', id: r.id, file: r.file,
          what: `\`promoted_to: ${target}\` — no such record` });
      }
    }
  }

  // The expensive direction first: work you finished and did not write down.
  const rank = { 'built-not-recorded': 0, 'claimed-not-built': 1, 'duplicate-id': 2, 'unlinked-promotion': 3, 'off-vocabulary': 4, 'no-proof': 5 };
  return findings.sort((a, b) => (rank[a.kind] ?? 9) - (rank[b.kind] ?? 9));
}

/** The `boss status` line. One line, only for findings a founder would want interrupted for. */
export function driftLine(projectDir) {
  const loud = recordDrift(projectDir).filter((f) => !f.quiet);
  if (!loud.length) return null;
  const built = loud.filter((f) => f.kind === 'built-not-recorded').length;
  // Lead with the positive-register finding when there is one: this is work they DID.
  const head = built
    ? `${built} record${built === 1 ? '' : 's'} describe${built === 1 ? 's' : ''} work you've already finished`
    : `${loud.length} record${loud.length === 1 ? '' : 's'} no longer match${loud.length === 1 ? 'es' : ''} your repo`;
  return { head, count: loud.length };
}


// --- allocation: a computation, not an instruction ----------------------------------------
// BOSS's own website says this out loud, and it was true: *"you don't allocate the number —
// /triage reads the folder and takes the next free one. But that's a sentence in a skill file
// telling an agent to count, not code that computes, and the difference is invisible right up
// until it isn't."* It broke exactly that way — two files claimed IDEA-059 on the same day, and
// every reference to it was ambiguous until a person noticed.
//
// `boss records` DETECTS a collision after the fact. That is not the same as preventing one, and
// pretending it is would be the drift this whole area exists to stop. This is the prevention half.
//
// It scans ALL of `docs/` recursively rather than one folder, because a planning doc can reserve
// a number before the folder exists — `docs/ideas/INDEX.md` naming `IDEA-063` counts, and a
// counter that only reads `docs/ideas/` would hand out 063 again.
// WHICH prefixes count is READ FROM `docs/IDS.md`, never guessed by shape. A bare
// /[A-Z]{3,4}-\d+/ sweep looks right and is not: the first run of this returned `CVE-2027`,
// `SHA-257` and `CHI-2027` as next free numbers, having found a vulnerability id, a hash
// algorithm and a conference in the prose. A project's record types are declared in its own
// IDS.md, so that is the vocabulary — the same computed-membership rule `check-refs` uses for
// agents and skills. Add a type to IDS.md and this follows, with no edit here.
const DEFAULT_PREFIXES = ['IDEA', 'FEAT', 'DEC', 'EVID', 'PRAC', 'EXTR', 'RFC', 'EXP'];

function declaredPrefixes(projectDir) {
  for (const f of ['docs/IDS.md', 'IDS.md']) {
    try {
      const text = readFileSync(join(projectDir, f), 'utf8');
      const found = [...text.matchAll(/`([A-Z]{3,4})-NNN`/g)].map((m) => m[1]);
      if (found.length) return [...new Set(found)];
    } catch { /* try the next location */ }
  }
  return DEFAULT_PREFIXES;
}


function walkDocs(dir, out = [], depth = 0) {
  if (depth > 4) return out;
  let entries = [];
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walkDocs(p, out, depth + 1);
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

/**
 * Highest number seen for each prefix, anywhere under docs/ — in filenames AND in prose, because
 * a number reserved in an index is taken even if no file exists yet. Never throws.
 */
export function idCensus(projectDir) {
  const seen = new Map();
  const allowed = new Set(declaredPrefixes(projectDir));
  const ID_ANYWHERE = new RegExp(`\\b(${[...allowed].join('|')})-(\\d{1,4})\\b`, 'g');
  const bump = (prefix, n) => {
    if (!Number.isFinite(n) || !allowed.has(prefix)) return;
    if (!seen.has(prefix) || n > seen.get(prefix)) seen.set(prefix, n);
  };
  // FILENAMES count anywhere under docs/ — a record is a record wherever it is filed.
  // PROSE counts only inside the RECORD FOLDERS, and that distinction is not fussiness: BOSS's
  // OWN shipped docs use example ids to explain the system (`docs/IDS.md` shows IDEA-014 → FEAT-003,
  // `capture-loop.md` mentions IDEA-005), and the first cut counted them. A brand-new project was
  // offered **IDEA-045** as its first idea. Illustrations in documentation are not reservations.
  // The case prose scanning exists for — `docs/ideas/INDEX.md` naming a number before the file
  // exists — lives in a record folder, so it is still caught.
  const recordRoots = RECORD_DIRS.map((d) => join(projectDir, d));
  for (const f of walkDocs(join(projectDir, 'docs'))) {
    const base = f.slice(f.lastIndexOf('/') + 1);
    const m = base.match(/^([A-Z]{3,4})-(\d+)/);
    if (m) bump(m[1], parseInt(m[2], 10));
    if (!recordRoots.some((r) => f.startsWith(r + '/'))) continue;
    let text = '';
    try { text = readFileSync(f, 'utf8'); } catch { continue; }
    for (const hit of text.matchAll(ID_ANYWHERE)) bump(hit[1], parseInt(hit[2], 10));
  }
  return seen;
}

/** The next free number for a prefix, zero-padded to the width already in use. */
export function nextId(projectDir, prefix) {
  const p = String(prefix || '').toUpperCase().replace(/-.*$/, '');
  if (!declaredPrefixes(projectDir).includes(p)) return null;
  const highest = idCensus(projectDir).get(p) ?? 0;
  return `${p}-${String(highest + 1).padStart(3, '0')}`;
}

// --- the transition, derived rather than remembered ---------------------------------------
// Ajesh: *"we aren't tracking ideas moving into building or when it ships."* True — 2 of 67
// records carried a date. The reflex fix is to ask people to stamp one, which is another rule
// with no mechanism, and it rots the same way everything else here rotted.
//
// So it is DERIVED. The repo already knows: a record's first commit is when it was captured, and
// its `proof:` artifact's first commit is when the thing actually appeared. Nobody has to
// remember anything, and the dates cannot drift from reality because they ARE reality.
// Fails open — not a git checkout, not a finding.
const firstCommit = (projectDir, path) => {
  try {
    const out = execFileSync('git', ['log', '--diff-filter=A', '--format=%as', '-1', '--', path],
      { cwd: projectDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return out || null;
  } catch { return null; }
};

/** [{ id, status, captured, shipped, lagDays }] — sorted oldest-captured first. Never throws. */
export function timeline(projectDir) {
  const rows = [];
  for (const r of readRecords(projectDir)) {
    const captured = firstCommit(projectDir, r.file);
    const shipped = r.proof && r.proof !== 'none' ? firstCommit(projectDir, r.proof) : null;
    let lagDays = null;
    if (captured && shipped) {
      lagDays = Math.round((Date.parse(shipped) - Date.parse(captured)) / 86400000);
    }
    rows.push({ id: r.id, file: r.file, status: baseStatus(r.status), captured, shipped, lagDays });
  }
  return rows.sort((a, b) => String(a.captured).localeCompare(String(b.captured)));
}
