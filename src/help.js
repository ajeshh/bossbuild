// src/help.js — the per-command reference, as DATA.
//
// It used to live inside cli.js, which was fine while `boss help <command>` was the only
// reader. `boss help --html` is a second reader, and the moment two surfaces describe the
// same command the copy drifts — which is the failure this repo keeps catching in its own
// docs. So the text has one home and both surfaces render it.
//
// Shape: usage (the signature), what (a sentence of what and why), examples (real, runnable),
// see (the commands someone asking this question usually needs next).

import { LEARN_CATEGORIES, SHIPPED_CLASSES, SHELF_CATEGORIES } from './learn.js';

export const HELP = {
  new: {
    usage: 'boss new <name> [--ai]',
    what: 'Scaffold a fresh project in the lightest mode (Quickstart) and register it. Adds a screen-sized CLAUDE.md, the capture surfaces, and the conscience hook; git-inits.',
    examples: ['boss new my-app', 'boss new my-app --ai   # let /read-repo tailor the scaffold'],
    see: ['adopt', 'unlock', 'map'],
  },
  adopt: {
    usage: 'boss adopt [--mode <m>] [--ai]',
    what: 'Bring BOSS into an already-started repo, non-destructively — your files are untouched, BOSS lands at the lightest register that fits. --mode mvp adopts higher when the app has earned it.',
    examples: ['boss adopt', 'boss adopt --mode mvp   # already has real users'],
    see: ['new', 'unlock'],
  },
  unlock: {
    usage: 'boss unlock <mode>   (quickstart | mvp | v1 | scale)',
    what: 'Add the next mode\'s skills/agents/loops. Additive — nothing is ever removed, and each unlock is your call. Modes scale ceremony to evidence; a project that stays in Quickstart forever is legitimate.',
    examples: ['boss unlock mvp', 'boss unlock v1'],
    see: ['map', 'status'],
  },
  status: {
    usage: 'boss status [--conscience] [--verbose]',
    what: 'This project at a glance: mode, installed layers, pinned vs current BOSS version, and any drift. --conscience shows the loop states, cohort, and recent overrides; add --verbose for the full ledger.',
    examples: ['boss status', 'boss status --conscience', 'boss status --conscience --verbose'],
    see: ['map', 'sync', 'conscience'],
  },
  board: {
    usage: 'boss board [<ID>] [--detail] [--html] [--next|--blocked|--json] [--all] [--mine]',
    what: 'A live read of what\'s in flight (Captured → Taking shape → Building → Shipped), derived from your files — never a document you maintain. Pass an ID for one card in full, or --detail for a line under every card. Deferred and dropped work is folded into Parked — decided, not queued. --html opens a visual kanban; --next/--blocked/--json are the agent-readable views.',
    examples: ['boss board', 'boss board --detail', 'boss board IDEA-004', 'boss board --next', 'boss board --html'],
    see: ['insights', 'brain'],
  },
  recap: {
    usage: 'boss recap [--days N | --since YYYY-MM-DD] [--md]',
    what: 'What happened, read back out of the records you already wrote — what landed, what you learned, what you decided, what is in flight, and whether any of it touched the riskiest assumption. Composed from the devlog, the record set and the canvas; it maintains nothing and invents nothing. --md prints paste-ready markdown for a weekly update. Empty sections print as empty, on purpose: a summary that can only go up is a comfort device.',
    examples: ['boss recap', 'boss recap --days 14', 'boss recap --md'],
    see: ['board', 'status'],
  },
  map: {
    usage: 'boss map [--next] [--all]',
    what: 'The live cheatsheet for THIS project: where you are on the ladder, what each installed skill does, and a short preview of what the next unlock adds. A pure read of your install — nothing to maintain, nothing to drift. --next expands the full list of what the next rung would add; --all also shows the post-launch skills, which stay folded until you have shipped something.',
    examples: ['boss map', 'boss map --next   # everything the next rung adds', 'boss map --all    # including the post-launch arc'],
    see: ['status', 'unlock'],
  },
  brain: {
    usage: 'boss brain [--diff|--relationship]   ·   boss brain forget --before <date>',
    what: 'The conscience\'s persistent read on this venture (its POV, in plain English). --diff shows how it evolved; --relationship shows what it said and what you did with it. forget evicts old reads (living memory, founder-invoked).',
    examples: ['boss brain', 'boss brain --relationship'],
    see: ['status', 'conscience'],
  },
  insights: {
    usage: 'boss insights',
    what: 'Read the honest trace your own work already leaves, across every project on this machine: where each loop stands (idea → canvas → build), cycle time, kill-speed. Measures graduation, never activity. Local-only — nothing is sent.',
    examples: ['boss insights'],
    see: ['board', 'list'],
  },
  id: {
    usage: 'boss id [PREFIX]',
    what: "The next free record number, computed — not counted by hand. Scans every .md under docs/ (filenames AND prose, because a number reserved in an index is taken even if no file exists yet) and returns the next one. Use it before you create a record; two files claiming one number makes every reference to it ambiguous.",
    examples: ['boss id', 'boss id IDEA'],
    see: ['records', 'board'],
  },
  records: {
    usage: 'boss records [--all | --timeline | --programs | --gists]',
    what: "Check what your docs CLAIM against what your repo actually has. A status is a claim — `shipped` means the thing exists. This reads each record's `proof:` path and says where the two stopped agreeing, in both directions: something you finished and never wrote down, or something a record says you shipped that isn't there. --all also lists records with no `proof:` to check. --gists is a different question and its own door: which IDEA and FEAT records have no chosen board line — no `gist:` at all (so `boss board --detail` reads whatever sentence opened the file) or one that still reads as a paragraph and gets cut mid-thought. Nothing there is broken, which is why it is separate from the drift findings; `/idea gist <ID>` reads the record whole and writes the line.",
    examples: ['boss records', 'boss records --all', 'boss records --gists'],
    see: ['status', 'board'],
  },
  team: {
    usage: 'boss team [add @user ["Name"] | remove @user]',
    what: 'Who\'s on the venture. Solo by default and dormant — adding a cofounder lights up the team layer (shared decisions, the partnership mentor). Keyed on GitHub identity; never fabricated.',
    examples: ['boss team', 'boss team add @octocat "Mona"'],
    see: ['board', 'list'],
  },
  credit: {
    usage: 'boss credit [--apply | --remove]',
    what: "Optional acknowledgement, and genuinely optional. BOSS never adds its name to anything you ship — that promise is the whole point of the name — so this exists only for a founder who wants to say it anyway. Previews by default; --apply adds one line to your README, --remove takes it back out. Never automatic, never offered unprompted, and never anywhere your users see it.",
    examples: ['boss credit', 'boss credit --apply'],
    see: ['remove'],
  },
  list: {
    usage: 'boss list [--prune]',
    what: "Every BOSS project connected on this machine, active first, retired ones folded quietly at the bottom. Each row's pin is read from that project's own `.boss/manifest.json` — the number `boss sync` will actually act on — and marked ⟳ when it is behind the BOSS you have installed, ↑ when it is ahead of it. Projects the registry still lists but that are no longer on disk are named separately rather than shown as live: a registry keyed by absolute path cannot see a folder being moved or deleted. `--prune` drops those leftover rows (preview first; `--apply` is the consent). It edits only the machine registry — nothing on disk is touched, because there is nothing there to touch.",
    examples: ['boss list', 'boss list --prune', 'boss list --prune --apply'],
    see: ['insights', 'status', 'changelog', 'sync'],
  },
  retire: {
    usage: 'boss retire [--undo]',
    what: 'End a project honestly — mark it retired (reversible; nothing is deleted). The /sunset skill inside Claude runs the post-mortem and harvest; this is just the clean state change.',
    examples: ['boss retire', 'boss retire --undo'],
    see: ['list', 'insights'],
  },
  sync: {
    usage: 'boss sync [--apply] [--remove] [--force]',
    what: "Pull current BOSS skills/agents/hooks into this project (the DOWN direction). Without --apply it previews the diff only. It also lists anything BOSS installed here and has since RETIRED, with what replaced it and why — but `--apply` never deletes: removal is a separate, explicit `--remove`, and something you edited is never removed at all. Only files BOSS itself stamped are ever candidates; your own skills and agents are invisible to sync — and a MANAGED file you edited after BOSS wrote it is now left alone too, reported by name rather than overwritten (`--force` takes BOSS's version, keeping a copy in `.boss/backups/`). A file BOSS has no record of writing — one predating the provenance ledger, or one that was already yours and shares a name with something BOSS ships — is reported as `? unclaimed` and backed up before being written; `--keep-mine` leaves all of those alone and applies the rest. For a reviewed, narrated update — and the actual migration to whatever replaced a retired verb — use /boss-sync inside Claude instead.",
    examples: ['boss sync', 'boss sync --apply', 'boss sync --apply --remove', 'boss sync --apply --force'],
    see: ['status', 'changelog', 'learn'],
  },
  update: {
    usage: 'boss update',
    what: "Check whether the BOSS you have INSTALLED is the latest published one, and print the exact upgrade command for how you installed it (npm, Homebrew, or a git checkout). This is the one thing `boss status` cannot tell you on its own: it compares a project against your installed package, so 'up to date' has always meant 'your project matches your install' — never 'your install is current'. Runs a single public version lookup, ONLY when you invoke it: no project data leaves your machine, and `boss status` reads the cached result rather than ever making a call itself. Offline is fine — it shrugs and tells you the last thing it knew.",
    examples: ['boss update'],
    see: ['status', 'changelog', 'sync'],
  },
  remove: {
    usage: 'boss remove [--apply] [--yes]   ·   boss remove --global [--apply]',
    what: "Take BOSS back out. Without --apply it previews only. It removes what BOSS WROTE and nothing else: files you authored are never touched, a BOSS file you EDITED is yours and is kept, your CLAUDE.md keeps everything except BOSS's marked block, and settings.json loses only BOSS's hook registrations — your permissions, your own hooks and the secret-path deny floor all stay (removing a deny would widen access on the way out). That boundary matters most in docs/, where your ideas and decisions sit in the same tree as BOSS's scaffold. `--global` is the OTHER exit: it prints the uninstall command for how you installed BOSS and lists the machine-local state in ~/.boss. Note your projects keep working after a global uninstall — the conscience hook runs from the project and doesn't call this CLI. Two things about the undo, because the honest version is not the obvious one: `git checkout .` brings back every TRACKED file, but it cannot bring back `.boss/` — BOSS gitignores its own cost log, trace and backups, so git never saw them. `--apply` therefore copies `.boss/` into ~/.boss/removed/ first and tells you where. Your conscience history is a separate matter and a reassuring one: since DEC-015 the frequency ledger and the relationship log do not live in the project at all (they are at ~/.boss/projects/<key>/, keyed to you and this project so a second checkout or a Remote Control worktree is not a stranger), so removing BOSS from this project does not touch them. `--global` is where you go to see and clear those. And because BOSS is self-hosted, its own repo is a valid target: `--apply` refuses there without `--yes`, so cleaning up after a throwaway one directory too far up can't take BOSS out of BOSS.",
    examples: ['boss remove', 'boss remove --apply', 'boss remove --global'],
    see: ['adopt', 'retire', 'sync'],
  },
  changelog: {
    usage: 'boss changelog [--since X.Y.Z] [--full] [--all]',
    what: "What changed in BOSS. Inside a project it defaults to the cut that matters — everything since THIS project's pin, which is the question you have the moment `boss status` says newer practices are available. The changelog ships inside the package, so this works from any project and is always exactly as current as your installed version. `/boss-sync` narrates from these entries; this is where they come from. Note what it can and can't tell you: it compares your project against the BOSS you have INSTALLED, so \"nothing new\" means your install and your project agree — not that your install is current. Updating the tool (`npm i -g oyeboss@latest`, or `brew upgrade boss`) is a separate step from updating a project.",
    examples: ['boss changelog', 'boss changelog --full', 'boss changelog --since 0.140.0', 'boss changelog --all'],
    see: ['sync', 'status'],
  },
  craft: {
    usage: 'boss craft [name] [--outline]',
    what: "Read BOSS's practice shelf — the craft the skills and agents are built on. The shelf ships inside the package, so it works from any project and is always exactly as current as your installed version. With no argument it lists every practice; with a name (prefixes work) it prints that one. This is BOSS's shelf, read-only — your own team's craft notes live in /practice as PRAC-NNN records. The shelf listing shows each practice's length and flags anything past 2\u00d7 the median \u2014 a shelf that only ever grows is how a toolkit becomes a framework, so those are subtraction candidates for the next refresh, and --outline maps a long one before you pull it whole.",
    examples: ['boss craft', 'boss craft testing-with-agents', 'boss craft testing', 'boss craft design-system --outline', 'boss craft deceptive-patterns --shape mobile-app', 'boss craft deceptive-patterns --surface checkout-and-pricing'],
    see: ['sync', 'learn'],
  },
  learn: {
    usage: `boss learn <path> --as <category> [--mode <mode>] [--yes]   (${LEARN_CATEGORIES.join(' | ')})`,
    what: `Promote a proven pattern UP into BOSS so every future project inherits it. Where it lands depends on the category: ${SHIPPED_CLASSES.join(', ')} go into a stage template and get registered in that stage's manifest — which is what makes them ship — so they need --mode (quickstart | mvp | v1 | scale). The shelf category (${SHELF_CATEGORIES.join(', ')}) goes into library/ and takes no --mode. Either way this writes into the BOSS SOURCE checkout — usually not the repo you're standing in — bumping its VERSION and CHANGELOG, so it names the target and asks before writing unless you pass --yes. Set BOSS_SRC to point it somewhere specific. The judgment layer over this is /boss-learn inside Claude (a two-way UP/DOWN router).`,
    examples: ['boss learn ./my-practice.md --as practices', 'boss learn ./mentor-ops.md --as agents --mode v1', 'BOSS_SRC=~/code/bossbuild boss learn ./p.md --as practices --yes'],
    see: ['sync'],
  },
  conscience: {
    usage: 'boss conscience <pause|resume|mute|unmute|status|activity>',
    what: 'Control and inspect the conscience. pause silences everything for a bounded sprint; mute turns down one nudge (say, drift) while the rest keep speaking; activity is the over-fire check; status shows what\'s open and any recorded overrides.',
    examples: [
      'boss conscience pause --for 8h',
      'boss conscience mute drift --for 7d',
      'boss conscience resume',
      'boss conscience activity',
    ],
    see: ['status', 'brain'],
  },
  version: { usage: 'boss version', what: 'Print the installed BOSS version.', examples: ['boss version'], see: [] },
};

