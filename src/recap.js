// boss recap — what happened, in the words of the records you already wrote.
//
// WHY THIS EXISTS. Every surface BOSS had answered *where am I* (`boss status`), *what is in
// flight* (`boss board`), or *what can I run* (`boss map`). Nothing answered **what happened**,
// which is the question a founder is asked every week by whoever they answer to — a group partner,
// a cofounder, an investor update, or the version of themselves who opens the laptop on Monday.
// They were re-deriving it by scrolling the devlog.
//
// It is also the one thing BOSS produced nothing SHAREABLE for. `/log`, `/close`, `/decide` and
// `/evidence` each write a durable record, and the sum of them never got rendered anywhere a person
// could paste. A tool whose only visible output is a nudge that fires rarely and silence the rest of
// the time gives its user nothing to show anyone — including nothing to show themselves.
//
// COMPOSITION, NOT SURFACE. Nothing here is a new record, a new loop, or a new skill. Every line is
// read back out of files the founder already has: `docs/devlog.md` (`/log`, `/close`), the record
// set (`/idea`, `/spec`, `/decide`, `/evidence`), the board's columns, and the canvas's riskiest
// assumption. If a section is empty it is because nothing was written, and this says so rather than
// hiding the row — the standing rule from `orientation.js`: absent and empty must not look alike.
//
// THE ANTI-FLATTERY RULE APPLIES HERE HARDEST (IDEA-065). A weekly summary is the most tempting
// place in the product to invent momentum. So: no streak, no percentage, no total-only count, no
// "you're on a roll". The week where nothing shipped prints as the week where nothing shipped, and
// the standing question — *is the riskiest assumption any less risky than last week?* — prints
// whether or not the answer flatters. A recap that can only go up is a comfort device.
//
// DATES COME FROM GIT, and where git cannot answer, the recap says so instead of guessing. A record
// it cannot date is reported as undatable, never quietly dropped from the window — the shape of the
// bug `check:site`'s citation gauge shipped, where forgetting to file something shrank the
// denominator and made the number look better.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { timeline } from './records.js';
import { collectBoard } from './board.js';
import { dim, bold, warn } from './ui.js';

const DAY = 86400000;
const DEFAULT_DAYS = 7;
const DATE_HEADING = /^##\s+(\d{4}-\d{2}-\d{2})/;

const iso = (t) => new Date(t).toISOString().slice(0, 10);

/** The window: `--since YYYY-MM-DD` wins, else `--days N`, else 7 days back. */
export function resolveWindow({ since, days } = {}, now = Date.now()) {
  if (since && /^\d{4}-\d{2}-\d{2}$/.test(since)) return { from: since, to: iso(now) };
  const n = Number.isFinite(+days) && +days > 0 ? Math.floor(+days) : DEFAULT_DAYS;
  return { from: iso(now - n * DAY), to: iso(now) };
}

