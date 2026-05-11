// ── UI / RENDERING ────────────────────────────────────────────────────────────

import { DISCS, TOTAL_H, SEM_H, SEM_LABELS } from './data.js';
import { done, getState, toggle, toggleSemester } from './state.js';
import { showTooltip, moveTooltip, hideTooltip } from './tooltip.js';

// ── TOAST ─────────────────────────────────────────────────────────────────────

let toastTimer = null;

export function showToast(message) {
  const el = document.getElementById('toast');
  clearTimeout(toastTimer);
  el.textContent = message;
  el.classList.add('show');
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// ── THEME ─────────────────────────────────────────────────────────────────────

let currentTheme = 'dark';

export function loadTheme() {
  currentTheme = localStorage.getItem('bsi_theme') ?? 'dark';
  applyTheme(currentTheme);
}

export function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
  localStorage.setItem('bsi_theme', currentTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('btn-theme');
  btn.setAttribute('aria-label', theme === 'dark' ? 'Modo claro' : 'Modo escuro');
  btn.textContent = theme === 'dark' ? '○' : '●';
}

// ── CARD STATE PATCH ──────────────────────────────────────────────────────────
// Instead of destroying and rebuilding the entire DOM on every toggle,
// we patch only the cards whose state actually changed.

/** @type {Map<string, string>} id → last rendered state */
const prevStates = new Map();

const STATE_CLASSES = ['s-done', 's-avail', 's-lock', 's-opt'];

/**
 * Applies current state to an existing card element (no re-create).
 * @param {HTMLElement} card
 * @param {{ id: string, name: string, type: string, h: number }} disc
 * @param {string} state
 */
function patchCard(card, disc, state) {
  const isOpt = disc.tipo === 'OPT';

  // Update classes
  STATE_CLASSES.forEach(c => card.classList.remove(c));
  card.classList.add(`s-${state}`);
  if (isOpt && state === 'done') card.classList.add('s-opt');

  // Update check indicator
  const check = card.querySelector('.check-box');
  if (check) check.textContent = state === 'done' ? '✓' : '';

  // Update lock indicator
  const existingLock = card.querySelector('.lock-icon');
  if (state === 'lock' && !existingLock) {
    const lock = document.createElement('span');
    lock.className = 'lock-icon';
    lock.textContent = '—';
    card.prepend(lock);
  } else if (state !== 'lock' && existingLock) {
    existingLock.remove();
  }

  // Locked cards are now also clickable (auto-fulfils prerequisites)
  card.style.cursor = 'pointer';
}

// ── CARD BUILD (first render only) ───────────────────────────────────────────

function buildCard(disc, animIndex) {
  const state = getState(disc);
  const isOpt = disc.tipo === 'OPT';

  let cls = `disc-card s-${state}`;
  if (isOpt && state === 'done') cls += ' s-opt';

  const card = document.createElement('div');
  card.className = cls;
  card.id = `card-${disc.id}`;
  card.style.animationDelay = `${animIndex * 0.04}s`;
  // Locked cards are also clickable
  card.style.cursor = 'pointer';

  card.innerHTML = `
    ${state === 'lock' ? '<span class="lock-icon">—</span>' : ''}
    <div class="card-top">
      <div class="card-name">${disc.nome}</div>
      <div class="check-box">${state === 'done' ? '✓' : ''}</div>
    </div>
    <div class="card-meta">
      <span class="type-badge tb-${disc.tipo}">${disc.tipo}</span>
      <span class="card-hours">${disc.h}h</span>
    </div>
  `;

  card.addEventListener('click', () => handleToggle(disc.id));
  card.addEventListener('mouseenter', e => showTooltip(e, disc, getState(disc)));
  card.addEventListener('mouseleave', hideTooltip);
  card.addEventListener('mousemove', moveTooltip);

  prevStates.set(disc.id, state);
  return card;
}

// ── TOGGLE HANDLER ────────────────────────────────────────────────────────────

function handleToggle(id) {
  const changed = toggle(id);
  if (!changed) return;
  patchAll();
}

function handleSemesterToggle(sem) {
  toggleSemester(sem);
  patchAll();
}

// ── STATS ─────────────────────────────────────────────────────────────────────

function updateStats() {
  let nDone = 0, nAvail = 0, nLock = 0, hDone = 0;

  DISCS.forEach(disc => {
    const st = getState(disc);
    if (st === 'done')                       { nDone++; hDone += disc.h; }
    else if (st === 'avail' || st === 'opt')   nAvail++;
    else                                       nLock++;
  });

  document.getElementById('st-done').textContent  = `${nDone}`;
  document.getElementById('st-avail').textContent = `${nAvail}`;
  document.getElementById('st-lock').textContent  = `${nLock}`;

  const pct = Math.round(hDone / TOTAL_H * 100);
  document.getElementById('pct-label').textContent = `${pct}%`;
  document.getElementById('pct-hours').textContent = `${hDone} / ${TOTAL_H}h`;
  document.getElementById('prog-fill').style.width = `${pct}%`;
}

// ── PATCH ALL (surgical update after toggle) ──────────────────────────────────

function patchAll() {
  DISCS.forEach(disc => {
    const newState = getState(disc);
    const oldState = prevStates.get(disc.id);
    if (newState === oldState) return;

    const card = document.getElementById(`card-${disc.id}`);
    if (!card) return;

    patchCard(card, disc, newState);
    prevStates.set(disc.id, newState);
  });

  updateStats();
}

// ── INITIAL RENDER (builds all DOM, runs once) ────────────────────────────────

export function render() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  prevStates.clear();

  const bySem = {};
  DISCS.forEach(d => { (bySem[d.sem] ??= []).push(d); });

  for (let s = 1; s <= 8; s++) {
    const discs = bySem[s] ?? [];

    const col = document.createElement('div');
    col.className = 'sem-col';

    const header = document.createElement('div');
    header.className = 'sem-header';
    header.title = 'Clique para marcar/desmarcar todas as matérias deste semestre';
    header.innerHTML = `
      <span class="sem-label">${SEM_LABELS[s - 1]}</span>
      <span class="sem-hours">${SEM_H[s - 1]}h</span>
    `;
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => handleSemesterToggle(s));
    col.appendChild(header);

    discs.forEach((d, i) => col.appendChild(buildCard(d, i)));
    grid.appendChild(col);
  }

  updateStats();
}

// ── FULL CLEAR RESET ──────────────────────────────────────────────────────────

export function renderAfterClear() {
  // Re-use initial render since all states reset
  render();
}
