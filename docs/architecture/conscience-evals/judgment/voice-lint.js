#!/usr/bin/env node
// voice-lint — the mechanical half of "how BOSS talks" (IDEA-123). REPORT-ONLY: it never fails a gate.
//
// WHY: the conscience's rule is proportionality, not a length (conscience-voicing.md rules 2 + 4:
// minimal by default, more when the stakes need it, no word count). The judge now grades that
// per sentence (regrade.js judgePrompts → stakes / proportion / unneeded_sentences). Three things a
// judge reading ONE nudge cannot see are visible only across a SET, or are plain string facts:
//
//   1. tics         the same phrase in many different cases ("Your call" in 11 of 17 on 2026-09-23).
//                   A hand-back said identically every time stops being heard.
//   2. pointers     more than one skill offered in one nudge — a menu tacked onto the end.
//   3. labels       BOSS's internal vocabulary reaching the founder: record ids, harm-taxonomy axis
//                   names in parentheses, moment/loop/predicate jargon.
//
// Length is reported as a fact (words), never judged here. A long nudge on heavy stakes is fine.
//
//   node voice-lint.js                 every moment's local transcripts (needs the full `nudge`,
//                                      written by regrade-keyless since 2026-09-23)
//   node voice-lint.js <moment>        one moment
//   node voice-lint.js --files a.json b.json   decisions files ([{ id, decision, nudge }])

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const STOP = new Set(('a an the and or but if then so to of in on at for with by from as is are was be it '
  + 'this that these those you your yours i me my we our they their them he she his her its not no do '
  + 'does did have has had can could would should will just more most one two what which who how when '
  + 'there here than into out up about before after now yet also').split(' '));

