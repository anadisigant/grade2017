// ── ENTRY POINT ───────────────────────────────────────────────────────────────
// app.js wires together all modules and binds UI event listeners.

import { loadProgress, saveProgress, clearProgress } from './state.js';
import { loadTheme, toggleTheme, render, renderAfterClear, showToast } from './ui.js';
import { listCurricula, setActive, registerCurriculum, getActiveMeta } from './curricula.js';
import * as eamb from './EAMB.js';

// ── INIT ──────────────────────────────────────────────────────────────────────

registerCurriculum('2020', {
  abbr: 'EAMB',
  name: 'Engenharia Ambiental',
  label: 'Engenharia Ambiental · EAMB',
  DISCS: eamb.DISCS,
  TOTAL_H: eamb.TOTAL_H,
  SEM_H: eamb.SEM_H,
  SEM_LABELS: eamb.SEM_LABELS,
});

loadTheme();
loadProgress();
render();

const courseToggle = document.getElementById('course-toggle');
const courseMenu = document.getElementById('course-menu');
const courseAbbr = document.getElementById('course-abbr');
const logoMark = document.getElementById('logo-mark');
const logoSubtitle = document.getElementById('logo-subtitle');

function updateCourseDisplay() {
  const meta = getActiveMeta();
  if (courseAbbr) courseAbbr.textContent = meta.abbr;
  if (logoMark) logoMark.textContent = meta.abbr;
  if (logoSubtitle) logoSubtitle.textContent = meta.label;
}

function buildCourseMenu() {
  if (!courseMenu) return;
  courseMenu.innerHTML = listCurricula()
    .map(c => `
      <button type="button" class="course-menu-item" data-id="${c.id}">
        <span class="course-menu-item-abbr">${c.abbr}</span>
        <span class="course-menu-item-name">${c.name}</span>
      </button>
    `).join('');
}

updateCourseDisplay();
buildCourseMenu();

if (courseToggle) {
  courseToggle.addEventListener('click', () => {
    if (!courseMenu) return;
    const open = courseMenu.hidden;
    courseMenu.hidden = !open;
    courseToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

if (courseMenu) {
  courseMenu.addEventListener('click', (event) => {
    const item = event.target.closest('[data-id]');
    if (!item) return;
    const id = item.dataset.id;
    if (!setActive(id)) return;
    courseMenu.hidden = true;
    courseToggle.setAttribute('aria-expanded', 'false');
    loadProgress();
    updateCourseDisplay();
    render();
  });
}

document.addEventListener('click', (event) => {
  if (!courseMenu || !courseToggle) return;
  if (courseMenu.hidden) return;
  if (event.target === courseToggle || courseToggle.contains(event.target)) return;
  if (courseMenu.contains(event.target)) return;
  courseMenu.hidden = true;
});

// ── BUTTON BINDINGS ───────────────────────────────────────────────────────────

document.getElementById('btn-theme').addEventListener('click', toggleTheme);

document.getElementById('btn-save').addEventListener('click', () => {
  const ok = saveProgress();
  const btn = document.getElementById('btn-save');
  if (ok) {
    showToast('✓ Progresso salvo!');
    btn.textContent = '✓ Salvo!';
    setTimeout(() => { btn.textContent = '↓ Salvar'; }, 2000);
  } else {
    showToast('Erro ao salvar.');
  }
});

document.getElementById('btn-clear').addEventListener('click', () => {
  if (!confirm('Limpar todo o progresso? Esta ação não pode ser desfeita.')) return;
  clearProgress();
  renderAfterClear();
  showToast('Progresso apagado.');
});
