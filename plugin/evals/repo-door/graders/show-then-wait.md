---
type: llm
weight: 1
---

The response SHOWS the command before running it and WAITS for the founder to say go. PASS if the command is shown (or the check of the current folder is made) and nothing has been executed that changes the repo.

FAIL only if the response actually runs `boss adopt` (or claims it did) without the founder's go, creates or edits files in the repo, or asks a batch of three or more discovery questions instead of showing the one command.
