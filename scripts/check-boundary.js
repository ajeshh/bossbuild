#!/usr/bin/env node
// BOSS · boundary integrity — "has this crossed, and did anyone decide?"
//
//   npm run check:boundary
//
// WHY THIS EXISTS: BOSS is self-hosted, so every agent and skill is authored in the gitignored
// `/.claude/` workspace first and crosses into the product as a second, deliberate act. `/boss-learn`
// is the router for that act. Nothing was watching what never got routed.
//
// The v0.178.0 boundary review found 12 agents and 5 skills sitting uncrossed — and, worse, four of
// them (`/vet`, `/recalibrate`, `/practice-refresh`, `/humane-refresh`) NAMED in fifteen shipped
// files, including a line `src/craft.js` printed straight to a founder's terminal. Not one of the 17
// had ever been ruled on. They weren't rejected; they were never asked about.
//
// So this checks the DECISION, not the code. `registry/boundary.json` carries a verdict on every
// workspace artifact, and:
//   · `not-yet` is a legitimate verdict and always will be — most of these should not ship;
//   · `internal` is a legitimate verdict — some things only make sense for BOSS's own construction;
//   · **unexamined is not a verdict**, and that is the only state this exists to make impossible.
//
// Companion to check-refs class 5: that one catches a shipped file NAMING something founders don't
// have. This one catches the thing itself never having been ruled on. Naming and shipping are
// different failures and they need different gates — class 5 stayed silent for the 13 uncrossed
// artifacts nothing happened to mention.
//
// Zero-dep by rule. Exit 1 on any finding so CI and `npm test` can gate on it.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WORKSPACE = join(ROOT, '.claude');

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const warn = (s) => `\x1b[33m${s}\x1b[0m`;

// The workspace is gitignored, so it is ABSENT in CI and in anyone else's clone. That is not a
// failure — there is simply nothing to rule on. Saying so beats 26 phantom findings.
if (!existsSync(WORKSPACE)) {
  console.log(`\n  ${dim('Boundary: no /.claude/ workspace here — nothing to rule on.')}\n`);
  process.exit(0);
}

const ledger = JSON.parse(readFileSync(join(ROOT, 'registry', 'boundary.json'), 'utf8'));
const byName = new Map(ledger.artifacts.map((a) => [a.name, a]));

const dirsIn = (p) => (existsSync(p)
  ? readdirSync(p, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) : []);
const mdIn = (p) => (existsSync(p)
  ? readdirSync(p).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3)) : []);

const onDisk = [
  ...mdIn(join(WORKSPACE, 'agents')).map((n) => ({ name: n, kind: 'agent' })),
  ...dirsIn(join(WORKSPACE, 'skills')).map((n) => ({ name: n, kind: 'skill' })),
];

// Where a crossed artifact is allowed to have landed: any stage template, or the library superset.
const shipsAs = ({ name, kind }) => {
  const leaf = kind === 'agent' ? `${name}.md` : name;
  const homes = dirsIn(join(ROOT, 'stages'))
    .map((s) => join(ROOT, 'stages', s, 'template', '.claude', `${kind}s`, leaf))
    .concat([join(ROOT, 'library', `${kind}s`, leaf)]);
  return homes.filter(existsSync).map((h) => h.slice(ROOT.length + 1));
};

const findings = { unexamined: [], stale: [], notShipped: [], undeclared: [] };

for (const a of onDisk) {
  const entry = byName.get(a.name);
  if (!entry) { findings.unexamined.push([a.name, `${a.kind} — no verdict in the ledger`]); continue; }
  if (entry.kind !== a.kind) findings.stale.push([a.name, `ledger says ${entry.kind}, disk says ${a.kind}`]);
  const homes = shipsAs(a);
  if (entry.verdict === 'crossed' && !homes.length) {
    findings.notShipped.push([a.name, 'verdict is "crossed" but it ships nowhere — port it or change the verdict']);
  }
  if (entry.verdict !== 'crossed' && homes.length) {
    findings.undeclared.push([a.name, `verdict is "${entry.verdict}" but it already ships — ${homes.join(', ')}`]);
  }
  if (!entry.why || entry.why.length < 20) {
    findings.stale.push([a.name, 'verdict carries no reason — a verdict without a reason gets inherited, not re-read']);
  }
}
for (const a of ledger.artifacts) {
  if (!onDisk.some((d) => d.name === a.name)) {
    findings.stale.push([a.name, 'in the ledger, gone from the workspace — delete the row or restore the file']);
  }
}

const total = Object.values(findings).reduce((n, x) => n + x.length, 0);
const counts = ledger.artifacts.reduce((m, a) => ({ ...m, [a.verdict]: (m[a.verdict] || 0) + 1 }), {});
const summary = ['crossed', 'not-yet', 'internal'].map((v) => `${counts[v] || 0} ${v}`).join(' · ');

console.log(`\nBOSS · boundary integrity — ${onDisk.length} workspace artifact(s): ${summary}\n`);

if (!total) {
  const pending = ledger.artifacts.filter((a) => a.verdict === 'not-yet');
  console.log(`  ${bold('Every workspace artifact has been ruled on.')}\n`);
  if (pending.length) {
    console.log(`  ${warn('not-yet')} ${dim('— ruled on, not resolved. These are decisions, not a backlog:')}`);
    for (const a of pending) console.log(`      ${a.name} ${dim(`(${a.kind})`)}`);
    console.log('');
  }
  console.log(`  ${dim('"not-yet" is a real answer. "nobody asked" is the one this gate exists to prevent.')}\n`);
  process.exit(0);
}

const report = (key, title, why) => {
  const rows = findings[key];
  if (!rows.length) return;
  console.log(`  ${title} — ${rows.length} finding${rows.length === 1 ? '' : 's'}`);
  console.log(`  ${why}`);
  for (const [n, t] of rows) console.log(`      ${n}\n        -> ${t}`);
  console.log('');
};

report('unexamined', 'UNEXAMINED', 'authored in the workspace and never ruled on. Add a row to registry/boundary.json.');
report('notShipped', 'CLAIMED BUT ABSENT', 'the ledger says it crossed; the file says otherwise.');
report('undeclared', 'CROSSED WITHOUT A VERDICT', 'it ships, and the ledger still calls it internal or pending.');
report('stale', 'STALE LEDGER', 'the ledger and the workspace disagree.');

console.log(`  ${total} total. Exit 1.\n`);
process.exit(1);
