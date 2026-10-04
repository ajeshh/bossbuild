#!/usr/bin/env node
// BOSS design-decisions-guard — a PostToolUse hook (OPT-IN). The product's own decisions, at the write.
//
// WHY IT EXISTS: a design system is a set of decisions, and the page (`boss design`) shows them so
// the team and the agents build from them instead of drifting. A page is a filter — it works when
// someone opens it. This is the boundary: at the moment a component-shaped write touches a
// situation the product already decided, hand the agent THAT decision, three lines, and nothing
// else. Never a seed, never a catalogue, never BOSS's own opinion — only what this product wrote.
//
// WHAT IT READS — three places a decision lives:
//   - `docs/design/PATTERNS.md` · the **Ours** table: `PAT-n` rows the product grew (id · pattern ·
//     situation · rule · anti-pattern). Seeded rows (Always, the families) are prompts and are
//     NOT read here — a prompt in the agent's ear is a pattern library by the back door.
//   - `docs/design/STYLE_GUIDE.md` · the **Do / Don't** table: the rule rung, as pairs.
//   - `docs/design/STYLE_GUIDE.md` · the **Exceptions** table: a departure recorded at a path is a
//     decision the next edit to that path should know about.
//   - `docs/design/components/<Name>.md` · the **Composition** section's *Never inside* / *Never
//     holds* lines (IDEA-132): a nesting the product ruled out, with its reason after a dash.
//     *Inside* and *Holds* are for people and are not read; placeholders are not read.
//
// A NESTING matches when the added text opens both tags (`<Card` and `<Card`, `<Button` and `<Link`).
// Co-occurrence, not a parse: two siblings in one write get the reminder too, and a reminder of a
// rule the product wrote costs one line.
//
// HOW IT MATCHES, and why it is deliberately crude: a decision's situation is a few words
// ("a shift needs cover", "delete, revoke, cancel"). Two or more of its content words (five letters
// or longer) in the text this write ADDED means the write is in that situation. It will miss some
// and it will never invent one — a missed reminder costs nothing, an invented rule costs trust.
//
// ONCE PER FILE PER DECISION: `.boss/decisions-guard.json` remembers what it has said about which
// file, so editing a dialog for an hour hears the dialog rule once. Delete the file to hear it all
// again.
//
// THE TRACE: every fire appends one line to `.boss/trace.jsonl` — { kind: "design-decision", file,
// ids } — the substrate the divergence number reads (IDEA-113). Local, append-only, never sent.
//
// THE JIT GATE: no `PATTERNS.md` with an Ours row and no Do/Don't pair means no opinion. A founder
// with no decisions yet is not doing anything wrong.
//
// TO TURN IT ON — add to .claude/settings.json (same block as design-tokens-guard; both can share it):
//   "hooks": { "PostToolUse": [ { "matcher": "Edit|Write|MultiEdit",
//     "hooks": [ { "type": "command",
//                  "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/design-decisions-guard.js\"",
//                  "timeout": 5 } ] } ] }
//
// Fail-open: any surprise exits 0 silently. A missed reminder is fine; a broken session is not.

