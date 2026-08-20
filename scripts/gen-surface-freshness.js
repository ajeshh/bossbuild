#!/usr/bin/env node
// Seed / refresh `registry/surface-freshness.json` — the rot ledger for the TEMPLATE SURFACE.
//
// WHY A LEDGER AND NOT FRONTMATTER: the 28 practices carry `curve:` / `last_reviewed:` inline,
// and the obvious move was to do the same to the 46 skills, 15 agents and 6 hooks. It's the wrong
// move. Those files' frontmatter is **host-consumed** — a shipped SKILL.md carries exactly `name`
// and `description`, and an agent adds `tools`. Nothing else. Introducing unknown keys into a file
// Claude Code parses, in every founder's project, to solve a maintenance problem only BOSS has, is
// a bad trade: all of the risk lands on the founder and none of the benefit does. A practice's
// frontmatter is read by BOSS's own scripts and nothing else, which is why inline works there.
//
// WHY THIS EXISTS AT ALL: BOSS ships `review_by:` staleness-awareness to founders via `/practice`,
// applied it to its own practice shelf in v0.135.0 — and left the surface it actually SHIPS
// uncovered. 67 files that go into every project, none of which anything could report as stale.
// That is the same "BOSS doesn't eat its own dogfood" gap, one level down.
//
// THE TWO FIELDS, and the split between them is the point:
//   curve         — a JUDGMENT about which ground moves under this file. Stored, because a script
//                   cannot infer it reliably; seeded here by a stated rule so the first pass is
//                   auditable rather than arbitrary.
//   last_reviewed — a FACT, seeded from git's last-touch date for each file. Honest starting
//                   point, and explicitly NOT auto-derived afterwards: touching a file is not
//                   reviewing it (a typo fix must not reset the clock), which is exactly why the
//                   practices model stores it rather than reading mtime.
//
// Idempotent: existing entries keep their `curve` and `last_reviewed`. Only new files are added and
// deleted ones dropped, so a sweep's restamp is never clobbered by a regeneration.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { BOSS_ROOT, STAGES_DIR } from '../src/paths.js';

const LEDGER = join(BOSS_ROOT, 'registry', 'surface-freshness.json');

// Curve assignment. THE FIRST CUT OF THIS WAS A REGEX OVER THE FILE TEXT, AND IT WAS WRONG —
// keyword matching put `/boss`, `/import` and `/cost-review` on the *threat* curve and `/prototype`
// and `/money` on the *model* curve, because "credential" and "token" appear in passing. Arbitrary
// assignments dressed as method are worse than none: they'd send quarterly sweeps at 30 files that
// don't move and skip the ones that do, and the first person to read the table would stop trusting
// all of it.
//
// So the judgment is written down instead of inferred. The default is by KIND, and every deviation
// is named, which makes each call arguable on its own rather than the whole table suspect.
//
// THE DEFAULT IS `craft` (365d), and the reasoning is worth stating: the overwhelming majority of
// this surface is *method* — how to pressure-test an idea, how to run an interview, how to decide.
// That prose does not rot when the host ships a release. What rots fast is the layer that touches
// the HOST (hooks call its API; a handful of skills describe its plumbing) and the layer that
// describes what AI TOOLS DO BY DEFAULT. Those are named below. Putting all 66 on a 90-day clock
// would produce a 66-file quarterly sweep — the exact ceremony BOSS exists to refuse.
const CURVE_BY_KIND = { hook: 'host', skill: 'craft', agent: 'craft' };

// Named exceptions — the judgment, stated per file so it can be argued with.
const EXCEPTIONS = {
  // Describe HOST plumbing: settings.json, the hook contract, skill/agent discovery, CLAUDE.md +
  // AGENTS.md, the sync mechanics. These break when Claude Code ships, which it does continuously.
  host: ['boss-sync', 'boss-learn', 'comprehend', 'welcome', 'feedback', 'practice', 'extract'],
  // Describe what the MODEL layer does by default — cost shape, eval technique, trace analysis,
  // failure modes. These move with the frontier, not with the host.
  model: ['ai-cost', 'cost-review', 'ai-first-init', 'ai-failure-states', 'evals', 'judge-traces'],
  // Adversarial ground: the attack surface moves because someone is trying to move it.
  threat: ['red-team', 'ship', 'trust', 'secrets-guard'],
  // Research + regulation keep naming new patterns; /humane-refresh owns the sweep.
  humane: ['canvas'],
  // GTM patterns move with the cycle — slower than the host, faster than craft.
  market: ['landing', 'pretotype', 'health', 'money', 'onboard', 'roadmap', 'measure', 'mentor-customers'],
};

