// ── ENTRY POINT ───────────────────────────────────────────────────────────────
// app.js wires together all modules and binds UI event listeners.

import { loadProgress, saveProgress, clearProgress } from './state.js';
import { loadTheme, toggleTheme, render, renderAfterClear, showToast } from './ui.js';

// ── INIT ──────────────────────────────────────────────────────────────────────

loadTheme();
loadProgress();
render();

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
