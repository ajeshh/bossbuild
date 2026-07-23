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
