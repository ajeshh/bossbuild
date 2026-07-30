// src/frontmatter.js — the one place the CLI parses a doc's `--- ... ---` block.
//
// Finishes the job `ui.js` started (it exists because `dim` was defined byte-identically
// three times). Frontmatter parsing had drifted into FOUR near-identical implementations
// — `board.js#frontmatter`, `modes.js#frontmatterDescription`, `insights.js#createdDate`
// (a bare regex), and the hook lib's `yaml.js#parseFrontmatter` — each subtly different
// about quotes and blank keys (REVIEW-2026-07-28 §D1).
//
// NOT consolidated with `stages/L0-quickstart/template/.claude/hooks/lib/yaml.js`, on
// purpose: that one SHIPS INTO a founder's repo and is read by the hook on every prompt,
// so it must stay self-contained inside the template. Two implementations across a
// package boundary is a deliberate seam; four inside one package was an accident.

// Parse the leading frontmatter block into a flat { key: value } map. Tolerant by design:
// BOSS's docs are hand-editable, so a malformed block yields {} rather than throwing —
// a board that crashes on one bad file is worse than one that skips it.
export function frontmatter(text) {
  const m = String(text).match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    const k = line.slice(0, i).trim();
    if (k) out[k] = line.slice(i + 1).trim();
  }
  return out;
}

// One field, or ''. The shape `modes.js` wanted.
export function field(text, name) {
  return frontmatter(text)[name] || '';
}

// A YYYY-MM-DD date field, or null. Never guesses — an absent or malformed date is
// reported as absent, which is what lets every date-derived signal stay frontmatter-true
// instead of inferring staleness from mtime.
export function dateField(text, name) {
  const v = frontmatter(text)[name] || '';
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
}

// Strip the surrounding quotes a YAML author needs for reserved leading characters
// (`owner: "@handle"` — a bare leading `@` is reserved). Both forms resolve the same.
export function unquote(v) {
  return String(v || '').trim().replace(/^["']|["']$/g, '');
}
