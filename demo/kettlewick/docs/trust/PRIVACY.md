---
id: privacy
type: trust
owner: "@marta"
status: active
updated: 2026-09-17
---

# Privacy — Kettlewick

Kettlewick finds cover for a visit when a carer can't make it. To do that it needs to know which
visits need cover, which carers could take them, and how to text those carers. It needs nothing
else, so it holds nothing else. This page says what it holds, why, for how long, who else sees it,
and how to have it deleted.

This is our own plain account, not legal advice. A lawyer reads it before we sign a written
agreement with an agency (the questions we'll ask are at the bottom).

## What we hold, and why

**About the agency owner:** your name, email and phone number, to sign you in and reach you. When
card payments go live (FEAT-003), the card is held by the payments provider, not by us.

**About carers:** first name, surname and mobile number, the area they're based in, and which visits
they've said yes or no to. The number is how the ask reaches them. The area is how we pick the three
who could take a visit. Yes and no let the owner see who covered it. We never read a carer's location
(DEC-003), and we never rank carers by who says yes.

**About the people being visited (the agency's clients):** from the schedule you upload, we keep
each visit's day, time and area and the client's first name, so a carer knows whose visit it is when
they open the ask. **We don't import the address or notes columns.** If your spreadsheet has them,
they're skipped at upload and never stored.

**What we don't collect:** no location, no analytics or tracking on the app, no cookies beyond the
one that keeps you signed in, no contact lists, and no recordings.

## How long we keep it
- **The schedule:** replaced each time you upload a new one. The old one is deleted, not archived.
- **Asks and answers:** 90 days, so you can look back over a quarter. Then they're deleted.
- **Server logs:** 14 days. They hold agency ids and errors, not texts.
- **The AI cost log:** agency ids and counts of words in and out. It never holds a name or a text.
- **If you leave:** everything about your agency is gone within a day, texts included (FEAT-006).

## Who else sees it
Three other companies handle some of this for us today, and a fourth (card payments) will when FEAT-003 goes live. They're listed with exactly what each one gets in
[SUBPROCESSORS.md](SUBPROCESSORS.md). The one that's new is the **model provider**. Since 2026-09-19
it drafts the text that goes to the three carers. It gets the visit's day, time and area and the three carers'
first names. **It never gets a client's name, address or any note about their care** (DEC-005). The
prompt is built in code from those four things, and our tests check it on every run.

The model provider's training on what we send is **off**. It's off by default on its business terms,
and Ola confirmed the setting in the provider's console (data settings) on 2026-09-17. The provider
keeps what we send for up to 30 days for abuse checks, then deletes it. We can't make that shorter
at our size, which is one reason we send so little.

## Deleting your data
- **An agency:** Settings → Leave Kettlewick. One tap and a confirm, and everything is gone within a day.
  That includes the texts held by the text provider; we ask them to delete and check that they did.
  What the model provider holds expires on its own within 30 days. It never included a client.
- **A carer:** ask the agency to remove you, or text the Kettlewick number "delete me" and we'll do
  it within a day and tell the agency. Your past yes/no answers go with you.
- **A client or family member:** the agency holds your details; we hold a first name and visit
  times. Ask the agency, or text us, and we'll remove your visits within a day.

## Questions for counsel (before the first written agreement)
- We act for the agency, which decides what's in the schedule. Does that make us its processor,
  and what does our agreement with each agency need to say?
- A home-care visit implies something about someone's health. Does the first name plus visit times
  count as health data, and what follows if it does?
- The model provider processes outside the UK. Do its standard terms cover the transfer, and do we
  need to tell agencies separately?
- Do we need a data-protection impact assessment at nine agencies, or at a size we can name?

## Contact
Text the Kettlewick number you already have, or email the address on your invoice. Marta or Ola
answers, usually the same day.
