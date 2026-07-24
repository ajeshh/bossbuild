// src/team.js — the venture's people (founder layer slice 2; IDEA-037 / FEAT-021).
//
// Team-AWARENESS built on git + identity, zero-dep. The design rule from the mentor
// passes: **dormant-solo** — when no collaborator is declared, BOSS is unchanged for a
// solo founder; this only lights up when a second person is on the venture (inert, not
// overhead). The roster lives in .boss/config.json (LOCAL for now; the shared-vs-personal
// state cut — should the roster travel via git? — is slice 3, to be recorded as its own DEC).
//
// Identity = the GitHub login, resolved the same way /decide does (the principal id the
// whole team layer keys on). Never fabricated: a null handle is honest.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { bold } from './ui.js';

const CONFIG = '.boss/config.json';

function configPath(dir) { return join(dir, CONFIG); }

export function readConfig(dir) {
  const p = configPath(dir);
  if (!existsSync(p)) return {};
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return {}; }
}

function writeConfig(dir, cfg) {
  writeFileSync(configPath(dir), JSON.stringify(cfg, null, 2) + '\n');
}

function sh(cmd) {
  try { return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || null; }
  catch { return null; }
}

// The current operator's identity: GitHub login first (the principal id), then the git
// name, then null. Same resolution order /decide uses — never invented.
export function resolveIdentity() {
  return { handle: sh('gh api user --jq .login'), name: sh('git config user.name') };
}

const normHandle = (h) => String(h || '').replace(/^@/, '').trim();

export function roster(dir) {
  const t = readConfig(dir).team;
  return Array.isArray(t) ? t : [];
}

// True once a cofounder is on the venture — the switch the dormant team layer waits on.
export function isTeam(dir) { return roster(dir).length > 0; }

export function addCollaborator(dir, handle, name) {
  const h = normHandle(handle);
  if (!h) throw new Error('need a @github-username');
  const me = normHandle(resolveIdentity().handle);
  if (me && h.toLowerCase() === me.toLowerCase()) return { added: false, self: true, handle: '@' + h };
  const cfg = readConfig(dir);
  const team = Array.isArray(cfg.team) ? cfg.team : [];
  if (team.some((m) => normHandle(m.handle) === h)) return { added: false, handle: '@' + h };
  team.push({ handle: '@' + h, name: name || null, added: new Date().toISOString().slice(0, 10) });
  cfg.team = team;
  writeConfig(dir, cfg);
  return { added: true, handle: '@' + h };
}

export function removeCollaborator(dir, handle) {
  const h = normHandle(handle);
  const cfg = readConfig(dir);
  const team = Array.isArray(cfg.team) ? cfg.team : [];
  cfg.team = team.filter((m) => normHandle(m.handle) !== h);
  writeConfig(dir, cfg);
  return { removed: team.length - cfg.team.length };
}

// `boss team` — dormant-solo aware. Solo: a quiet "you, and here's how to add a cofounder."
// Team: the roster, with the decision-log pointer (the thing that keeps a pair in the loop).
export function renderTeam(dir) {
  const me = resolveIdentity();
  const meLabel = me.handle ? '@' + me.handle : (me.name || 'you');
  const team = roster(dir);
  const out = [''];
  if (team.length === 0) {
    out.push(`  ▸ ${bold('Solo venture')}`);
    out.push(`    You: ${meLabel}`);
    out.push('');
    out.push('    Building with a cofounder? Add them so BOSS keeps you both in the loop:');
    out.push('      boss team add @their-github-username "Their Name"');
    out.push('');
    out.push('    Solo, the team layer stays out of your way — nothing changes until someone joins.');
  } else {
    out.push(`  ▸ ${bold('Founding team')} (${team.length + 1})`);
    out.push(`    ${meLabel}   (you)`);
    for (const m of team) {
      out.push(`    ${m.handle}${m.name ? '   ' + m.name : ''}${m.added ? '   · since ' + m.added : ''}`);
    }
    out.push('');
    out.push('    /decide records who decided what (DEC-NNN) — the rationale you can both point at.');
    out.push('    New to building together? mentor-cofounder coaches the partnership — start with the');
    out.push('    AI consent + norms conversation (who automates what · what stays human · no workslop).');
    out.push('    boss team add @user "Name"   ·   boss team remove @user');
  }
  out.push('');
  return out.join('\n');
}
