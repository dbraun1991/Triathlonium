// API first (Cloudflare Worker + D1, ADR-0003), static JSON as fallback (ADR-0002).
const API = import.meta.env.VITE_API_URL;
const STATIC = `${import.meta.env.BASE_URL}data/events.json`;

async function get(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.json();
}

export async function loadEvents() {
  if (API) {
    try { return (await get(`${API}/api/events`)).events; }
    catch (err) { console.warn('API unavailable, using static data', err); }
  }
  return (await get(STATIC)).events;
}

/** One row per (event, year) with a date — what both views render. */
export function flatten(events) {
  return events.flatMap((e) =>
    Object.entries(e.editions).filter(([, d]) => d.date).map(([year, d]) => ({ ...e, year: +year, edition: d })));
}
