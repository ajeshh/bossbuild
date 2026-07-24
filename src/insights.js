import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { listProjects } from './registry.js';
import { bossVersion, STAGE_ORDER } from './paths.js';
import { collectBoard } from './board.js';
import { dim, bold, ok, warn } from './ui.js';

// `boss insights` — the honest-trace lens (IDEA-021).
//
// Reads the trace your own work already leaves — your registered projects, on THIS machine —
// and reports where each venture's loop stands: idea → canvas → build → graduation. It measures
// *graduation and loop-closure*, never activity/engagement (that's the vanity metric BOSS refuses
// to expose). Nothing is sent anywhere; cross-user learning is opt-in only (shareUp). This is the
// humane half of "learn how it's used": read the trace, don't instrument the human.

const DAY = 86400000;

// Pull the `created:` date (YYYY-MM-DD) from a doc's frontmatter, or null. Used for
// the honest time-to-graduation metric (IDEA-034 Track C): real recorded dates only,
// never a guess from mtime.
function createdDate(text) {
  const m = text.match(/^created:\s*(\d{4}-\d{2}-\d{2})/m);
  return m ? m[1] : null;
}

// Count IDEA-*.md docs and how many have been pressure-tested (carry a canvas), plus any FEAT-*.md
// (a feature in build = graduation past the canvas gate). Also reads the earliest IDEA and FEAT
// `created:` dates so insights can report idea→build cycle time. Reads files; never writes.
// "In build" and "shipped" are read from the SAME projection the board uses
// (collectBoard — frontmatter is truth), so `boss insights` and `boss board` can
// never disagree again (IDEA-055 — insights used to call every FEAT file "building",
// even shipped ones). building = the board's Building column; shipped = shipped
// FEATs only (a shipped *idea* isn't a shipped feature — that stays the graduation
// signal, not board's Shipped column which also folds in shipped ideas).
function buildCounts(dir) {
  try {
    const { cards } = collectBoard(dir);
    const building = cards.filter((c) => c.column === 'Building').length;
    const shipped = cards.filter((c) => c.column === 'Shipped' && /^FEAT/i.test(c.id)).length;
    return { building, shipped };
  } catch { return { building: 0, shipped: 0 }; }
}

function readProjectTrace(dir) {
  const ideasDir = join(dir, 'docs', 'ideas');
  let ideas = 0, canvassed = 0, features = 0, newest = 0;
  let firstIdea = null, firstFeat = null; // earliest created: dates (lexical ISO compare)
  const seenCanvas = existsSync(join(dir, 'docs', 'ideas', 'CANVAS.md'));
  if (existsSync(ideasDir)) {
    for (const f of readdirSync(ideasDir)) {
      if (!f.endsWith('.md')) continue;
      const full = join(ideasDir, f);
      let mtime = 0;
      try { mtime = statSync(full).mtimeMs; } catch { /* skip */ }
      if (mtime > newest) newest = mtime;
      if (/^IDEA-\d+/.test(f)) {
        ideas++;
        try {
          const txt = readFileSync(full, 'utf8');
          if (/canvas/i.test(txt)) canvassed++;
          const d = createdDate(txt);
          if (d && (!firstIdea || d < firstIdea)) firstIdea = d;
        } catch { /* unreadable — don't guess */ }
      } else if (/^FEAT-\d+/.test(f)) {
        features++;
        try {
          const d = createdDate(readFileSync(full, 'utf8'));
          if (d && (!firstFeat || d < firstFeat)) firstFeat = d;
        } catch { /* unreadable — don't guess */ }
      }
    }
  }
  if (seenCanvas && canvassed === 0) canvassed = 1;
  return { ideas, canvassed, features, ...buildCounts(dir), newest, firstIdea, firstFeat };
}

// One honest read on where a project's loop stands. Returns null if the project is gone from disk.
function assess(p, nowMs) {
  if (!p.path || !existsSync(p.path)) return { ...p, missing: true };
  const stampFile = join(p.path, '.boss', 'manifest.json');
  let stamp = null;
  if (existsSync(stampFile)) {
    try { stamp = JSON.parse(readFileSync(stampFile, 'utf8')); } catch { /* tolerate */ }
  }
  const t = readProjectTrace(p.path);
  const depth = (stamp?.installedLayers || []).length || 1;
  const lastTouch = t.newest || (stamp?.createdAt ? Date.parse(stamp.createdAt) : 0);
  const ageDays = lastTouch ? Math.floor((nowMs - lastTouch) / DAY) : null;

  // Time-to-graduation (IDEA-034 Track C): days from the first captured idea to the
  // first FEAT in build. The honest loop-closure cycle time — derived only from
  // recorded `created:` dates, omitted (never guessed) when they're absent. NOT
  // throughput/velocity (the vanity metric BOSS refuses to expose).
  const toBuildDays = (t.firstIdea && t.firstFeat && t.firstFeat >= t.firstIdea)
    ? Math.round((Date.parse(t.firstFeat) - Date.parse(t.firstIdea)) / DAY)
    : null;

  // Kill-speed (IDEA-044 — /sunset): days from the first captured idea to retirement.
  // Camuffo's metric — validation's payoff is deciding (and quitting) faster. Real dates
  // only (the registry's retired_on), omitted when absent. Never a score, never a judgment.
  const retired = p.status === 'retired';
  const toRetireDays = (retired && t.firstIdea && p.retired_on && p.retired_on >= t.firstIdea)
    ? Math.round((Date.parse(p.retired_on) - Date.parse(t.firstIdea)) / DAY)
    : null;

  // Loop-closure signal — NOT activity. Where did the venture get stuck, if anywhere?
  let signal = 'flowing', note = '';
  if (t.ideas === 0 && t.features === 0) {
    signal = 'empty'; note = 'nothing captured yet — point /boss or /import at your idea';
  } else if (t.canvassed === 0 && t.features === 0) {
    signal = 'untested';
    note = `captured, never pressure-tested${ageDays != null ? ` (${ageDays}d)` : ''} — try /canvas`;
  } else if (ageDays != null && ageDays >= 14) {
    signal = 'stale'; note = `no movement in ${ageDays}d`;
  } else {
    signal = 'flowing'; note = '';
  }
  return {
    ...p, missing: false,
    mode: stamp?.mode || p.mode || p.stage || '?',
    pin: stamp?.bossVersion || p.bossVersion || '?',
    depth, ideas: t.ideas, canvassed: t.canvassed, features: t.features,
    building: t.building, shipped: t.shipped, ageDays, signal, note,
    toBuildDays, retired, retiredOn: p.retired_on || null, toRetireDays,
  };
}

