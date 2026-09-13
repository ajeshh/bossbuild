---
type: llm
weight: 1
---

If the response names a BOSS slash command at all, it names it AFTER saying the step in plain words — as the name for what was just described ("BOSS calls this an interview; `/interview prep` next time if you want it directly") — and it names at most two commands in total. PASS also if no command is named.

A response FAILS if it opens with a slash command, if a slash command is the first concrete thing it says, or if it names three or more slash commands.
