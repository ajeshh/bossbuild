// Conscience-state inspect for the BOSS CLI (v0.20.0+).
//
// Human-readable surface for what the conscience hook does machine-readably.
// Loads docs/loops/*.md in the current project, classifies each loop, formats
// open/closed/unopenable + what would close the open ones + any recent
// overrides recorded in the devlog. Asked-for by eng-builder / indie-hacker /
// vibe-virtuoso personas (v0.19 reactions) — "I want to see what fired and why."
//
// The runtime is the same one the hook uses — imported from the Quickstart
// template's hook lib so there's one source of truth. The path is awkward but
// the alternative (duplicating ~250 lines) is worse.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadLoops, classifyLoop, readPauseState, readMuteState } from '../stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js';
import { dim, bold, ok, warn } from './ui.js';

// Parse a duration spec for `boss conscience pause --for <spec>`.
// Accepted: <N>m / <N>h / <N>d (minutes / hours / days). Returns ms or throws.
function parseDuration(spec) {
  const m = String(spec).match(/^(\d+)([mhd])$/);
  if (!m) throw new Error(`bad duration: '${spec}'. Use 30m, 8h, or 2d.`);
  const n = parseInt(m[1], 10);
  const mult = { m: 60e3, h: 3600e3, d: 86400e3 }[m[2]];
  return n * mult;
}

function readConfigOrFail(projectDir) {
  const f = join(projectDir, '.boss', 'config.json');
  if (!existsSync(f)) {
    throw new Error('not a BOSS project (no .boss/config.json here).');
  }
  return { path: f, cfg: JSON.parse(readFileSync(f, 'utf8')) };
}

function writeConfig(path, cfg) {
  writeFileSync(path, JSON.stringify(cfg, null, 2) + '\n');
}

// `boss conscience pause [--for <duration> | --until-resume] [--reason "..."]`
// Default duration: 8h. Records the pause in `.boss/config.json` per IDEA-011's
// fractal-override discipline (the IDEA-008 override grammar applied at the
// session level instead of per-loop).
export function consciencePause(flags) {
  const { path, cfg } = readConfigOrFail(process.cwd());
  const reason = typeof flags.reason === 'string' ? flags.reason : '';

  let expires = null;
  if (flags['until-resume']) {
    expires = null;
  } else {
    const spec = typeof flags.for === 'string' ? flags.for : '8h';
    const ms = parseDuration(spec);
    expires = new Date(Date.now() + ms).toISOString();
  }

  cfg.conscience = {
    mode: 'paused',
    since: new Date().toISOString(),
    expires,
    reason,
  };
  writeConfig(path, cfg);

  console.log(`\n  ${ok('✦')} Conscience paused.`);
  if (expires) {
    console.log(`    auto-resumes: ${expires}`);
  } else {
    console.log(`    no expiry — \`boss conscience resume\` to end.`);
  }
  if (reason) console.log(`    reason: ${reason}`);
  console.log('');
}

// `boss conscience resume` — explicit un-pause. (Also happens automatically when
// the recorded expiry passes, via the hook's auto-clear.)
export function conscienceResume() {
  const { path, cfg } = readConfigOrFail(process.cwd());
  if (!cfg.conscience || cfg.conscience.mode !== 'paused') {
    console.log('\n  Conscience is already active.\n');
    return;
  }
  cfg.conscience = { mode: 'active' };
  writeConfig(path, cfg);
  console.log(`\n  ${ok('✦')} Conscience resumed.\n`);
}

// The moments this project can actually fire — derived from the loops present
// (each hook-loop's `drift_moment`), so mute validates against reality rather than
// a hardcoded list that rots as moments are added. Used to catch typos and to show
// the founder what's muteable.
function availableMoments(projectDir) {
  try {
    return [...new Set(loadLoops(projectDir).map((l) => l.drift_moment).filter(Boolean))].sort();
  } catch { return []; }
}

