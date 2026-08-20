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

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RECORD = /^([A-Z]{3,4})-(\d+)[-.].*\.md$/;
const VOCAB = ['seedling', 'exploring', 'ready', 'building', 'shipped', 'deferred', 'dropped'];

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
    if (!VOCAB.includes(b)) {
      findings.push({ kind: 'off-vocabulary', id: r.id, file: r.file,
        what: `status "${r.status}" is not one of the seven — see docs/IDS.md` });
      continue;
    }
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
  // The expensive direction first: work you finished and did not write down.
  const rank = { 'built-not-recorded': 0, 'claimed-not-built': 1, 'duplicate-id': 2, 'off-vocabulary': 3, 'no-proof': 4 };
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
