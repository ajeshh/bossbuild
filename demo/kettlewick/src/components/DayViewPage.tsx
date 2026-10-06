// The owner's Today — uncovered first, then time order (FEAT-002). A page is a composition, not a
// component (COMPONENTS.md). Ask on a row opens the draft sheet (FEAT-007): one text per carer, which
// she reads, edits if she likes, and sends with Ask. Nothing goes out before that tap.
import { useEffect, useState } from 'react';
import { tokens } from '@/styles/tokens';
import { QUIET_END_SAID, confirm, openCover, planAsk } from '@/rota/cover.js';
import { templateAsks, toPromptFacts } from '@/ask/facts.js';
import { loadDay, saveDay, spoken, type Cover, type Day, type Visit } from '@/rota/day';
import { USUAL_WORDING, type Draft } from '@/lib/ai-handlers';
import { Rail } from '@/components/Rail';
import { VisitRow } from '@/components/VisitRow';
import type { VisitState } from '@/components/StatusChip';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { EmptyState } from '@/components/EmptyState';
import { RowSkeleton } from '@/components/RowSkeleton';
import { Toast } from '@/components/Toast';

const AGENCY = { id: 'ag_01', owner: 'Marta' };

type Plan = ReturnType<typeof planAsk>;
type Sheet = { visit: Visit; plan: Plan; draft: Draft; texts: string[] };
type Said = { variant: 'success' | 'error'; text: string };

// Only the four fields leave the browser; the server builds the prompt from its own allow-list again.
// If the server can't be reached, the sheet gets the template here, so asking never waits on it.
async function requestDraft(visit: Visit, plan: Plan): Promise<Draft> {
  const res = await fetch('/api/ask/draft', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      visit: { id: visit.id, day: visit.day, start: visit.start, area: visit.area },
      carers: plan.to.map((c) => ({ id: c.id, firstName: c.firstName })),
      agencyId: AGENCY.id,
      owner: AGENCY.owner,
    }),
  }).catch(() => null);
  if (res?.ok) return res.json();
  const facts = toPromptFacts(visit, plan.to, new Date());
  const link = (carerId: string) => `${location.origin}/#/ask/${visit.id}/${carerId}`;
  return { asks: templateAsks(facts, plan.to, link, AGENCY.owner), source: 'template', notice: USUAL_WORDING };
}

export function DayViewPage() {
  const [day, setDay] = useState<Day | null>(null);
  const [asking, setAsking] = useState<string | null>(null);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [said, setSaid] = useState<Said | null>(null);

  useEffect(() => {
    setDay(loadDay());
    const reload = () => setDay(loadDay());
    window.addEventListener('storage', reload);
    return () => window.removeEventListener('storage', reload);
  }, []);

  const update = (next: Day) => { saveDay(next); setDay(next); };

  async function ask(visit: Visit) {
    if (!day) return;
    const plan = planAsk(day.rota, visit, new Date(), day.covers[visit.id]?.asked ?? []);
    if (!plan.to.length) return setSaid({ variant: 'error', text: "Couldn't reach anyone — try again, or ask three more." });
    setAsking(visit.id);
    const draft = await requestDraft(visit, plan);
    setAsking(null);
    setSheet({ visit, plan, draft, texts: draft.asks.map((a) => a.text) });
  }

  function send() {
    if (!day || !sheet) return;
    const { visit, plan, draft, texts } = sheet;
    const edited = texts.some((t, i) => t !== draft.asks[i].text);
    update({ ...day, covers: { ...day.covers, [visit.id]: openCover(plan, { drafted: draft.source === 'model', edited }) as Cover } });
    setSheet(null);
    const names = plan.to.map((c) => c.firstName).join(', ');
    setSaid({ variant: 'success', text: plan.queued ? `Goes out at ${QUIET_END_SAID}.` : `Asked ${names}.` });
  }

  function confirmCover(visit: Visit) {
    if (!day) return;
    const cover = confirm(day.covers[visit.id]);
    const carer = day.rota.carers.find((c) => c.id === cover.heldBy);
    update({
      rota: { ...day.rota, visits: day.rota.visits.map((v) => (v.id === visit.id ? { ...v, carerId: cover.heldBy } : v)) },
      covers: { ...day.covers, [visit.id]: cover },
    });
    setSaid({ variant: 'success', text: `Covered. ${carer?.firstName}'s on the ${spoken(visit.start)}.` });
  }

  const name = (id: string | null) => day?.rota.carers.find((c) => c.id === id)?.firstName;
  const state = (v: Visit): VisitState => (v.carerId ? 'covered' : day?.covers[v.id] ? 'asked' : 'uncovered');
  const visits = [...(day?.rota.visits ?? [])].sort((a, b) =>
    Number(Boolean(a.carerId)) - Number(Boolean(b.carerId)) || a.start.localeCompare(b.start));

  return (
    <div className="kw-shell">
      <Rail current="today" />
      <main className="kw-main">
        <h1 style={{ fontFamily: tokens.font.display, fontSize: tokens.type.size.display, margin: `0 0 ${tokens.space[4]}` }}>Today</h1>
        {/* QuietNotice goes here once it's built — its usage page is a proposal (docs/design/components/QuietNotice.md) */}
        <ul aria-busy={!day} style={{ margin: 0, padding: 0 }}>
          {!day ? <RowSkeleton /> : visits.map((v) => {
            const cover = day.covers[v.id];
            return (
              <VisitRow
                key={v.id}
                time={v.start}
                client={v.client}
                state={state(v)}
                who={cover && !v.carerId ? cover.asked.map((id) => name(id) ?? id) : []}
                heldBy={cover?.status === 'held' ? name(cover.heldBy) : undefined}
                loading={asking === v.id}
                onAsk={() => (cover?.status === 'held' ? confirmCover(v) : ask(v))}
              />
            );
          })}
        </ul>
        {day && !visits.some((v) => !v.carerId) && <EmptyState>Nothing uncovered today.</EmptyState>}
        <p className="kw-no-print" style={{ marginTop: tokens.space[4] }}>
          <a href="#/import" style={{ color: tokens.color.text.body }}>Paste a new day</a>
        </p>

        {sheet && (
          <section aria-label={`The ask for the ${spoken(sheet.visit.start)}`} style={{ marginTop: tokens.space[6], display: 'grid', gap: tokens.space[3] }}>
            {sheet.draft.notice && <p style={{ margin: 0, color: tokens.color.text.muted }}>{sheet.draft.notice}</p>}
            {sheet.plan.queued && <p style={{ margin: 0, color: tokens.color.text.muted }}>{`Goes out at ${QUIET_END_SAID}.`}</p>}
            {sheet.draft.asks.map((a, i) => (
              <TextField
                key={a.carerId}
                label={a.carer}
                variant="multiline"
                rows={3}
                value={sheet.texts[i]}
                onChange={(text) => setSheet({ ...sheet, texts: sheet.texts.map((t, j) => (j === i ? text : t)) })}
              />
            ))}
            <div>
              <Button variant="primary" onAsk={send} disabled={sheet.texts.some((t) => !t.trim())}>Ask</Button>
            </div>
          </section>
        )}
      </main>
      {said && <Toast variant={said.variant} onDismiss={() => setSaid(null)}>{said.text}</Toast>}
    </div>
  );
}
