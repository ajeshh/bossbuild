// DEC-023 — every part of BOSS in a founder's project can be removed, and the founder's work survives.
//
// WHY THIS EXISTS: DEC-023's falsifier was a sentence — *"remove BOSS from a throwaway project: if
// anything the founder built stops working, the aim isn't kept."* (IDEA-137 · C6.5 turns it into a
// test.) `boss remove` already proves it deletes only what BOSS wrote; nothing proved the founder's
// work still RUNS afterwards. The first run of this test found one thing that didn't: the `/ai-cost`
// call logger BOSS hands the founder's agent appended to `.boss/cost-log.jsonl` with no mkdir and no
// guard, so once `.boss/` left, every logged LLM call in the founder's app threw.
//
// The founder's work here is what BOSS's own skills tell an agent to put in the app, plus the
// ordinary things a founder adds: their own code, their own entry point, their own hook beside BOSS's.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT, STAGES_DIR } from '../src/paths.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

const BIN = join(BOSS_ROOT, 'bin', 'boss');

// The logger exactly as `/ai-cost` hands it over (TypeScript block), with its one type annotation
// dropped so plain Node runs it. If the template changes shape, this extraction fails loudly.
function costLoggerFromTemplate() {
  const md = readFileSync(join(STAGES_DIR, 'L1-mvp', 'template', '.claude', 'skills', 'ai-cost', 'templates', 'cost-logger.md'), 'utf8');
  const ts = md.match(/```typescript\n([\s\S]*?)```/);
  assert.ok(ts, 'the /ai-cost logger template still carries a TypeScript block');
  const js = ts[1].replace(/:\s*Record<[^=]*=/, ' =');
  assert.doesNotMatch(js, /Record</, 'the type annotation was stripped');
  return js;
}

test('DEC-023: after `boss remove --apply`, the founder\'s app, tests and own hook still work', () => {
  const home = project({ keep: '' });
  const env = { ...process.env, NO_COLOR: '1', HOME: home, USERPROFILE: home, BOSS_HOME: join(home, '.bh') };
  const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const boss = (args, cwd) => run('node', [BIN, ...args], cwd);

  boss(['new', 'app', '--yes'], home);
  const dir = join(home, 'app');
  boss(['unlock', 'mvp'], dir);

  // The founder's work.
  mkdirSync(join(dir, 'src', 'lib'), { recursive: true });
  writeFileSync(join(dir, 'src', 'lib', 'ai-cost-logger.mjs'), costLoggerFromTemplate());
  writeFileSync(join(dir, 'src', 'app.mjs'), [
    "import { logCall } from './lib/ai-cost-logger.mjs';",
    "logCall({ feat: 'FEAT-001', model: 'm', inputTokens: 10, outputTokens: 5, userId: 'u1' });",
    "console.log('app ok');",
  ].join('\n') + '\n');
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'app', private: true, type: 'module',
    scripts: { test: 'node src/app.mjs' } }, null, 2) + '\n');
  mkdirSync(join(dir, 'docs', 'ideas'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'ideas', 'IDEA-001-mine.md'), '---\nid: IDEA-001\ntype: idea\n---\n\n# Mine\n');
  // Their own hook, registered next to BOSS's.
  writeFileSync(join(dir, '.claude', 'hooks', 'mine.mjs'), "console.log('mine');\n");
  const settingsPath = join(dir, '.claude', 'settings.json');
  const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
  settings.hooks = settings.hooks || {};
  (settings.hooks.Stop = settings.hooks.Stop || []).push({ hooks: [{ type: 'command', command: 'node "$CLAUDE_PROJECT_DIR/.claude/hooks/mine.mjs"' }] });
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');

  assert.match(run('node', ['src/app.mjs'], dir), /app ok/, 'the founder\'s app runs with BOSS present');

  boss(['remove', '--apply'], dir);
  assert.ok(!existsSync(join(dir, '.boss')), 'BOSS\'s state dir is gone — this is a real removal');

  // 1. Their app and their tests still run.
  let out;
  assert.doesNotThrow(() => { out = run('node', ['src/app.mjs'], dir); },
    'the founder\'s app must not need .boss/ to run — the /ai-cost logger is theirs once installed');
  assert.match(out, /app ok/);

  // 2. Their records and their hook are still there.
  assert.ok(existsSync(join(dir, 'docs', 'ideas', 'IDEA-001-mine.md')), 'their idea survives');
  assert.ok(existsSync(join(dir, '.claude', 'hooks', 'mine.mjs')), 'their hook file survives');

  // 3. Every hook still registered points at a file that exists — Claude Code runs these on every
  //    session, so a dangling one is a project that errors because BOSS left.
  const left = existsSync(settingsPath) ? JSON.parse(readFileSync(settingsPath, 'utf8')) : {};
  const commands = Object.values(left.hooks || {}).flat().flatMap((e) => e.hooks || []).map((h) => h.command || '');
  assert.ok(commands.some((c) => c.includes('mine.mjs')), 'their hook is still registered');
  for (const c of commands) {
    for (const m of c.matchAll(/\$CLAUDE_PROJECT_DIR\/([^"\s]+)/g)) {
      assert.ok(existsSync(join(dir, m[1])), `a hook still registered points at ${m[1]}, which removal deleted`);
    }
  }
});
