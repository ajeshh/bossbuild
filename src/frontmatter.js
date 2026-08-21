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

// --- the status ladder ----------------------------------------------------------------------
// `docs/IDS.md` declares a CLOSED seven-word vocabulary, and says the status must START with one
// of them — everything after is free-form detail and is encouraged (`shipped (v0.104.0 — the one
// question in /close)` says more than `shipped`).
//
// That rule had three separate implementations (check-backlog.js, records.js, and a fourth reader
// that never got one at all) — the exact drift this module exists to end. `board.js` was the
// reader without one: it compared the WHOLE string, so every well-formed detailed status fell
// through its `=== 'shipped'` test into "Captured". Twelve of BOSS's own cards sat in the raw-idea
// column while being shipped or in build.
export const STATUS_VOCAB = ['seedling', 'exploring', 'ready', 'building', 'shipped', 'deferred', 'dropped'];

// The base word is what the vocabulary governs. Detail after it is never compared — requiring a
// reader to match a parenthetical verbatim makes it fire on prose edits, and a check that cries
// wolf gets switched off.
export function baseStatus(s) {
  return String(s || '').trim().split(/[\s(]/)[0].toLowerCase();
}

// Parked = a DECISION, not a backlog item. `deferred` has a written re-open trigger; `dropped` was
// decided against and kept for the reasoning. Neither is work waiting to be picked up, and showing
// them beside fresh captures is what makes a board unreadable — the founder re-reads a settled
// question every time they look.
export const isParked = (s) => ['deferred', 'dropped'].includes(baseStatus(s));
