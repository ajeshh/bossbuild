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
import { STATUS_VOCAB, baseStatus } from './frontmatter.js';

const RECORD = /^([A-Z]{3,4})-(\d+)[-.].*\.md$/;
// The seven-word ladder governs the LIFECYCLE types only. `DEC` is decided|superseded, `PRAC` is
// active|stale|retired, `EVID` carries an evidence GRADE rather than a status at all. The first
// cut of this applied the seven to every prefix and immediately reported BOSS's own three
// decisions and its one evidence file as broken — a checker that cries wolf gets switched off,
// which is how the last three checkers died. Membership is read from IDS.md, never assumed.
const VOCAB = STATUS_VOCAB;
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

// --- fields that LOOK filled in and are read by nothing -------------------------------------
// A record's frontmatter is only as good as the reader that opens it, and a near-miss field name
// fails in the worst possible direction: it looks answered. Nothing is missing, so nothing is
// reported, and the value sits there being ignored.
//
// BOSS shipped this bug at its source. The `/spec` FEAT template wrote `source: IDEA-NNN` while
// the skill body two files away and this checker both required `from:` — so a founder who
// followed BOSS's own template got told their build contract "cannot name the idea it came from",
// about a link they had made. Four of BOSS's own records dated a ship with `shipped:`, which the
// board does not read, so those ships silently fell back to a git guess.
//
// Deliberately an ALIAS list, never a whitelist. `source:` appears 39 times across BOSS's own
// records as free-form provenance ("Ajesh, 2026-08-20 — <quote>") and every one of those is
// correct usage; the only ones flagged are those whose VALUE is a record id, which is someone
// reaching for `from:` and missing. A whitelist would fail people for annotating their own
// records, and a checker that cries wolf gets switched off — which is how the last three died.
const RECORD_ID = /^[A-Z]{3,4}-\d+$/;
// [dead field, the field readers actually open, only-when-the-value-is-a-record-id]
const ALIASES = [
  ['source', 'from', true],
  ['implements', 'from', true],
  ['promoted_from', 'from', true],
  ['shipped', 'shipped_on', false],
];

// --- the split: where the rest of the work went -------------------------------------------
// A build contract closes at the scope it was WRITTEN at. When scope grows mid-build, the honest
// move is to ship what was specced and spin the remainder to a new id — not to widen the
// acceptance criteria of something already in flight, which is the single act that turns a
// feature into one that is perpetually 90% done.
//
// BOSS improvised exactly this four times and never named it: `spun_from:` ×4, `shipped_threads:`,
// a `note:` on FEAT-021, and prose in eight more records. FEAT-023 ↔ IDEA-040 is the worked
// example done RIGHT — the FEAT shipped threads 1-2 and says thread 3 spun out; IDEA-040 says it
// came from FEAT-023 thread 3 — and the link was bidirectional in PROSE, through two differently
// named fields that no reader opened. That is PRINCIPLE #1's whole subject: a pattern proven four
// times and never sorted up. `program:` was improvised 60+ times before it got a field.
//
// Parsed the way a STATUS is parsed: the leading token is the link, everything after is free-form
// detail and is encouraged. `spun_from: FEAT-023 thread 3 (split when 1-2 shipped)` links and
// keeps its sentence. Three of the four existing uses are pure provenance prose ("what's-missing
// gap pass 2026-06-20 (Ajesh — ...)") and must never be flagged — so a leading token that is not
// record-shaped is not a link, and nothing is checked. Same posture as the ALIASES list above:
// derive the rule from how the field is really used, never from how you wish it were used.
const splitLinks = (v) => String(v || '')
  .split(',')
  .map((part) => part.trim().split(/[\s(]/)[0])   // leading token; detail after it is free
  .filter((t) => RECORD_ID.test(t));

const field = (text, name) => {
  const m = text.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
};

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
          program: field(text, 'program'),
          buildingSince: field(text, 'building_since'),
          spunTo: splitLinks(field(text, 'spun_to')),
          spunFrom: splitLinks(field(text, 'spun_from')),
          aliases: ALIASES.map(([dead, live, idShaped]) => {
            const v = field(text, dead);
            if (v === null) return null;
            if (idShaped && !RECORD_ID.test(v)) return null;   // free-form prose, not a reach for `live`
            return { dead, live, value: v, already: field(text, live) };
          }).filter(Boolean),
        });
      } catch { /* unreadable record is not a drift finding */ }
    }
  }
  return out;
}

