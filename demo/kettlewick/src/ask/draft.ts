// Draft the ask (FEAT-007). When a visit is uncovered, a model drafts the text to each of the three
// carers in the owner's words; she reads it, edits if she likes, and asks. The model writes one
// sentence per carer from four fields. Code picks the carers, phrases the time, builds the prompt
// (DEC-005), checks every draft, adds the link and her sign-off, and holds the send for her tap.
// Server only: the provider key never reaches the browser.
import { generateText, type LanguageModel } from 'ai';
import { checkDraft, signOff, templateAsks, toPromptFacts } from './facts.js';
import { logCall, spentThisMonth } from '../lib/ai-cost-logger.ts';
import {
  handleCostSpike, handleGarbageResponse, handleHallucination, handleRefusal, handleTimeout, USUAL_WORDING,
  type Draft, type Fallback,
} from '../lib/ai-handlers.ts';

const FEAT = 'FEAT-007';
const TIMEOUT_MS = 4000; // the garbage retry shares it
const MAX_INPUT_TOKENS = 1200;
const MAX_OUTPUT_TOKENS = 200;
const MONTHLY_CAP_USD = 10; // all agencies; past it, every ask uses the template until the month turns
const ROUND = 3;

const SYSTEM = [
  'You write short text messages from the owner of a small home-care agency to carers, asking if they can take a visit.',
  'You are given four facts: the day, the time, the area, and the first names of the carers.',
  'Write one message per carer. Each names only that carer, never anyone else, and never says how many were asked.',
  'Use the time and the area exactly as given. Add no other detail: no length, no reason, no client, no number.',
  'Plain and warm, in the owner\'s voice. No apology, no urgency, no guilt. A carer can say no without a reason.',
  'Under 300 characters each. Do not sign off and do not add a link.',
  'Reply with JSON only: {"asks":[{"carer":"<first name>","text":"<message>"}]}',
].join('\n');
const STRICTER = '\nYour last reply was not valid. Reply with the JSON object only, nothing before or after it.';

type Visit = { id: string; day: string; start: string; area: string };
type Carer = { id: string; firstName: string };
type Context = { agencyId: string; owner: string; baseUrl: string; now?: Date };

const estimateTokens = (s: string) => Math.ceil(s.length / 4);

export async function draftAsk(visit: Visit, carers: Carer[], ctx: Context, model: LanguageModel | undefined = process.env.ASK_MODEL): Promise<Draft> {
  const facts = toPromptFacts(visit, carers, ctx.now ?? new Date());
  const linkFor = (carerId: string) => `${ctx.baseUrl}/#/ask/${visit.id}/${carerId}`;
  const fb: Fallback = { template: templateAsks(facts, carers, linkFor, ctx.owner), agencyId: ctx.agencyId, area: facts.area };

  if (!model) return { asks: fb.template, source: 'template', reason: 'no-model', notice: USUAL_WORDING };
  const prompt = JSON.stringify(facts);
  if (carers.length > ROUND || estimateTokens(SYSTEM + STRICTER + prompt) > MAX_INPUT_TOKENS) return handleCostSpike(fb, 'input-cap');
  if (spentThisMonth() >= MONTHLY_CAP_USD) return handleCostSpike(fb, 'monthly-cap');

  const modelName = typeof model === 'string' ? model : model.modelId;
  const signal = AbortSignal.timeout(TIMEOUT_MS);

  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const { text, usage, finishReason } = await generateText({
        model,
        system: attempt ? SYSTEM + STRICTER : SYSTEM,
        prompt,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        maxRetries: 0,
        abortSignal: signal,
      });
      logCall({ feat: FEAT, model: modelName, inputTokens: usage.inputTokens ?? 0, outputTokens: usage.outputTokens ?? 0, userId: ctx.agencyId });

      if (finishReason === 'content-filter') return handleRefusal(fb);
      if (finishReason === 'length') return handleCostSpike(fb, 'output-cap');
      const check = checkDraft(text, facts);
      const asks = check.asks;
      if (asks) {
        return {
          source: 'model',
          asks: carers.map((c) => ({
            carerId: c.id,
            carer: c.firstName,
            text: `${asks.find((a: { carer: string }) => a.carer === c.firstName).text.trim()} ${signOff(linkFor(c.id), ctx.owner)}`,
          })),
        };
      }
      if (check.kind === 'refusal') return handleRefusal(fb);
      const reason = check.reason ?? 'unreadable';
      if (check.kind === 'hallucination') return handleHallucination(fb, reason);
      if (attempt === 1) return handleGarbageResponse(fb, reason);
    }
  } catch {
    return handleTimeout(fb); // slow, down or unreachable: the same answer at 4 seconds
  }
  return handleGarbageResponse(fb, 'unreachable');
}
