---
id: TEAM
type: index
owner: "@you"
status: active
---

# Team — one file per person

Who is building this, written so a stranger could believe it. One file each — founder, cofounder,
first hire, advisor — in your own words, three short sections. `boss playbook` renders each as a
card under **Team**, and draws *who is missing* as a question until you answer it.

`boss team add @handle "Name"` writes the stub for a cofounder; write your own by copying the shape
below to `docs/team/<your-handle>.md`.

```markdown
---
id: person
type: person
name: <Name>
handle: "@<github-username>"
role: founder            # founder | cofounder | team | advisor | missing (a role you need and don't have — the name is the role)
photo: unknown           # a file beside this one (./name.jpg) — your choice to add; no file, no face
status: active
---

# <Name> — <role>

## The specific thing
<the one thing seen, built, sold or lived that makes this venture believable from you — not a CV>

## What they bring, and don't
- **Brings:** <two or three things, plainly>
- **Doesn't:** <the gap you'd want a cofounder or a hire to fill>

## Bio
<three lines, first person or third — the ones you'd want under your name on a slide>
```

**A photo is a choice.** The page you paste into a deck will carry it. Leave `photo: unknown` and
the card shows the name; BOSS never draws a stand-in face. Files in this folder commit with the
repo — a cofounder who clones sees them.
