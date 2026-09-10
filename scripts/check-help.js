// scripts/check-help.js — the in-project guide's freshness gate.
//
// Same shape and same argument as check-site.js, one rung down. `boss help --html` has two
// halves: what BOSS GENERATES (skills, commands, glossary, glyphs, wayfinding — read from the
// manifests, so it cannot drift) and what a HUMAN WROTE (library/help/*.html — prose that
// explains why, which no manifest contains). This checks the second half only, because the
// first half is structurally incapable of being wrong.
//
// What it looks for, in order of how quietly each one fails:
//   1. a fragment with no `covers:` — prose nothing can invalidate. THIS FAILS THE GATE.
//   2. a fragment whose `covers:` paths changed after it was last reviewed.
//   3. a fragment past its own `review_by:` date.
//   4. a WAYFINDING row naming a skill no manifest ships — an advertised verb nobody has.
//   5. a fragment claiming a `section:` the renderer does not place — invisible prose.
//
// (4) is the one that caught a real bug the day this was written: `/vet` was in the
// wayfinding map and is an internal BOSS skill, in no stage manifest, shipped to nobody.
// The list said "here is how to work out what an outside claim is worth" and the verb
// behind it did not exist for the reader. A gate that only read dates would never see it.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { loadModes, STANDING_COMMANDS } from '../src/modes.js';
import { WAYFINDING, wayfindingKind } from '../src/help.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'library', 'help');
const strict = process.argv.includes('--strict');
const today = new Date().toISOString().slice(0, 10);

const modes = loadModes();
const problems = [];
const behind = [];
const inflight = [];
const overdue = [];

// Sections the renderer actually places. Kept here rather than imported so that DELETING a
// section from the plan surfaces as a finding instead of silently orphaning its fragment.
const PLACED = new Set(['orientation', 'ladder', 'records', 'conscience', 'removing']);

function lastChangedAt(paths) {
  try {
    const out = execSync(`git log -1 --format=%ct -- ${paths}`, { cwd: ROOT, encoding: 'utf8' }).trim();
    return out ? Number(out) * 1000 : null;
  } catch { return null; }
}
function changingNow(paths) {
  try {
    const out = execSync(`git status --porcelain -- ${paths}`, { cwd: ROOT, encoding: 'utf8' }).trim();
    return out ? out.split('\n').length : 0;
  } catch { return 0; }
}
const fmt = (ms) => new Date(ms).toISOString().slice(0, 10);

if (!existsSync(SRC)) {
  console.error('  ✗ library/help/ is missing — `boss help --html` would render with no prose at all.');
  process.exit(1);
}

const frags = readdirSync(SRC).filter((f) => f.endsWith('.html'));
if (!frags.length) problems.push('library/help/ has no fragments — the guide would be tables and nothing else');

