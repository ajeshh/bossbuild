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