/**
 * Findings, most-actionable first. Never throws.
 * kind: 'built-not-recorded' | 'claimed-not-built' | 'no-proof' | 'off-vocabulary' | 'duplicate-id'
 *     | 'unlinked-promotion' | 'broken-split' | 'stale-field'
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
      } else if (byId.get(target)[0].from !== r.id) {
        findings.push({ kind: 'unlinked-promotion', id: r.id, file: r.file,
          what: `\`promoted_to: ${target}\`, but ${target} says \`from: ${byId.get(target)[0].from || '(nothing)'}\` — the two ends disagree about the promotion` });
      }
    }
    // RECIPROCITY, which is the half the docs have always claimed and no code has ever checked.
    // `docs/IDS.md` says a promotion "is legible from BOTH ends, and that part IS enforced
    // (`npm run check:backlog`)" — and `check-backlog.js` does not contain the string
    // `promoted_to` at all. The shipped IDS says "`boss records` checks both directions", which
    // was half-true: it read both fields and verified each TARGET EXISTS, never that the two
    // point at each other. Two records can therefore both pass while disagreeing about the same
    // promotion — which is the IDEA-059 ambiguity again, wearing the link's clothes.
    //
    // Adding it cost nothing: all 87 of BOSS's own records already satisfy it. That is the
    // signal that the RULE is right and only the enforcement was missing — the opposite of
    // IDEA-015's case, where the rule was violated 46 times because the rule itself was wrong.
    if (r.from && r.from !== 'none' && ids.has(r.from)) {
      const back = (byId.get(r.from)[0].promotedTo || '').split(',').map((t) => t.trim());
      if (!back.includes(r.id)) {
        findings.push({ kind: 'unlinked-promotion', id: r.id, file: r.file,
          what: `\`from: ${r.from}\`, but ${r.from} does not say \`promoted_to: ${r.id}\` — the promotion reads from one end only` });
      }
    }
  }

  // --- the split, legible from both ends -----------------------------------------------------
  // The reciprocity is the point, and it is the half the improvised version kept losing. Someone
  // reading the CLOSED record has to be able to see where the rest of the work went; a `spun_from:`
  // on the new record alone means the answer only exists somewhere you would have to already know
  // to look. This is the one thing `from:`/`promoted_to:` does NOT check — it verifies each end
  // exists without ever verifying they point at each other — so the newer field gets the stricter
  // rule rather than inheriting the older one's gap.
  for (const r of records) {
    for (const target of r.spunTo) {
      if (!ids.has(target)) {
        findings.push({ kind: 'broken-split', id: r.id, file: r.file,
          what: `\`spun_to: ${target}\` — no such record. The scope that left this one has nowhere to be` });
      } else if (!byId.get(target)[0].spunFrom.includes(r.id)) {
        findings.push({ kind: 'broken-split', id: r.id, file: r.file,
          what: `\`spun_to: ${target}\`, but ${target} does not say \`spun_from: ${r.id}\` — the split reads from one end only` });
      }
    }
    for (const source of r.spunFrom) {
      // `spun_from:` pointing at the same record `from:` already names is not a split — it is the
      // promotion said twice. FEAT-023 carries both, and reporting it as "IDEA-037 forgot its
      // `spun_to:`" would send someone to add a link that should not exist. A split is where
      // scope LEFT a record; a promotion is where the record CAME FROM. Different directions.
      if (r.from && r.from === source) {
        findings.push({ kind: 'broken-split', id: r.id, file: r.file,
          what: `\`spun_from: ${source}\` duplicates \`from: ${source}\` — the promotion is already recorded, and two fields saying it can only drift. A split is scope that LEFT a record, not where this one came from` });
        continue;
      }
      if (!ids.has(source)) {
        findings.push({ kind: 'broken-split', id: r.id, file: r.file,
          what: `\`spun_from: ${source}\` — no such record` });
      } else if (!byId.get(source)[0].spunTo.includes(r.id)) {
        findings.push({ kind: 'broken-split', id: r.id, file: r.file,
          what: `\`spun_from: ${source}\`, but ${source} does not say \`spun_to: ${r.id}\` — whoever reads ${source} cannot see that this exists` });
      }
    }
  }

  // --- the field nothing reads --------------------------------------------------------------
  // Reported per record, not per field, so a record with two of them is one line to go fix.
  for (const r of records) {
    for (const a of r.aliases || []) {
      findings.push({ kind: 'stale-field', id: r.id, file: r.file,
        what: a.already
          ? `\`${a.dead}: ${a.value}\` — nothing reads \`${a.dead}:\`; this record already carries \`${a.live}:\`, so the two can only drift apart`
          : `\`${a.dead}: ${a.value}\` — nothing reads \`${a.dead}:\`. The field readers open is \`${a.live}:\`` });
    }
    // /spec: when status moves to shipped, drop `building_since:` and stamp `shipped_on:`. The
    // board only ages a FEAT while it sits in Building, so a leftover date is untidy rather than
    // wrong — but it is the record saying two things at once, and it is one line to settle.
    if (r.buildingSince && baseStatus(r.status) === 'shipped') {
      findings.push({ kind: 'stale-field', id: r.id, file: r.file,
        what: '`building_since:` on a shipped record — drop it and keep `shipped_on:` (the board reads that one)' });
    }
  }

  // The expensive direction first: work you finished and did not write down.
  const rank = { 'built-not-recorded': 0, 'claimed-not-built': 1, 'duplicate-id': 2, 'unlinked-promotion': 3, 'broken-split': 4, 'stale-field': 5, 'off-vocabulary': 6, 'no-proof': 7 };
  return findings.sort((a, b) => (rank[a.kind] ?? 9) - (rank[b.kind] ?? 9));
}

/** The `boss status` line. One line, only for findings a founder would want interrupted for.
 *
 * This function and its one caller used to disagree about what "worth interrupting for" meant, and
 * the caller was the honest one. `cmdStatus` said *"ONLY the direction that is good news"* while
 * this fell back to `N records no longer match your repo` whenever there was no good news — so a
 * founder opening `boss status` got a chore line the surface had promised not to carry. Observed on
 * a project whose only findings were missing `from:` fields.
 *
 * Two things reach status now, and nothing else:
 *
 *   1. `built-not-recorded` — work they FINISHED and did not write down. The positive register, and
 *      the reason this line exists at all.
 *   2. `duplicate-id` — two files claiming one number. This is the one finding that is not a chore:
 *      it does not describe a record being untidy, it makes every REFERENCE to that id ambiguous,
 *      including the ones in other records. It corrupts the vocabulary the rest of the board reads.
 *
 * Everything else — `claimed-not-built`, `unlinked-promotion`, `stale-field`, `off-vocabulary` — is real, stays in
 * `recordDrift`, and is what `boss records` is for. A founder goes there to tidy; they come to
 * `boss status` to find out where they are.
 */
