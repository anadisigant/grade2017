import * as base from './BSI2016.js';

const CURRICULA = {
  '2016': {
    id: '2016',
    abbr: 'BSI',
    name: 'Matriz 2016.2',
    label: 'IFBA · VCA · Matriz 2016.2',
    DISCS: base.DISCS,
    TOTAL_H: base.TOTAL_H,
    SEM_H: base.SEM_H,
    SEM_LABELS: base.SEM_LABELS,
  }
};

let active = '2016';

export function registerCurriculum(id, data) {
  CURRICULA[id] = { id, ...data };
}

export function setActive(id) {
  if (!CURRICULA[id]) return false;
  active = id;
  return true;
}

export function getActive() { return active; }
export function getActiveMeta() { return CURRICULA[active]; }
export function getActiveAbbr() { return CURRICULA[active].abbr; }
export function getActiveLabel() { return CURRICULA[active].label; }

export function getDISCS() { return CURRICULA[active].DISCS; }
export function getTOTAL_H() { return CURRICULA[active].TOTAL_H; }
export function getSEM_H() { return CURRICULA[active].SEM_H; }
export function getSEM_LABELS() { return CURRICULA[active].SEM_LABELS; }

export function listCurricula() {
  return Object.values(CURRICULA).map(c => ({ id: c.id, name: c.name, abbr: c.abbr }));
}