// The glyph vocabulary, in one place (`boss help symbols`, and the HTML guide).
// Third field is TONE, not colour: the data says what a glyph means, the renderer
// decides how to paint it. It used to carry ANSI escapes, which made it unreadable
// by any surface that wasn't a terminal.
export const SYMBOLS = [
  ['✦', 'done — a thing happened and it worked', 'ok'],
  ['✓', 'passing / closed / up to date', 'ok'],
  ['⚠', 'worth a look — a soft warning, not a failure', 'warn'],
  ['⟳', 'newer BOSS practices available (drift)', 'warn'],
  ['▸', 'you are here / a section heading', 'plain'],
  ['·', 'quiet — dormant, stale, or nothing to report', 'dim'],
  ['⊘', 'retired (the record stays; only the status changed)', 'dim'],
  ['⏸', 'the conscience is paused', 'plain'],
  ['⌛', 'aging in build — open a while; finish it or /revalidate', 'plain'],
  ['↻', 'review due (a paused item\'s next_review date has passed)', 'plain'],
  ['⬆', 'priority: high', 'plain'],
  ['→', 'next / points to', 'plain'],
];

// The "I want to…" map — the one wayfinding surface that answers a QUESTION rather than
// listing a noun. It exists on the website as hand-written markup, which means the website
// lists all 48 skills to a founder who has 17 and cannot tell them which is which.
//
// So it lives here as DATA: an intent, and the skills that serve it. A renderer resolves each
// skill against what the project actually installed and can therefore say "you have this" vs
// "this arrives at MVP" — which is the whole reason an in-project guide beats a web page.
//
// Rule for adding a row: the LEFT side is the founder's words for a moment they are in, never
// BOSS's word for a feature. If the intent can only be phrased using a skill name, it is not
// an intent — it is a menu item, and `boss map` already lists those.
export const WAYFINDING = [
  ['get an idea out of my head', ['boss', 'idea', 'import']],
  ['find out whether anyone wants it', ['canvas', 'persona', 'comp-eval', 'interview', 'pretotype', 'evidence']],
  ['see something move today', ['prototype']],
  ['build the thing properly', ['spec', 'smoke', 'log', 'close']],
  ['keep the design from drifting', ['design-tokens-init', 'design-library', 'design-review', 'ux-check']],
  ['not get hacked or embarrass myself', ['red-team', 'ai-failure-states', 'trust']],
  ['put it in front of someone', ['landing', 'ship', 'onboard']],
  ['know if it is working', ['measure', 'money', 'health']],
  ['remember what I decided', ['decide', 'revalidate']],
  ['ask someone who has done this', ['consult']],
  ['understand a repo I already built', ['read-repo']],
  ['turn one real conversation into evidence', ['interview', 'research']],
  ['stop working on something', ['sunset', 'revalidate']],
  ['stay current with how BOSS builds', ['boss-sync', 'boss-learn', 'practice']],
  ['put AI in my product without regretting it', ['ai-first-init', 'ai-failure-states', 'evals']],
  ['know what the AI is costing me', ['ai-cost', 'cost-review']],
  ['decide what to build next', ['roadmap', 'revalidate']],
  ['handle something breaking in front of users', ['incident', 'trust']],
  ['get oriented for the first time', ['welcome']],
];
