// The five failure states of FEAT-007 (docs/ai-failure-states.md). Every one ends the same way: the
// template ask, in the same sheet, under one line. The owner never waits on the model and never sees
// why. Each writes one line to the app log: the reason and the agency, never the text.

export const USUAL_WORDING = 'The usual wording this time.';

export type Ask = { carerId: string; carer: string; text: string };
export type Draft = { asks: Ask[]; source: 'model' | 'template'; reason?: string; notice?: string };
export type Fallback = { template: Ask[]; agencyId: string; area: string };

function toTemplate(ctx: Fallback, reason: string, extra: Record<string, string> = {}, loud = false): Draft {
  const line = JSON.stringify({ ts: new Date().toISOString(), feat: 'FEAT-007', fallback: reason, agency: ctx.agencyId, ...extra });
  if (loud) console.error(line); else console.warn(line);
  return { asks: ctx.template, source: 'template', reason, notice: USUAL_WORDING };
}

// Not the schema, empty, too long, the wrong count. The caller has already retried once.
export const handleGarbageResponse = (ctx: Fallback, detail: string) => toTemplate(ctx, `garbage:${detail}`);

// No retry: the same prompt gets the same answer. The area goes in the log so a repeat shows.
export const handleRefusal = (ctx: Fallback) => toTemplate(ctx, 'refusal', { area: ctx.area });

// A detail we never gave it, another carer's name, or pressure. Discarded, no retry.
export const handleHallucination = (ctx: Fallback, detail: string) => toTemplate(ctx, `hallucination:${detail}`);

// 4 seconds, whatever the provider is doing. Nothing is queued to redraft.
export const handleTimeout = (ctx: Fallback) => toTemplate(ctx, 'timeout');

// Over the input cap (no call made: the allow-list broke), at the output cap, or the month's cap.
export const handleCostSpike = (ctx: Fallback, detail: string) => toTemplate(ctx, `cost:${detail}`, {}, detail === 'input-cap');