for (const f of frags) {
  const raw = readFileSync(join(SRC, f), 'utf8');
  const head = (raw.match(/^<!--\n([\s\S]*?)\n-->/) || [, ''])[1];
  const get = (k) => (head.match(new RegExp(`^${k}:\\s*(.*)$`, 'm')) || [, ''])[1].trim();
  const covers = get('covers');
  const reviewed = get('reviewed');
  const by = get('review_by');
  const section = get('section');
  const describes = get('describes');

  if (!covers) { problems.push(`${f} declares no \`covers:\` — nothing can tell when it falls behind`); continue; }
  if (!section) problems.push(`${f} declares no \`section:\` — the renderer cannot place it`);
  else if (!PLACED.has(section)) problems.push(`${f} claims section \`${section}\`, which the renderer does not place — this prose ships to nobody`);
  if (!by) problems.push(`${f} has no \`review_by:\` — nothing can report it stale`);
  else if (by < today) overdue.push(`${f} — due ${by} · ${describes}`);
  if (!reviewed) continue;

  const now = changingNow(covers);
  if (now) inflight.push(`${f} — ${now} uncommitted change(s) under ${covers.split(' ').slice(0, 2).join(', ')}`);
  // Measured against the `reviewed:` DATE, not the fragment's own commit/mtime. Two reasons,
  // both learned the hard way within an hour of writing this file: a fragment's touch time
  // clears on any edit (so a typo fix would assert a re-read that never happened), and
  // `library/help/` was UNTRACKED at birth, which made a git-time comparison silently
  // un-fireable — the guard read green because one side of it was always null.
  const srcAt = lastChangedAt(covers);
  const reviewedAt = Date.parse(`${reviewed}T23:59:59Z`);
  if (srcAt && reviewedAt && srcAt > reviewedAt) {
    behind.push(`${f} — ${covers.split(' ')[0]}… changed ${fmt(srcAt)}, reviewed ${reviewed}`);
  }

  // An UNTRACKED `covers:` path freezes the tripwire permanently: `git log` on a path with no
  // tracked files reports the commit that REMOVED it, or nothing at all. `docs/loops` did
  // exactly this — reporting 2026-06-20 forever while the real files changed in September.
  for (const path of covers.split(/\s+/).filter(Boolean)) {
    let tracked = 0;
    try {
      tracked = execSync(`git ls-files -- ${path}`, { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').filter(Boolean).length;
    } catch { /* treat as untracked */ }
    if (!tracked) problems.push(`${f} covers \`${path}\`, which git does not track — the staleness tripwire for it can never fire`);
  }
}

// ---- every wayfinding token must resolve to something that ships ----------
// Widened at v0.275.0 from skills-only. The map now names skills, AGENTS and terminal COMMANDS,
// and all three can be wrong in the same way — an entry pointing at something the reader cannot
// run. Skills are checked against the stage manifests, agents against the shipped roster, and
// commands against STANDING_COMMANDS. The skills-only version already caught one ghost (`/vet`,
// in no manifest); widening the data without widening the check would have re-opened that hole
// for two thirds of the entries.
const shippedSkills = new Set(modes.flatMap((m) => m.skills || []));
const shippedAgents = new Set(modes.flatMap((m) => (m.agents || []).map((a) => (typeof a === 'string' ? a : a.name))));
const shippedCmds = new Set(STANDING_COMMANDS.map(([c]) => c.split(' ')[1]).filter(Boolean));

const tokens = [...new Set(WAYFINDING.flatMap(([, v]) => v))];
for (const t of tokens) {
  const { kind, name } = wayfindingKind(t);
  const set = kind === 'skill' ? shippedSkills : kind === 'agent' ? shippedAgents : shippedCmds;
  const where = kind === 'skill' ? 'stage manifest' : kind === 'agent' ? 'shipped roster' : 'STANDING_COMMANDS';
  if (!set.has(name)) {
    problems.push(`WAYFINDING names \`${t}\` (${kind}), which is in no ${where} — the guide advertises `
      + 'something the reader cannot run');
  }
}

// The reverse read, as a NOTE not a finding: a shipped skill no intent points at is still
// reachable via the skills list, so it is not broken — but if the number is large the map has
// stopped being a map.
const pointed = new Set(tokens.filter((t) => wayfindingKind(t).kind === 'skill').map((t) => wayfindingKind(t).name));
const unpointed = [...shippedSkills].filter((s) => !pointed.has(s));

// ---- report ---------------------------------------------------------------
console.log(`\n  BOSS · in-project guide freshness — ${frags.length} fragments, ${shippedSkills.size} shipped skills, as of ${today}\n`);
for (const p of problems) console.log(`  ✗ ${p}`);
for (const b of behind) console.log(`  ! may be behind: ${b}`);
for (const i of inflight) console.log(`  ~ changing now: ${i}`);
for (const o of overdue) console.log(`  ✗ overdue: ${o}`);
if (unpointed.length) {
  console.log(`\n  · ${unpointed.length} of ${shippedSkills.size} shipped skills are in no "I want to…" row.`);
  console.log(`    Reachable via the skills list; listed so the map cannot quietly stop being one:`);
  console.log(`    ${unpointed.sort().join(', ')}`);
}
console.log(`\n  ${problems.length} broken · ${behind.length} trailing · ${inflight.length} in flight · ${overdue.length} overdue`);
console.log('\n  Most of the guide is GENERATED from the manifests. The exceptions are the prose in');
console.log('  library/help/ and the WAYFINDING map in src/help.js — hand-authored, and therefore');
console.log('  driftable, which is why the map is checked against the manifests here.\n');

if (strict && (problems.length || overdue.length)) process.exitCode = 1;
