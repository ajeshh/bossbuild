#!/usr/bin/env node
// Manifest integrity check (REVIEW-2026-07-28 §A2/§A3) — the structural half of the
// release gate. `check-wayfinding-drift.js` guards the PROSE; this guards the WIRING.
//
//   npm run check:manifests            nudge (exit 0)
//   npm run check:manifests -- --strict  fail the release on any error
//
// WHY THIS EXISTS: `stages/L3-scale/manifest.json` declared `operate-loop` for four
// releases with no `docs/loops/operate-loop.md` behind it. It failed silently in BOTH
// directions — `planSync` skips missing sources (`if (!existsSync(f.src)) continue`),
// and `loadLoops` only reads files that exist. So `boss unlock scale` stamped a
// capability into every project's install record that the project did not have, and
// nothing anywhere said so. A manifest that lies is worse than a manifest that's thin.
//
// THREE CHECKS:
//   1. resolution   every manifest agent/skill/hook/loop entry resolves to a real file
//   2. registration every template file is claimed by its manifest (no orphans)
//   3. voicing      every loop's `drift_moment` has an authored frame in the conscience
//                   runtime — probed by CALLING it, never by a parallel list (a
//                   hand-kept list of moment names is the same drift bug one level up)
//
// Deliberately NOT checked: `optionalHooks` files ship dormant on purpose (secrets-guard,
// memory-cue, auto-log) — they're exempted by name below, and the exemption is PRINTED
// so an exemption gone wrong stays visible (the check-wayfinding-drift precedent).

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT, STAGE_ORDER } from '../src/paths.js';
import { readStageManifest } from '../src/scaffold.js';
import {
  signalAsContext, GENERIC_FRAME_TAIL, JUDGE_MOMENTS,
} from '../stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js';
import { parseFrontmatter } from '../stages/L0-quickstart/template/.claude/hooks/lib/yaml.js';

// Hook scripts that ship DORMANT by design (documented in each file's header): they're
// present but unregistered in settings.json, so they cost nothing until a founder opts
// in. Not manifest-registered, therefore not orphans. Keep this list short and earned.
const DORMANT_HOOKS = new Set(['memory-cue', 'secrets-guard', 'auto-log']);

const tplDir = (stageId) => join(BOSS_ROOT, 'stages', stageId, 'template');

// --- 1 + 2. manifest <-> template resolution ------------------------------

function checkStage(stageId) {
  const errors = [];
  const exempt = [];
  let manifest;
  try {
    manifest = readStageManifest(stageId);
  } catch {
    return { stageId, authored: false, errors, exempt };
  }
  const base = tplDir(stageId);
  const claude = join(base, '.claude');

  const want = [
    ...(manifest.agents || []).map((n) => ({ kind: 'agent', name: n, file: join(claude, 'agents', `${n}.md`) })),
    ...(manifest.skills || []).map((n) => ({ kind: 'skill', name: n, file: join(claude, 'skills', n, 'SKILL.md') })),
    ...(manifest.loops || []).map((n) => ({ kind: 'loop', name: n, file: join(base, 'docs', 'loops', `${n}.md`) })),
  ];
  for (const h of manifest.hooks || []) {
    const js = join(claude, 'hooks', `${h}.js`);
    const sh = join(claude, 'hooks', `${h}.sh`);
    want.push({ kind: 'hook', name: h, file: existsSync(js) ? js : sh });
  }
  for (const w of want) {
    if (!existsSync(w.file)) {
      errors.push(`manifest declares ${w.kind} '${w.name}' — no file at ${w.file.replace(BOSS_ROOT + '/', '')}`);
    }
  }

  // `headline` names the few skills `boss map` previews for a rung you haven't unlocked.
  // It's a hand-kept subset, so it can rot when a skill is renamed or dropped — and a
  // headline pointing at nothing would silently shrink the preview to nothing.
  for (const h of manifest.headline || []) {
    if (!(manifest.skills || []).includes(h)) {
      errors.push(`headline lists '${h}' which is not in this stage's skills (boss map would silently drop it)`);
    }
  }

  // Reverse: a file present but unclaimed by the manifest never syncs (managedFiles
  // iterates the manifest), so it silently rots in every existing project.
  const dir = (p) => (existsSync(p) ? readdirSync(p) : []);
  for (const n of dir(join(claude, 'agents'))) {
    if (n.endsWith('.md') && !(manifest.agents || []).includes(n.slice(0, -3))) {
      errors.push(`agent file '${n}' is not in the manifest (it will never sync)`);
    }
  }
  for (const n of dir(join(claude, 'skills'))) {
    if (statSync(join(claude, 'skills', n)).isDirectory() && !(manifest.skills || []).includes(n)) {
      errors.push(`skill dir '${n}' is not in the manifest (it will never sync)`);
    }
  }
  for (const n of dir(join(base, 'docs', 'loops'))) {
    if (n.endsWith('.md') && !(manifest.loops || []).includes(n.slice(0, -3))) {
      errors.push(`loop file '${n}' is not in the manifest (the hook reads it; sync won't update it)`);
    }
  }
  for (const n of dir(join(claude, 'hooks'))) {
    if (!n.endsWith('.js') && !n.endsWith('.sh')) continue; // skip lib/
    const stem = n.replace(/\.(js|sh)$/, '');
    if ((manifest.hooks || []).includes(stem)) continue;
    if (DORMANT_HOOKS.has(stem)) { exempt.push(`${stageId}/${stem}`); continue; }
    errors.push(`hook file '${n}' is neither manifest-registered nor a known dormant hook`);
  }

  return { stageId, authored: true, errors, exempt };
}

