// `boss changelog` — read what changed in BOSS, from inside any project.
//
// WHY THIS EXISTS: `/boss-sync`'s step 0 told the model to "read `registry/CHANGELOG.md` from the
// BOSS source repo." A founder's project has no `registry/`. That step is the entire reason sync
// is *reviewed* rather than blind — it's where "14 files changed" becomes "here's what's new and
// why" — and it pointed at a directory only BOSS's own checkout has. Same dead end `boss craft`
// fixed for the practice shelf in v0.147.0, in the one place that most needed to resolve.
//
// The changelog already ships in the npm package (`files` includes `registry/CHANGELOG.md`), so
// it is already on the founder's disk. It just had no reachable form. This is that form.
//
// Default behaviour is the useful one: inside a BOSS project, "what changed since MY pin" — the
// exact question a founder has when `boss status` says newer practices are available.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT, bossVersion } from './paths.js';
import { dim, bold, ok, warn, err } from './ui.js';

const CHANGELOG = join(BOSS_ROOT, 'registry', 'CHANGELOG.md');

// "0.151.0" -> [0,151,0]. Anything unparseable sorts oldest, which fails safe: an entry we can't
// grade shows up rather than being silently swallowed.
const parts = (v) => String(v || '').trim().split('.').map((n) => parseInt(n, 10) || 0);
export function cmpVersion(a, b) {
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0);
  return 0;
}

// Entries are `## X.Y.Z — YYYY-MM-DD` headings with everything up to the next `## ` beneath.
// --- `## Unreleased` — capabilities land here; a version is stamped when Ajesh publishes -------
// Until v0.326.0 every capability bumped VERSION: ~11 versions a day across six sessions, contended
// on one integer, received by nobody until `npm publish` — which is one person's act and happened
// every few weeks. So the unit moved. A capability is a commit plus a bullet under `## Unreleased`
// at the top of the CHANGELOG; VERSION does not move. `npm run release -- --stamp` (the releaser,
// at publish) turns that heading into the next number and date. `parseEntries` never sees the
// Unreleased section (its heading is not a version), so founders and `boss sync` see only what
// they can install.

/** The Unreleased section: { present, body } — body is the lines under the heading. */
export function unreleased(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) => /^##\s+Unreleased\s*$/i.test(l));
  if (start < 0) return { present: false, body: [] };
  const body = [];
  for (let i = start + 1; i < lines.length && !/^##\s/.test(lines[i]); i++) body.push(lines[i]);
  return { present: true, body };
}

/** Is there anything to stamp? Bullets or prose, not blank lines, the template comment or the weight headings. */
export function unreleasedHasContent(text) {
  return unreleased(text).body.some((l) => l.trim() && !/^<!--/.test(l.trim()) && !weightOf(l));
}

