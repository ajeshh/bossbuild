// The cover (FEAT-001, FEAT-005): who's free for an uncovered visit, in what order to ask them, and
// what happens when they answer. Plain JS with no dependencies, so the smoke check runs it as-is.
//
// The order is the area first, then the alphabet. There is no other ranking: no yes-rate and no
// location, because carers are never ranked or tracked (DEC-003). "Nearest" means the carer's
// usual area. Who is qualified for which visit isn't modelled: the import keeps only the client's
// first name, the day, the time and the area (PRIVACY.md), so the owner's three are the area's three.

export const ROUND = 3;
export const QUIET_START = '20:00';
export const QUIET_END = '06:30';
export const QUIET_END_SAID = '6:30'; // how the app says it: "Goes out at 6:30."

const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const minutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const weekday = (day) => WEEKDAYS[new Date(`${day}T12:00:00`).getDay()];

const overlaps = (a, b) =>
  a.day === b.day && minutes(a.start) < minutes(b.end) && minutes(b.start) < minutes(a.end);

export function freeCarers(rota, visit) {
  return rota.carers.filter((c) =>
    c.id !== visit.offCarerId
    && (c.days ?? []).includes(weekday(visit.day))
    && !rota.visits.some((v) => v.id !== visit.id && v.carerId === c.id && overlaps(v, visit)));
}

export function askOrder(rota, visit) {
  const byName = (a, b) => a.firstName.localeCompare(b.firstName);
  const free = freeCarers(rota, visit);
  return [
    ...free.filter((c) => c.area === visit.area).sort(byName),
    ...free.filter((c) => c.area !== visit.area).sort(byName),
  ];
}

export function inQuietHours(now) {
  const m = now.getHours() * 60 + now.getMinutes();
  return m >= minutes(QUIET_START) || m < minutes(QUIET_END);
}

// When an ask made at `now` may leave: now, or the end of quiet hours.
export function sendTime(now) {
  if (!inQuietHours(now)) return now;
  const at = new Date(now);
  const end = minutes(QUIET_END);
  if (now.getHours() * 60 + now.getMinutes() >= end) at.setDate(at.getDate() + 1);
  at.setHours(Math.floor(end / 60), end % 60, 0, 0);
  return at;
}

// The next round of asks for `visit`. `exclude` holds the carers already asked.
export function planAsk(rota, visit, now, exclude = []) {
  const to = askOrder(rota, visit).filter((c) => !exclude.includes(c.id)).slice(0, ROUND);
  const sendAt = sendTime(now);
  return { visitId: visit.id, to, sendAt, queued: sendAt !== now };
}

// The ask row. `drafted`: the text came from the model (FEAT-007); `edited`: the owner changed it.
export function openCover(plan, { drafted = false, edited = false } = {}) {
  return { visitId: plan.visitId, status: 'asked', asked: plan.to.map((c) => c.id), declined: [], heldBy: null, drafted, edited };
}

// The first yes takes it. Later yeses are told it's taken; nothing is covered until the owner confirms.
export function answer(cover, carerId, yes) {
  if (!cover.asked.includes(carerId)) throw new Error(`${carerId} was not asked for ${cover.visitId}`);
  if (cover.status === 'covered' || cover.heldBy) return { cover, result: yes ? 'taken' : 'noted' };
  if (!yes) return { cover: { ...cover, declined: [...cover.declined, carerId] }, result: 'noted' };
  return { cover: { ...cover, status: 'held', heldBy: carerId }, result: 'held' };
}

export function confirm(cover) {
  if (!cover.heldBy) throw new Error(`nobody has said yes to ${cover.visitId}`);
  return { ...cover, status: 'covered' };
}

export const everyoneSaidNo = (cover) => !cover.heldBy && cover.declined.length === cover.asked.length;
