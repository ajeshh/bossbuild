import {
  cpSync, readdirSync, statSync, readFileSync, writeFileSync, existsSync, rmSync, mkdirSync,
} from 'node:fs';
import { join } from 'node:path';
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
// THE TRAP THIS EXISTS FOR: a scaffolded file NEVER byte-matches its template — placeholders are
// substituted at write time, so `{{PROJECT_NAME}}` is now "myapp" and the dates and versions are
// stamped. Naively normalising only the template side reports every file as edited: `boss remove`'s
// first run flagged 30 untouched agents as "you edited this" when the founder had changed exactly
// one. A flag that fires on everything is a flag nobody reads, which is how BOSS's last three
// checkers died — so blank the substituted SHAPES on both sides rather than guessing values.
export function sameAsTemplate(projectText, templateText, projectName) {
  const norm = (s) => s
    .replace(/\{\{[A-Z_]+\}\}/g, '\u0000')          // unsubstituted placeholder
    .replace(/\d{4}-\d{2}-\d{2}/g, '\u0000')         // any stamped date
    .replace(/\d+\.\d+\.\d+/g, '\u0000')            // any stamped version
    .replace(projectName ? new RegExp(projectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g') : /$^/g, '\u0000')
    .replace(/L\d-[a-z]+/g, '\u0000')                // stage id
    .replace(/\b(Quickstart|MVP|V1|Scale)\b/g, '\u0000') // mode word
    .replace(/\s+/g, ' ').trim();
  return norm(projectText) === norm(templateText);
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

// Recursive copy-if-absent: copy every template file that doesn't already exist
// in the target, skipping (never clobbering) any the founder already has. The
// non-destructive half of `boss adopt`. Records copied + skipped paths.
function cpSafeTree(srcDir, destDir, copied, skipped) {
  mkdirSync(destDir, { recursive: true });
  for (const name of readdirSync(srcDir)) {
    const s = join(srcDir, name);
    const d = join(destDir, name);
    if (statSync(s).isDirectory()) {
      cpSafeTree(s, d, copied, skipped);
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
export function applyStageSafe(stageId, targetDir, vars) {
  const templateDir = join(STAGES_DIR, stageId, 'template');
  if (!existsSync(templateDir)) {
    throw new Error(`Stage ${stageId} has no template/ dir (not authored yet).`);
  }
  const claudePreexisted = existsSync(join(targetDir, 'CLAUDE.md'));
  const copied = [];
  const skipped = [];
  cpSafeTree(templateDir, targetDir, copied, skipped);

  // Substitute placeholders only in the files we actually wrote.
  for (const f of copied) {
    if (!isTextFile(f.slice(f.lastIndexOf('/') + 1))) continue;
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
export function applyStage(stageId, targetDir, vars) {
  const templateDir = join(STAGES_DIR, stageId, 'template');
  if (!existsSync(templateDir)) {
    throw new Error(`Stage ${stageId} has no template/ dir (not authored yet).`);
  }
  cpSync(templateDir, targetDir, { recursive: true });
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
