#!/usr/bin/env node
// check:demo — the showcase stays full (FEAT-039).
//
// The demo is a generated surface: `gen:site` rebuilds it from demo/kettlewick/ with the current
// renderers, so a renderer change lands by itself. What that can't catch is a NEW chapter or a new
// record type — it shows up on the demo as a hole, and nobody looks at the demo every day. This
// gate does: it renders the demo to a temp dir and fails when the playbook or the design space
// reports an open question that isn't on the allow-list below, or when a folder a renderer reads
// is missing.
//
//   node scripts/check-demo.js            # exit 1 on a hole
//
// Allow-list: holes that are on the demo ON PURPOSE, each with the reason (empty is the goal).
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { generate, DEMO } from './gen-demo.js';

const ALLOWED = {
  // 'some-hole-id': 'why it is a feature, not a gap',
  'proposed-quietnotice': 'a usage page with status: proposed is a REQUEST — the front door for a designer or teammate to ask for a part (FEAT-037). The demo shows one on purpose; it is not an empty slot.',
};
// Every folder a renderer reads. A missing one is a record class the demo never got.
const FOLDERS = ['docs/ideas', 'docs/personas', 'docs/evidence', 'docs/decisions', 'docs/competition', 'docs/source', 'docs/team', 'docs/dossier', 'docs/health', 'docs/measure', 'docs/trust', 'docs/brand', 'docs/design', 'docs/design/components', 'docs/design/icons', 'docs/product'];

const problems = [];
for (const f of FOLDERS) if (!existsSync(join(DEMO, f))) problems.push(`missing folder: demo/kettlewick/${f}`);
const r = generate({ check: true });
try {
  for (const q of r.questions) if (!ALLOWED[q.id]) problems.push(`open on the playbook: "${q.title}" (#${q.id}) — ${q.line}`);
  for (const q of r.designQuestions) if (!ALLOWED[q.id]) problems.push(`open on the design space: "${q.title}" (#${q.id}) — ${q.line} · ${q.moment}`);
} finally { rmSync(r.dir, { recursive: true, force: true }); }

if (problems.length) {
  console.error(`\n  ✗ check:demo — ${problems.length} problem${problems.length === 1 ? '' : 's'}; the demo has a hole the product doesn't explain:`);
  for (const p of problems) console.error(`    · ${p}`);
  console.error('    Add the record to demo/kettlewick/ (the shape the shipped verb writes), or allow the hole here with its reason.\n');
  process.exit(1);
}
console.log(`  ✓ check:demo — the demo is full (${r.line})`);
