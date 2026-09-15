// The founder's calendar, not the server's. `toISOString()` is UTC, so at 21:00 in California a
// record was "added" tomorrow and the recap's window ended on a day that had not started. Every
// day-stamp a person reads or that is compared against a record's date goes through here (IDEA-118).
// Machine timestamps (a mute's expiry, the brain's sequence, the update cache) stay full ISO.
const pad = (n) => String(n).padStart(2, '0');

/** YYYY-MM-DD in local time. Accepts a Date or anything `new Date()` takes. */
export function isoDay(when = new Date()) {
  const d = when instanceof Date ? when : new Date(when);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** YYYY-MM-DD HH:MM in local time — the "generated at" stamp on a rendered page. */
export function isoMinute(when = new Date()) {
  const d = when instanceof Date ? when : new Date(when);
  return `${isoDay(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
