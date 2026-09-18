import { MONTHS, CLASS_LABEL, esc, fmtDate, fmtTravel, fmtCost, parseDate, todayIso } from './util.js';

const badges = (r) => Object.keys(r.distances).map((k) => `<span class="dist d-${k}">${CLASS_LABEL[k]}</span>`).join('');
const SWIM = { pool: '🏊 pool', 'open-water': '🌊 open water' };
const swim = (r) => (r.swim_type ? `<span class="badge s-swim">${SWIM[r.swim_type]}</span>` : '');
const fmt = (r) => (r.format ? `<span class="badge s-format">${esc(r.format)}</span>` : '');
const status = (r) => `<span class="badge s-${r.edition.status}">${r.edition.status}</span>`;

export function renderList(rows) {
  if (!rows.length) return '<p class="empty">No races match these filters. 🏊💨</p>';
  const today = todayIso();
  const byMonth = Map.groupBy(rows, (r) => parseDate(r.edition.date).getMonth());
  return [...byMonth].map(([m, list]) => `
    <section class="month"><h2>${MONTHS[m]}</h2>
    <div class="cards">${list.map((r) => `
      <button class="card ${r.edition.date < today ? 'past' : ''}" data-id="${esc(r.id)}">
        <time class="date"><b>${parseDate(r.edition.date).getDate()}</b><small>${fmtDate(r.edition.date, { weekday: 'short' })}</small></time>
        <div class="body">
          <h3>${esc(r.name)}</h3>
          <p class="where">${esc(r.location)} · ${fmtTravel(r.travel)} by train</p>
          <p class="tags">${badges(r)}${swim(r)}${fmt(r)}${status(r)}</p>
        </div>
        <span class="price">${fmtCost(r.cost)}</span>
      </button>`).join('')}</div></section>`).join('');
}

const pad = (n) => String(n).padStart(2, '0');

/** Full-year overview: 12 mini months; only race days are highlighted. */
export function renderCalendar(rows, year) {
  const byDay = Map.groupBy(rows, (r) => r.edition.date);
  const today = todayIso();
  const months = MONTHS.map((name, m) => {
    const lead = (new Date(year, m, 1).getDay() + 6) % 7; // Monday-first
    const days = new Date(year, m + 1, 0).getDate();
    const cells = [
      ...Array(lead).fill('<i class="yd blank"></i>'),
      ...Array.from({ length: days }, (_, i) => {
        const d = i + 1, key = `${year}-${pad(m + 1)}-${pad(d)}`, evs = byDay.get(key) ?? [];
        const cls = ['yd', (lead + i) % 7 > 4 && 'weekend', key === today && 'today',
          evs.length && `hit d-${Object.keys(evs[0].distances)[0] ?? 'sprint'}`].filter(Boolean).join(' ');
        return evs.length
          ? `<button class="${cls}" data-day="${key}" title="${esc(evs.map((e) => e.name).join(' · '))}">${d}${evs.length > 1 ? `<sup>${evs.length}</sup>` : ''}</button>`
          : `<i class="${cls}">${d}</i>`;
      }),
    ].join('');
    const n = rows.filter((r) => r.edition.date.startsWith(`${year}-${pad(m + 1)}`)).length;
    return `<section class="ymonth"><h3>${name}${n ? ` <small>${n}</small>` : ''}</h3>
      <div class="ygrid">${['M','T','W','T','F','S','S'].map((x) => `<b class="ydow">${x}</b>`).join('')}${cells}</div></section>`;
  }).join('');
  return `<div class="cal-head"><h2>${year}</h2><p>${rows.length} races — click a highlighted day</p></div><div class="year">${months}</div>`;
}

/** Shown when a day has more than one race. */
export function renderDay(iso, list) {
  return `<form method="dialog"><button class="icon-btn close" aria-label="Close">✕</button></form>
    <h2>${fmtDate(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2>
    <div class="day-list">${list.map((r) => `<button class="card" data-id="${esc(r.id)}">
      <div class="body"><h3>${esc(r.name)}</h3><p class="where">${esc(r.location)}</p><p class="tags">${badges(r)}${swim(r)}${fmt(r)}${status(r)}</p></div></button>`).join('')}</div>`;
}

export function renderDetail(r) {
  const d = r.distances;
  const rows = Object.entries(d).map(([k, v]) => `
    <tr><th><span class="dist d-${k}">${CLASS_LABEL[k]}</span></th>
    <td>🏊 ${v.swim_km ?? '?'} km</td><td>🚴 ${v.bike_km ?? '?'} km${v.bike_laps ? ` <small>(${esc(v.bike_laps)} laps)</small>` : ''}</td>
    <td>🏃 ${v.run_km ?? '?'} km${v.run_laps ? ` <small>(${esc(v.run_laps)} laps)</small>` : ''}</td></tr>`).join('');
  const src = r.edition.source_url ? `<a href="${esc(r.edition.source_url)}" target="_blank" rel="noopener">source</a>` : 'no source yet';
  return `
    <form method="dialog"><button class="icon-btn close" aria-label="Close">✕</button></form>
    <h2>${esc(r.name)}</h2>
    <p class="where">${esc(r.location)} · ${fmtDate(r.edition.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} ${fmt(r)}${status(r)} · ${src}</p>
    <table class="dist-table">${rows || '<tr><td>Distances not listed yet.</td></tr>'}</table>
    <dl>
      <dt>From Duisburg</dt><dd>${esc(r.travel?.text ?? '—')}</dd>
      <dt>Entry fee</dt><dd>${fmtCost(r.cost)}</dd>
      ${r.course?.swim ? `<dt>Swim venue</dt><dd>${esc(r.course.swim)}${r.swim_type ? ` — ${SWIM[r.swim_type]}` : ''}</dd>` : ''}
      ${r.course?.bike ? `<dt>Bike course</dt><dd>${esc(r.course.bike)}</dd>` : ''}
      ${r.course?.run ? `<dt>Run course</dt><dd>${esc(r.course.run)}</dd>` : ''}
      ${r.edition.note ? `<dt>Note</dt><dd>${esc(r.edition.note)}</dd>` : ''}
    </dl>
    ${r.url ? `<p><a class="btn" href="${esc(r.url)}" target="_blank" rel="noopener">Organiser website ↗</a></p>` : ''}`;
}