export function driftLine(projectDir) {
  const loud = recordDrift(projectDir).filter((f) => !f.quiet);
  if (!loud.length) return null;

  // Lead with the positive-register finding when there is one: this is work they DID.
  const built = loud.filter((f) => f.kind === 'built-not-recorded').length;
  if (built) {
    return {
      head: `${built} record${built === 1 ? '' : 's'} describe${built === 1 ? 's' : ''} work you've already finished`,
      count: built,
    };
  }

  // The one non-chore. Phrased as the CONSEQUENCE, not the count, because the count is not the
  // problem — a founder who reads "2 findings" tidies later, and one who reads "every reference to
  // it is ambiguous" understands why it cannot wait.
  const dupes = loud.filter((f) => f.kind === 'duplicate-id');
  if (dupes.length) {
    const ids = [...new Set(dupes.map((f) => f.id))];
    return {
      head: `${ids.join(', ')} ${ids.length === 1 ? 'is claimed by two files' : 'are each claimed by two files'} — every reference to ${ids.length === 1 ? 'it' : 'them'} is ambiguous`,
      count: ids.length,
    };
  }

  return null;
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


// --- programs: the umbrella, at its seed rung ------------------------------------------------
// Ajesh: *"I thought we also did projects, where ideas or features get grouped if it's under the
// same umbrella?"* We didn't — and had improvised one 60+ times ("Phase 1" x24, "Phase 2" x22,
// slices, threads, Tracks) without ever naming it. A pattern proven that many times and never
// sorted UP is exactly what PRINCIPLE #1 exists to catch.
//
// His own instinct on the shape was the right one: *"as it gets more complex, eventually the
// program, if it stays frontmatter, will get complex, and there might be a log or notes that roll
// up all the features under it."* Correct — and the two are not alternatives, they are a LADDER,
// which is BOSS's own seed-to-scale practice pointed at itself:
//
//   SEED        `program: <slug>` — one frontmatter line. Groups records. Costs nothing.
//   GRADUATION  a `PROG-NNN` record, when there is something to write down that belongs to NO
//               SINGLE MEMBER: why these belong together, what got decided across them, what was
//               refused. The frontmatter field never changes shape — its value goes from a slug
//               to an id (`program: PROG-001`), so nothing migrates.
//
// The trigger is NOT a member count. "Three or more records" is arbitrary ceremony, and ceremony
// you don't need is what makes people stop keeping records at all. It is the seam test from
// seed-to-scale.md: skip six months — what is GONE versus merely UNDONE? For a program, the thing
// that goes is the cross-member reasoning. Nothing else holds it.
//
// Only the seed ships here. The graduation is documented so it is legible when it is earned, and
// deliberately unbuilt until a real program needs it.
export function programs(projectDir) {
  const byName = new Map();
  for (const r of readRecords(projectDir)) {
    if (!r.program) continue;
    if (!byName.has(r.program)) byName.set(r.program, []);
    byName.get(r.program).push(r);
  }
  return [...byName.entries()]
    .map(([name, members]) => ({
      name,
      graduated: /^[A-Z]{3,4}-\d+$/.test(name),   // the value is an id, not a slug
      members: members.sort((a, b) => a.id.localeCompare(b.id)),
      shipped: members.filter((m) => baseStatus(m.status) === 'shipped').length,
      open: members.filter((m) => !['shipped', 'dropped'].includes(baseStatus(m.status))).length,
    }))
    .sort((a, b) => b.members.length - a.members.length);
}
