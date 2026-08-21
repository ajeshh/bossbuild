// `boss craft` — read BOSS's practice shelf from inside any project.
//
// WHY THIS EXISTS: the shelf ships in the npm package, so every practice is already on
// the founder's disk. But 25 shipped agents, skills and hooks referenced them as
// `library/practices/<name>.md` — a path that resolves in BOSS's own repo and nowhere else.
// A founder's project has no `library/`. Every one of those pointers was a dead end that
// *looked* authoritative: the sharp edge in the agent, then a reference to nothing.
//
// The fix is not to copy the whole shelf into every project (bloat, and instantly stale). It's
// to give the pointer a form that resolves anywhere: `boss craft <name>`.
//
// Distinct from the `/practice` skill: that is the FOUNDER's own craft commons (PRAC-NNN
// records they and a cofounder write). This is BOSS's shelf — read-only, and it comes from
// the package, so it is always exactly as current as the installed version.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { PRACTICES_DIR } from './paths.js';
import { dim, bold, ok, warn, err } from './ui.js';
import { printPatterns } from './patterns.js';

// Minimal frontmatter read — same shape the freshness script uses. Zero-dep by rule.
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

// The title line is the practice's own one-liner — better than a hand-maintained gloss,
// because it cannot drift from the doc it describes.
function headline(text) {
  const h = text.match(/^#\s+(.+)$/m);
  if (!h) return '';
  return h[1].replace(/^Practice:?\s*[—-]?\s*/i, '').trim();
}

export function listPractices() {
  if (!existsSync(PRACTICES_DIR)) return [];
  return readdirSync(PRACTICES_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const text = readFileSync(join(PRACTICES_DIR, f), 'utf8');
      const fm = frontmatter(text);
      return {
        name: f.replace(/\.md$/, ''),
        file: join(PRACTICES_DIR, f),
        curve: fm.curve || '',
        reviewBy: fm.review_by || '',
        headline: headline(text),
        lines: text.split('\n').length,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Resolve a user-typed name: exact, then prefix, then substring. A founder types
// `boss craft testing` and means `testing-with-agents`; making them type the full
// slug is the kind of friction that stops a pointer from being followed.
export function resolvePractice(query) {
  const all = listPractices();
  const q = String(query || '').toLowerCase().replace(/\.md$/, '');
  const exact = all.find((p) => p.name === q);
  if (exact) return { hit: exact };
  const matches = all.filter((p) => p.name.startsWith(q))
    .concat(all.filter((p) => !p.name.startsWith(q) && p.name.includes(q)));
  if (matches.length === 1) return { hit: matches[0] };
  return { hit: null, candidates: matches };
}

// A practice is read deliberately, so its LENGTH is not a per-session tax the way a skill
// body is — but a shelf that only ever grows is how BOSS becomes the framework it refuses to
// be (R&H #1). The honest guard is subtraction at refresh time, which needs the growth to be
// VISIBLE. Outliers are flagged, not split: `--outline` lets a reader map a long practice
// before pulling all of it.
function outlineOf(text) {
  return text.split('\n')
    .map((l, i) => ({ l, i }))
    .filter(({ l }) => /^#{2,3}\s+\S/.test(l))
    .map(({ l, i }) => ({
      depth: (l.match(/^#+/) || [''])[0].length,
      title: l.replace(/^#+\s*/, '').trim(),
      line: i + 1,
    }));
}

export function printCraft(query, opts = {}) {
  const all = listPractices();
  if (!all.length) {
    console.log(`\n  ${err('No practice shelf found')} — expected it at ${dim(PRACTICES_DIR)}.`);
    console.log(`  This usually means a broken install; try reinstalling BOSS.\n`);
    return 1;
  }

  // No argument: the shelf.
  if (!query) {
    console.log(`\n  ${bold('BOSS craft shelf')}  ${dim(`— ${all.length} practices, read-only, from the installed package`)}\n`);
    const width = Math.max(...all.map((p) => p.name.length));
    // Median, not mean — a couple of long outliers shouldn't move the bar they're judged against.
    const lens = all.map((p) => p.lines).sort((a, b) => a - b);
    const median = lens[Math.floor(lens.length / 2)];
    let outliers = 0;
    for (const p of all) {
      const big = p.lines > median * 2;
      if (big) outliers++;
      const size = big ? warn(`${p.lines}L`) : dim(`${p.lines}L`);
      console.log(`  ${bold(p.name.padEnd(width))}  ${size.padEnd(14)}  ${p.headline}`);
    }
    console.log(`\n  ${bold('boss craft <name>')}             print one ${dim('(prefixes work: `boss craft testing`)')}`);
    console.log(`  ${bold('boss craft <name> --outline')}   just the headings, before pulling the whole doc`);
    if (outliers) {
      console.log(`\n  ${warn(`${outliers} practice(s) run past 2\u00d7 the median (${median}L)`)} ${dim('\u2014 not a bug, a subtraction')}`);
      console.log(`  ${dim('candidate: a practice that only ever grows is how a shelf becomes a framework.')}`);
      console.log(`  ${dim('The next refresh should ask what can be deleted, not just what to add.')}`);
    }
    console.log(`  ${dim('This is BOSS\'s shelf. Your own team\'s craft notes live in /practice → PRAC-NNN.')}\n`);
    return 0;
  }

  const { hit, candidates } = resolvePractice(query);
  if (!hit) {
    if (candidates && candidates.length) {
      console.log(`\n  ${warn(`"${query}" matches ${candidates.length} practices:`)}`);
      for (const c of candidates) console.log(`    ${c.name}`);
      console.log(`\n  Be more specific, or run ${bold('boss craft')} for the whole shelf.\n`);
    } else {
      console.log(`\n  ${warn(`No practice matches "${query}".`)}  Run ${bold('boss craft')} to see the shelf.\n`);
    }
    return 1;
  }

  // The deceptive-pattern catalog is the one practice with a DATA half, because it is the one
  // that has promised to keep growing. Printing it whole is the failure mode it was split to
  // avoid, so the default here is the filtered dose; `--prose` gets the judgment document.
  if (hit.name === 'deceptive-patterns' && !opts.prose && !opts.outline) {
    return printPatterns({ shape: opts.shape, surface: opts.surface, minors: opts.minors });
  }

  const text = readFileSync(hit.file, 'utf8');

  if (opts.outline) {
    const heads = outlineOf(text);
    console.log(`\n  ${bold(hit.name)}  ${dim(`\u2014 ${hit.lines} lines, ${heads.length} sections`)}\n`);
    for (const h of heads) {
      console.log(`  ${dim(String(h.line).padStart(4))}  ${h.depth === 2 ? bold(h.title) : '  ' + h.title}`);
    }
    console.log(`\n  ${dim(`Full text: boss craft ${hit.name}`)}\n`);
    return 0;
  }

  // Print the doc as-is. The reader is usually Claude following a pointer from an agent
  // prompt — it wants the practice, not a summary of it.
  console.log(`\n${text.trim()}\n`);
  const stale = hit.reviewBy && hit.reviewBy < new Date().toISOString().slice(0, 10);
  const stamp = hit.reviewBy
    ? (stale ? warn(`review overdue (${hit.reviewBy})`) : ok(`fresh until ${hit.reviewBy}`))
    : dim('no review date');
  console.log(`  ${dim('—')} ${bold(hit.name)} ${dim(`· ${hit.curve || 'no curve'} ·`)} ${stamp}\n`);
  return 0;
}