function assignCurve(kind, rel) {
  // basename without extension: `.../skills/<name>/SKILL.md` -> <name>; `.../agents/<name>.md` -> <name>
  const parts = rel.split(/[\\/]/);
  const name = parts[parts.length - 1] === 'SKILL.md'
    ? parts[parts.length - 2]
    : parts[parts.length - 1].replace(/\.(md|js)$/, '');
  for (const [curve, names] of Object.entries(EXCEPTIONS)) {
    if (names.includes(name)) return curve;
  }
  return CURVE_BY_KIND[kind] || 'craft';
}

// Last time a human actually touched this file. `--follow` so a rename doesn't read as brand new.
function lastTouched(rel) {
  try {
    const out = execFileSync('git', ['log', '-1', '--follow', '--format=%ad', '--date=short', '--', rel],
      { cwd: BOSS_ROOT, encoding: 'utf8' }).trim();
    return out || null;
  } catch { return null; }
}

function collect() {
  const out = [];
  for (const stage of readdirSync(STAGES_DIR)) {
    const base = join(STAGES_DIR, stage, 'template', '.claude');
    const add = (kind, rel) => {
      const abs = join(BOSS_ROOT, rel);
      if (!existsSync(abs)) return;
      out.push({ kind, stage, rel, text: readFileSync(abs, 'utf8') });
    };
    const skillsDir = join(base, 'skills');
    if (existsSync(skillsDir)) {
      for (const s of readdirSync(skillsDir)) {
        add('skill', join('stages', stage, 'template', '.claude', 'skills', s, 'SKILL.md'));
      }
    }
    const agentsDir = join(base, 'agents');
    if (existsSync(agentsDir)) {
      for (const a of readdirSync(agentsDir).filter((f) => f.endsWith('.md'))) {
        add('agent', join('stages', stage, 'template', '.claude', 'agents', a));
      }
    }
    const hooksDir = join(base, 'hooks');
    if (existsSync(hooksDir)) {
      for (const h of readdirSync(hooksDir).filter((f) => f.endsWith('.js'))) {
        add('hook', join('stages', stage, 'template', '.claude', 'hooks', h));
      }
    }
  }
  return out;
}

const prior = existsSync(LEDGER) ? JSON.parse(readFileSync(LEDGER, 'utf8')) : { surface: [] };
const byRel = new Map((prior.surface || []).map((e) => [e.rel, e]));

const entries = collect().map(({ kind, stage, rel }) => {
  const kept = byRel.get(rel);
  return {
    kind,
    stage,
    rel,
    // Judgment and stamp both survive regeneration — only the file list is refreshed.
    curve: kept?.curve || assignCurve(kind, rel),
    last_reviewed: kept?.last_reviewed || lastTouched(rel) || new Date().toISOString().slice(0, 10),
  };
}).sort((a, b) => a.rel.localeCompare(b.rel));

const dropped = [...byRel.keys()].filter((r) => !entries.some((e) => e.rel === r));

writeFileSync(LEDGER, JSON.stringify({
  _readme: [
    'Rot ledger for the TEMPLATE SURFACE — the skills, agents and hooks BOSS ships into every project.',
    '',
    'Deliberately NOT inline frontmatter: a shipped SKILL.md carries only `name` + `description` and an',
    'agent adds `tools`, all host-consumed. Adding unknown keys to files Claude Code parses, in every',
    "founder's project, to solve a maintenance problem only BOSS has, puts the risk on them and the",
    'benefit here. The practice shelf can do it inline because nothing but BOSS reads that frontmatter.',
    '',
    '  curve         a JUDGMENT — which ground moves under this file. Seeded by a stated rule in',
    '                scripts/gen-surface-freshness.js, then owned by hand. Disagree per-entry.',
    '  last_reviewed a FACT — seeded from git last-touch, then set BY A SWEEP. Never auto-derived',
    '                afterwards: touching a file is not reviewing it, and a typo fix must not reset',
    '                the clock. Same reason the practice shelf stores it instead of reading mtime.',
    '',
    'Regenerate with `npm run gen:surface-freshness` — idempotent; adds new files, drops deleted ones,',
    'and never clobbers a curve or a stamp you set. Read by `npm run check:freshness`.',
  ],
  surface: entries,
}, null, 2) + '\n');

const counts = entries.reduce((m, e) => ({ ...m, [e.curve]: (m[e.curve] || 0) + 1 }), {});
console.log(`\n  ✦ surface-freshness: ${entries.length} file(s) — ${Object.entries(counts).map(([c, n]) => `${c} ${n}`).join(' · ')}`);
if (dropped.length) console.log(`    dropped ${dropped.length} no longer shipped: ${dropped.map((r) => r.split('/').slice(-2)[0]).join(', ')}`);
console.log('');
