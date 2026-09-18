// Merges data/*.json (spreadsheet export + per-year overlays) into
//  - public/data/events.json  (static fallback the frontend fetches, ADR-0002)
//  - worker/seed.sql          (D1 seed, ADR-0003)
// Source of truth stays in data/. Both outputs are gitignored build artifacts.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';

const BASE = 'data/triathlons-nrw-2026.json';
const slug = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function travel(text) {
  const m = text?.match(/(\d+)\s*km\s*\/\s*(\d+):(\d+)/);
  return { text: text ?? null, km: m ? +m[1] : null, minutes: m ? +m[2] * 60 + +m[3] : null };
}

const events = new Map();
const base = JSON.parse(readFileSync(BASE, 'utf8'));
for (const [name, e] of Object.entries(base)) {
  const editions = {};
  if (e.date_2025) editions['2025'] = { date: e.date_2025, status: 'unverified', edition: e.edition_2025 ?? null };
  if (e.date_2026) editions['2026'] = { date: e.date_2026, status: 'unverified', edition: e.edition_2026 ?? null };
  events.set(name, {
    id: slug(name), name, location: e.location, travel: travel(e.distance_from_duisburg),
    cost: e.cost ?? null, course: e.course ?? {}, distances: e.distances ?? {}, editions,
  });
}

// Overlays: data/<year>.json = { year, updates: {name: {date,status,source_url,note?}}, new_events: {name: {...}} }
for (const f of readdirSync('data').filter((f) => /^\d{4}\.json$/.test(f)).sort()) {
  const o = JSON.parse(readFileSync(`data/${f}`, 'utf8'));
  const y = String(o.year);
  for (const [name, u] of Object.entries(o.updates ?? {})) {
    const ev = events.get(name);
    if (!ev) throw new Error(`${f}: unknown event "${name}" in updates`);
    ev.editions[y] = { date: u.date ?? null, status: u.status, edition: u.edition ?? null, source_url: u.source_url ?? null, note: u.note ?? null };
    if (u.url) ev.url = u.url;
  }
  for (const [name, n] of Object.entries(o.new_events ?? {})) {
    if (events.has(name)) throw new Error(`${f}: "${name}" already exists`);
    const { date, status, source_url, note, url, edition, travel: t, ...rest } = n;
    events.set(name, {
      id: slug(name), name, ...rest, url: url ?? source_url ?? null,
      travel: t ? travel(t) : { text: null, km: null, minutes: null },
      cost: rest.cost ?? null, course: rest.course ?? {}, distances: rest.distances ?? {},
      editions: { [y]: { date: date ?? null, status, edition: edition ?? null, source_url: source_url ?? null, note: note ?? null } },
    });
  }
}

// Derived from the free-text swim venue (ADR-0012): pool | open-water | null.
const swimType = (v) => !v ? null
  : /badesee|see\b|kanal|rhein|hafen|talsperre|regattabahn/i.test(v) ? 'open-water'
  : /bad\b|hallenbad|freibad|schwimmbad|pool|erlbad|nordbad/i.test(v) ? 'pool' : null;
for (const e of events.values()) e.swim_type = swimType(e.course.swim);

const list = [...events.values()].sort((a, b) => a.name.localeCompare(b.name, 'de'));
const ids = new Set();
for (const e of list) { if (ids.has(e.id)) throw new Error(`duplicate id ${e.id}`); ids.add(e.id); }

writeFileSync('public/data/events.json', JSON.stringify({ generated: new Date().toISOString(), events: list }, null, 1));

// ---- D1 seed ----
const q = (v) => (v == null ? 'NULL' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
const sql = ['DELETE FROM distances;', 'DELETE FROM editions;', 'DELETE FROM events;'];
for (const e of list) {
  const c = e.cost, sur = c && (c.surcharge_eur || c.surcharge_note)
    ? JSON.stringify({ surcharge_eur: c.surcharge_eur, surcharge_note: c.surcharge_note }) : null;
  sql.push(`INSERT INTO events VALUES (${[e.id, e.name, e.location, e.travel.text, e.travel.km, e.travel.minutes,
    c?.min, c?.max, c?.approx ? 1 : 0, sur, e.course.swim, e.course.bike, e.course.run, e.url, e.format, e.swim_type].map(q).join(', ')});`);
  for (const [y, d] of Object.entries(e.editions))
    sql.push(`INSERT INTO editions VALUES (${[e.id, +y, d.date, d.status, d.edition, d.source_url].map(q).join(', ')});`);
  for (const [k, d] of Object.entries(e.distances))
    sql.push(`INSERT INTO distances VALUES (${[e.id, k, d.swim_km, d.bike_km, d.run_km,
      d.bike_laps == null ? null : String(d.bike_laps), d.run_laps == null ? null : String(d.run_laps)].map(q).join(', ')});`);
}
writeFileSync('worker/seed.sql', sql.join('\n') + '\n');
console.log(`built ${list.length} events`);
