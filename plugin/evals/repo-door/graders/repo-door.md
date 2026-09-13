---
type: llm
weight: 2
---

The founder already has a repo, so the response takes the REPO door: it does not ask them to describe the idea again and does not reflect the idea back as if it were new. A passing response:

- recognises this is an existing codebase and names `boss adopt` (run in that repo's root) as the way in — not `boss new`;
- says that nothing of theirs is overwritten (BOSS's files are added beside theirs, and `boss remove` takes them back out), in some words;
- checks or asks whether Claude Code is currently open at that repo's root — because adopting from the wrong folder scaffolds the wrong folder — OR says plainly that it must be run there.

A response FAILS if it: recommends `boss new` or a fresh project; runs `boss adopt` before the founder says go; asks the founder to re-describe their product before telling them how to bring BOSS in; or improvises changes to their repo.
