// One line per model call to .boss/cost-log.jsonl: which FEAT, which model, the agency, tokens in and
// out, what it cost. Token counts and ids only, never the prompt or the draft.
// Every model call goes through logCall; importing the provider SDK anywhere else is a bug.
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ledger = () => process.env.AI_COST_LEDGER || join(process.cwd(), '.boss', 'cost-log.jsonl');

// USD per million tokens, keyed by the name the deploy sets in ASK_MODEL.
// Last checked: 2026-09-15 by Ola, against the provider's pricing page.
const PRICE_PER_M_TOKENS: Record<string, { input: number; output: number }> = {
  'small-fast': { input: 0.80, output: 4.00 },
};

export type CostEntry = {
  ts: string; feat: string; model: string; userId: string;
  input_tokens: number; output_tokens: number; estimated_usd: number; priced: boolean;
};

export function logCall({ feat, model, inputTokens, outputTokens, userId }: {
  feat: string; model: string; inputTokens: number; outputTokens: number; userId: string;
}): CostEntry {
  const p = PRICE_PER_M_TOKENS[model];
  if (!p) console.warn(`[ai-cost] no price for "${model}" — logging at 0. Add it to the table.`);
  const rate = p || { input: 0, output: 0 };
  const usd = (inputTokens * rate.input + outputTokens * rate.output) / 1_000_000;
  const entry: CostEntry = {
    ts: new Date().toISOString(),
    feat, model, userId,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    estimated_usd: Number(usd.toFixed(6)),
    priced: Boolean(p),
  };
  try {
    mkdirSync(dirname(ledger()), { recursive: true });
    appendFileSync(ledger(), JSON.stringify(entry) + '\n');
  } catch (e) {
    console.warn(`[ai-cost] could not write ${ledger()}: ${(e as Error).message}`);
  }
  return entry;
}

// What the ledger holds for the month `now` is in, across every agency. The monthly cap reads this.
export function spentThisMonth(now = new Date()): number {
  const month = now.toISOString().slice(0, 7);
  let lines: string[];
  try { lines = readFileSync(ledger(), 'utf8').split('\n'); } catch { return 0; }
  return lines.reduce((sum, line) => {
    try {
      const e = JSON.parse(line) as CostEntry;
      return e.ts.startsWith(month) ? sum + e.estimated_usd : sum;
    } catch { return sum; }
  }, 0);
}
