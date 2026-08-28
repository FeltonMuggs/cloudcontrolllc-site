# FoMGL Sponsorship — CRM Workflow (JoMoCo)

How leads enter, move, and get worked in JoMoCo, GBA's white-label GoHighLevel
instance. Use the `linkedin-to-jomoco` skill to create contacts from LinkedIn
outreach and the `gba-lead-qualifier` skill to score inbound directory leads.

The rule that makes the rest work: **if it is not in JoMoCo, it did not happen.**
A conversation held on LinkedIn and never logged is a lead you will lose.

## Pipeline stages

| # | Stage | Enters when | Exit criteria | Owner action |
|---|---|---|---|---|
| 1 | **Sourced** | Added from a sourcing play in `icp-and-target-list.md` | Scored and researched | Fill the four research fields |
| 2 | **Sequenced** | Entered an email or LinkedIn sequence | Any reply, or sequence completes | Work the cadence |
| 3 | **Engaged** | Replied, accepted a connection, or downloaded the prospectus | Call booked | Stop the sequence, respond by hand |
| 4 | **Discovery** | Call booked | Call held and logged | Run the discovery questions |
| 5 | **Proposal** | Tier recommended in writing | Verbal yes or explicit no | Hold inventory with a named deadline |
| 6 | **Negotiation** | Terms, tier, or add-ons under discussion | Agreement sent | Get the decision date on the calendar |
| 7 | **Committed** | Agreement signed | Invoiced and fulfilled | Hand to fulfillment; log benefits owed |
| 8 | **Closed–Lost** | Explicit no, or no response after break-up | — | Log the reason; set next-cycle reminder |

Never let a deal sit in Discovery or Proposal without a dated next step. A stage
with no date is a stalled deal wearing a costume.

## Tags

Apply on creation. These make every list segment and report possible later.

**Source** — `src:directory` · `src:past-sponsor` · `src:member` · `src:bmm` ·
`src:working-group` · `src:speaker-inbound` · `src:referral` · `src:inbound-web` ·
`src:linkedin` · `src:event-scrape`

**ICP** — `icp:a-govgtm` · `icp:b-member` · `icp:c-past-sponsor` · `icp:d-adjacent`

**Score band** — `tier1-priority` (70+) · `tier2-sequence` (45–69) ·
`tier3-nurture` (25–44)

**Sector** — `sec:identity` · `sec:elections` · `sec:procurement` ·
`sec:records` · `sec:healthcare` · `sec:finance` · `sec:supply-chain` ·
`sec:security` · `sec:tokens` · `sec:ai` · `sec:energy` · `sec:legal` ·
`sec:property-titling` · `sec:other`

**Campaign** — `fomgl-[EVENT_YEAR]` on every contact in this campaign, always.

**Status** — `bmm:none` · `bmm:lvl1` … `bmm:lvl5` · `member:current` ·
`member:lapsed` · `member:none`

**Outcome** — `lost:budget` · `lost:timing` · `lost:no-fit` · `lost:no-response` ·
`lost:competitor` · `won:[TIER_NAME]`

## Custom fields to capture

Set these up before the campaign starts. They are what the sequences personalize
on and what the post-mortem reports run against.

| Field | Why it exists |
|---|---|
| The pursuit | Agency, program, or jurisdiction they are chasing — powers the A1 first line |
| The proof | Pilot, award, or credential you can name back to them |
| The gap | What FoMGL offers that they cannot buy elsewhere |
| Stated success measure | Their answer to discovery question 5 — write the proposal to this |
| Other stakeholders | Who else decides |
| Budget timing | Money now, or which cycle |
| Recommended tier | What you actually proposed |
| Objection raised | Feeds the next cycle's messaging |
| Prior sponsorship history | Which events, which tier, what happened |

## Cadence by band

| Band | Touches | Channels | Pace |
|---|---|---|---|
| `tier1-priority` | 8–10 over 4 weeks | Call + email + LinkedIn + InMail | Personal sends only; no bulk sequence |
| `tier2-sequence` | 5 over 18 days | Email sequence A + LinkedIn ladder | Sequenced, personalized first line |
| `tier3-nurture` | 2 + newsletter | Email only | Prospectus and last-call, nothing more |

## Automations worth building

1. **Inbound speed.** Prospectus download or form fill → contact created, tagged
   `src:inbound-web`, task assigned to `[SENDER_NAME]` due in one hour, sequence
   D triggered. Response speed is the highest-leverage variable in the campaign.
2. **Sequence halt on reply.** Any inbound reply stops all sequences and moves the
   contact to Engaged. Nothing damages a warm lead like touch four arriving after
   they already answered.
3. **Stalled-deal alert.** Any deal in Discovery or Proposal with no activity for
   seven days raises a task.
4. **Deadline cascade.** At two weeks out, everything in Engaged, Discovery, or
   Proposal enters sequence E automatically.
5. **Closed–Lost recycling.** `lost:budget` and `lost:timing` get a reminder set
   for the next planning cycle. Those two reasons close at a good rate on the
   second attempt; `lost:no-fit` does not — do not re-sequence it.
6. **Post-event debrief.** Every `Committed` contact gets a debrief task the week
   after the conference. That call opens next year's renewal and produces the
   quotable proof line for `social-and-campaign-calendar.md`.

## Routing from the lead qualifier

`gba-lead-qualifier` returns three tracks — Membership, BMM, and
Sponsorship/Events. Only the sponsorship track enters this pipeline.

- **Sponsorship-priority + score 45+** → Sourced, tagged and sequenced here
- **Sponsorship-priority + score under 45** → `tier3-nurture`, prospectus only
- **Membership or BMM priority** → hand to the relevant GBA track. Do not
  sequence them for sponsorship; the ask is premature and it costs the other sale
- **Capitol Hill Showcase priority** → route there instead, and note FoMGL as a
  follow-on in the contact record

## Weekly review

Fifteen minutes, same time each week, against the metrics in `README.md`:

1. Anything in Discovery or Proposal without a dated next step — fix it now.
2. Reply rate by source. Cold under target means the list is wrong, not the copy.
3. New `tier1-priority` contacts sourced this week — the top of the funnel is the
   only thing that cannot be fixed later.
4. Objections logged this week. Two of the same objection means the one-pager
   needs a paragraph, not the reps needing a better answer.
