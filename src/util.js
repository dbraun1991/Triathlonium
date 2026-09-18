export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const CLASS_LABEL = { sprint: 'Sprint', short: 'Short', middle: 'Middle' };

export const parseDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
export const fmtDate = (iso, opts = { weekday: 'short', day: 'numeric', month: 'short' }) =>
  parseDate(iso).toLocaleDateString('en-GB', opts);
export const fmtTravel = (t) => (t?.minutes == null ? '—' : `${Math.floor(t.minutes / 60)}:${String(t.minutes % 60).padStart(2, '0')} h`);
export const fmtCost = (c) =>
  !c ? '—' : `${c.approx ? '~' : ''}${c.min === c.max ? c.min : `${c.min}–${c.max}`} €${c.surcharge_eur ? ` (+${c.surcharge_eur.join('/')})` : ''}`;
export const fmtKm = (n) => (n == null ? '?' : String(n).replace('.', ','));

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
