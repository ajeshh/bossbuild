// src/scaffold.js — copy a stage template into a project and append its marked blocks (CLAUDE.md,
// .gitignore) idempotently, so unlocking a mode adds to what the project and earlier modes wrote and
// never clobbers it. `boss new`, `unlock`, `sync` and `remove` all lay files down through here.

import {
  cpSync, readdirSync, statSync, readFileSync, writeFileSync, existsSync, rmSync, mkdirSync,
} from 'node:fs';
import { join, basename } from 'node:path';
import { execFileSync } from 'node:child_process';
import { STAGES_DIR } from './paths.js';

// A stage template may carry this file. Instead of being copied verbatim, its
// (substituted) contents are APPENDED to the project's CLAUDE.md under an
// idempotent marker — so unlocking a mode adds its working rules without ever
// clobbering rules the project (or earlier modes) already wrote.
const CLAUDE_APPEND = 'claude-append.md';

const TEXT_EXT = new Set([
  '.md', '.json', '.js', '.ts', '.tsx', '.txt', '.yaml', '.yml',
  '.sh', '.toml', '.gitignore', '.css', '.html',
]);

function isTextFile(name) {
  if (name.startsWith('.')) return true; // dotfiles like .gitignore
  const dot = name.lastIndexOf('.');
  return dot >= 0 && TEXT_EXT.has(name.slice(dot));
}

// Compare a scaffolded file against the template it came from.
//
// THE TRAP: a scaffolded file NEVER byte-matches its template — placeholders are substituted at
// write time. Normalising only the template side reports every file as edited; `boss remove`'s
// first run flagged 30 untouched agents as "you edited this", and a flag that fires on everything
// is a flag nobody reads.
//
// THE SECOND TRAP, which the first fix walked straight into: blanking the project NAME by regex
// looks equivalent and isn't. A one-letter project (`boss new a`) turns every letter "a" in both
// files into a sentinel, and the stage-id and mode-word rules that run afterwards then fail to
// match their own patterns — three untouched agents came back as edited. Any short or common name
// (`app`, `api`, `test`) has the same shape of bug, silently.
//
// So: RENDER the template with the real values instead of erasing them. That's exact, and only the
// genuinely unknowable stamps (the scaffold date, the version at write time) get blanked by shape —
// patterns safe to blank because they can't collide with prose the way a name can.
export function sameAsTemplate(projectText, templateText, vars = {}) {
  let rendered = templateText;
  for (const [k, v] of Object.entries(vars)) {
    if (v != null) rendered = rendered.replaceAll(`{{${k}}}`, String(v));
  }
  const norm = (s) => s
    .replace(/\{\{[A-Z_]+\}\}/g, '\u0000')   // any placeholder we weren't given a value for
    .replace(/\d{4}-\d{2}-\d{2}/g, '\u0000')  // the scaffold date
    .replace(/\d+\.\d+\.\d+/g, '\u0000')     // the version stamped at write time
    .replace(/\s+/g, ' ').trim();
  return norm(projectText) === norm(rendered);
}

export function readStageManifest(stageId) {
  const file = join(STAGES_DIR, stageId, 'manifest.json');
  if (!existsSync(file)) {
    throw new Error(`Stage ${stageId} has no manifest.json (not authored yet).`);
  }
  return JSON.parse(readFileSync(file, 'utf8'));
}

function substituteInTree(dir, vars) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      substituteInTree(full, vars);
    } else if (isTextFile(name)) {
      let body = readFileSync(full, 'utf8');
      for (const [k, v] of Object.entries(vars)) {
        body = body.replaceAll(`{{${k}}}`, v);
      }
      writeFileSync(full, body);
    }
  }
}

// Append a marked block to a file, once. Idempotent: keyed by a marker id, so
// re-applying is a no-op. Creates the file from the block if absent. The marker
// is an HTML comment (stripped from Claude's context, kept in the file).
export function appendMarkedBlock(filePath, markerId, body) {
  const startMark = `<!-- boss:${markerId} start -->`;
  const endMark = `<!-- boss:${markerId} end -->`;
  const existing = existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
  if (existing.includes(startMark)) return false; // already applied
  const block = `${startMark}\n${body.trim()}\n${endMark}\n`;
  const sep = existing && !existing.endsWith('\n\n')
    ? (existing.endsWith('\n') ? '\n' : '\n\n')
    : '';
  writeFileSync(filePath, existing + sep + block);
  return true;
}

