// BOSS · flows — do the two ends of every declared flow still name the same file?
// Called by check-refs.js (class 7) and by test/flows.test.js. IDEA-137 · C2; docs/ECOSYSTEMS.md.
//
// WHY THIS EXISTS: IDEA-137's inventory found six broken flows between BOSS's ecosystems, and all six
// were the same shape — one end of a hand-off changed and the other didn't notice. /canvas moved its
// output to IDEA-NNN-canvas.md and seven readers kept opening CANVAS.md. At V1 the component index
// moved to manifest.json and component-reuse-guard kept reading the old file, found no rows, and fell
// silent — the reuse check stopped exactly when a project scaled. /spec's own step 0 looked for specs
// where /spec never writes them. And the ladder ledger declared outputs six skills don't produce, so
// `boss` believed a founder had no canvas or spec when they did. Each was found by reading, by hand;
// none could be seen by a check, because nothing said which file read which.
//
// THE RULE: a take is satisfied only when BOTH ends name the same path — the giver on a line that
// writes it, the reader on a line that doesn't. A path match alone is not enough: /canvas's own step 0
// names the old CANVAS.md while LOOKING for one, so "the giver mentions it" would have passed the very
// break this exists to catch. Writing is told from reading by the verb on the line (or the line
// before, since prose wraps). That is a heuristic and it says so: a giver that writes a path without a
// write verb near it reads as a finding, and the fix is to say "write" — which is also clearer prose.
//
// It reads only what is declared (registry/flows.json) and the ladder ledger. It never crawls a
// founder's files and never reads authors — paths, never people (docs/ECOSYSTEMS.md, the humane review).
//
// Zero-dep by rule.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const WRITE = /\b(creat|writ|seed|generat|scaffold|plant|emit|sav(e|es|ing)\b|append|replac|fill|declar|produc|copy|copies|stamp)\w*/i;
// A read cue wins on its own line: "If `JOURNEY.md` exists, read it before designing anything" is a
// read even though "designing" is near a write-ish word somewhere else on the line.
const READ = /\b(read|reads|look|looks|open|opens|check|checks|consult|scan|find|exists?|before (you )?(make|making|creat))\b/i;

// `docs/ideas/IDEA-NNN-<slug>.md` and `{{today}}` are prose placeholders — they match anything a glob's
// `*` would. Sampled to a concrete value so one glob test covers both prose and globbed forms.
const sample = (t) => t
  .replace(/\{\{[^}]*\}\}/g, 'x').replace(/<[^>]*>/g, 'x').replace(/NNN/g, '001')
  .replace(/\*\*/g, 'x/x').replace(/\*/g, 'x');

