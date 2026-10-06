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
//
// COVERAGE (IDEA-149): the demo is also the lived-in project `npm run demo` lays down, so every skill
// a Quickstart or MVP install ships either has a record on the demo showing what it leaves behind, or
// a named reason it leaves nothing. A skill in neither list fails here, so a new verb is a decision,
// not a quiet gap. That is PROG-003's rule (a new record type adds its demo record in the same commit),
// which until now held only for playbook chapters.
import { existsSync, readdirSync, readFileSync, realpathSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate, DEMO } from './gen-demo.js';

const ALLOWED = {
  // 'some-hole-id': 'why it is a feature, not a gap',
  'proposed-quietnotice': 'a usage page with status: proposed is a REQUEST — the front door for a designer or teammate to ask for a part (FEAT-037). The demo shows one on purpose; it is not an empty slot.',
};
// Every folder a renderer reads. A missing one is a record class the demo never got.
const FOLDERS = ['docs/ideas', 'docs/personas', 'docs/evidence', 'docs/decisions', 'docs/competition', 'docs/source', 'docs/team', 'docs/dossier', 'docs/health', 'docs/measure', 'docs/trust', 'docs/brand', 'docs/design', 'docs/design/components', 'docs/design/icons', 'docs/product', 'docs/programs'];

// skill → [the record on the demo that shows its output (a `*` in the last segment), what it must say]
export const COVERAGE = {
  boss: ['docs/ideas/IDEA-001-kettlewick.md', /^kind: venture$|^motivation:/m],
  canvas: ['docs/ideas/IDEA-001-canvas.md'],
  decide: ['docs/decisions/DEC-*.md', /^## Falsifier|falsifier/im],
  evidence: ['docs/evidence/EVID-*.md'],
  idea: ['docs/ideas/IDEA-003-*.md', /## Capture log/],
  import: ['docs/source/2026-*'],
  persona: ['docs/personas/*.md'],
  pretotype: ['docs/ideas/IDEA-*.md', /pretotype/i],
  prototype: ['docs/design/PROTOTYPES.md'],
  'read-repo': ['.boss/brain/read.md'],
  sunset: ['docs/ideas/IDEA-*.md', /^status: dropped/m],
  'ai-cost': ['docs/cost-reviews/REVIEW-*.md'],
  'ai-failure-states': ['docs/ai-failure-states.md'],
  close: ['docs/RESUME.md'],
  'comp-eval': ['docs/competition/README.md'],
  consult: ['docs/dossier/*.md'],
  'design-review': ['docs/design/reviews/*.md'],
  'design-tokens-init': ['docs/design/tokens.json'],
  'drift-deep': ['docs/drift-audits/DRIFT-*.md'],
  evals: ['docs/evals/*.yml'],
  extract: ['docs/extractions/EXTR-*.md'],
  health: ['docs/health/HEALTH-*.md'],
  landing: ['landing/index.html'],
  log: ['docs/devlog.md'],
  money: ['docs/money/MONEY-*.md'],
  onboard: ['docs/onboard/ONBOARD-*.md'],
  practice: ['docs/practices/PRAC-*.md'],
  'red-team': ['docs/red-team/RT-*.md'],
  revalidate: ['docs/ideas/IDEA-*.md', /^next_review:/m],
  roadmap: ['docs/roadmap/ROADMAP-*.md'],
  ship: ['.boss/smoke.json'],
  smoke: ['.boss/smoke.json'],
  spec: ['docs/ideas/FEAT-*.md'],
  trust: ['docs/trust/SUBPROCESSORS.md'],
};
// skill → why the venture's records hold nothing from it
export const LEAVES_NOTHING = {
  welcome: 'a tour; it writes nothing',
  feedback: "feedback goes to BOSS's makers, never into the venture's records",
  'boss-sync': "its only trace is .boss/backups/, the sync's undo — not a record",
  interview: 'the prep page is printed in the session; what comes back is an EVID, which /evidence writes',
  'judge-traces': 'reads .boss/trace.jsonl and routes what recurs to /extract; the EXTR is its record',
};

// The skills a project at the demo's stage is shipped: every skill dir in the stage chain up to it.
export function shippedSkills(root = join(dirname(fileURLToPath(import.meta.url)), '..'), stage = JSON.parse(readFileSync(join(DEMO, 'project.json'), 'utf8')).stage) {
  const stages = readdirSync(join(root, 'stages')).filter((d) => /^L\d-/.test(d)).sort();
  const out = [];
  for (const st of stages.slice(0, stages.indexOf(stage) + 1)) {
    const dir = join(root, 'stages', st, 'template', '.claude', 'skills');
    if (existsSync(dir)) out.push(...readdirSync(dir).filter((n) => existsSync(join(dir, n, 'SKILL.md'))));
  }
  return out;
}

function matches(glob, re) {
  const at = glob.lastIndexOf('/');
  const dir = join(DEMO, glob.slice(0, at));
  const pat = new RegExp('^' + glob.slice(at + 1).replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
  if (!existsSync(dir)) return false;
  return readdirSync(dir).some((n) => pat.test(n) && (!re || re.test(readFileSync(join(dir, n), 'utf8'))));
}

export function coverageProblems(root) {
  const out = [];
  for (const sk of shippedSkills(root)) {
    if (LEAVES_NOTHING[sk]) continue;
    const c = COVERAGE[sk];
    if (!c) { out.push(`/${sk} ships at this stage but the demo shows nothing it leaves behind — add its record to demo/kettlewick/, or say in LEAVES_NOTHING why there is none`); continue; }
    if (!matches(c[0], c[1])) out.push(`/${sk}: no demo/kettlewick/${c[0]}${c[1] ? ` saying ${c[1]}` : ''}`);
  }
  return out;
}

const isMain = process.argv[1] && realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]);
if (isMain) {
const problems = coverageProblems();
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
}
