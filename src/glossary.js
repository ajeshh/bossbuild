// src/glossary.js — the vocabulary lookup BOSS never had.
//
// `/welcome` defines terms inline, once, if you run it. After that a founder who meets *cohort* or
// *seam* or *stated-pain* in a status line has nowhere to go: `boss help symbols` covers the GLYPHS
// and `boss help <command>` covers the COMMANDS, and neither covers the words. That gap is widest for
// exactly the cohorts BOSS says it serves — `first-product` and `non-tech-founder`, who are the least
// likely to have met "pretotype" and the least likely to ask.
//
// The house rule (README, /welcome): **assume intelligence, never assume knowledge.** So a definition
// here explains the WORD, never the person — no "simply", no "just", no "as you probably know".
//
// It is not a skill and not a new command (EVID-001: compose + SUBTRACT). It is `boss help`
// answering a kind of question it already looked like it would answer.
//
// `see` is the surface where the term is actually MET, not a related-reading list — a definition that
// ends nowhere is half an answer.

// Terms that are ALSO skills (canvas, spec, smoke, pretotype…) belong here anyway: someone asking
// "what is a canvas" wants the idea, and `boss help canvas` used to answer only "it runs in Claude".
// Both halves now print — the concept, then where to run it.
export const GLOSSARY = {
  mode: {
    what: 'How much ceremony this project carries. Four of them, in order: Quickstart (capture an idea), MVP (build the first working version), V1 (ship it properly), Scale (customers are real, coordination is the bottleneck).',
    more: 'You climb with `boss unlock <mode>`, and only when the work has earned it. Staying in Quickstart forever is a legitimate outcome, not a failure.',
    see: 'boss status',
  },
  rung: {
    what: 'One step of the mode ladder. Used interchangeably with "mode" — "this rung" means the mode you are in right now.',
    see: 'boss map',
  },
  quickstart: { what: 'The first mode. Capture an idea and keep adding to it, with almost no ceremony — no specs, no build gate, no session ritual.', see: 'boss map' },
  mvp: {
    what: 'Minimum viable product — the smallest version that actually proves the idea, in front of real people. In BOSS it is also the second mode: the one that adds a spec, a smoke check, a devlog and a session-end ritual.',
    more: 'The word gets used for "version one, but worse". It is not that. It is the smallest thing that answers the riskiest question you have.',
    see: 'boss unlock mvp',
  },
  conscience: {
    what: 'The part of BOSS that speaks up unprompted while you work — one line, at a moment it can justify, never a gate. It is BOSS\'s principles voiced when they are relevant, rather than filed in a document you read once.',
    more: 'It can be turned down or off: `boss conscience mute <moment>` for one nudge, `boss conscience pause --for 8h` for all of it.',
    see: 'boss status --conscience',
  },
  moment: { what: 'One specific thing the conscience can say — the drift check, the "what does this prove?" caution, the graduation nudge. Each can be muted on its own.', see: 'boss conscience mute' },
  loop: {
    what: 'A named pattern the conscience watches for, with a condition that opens it and a condition that closes it. `focus-loop` watches for four things started and none finished; `drift-loop` watches for work drifting from the risk you named.',
    more: 'A loop opening does not mean you did something wrong — it means a question is now worth asking.',
    see: 'boss status --conscience',
  },
  cohort: {
    what: 'Which kind of founder you told BOSS you are — first-product, non-tech-founder, returning-founder, and so on. It tunes how much BOSS explains, never what it will let you do.',
    more: 'Optional, editable, and skippable. It lives in `.boss/config.json` and you can change it any time.',
    see: '.boss/config.json',
  },
  capture: { what: 'Writing an idea down as a durable record before deciding anything about it. The point is that ideas arrive at bad times and get lost — capture is cheap and deciding is not.', see: '/idea' },
  canvas: {
    what: 'A one-page pressure-test of an idea as a business — who it is for, what it promises, what has to be true, and the riskiest assumption underneath. BOSS uses a humane version that also asks who it could harm.',
    see: '/canvas',
  },
  pretotype: {
    what: 'A test of whether anyone WANTS the thing, run before you build it. A landing page for a product that does not exist, a manual service behind a form, a sign-up button that goes nowhere but counts the clicks.',
    more: 'Different from a prototype: a prototype tests whether you can build it, a pretotype tests whether you should. Coined by Alberto Savoia.',
    see: '/pretotype',
  },
  prototype: { what: 'A rough, runnable version you can click through — built to find out whether the thing works and how it feels, not to be kept.', see: '/prototype' },
  spec: { what: 'The point where "we should build this" becomes "here is how we will know it is done" — a goal, acceptance criteria, a check that proves it, and the paths that must not break.', see: '/spec' },
  smoke: { what: 'The cheapest possible "is the app even working right now?" check. Not a test suite — one command you run before committing, where red is information rather than failure.', see: '/smoke' },
  evidence: {
    what: 'Something a real person actually said or did about your idea, written down and honestly graded. Not your confidence, not a compliment, not a hunch.',
    more: 'BOSS grades it on three rungs — see `boss help stated-pain`.',
    see: '/evidence',
  },
  'stated-pain': { what: 'The weakest grade of evidence: somebody TOLD you they have this problem. Real, and worth recording — but people are generous in conversation, so it proves less than it feels like it does.', see: '/evidence' },
  'observed-behavior': { what: 'The middle grade: you WATCHED somebody do something — use a workaround, hack around the gap, pay for a worse alternative. Much stronger than being told, because nobody was being polite.', see: '/evidence' },
  commitment: { what: 'The strongest grade: somebody gave up something that costs them — money, time, their reputation by referring you. The only grade that survives a bad mood.', see: '/evidence' },
  drift: {
    what: 'Something quietly moving away from what it was meant to track. About YOUR work: what you are building has stopped addressing the risk you named. About BOSS: newer practices exist than the version this project is pinned to.',
    more: 'The two are unrelated and BOSS says which it means. The first is a question for you; the second is `boss sync`.',
    see: 'boss status · boss sync',
  },
  seam: { what: 'A cheap, reversible half of something you have not earned yet — the part worth doing now so the expensive part stays possible later. BOSS names at most one at a time.', see: 'boss status' },
  headway: { what: 'Plain progress, stated without flattery: what you last shipped and how long ago. BOSS shows it because a build surface that only ever warns is an unfair picture of the work.', see: 'boss status' },
  pin: { what: 'The BOSS version this project is tracking. It does not move on its own — `boss sync` moves it, deliberately, showing you the diff first.', see: 'boss changelog' },
  board: { what: 'Everything in flight, read straight from your files rather than a list you maintain: Captured → Taking shape → Building → Shipped. Change the work and the board changes.', see: 'boss board' },
  idea: { what: 'A captured thought, `IDEA-NNN`. A living document — you re-open it and add to it as the idea sharpens, rather than filing it once.', see: '/idea' },
  feat: { what: 'A feature being built, `FEAT-NNN`. It has a goal, acceptance criteria and a check — the contract that says what "done" means before you start.', see: '/spec' },
  dec: { what: 'A decision record, `DEC-NNN` — a load-bearing or hard-to-reverse call, with why you made it and how reversible it is. So future-you and a cofounder read the reasoning instead of guessing at it.', see: '/decide' },
  evid: { what: 'An evidence record, `EVID-NNN` — one signal from one real person, graded. See `boss help evidence`.', see: '/evidence' },
  adopt: { what: 'Bringing BOSS into a repo you already started, without overwriting anything. The counterpart to `boss new`, which makes an empty one.', see: 'boss adopt' },
  unlock: { what: 'Climbing a rung — adding the next mode\'s skills and agents. Additive: nothing is removed, and it is always your call.', see: 'boss unlock' },
  skill: {
    what: 'Something you run INSIDE Claude Code by typing a slash and its name — `/idea`, `/spec`, `/canvas`. Different from a `boss` command, which you run in your terminal.',
    more: 'The two languages are the thing most worth learning early: `boss …` in the shell, `/…` in Claude.',
    see: 'boss map',
  },
  agent: { what: 'A named role Claude takes on for a piece of work. BOSS ships two kinds: BUILDERS make the product (coder, tester, designer), MENTORS coach you (architect, capital, cofounder).', see: 'boss map' },
  hook: { what: 'Something BOSS runs automatically at a moment in your session, rather than when you ask. The conscience is one. Most others ship dormant and turn on only if you want them.', see: 'boss help hooks' },
};

