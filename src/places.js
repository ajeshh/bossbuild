// places — where a project's records live: each folder, the verb that writes it, and one line on
// what a record there IS, grouped by what the founder is doing. One list for every page that
// shows the tree: the demo's "Where things live" (scripts/gen-demo.js) and the founder's own home
// (src/home.js, IDEA-144). Moved here from gen-demo so the two can't describe a folder differently.
// The lines are BOSS's description of its record classes; what is ON disk is always read.

export const GROUPS = [
  { key: 'idea', title: 'The idea, and what you decided', lead: 'One living doc per idea, a canvas that pressure-tests it, a build contract when it earns one, and every load-bearing call with the signal that would prove it wrong.',
    folders: ['docs/ideas', 'docs/decisions', 'docs/programs', 'docs/roadmap'] },
  { key: 'people', title: 'The people — real and drawn', lead: 'Who it is for as a persona with a ledger that says how much of it is real, and what real people actually said or did, graded — a compliment never reads as a receipt.',
    folders: ['docs/personas', 'docs/evidence', 'docs/team'] },
  { key: 'field', title: 'The field, and what you dropped in', lead: 'Rivals with a checked date and the honest "why they might win"; your own decks and reports, dated on the way in, so a figure from March is never a fact about today.',
    folders: ['docs/competition', 'docs/source', 'docs/dossier'] },
  { key: 'made', title: 'How it looks and sounds', lead: 'The brand as a living doc that starts nascent; the design system as tokens, a style guide, components with usage pages, patterns and flows — each with the decision that chose it.',
    folders: ['docs/brand', 'docs/design', 'docs/design/components', 'docs/design/icons', 'docs/design/library', 'docs/design/reviews', 'docs/product'] },
  { key: 'going', title: 'How it is going', lead: 'After the first user: one activation metric, one retention curve, a dated health verdict that defaults to pre-fit, and the trust page a buyer can read. The story so far, one entry a session.',
    folders: ['docs/health', 'docs/measure', 'docs/onboard', 'docs/money', 'docs/cost-reviews', 'docs/trust', 'docs'] },
  { key: 'checked', title: 'How it is checked', lead: 'What tried to break it before a user did, what the AI is graded against, whether the work still serves the bet — and the patterns and craft sorted out of the work, so the next build starts ahead.',
    folders: ['docs/red-team', 'docs/evals', 'docs/drift-audits', 'docs/extractions', 'docs/practices'] },
  { key: 'machine', title: 'The machine', lead: 'What BOSS installed for the host and the state it keeps for itself — local, never in the repo, and never the founder\'s to maintain.',
    folders: ['.claude', '.boss'] },
];

