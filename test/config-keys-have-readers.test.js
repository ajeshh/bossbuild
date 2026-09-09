// Every key `boss new` writes into a founder's `.boss/config.json` must be read by something.
//
// WHY THIS FILE EXISTS: two were not, for a long time, and they failed in different ways.
//
//   · `shareUp: false` gated a share-up pipe that was subsequently REFUSED (IDEA-021). It read to
//     a founder as a privacy setting and setting it `true` did nothing. **A pre-set opt-in flag for
//     an unbuilt feature is a consent trap** — flipping it consents to nothing specific, and a
//     future version reading it would inherit an agreement nobody could have understood.
//   · `aiNative` recorded the `--ai` flag, and `adopt`'s own comment claimed `/read-repo` read it
//     back. `/read-repo` never mentioned it.
//
// Both are [[checkers-state-intents-they-dont-enforce]] n=25's flavour — a FIELD nobody reads, which
// is the quietest one, because a missing field gets reported and an unread one is silent.
//
// THE RULE, and it needs no judgment call: a key counts as READ if its name appears somewhere other
// than `src/cli.js` — the file that writes it. A key visible only to its own writer is, by
// definition, talking to nobody. That deliberately counts SHIPPED PROSE as a reader: BOSS's
// architecture is "the model owns the prose, the CLI owns the index", so `/boss` reading `license`
// out of the config is a real read, and a check that only grepped `src/` would have called four
// live keys dead. Grep who READS a field — including the model — before believing it is unread.
//
// ⚠️ STATED LIMIT, because this check would otherwise assert more than it enforces: a name-match
// cannot tell a READ from a MENTION. Re-planting `shareUp` proves it — the key passes the first
// test purely because `insights.js` names it in a COMMENT explaining why it was removed. That is
// why the second test exists and is written as a named assertion rather than left to the general
// rule: the general rule catches a key nobody ever wrote about, and a specific one is needed for a
// key whose own obituary keeps it alive. A tighter check would have to distinguish an identifier
// from prose, which is a parser, and this does not pretend to be one.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  readFileSync, readdirSync, statSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';

const tmp = mkdtempSync(join(tmpdir(), 'boss-cfgkeys-'));
after(() => { try { rmSync(tmp, { recursive: true, force: true }); } catch { /* best effort */ } });

// The keys are read off a REAL scaffold rather than parsed out of `cli.js`. Parsing the writer to
// test the writer is the self-review failure `testing-with-agents` names; a scaffold is ground truth.
// TWO commands write this file, and the first draft of this test only covered one. `boss new` and
// `boss adopt` each carry their own config literal, so a dead key added to `adopt` was invisible —
// caught because the planted-failure check did not fail. That is the same one-tier blindness this
// guard exists to catch, reproduced inside the guard, and it is why the plant test is not optional.
const boss = (args, cwd) => execFileSync('node', [join(BOSS_ROOT, 'bin', 'boss'), ...args], {
  cwd, stdio: 'ignore', env: { ...process.env, HOME: tmp, NO_COLOR: '1' },
});

let cached;
function scaffoldedConfigKeys() {
  if (cached) return cached; // scaffold ONCE — `boss new` refuses to write over an existing dir
  boss(['new', 'cfgkeys'], tmp);
  const keys = new Set(Object.keys(
    JSON.parse(readFileSync(join(tmp, 'cfgkeys', '.boss', 'config.json'), 'utf8')),
  ));

  // ...and the adopt path, on a bare repo, since it writes a DIFFERENT literal.
  const adopted = join(tmp, 'adopted');
  mkdirSync(adopted, { recursive: true });
  writeFileSync(join(adopted, 'package.json'), '{"name":"adopted","version":"1.0.0"}\n');
  boss(['adopt', '--yes'], adopted);
  const cfg = join(adopted, '.boss', 'config.json');
  if (existsSync(cfg)) {
    for (const k of Object.keys(JSON.parse(readFileSync(cfg, 'utf8')))) keys.add(k);
  }

  cached = [...keys];
  return cached;
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|md)$/.test(p)) out.push(p);
  }
  return out;
}

test('every scaffolded config key has a reader outside the file that writes it', () => {
  const keys = scaffoldedConfigKeys();
  assert.ok(keys.length > 0, 'the scaffold wrote no config at all — that is its own bug');

  const readers = [...walk(join(BOSS_ROOT, 'src')), ...walk(join(BOSS_ROOT, 'stages'))]
    .filter((p) => !p.endsWith(join('src', 'cli.js')))
    .map((p) => [p, readFileSync(p, 'utf8')]);

  for (const key of keys) {
    const re = new RegExp(`\\b${key}\\b`);
    const hit = readers.some(([, text]) => re.test(text));
    assert.ok(
      hit,
      `.boss/config.json ships '${key}' and NOTHING reads it — not src/, not a hook, not one `
      + 'shipped skill or agent. Either wire a reader or stop writing the key. A field nobody '
      + 'reads is silent by construction: absent gets reported, unread never does.',
    );
  }
});

// The paired assertion, because the two dead keys were dead for opposite reasons and only one of
// them is a hazard. This one names the hazard so a future author has to argue with it rather than
// re-invent it: a flag that LOOKS like consent, for something that does not exist.
test('no scaffolded config key promises a capability BOSS has refused', () => {
  const keys = scaffoldedConfigKeys();
  assert.equal(
    keys.includes('shareUp'), false,
    'shareUp is back. The share-up pipe is REFUSED (IDEA-021), so the flag gates nothing and reads '
    + 'as a privacy setting a founder can turn on. When a share contract is genuinely built it '
    + 'writes its own key and asks at that moment — a consent flag pre-set years earlier is not consent.',
  );
});