// --- 3. every declared drift_moment has an authored voicing frame ---------
// Probes the REAL function rather than comparing against a hand-kept list of moment
// names — a parallel list is the same class of drift this check exists to catch.

function collectMoments() {
  const moments = new Map(); // moment -> [loop ids that declare it]
  for (const stageId of STAGE_ORDER) {
    const loopsDir = join(tplDir(stageId), 'docs', 'loops');
    if (!existsSync(loopsDir)) continue;
    for (const n of readdirSync(loopsDir)) {
      if (!n.endsWith('.md')) continue;
      let fm;
      try { fm = parseFrontmatter(readFileSync(join(loopsDir, n), 'utf8')); } catch { continue; }
      if (!fm || fm.type !== 'loop' || !fm.drift_moment) continue;
      if (!moments.has(fm.drift_moment)) moments.set(fm.drift_moment, []);
      moments.get(fm.drift_moment).push(`${stageId}/${fm.id || n.slice(0, -3)}`);
    }
  }
  return moments;
}

function checkVoicing() {
  const errors = [];
  const moments = collectMoments();
  for (const [moment, loops] of moments) {
    const frame = signalAsContext({ moment, loop_id: '__probe__', confidence: 'low' });
    if (frame.includes(GENERIC_FRAME_TAIL)) {
      errors.push(
        `moment '${moment}' (declared by ${loops.join(', ')}) has NO authored frame in ` +
        'loop-runtime.js — it would inject a content-free line into a live session',
      );
    }
  }
  // JUDGE_MOMENTS is a second hand-kept list of the same names; catch it drifting too.
  for (const m of JUDGE_MOMENTS) {
    if (!moments.has(m)) {
      errors.push(`JUDGE_MOMENTS lists '${m}' but no loop spec declares it (stale entry)`);
    }
  }
  return { errors, count: moments.size };
}

// --- report ---------------------------------------------------------------

export function checkManifests() {
  const stages = STAGE_ORDER.map(checkStage);
  const voicing = checkVoicing();
  const errors = [...stages.flatMap((s) => s.errors.map((e) => `${s.stageId}: ${e}`)), ...voicing.errors];
  return { stages, voicing, errors };
}

export function reportManifests() {
  const { stages, voicing, errors } = checkManifests();
  const authored = stages.filter((s) => s.authored);
  const exempt = stages.flatMap((s) => s.exempt);

  if (!errors.length) {
    console.log(`  ✦ Manifests: ${authored.length} stage(s) wired clean · ${voicing.count} moment(s) voiced.`);
  } else {
    console.log(`  ⚠ Manifest integrity — ${errors.length} problem(s):`);
    for (const e of errors) console.log(`      · ${e}`);
    console.log('    A manifest entry with no file is stamped into every project that unlocks the');
    console.log('    mode, and both `boss sync` and the conscience skip it silently. Author the');
    console.log('    file, or drop the entry — never ship the claim without the thing.');
  }
  if (exempt.length) {
    console.log(`    (dormant-by-design hooks, unregistered on purpose: ${exempt.join(', ')})`);
  }
  return errors.length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const n = reportManifests();
  const strict = process.argv.includes('--strict');
  if (strict && n) console.log('    --strict: failing the release.');
  process.exit(strict && n ? 1 : 0);
}