// Append a stage's claude-append.md block to the project's CLAUDE.md, once.
export function appendClaudeBlock(stageId, targetDir, body) {
  return appendMarkedBlock(join(targetDir, 'CLAUDE.md'), stageId, body);
}

// Split a .gitignore into { comments, patterns } groups, so a rule can be carried across
// WITH the comment that explains it. A blank line ends a group; a comment after a pattern
// starts the next one.
function gitignoreGroups(body) {
  const groups = [];
  let comments = [];
  let patterns = [];
  const flush = () => {
    if (patterns.length) { groups.push({ comments, patterns }); comments = []; patterns = []; }
  };
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    if (line.startsWith('#')) { if (patterns.length) flush(); comments.push(raw.trimEnd()); }
    else patterns.push(line);
  }
  flush();
  return groups;
}

// Merge a stage template's ignore rules into a .gitignore the founder ALREADY has.
//
// WHY IT EXISTS: `boss adopt` copies only files that don't collide, and every already-started
// repo has a .gitignore — so BOSS's ignore rules were skipped in full, silently, on every
// brownfield adopt. The rule that matters is `.boss/brain/relationship.md`: per-person
// conscience state that DEC-001 says never travels to a cofounder. That guarantee was being
// enforced by a file the brownfield path never installed.
//
// WHY NOT appendMarkedBlock: its marker is an HTML comment, and .gitignore has no HTML
// comments — `<!-- boss:adopt start -->` would land as two literal PATTERNS. The comment
// character here is `#`, and gitignore has no INLINE comments either, so every rule stays
// on its own line.
//
// Only rules the founder doesn't already have are added, each with the template comment that
// explains it — those comments are how a founder decides to REMOVE a line rather than obey it.
// Idempotent by marker, like appendMarkedBlock: adopting twice is a no-op. Carrying a LATER
// version's new rules in is `boss sync`'s job, not adopt's.
export function appendGitignoreBlock(stageIds, targetDir) {
  const filePath = join(targetDir, '.gitignore');
  const startMark = '# ── BOSS — what stays on this machine (delete a line to commit that file) ──';
  const endMark = '# ── end BOSS ──';
  const existing = existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
  if (existing.includes(startMark)) return { added: [], applied: false };

  const { out, added } = freshIgnoreGroups(stageIds, existing);
  if (!added.length) return { added: [], applied: false };
  writeIgnoreBlock(filePath, existing, startMark, endMark, out);
  recordIgnoreOffered(targetDir, stageIds);
  return { added, applied: true };
}

// The template rules a .gitignore lacks, grouped with the comments that explain them.
// Exact (trimmed) match. A near-miss — theirs `node_modules`, ours `node_modules/` — adds a
// harmless duplicate rather than guessing at gitignore semantics we'd get subtly wrong.
function freshIgnoreGroups(stageIds, existing, skip = new Set()) {
  const have = new Set(
    existing.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#')),
  );
  const out = [];
  const added = [];
  for (const stageId of stageIds) {
    const src = join(STAGES_DIR, stageId, 'template', '.gitignore');
    if (!existsSync(src)) continue;
    for (const g of gitignoreGroups(readFileSync(src, 'utf8'))) {
      const fresh = g.patterns.filter((p) => !have.has(p) && !skip.has(p));
      if (!fresh.length) continue;       // they have all of it already — drop the comment too
      fresh.forEach((p) => have.add(p)); // a chain can repeat a rule across stages
      if (out.length) out.push('');
      out.push(...g.comments, ...fresh);
      added.push(...fresh);
    }
  }
  return { out, added };
}

function writeIgnoreBlock(filePath, existing, startMark, endMark, lines) {
  const block = `${startMark}\n${lines.join('\n')}\n${endMark}\n`;
  const sep = existing && !existing.endsWith('\n\n')
    ? (existing.endsWith('\n') ? '\n' : '\n\n')
    : '';
  writeFileSync(filePath, existing + sep + block);
}