export const globRe = (g) => new RegExp('^' + g.split('**').map((part) =>
  part.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*')).join('.*') + '$');

// A path-shaped token: has a slash or a dotted filename. Bounded by the usual prose delimiters.
const TOKEN = /[A-Za-z0-9_.{}<>*$@-]+(?:\/[A-Za-z0-9_.{}<>*@+-]+)*\.[A-Za-z0-9]+|[A-Za-z0-9_.{}<>*@-]+(?:\/[A-Za-z0-9_.{}<>*@+-]+)+\/?/g;

// Code names paths as join('docs', 'design', 'X.md') more often than as a string; fold those to
// the slash form before tokenising so a hook and a skill are read the same way.
const foldJoins = (text) => text.replace(/join\(\s*(?:[A-Za-z_]\w*\s*,\s*)?((?:'[^']*'|"[^"]*")(?:\s*,\s*(?:'[^']*'|"[^"]*"))*)\s*\)/g,
  (_, args) => args.split(',').map((a) => a.trim().slice(1, -1)).join('/'));

// Does this token stand for `path`? Full match — or, for a path with no wildcard, the token is
// exactly its filename (prose names `manifest.json` under a directory tree it drew once). A bare
// pattern like `FEAT-NNN-<slug>.md` never matches a directory it doesn't name: that looseness let
// /spec's own wrong step-0 path pass on the first run.
const matches = (token, path) => {
  const re = globRe(path);
  const s = sample(token.replace(/[/.]+$/, ''));
  if (re.test(s) || re.test(s + '/x')) return true;
  return !path.includes('*') && !token.includes('/') && basename(path) === token;
};

// Every place naming `path`, tagged by what its SENTENCE does with it. The unit is the sentence, not
// the line: prose wraps mid-sentence, and a line can end one sentence and start another — /onboard's
// "…that replaces it. If `docs/onboarding.md` exists, that is the thing to edit" read as a write when
// the line was the unit, and hid the ladder's wrong path. Write: a write verb in the sentence. Read: a
// read cue, or no write verb. Inside a fenced block a path counts both ways — skills draw what they
// create as a file tree, and a tree has no sentences. Under an `## Output` heading every path is a
// write: that heading is how a skill declares what it leaves behind (/money: "One short
// `docs/money/MONEY-<date>.md`." — no verb, and no doubt).
export function mentions(text, path) {
  const lines = foldJoins(text).split(/\r?\n/);
  const out = [];
  let fenced = false;
  let output = false;   // inside an `## Output` section
  let para = [];   // [lineNo, text] of the current paragraph
  const flush = () => {
    if (!para.length) return;
    const body = para.map(([, t]) => t).join('\n');
    const starts = [];
    let at = 0;
    for (const [n, t] of para) { starts.push([at, n]); at += t.length + 1; }
    const lineOf = (off) => { let n = para[0][0]; for (const [a, ln] of starts) if (a <= off) n = ln; return n; };
    const seen = new Set();
    for (const m of body.matchAll(TOKEN)) {
      if (!matches(m[0], path)) continue;
      const before = body.slice(0, m.index);
      const cut = Math.max(before.search(/[.!?:;][^.!?:;]*$/) , -1);
      const from = cut < 0 ? 0 : cut + 1;
      const after = body.slice(m.index + m[0].length);
      const end = after.search(/[.!?;](\s|$)/);
      const sentence = body.slice(from, m.index + m[0].length + (end < 0 ? after.length : end));
      const line = lineOf(m.index);
      if (seen.has(line)) continue;
      seen.add(line);
      const w = output || WRITE.test(sentence.replace(m[0], ' '));
      out.push({ line, write: w, read: READ.test(sentence) || !w });
    }
    para = [];
  };
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) {
      flush();
      fenced = !fenced;
      return;
    }
    if (fenced) {
      for (const m of line.matchAll(TOKEN)) {
        if (matches(m[0], path)) { out.push({ line: i + 1, write: true, read: true }); break; }
      }
      return;
    }
    if (/^\s*$/.test(line) || /^\s*(#|\||[-*] |\d+\. )/.test(line)) flush();
    const h = line.match(/^\s*#{1,6}\s+(.*)$/);
    if (h) output = /^(outputs?|what it (writes|leaves)|writes|produces)\b/i.test(h[1].trim());
    if (!/^\s*$/.test(line)) para.push([i + 1, line]);
  });
  flush();
  return out;
}

const filesUnder = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) filesUnder(p, out); else out.push(p);
  }
  return out;
};

// A giving skill is its whole directory — SKILL.md plus its templates — wherever it ships.
export function skillDir(root, name) {
  const stages = join(root, 'stages');
  if (!existsSync(stages)) return null;
  for (const st of readdirSync(stages).sort()) {
    const d = join(stages, st, 'template', '.claude', 'skills', name);
    if (existsSync(d)) return d;
  }
  return null;
}

const readAll = (root, name) => {
  const d = skillDir(root, name);
  if (!d) return null;
  return filesUnder(d).filter((f) => /\.(md|json|js|txt)$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n');
};

// Does this text point at `path` at all — the looser question a succession asks? A broader glob counts
// (`docs/ideas/*-canvas.md` covers `IDEA-*-canvas.md`), so does a bare filename, and so does code that
// finds the file by its glob's literal tail (`/-canvas\.md$/`). All eleven of the first run's false
// alarms were one of those three.
function follows(text, path) {
  if (mentions(text, path).length) return true;
  const target = sample(path);
  const base = basename(target);
  for (const m of foldJoins(text).matchAll(TOKEN)) {
    const t = m[0].replace(/[/.]+$/, '').replace(/\{\{[^}]*\}\}|<[^>]*>|NNN/g, '*');
    const re = globRe(t);
    if (re.test(target) || (!t.includes('/') && re.test(base))) return true;
  }
  if (!path.includes('*')) return false;
  const tail = basename(path).split('*').pop();
  return tail.length > 4 && (text.includes(tail) || text.includes(tail.replace(/\./g, '\\.')));
}

// Everything that ships or runs: stage templates, the practices, the CLI. rel path → text.
function shippedText(root) {
  const out = new Map();
  const roots = [join(root, 'library', 'practices'), join(root, 'src')];
  const stages = join(root, 'stages');
  if (existsSync(stages)) for (const st of readdirSync(stages)) roots.push(join(stages, st, 'template'));
  for (const d of roots) {
    if (!existsSync(d)) continue;
    for (const f of filesUnder(d)) {
      if (/\.(md|json|js|txt)$/.test(f)) out.set(f.slice(root.length + 1).split('\\').join('/'), readFileSync(f, 'utf8'));
    }
  }
  return out;
}

// Returns [file, message] pairs — the check-refs findings shape.
export function checkFlows(root, ledger, ladder = {}) {
  const findings = [];
  const giverText = new Map();
  const giver = (name) => {
    if (!giverText.has(name)) giverText.set(name, readAll(root, name));
    return giverText.get(name);
  };

  for (const t of ledger.takes || []) {
    const readerFile = join(root, t.reader);
    if (!existsSync(readerFile)) { findings.push([t.reader, `declared reader does not exist (takes ${t.path} from /${t.from})`]); continue; }
    const g = giver(t.from);
    if (g == null) { findings.push([t.reader, `takes ${t.path} from /${t.from}, and no skill /${t.from} ships`]); continue; }
    if (!mentions(g, t.path).some((m) => m.write)) {
      findings.push([t.reader, `takes ${t.path} from /${t.from}, but /${t.from} never writes it — the giver moved, or never wrote this path`]);
    }
    const read = mentions(readFileSync(readerFile, 'utf8'), t.path).filter((m) => m.read);
    if (!read.length) {
      findings.push([t.reader, `should read ${t.path} (what /${t.from} writes) and never names it — this reader looks somewhere else`]);
    }
  }

  // A succession binds EVERY shipped reader of the old path, declared or not (IDEA-137 · C6.4, M12:
  // a pioneer names its successor and its readers follow). Declared-only would have passed B1.2 —
  // seven readers of CANVAS.md that no ledger listed. A file that names both paths is following
  // (the hedged "an older project's CANVAS.md still counts" is the right shape). `pointer: true` means
  // the old file stays behind as a one-line pointer to the new — a person or an agent reading it is
  // sent on, so only CODE that parses it goes blind (B1.1's guard), and only code is bound.
  const shipped = shippedText(root);
  for (const s of ledger.successions || []) {
    const newReaders = new Set((ledger.takes || []).filter((t) => t.path === s.new).map((t) => t.reader));
    // Declared readers of the old path must declare the new one too; undeclared ones must name it.
    const blind = new Set((ledger.takes || []).filter((t) => t.path === s.old && !newReaders.has(t.reader)).map((t) => t.reader));
    for (const [rel, text] of shipped) {
      if (s.pointer && !rel.endsWith('.js')) continue;
      if (mentions(text, s.old).some((m) => m.read) && !follows(text, s.new)) blind.add(rel);
    }
    for (const r of blind) {
      findings.push([r, `reads ${s.old}, which /${s.by} replaces with ${s.new} at ${s.at} — this reader doesn't follow, so it goes blind there`]);
    }
  }

  // The ladder's own declarations: `boss` decides a capability is "already built" from these
  // patterns, so at least one of them must match a path the capability actually writes.
  const stackBound = ledger.ladder_stack_bound || {};
  for (const [name, entry] of Object.entries(ladder)) {
    const files = entry?.produces?.files;
    if (!files?.length || stackBound[name]) continue;
    const g = giver(name);
    if (g == null) continue;
    const written = files.some((f) => mentions(g, f).some((m) => m.write));
    if (!written) findings.push([`registry/surface-ladder.json`, `${name}: none of its "produces" patterns is a path /${name} writes — \`boss\` can't see what it built`]);
  }
  return findings;
}
