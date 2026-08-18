import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { REGISTRY_FILE } from './paths.js';

function load() {
  if (!existsSync(REGISTRY_FILE)) return { projects: [] };
  try {
    return JSON.parse(readFileSync(REGISTRY_FILE, 'utf8'));
  } catch {
    return { projects: [] };
  }
}

function save(data) {
  mkdirSync(dirname(REGISTRY_FILE), { recursive: true }); // ensure ~/.boss exists
  writeFileSync(REGISTRY_FILE, JSON.stringify(data, null, 2) + '\n');
}

export function listProjects() {
  return load().projects;
}

// Upsert by absolute path — a project is identified by where it lives on disk.
export function registerProject(entry) {
  const data = load();
  const idx = data.projects.findIndex((p) => p.path === entry.path);
  if (idx >= 0) data.projects[idx] = { ...data.projects[idx], ...entry };
  else data.projects.push(entry);
  save(data);
}

export function findByPath(absPath) {
  return load().projects.find((p) => p.path === absPath);
}

// Mark a project retired (IDEA-044 — /sunset). Retiring ≠ deleting: nothing on disk
// is touched here; only the registry status flips, and it flips back (see reviveProject).
// Returns the updated entry, or null if the project isn't registered.
// Drop a project from the registry entirely — used by `boss remove`, and deliberately NOT
// `retireProject`.
//
// The two mean opposite things and conflating them corrupts the founder's own record. `retire` is a
// VENTURE OUTCOME — an honest ending, and `boss insights` reads it as one (it reports time-to-retire
// alongside time-to-build). `remove` is "I'm taking BOSS out of this repo", which says nothing about
// whether the venture is alive; it may be thriving. Marking it retired would have BOSS reporting a
// death that didn't happen, in the one surface that tells a founder how their ventures have gone.
// BOSS has no business tracking a project it is no longer installed in.
export function deregisterProject(absPath) {
  const data = load();
  const before = data.projects.length;
  data.projects = data.projects.filter((p) => p.path !== absPath);
  if (data.projects.length === before) return false;
  save(data);
  return true;
}

export function retireProject(absPath, retiredOn) {
  const data = load();
  const p = data.projects.find((p) => p.path === absPath);
  if (!p) return null;
  p.status = 'retired';
  p.retired_on = retiredOn;
  save(data);
  return p;
}

// Reverse a retirement (the guardrail: retiring is reversible). Returns the entry or null.
export function reviveProject(absPath) {
  const data = load();
  const p = data.projects.find((p) => p.path === absPath);
  if (!p) return null;
  delete p.status;
  delete p.retired_on;
  save(data);
  return p;
}
