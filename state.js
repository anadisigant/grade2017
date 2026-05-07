// ── STATE ─────────────────────────────────────────────────────────────────────

import { DISCS } from './data.js';

const STORAGE_KEY = 'bsi_ifba_2016';

/** @type {Set<string>} IDs of completed disciplines */
export let done = new Set();

/**
 * Returns the display state of a discipline.
 * @param {{ id: string, type: string, pre: string[] }} disc
 * @returns {'done' | 'avail' | 'lock' | 'opt'}
 */
export function getState(disc) {
  if (done.has(disc.id)) return 'done';
  if (disc.tipo === 'OPT') return 'opt';
  return disc.pre.every(p => done.has(p)) ? 'avail' : 'lock';
}

/**
 * Toggles a discipline: marks as done or removes it (cascading).
 * @param {string} id
 * @returns {boolean} whether a change was made
 */
export function toggle(id) {
  const disc = DISCS.find(x => x.id === id);
  if (!disc || getState(disc) === 'lock') return false;

  if (done.has(id)) {
    // Remove this discipline and all dependents (cascade)
    const cascade = new Set();
    function collectDependents(rid) {
      cascade.add(rid);
      DISCS.filter(x => x.pre.includes(rid)).forEach(x => collectDependents(x.id));
    }
    collectDependents(id);
    cascade.forEach(cid => done.delete(cid));
  } else {
    done.add(id);
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
