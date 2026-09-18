import './style.css';
import { loadEvents, flatten } from './data.js';
import { renderList, renderCalendar, renderDetail, renderDay } from './views.js';
import { todayIso, parseDate, fmtDate } from './util.js';

const $ = (s) => document.querySelector(s);
const app = $('#app'), dlg = $('#detail');
const state = { view: 'list', year: null, classes: new Set(), swims: new Set(), maxTravel: 240, q: '' };
let rows = [];

const stored = (k, v) => { try { return v === undefined ? localStorage.getItem(k) : localStorage.setItem(k, v); } catch { return null; } };

function filtered() {
  const q = state.q.trim().toLowerCase();
  return rows.filter((r) =>
    r.year === state.year &&
    (!state.classes.size || Object.keys(r.distances).some((k) => state.classes.has(k))) &&
    (!state.swims.size || state.swims.has(r.swim_type)) &&
    (state.maxTravel >= 240 || r.travel?.minutes == null || r.travel.minutes <= state.maxTravel) &&
    (!q || `${r.name} ${r.location}`.toLowerCase().includes(q)),
  ).sort((a, b) => a.edition.date.localeCompare(b.edition.date));
}

function render() {
  const list = filtered();
  app.innerHTML = state.view === 'list' ? renderList(list) : renderCalendar(list, state.year);
  document.querySelectorAll('[data-view]').forEach((b) => b.setAttribute('aria-selected', b.dataset.view === state.view));
  document.querySelectorAll('[data-year]').forEach((b) => b.setAttribute('aria-selected', +b.dataset.year === state.year));
}

function countdown() {
  const t = todayIso();
  const next = rows.filter((r) => r.edition.date >= t).sort((a, b) => a.edition.date.localeCompare(b.edition.date))[0];
  $('#countdown').textContent = next
    ? `Next up: ${next.name}, ${next.location} — ${fmtDate(next.edition.date)} (${Math.round((parseDate(next.edition.date) - parseDate(t)) / 864e5)} days)`
    : 'Season is over — see you next year.';
}

function open(id) {
  const r = rows.find((x) => x.id === id && x.year === state.year);
  if (!r) return;
  dlg.innerHTML = renderDetail(r);
  dlg.showModal();
}

app.addEventListener('click', (e) => {
  const hit = e.target.closest('[data-id]');
  if (hit) return open(hit.dataset.id);
  const day = e.target.closest('[data-day]');
  if (!day) return;
  const list = filtered().filter((r) => r.edition.date === day.dataset.day);
  if (list.length === 1) return open(list[0].id);
  dlg.innerHTML = renderDay(day.dataset.day, list);
  dlg.showModal();
});
dlg.addEventListener('click', (e) => {
  if (e.target === dlg) return dlg.close();
  const hit = e.target.closest('[data-id]');
  if (hit) open(hit.dataset.id);
});

document.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => {
  state.view = b.dataset.view; stored('view', state.view); render();
}));
document.querySelectorAll('[data-swim]').forEach((b) => b.addEventListener('click', () => {
  const k = b.dataset.swim; state.swims.has(k) ? state.swims.delete(k) : state.swims.add(k);
  b.setAttribute('aria-pressed', state.swims.has(k)); render();
}));
document.querySelectorAll('[data-class]').forEach((b) => b.addEventListener('click', () => {
  const k = b.dataset.class; state.classes.has(k) ? state.classes.delete(k) : state.classes.add(k);
  b.setAttribute('aria-pressed', state.classes.has(k)); render();
}));
$('#travel').addEventListener('input', (e) => {
  state.maxTravel = +e.target.value;
  $('#travel-out').textContent = state.maxTravel >= 240 ? 'any' : `≤ ${state.maxTravel / 60 | 0}:${String(state.maxTravel % 60).padStart(2, '0')} h`;
  render();
});
$('#q').addEventListener('input', (e) => { state.q = e.target.value; render(); });
$('#theme').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next; stored('theme', next);
});

function setSpeed(v) {
  const hero = $('#hero');
  hero.classList.toggle('paused', v === 0);
  hero.style.setProperty('--k', v === 0 ? 1 : 1 / v);
  $('#speed-out').textContent = v === 0 ? 'off' : `${v}×`;
}
$('#speed').addEventListener('input', (e) => { const v = +e.target.value; setSpeed(v); stored('speed', v); });

try {
  const sp = parseFloat(stored('speed'));
  if (!Number.isNaN(sp)) { $('#speed').value = sp; setSpeed(sp); }
  const t = stored('theme');
  if (t) document.documentElement.dataset.theme = t;
  state.view = stored('view') === 'calendar' ? 'calendar' : 'list';
  rows = flatten(await loadEvents());
  const years = [...new Set(rows.map((r) => r.year))].sort();
  const upcoming = rows.filter((r) => r.edition.date >= todayIso()).map((r) => r.year).sort()[0];
  state.year = upcoming ?? years.at(-1);
  $('#years').innerHTML = years.map((y) => `<button role="tab" data-year="${y}">${y}</button>`).join('');
  document.querySelectorAll('[data-year]').forEach((b) => b.addEventListener('click', () => {
    state.year = +b.dataset.year; render();
  }));
  countdown(); render();
} catch (err) {
  console.error(err);
  app.innerHTML = '<p class="empty">Could not load race data. Try reloading.</p>';
}
