// The machine registry (src/registry.js): what `boss list`, `boss insights` and `boss sync`'s
// portfolio read. Its data-loss half is pinned in silent-damage.test.js; this is the rest of the
// contract, which had no test at all (IDEA-121 tier 4). It runs against a temp BOSS_HOME, so it
// never touches the real one.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const HOME = mkdtempSync(join(tmpdir(), 'boss-registry-'));
let R;
before(async () => {
  process.env.BOSS_HOME = HOME;
  R = await import(`../src/registry.js?home=${Date.now()}`);
});
after(() => { delete process.env.BOSS_HOME; rmSync(HOME, { recursive: true, force: true }); });

test('register is an upsert keyed by path', () => {
  R.registerProject({ name: 'a', path: '/p/a', bossVersion: '0.1.0' });
  R.registerProject({ name: 'a', path: '/p/a', stage: 'L1-mvp' });
  R.registerProject({ name: 'b', path: '/p/b' });
  const a = R.findByPath('/p/a');
  assert.deepEqual([a.name, a.bossVersion, a.stage], ['a', '0.1.0', 'L1-mvp'], 'fields merge, nothing is lost');
  assert.equal(R.listProjects().filter((p) => p.path === '/p/a').length, 1);
});

test('retire is reversible and never deletes; deregister removes and says whether it did', () => {
  R.registerProject({ name: 'c', path: '/p/c' });
  assert.equal(R.retireProject('/p/c', '2026-09-23').status, 'retired');
  const back = R.reviveProject('/p/c');
  assert.equal(back.status, undefined);
  assert.equal(back.retired_on, undefined);
  assert.equal(R.retireProject('/p/nowhere', '2026-09-23'), null);
  assert.equal(R.deregisterProject('/p/c'), true);
  assert.equal(R.deregisterProject('/p/c'), false, 'a second remove is a no-op, not an error');
  assert.equal(R.findByPath('/p/c'), undefined);
});

test('the pin comes from the project\'s manifest; the registry copy is only the fallback', () => {
  const proj = mkdtempSync(join(tmpdir(), 'boss-pin-'));
  try {
    const entry = { path: proj, bossVersion: '0.9.9' };
    assert.equal(R.projectPin(entry), '0.9.9', 'no manifest → the registry copy');
    mkdirSync(join(proj, '.boss'));
    writeFileSync(join(proj, '.boss', 'manifest.json'), '{"bossVersion":"0.2.0"}');
    assert.equal(R.projectPin(entry), '0.2.0', 'the manifest wins');
    writeFileSync(join(proj, '.boss', 'manifest.json'), '{ torn');
    assert.equal(R.readProjectStamp(proj), null, 'an unparseable manifest is not guessed at');
    assert.equal(R.onDisk(entry), true);
  } finally { rmSync(proj, { recursive: true, force: true }); }
  assert.equal(R.onDisk({ path: proj }), false, 'a moved or deleted project reads as gone');
});