// Every ignore rule the stage templates ship for these layers — what BOSS has OFFERED a project.
export function templateIgnoreRules(stageIds) {
  const rules = new Set();
  for (const stageId of stageIds) {
    const src = join(STAGES_DIR, stageId, 'template', '.gitignore');
    if (!existsSync(src)) continue;
    for (const g of gitignoreGroups(readFileSync(src, 'utf8'))) g.patterns.forEach((p) => rules.add(p));
  }
  return rules;
}

// Which rules BOSS has already offered this project. The header of every BOSS block says
// "delete a line to commit that file", so a rule BOSS offered and the founder removed is a
// decision — sync must not put it back. Kept beside the provenance ledger, not in it: the
// ledger's keys are file paths, and other readers walk them as files. `null` = no record yet
// (every project from before this file existed).
const OFFERED = ['.boss', 'ignore-offered.json'];
export function readIgnoreOffered(projectDir) {
  const p = join(projectDir, ...OFFERED);
  if (!existsSync(p)) return null;
  try { const v = JSON.parse(readFileSync(p, 'utf8')); return Array.isArray(v) ? new Set(v) : null; } catch { return null; }
}
export function recordIgnoreOffered(projectDir, stageIds) {
  const seen = readIgnoreOffered(projectDir) || new Set();
  templateIgnoreRules(stageIds).forEach((r) => seen.add(r));
  const p = join(projectDir, ...OFFERED);
  mkdirSync(join(projectDir, '.boss'), { recursive: true });
  writeFileSync(p, JSON.stringify([...seen].sort(), null, 2) + '\n');
}