// Alias → canonical. The word a founder types is not always the word the entry is filed under.
const ALIASES = {
  modes: 'mode', rungs: 'rung', stage: 'mode', level: 'mode',
  skills: 'skill', agents: 'agent', hooks: 'hook', loops: 'loop', moments: 'moment',
  ideas: 'idea', feats: 'feat', decs: 'dec', evids: 'evid', 'evid-grade': 'stated-pain',
  'stated pain': 'stated-pain', statedpain: 'stated-pain',
  'observed behavior': 'observed-behavior', 'observed-behaviour': 'observed-behavior',
  'observed behaviour': 'observed-behavior', observed: 'observed-behavior',
  committed: 'commitment', boards: 'board', pins: 'pin', seams: 'seam',
  cohorts: 'cohort', 'the conscience': 'conscience', ceremony: 'mode',
  'minimum viable product': 'mvp', v1: 'mode', scale: 'mode',
};

/** Look a term up. Case- and alias-tolerant; returns null when BOSS has no entry. */
export function lookup(term) {
  if (!term) return null;
  const k = String(term).toLowerCase().replace(/^\//, '').trim();
  const canonical = GLOSSARY[k] ? k : ALIASES[k];
  return canonical && GLOSSARY[canonical] ? { term: canonical, ...GLOSSARY[canonical] } : null;
}

/** Every term worth listing, alphabetical. Aliases are lookup sugar, not entries. */
export function terms() {
  return Object.keys(GLOSSARY).sort();
}
