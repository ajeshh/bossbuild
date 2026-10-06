#!/usr/bin/env node
// Is it alive? One visit goes uncovered, three carers are asked, the first yes holds it, the owner
// confirms. The ask's template comes out, and a prompt built from a full spreadsheet row carries no
// client (FEAT-007's smoke check). No install, no network, no model. Exits 0 or 1.
import { answer, confirm, openCover, planAsk } from '../src/rota/cover.js';
import { templateAsks, toPromptFacts } from '../src/ask/facts.js';

const carers = ['Priya', 'Sam', 'Dee'].map((n) => ({ id: n.toLowerCase(), firstName: n, area: 'Church End', days: ['mon'] }));
const visit = { id: 'v1', day: '2026-09-21', start: '09:00', end: '09:45', area: 'Church End', carerId: null };
const sunday = new Date(2026, 8, 20, 18, 50);

try {
  const plan = planAsk({ carers, visits: [visit] }, visit, sunday);
  if (plan.to.length !== 3) throw new Error(`asked ${plan.to.length}, expected 3`);
  const { cover } = answer(openCover(plan), plan.to[0].id, true);
  if (confirm(cover).status !== 'covered') throw new Error('the confirm did not cover the visit');

  const row = { ...visit, client: 'Mrs Halloran', address: '14 Orchard Way', note: 'hoist, two carers' };
  const facts = toPromptFacts(row, plan.to, sunday);
  const prompt = JSON.stringify(facts);
  for (const s of ['Halloran', 'Orchard', 'hoist']) if (prompt.includes(s)) throw new Error(`"${s}" reached the prompt`);
  const [first] = templateAsks(facts, plan.to, (id) => `/#/ask/v1/${id}`, 'Marta');
  if (!first.text.includes('tomorrow at 9')) throw new Error('the template ask lost the time');

  console.log('smoke: ok — a visit was asked, held and covered; the ask carries no client');
} catch (e) {
  console.error(`smoke: failed — ${e.message}`);
  process.exit(1);
}