// --- Weights: what a founder will notice, apart from the rest (IDEA-151) -----------------------
// Until DEC-019 a release was one capability, and one `> **For you:**` line per release could carry
// its founder half. Since then a release is a bundle of 20–60 bullets, the per-release line stopped
// being written (0.327.0: one; 0.328.0 and 0.329.0: none), and the readers took that silence as a
// verdict: a founder one release behind ran `boss whatsnew` on 0.329.0, which changed the playbook,
// the canvas, the conscience and `boss status`, and was told *"Internal release — nothing here
// changes what you do."* The site's What's new stopped at 0.327.0. So the weight moved to where the
// unit now is, the bullet: every bullet sits under one of three headings, chosen by whoever writes
// it — the one person who knows. Readable on GitHub with no parser; the parser just groups.
export const WEIGHTS = [
  { key: 'notice', heading: "What you'll notice", re: /^###\s+what you.?ll notice\b/i },
  { key: 'improve', heading: 'Smaller improvements', re: /^###\s+smaller improvements\b/i },
  { key: 'internal', heading: 'Under the hood', re: /^###\s+under the hood\b/i },
];
const weightOf = (line) => WEIGHTS.find((w) => w.re.test(line))?.key || null;

// A top-level bullet runs until the next unindented non-blank line, so its wrapped continuation and
// nested sub-bullets stay inside it, and a bold lead-in paragraph (the pre-DEC-019 shape) ends it.
function bulletsIn(lines) {
  const out = [];
  let cur = null;
  for (const l of lines) {
    if (/^-\s/.test(l)) { cur = [l.replace(/^-\s+/, '')]; out.push(cur); } else if (cur && (!l.trim() || /^\s/.test(l))) cur.push(l);
    else cur = null;
  }
  return out.map((b) => b.map((l) => l.trim()).filter(Boolean).join(' '));
}

/**
 * An entry's bullets by weight. `sectioned` is false for a release written before the headings
 * existed; those keep the For-you reading. `loose` holds bullets under no weight heading.
 */
export function weighed(entry) {
  const lines = Array.isArray(entry) ? entry : Array.isArray(entry?.body) ? entry.body : String(entry || '').split(/\r?\n/);
  const out = { sectioned: false, notice: [], improve: [], internal: [], loose: [] };
  let at = 'loose';
  let chunk = [];
  const flush = () => { out[at].push(...bulletsIn(chunk)); chunk = []; };
  for (const l of lines) {
    if (/^###\s/.test(l)) {
      flush();
      const w = weightOf(l);
      if (w) out.sectioned = true;
      at = w || 'loose';
    } else chunk.push(l);
  }
  flush();
  return out;
}

/** The bullets under `## Unreleased` that carry no weight — what the stamp refuses to publish. */
export function unweighed(text) {
  return weighed(unreleased(text).body).loose;
}

/** "**Lead.** Rest of it" → { lead: 'Lead.', rest: 'Rest of it' }. A bullet without a bold lead is all rest. */
export function bulletParts(b) {
  const m = String(b).match(/^\*\*([\s\S]+?)\*\*\s*([\s\S]*)$/);
  return m ? { lead: m[1].trim(), rest: m[2].trim() } : { lead: '', rest: String(b).trim() };
}

/**
 * What a release says to a founder, as markdown paragraphs: its *What you'll notice* bullets when
 * it is weighed, its For-you lines when it predates the headings. Empty = nothing for a founder.
 * The site, the feed and `boss whatsnew` all read this, so the rule exists once.
 */
export function founderFacing(entry) {
  const w = weighed(entry);
  return w.sectioned ? w.notice : forYou(entry);
}

/** What landed after `from`, up to and including `to`: counts a one-line notice can carry. */
export function newsBetween(from, to, text = existsSync(CHANGELOG) ? readFileSync(CHANGELOG, 'utf8') : '') {
  const span = parseEntries(text).filter((e) => cmpVersion(e.version, from) > 0 && cmpVersion(e.version, to) <= 0);
  const count = (k) => span.reduce((n, e) => n + weighed(e)[k].length, 0);
  return {
    releases: span.length,
    notice: span.reduce((n, e) => n + founderFacing(e).length, 0),
    improve: count('improve') + count('loose'),
  };
}

const SEED = WEIGHTS.flatMap((w) => [`### ${w.heading}`, '']);

/** The next minor version after `current` (BOSS releases are 0.N.0). */
export function nextVersion(current) {
  const [a, b] = String(current).trim().split('.').map(Number);
  return `${a}.${b + 1}.0`;
}

/**
 * Rename `## Unreleased` to `## <version> — <date>` and put a fresh empty Unreleased heading above
 * it. Returns the new text, or null when there was nothing to stamp. Pure — the caller writes.
 */
export function stampUnreleased(text, version, date) {
  if (!unreleasedHasContent(text)) return null;
  const lines = text.split(/\r?\n/);
  const i = lines.findIndex((l) => /^##\s+Unreleased\s*$/i.test(l));
  let end = i + 1;
  while (end < lines.length && !/^##\s/.test(lines[end])) end++;
  // A weight heading with nothing under it is dropped from the stamped entry, and the fresh
  // Unreleased gets all three back, so the next writer sees where a bullet goes.
  const body = lines.slice(i + 1, end);
  const kept = [];
  for (let j = 0; j < body.length; j++) {
    if (weightOf(body[j])) {
      let k = j + 1;
      while (k < body.length && !/^###?\s/.test(body[k]) && !body[k].trim()) k++;
      if (k >= body.length || /^###?\s/.test(body[k])) { j = k - 1; continue; }
    }
    kept.push(body[j]);
  }
  lines.splice(i, end - i, '## Unreleased', '', ...SEED, `## ${version} — ${date}`, ...kept);
  return lines.join('\n');
}

/**
 * Add bullets under `## Unreleased`, beneath the weight heading named (opened if missing). Pure.
 * One writer for the CLI's own appends (`boss learn`), so none of them lands a bullet with no weight.
 */
export function addUnreleased(text, bullets, weight = 'improve') {
  const w = WEIGHTS.find((x) => x.key === weight) || WEIGHTS[1];
  const add = bullets.map((b) => `- ${b}`);
  let lines = text.split(/\r?\n/);
  let i = lines.findIndex((l) => /^##\s+Unreleased\s*$/i.test(l));
  if (i < 0) {
    const first = lines.findIndex((l) => /^##\s/.test(l));
    const at = first < 0 ? lines.length : first;
    lines.splice(at, 0, '## Unreleased', '', ...SEED);
    i = at;
  }
  let end = i + 1;
  while (end < lines.length && !/^##\s/.test(lines[end])) end++;
  let h = lines.slice(i + 1, end).findIndex((l) => w.re.test(l));
  if (h < 0) {
    // Open it in its canonical order: before the first weight heading that follows it.
    const after = WEIGHTS.slice(WEIGHTS.indexOf(w) + 1);
    let at = lines.slice(i + 1, end).findIndex((l) => after.some((x) => x.re.test(l)));
    at = at < 0 ? end : i + 1 + at;
    lines.splice(at, 0, `### ${w.heading}`, '');
    end += 2;
    h = at - (i + 1);
  }
  // The end of that heading's section: the next heading of any depth.
  let s = i + 1 + h + 1;
  while (s < end && !/^###?\s/.test(lines[s])) s++;
  let last = s;
  while (last > i + 1 + h + 1 && !lines[last - 1].trim()) last--;
  lines = [...lines.slice(0, last), '', ...add, '', ...lines.slice(s)];
  return lines.join('\n');
}

export function parseEntries(text) {
  const out = [];
  const lines = text.split(/\r?\n/);
  let cur = null;
  for (const line of lines) {
    const m = line.match(/^##\s+(\d+\.\d+\.\d+)\s*(?:[—-]\s*(.*))?$/);
    if (m) {
      if (cur) out.push(cur);
      // Whatever follows the dash was taken as the DATE, unvalidated — so a heading written
      // `## 0.255.0 — the watchlist rots too` rendered its title in the date column, straight-faced.
      // One entry in 257 was shaped that way, and nothing could have told you. Anything that is not
      // a date IS a title, which is both true and more useful: it gives the entry a headline.
      const rest = (m[2] || '').trim();
      const isDate = /^\d{4}-\d{2}-\d{2}$/.test(rest);
      cur = { version: m[1], date: isDate ? rest : '', title: isDate ? '' : rest, body: [] };
    } else if (cur) cur.body.push(line);
  }
  if (cur) out.push(cur);
  return out;
}

// The first bolded lead-in of an entry, as a one-line gist for the compact list.
// TOP-LEVEL bullets only on the first pass: entries nest their sub-findings, and an indented
// bullet is a detail, not the release's point. (v0.150.0 otherwise reported itself as
// "RVW-073 workslop antecedents — ADAPT (narrow)", which is one of its four sub-items.)
// Indented bullets are the fallback, so an entry that only nests still says something.
// Third fallback added v0.256.0: a **bolded lead-in PARAGRAPH**, which is how most entries actually
// open — `**The fourth silent failure in the freshness system.**` is the release's point, and the
// bullets beneath it are the detail. Reading only bullets left **25 of 257 entries rendering as a
// blank row**: a version, a date, and nothing at all, in the one view a founder scans.
// 🔴 AND THE SAME WRAPPING BUG, IN THE SIBLING FUNCTION (v0.256.0). This matched line by line, so a
// bolded lead-in whose `**` closes on the NEXT line never matched at all — and entries open with
// long bold spans, which wrap. That is exactly the bug `gen-site.js` records paying for on the
// For-you block: *"The block is MULTI-LINE. `(.+)$` captured only the first line."* The fix landed
// there and never crossed to here, and the two functions read the same file four lines apart.
// **23 of 257 entries rendered as a blank row** because of it — a version, a date, and nothing.
// Match against the JOINED body so a wrapped span closes.
export function headline(entry) {
  const text = entry.body.join('\n');
  for (const re of [/^-\s+\*\*([\s\S]+?)\*\*/m, /^\s*-\s+\*\*([\s\S]+?)\*\*/m, /^\*\*([\s\S]+?)\*\*/m]) {
    const m = text.match(re);
    if (m) return m[1].replace(/\s+/g, ' ').trim();
  }
  return '';
}

// 🔴 THE RULE THE CHANGELOG STATES ABOUT ITSELF, AND THE SURFACE THAT NEVER APPLIED IT (v0.256.0).
//
// The file's own header: *"The `> **For you:**` line is opt-in, and the bar is high on purpose…
// Everything else (audits, refactors, doc sweeps, internal tooling) gets no line and never reaches
// oyeboss.build/whats-new.html."* `gen-site.js` implements that, with two recorded bug-fixes behind
// it. **This file implemented none of it** — `headline()` returns the first bolded top-level bullet,
// which is an internal engineering finding, and the full-body branch fired whenever exactly one
// entry matched. So a founder ONE RELEASE BEHIND — the commonest case, and the exact person
// `boss whatsnew` is for — got the raw entry: `check:freshness`, `taps_reviewed:`, a watchlist
// filename. **One rule, two surfaces, one of them unread**, which is the same sentence `src/craft.js`
// carries about the provenance leak, on a third surface.
//
// Exported so `gen-site.js` reads THIS instead of its own copy: one implementation, two readers,
// the shape v0.244.0 used for `lib/reentry.js`. The regex is gen-site's, including both fixes it
// paid for — the block is MULTI-LINE (prose wraps) and there can be MORE THAN ONE per release.
export function forYou(entry) {
  const text = Array.isArray(entry.body) ? entry.body.join('\n') : String(entry || '');
  return [...text.matchAll(/^>\s*\*\*For you:\*\*\s*(.+(?:\n>.*)*)/gm)]
    .map((b) => b[1].split(/\r?\n/).map((l) => l.replace(/^>\s?/, '').trim()).join(' ').trim())
    .filter(Boolean);
}

const truncate = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);


// A founder's install can hold an OLDER CHANGELOG than the one in this repo — the file ships
// inside the npm package (package.json `files:`), so every version ever published carries whatever
// citation form it was written with. v0.263.0 removed the link form from the repo's copy; this
// removes it from what a founder READS, which covers the tarballs already in the world.
//
// The distinction is the one docs/IDS.md now names: the bracket form promises you can open it,
// and BOSS's records are gitignored, so for a founder it never resolves. The id itself is kept —
// it is true that a record exists, and provenance is worth reading even when the door is shut.
const plainCitations = (line) => line.replace(/\[\[([A-Z]{3,4}-\d+)\]\]/g, '$1');

// Markdown as a terminal reads it: bold and italic markers dropped, backticks kept (they are commands).
const plain = (t) => plainCitations(String(t)).replace(/\*\*([^*]+)\*\*/g, '$1').replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s.,;:)!?]|$)/g, '$1$2');

function reflow(text, width = 76, indent = '      ') {
  const out = [];
  let line = '';
  for (const w of text.split(/\s+/).filter(Boolean)) {
    if (line && line.length + 1 + w.length > width) { out.push(indent + line); line = w; } else line = line ? `${line} ${w}` : w;
  }
  if (line) out.push(indent + line);
  return out.join('\n');
}

// The weighed reading. Notices print in full while there are few enough to read; past six, each is
// its lead-in, and `--full` has the rest. Newest release first, as everywhere else in this file.
export function printWeighed(entries, all = false) {
  const tag = (e) => (entries.length > 1 ? dim(`  ${e.version}`) : '');
  const pick = (k) => entries.flatMap((e) => weighed(e)[k].concat(k === 'improve' ? weighed(e).loose : []).map((b) => ({ e, ...bulletParts(b) })));
  const notice = pick('notice');
  const improve = pick('improve');
  const internal = pick('internal');
  const span = entries.length > 1 ? `${entries[entries.length - 1].version} → ${entries[0].version}` : entries[0].version;
  console.log(`  ${dim(span)}\n`);
  if (notice.length) {
    console.log(`  ${bold("What you'll notice")}\n`);
    const inFull = all || notice.length <= 6;
    for (const n of notice) {
      console.log(`  ${ok('✦')} ${bold(plain(n.lead || truncate(n.rest, 70)))}${tag(n.e)}`);
      if (inFull && n.lead && n.rest) console.log(reflow(plain(n.rest), 74, '    '));
      if (inFull) console.log('');
    }
    if (!inFull) console.log('');
  } else {
    console.log(`  ${dim('Nothing here changes how you work.')}\n`);
  }
  if (improve.length) {
    console.log(`  ${bold('Smaller improvements')}`);
    const list = all ? improve : improve.slice(0, 12);
    for (const i of list) console.log(`  · ${truncate(plain(i.lead || i.rest), 72)}${tag(i.e)}`);
    if (improve.length > list.length) console.log(`  ${dim(`… +${improve.length - list.length} more`)}`);
    console.log('');
  }
  if (internal.length) console.log(`  ${dim(`Under the hood: ${internal.length} change${internal.length === 1 ? '' : 's'} — --full for them.`)}\n`);
}

export function printChangelog({ since, all = false, full = false, pin = null } = {}) {
  if (!existsSync(CHANGELOG)) {
    console.log(`\n  ${err('✗')} no changelog in this BOSS install (${CHANGELOG}).\n`);
    return 1;
  }
  const entries = parseEntries(readFileSync(CHANGELOG, 'utf8'));
  if (!entries.length) {
    console.log(`\n  ${err('✗')} the changelog is present but has no parseable entries.\n`);
    return 1;
  }

  const installed = bossVersion();
  // Precedence: an explicit --since wins; otherwise the project's pin is the interesting cut.
  const floor = all ? null : (since || pin || null);
  const shown = floor ? entries.filter((e) => cmpVersion(e.version, floor) > 0) : entries;

  console.log(`\n  ${bold('BOSS changelog')}   ${dim(`installed: ${installed}`)}${pin ? dim(`   ·   this project: ${pin}`) : ''}\n`);

  if (floor && !shown.length) {
    // Two very different situations wear the same "nothing to show" face. Say which.
    if (cmpVersion(floor, installed) >= 0) {
      console.log(`  ${ok('✦')} Nothing new — this project is on the installed version (${installed}).\n`);
      console.log(`  ${dim('That only means your INSTALL and your PROJECT agree. To find out whether the')}`);
      console.log(`  ${dim('install itself is behind, update the tool:')}  ${bold('npm i -g oyeboss@latest')}`);
      console.log(`  ${dim('(or')} ${bold('brew upgrade boss')}${dim('), then run this again.')}\n`);
    } else {
      console.log(`  ${warn('⟳')} No entries after ${floor} in this install (${installed}).`);
      console.log(`  ${dim('Your project is pinned ahead of the BOSS you have installed — update the tool.')}\n`);
    }
    return 0;
  }

  // `full` is now the ONLY way to the raw body. It used to also fire on `shown.length === 1`, which
  // meant being one release behind — the commonest reason to run this — dumped the internal entry.
  if (full) {
    for (const e of shown) {
      console.log(`  ${bold(e.version)}${e.date ? dim(`  — ${e.date}`) : ''}`);
      for (const line of e.body) console.log(line ? `  ${plainCitations(line)}` : '');
      console.log('');
    }
  } else {
    // Releases written with weight headings are read by weight, across every release shown: what a
    // founder will notice in full, smaller improvements one line each, the rest as a count. A release
    // from before the headings keeps the old reading below — its For-you line, or its headline.
    const weighedOnes = shown.filter((e) => weighed(e).sectioned);
    const legacy = shown.filter((e) => !weighed(e).sectioned);
    if (weighedOnes.length) printWeighed(weighedOnes, all);
    if (legacy.length === 1 && !weighedOnes.length) {
      // One entry still earns more than a truncated row — but it earns the FOUNDER-FACING half.
      const [e] = legacy;
      console.log(`  ${bold(e.version)}${e.date ? dim(`  — ${e.date}`) : ''}\n`);
      const lines = forYou(e);
      if (lines.length) for (const l of lines) console.log(`  ${plainCitations(l)}\n`);
      else console.log(`  ${dim('Internal release — nothing here changes what you do.')}\n`);
      console.log(`  ${dim('--full for the engineering detail')}`);
    } else if (legacy.length) {
      if (weighedOnes.length) console.log(`  ${bold('Earlier releases')}`);
      const list = legacy.slice(0, all ? legacy.length : 25);
      for (const e of list) {
        // Prefer what the release said TO A FOUNDER; fall back to the first finding only when the
        // release never spoke to one. Truncating an internal bullet was never the right summary.
        const h = forYou(e)[0] || e.title || headline(e);
        console.log(`  ${bold(e.version.padEnd(9))}${dim((e.date || '').padEnd(12))}${h ? truncate(plainCitations(h), 62) : ''}`);
      }
      if (legacy.length > list.length) console.log(`  ${dim(`… +${legacy.length - list.length} older`)}`);
      console.log('');
      console.log(`  ${dim('--full for the entries in detail · --all for the whole history')}`);
    } else {
      console.log(`  ${dim('--full for the entries in detail')}`);
    }
  }

  if (floor && shown.length) {
    console.log(`\n  ${shown.length} release(s) since ${floor}. Run ${bold('/boss-sync')} ${dim('inside Claude')} to review`);
    console.log(`  the diff and bring this project up — it narrates from these entries.\n`);
  }
  return 0;
}

/**
 * What `boss version` prints. A source checkout (a `.git` beside the package) carrying work under
 * `## Unreleased` is running more than the stamped number says, so it says so after the number.
 * The number stays first: callers match `^\d+\.\d+\.\d+` (IDEA-150 A8).
 */
export function versionLine(version, { checkout = false, unreleasedText = '' } = {}) {
  if (!checkout || !unreleasedHasContent(unreleasedText)) return version;
  return `${version} (+ unreleased work — running from a source checkout)`;
}
