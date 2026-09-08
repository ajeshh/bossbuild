#!/usr/bin/env node
// BOSS · backlog integrity — does the record of what BOSS has built agree with itself?
//
// WHY THIS EXISTS: a sweep in 2026-08-20 compared three sources that had never been compared —
// each idea file's `status:` frontmatter, its row in `docs/ideas/INDEX.md`, and the artifacts
// actually on disk. **21 of 64 records disagreed, and in 18 of them the index under-reported work
// that had already shipped** — `IDEA-001` still read *"ready — next build"* while `/boss-learn`
// and `/boss-sync` had been in the L0 template since v0.2.0; `IDEA-032` read *"the clearest 2026
// miss"* next to a shipped `AGENTS.md`; `boss adopt` and `boss board` were live CLI commands
// filed under `exploring` and `building`.
//
// That is not sloppiness, it is a missing gate. Every other surface BOSS owns has one —
// `check:refs` for references, `check:manifests` for rosters, `check:ladder` for adoption,
// `check:site` for the website's claims. The backlog — the thing that answers *"what should I
// build next?"* — had none, so it rotted in the one direction that costs the most: it made
// finished work look unfinished, which is how a founder rebuilds what they already have.
//
// THE ROOT CAUSE WAS VOCABULARY. `docs/IDS.md` declared six statuses. The files used fifteen —
// `implemented`, `built`, `keystone-shipped`, `resolved` and `adopted-as-backlog` all meant
// *shipped*, spelled five ways. No reader could sort them at a glance and no checker could
// compare them at all. So this script starts by enforcing the closed vocabulary, and everything
// else it checks becomes possible only after that.
//
// THE RULE IT ENCODES: **frontmatter is truth, INDEX is a view.** `IDEA-015` wrote that sentence
// down for `boss board` and the index drifted from it anyway. A rule stated in one record and
// enforced nowhere is a preference.
//
// Zero-dep by rule. Exit 1 on any finding so `npm test` and the release gate can gate on it.
// `--strict` is accepted for symmetry with the other checks; every finding here is already hard.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STATUS_VOCAB, baseStatus } from '../src/frontmatter.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const IDEAS = join(ROOT, 'docs', 'ideas');

// The seven words, declared in docs/IDS.md — now read from the one shared parser rather than a
// third private copy of the same list (src/frontmatter.js).
const VOCAB = STATUS_VOCAB;

// --- the vocabulary, enforced where it is TAUGHT as well as where it is used ----------------
// Everything below checks BOSS's own records. This checks the shipped skills that tell a founder
// what to write in one — the half that had no gate, and the half that reaches strangers.
//
// `/revalidate` routed a dead item to `status: killed` / `folded` and a revived one to `active`;
// `/sunset` marked a removed FEAT `retired` (or `sunset`). Five words, none of them among the
// seven. The cost was not cosmetic: `boss records` flagged the founder for following the skill,
// and `boss board` files an unrecognised FEAT status as in-flight — so the two verbs that exist
// to END work were the only reliable way to create a permanent Building card.
//
// PRECISION, deliberately. It reads only INLINE-CODE `\`status: x\`` — which is how a skill writes
// an *instruction* about a record in flight, and in every shipped instance that record is an IDEA
// or FEAT. A BARE `status:` line inside a fenced block is a TEMPLATE for a typed record, and those
// types declare their own vocabularies in docs/IDS.md (`DEC` is decided|superseded, `PRAC` is
// active|stale|retired, a canvas is drafting). Scanning both would fire on every one of them, and
// a checker that cries wolf gets switched off — which is how the last three died.
//
// Only the FIRST word is compared. Detail after it is encouraged: `dropped (sunset 2026-09-08 —
// 3 users in 90 days)` is well-formed and says far more than `dropped`.
const SKILL_STATUS = /`status:\s*([a-z-]+)/g;
const skillFiles = [];
const walkSkills = (dir) => {
  let entries = [];
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.isDirectory()) walkSkills(join(dir, e.name));
    else if (e.name.endsWith('.md')) skillFiles.push(join(dir, e.name));
  }
};
for (const stage of (() => { try { return readdirSync(join(ROOT, 'stages')); } catch { return []; } })()) {
  walkSkills(join(ROOT, 'stages', stage, 'template', '.claude', 'skills'));
}
const skillVocab = [];
for (const abs of skillFiles) {
  const rel = abs.slice(ROOT.length + 1);
  const text = readFileSync(abs, 'utf8');
  for (const m of text.matchAll(SKILL_STATUS)) {
    if (VOCAB.includes(m[1])) continue;
    const line = text.slice(0, m.index).split('\n').length;
    skillVocab.push([`${rel}:${line}`,
      `tells the founder to write \`status: ${m[1]}\` — not one of: ${VOCAB.join(' | ')}`]);
  }
}

