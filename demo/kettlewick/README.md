# Kettlewick — the demo venture

**Kettlewick is fictional.** A home-care shift-cover venture that does not exist, run by people who do
not exist, with rivals that do not exist. Every file in this folder is in the exact shape the
shipped BOSS verbs write (`/idea`, `/canvas`, `/persona`, `/evidence`, `/decide`, `/log`,
`/comp-eval`, `/trust`, `/health`, `/measure`, `boss team add`), so that `scripts/gen-demo.js` can
hand the folder to the same renderers an install runs — `boss playbook`, `boss design`,
`boss board --html` — and publish the result at `oyeboss.build/demo/`.

Rules for editing it:

- **No real person.** No name, photo or quote of anyone who exists. `photo: unknown` everywhere —
  a fictional founder gets no face, because a drawn stand-in is what the playbook refuses.
- **No real company as a rival.** Shiftwise, CareSheet and the phone tree are fiction.
- **Fully filled.** A hole on the demo is a bug; `npm run check:demo` fails on one. When a new
  chapter or record type ships, add its record here in the same commit.
- **Shapes, not prose.** Copy the shape from the shipped skill's template; the renderers read
  fields, headings and tables, not intent.