import { readFileSync, existsSync, writeFileSync, appendFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const PATTERNS_REL = join('docs', 'design', 'PATTERNS.md');
const GUIDE_REL = join('docs', 'design', 'STYLE_GUIDE.md');
const USAGE_REL = join('docs', 'design', 'components');
const STATE_REL = join('.boss', 'decisions-guard.json');
const TRACE_REL = join('.boss', 'trace.jsonl');
const UI_EXT = /\.(tsx|jsx|vue|svelte|astro|html|swift|kt|dart|erb|njk|hbs)$/i;
const SKIP_PATH = /(^|[\\/])(node_modules|dist|build|\.next|coverage)[\\/]|\.(test|spec|stories|story)\./i;
const MAX_LINES = 3;

const out = (additionalContext) => {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext } }));
  process.exit(0);
};
const addedText = (input) => {
  if (typeof input.content === 'string') return input.content;
  if (typeof input.new_string === 'string') return input.new_string;
  if (Array.isArray(input.edits)) return input.edits.map((e) => e.new_string || '').join('\n');
  return '';
};
const clean = (c) => String(c || '').replace(/\*\*/g, '').replace(/`/g, '').trim();
const cells = (l) => l.split('|').slice(1, -1).map((c) => c.trim());
const contentWords = (s) => [...new Set(clean(s).toLowerCase().match(/[a-z][a-z-]{4,}/g) || [])].filter((w) => !STOP.has(w));
const STOP = new Set(['about', 'their', 'there', 'these', 'those', 'which', 'where', 'while', 'never', 'always', 'every', 'other', 'after', 'before', 'being', 'would', 'should', 'could', 'thing', 'things', 'screen', 'product', 'component', 'button']);

// Tables under a heading, generically — the same read `boss design` does.
function tables(text) {
  const lines = text.split(/\r?\n/); const outT = []; let heading = '';
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^#{1,4}\s+(.+)$/); if (h) { heading = h[1].trim(); continue; }
    if (/^\|/.test(lines[i]) && /^\|\s*:?-{2,}/.test(lines[i + 1] || '')) {
      const header = cells(lines[i]).map((c) => c.toLowerCase()); const rows = []; let j = i + 2;
      while (j < lines.length && /^\|/.test(lines[j])) { rows.push(cells(lines[j])); j++; }
      outT.push({ heading, header, rows, col: (re) => header.findIndex((c) => re.test(c)) }); i = j - 1;
    }
  }
  return outT;
}

let event;
try { event = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { process.exit(0); }
try {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd();
  const input = event.tool_input || {};
  const path = input.file_path || '';
  if (!path || SKIP_PATH.test(path) || !UI_EXT.test(path)) process.exit(0);
  // `/` always: decisions and exceptions name paths with `/`, and the trace is read on every OS.
  const rel = (path.startsWith(projectDir) ? path.slice(projectDir.length + 1) : path).replace(/\\/g, '/');
  const added = addedText(input);
  if (!added.trim()) process.exit(0);
  const lower = added.toLowerCase();

  // --- The decisions this product made. --------------------------------------------------------
  const decisions = []; // { id, say }
  const patternsPath = join(projectDir, PATTERNS_REL);
  if (existsSync(patternsPath)) {
    for (const t of tables(readFileSync(patternsPath, 'utf8'))) {
      const iId = t.col(/^id$/), iP = t.col(/^pattern/), iS = t.col(/situation/), iR = t.col(/rule/), iA = t.col(/anti/);
      if (iId < 0 || iP < 0) continue; // only Ours carries ids — seeded tables are prompts, not decisions
      for (const r of t.rows) {
        const id = clean(r[iId]), pattern = clean(r[iP]);
        if (!/^PAT-\d+$/i.test(id) || !pattern || /lands here/i.test(pattern)) continue;
        const words = contentWords(`${pattern} ${r[iS] || ''}`);
        const hits = words.filter((w) => lower.includes(w));
        if (hits.length >= 2) decisions.push({ id, say: `**${id} — ${pattern}.** ${clean(r[iR])}${r[iA] ? ` Not: ${clean(r[iA])}.` : ''}` });
      }
    }
  }
  const guidePath = join(projectDir, GUIDE_REL);
  if (existsSync(guidePath)) {
    const ts = tables(readFileSync(guidePath, 'utf8'));
    let n = 0;
    for (const t of ts) {
      const iD = t.col(/^do$/), iN = t.col(/^don'?t$/), iB = t.col(/because/);
      if (iD < 0 || iN < 0) continue;
      for (const r of t.rows) {
        n++;
        const doTxt = clean(r[iD]), dont = clean(r[iN]);
        if (!doTxt || /^<.*>$/.test(doTxt) || /^<.*>$/.test(dont)) continue;
        const hits = contentWords(`${doTxt} ${dont}`).filter((w) => lower.includes(w));
        if (hits.length >= 2) decisions.push({ id: `dodont-${n}`, say: `**Do / Don't.** Do: ${doTxt}. Don't: ${dont}.${iB >= 0 && clean(r[iB]) ? ` Because ${clean(r[iB])}.` : ''}` });
      }
    }
    for (const t of ts) {
      if (!/exception/i.test(t.heading) || t.col(/^date/) < 0) continue;
      const iW = t.col(/^where/), iWhat = t.col(/^what/), iY = t.col(/^why/), iDt = t.col(/^date/);
      for (const r of t.rows) {
        const where = clean(r[iW]); if (!where || /^<.*>$/.test(where)) continue;
        const leaf = rel.split(/[\\/]/).pop().replace(/\.[a-z]+$/i, '');
        if (rel.toLowerCase().includes(where.toLowerCase()) || (leaf && where.toLowerCase().includes(leaf.toLowerCase()))) decisions.push({ id: `exception-${clean(r[iDt]) || where}`, say: `**An exception is recorded here** (${clean(r[iDt]) || 'undated'} · ${where}): ${clean(r[iWhat])}${iY >= 0 && clean(r[iY]) ? ` — ${clean(r[iY])}` : ''}. A third of the same kind means the rule is wrong, not the screen.` });
      }
    }
  }
  // --- The nestings it ruled out: a usage page's Never lines (IDEA-132). ----------------------------
  const usageDir = join(projectDir, USAGE_REL);
  if (existsSync(usageDir)) {
    const opens = (n, times = 1) => (added.match(new RegExp(`<${n.replace(/\./g, '\\.')}(?=[\\s/>.])`, 'g')) || []).length >= times;
    for (const f of readdirSync(usageDir).filter((x) => /\.md$/i.test(x) && !/^README/i.test(x)).sort()) {
      let text = ''; try { text = readFileSync(join(usageDir, f), 'utf8'); } catch { continue; }
      const name = clean((text.match(/^component:\s*(\S+)/m) || [])[1]) || f.replace(/\.md$/i, '');
      const sec = text.split(/^##\s+/m).find((x) => /^composition\b/i.test(x));
      if (!sec || !opens(name)) continue;
      for (const line of sec.split(/\r?\n/)) {
        const m = clean(line).match(/^[-*]\s+never (inside|holds):?\s*(.+)$/i);
        if (!m || m[2].startsWith('<')) continue;
        const [list, ...why] = m[2].split(/\s+[—–-]\s+/);
        for (const other of list.split(/[,·]/).map((x) => x.trim()).filter((x) => /^[A-Z][\w.]*$/.test(x))) {
          if (!opens(other, other === name ? 2 : 1)) continue; // Card in Card needs two Cards
          const [outer, inner] = /inside/i.test(m[1]) ? [other, name] : [name, other];
          decisions.push({ id: `nest-${outer}>${inner}`, say: `**${inner} never goes inside ${outer}**${why.length ? ` — ${why.join(' — ')}` : ''} (docs/design/components/${f}).` });
        }
      }
    }
  }
  const seen = new Set();
  for (let i = decisions.length - 1; i >= 0; i--) if (seen.has(decisions[i].id)) decisions.splice(i, 1); else seen.add(decisions[i].id);
  if (!decisions.length) process.exit(0);

  // --- Once per file per decision. --------------------------------------------------------------
  const statePath = join(projectDir, STATE_REL);
  let state = {};
  try { state = JSON.parse(readFileSync(statePath, 'utf8')); } catch { state = {}; }
  const said = new Set(state[rel] || []);
  const fresh = decisions.filter((d) => !said.has(d.id)).slice(0, MAX_LINES);
  if (!fresh.length) process.exit(0);
  state[rel] = [...said, ...fresh.map((d) => d.id)];
  try { mkdirSync(dirname(statePath), { recursive: true }); writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n'); } catch { /* memory is a courtesy */ }
  try { appendFileSync(join(projectDir, TRACE_REL), JSON.stringify({ ts: new Date().toISOString(), kind: 'design-decision', file: rel, ids: fresh.map((d) => d.id) }) + '\n'); } catch { /* the trace is optional */ }

  out(`design-decisions-guard: this write is in a situation the product already decided.\n` + fresh.map((d) => `- ${d.say}`).join('\n') + `\n(Your own decisions — \`${PATTERNS_REL}\` Ours, \`${GUIDE_REL}\` and the usage pages; \`boss design\` shows them. Follow, widen, or record an exception — never quietly diverge.)`);
} catch {
  process.exit(0); // fail-open
}