// The gitignored dogfood workspace is not present in a fresh clone or a CI checkout of the
// tarball. Nothing to check is not a failure — the same posture `check-freshness` takes.
// The skill scan above runs FIRST and on its own: those files are always present, and gating
// them behind a folder that is absent in every fresh clone would silence the check exactly
// where it matters most.
if (!existsSync(IDEAS)) {
  if (skillVocab.length) {
    console.log(`\nBOSS · backlog integrity — ${skillFiles.length} shipped skill files (docs/ideas/ not present)\n`);
    console.log('  UNDECLARED STATUS IN A SHIPPED SKILL');
    for (const [a, b] of skillVocab) console.log(`      ${a}\n        -> ${b}`);
    console.log(`\n  ${skillVocab.length} total. Exit 1.\n`);
    process.exit(1);
  }
  console.log(`\nBOSS · backlog integrity — ${skillFiles.length} shipped skill files clean; docs/ideas/ not present (dogfood workspace).\n`);
  process.exit(0);
}

const RECORD = /^(IDEA|FEAT)-(\d+)-.*\.md$/;
const field = (text, name) => {
  const m = text.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
};
const base = baseStatus;

const findings = { skillVocab, vocab: [], collisions: [], missingRows: [], orphanRows: [], disagreements: [], proof: [], unproven: [] };

// --- the records on disk -----------------------------------------------------------------
const records = new Map(); // id -> [{file, status}]
for (const f of readdirSync(IDEAS).filter((n) => RECORD.test(n))) {
  const text = readFileSync(join(IDEAS, f), 'utf8');
  const id = field(text, 'id') || f.match(RECORD).slice(1, 3).join('-');
  const status = field(text, 'status');
  if (!records.has(id)) records.set(id, []);
  records.get(id).push({ file: f, status });

  if (!status) findings.vocab.push([f, 'no `status:` in frontmatter']);
  else if (!VOCAB.includes(base(status))) {
    findings.vocab.push([f, `status "${status}" — starts with "${base(status)}", not one of: ${VOCAB.join(' | ')}`]);
  }
}

// --- 1. one id, one file -----------------------------------------------------------------
// Two files both claimed IDEA-059 (the acknowledgement idea and the testing-ladder idea), which
// made `[[IDEA-059]]` ambiguous everywhere it was written — including in RESUME.md's own list of
// open work. Ids are cheap and gaps are free; collisions are neither.
for (const [id, rows] of records) {
  if (rows.length > 1) findings.collisions.push([id, rows.map((r) => r.file).join('  +  ')]);
}

// --- 1b. THE STATUS IS A CLAIM ABOUT THE CODE. CHECK IT AGAINST THE CODE. -----------------
// This is the class that actually caused the damage, and the first cut of this script MISSED it.
// Everything above compares a record to another record — frontmatter against an index row. All 21
// drifted records would have sailed through a consistency check if the index had simply agreed
// with the (wrong) files. **Agreement is not truth.** Eighteen records said `exploring`/`ready`/
// `building` while the thing they described was sitting on disk, shipped, sometimes for a hundred
// releases. Nothing compared the claim to the artifact, because nothing knew which artifact.
//
// So every record names one: `proof:` — the path that would not exist if this were not done.
// The rule runs in BOTH directions, and the second direction is the fix:
//   · `shipped` and the proof is NOT on disk  -> the record claims something the repo cannot show.
//   · NOT shipped and the proof IS on disk    -> **you built it and never said so.** The disease.
//
// The point of declaring `proof:` on an UNBUILT record is that it is a tripwire laid in advance:
// name the file now, and on the day someone creates it, this gate fails until the record is
// updated. Drift can then survive at most one release, instead of a hundred.
//
// Two honest states are not failures and must not be forced to lie about themselves, so they are
// DECLARED instead: `proof: none` for a record whose output was a decision rather than a file
// (IDEA-012's catalog became the backlog; IDEA-028's audit produced retire/keep calls), and a
// `proof_note:` on a non-shipped record whose proof exists anyway — built-but-unreachable
// (IDEA-047 needs a bought domain, not a build) or completes-on-a-condition (IDEA-058 ends when
// citation debt hits zero, which is not a file). **The note is the price of the exception**: you
// may hold the state, you may not hold it silently.
{
  const SHIPPED = 'shipped';
  for (const [id, rows] of records) {
    const { file, status } = rows[0];
    const text = readFileSync(join(IDEAS, file), 'utf8');
    const proof = field(text, 'proof');
    const note = field(text, 'proof_note');
    const b = base(status);
    if (b === 'seedling' || b === 'dropped') continue;

    if (!proof) {
      findings.proof.push([id, `${file} — no \`proof:\`. Name the path that would not exist if this were done (or \`proof: none\` with a \`proof_note:\`).`]);
      continue;
    }
    if (proof === 'none') {
      if (!note) findings.proof.push([id, `${file} — \`proof: none\` needs a \`proof_note:\` saying why this record has no artifact.`]);
      continue;
    }
    const onDisk = existsSync(join(ROOT, proof));
    if (b === SHIPPED && !onDisk) {
      findings.unproven.push([id, `says "${status}" but \`${proof}\` is NOT on disk — the record claims something the repo cannot show.`]);
    } else if (b !== SHIPPED && onDisk && !note) {
      findings.unproven.push([id, `says "${status}" but \`${proof}\` IS on disk — built and never recorded. Set it to shipped, or add a \`proof_note:\` saying why it is built and still not done.`]);
    }
  }
}

