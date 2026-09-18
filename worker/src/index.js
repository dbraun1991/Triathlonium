// Read-only JSON API over D1 (ADR-0003). Writes happen only via
// `npm run db:seed`, never through the public API (ADR-0005).
// GET /api/events[?year=2027]  ->  { events: [...] }  (same shape as public/data/events.json)
const json = (body, env, req, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'access-control-allow-origin': allowed(env, req),
      vary: 'origin',
    },
  });

function allowed(env, req) {
  const origin = req.headers.get('origin');
  const ok = [env.ALLOWED_ORIGIN, 'http://localhost:5173'];
  return ok.includes(origin) ? origin : env.ALLOWED_ORIGIN;
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return json(null, env, req, 204);
    if (req.method !== 'GET') return json({ error: 'read-only' }, env, req, 405);
    const url = new URL(req.url);
    if (url.pathname !== '/api/events') return json({ error: 'not found' }, env, req, 404);

    const year = url.searchParams.get('year');
    const [ev, ed, di] = await env.DB.batch([
      env.DB.prepare('SELECT * FROM events'),
      year
        ? env.DB.prepare('SELECT * FROM editions WHERE year = ?').bind(+year)
        : env.DB.prepare('SELECT * FROM editions'),
      env.DB.prepare('SELECT * FROM distances'),
    ]);

    const byId = new Map();
    for (const r of ev.results) {
      const sur = r.cost_surcharge ? JSON.parse(r.cost_surcharge) : {};
      byId.set(r.id, {
        id: r.id, name: r.name, location: r.location, url: r.url, ...(r.format ? { format: r.format } : {}), swim_type: r.swim_type,
        travel: { text: r.travel_text, km: r.travel_km, minutes: r.travel_min },
        cost: r.cost_min == null ? null : {
          min: r.cost_min, max: r.cost_max, ...(r.cost_approx ? { approx: true } : {}), ...sur,
        },
        course: Object.fromEntries(
          Object.entries({ swim: r.swim_venue, bike: r.bike_course, run: r.run_course }).filter(([, v]) => v)),
        distances: {}, editions: {},
      });
    }
    for (const r of ed.results)
      byId.get(r.event_id).editions[r.year] = {
        date: r.date, status: r.status, edition: r.edition_no, source_url: r.source_url,
      };
    for (const r of di.results) {
      const d = { swim_km: r.swim_km, bike_km: r.bike_km, run_km: r.run_km };
      if (r.bike_laps != null) d.bike_laps = r.bike_laps;
      if (r.run_laps != null) d.run_laps = r.run_laps;
      byId.get(r.event_id).distances[r.class] = d;
    }
    const events = [...byId.values()].filter((e) => !year || Object.keys(e.editions).length);
    return json({ events }, env, req);
  },
};
