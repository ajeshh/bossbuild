// src/args.js — the one flag parser.
//
// Its own module rather than an export from `cli.js`: brain.js needs it, and importing it
// from cli.js would make cli → brain → cli a genuine cycle that only survives on function
// hoisting. Small shared utilities belong at the leaves (the `ui.js` pattern).
//
// Deliberately minimal — BOSS has no flag library and doesn't want one (PRINCIPLE #4).
// `--flag value` takes the value; `--flag` alone is `true`; everything else is a positional.

export function parseArgs(args) {
  const out = { _: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = args[i + 1];
      // A trailing valueless flag is `true`, never `undefined` — brain.js's hand-rolled
      // copy got this wrong, so `boss brain forget --before` silently became
      // `{ before: undefined }` and fell through to a confusing error.
      if (next !== undefined && !next.startsWith('--')) { out[key] = next; i++; }
      else out[key] = true;
    } else {
      out._.push(a);
    }
  }
  return out;
}

// Every flag some command reads. `run()` refuses one that is in no command's vocabulary (a typo:
// `boss board --nxt` used to print the whole board and exit 0), naming the nearest real flag.
// Per-command lists would be stricter, but twelve real flags appear in no help text, so a strict
// list would break working calls. test/cli-craft.test.js holds this set to every flag help
// documents and every flag a shipped skill passes. A new flag goes here too.
export const KNOWN_FLAGS = new Set([
  'ai', 'all', 'apply', 'as', 'before', 'blocked', 'conscience', 'days', 'detail', 'diff', 'file', 'for',
  'force', 'full', 'gists', 'global', 'headline', 'help', 'html', 'id', 'json', 'keep-mine', 'kind',
  'line', 'markdown', 'md', 'mine', 'minors', 'mode', 'next', 'note', 'off', 'open', 'outline', 'program', 'programs',
  'prose', 'prune', 'questions', 'quiet', 'reason', 'relationship', 'remove', 'shape', 'since', 'surface',
  'timeline', 'title', 'undo', 'until-resume', 'v', 'verbose', 'version', 'what', 'yes',
]);