// --- 2. the index rows -------------------------------------------------------------------
const indexPath = join(IDEAS, 'INDEX.md');
const indexRows = new Map(); // id -> {status, line}
if (existsSync(indexPath)) {
  const lines = readFileSync(indexPath, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (!line.startsWith('| [')) return;
    const cells = line.split('|').map((c) => c.trim());
    const m = cells[1] && cells[1].match(/\[((?:IDEA|FEAT)-\d+)\]/);
    if (m) indexRows.set(m[1], { status: cells[3], line: i + 1 });
  });
}

for (const [id, rows] of records) {
  if (!indexRows.has(id)) {
    findings.missingRows.push([id, `${rows[0].file} — no row in INDEX.md`]);
    continue;
  }
  const want = base(rows[0].status);
  const got = base(indexRows.get(id).status);
  if (want !== got) {
    findings.disagreements.push([
      id,
      `INDEX.md:${indexRows.get(id).line} says "${indexRows.get(id).status}" · ${rows[0].file} says "${rows[0].status}" -> set the row to "${want}"`,
    ]);
  }
}
for (const [id, row] of indexRows) {
  if (!records.has(id)) findings.orphanRows.push([id, `INDEX.md:${row.line} — a row with no record file behind it`]);
}

// --- report --------------------------------------------------------------------------------
const total = Object.values(findings).reduce((n, a) => n + a.length, 0);
const plural = (n, s) => `${n} ${s}${n === 1 ? '' : 's'}`;

console.log(`\nBOSS · backlog integrity — ${records.size} records, ${indexRows.size} index rows\n`);

if (!total) {
  console.log('  The backlog agrees with itself.\n');
  console.log('  Frontmatter is truth; INDEX is a view of it. This is the check that the view');
  console.log("  still matches — because the direction it rots in is the expensive one:");
  console.log('  it makes finished work look unfinished, and finished work gets rebuilt.\n');
  process.exit(0);
}

const report = (key, title, why) => {
  const rows = findings[key];
  if (!rows.length) return;
  console.log(`  ${title} — ${plural(rows.length, 'finding')}`);
  console.log(`  ${why}`);
  for (const [a, b] of rows) console.log(`      ${a}\n        -> ${b}`);
  console.log('');
};

report('skillVocab', 'UNDECLARED STATUS IN A SHIPPED SKILL',
  `a skill instructing a founder to write a status outside the closed set in docs/IDS.md. This\n  reaches strangers: \`boss records\` then flags them for following BOSS's own instruction, and\n  \`boss board\` files the unrecognised FEAT status as in-flight — so the verb that ends work\n  creates a permanent Building card instead.`);
report('vocab', 'UNDECLARED STATUS',
  `a status outside the closed set in docs/IDS.md. Four spellings of "shipped" is how the\n  index and the files drifted apart for ~80 releases without anyone able to see it.`);
report('collisions', 'DUPLICATE IDS',
  'two records claiming one id — every [[link]] to it is ambiguous. Take the next free number.');
report('disagreements', 'INDEX DISAGREES WITH THE RECORD',
  'the file is truth. Correct the row, not the file — unless the file is what is stale.');
report('unproven', 'THE RECORD DISAGREES WITH THE CODE',
  `the expensive one, and the reason this script exists. A status is a claim about the repo;\n  these are the claims the repo does not support — in EITHER direction.`);
report('proof', 'NO PROOF DECLARED',
  'a record with no `proof:` cannot be checked against reality — it can only be checked against\n  another document, which is how 21 records drifted for ~80 releases.');
report('missingRows', 'MISSING FROM THE INDEX',
  'a record nobody browsing the backlog can see. Add the row.');
report('orphanRows', 'ORPHAN INDEX ROWS',
  'a row pointing at a record that does not exist.');

console.log(`  ${total} total. Exit 1.\n`);
process.exit(1);
