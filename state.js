// ── STATE ─────────────────────────────────────────────────────────────────────

import { DISCS } from './data.js';

const STORAGE_KEY = 'bsi_ifba_2016';

/** @type {Set<string>} IDs of completed disciplines */
export let done = new Set();

/**
 * Returns the display state of a discipline.
 * @param {{ id: string, tipo: string, pre: string[] }} disc
 * @returns {'done' | 'avail' | 'lock' | 'opt'}
 */
export function getState(disc) {
  if (done.has(disc.id)) return 'done';
  if (disc.tipo === 'OPT') return 'opt';
  return disc.pre.every(p => done.has(p)) ? 'avail' : 'lock';
}

/**
 * Recursively marks a discipline and all its prerequisites as done.
 * @param {string} id
 */
function markWithPrereqs(id) {
  const disc = DISCS.find(x => x.id === id);
  if (!disc || done.has(id)) return;
  // First, satisfy all prerequisites recursively
  disc.pre.forEach(pid => markWithPrereqs(pid));
  done.add(id);
}

/**
 * Toggles a discipline.
 * - If locked: marks it AND all its prerequisites as done (cascade up).
 * - If done: removes it and all dependents (cascade down).
 * - If avail/opt: marks it as done.
 * @param {string} id
 * @returns {boolean} whether a change was made
 */
export function toggle(id) {
  const disc = DISCS.find(x => x.id === id);
  if (!disc) return false;

  if (done.has(id)) {
    // Remove this discipline and all dependents (cascade down)
    const cascade = new Set();
    function collectDependents(rid) {
      cascade.add(rid);
      DISCS.filter(x => x.pre.includes(rid)).forEach(x => collectDependents(x.id));
    }
    collectDependents(id);
    cascade.forEach(cid => done.delete(cid));
  } else {
    // Mark this discipline and all prerequisites as done (cascade up)
    markWithPrereqs(id);
  }

  return true;
}

/**
 * Marks all disciplines in a semester as done (including their prerequisites).
 * If all are already done, removes them all instead (toggle behaviour).
 * @param {number} sem  1-based semester number
 * @returns {boolean} whether a change was made
 */
export function toggleSemester(sem) {
  const semDiscs = DISCS.filter(d => d.sem === sem);
  const allDone = semDiscs.every(d => done.has(d.id));

  if (allDone) {
    // Un-mark all in this semester AND their dependents
    semDiscs.forEach(d => {
      if (!done.has(d.id)) return;
      const cascade = new Set();
      function collectDependents(rid) {
        cascade.add(rid);
        DISCS.filter(x => x.pre.includes(rid)).forEach(x => collectDependents(x.id));
      }
      collectDependents(d.id);
      cascade.forEach(cid => done.delete(cid));
    });
  } else {
    // Mark all in this semester (with prerequisites)
    semDiscs.forEach(d => markWithPrereqs(d.id));
  }

  return true;
}

// ── PERSISTENCE ───────────────────────────────────────────────────────────────

export function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...done]));
    return true;
  } catch {
    return false;
  }
}

export function loadProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) done = new Set(JSON.parse(stored));
  } catch {
    // ignore corrupt data
  }
}

export function clearProgress() {
  done = new Set();
  localStorage.removeItem(STORAGE_KEY);
}