export const WRITES = {
  'docs': { verbs: ['/log', '/close'], line: 'the devlog (what landed, what surprised you, one entry a session), the brand doc, the resume the next session reads first' },
  'docs/ideas': { verbs: ['/idea', '/canvas', '/spec'], line: 'IDEA-NNN — a living idea doc with a sharpening current shape and an append-only capture log; the canvas as thirteen cells; FEAT-NNN — the build contract with acceptance criteria and the paths that must not break' },
  'docs/programs': { verbs: ['/idea', '/spec', '/close'], line: 'PROG-NNN — a program, when work spreads past one idea: its rules, its open tasks, the ideas and features that belong to it' },
  'docs/roadmap': { verbs: ['/roadmap'], line: 'ROADMAP-<date> — a small bet-list with a fixed appetite, thrown away and redrawn; NO-LIST.md — what is deliberately not being built, each with the trigger that would re-open it' },
  'docs/decisions': { verbs: ['/decide'], line: 'DEC-NNN — context, decision, why, and a falsifier with a date; superseded, never edited' },
  'docs/personas': { verbs: ['/persona'], line: 'one persona per file: who, context, jobs, pains, values, what you don\'t know yet — and a ledger, synthetic vs real, that moves as evidence lands' },
  'docs/evidence': { verbs: ['/evidence', '/interview'], line: 'EVID-NNN — one signal per file, dated, graded stated-pain → observed-behavior → commitment, tied to the assumption it bears on' },
  'docs/team': { verbs: ['boss team add'], line: 'one person per file — the specific thing seen, built, sold or lived; what they bring and don\'t; a role you need and don\'t have, written plainly' },
  'docs/competition': { verbs: ['/scout market'], line: 'the field as one table, one file per rival with where it breaks and how they do it, every row with a checked date' },
  'docs/source': { verbs: ['/inbox'], line: 'your own material — a deck, a report, a saved page — dated in the name; /inbox reads it and offers the records it could fill' },
  'docs/dossier': { verbs: ['/consult'], line: 'the mentors\' positions, dated — the capital mentor\'s not-yet with its reason is what the playbook quotes as the ask' },
  'docs/brand': { verbs: ['/landing'], line: 'the mark, when there is a file — the brand doc itself lives beside the devlog' },
  'docs/design': { verbs: ['/design-tokens-init', '/design-review'], line: 'tokens.json, the style guide, components, patterns, flows, the reviews — the design space is a read of these' },
  'docs/design/components': { verbs: ['/design-review'], line: 'one usage page per component, written at its review — when to use it, when not' },
  'docs/design/icons': { verbs: ['/design-review'], line: 'the icon set as SVG files; the design page draws them from here and copies them as a sprite' },
  'docs/design/library': { verbs: ['/design-tokens-init'], line: 'the component manifest — what exists, so the second button is never invented' },
  'docs/design/reviews': { verbs: ['/design-review'], line: 'one review per FEAT or date — the visual system, the flows and the five states, before the code or after it' },
  'docs/product': { verbs: ['/spec'], line: 'JOURNEY.md — the flows as a founder would walk them, written at the first flow' },
  'docs/health': { verbs: ['/health'], line: 'HEALTH-<date> — a verdict, dated: pre-fit by default, the curve when there is one, the one next move' },
  'docs/measure': { verbs: ['/health'], line: 'MEASURE-<date> — the one activation metric, the one retention curve, at most ten events, the humane note' },
  'docs/onboard': { verbs: ['/onboard'], line: 'ONBOARD-<date> — the aha-moment read from who stayed, the path to it, and the onboarding you do by hand for the first users' },
  'docs/money': { verbs: ['/money'], line: 'MONEY-<date> — where the money stands: the first dollar and its EVID, then upgrades, dunning and raises, done humanely' },
  'docs/cost-reviews': { verbs: ['/ai-cost'], line: 'REVIEW-<date> — the AI spend against the budget, the surprises, and the gross margin' },
  'docs/red-team': { verbs: ['/red-team'], line: 'RT-<date> — an AI feature run against the known attacks, and the pre-ship pass over money, destructive and negative paths' },
  'docs/evals': { verbs: ['/evals'], line: 'one eval set per AI-mediated FEAT — the cases, graded pass or fail, sorted by how it fails' },
  'docs/drift-audits': { verbs: ['/drift-deep'], line: 'DRIFT-<date> — the whole project read against the riskiest assumption: is the work testing it, or building around it' },
  'docs/extractions': { verbs: ['/extract'], line: 'EXTR-NNN — a pattern sorted out of the work, sent up to the shared practice or down into the app\'s own core' },
  'docs/practices': { verbs: ['/practice'], line: 'PRAC-NNN — a craft learning about building with AI, attributed, with a date to re-check it' },
  'docs/trust': { verbs: ['/trust'], line: 'TRUST.md — what you collect, who processes it, how someone reaches you about their data; one honest paragraph' },
  '.boss': { verbs: ['boss'], line: 'the stamp, the config, the conscience\'s read on the venture, the rendered pages — machine state, gitignored' },
  '.claude': { verbs: ['boss new', 'boss unlock'], line: 'agents, skills, hooks and rules for the host — laid down by mode, only what the venture has earned' },
};

// The files a founder opens by name, not by folder — the ones a new session reads first.
export const KEY_FILES = [
  { path: 'CLAUDE.md', line: 'how the AI works in this project — the rules it reads every session' },
  { path: 'docs/RESUME.md', line: 'where things stand: state, next tasks, open decisions — /close writes it' },
  { path: 'docs/devlog.md', line: 'what landed, one entry a session — /log writes it' },
  { path: 'docs/BRAND.md', line: 'the name, the voice, the accent the pages use' },
];
