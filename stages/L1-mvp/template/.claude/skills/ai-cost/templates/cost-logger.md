# `/ai-cost` — the call logger (bundled resource)

> Loaded **on demand** from step 5 of `SKILL.md`, never at skill-trigger time. Two implementations of
> the same ~30-line shape; use the one matching the project's stack and delete the other.

## The price table is the part that rots

**Do not ship a price table with model names baked in.** BOSS's `boss craft model-routing`
rule for any shipped artifact is *say nothing — omit the model key and inherit*, because a name in a
template is wrong the week a new model lands. A **cost logger is the one place a name is unavoidable**
(you cannot price a call without knowing what you called), so the discipline moves instead to:

- **The founder fills the table from the provider's current pricing page, at wire-time.** Not from
  this file, not from the model's memory — both are stale by construction.
- **One row per model the project actually calls.** Not a catalogue.
- **A dated comment on the table**, so the next reader knows how much to trust it.
- **Unknown model → price 0 and a loud entry**, never a silent guess. A cost log that quietly
  under-reports is worse than none.

## TypeScript

```typescript
// src/lib/ai-cost-logger.ts
import { appendFileSync } from 'node:fs';
import { join } from 'node:path';

const LEDGER = join(process.cwd(), '.boss', 'cost-log.jsonl');

// Prices in USD per million tokens. FILL FROM YOUR PROVIDER'S PRICING PAGE.
// Last checked: <YYYY-MM-DD by whom>  ← update this line whenever you touch the table.
const PRICE_PER_M_TOKENS: Record<string, { input: number; output: number }> = {
  // '<the model id you actually call>': { input: 0.00, output: 0.00 },
};

export function logCall({ feat, model, inputTokens, outputTokens, userId }) {
  const p = PRICE_PER_M_TOKENS[model];
  if (!p) {
    // Never guess a price. An unpriced call is recorded as unpriced, loudly.
    console.warn(`[ai-cost] no price for "${model}" — logging at 0. Add it to the table.`);
  }
  const rate = p || { input: 0, output: 0 };
  const usd = (inputTokens * rate.input + outputTokens * rate.output) / 1_000_000;
  const entry = {
    ts: new Date().toISOString(),
    feat, model, userId,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    estimated_usd: Number(usd.toFixed(6)),
    priced: Boolean(p),
  };
  appendFileSync(LEDGER, JSON.stringify(entry) + '\n');
  return entry;
}
```

## Python

```python
# src/ai_cost_logger.py
import json, os, datetime, warnings

LEDGER = os.path.join(os.getcwd(), ".boss", "cost-log.jsonl")

# Prices in USD per million tokens. FILL FROM YOUR PROVIDER'S PRICING PAGE.
# Last checked: <YYYY-MM-DD by whom>  ← update this line whenever you touch the table.
PRICE_PER_M = {
    # "<the model id you actually call>": {"input": 0.00, "output": 0.00},
}

def log_call(feat, model, input_tokens, output_tokens, user_id=None):
    p = PRICE_PER_M.get(model)
    if p is None:
        warnings.warn(f'[ai-cost] no price for "{model}" — logging at 0. Add it to the table.')
    rate = p or {"input": 0, "output": 0}
    usd = (input_tokens * rate["input"] + output_tokens * rate["output"]) / 1_000_000
    entry = {
        "ts": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "feat": feat, "model": model, "user_id": user_id,
        "input_tokens": input_tokens, "output_tokens": output_tokens,
        "estimated_usd": round(usd, 6),
        "priced": p is not None,
    }
    with open(LEDGER, "a") as f:
        f.write(json.dumps(entry) + "\n")
    return entry
```

## Wiring rules

- **The wrapper is the only path to the SDK.** Make bypassing it a bug: a lint rule, or a review note
  saying *"if you imported the provider SDK directly, that's a bug — go through `lib/ai-cost-logger`."*
  A logger with three call sites around it measures nothing.
- **Privacy (domain-expert, and any health / legal / financial project):** this records token counts
  and metadata, **not prompt or response content**. Keep it that way. If you need content for
  debugging, put it in a separate file with explicit consent and a retention window, and keep it out
  of any shared log.
