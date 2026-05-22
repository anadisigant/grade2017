// ── TOOLTIP ───────────────────────────────────────────────────────────────────

import { getDISCS } from './curricula.js';
import { done } from './state.js';

const STATE_LABELS = {
  done:  'Concluída',
  avail: 'Disponível',
  lock:  'Bloqueada',
  opt:   'Optativa',
};

/** @type {HTMLElement} */
const tipEl = document.getElementById('tip');

/**
 * Builds and shows the tooltip near the mouse pointer.
 * @param {MouseEvent} event
 * @param {{ id: string, name: string, type: string, h: number, pre: string[] }} disc
 * @param {string} state
 */
export function showTooltip(event, disc, state) {
  const DISCS = getDISCS();
  const prereqNames = disc.pre.map(pid => DISCS.find(x => x.id === pid)?.nome ?? '');
  const unlocks     = DISCS.filter(x => x.pre.includes(disc.id));

  let html = `
    <div class="tip-name">${disc.nome}</div>
    <div class="tip-meta">${disc.tipo} · ${disc.h}h · ${STATE_LABELS[state] ?? ''}</div>
  `;

  if (prereqNames.length) {
    html += `
      <div class="tip-section">
        <div class="tip-label">Pré-requisitos</div>
        ${prereqNames.map(n => `<div class="tip-item">${n}</div>`).join('')}
      </div>
    `;
  }

  if (state === 'done' && unlocks.length) {
    html += `
      <div class="tip-section">
        <div class="tip-label">Desbloqueia</div>
        ${unlocks.map(x => `<div class="tip-item">${x.nome}</div>`).join('')}
      </div>
    `;
  }

  if (state === 'lock') {
    const missing = disc.pre
      .filter(p => !done.has(p))
      .map(pid => DISCS.find(x => x.id === pid)?.nome ?? '');
    html += `
      <div class="tip-section">
        <div class="tip-label">Falta concluir</div>
        ${missing.map(n => `<div class="tip-item missing">${n}</div>`).join('')}
      </div>
    `;
  }

  tipEl.innerHTML = html;
  tipEl.style.display = 'block';
  moveTooltip(event);
}

/**
 * Repositions the tooltip to follow the cursor.
 * @param {MouseEvent} event
 */
export function moveTooltip(event) {
  let x = event.clientX + 16;
  let y = event.clientY + 16;
  if (x + 250 > window.innerWidth)             x = event.clientX - 254;
  if (y + tipEl.offsetHeight + 8 > window.innerHeight) y = event.clientY - tipEl.offsetHeight - 8;
  tipEl.style.left = x + 'px';
  tipEl.style.top  = y + 'px';
}

export function hideTooltip() {
  tipEl.style.display = 'none';
}
