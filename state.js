// ── estado ────────────────────────────────────────────────────────────────────

import { DISCS } from './data.js';

const STORAGE_KEY = 'bsi_ifba_2016';

/** @type {Set<string>} ids das disciplinas concluídas */
export let done = new Set();

/**
 * retorna o estado de exibição de uma disciplina.
 * @param {{ id: string, tipo: string, pre: string[] }} disc
 * @returns {'done' | 'avail' | 'lock' | 'opt'}
 */
export function getState(disc) {
  if (done.has(disc.id)) return 'done';
  if (disc.tipo === 'OPT') return 'opt';
  return disc.pre.every(p => done.has(p)) ? 'avail' : 'lock';
}

/**
 * marca recursivamente uma disciplina e todos os seus pré-requisitos como concluídos.
 * @param {string} id
 */
function markWithPrereqs(id) {
  const disc = DISCS.find(x => x.id === id);
  if (!disc || done.has(id)) return;
  // primeiro, satisfaz todos os pré-requisitos recursivamente
  disc.pre.forEach(pid => markWithPrereqs(pid));
  done.add(id);
}

/**
 * alterna o estado de uma disciplina.
 * - se bloqueada: marca ela e todos os pré-requisitos como concluídos (cascata acima).
 * - se concluída: remove ela e todas as dependentes (cascata abaixo).
 * - se disponível/optativa: marca como concluída.
 * @param {string} id
 * @returns {boolean} indica se houve alguma alteração
 */
export function toggle(id) {
  const disc = DISCS.find(x => x.id === id);
  if (!disc) return false;

  if (done.has(id)) {
    // remove esta disciplina e todas as dependentes (cascata abaixo)
    const cascade = new Set();
    function collectDependents(rid) {
      cascade.add(rid);
      DISCS.filter(x => x.pre.includes(rid)).forEach(x => collectDependents(x.id));
    }
    collectDependents(id);
    cascade.forEach(cid => done.delete(cid));
  } else {
    // marca esta disciplina e todos os pré-requisitos como concluídos (cascata acima)
    markWithPrereqs(id);
  }

  return true;
}

/**
 * marca todas as disciplinas de um semestre como concluídas (incluindo pré-requisitos).
 * se todas já estiverem concluídas, remove todas em vez disso (comportamento de alternância).
 * @param {number} sem  número do semestre (base 1)
 * @returns {boolean} indica se houve alguma alteração
 */
export function toggleSemester(sem) {
  const semDiscs = DISCS.filter(d => d.sem === sem);
  const allDone = semDiscs.every(d => done.has(d.id));

  if (allDone) {
    // desmarca todas do semestre e suas dependentes
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
    // marca todas do semestre (com pré-requisitos)
    semDiscs.forEach(d => markWithPrereqs(d.id));
  }

  return true;
}

// ── persistência ──────────────────────────────────────────────────────────────

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
    // ignora dados corrompidos
  }
}

export function clearProgress() {
  done = new Set();
  localStorage.removeItem(STORAGE_KEY);
}
