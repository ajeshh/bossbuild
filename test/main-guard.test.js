// A script that decides whether it was "invoked directly" by comparing `import.meta.url` to
// `file://${process.argv[1]}` is a no-op on Windows: the URL is `file:///D:/…` and argv is
// `D:\…`, so the main block never runs and the process exits 0 having checked nothing. Three
// release gates shipped that way and passed every Windows run by never running (IDEA-095,
// found by the second-ever matrix run). This holds the door shut.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';

const BAD = /import\.meta\.url\s*===?\s*`file:\/\/\$\{process\.argv\[1\]\}`/;

test('no script guards its main block with a URL-vs-argv string compare', () => {
  const offenders = [];
  for (const dir of ['scripts', 'src', 'bin']) {
    for (const f of readdirSync(join(BOSS_ROOT, dir))) {
      const p = join(BOSS_ROOT, dir, f);
      let text; try { text = readFileSync(p, 'utf8'); } catch { continue; }
      if (BAD.test(text)) offenders.push(`${dir}/${f}`);
    }
  }
  assert.deepEqual(offenders, [], 'use realpathSync(argv[1]) === realpathSync(fileURLToPath(import.meta.url))');
});