// `boss conscience mute <moment> [--for <duration> | --until-resume] [--reason "..."]`
// Default duration: 7d. The surgical companion to pause — silence ONE moment, not
// the whole conscience. This is "voice the tension, never filter the menu" made
// operational: the founder consents to (or declines) each moment individually.
// Stored under `conscienceMutes` so pause/resume never clobber it (orthogonal).
export function conscienceMute(flags) {
  const { path, cfg } = readConfigOrFail(process.cwd());
  const moment = (flags._ && flags._[0]) || '';
  if (!moment) {
    throw new Error('which moment? e.g. `boss conscience mute drift`. `boss conscience status` lists what can fire.');
  }
  const moments = availableMoments(process.cwd());
  if (moments.length && !moments.includes(moment)) {
    throw new Error(`no '${moment}' moment in this project's loops. Available: ${moments.join(', ')}.`);
  }

  const reason = typeof flags.reason === 'string' ? flags.reason : '';
  let until = null;
  if (!flags['until-resume']) {
    const spec = typeof flags.for === 'string' ? flags.for : '7d';
    until = new Date(Date.now() + parseDuration(spec)).toISOString();
  }

  cfg.conscienceMutes = cfg.conscienceMutes || {};
  cfg.conscienceMutes[moment] = { until, since: new Date().toISOString(), reason };
  writeConfig(path, cfg);

  console.log(`\n  ${ok('✦')} Muted the '${moment}' moment.`);
  if (until) console.log(`    auto-unmutes: ${until}`);
  else console.log(`    no expiry — \`boss conscience unmute ${moment}\` to end.`);
  if (reason) console.log(`    reason: ${reason}`);
  console.log(`    ${dim('Other moments still speak; `boss conscience pause` silences all of them.')}`);
  console.log('');
}

// `boss conscience unmute <moment>` (or `--all`) — the explicit un-silence.
// (A mute with an expiry also lapses on its own, via the hook's clearExpiredMutes.)
export function conscienceUnmute(flags) {
  const { path, cfg } = readConfigOrFail(process.cwd());
  const mutes = cfg.conscienceMutes || {};
  const moment = (flags._ && flags._[0]) || '';

  if (flags.all === true) {
    if (Object.keys(mutes).length === 0) { console.log('\n  No moments are muted.\n'); return; }
    delete cfg.conscienceMutes;
    writeConfig(path, cfg);
    console.log(`\n  ${ok('✦')} Unmuted all moments.\n`);
    return;
  }
  if (!moment) throw new Error('which moment? e.g. `boss conscience unmute drift` (or `--all`).');
  if (!mutes[moment]) { console.log(`\n  '${moment}' isn't muted.\n`); return; }

  delete mutes[moment];
  if (Object.keys(mutes).length === 0) delete cfg.conscienceMutes;
  else cfg.conscienceMutes = mutes;
  writeConfig(path, cfg);
  console.log(`\n  ${ok('✦')} Unmuted the '${moment}' moment.\n`);
}

// Read the optional cohort declaration from .boss/config.json. Returns null if
// no config or no cohort field — Claude composes the conscience voice generically
// when cohort is null.
function readCohort(projectDir) {
  const f = join(projectDir, '.boss', 'config.json');
  if (!existsSync(f)) return null;
  try {
    const cfg = JSON.parse(readFileSync(f, 'utf8'));
    return cfg.cohort || null;
  } catch { return null; }
}

