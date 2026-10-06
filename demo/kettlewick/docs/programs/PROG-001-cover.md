---
id: PROG-001
type: program
owner: product-lead
status: active
created: 2026-07-12
graduated_from: cover
gist: Getting a visit covered when a carer drops out — the ask, the Monday view, the pay, the quiet hours and the way out. One promise across five features, so its rules live here once.
---

# PROG-001 — Cover

Five features came from one sentence in the canvas — *an owner finds cover in minutes, not an hour
on the phone* — and kept restating the same two rules in each spec. They live here now.

## The rules every cover feature keeps

- **Nothing sends in quiet hours** (8pm–6:30am). A late cancellation waits for morning and says so
  to the owner (FEAT-005 built it; every new send inherits it).
- **No guilt, ever.** A carer can say no without a reason; an agency can leave in one tap (FEAT-006).

## Tasks — too small to ship alone

- [ ] **C1** · The ask says the visit's time in the carer's own words ("tomorrow, 7am"), not a timestamp.
- [x] **C2** · The Monday view and the cover flow use the same word for an empty visit: *uncovered*.

## Log

- **2026-07-12** — graduated from `cover` when FEAT-005's quiet-hours rule got copied into a third spec.