// Every dated devlog entry in the window, newest first, with the two fields `/log` writes.
// Parsed from content for the same reason `reentry.js` does it: a fresh clone resets every
// mtime, and the day the founder worked is a fact that survives a checkout.
function devlogEntries(projectDir, from, to) {
  const f = join(projectDir, 'docs', 'devlog.md');
  if (!existsSync(f)) return null;                 // no devlog is a different fact from an empty one
  let lines;
  try { lines = readFileSync(f, 'utf8').split(/\r?\n/); } catch { return null; }
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    const m = DATE_HEADING.exec(lines[i]);
    if (!m) continue;
    const date = m[1];
    if (date < from || date > to) continue;
    const field = (label) => {
      const re = new RegExp(`^\\s*-\\s+\\*\\*${label}:?\\*\\*\\s*(.*)$`, 'i');
      for (let j = i + 1; j < lines.length && !/^##\s/.test(lines[j]); j += 1) {
        const mm = re.exec(lines[j]);
        if (mm) {
          const v = mm[1].trim();
          return v && !/^_?\(?(tbd|none|n\/a)\)?_?$/i.test(v) ? v : null;
        }
      }
      return null;
    };
    out.push({ date, landed: field('Landed'), next: field('Next') });
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

const title = (projectDir, file) => {
  try {
    const t = readFileSync(join(projectDir, file), 'utf8');
    const h = t.split(/\r?\n/).find((l) => /^#\s+/.test(l));
    return h ? h.replace(/^#\s+/, '').replace(/^[A-Z]{3,4}-\d+\s*[—:-]\s*/, '').trim() : '';
  } catch { return ''; }
};

const grade = (projectDir, file) => {
  try {
    const m = readFileSync(join(projectDir, file), 'utf8').match(/^grade:\s*(\S+)/m);
    return m ? m[1] : null;
  } catch { return null; }
};

// The canvas's riskiest assumption, read exactly the way `boss board` and the conscience read it —
// one definition, so the three surfaces can never disagree about whether a bet has been named.
function riskiest(projectDir) {
  for (const rel of ['docs/ideas/CANVAS.md']) {
    const p = join(projectDir, rel);
    if (!existsSync(p)) continue;
    try {
      const lines = readFileSync(p, 'utf8').split(/\r?\n/);
      const i = lines.findIndex((l) => /Riskiest assumption:\*\*/.test(l));
      if (i < 0) continue;
      // Markdown hard-wraps. Reading only the matched line truncated BOSS's own assumption
      // mid-clause ("…will it change a decision they"), which reads as a bug in the record
      // rather than in the reader. Take the continuation lines too, stopping at the blank line
      // or the next bullet — the same bound a human eye uses.
      let text = lines[i].replace(/^.*Riskiest assumption:\*\*\s*/, '').trim();
      for (let j = i + 1; j < lines.length; j += 1) {
        const l = lines[j];
        if (!l.trim() || /^\s*[-*]\s/.test(l) || /^#/.test(l)) break;
        text += ` ${l.trim()}`;
      }
      if (!text || text.startsWith('_')) return { named: false };
      // A canvas cell can be a paragraph. Clipped at a word boundary with the cut marked, because
      // the recap is meant to be pasted and an unmarked truncation would misquote the founder's
      // own bet. The canvas remains the place to read it in full.
      const CAP = 220;
      if (text.length > CAP) {
        const cut = text.slice(0, CAP);
        const sp = cut.lastIndexOf(' ');
        text = `${(sp > CAP * 0.6 ? cut.slice(0, sp) : cut).trimEnd()}…`;
      }
      return { named: true, text };
    } catch { /* unreadable — don't guess */ }
  }
  return null;
}

const inGitRepo = (projectDir) => {
  try {
    execFileSync('git', ['rev-parse', '--git-dir'], { cwd: projectDir, stdio: 'ignore' });
    return true;
  } catch { return false; }
};

/** Everything the render needs, and nothing computed twice. Never throws. */
export function collectRecap(projectDir, opts = {}) {
  const { from, to } = resolveWindow(opts);
  const git = inGitRepo(projectDir);
  const rows = git ? timeline(projectDir) : [];
  const inWindow = (d) => d && d >= from && d <= to;

  const created = rows.filter((r) => inWindow(r.captured));
  const undatable = rows.filter((r) => !r.captured).length;
  const kind = (p) => created.filter((r) => r.id.startsWith(p));

  let board = { cards: [] };
  try { board = collectBoard(projectDir); } catch { /* no board is not a finding */ }

  return {
    from,
    to,
    git,
    undatable,
    devlog: devlogEntries(projectDir, from, to),
    shipped: rows.filter((r) => inWindow(r.shipped)),
    evidence: kind('EVID').map((r) => ({ ...r, grade: grade(projectDir, r.file), title: title(projectDir, r.file) })),
    decisions: kind('DEC').map((r) => ({ ...r, title: title(projectDir, r.file) })),
    captured: [...kind('IDEA'), ...kind('FEAT')].map((r) => ({ ...r, title: title(projectDir, r.file) })),
    building: board.cards.filter((c) => c.column === 'Building'),
    risk: riskiest(projectDir),
  };
}

// Two renderers over one collection. The terminal one is for the founder; `--md` is for the person
// they are about to send it to, which is the whole reason this command exists — a summary nobody
// can paste is a summary that stays in the terminal.
export function renderRecap(projectName, d, { markdown = false } = {}) {
  const L = [];
  const B = markdown ? ((t) => `**${t}**`) : bold;
  const D = markdown ? ((t) => t) : dim;
  const line = (s = '') => L.push(s);
  const row = (a, b) => line(markdown ? `- ${a}${b ? ` — ${b}` : ''}` : `      ${a}${b ? `  ${D(b)}` : ''}`);
  const head = (t) => line(markdown ? `\n### ${t}` : `\n  ${B(t)}`);
  const none = (t) => line(markdown ? `- ${t}` : `      ${D(t)}`);

  line(markdown ? `## ${projectName} — ${d.from} to ${d.to}` : `\n  ${B(projectName + ' · recap')}  ${D(`${d.from} → ${d.to}`)}`);

  if (!d.git) {
    line(markdown ? '\n_Not a git checkout — record dates are unavailable, so only the devlog is read._'
      : `\n  ${warn('!')} ${D('not a git checkout — record dates are unavailable, so only the devlog is read.')}`);
  }

  head('Landed');
  if (d.shipped.length) for (const r of d.shipped) row(r.id, `shipped ${r.shipped}`);
  if (d.devlog === null) none('No devlog yet — `/log` writes one, and it is what this reads.');
  else if (d.devlog.length) for (const e of d.devlog) row(e.date, e.landed || '(no Landed line)');
  else none('Nothing logged in this window.');   // prints even when a record shipped: "work landed"
                                                 // and "the week was written down" are different facts

  head('Learned');
  if (d.evidence.length) {
    for (const e of d.evidence) row(`${e.id} ${e.grade || 'ungraded'}`, e.title);
  } else {
    none('No new evidence. `/interview` turns one 15-minute call into a graded record.');
  }

  head('Decided');
  if (d.decisions.length) for (const r of d.decisions) row(r.id, r.title);
  else none('Nothing recorded. `/decide` is for the calls that are hard to reverse.');

  head('Started');
  if (d.captured.length) for (const r of d.captured) row(r.id, r.title);
  else none('Nothing new captured.');

  head('In flight');
  if (d.building.length) for (const c of d.building) row(c.id, c.title || '');
  else none('Nothing in build.');

  // The standing question, printed whether or not the answer flatters. This is the line that keeps
  // the recap from being a highlight reel: a week can be full of landed work and still not touch
  // the one thing the whole bet rests on, and that is exactly the week worth noticing.
  head('The bet');
  if (!d.risk) none('No canvas yet — `/canvas` names the assumption everything else rests on.');
  else if (!d.risk.named) none('Your canvas has no riskiest assumption filled in. That cell is the gate.');
  else {
    row('Riskiest assumption', d.risk.text);
    if (!d.evidence.length) none('Nothing this week tested it.');
    else {
      const strongest = d.evidence.some((e) => e.grade === 'commitment') ? 'a commitment'
        : d.evidence.some((e) => e.grade === 'observed-behavior') ? 'observed behavior' : 'stated pain';
      none(`${d.evidence.length} signal(s) this week; the strongest is ${strongest}.`);
    }
  }

  if (d.undatable) {
    line(markdown ? `\n_${d.undatable} record(s) are not in git history, so this window could not include or exclude them._`
      : `\n  ${warn('!')} ${D(`${d.undatable} record(s) not in git history — this window could neither include nor exclude them.`)}`);
  }

  if (!markdown) {
    line('');
    line(`  ${D('paste-ready markdown:')} ${bold('boss recap --md')}${D('  ·  a different window:')} ${bold('boss recap --days 14')}`);
    line('');
  }
  return L.join('\n');
}

export function recap(projectDir, projectName, opts = {}) {
  console.log(renderRecap(projectName, collectRecap(projectDir, opts), opts));
}
