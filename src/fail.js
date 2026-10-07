// src/fail.js — how a command fails: one line on stderr, or one JSON object under `--json`, and
// exitCode 1. src never calls process.exit(); `bin/boss` is the one place that exits. Moved from
// cli.js (IDEA-160 S0) so a handler can live in its domain module and still fail the same way.

import { basename, sep } from 'node:path';
import { listProjects } from './registry.js';
import { dim, err, shellArg } from './ui.js';

// Set by run() when the caller asked for --json: a failure is then one JSON object on stderr and
// nothing on stdout, so an agent parsing the output gets an error it can read, not prose.
let jsonErrors = false;
export function setJsonErrors(on) { jsonErrors = !!on; }

export function failJson(error, hint) {
  console.error(JSON.stringify(hint ? { error, hint } : { error }));
  process.exitCode = 1;
}

export function fail(msg) {
  if (jsonErrors) return failJson(msg);
  console.error(`  ${err('Error')} ${msg}`);
  process.exitCode = 1;
}

// The most common error BOSS can produce, and it used to be a dead end. Ten commands each said
// `not a BOSS project (no .boss/manifest.json here).` — which names an internal path a
// non-technical founder has never heard of, states a fact, and stops. The overwhelmingly likely
// cause is mundane and recoverable: they ran `boss new demo` and never `cd demo`, or they are one
// directory up from the project they mean. BOSS already knows every project on this machine — it
// keeps a registry and `boss list` reads it — so the recovery was always computable and simply
// never offered. An error that knows the answer and withholds it is the least forgivable kind.
export function failNotAProject() {
  if (jsonErrors) return failJson("this folder isn't a BOSS project.", 'run it inside a project: `boss list` shows where they are; `boss new <name>` or `boss adopt` starts one.');
  console.error(`  ${err('Error')} this folder isn't a BOSS project.`);
  let projects = [];
  try { projects = (listProjects() || []).filter((p) => p && p.path && p.status !== 'retired'); } catch { /* registry optional */ }
  if (projects.length) {
    const here = projects.filter((p) => p.path.startsWith(process.cwd() + sep));
    if (here.length) {
      // The single likeliest case: they are standing one level above the project they mean.
      console.error(dim(`  ${here.length === 1 ? 'It looks like it is' : 'They look like they are'} just below you:`));
      for (const p of here.slice(0, 3)) console.error(`    cd ${shellArg(basename(p.path))}`);
    } else {
      console.error(dim(`  You have ${projects.length} project${projects.length === 1 ? '' : 's'} on this machine — \`boss list\` shows where.`));
    }
  }
  console.error(dim('  Starting something new? `boss new <name>`. Already have a repo? `boss adopt` inside it.'));
  process.exitCode = 1;
}