// Recent override entries in docs/devlog.md, per IDEA-008's grammar:
//   - **OVERRIDE:** <action> `<loop-id>` — rationale: <text>
function readOverrides(projectDir) {
  const f = join(projectDir, 'docs', 'devlog.md');
  if (!existsSync(f)) return [];
  try {
    const lines = readFileSync(f, 'utf8').split('\n');
    const re = /^- \*\*OVERRIDE:\*\*\s+(\w+)\s+`([^`]+)`\s+—\s+rationale:\s+(.+)$/;
    return lines.map((l) => l.match(re))
      .filter(Boolean)
      .map((m) => ({ action: m[1], loop: m[2], rationale: m[3].trim() }));
  } catch { return []; }
}

// Render a single closed-loop predicate result as a one-line "what's needed."
function exitSummary(result) {
  const e = result.evidence || {};
  if (typeof e.count === 'number' && typeof e.min === 'number') {
    return `count: ${e.count} / threshold: ${e.min}${e.count >= e.min ? ' (met)' : ` (need ${e.min - e.count} more)`}`;
  }
  if (typeof e.matched_files === 'number') {
    return `${e.matched_files} / ${e.total_files} file(s) match`;
  }
  if (e.type === 'exists') {
    return `expects: ${e.path}`;
  }
  return JSON.stringify(e);
}

// Read the frequency ledger (v0.34) the hook appends to on every fire.
function readActivity(projectDir) {
  const f = join(projectDir, '.boss', 'conscience-log.jsonl');
  if (!existsSync(f)) return [];
  try {
    return readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter(Boolean);
  } catch { return []; }
}

// The OUTCOME side of the ledger (RVW-021, the humane alternative to a hard
// notification cap). The frequency log says how OFTEN the conscience fired; the
// relationship log (.boss/brain/relationship.md, written at /close) says whether
// those fires LANDED. A persistently-low acted-on rate is the honest over-fire
// smell — better than a raw count, and it never muzzles a load-bearing warning.
// Heuristic read of the founder-owned prose (the tags /close is told to use);
// returns null when there's no relationship log yet.
function readRelationshipOutcomes(projectDir) {
  const f = join(projectDir, '.boss', 'brain', 'relationship.md');
  if (!existsSync(f)) return null;
  let text;
  try { text = readFileSync(f, 'utf8').toLowerCase(); } catch { return null; }
  const n = (re) => (text.match(re) || []).length;
  const landed = n(/\blanded\b/g);
  const overrode = n(/\boverr(?:ode|ide)\b/g);
  const pushedBack = n(/\bpushed[-\s]back\b/g);
  const ignored = n(/\bignored\b/g);
  const total = landed + overrode + pushedBack + ignored;
  if (total === 0) return null;
  // "Acted on" = the founder engaged: it landed, they deliberately overrode, or it
  // was wrong and they pushed back (the conscience learns). Only `ignored` is noise.
  const actedOn = landed + overrode + pushedBack;
  return { total, landed, overrode, pushedBack, ignored, actedOnRate: Math.round((actedOn / total) * 100) };
}

const median = (xs) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};

// Count fires per moment within the last `hours`.
function firesWithin(rows, hours) {
  const cutoff = Date.now() - hours * 3600e3;
  const counts = {};
  for (const r of rows) {
    const t = Date.parse(r.ts);
    if (!Number.isNaN(t) && t >= cutoff) {
      for (const m of r.moments || []) counts[m.moment] = (counts[m.moment] || 0) + 1;
    }
  }
  return counts;
}

// `boss conscience activity` (alias: `cost`) — the frequency view.
//
// Deliberately NOT a token/dollar number. The conscience hook never calls a
// model, so it cannot honestly estimate tokens (the induced bounded reads are
// invisible to it). What it CAN measure — and what actually tells you the
// conscience is becoming costly/annoying — is how often it fires. Over-firing,
// not the token bill, is the failure mode. Facts, not estimates.
export function conscienceActivity(projectDir = process.cwd(), { asCost = false } = {}) {
  const rows = readActivity(projectDir);

  if (asCost) {
    console.log(`\n  conscience cost → measured as FREQUENCY, not tokens.`);
    console.log(`  A hook that never calls a model can't honestly price tokens; over-firing (not the`);
    console.log(`  bill) is how a conscience becomes costly. Facts, not estimates.`);
  }

  if (rows.length === 0) {
    console.log(`\n  No conscience activity logged yet (.boss/conscience-log.jsonl absent or empty).`);
    console.log(`  The ledger fills one line per fire. Nothing has fired in this project.\n`);
    return;
  }

  const total = rows.length;
  const first = rows[0].ts, last = rows[rows.length - 1].ts;
  const perMoment = {};
  let judgeFires = 0;
  const chars = [];
  for (const r of rows) {
    for (const m of r.moments || []) perMoment[m.moment] = (perMoment[m.moment] || 0) + 1;
    if (r.judge) judgeFires++;
    if (typeof r.injected_chars === 'number') chars.push(r.injected_chars);
  }

  console.log(`\n  ${bold('conscience activity')}  ${dim('(.boss/conscience-log.jsonl)')}`);
  console.log(`    fires:          ${total}   ${first.slice(0, 10)} → ${last.slice(0, 10)}`);
  console.log(`    judge-moments:  ${judgeFires}/${total} fires induced a model bounded-read (drift / caution)`);
  console.log(`    injected ctx:   ${median(chars)} chars median per fire  ${dim('(chars are a fact; tokens would be a guess)')}`);
  console.log('');
  console.log(`    by moment:`);
  for (const [m, n] of Object.entries(perMoment).sort((a, b) => b[1] - a[1])) {
    console.log(`      ${String(n).padStart(4)}  ${m}`);
  }

  // Over-fire smell — the signal that actually matters. No per-prompt denominator
  // (the hook only logs fires, to stay instant), so we flag clustering instead.
  const last1h = firesWithin(rows, 1);
  const last24h = firesWithin(rows, 24);
  const smells = [];
  for (const [m, n] of Object.entries(last1h)) if (n >= 4) smells.push(`${m} fired ${n}× in the last hour`);
  for (const [m, n] of Object.entries(last24h)) if (n >= 8 && !(last1h[m] >= 4)) smells.push(`${m} fired ${n}× in the last 24h`);
  console.log('');
  if (smells.length) {
    console.log(`    ${warn('⚠')} over-fire smell — the conscience may be talking too often:`);
    for (const s of smells) console.log(`      • ${s}`);
    console.log(`      ${dim('A moment firing this often erodes trust like a false alarm. Worth a look —')}`);
    console.log(`      ${dim('tune the loop, `boss conscience mute <moment>` to turn down just that one,')}`);
    console.log(`      ${dim('or `boss conscience pause` to silence everything for a while.')}`);
  } else {
    console.log(`    No over-fire smell — fires are spread out.`);
  }

  // Outcome ledger (RVW-021): did the fires LAND? The deeper over-fire signal —
  // frequency says how often it spoke; this says whether it was worth listening to.
  const out = readRelationshipOutcomes(projectDir);
  if (out) {
    console.log('');
    console.log(`    acted-on:       ${out.actedOnRate}%  of nudges landed or were engaged  ${dim(`(${out.landed} landed · ${out.overrode} overrode · ${out.pushedBack} pushed-back · ${out.ignored} ignored)`)}`);
    if (out.actedOnRate < 50 && out.total >= 4) {
      console.log(`      ${warn('⚠')} ${dim('a low acted-on rate is the real over-fire smell — the conscience is talking past you.')}`);
      console.log(`      ${dim('This beats a hard cap: tune the loops that get ignored, don\'t silence the ones that land.')}`);
    } else {
      console.log(`      ${dim('the nudges are landing — measured from .boss/brain/relationship.md, not a guess.')}`);
    }
  }
  console.log('');
}