const words = (t) => String(t).toLowerCase().replace(/['’]/g, '').replace(/[`*_"“”()[\]]/g, ' ').split(/[^a-z0-9/-]+/).filter(Boolean);
const sentences = (t) => String(t).split(/(?<=[.!?])\s+|\n+/).map((x) => x.trim()).filter(Boolean);

// Phrases repeated across DIFFERENT nudges: 3–4 words anywhere, 2 words only where tics live (the
// opening or closing two words of a sentence — "Your call." — since a 2-word pair mid-sentence is
// just English). Skill names are pointers, not tics, so a gram
// containing one is skipped; a gram made only of stopwords is noise. A shorter gram fully contained in a
// reported longer one with the same count is dropped, so "your call" isn't also reported as "call".
export function findTics(nudges, { minShare = 0.25, minCount = 3 } = {}) {
  const fired = nudges.filter((n) => n && n.trim());
  const counts = new Map();
  for (const n of fired) {
    const seen = new Set();
    const add = (g) => {
      if (g.some((x) => x.startsWith('/'))) return;
      if (g.every((x) => STOP.has(x))) return;
      seen.add(g.join(' '));
    };
    for (const sen of sentences(n)) {
      const w = words(sen);
      if (w.length >= 2) { add(w.slice(0, 2)); add(w.slice(-2)); }
      for (let k = 3; k <= 4; k++) for (let i = 0; i + k <= w.length; i++) add(w.slice(i, i + k));
    }
    for (const g of seen) counts.set(g, (counts.get(g) || 0) + 1);
  }
  const floor = Math.max(minCount, Math.ceil(fired.length * minShare));
  let hits = [...counts].filter(([, c]) => c >= floor).sort((a, b) => b[1] - a[1] || b[0].length - a[0].length);
  hits = hits.filter(([g, c]) => !hits.some(([h, d]) => h !== g && d === c && h.includes(g)));
  return hits.map(([phrase, count]) => ({ phrase, count, of: fired.length }));
}

export function skillPointers(nudge) {
  return [...new Set((String(nudge).match(/`\/[a-z][a-z0-9-]*/g) || []).map((s) => s.slice(1)))];
}

const LABELS = [
  { re: /\b(?:IDEA|FEAT|RVW|DEC|EVID|PRAC|EXTR)-\d{3}\b/g, what: 'a record id' },
  { re: /\((?:[^)]*\b(?:axis|manipulation|overreliance|anthropomorphism|emotional[- ]dependence|individual[- ]autonomy)\b[^)]*)\)/gi, what: 'a harm-taxonomy label' },
  { re: /\b(?:drift|caution|capture|focus|coherence)[- ]loop\b|\bpredicate\b|\bbounded read\b|\bjudge[- ]moment\b/gi, what: 'conscience machinery' },
];
export function internalLabels(nudge) {
  const out = [];
  for (const { re, what } of LABELS) {
    re.lastIndex = 0;
    for (const m of String(nudge).matchAll(re)) out.push({ what, text: m[0] });
  }
  return out;
}

export function lint(items) {
  const fired = items.filter((x) => x.decision === 'fires' && x.nudge);
  const per = fired.map((x) => ({
    id: x.id,
    words: words(x.nudge).length,
    stakes: x.stakes || null,
    proportion: x.proportion || null,
    unneeded: x.unneeded_sentences ? x.unneeded_sentences.length : null,
    pointers: skillPointers(x.nudge),
    labels: internalLabels(x.nudge),
  }));
  return { fired: fired.length, per, tics: findTics(fired.map((x) => x.nudge)) };
}

function loadTranscripts(moment) {
  const root = join(__dirname, 'transcripts');
  const moments = moment ? [moment] : (existsSync(root) ? readdirSync(root) : []);
  const items = [];
  let excerptOnly = 0;
  for (const m of moments) {
    const dir = join(root, m);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
      const t = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      if (t.decision === 'fires' && !t.nudge) excerptOnly++;
      items.push({ id: `${m}/${f.replace(/\.json$/, '')}`, ...t });
    }
  }
  return { items, excerptOnly };
}

function report({ fired, per, tics }, excerptOnly = 0) {
  const w = per.map((p) => p.words).sort((a, b) => a - b);
  const mid = w.length ? w[Math.floor(w.length / 2)] : 0;
  console.log(`\n  voice-lint — ${fired} fired nudge(s) · words min/median/max ${w[0] ?? 0}/${mid}/${w[w.length - 1] ?? 0} (a fact, not a verdict)`);
  if (excerptOnly) console.log(`  ⚠ ${excerptOnly} fired transcript(s) hold only an excerpt — re-grade to lint them`);
  const judged = per.filter((p) => p.proportion);
  if (judged.length) {
    const by = (v) => judged.filter((p) => p.proportion === v).length;
    console.log(`  proportion (judged): right ${by('right')} · over ${by('over')} · under ${by('under')}  of ${judged.length}`);
  }
  console.log(`\n  tics — the same phrase across different cases:`);
  if (!tics.length) console.log('    none');
  for (const t of tics.slice(0, 10)) console.log(`    "${t.phrase}"  ${t.count} of ${t.of}`);
  const multi = per.filter((p) => p.pointers.length > 1);
  console.log(`\n  pointers — more than one skill offered: ${multi.length} of ${fired}`);
  for (const p of multi) console.log(`    ${p.id}: ${p.pointers.join(' ')}`);
  const lab = per.filter((p) => p.labels.length);
  console.log(`\n  labels — internal vocabulary reaching the founder: ${lab.length} of ${fired}`);
  for (const p of lab) console.log(`    ${p.id}: ${p.labels.map((l) => `${l.what} "${l.text}"`).join(' · ')}`);
  console.log('\n  Report-only (IDEA-123). Length is never judged here; proportion is the judge\'s call.\n');
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const argv = process.argv.slice(2);
  if (argv[0] === '--files') {
    const items = argv.slice(1).flatMap((f) => JSON.parse(readFileSync(f, 'utf8')));
    report(lint(items));
  } else {
    const { items, excerptOnly } = loadTranscripts(argv[0] || null);
    report(lint(items), excerptOnly);
  }
}