const MARK = { flowing: ok('✓'), untested: warn('⚠'), empty: warn('⚠'), stale: dim('·'), missing: dim('·') };

export function insights(cwd) {
  const nowMs = Date.now();
  const projects = listProjects();
  if (!projects.length) {
    console.log('\n  No projects registered yet. Run `boss new <name>` to start one.\n');
    return;
  }

  const rows = projects.map((p) => assess(p, nowMs)).filter((r) => !r.missing);
  const gone = projects.length - rows.length;
  const current = bossVersion();

  console.log(`\n  ${bold('insights · your BOSS portfolio')}        ${dim('(local · nothing sent)')}\n`);
  console.log(`  ${rows.length} project(s) on this machine${gone ? `  ${dim(`(+${gone} registered but not on disk)`)}` : ''}`);

  // Graduation distribution across the mode ladder — the real "how far have ventures gotten".
  const byMode = {};
  for (const r of rows) byMode[r.mode] = (byMode[r.mode] || 0) + 1;
  const ladder = STAGE_ORDER.map((s) => s.replace(/^L\d+-/, '')).map((label) => {
    const k = Object.keys(byMode).find((m) => m.toLowerCase().startsWith(label.slice(0, 4).toLowerCase()));
    return `${label} ${k ? byMode[k] : 0}`;
  }).join(' · ');
  const behind = rows.filter((r) => r.pin !== current).length;
  console.log(`    graduation:  ${ladder}`);
  console.log(`    pins:        ${rows.length - behind} current · ${behind} behind${behind ? '  (run /boss-sync there)' : ''}`);

  // Time-to-graduation across the portfolio — idea→build cycle time, never throughput.
  const cycles = rows.map((r) => r.toBuildDays).filter((d) => d != null).sort((a, b) => a - b);
  if (cycles.length) {
    const median = cycles[Math.floor((cycles.length - 1) / 2)];
    console.log(`    flow:        idea→build median ${median}d  (across ${cycles.length} graduated · cycle time, not throughput)`);
  }

  // Kill-speed (IDEA-044): the honest count of bets run vs. retired, and how fast the dead
  // ones were killed — Camuffo's "quit faster" made measurable. Only appears once you've
  // ended a project on purpose. Facts from real dates; never a score.
  const retiredRows = rows.filter((r) => r.retired);
  if (retiredRows.length) {
    const kills = retiredRows.map((r) => r.toRetireDays).filter((d) => d != null).sort((a, b) => a - b);
    const medKill = kills.length ? kills[Math.floor((kills.length - 1) / 2)] : null;
    console.log(`    kill-speed:  ${rows.length} bet(s) run · ${retiredRows.length} retired${medKill != null ? ` · median idea→retire ${medKill}d` : ''}  (deciding faster is the payoff, not a score)`);
  }

  console.log(`\n  ${bold('where each loop stands')} ${dim('— idea → canvas → build')}`);
  let mostStuck = null; // the first project carrying a note — the honest "do this next"
  for (const r of rows) {
    const here = cwd && r.path === cwd ? ' (here)' : '';
    if (r.retired) {
      // A closed loop reads honestly, not as a stalled one: no stale/untested note.
      const kill = r.toRetireDays != null ? ` · idea→retire ${r.toRetireDays}d` : '';
      console.log(`    ${dim('⊘')} ${dim(String(r.name + here).padEnd(20) + ' ' + String('retired').padEnd(11) + ' retired ' + (r.retiredOn || '—') + kill)}`);
      continue;
    }
    const stat = `${r.ideas} idea${r.ideas === 1 ? '' : 's'} · ${r.canvassed} canvassed${r.building ? ` · ${r.building} building` : ''}${r.shipped ? ` · ${r.shipped} shipped` : ''}${r.toBuildDays != null ? ` · built in ${r.toBuildDays}d` : ''}`;
    console.log(`    ${MARK[r.signal] || ' '} ${String(r.name + here).padEnd(20)} ${String(r.mode).padEnd(11)} ${stat}`);
    if (r.note) {
      console.log(`      ${''.padEnd(22)}${dim(r.note)}`);
      if (!mostStuck) mostStuck = r;
    }
  }

  // End on a next action, not a mission statement (IDEA-055). If something's stuck,
  // name the cheapest move on it; otherwise the loops are flowing — say so.
  console.log('');
  if (mostStuck) {
    console.log(`  ${bold('Next')}  → ${mostStuck.name}: ${mostStuck.note}`);
  } else {
    console.log(`  ${ok('✓')} all loops flowing — nothing stalled.`);
  }
  console.log(`  ${dim('Measures graduation, not activity. Local-only; share deliberately with /feedback (inside Claude).')}\n`);
}