// What `boss sync` adds to an existing project's .gitignore: rules a later BOSS ships that the
// project lacks AND that BOSS never offered before. A project with no record gets every missing
// rule once — each one is listed, and from then on a deleted line stays deleted.
//
// `tracked`: a rule for a folder whose files are ALREADY in git. Ignoring stops new ones; it does
// not take these out of the repository or its history, and saying it did would be the lie that
// matters most here — the rule exists because those files hold other people's words.
export function planIgnoreRules(stageIds, projectDir) {
  const filePath = join(projectDir, '.gitignore');
  const existing = existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
  const { out, added } = freshIgnoreGroups(stageIds, existing, readIgnoreOffered(projectDir) || new Set());
  const tracked = [];
  for (const rule of added) {
    if (/[*?[!]/.test(rule) || !/^[\w.-]+(\/[\w.-]+)*\/?$/.test(rule)) continue; // a plain path: a folder, with or without its slash
    try {
      const files = execFileSync('git', ['ls-files', '--', rule], {
        cwd: projectDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
      }).split('\n').filter(Boolean);
      if (files.length) tracked.push({ rule, count: files.length });
    } catch { /* not a git repo, or no git: nothing can be tracked */ }
  }
  return { rel: '.gitignore', lines: out, added, tracked };
}

export function applyIgnoreRules(projectDir, plan, stageIds, version) {
  if (plan && plan.added.length) {
    const filePath = join(projectDir, '.gitignore');
    const existing = existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
    writeIgnoreBlock(filePath, existing,
      `# ── BOSS ${version} — more that stays on this machine (delete a line to commit that file) ──`,
      '# ── end BOSS ──', plan.lines);
  }
  recordIgnoreOffered(projectDir, stageIds);
}

// Recursive copy-if-absent: copy every template file that doesn't already exist
// in the target, skipping (never clobbering) any the founder already has. The
// non-destructive half of `boss adopt`. Records copied + skipped paths.
function cpSafeTree(srcDir, destDir, copied, skipped, held = new Set()) {
  mkdirSync(destDir, { recursive: true });
  for (const name of readdirSync(srcDir)) {
    const s = join(srcDir, name);
    const d = join(destDir, name);
    if (held.has(s)) continue;   // held back until earned or asked for — not copied at all
    if (statSync(s).isDirectory()) {
      cpSafeTree(s, d, copied, skipped, held);
    } else if (existsSync(d)) {
      skipped.push(d);
    } else {
      cpSync(s, d);
      copied.push(d);
    }
  }
}

// Adopt a stage into an EXISTING repo non-destructively: copy only files that
// don't collide, substitute placeholders in just those (never touch the
// founder's own files), and fold any claude-append.md block into CLAUDE.md.
// Returns { copied, skipped, claudePreexisted, appendedClaude } for reporting.
export function applyStageSafe(stageId, targetDir, vars, { skipSkills = [], skipHooks = null } = {}) {
  const templateDir = join(STAGES_DIR, stageId, 'template');
  if (!existsSync(templateDir)) {
    throw new Error(`Stage ${stageId} has no template/ dir (not authored yet).`);
  }
  const claudePreexisted = existsSync(join(targetDir, 'CLAUDE.md'));
  const copied = [];
  const skipped = [];
  // The same holds `applyStage` keeps for `boss new` / `boss unlock`: earned-gated skills and the
  // opt-in hooks stay off disk until earned or asked for. Adopt used to copy all of them — the
  // one path most founders meet first got every verb and every guard the other path withholds
  // (IDEA-118).
  const hooksHeld = skipHooks ?? (readStageManifest(stageId).optionalHooks || []);
  const held = new Set([
    ...skipSkills.map((n) => join(templateDir, '.claude', 'skills', n)),
    ...hooksHeld.map((n) => join(templateDir, '.claude', 'hooks', `${n}.js`)),
  ]);
  cpSafeTree(templateDir, targetDir, copied, skipped, held);

  // Substitute placeholders only in the files we actually wrote.
  for (const f of copied) {
    if (!isTextFile(basename(f))) continue;   // basename, not a '/'-split: `f` came from join() (IDEA-095)
    let body = readFileSync(f, 'utf8');
    for (const [k, v] of Object.entries(vars)) body = body.replaceAll(`{{${k}}}`, v);
    writeFileSync(f, body);
  }

  // Fold a stray claude-append.md (L1/L2 carry one) into CLAUDE.md, then remove it.
  let appendedClaude = false;
  const stray = join(targetDir, CLAUDE_APPEND);
  if (existsSync(stray)) {
    appendedClaude = appendClaudeBlock(stageId, targetDir, readFileSync(stray, 'utf8'));
    rmSync(stray);
  }
  return { copied, skipped, claudePreexisted, appendedClaude };
}

// Copy a stage's template/ tree into targetDir and fill placeholders.
// Returns { appendedClaude } so callers can report what changed.
export function applyStage(stageId, targetDir, vars, { skipSkills = [], skipHooks = null } = {}) {
  const templateDir = join(STAGES_DIR, stageId, 'template');
  if (!existsSync(templateDir)) {
    throw new Error(`Stage ${stageId} has no template/ dir (not authored yet).`);
  }
  // Skills a rung holds back until earned (src/earned.js) are not copied at all — the slash menu
  // is the host's, and the only way to keep a verb out of it is for the directory not to exist.
  // Opt-in hooks (src/hooks.js) likewise: `boss hooks enable` lays one down when asked. By default
  // every `optionalHooks` entry of the manifest is held; pass [] to copy them (adopt's safe path).
  const hooksHeld = skipHooks ?? (readStageManifest(stageId).optionalHooks || []);
  const held = new Set([
    ...skipSkills.map((n) => join(templateDir, '.claude', 'skills', n)),
    ...hooksHeld.map((n) => join(templateDir, '.claude', 'hooks', `${n}.js`)),
  ]);
  cpSync(templateDir, targetDir, { recursive: true, filter: (src) => !held.has(src) });
  substituteInTree(targetDir, vars);

  // Handle the additive CLAUDE.md block: the file was copied into the project
  // by cpSync; lift it out and fold it into CLAUDE.md instead of leaving it.
  let appendedClaude = false;
  const stray = join(targetDir, CLAUDE_APPEND);
  if (existsSync(stray)) {
    appendedClaude = appendClaudeBlock(stageId, targetDir, readFileSync(stray, 'utf8'));
    rmSync(stray);
  }
  return { appendedClaude };
}
