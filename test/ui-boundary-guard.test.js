// ui-boundary-guard — the boundary under "imports flow one way" (ui/ → features/ → app/).
//
// As with every guard BOSS ships, the load-bearing behavior is the SILENCE: no layered layout, no
// opinion; a package import is not a boundary; a downward import is the whole point. It speaks only
// when a write ADDS an import that points up or sideways into another feature's internals.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';

after(cleanup);

const HOOK = join(process.cwd(), 'stages', 'L1-mvp', 'template', '.claude', 'hooks', 'ui-boundary-guard.js');

function run(dir, toolInput, toolName = 'Write') {
  const stdout = execFileSync('node', [HOOK], {
    input: JSON.stringify({ cwd: dir, tool_name: toolName, tool_input: toolInput }),
    encoding: 'utf8',
  });
  if (!stdout.trim()) return '';
  return JSON.parse(stdout).hookSpecificOutput.additionalContext;
}

function layered() {
  const dir = project({});
  for (const d of ['src/ui/Button', 'src/features/billing/hooks', 'src/features/auth', 'src/app/routes']) {
    mkdirSync(join(dir, d), { recursive: true });
  }
  return dir;
}

test('stays SILENT when the layout is not layered (the JIT gate)', () => {
  const dir = project({});
  mkdirSync(join(dir, 'src', 'components'), { recursive: true }); // flat components/, no features/
  const out = run(dir, { file_path: 'src/components/Button.tsx', content: "import { x } from '../app/thing'" });
  assert.equal(out, '', 'a flat components folder is earlier, not wrong — no opinion');
});

test('flags ui/ importing from features/ — the upward import', () => {
  const out = run(layered(), {
    file_path: 'src/ui/Button/Button.tsx',
    content: "import { formatPrice } from '../../features/billing/hooks/usePrice';\nexport const Button = () => null;",
  });
  assert.match(out, /ui\/ importing from features\//, 'names the direction');
  assert.match(out, /points UP/);
  assert.match(out, /Move the shared piece down/, 'says the usual fix');
});

test('flags features/ importing from app/', () => {
  const out = run(layered(), {
    file_path: 'src/features/billing/Invoice.tsx',
    content: "import { router } from '@/app/routes/router';",
  });
  assert.match(out, /features\/ importing from app\//);
});

test('flags a feature reaching into another feature\'s internals, allows its index', () => {
  const deep = run(layered(), {
    file_path: 'src/features/auth/Login.tsx',
    content: "import { useInvoice } from '../billing/hooks/useInvoice';",
  });
  assert.match(deep, /feature `auth` reaching into feature `billing`'s internals/);
  assert.match(deep, /hooks\/useInvoice/, 'names the internal path it reached');

  const viaIndex = run(layered(), {
    file_path: 'src/features/auth/Login.tsx',
    content: "import { Invoice } from '../billing';\nimport { Other } from '../billing/index';",
  });
  assert.equal(viaIndex, '', 'a feature\'s index is its public surface');
});

test('stays SILENT on downward and same-layer imports and on packages', () => {
  const out = run(layered(), {
    file_path: 'src/app/routes/home.tsx',
    content: [
      "import React from 'react';",
      "import { Button } from '@/ui/Button/Button';",
      "import { Invoice } from '../../features/billing';",
      "import { useState } from 'react';",
      "import { Sibling } from './sibling';",
    ].join('\n'),
  });
  assert.equal(out, '', 'app/ may import anything below it; packages are not boundaries');
});

test('judges only the text an Edit ADDED, not the whole file', () => {
  const out = run(layered(), {
    file_path: 'src/ui/Button/Button.tsx',
    old_string: 'const a = 1;',
    new_string: "import { Nav } from '../../app/routes/nav';\nconst a = 2;",
  }, 'Edit');
  assert.match(out, /ui\/ importing from app\//);

  const quiet = run(layered(), {
    file_path: 'src/ui/Button/Button.tsx',
    old_string: 'const a = 1;',
    new_string: 'const a = 2;',
  }, 'Edit');
  assert.equal(quiet, '', 'an edit that adds no import says nothing, whatever the file already contains');
});

test('reads Dart package imports by path', () => {
  const out = run(layered(), {
    file_path: 'src/ui/Button/button.dart',
    content: "import 'package:myapp/features/billing/price.dart';",
  });
  assert.match(out, /points UP/);
});

test('fails open on garbage input', () => {
  const stdout = execFileSync('node', [HOOK], { input: 'not json', encoding: 'utf8' });
  assert.equal(stdout, '');
});
