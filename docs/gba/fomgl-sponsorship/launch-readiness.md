# FoMGL Sponsorship — Launch Readiness

Status of the campaign as of **2026-08-28**. Read this before sending anything.

## Headline: the timeline in this kit no longer fits

FoMGL [EVENT_YEAR] appears to run **September 29 – October 2, 2026**. That is
**~32 days out**, not the eight weeks the run-up in `README.md` and
`social-and-campaign-calendar.md` assume.

Those calendars were written for a standard eight-week cycle. Do not run them as
written — use the compressed sprint below, and expect to skip the slow warming
plays (the LinkedIn six-step ladder in particular needs three weeks it no longer
has for anyone not already connected).

## What is known — and how much to trust it

**None of the following is verified.** `gbaglobal.org` is unreachable from this
environment, so every item below comes from third-party search summaries, not the
official prospectus. Treat it as a starting point for confirmation, not as fact.
**Nothing here is cleared to appear in outbound.**

| Item | Unverified value | Confirm against |
|---|---|---|
| Event name | Future of Money, Governance & the Law | gbaglobal.org/fomgl/ |
| Dates | September 29 – October 2, 2026 | Official prospectus |
| Format | Multi-city series: Washington DC **and** New York | Official prospectus |
| Venues | U.S. Capitol, National Press Club (DC); United Nations HQ (NY) | Official prospectus |
| Theme | AI, blockchain, and quantum in financial services | Official prospectus |
| A keynote | Charles Hoskinson (Cardano) | GBA confirmation |
| A committed sponsor | Mortar Strategies | GBA confirmation |
| Attendee pricing (NY) | Conference $279 · Gala $119 · VIP $1,125 | Ticket page |
| Sponsorship contact | events@gbaglobal.org | GBA |

### Corrections already applied to the kit

- **Conference name was wrong throughout.** The kit said "Future of Money,
  Government & Law"; it is "Future of Money, **Governance & the** Law". Fixed in
  all seven files. Note the `gba-lead-qualifier` skill reference carries the same
  error and should be corrected at the source.
- **"Annual conference" → "conference series."** The event spans two cities and
  multiple venues, which changes the pitch: sponsors are buying into a series,
  not a single room.

### Placeholder structure needs updating for a multi-city event

`[VENUE_NAME]` and `[VENUE_CITY]` are single-value tokens. For a DC + NY series
they should become:

| New token | Purpose |
|---|---|
| `[DC_DATES]`, `[NY_DATES]` | Per-city dates |
| `[DC_VENUES]`, `[NY_VENUES]` | Per-city venues |
| `[SERIES_DATES]` | Full span, for the one-line version |
| `[CITY_SCOPE]` | "Washington DC and New York", for prose |

This matters commercially: if tiers are sold per-city or as a series pass, the
tier table in `sponsor-one-pager.md` needs a column for it.

## Blockers — why outreach cannot start yet

Each of these independently prevents sending. None can be resolved from here.

1. **No sponsorship tier names or pricing.** The entire offer is unknown. Attendee
   ticket prices are not sponsorship prices and must not be used as a proxy.
2. **No target list.** Zero prospect names, companies, or email addresses. The
   GBA Web3 Solutions Directory — the primary sourcing play in
   `icp-and-target-list.md` — is on the unreachable domain.
3. **No audience figures.** `[ATTENDEE_COUNT]`, `[GOV_ATTENDEE_PCT]`,
   `[AGENCY_COUNT]`, `[COUNTRY_COUNT]` are the substance of the pitch. Without
   them the emails have no argument, and inventing them is the one thing this kit
   forbids.
4. **No sending authorization.** Cold outreach on GBA's behalf is outward-facing
   and effectively irreversible. It needs an explicit go-ahead on a named list
   and approved copy, plus a decision on sending identity and domain.
5. **No sponsor deadline.** The scarcity sequence (E) and every deadline line
   depend on `[SPONSOR_DEADLINE]`. The kit's rule stands: never assert a deadline
   that is not real.

## What is needed to launch

Provide these and the campaign can start the same day:

- [ ] Official sponsorship prospectus — tier names, prices, benefits, inventory
- [ ] Verified audience figures, ideally split DC vs NY
- [ ] Sponsor commitment deadline
- [ ] Target list, or access to the Web3 Directory export
- [ ] Sending identity: which address, which domain, and whether volume warrants
      a warmed sending domain rather than a personal inbox
- [ ] Explicit approval to send, and whether you want to review each batch or
      only the first
- [ ] Confirmation of whether tiers are per-city or series-wide

## Compressed sprint — if launching now

Replaces the eight-week plan. Assumes a ~32-day runway and shrinking.

| Days out | Focus |
|---|---|
| 32–28 | Fill placeholders from the prospectus. Build the list. Warm past sponsors and current members **by phone**, not sequence — at this range calls beat email. |
| 28–21 | Renewal (B) and member (C) sequences compressed to 3 touches over 7 days. Open general prospectus. |
| 21–14 | Cold sequence (A) compressed to 4 touches over 10 days; drop touch A4. Directory Tier-1 prospects only — there is no time to work Tier 2 properly. |
| 14–7 | Call blitz on everything warm. Add-on offers to committed sponsors. |
| 7–0 | Scarcity sequence (E) if the deadline is real. Personal calls only. |
| Post | Debrief every sponsor. Build the first-refusal list for the next cycle — this is where the real return on this kit starts. |

### What to cut, deliberately

At 32 days the honest move is narrowing, not compressing everything:

- **Cut the LinkedIn ladder for cold prospects.** Six steps needs three weeks.
  Keep it only for prospects already connected, and start at step 4.
- **Cut Tier-3 nurture entirely.** Prospectus link and nothing else.
- **Keep the organic posts.** They are the cheapest thing here and they run in
  parallel with everything.
- **Protect the renewal motion.** Past sponsors are the highest close rate in the
  kit and the only segment where 32 days is comfortably enough time.