export function statusConscience(projectDir = process.cwd(), { verbose = false } = {}) {
  const loops = loadLoops(projectDir);
  if (loops.length === 0) {
    console.log('\n  No conscience loops in this project yet.');
    console.log(`  ${dim('They install with a mode — boss new, or boss sync --apply to add them here.')}\n`);
    return;
  }

  const cohort = readCohort(projectDir);
  const pause = readPauseState(projectDir);
  const overrides = readOverrides(projectDir);
  const isPaused = pause && pause.mode === 'paused' && !(pause.expires && new Date(pause.expires) <= new Date());

  console.log(`\n  ${bold('conscience state')}   ${isPaused ? warn('⏸ paused') : dim('active')}`);
  // Pause state surfaces FIRST and LOUDLY when active (IDEA-011 v0.23.0+) — a
  // founder who paused the conscience needs to remember they did, otherwise the
  // pause silently lingers and the override discipline gets less honest.
  if (pause && pause.mode === 'paused') {
    const expired = pause.expires && new Date(pause.expires) <= new Date();
    if (expired) {
      console.log(`    ${warn('⏸')} PAUSED  (EXPIRED — will auto-resume on next prompt)`);
    } else {
      console.log(`    ${warn('⏸')} PAUSED`);
      if (pause.since) console.log(`       since:        ${pause.since}`);
      if (pause.expires) {
        console.log(`       auto-resumes: ${pause.expires}`);
      } else {
        console.log(`       no expiry —  \`boss conscience resume\` to end`);
      }
      if (pause.reason) console.log(`       reason:       ${pause.reason}`);
    }
    console.log('');
  }
  // Per-moment mutes (v0.72.0) — surfaced like pause so a forgotten mute doesn't
  // silently swallow a moment forever. Only live (unexpired) mutes are shown.
  const mutes = readMuteState(projectDir);
  const liveMutes = Object.entries(mutes).filter(([, m]) => !m.until || new Date(m.until) > new Date());
  if (liveMutes.length) {
    console.log(`    ${warn('muted moments:')}`);
    for (const [moment, m] of liveMutes) {
      const when = m.until ? `until ${m.until.slice(0, 10)}` : 'until unmuted';
      console.log(`       ${moment.padEnd(12)} ${when}${m.reason ? `  — ${m.reason}` : ''}`);
    }
    console.log(`       ${dim('`boss conscience unmute <moment>` to bring one back')}`);
    console.log('');
  }
  console.log(`    cohort:  ${cohort ? cohort : '(unspecified — set via `/boss` or edit .boss/config.json)'}`);

  // Frequency ledger one-liner (v0.34) — surfaces over-firing at a glance.
  const activity = readActivity(projectDir);
  if (activity.length) {
    const last24h = firesWithin(activity, 24);
    const top = Object.entries(last24h).sort((a, b) => b[1] - a[1])[0];
    const recent = Object.values(last24h).reduce((a, b) => a + b, 0);
    let line = `    fires:   ${activity.length} logged`;
    if (recent) line += `; ${recent} in last 24h${top ? ` (most: ${top[0]} ×${top[1]})` : ''}`;
    const smell = top && top[1] >= 8;
    console.log(smell ? `${line}  ${warn('⚠ over-fire smell')} — see \`boss conscience activity\`` : `${line}  ${dim('(`boss conscience activity` for detail)')}`);
  }
  console.log('');

  // Sort: open first (they need attention), then closed, then unopenable.
  const classified = loops.map((l) => ({ loop: l, ...classifyLoop(l, projectDir) }));
  const order = { open: 0, closed: 1, unopenable: 2 };
  classified.sort((a, b) => order[a.state] - order[b.state]);
  const markFor = (state) => (state === 'closed' ? ok('✓') : state === 'open' ? warn('⚠') : dim('·'));
  const counts = { open: 0, closed: 0, unopenable: 0 };
  for (const c of classified) counts[c.state]++;

  // Progressive disclosure (IDEA-055): the default is a one-line loop summary +
  // any open loops named — the calm surface. `--verbose` opens the full per-loop
  // "would close when" breakdown + the override history. Pause/mutes/cohort/fires
  // above always show (a forgotten pause has to stay loud).
  if (!verbose) {
    const openIds = classified.filter((c) => c.state === 'open').map((c) => c.loop.id);
    console.log(`    loops:   ${warn(counts.open + ' open')} · ${counts.closed} closed${counts.unopenable ? ` · ${dim(counts.unopenable + ' waiting')}` : ''}`);
    if (openIds.length) console.log(`             ${dim('open:')} ${openIds.join(', ')}`);
    console.log(`    overrides: ${overrides.length} recorded`);
    console.log(`\n    ${dim('boss status --conscience --verbose')} — every loop, and what you've overridden`);
    console.log('');
    return;
  }

  console.log('');
  // Founder-facing label: the internal `unopenable` state reads as "waiting" here,
  // matching the summary line above (one word for one thing — voice-keeper).
  const label = (s) => (s === 'unopenable' ? 'waiting' : s);
  // One loop = one headed line + its indented detail. The state word appears ONCE (it used
  // to print on both lines) and the detail is indented UNDER the id rather than starting at
  // the same column as the glyph, so a 14-loop project reads as structure instead of 28
  // flat lines (REVIEW-2026-07-28 §C4).
  for (const { loop, state, entry, exit } of classified) {
    const detail = [];
    if (state === 'closed') {
      detail.push('exit artifact present.');
    } else if (state === 'open') {
      const unmetEntry = (entry.results || []).filter((r) => !r.ok);
      const unmetExit = (exit.results || []).filter((r) => !r.ok);
      detail.push(`would close when: ${unmetExit.map(exitSummary).join('; ') || 'exit artifact missing'}`);
      if (unmetEntry.length === 0 && loop.drift_moment) {
        detail.push(`drift moment: ${loop.drift_moment}`);
      }
    } else {
      detail.push('its entry artifact isn\'t present yet (an upstream dependency).');
    }
    console.log(`    ${markFor(state)} ${loop.id.padEnd(22)}  ${label(state)}`);
    for (const d of detail) console.log(`        ${dim(d)}`);
  }

  console.log('');
  if (overrides.length === 0) {
    console.log('    No recorded overrides in docs/devlog.md.');
  } else {
    console.log(`    Recent overrides (${overrides.length}):`);
    for (const o of overrides.slice(-5)) {
      console.log(`      ${dim('•')} ${o.action} \`${o.loop}\` — ${o.rationale}`);
    }
  }
  console.log('');
}
