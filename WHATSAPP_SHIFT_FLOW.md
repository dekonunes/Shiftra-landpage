# WhatsApp → Shift creation + share link (v1 plan)

This repo is the landing page; this doc captures the planned product/backend flow for a WhatsApp-assisted shift posting MVP.

## Goals (v1)

- Boss sends a WhatsApp message to a Shiftra bot to create a shift.
- Bot replies with a copy/paste message (plain text + link) the boss can post into any WhatsApp group(s).
- Worker opens the link, sees shift details, enters name + phone number, and accepts.
- App allocates the first `N` acceptances (e.g. 3) and notifies the boss on each acceptance + when filled.

## Defaults (v1)

- Timezone: `Australia/Sydney` (boss messages like “Friday 6–10pm” are interpreted in this timezone unless explicitly specified).
- Allocation: first come, first served (first `N` successful accepts win).

## Non-goals (v1)

- Programmatically posting into arbitrary WhatsApp groups (not possible with standard WhatsApp APIs).
- Programmatically creating WhatsApp groups (requires WhatsApp Groups API eligibility; not available without OBA + high messaging limits).

## Key constraints (from Meta docs)

- If the boss initiates the conversation (messages the bot first), we can reply with free-form messages within the 24h customer service window.
- Proactive messaging outside the window typically requires approved templates.
- WhatsApp “Groups API” is separate and gated; treat as a later phase.

## Flow

### 1) Boss → bot: create shift

Boss sends a single message (free-form or semi-structured), e.g.:

`Friday 6–10 pm, Barista, Bondi, 35/h, need 3 people`

We should encourage a stricter format to reduce parsing errors, e.g.:

`Shift: Fri 6-10pm | Role: Barista | Location: Bondi | Rate: 35/h | Spots: 3`

Parsing outputs:

- `startDateTime`, `endDateTime` (timezone required; default to a configured timezone if not provided)
- `role`
- `location`
- `rate` (amount + currency + unit)
- `spotsNeeded` (integer)

### 2) Bot → boss: shareable message + link

Bot replies with:

- A short prompt to share the message in groups.
- A 1–2 line summary suitable for copy/paste.
- A public acceptance link to the shift.
- Optional: a “reference code” for the boss.

Example bot replies:

`Share this message on groups. Or message like this.`
`Shift: Fri 6–10pm • Barista • Bondi • $35/h • 3 spots`
`Accept: https://shiftra.com/s/<publicToken>`
`Reply ASAP — first come, first served.`

### 3) Worker → web: accept

Landing page for the link:

- Shows shift details.
- Requires:
  - `fullName`
  - `phoneNumber` (E.164; e.g. +614xxxxxxxx)
- “Accept job” action.

Outcomes:

- If spots still available: accept succeeds and worker sees a success screen.
- If filled: worker sees “Filled” + optional waitlist CTA.

### 4) App → boss: notifications

Within the conversation window, send boss updates:

- After each successful acceptance:
  - `1/3 filled: Jane Doe (+61...)`
- When filled:
  - `3/3 filled. Selected: ...`
  - “Next step: create a WhatsApp group with these numbers”
  - Provide a ready-to-paste first message.

Example “filled” message:

`Shift filled (3/3). Add these to a WhatsApp group:`
`1) Jane Doe +614...`
`2) ...`
`3) ...`
`First message (copy/paste): Hi team — you’re confirmed for Fri 6–10pm at Bondi as Barista. Please reply YES to confirm.`

## Data model (suggested)

- `Boss`:
  - `id`, `name?`, `phoneNumber`, `whatsappWaId`, `createdAt`
- `Shift`:
  - `id`, `bossId`, `startAt`, `endAt`, `role`, `location`, `rateAmount`, `rateCurrency`, `rateUnit`, `spotsNeeded`, `status`
  - `publicToken` (unguessable)
- `ShiftAcceptance`:
  - `id`, `shiftId`, `fullName`, `phoneNumber`, `acceptedAt`, `status` (`accepted` | `waitlisted` | `canceled`)

## Security/abuse notes (v1)

- `publicToken` must be unguessable (not incremental IDs).
- Server-side allocation must be transactional to prevent race conditions (never rely on client-side checks).
- Rate limit accepts per IP/device and per shift.
- Store consent + privacy notice since we collect phone numbers.

## Future phases

- WhatsApp Groups API integration (if/when eligible):
  - Create group programmatically after shift fills.
  - Send invite links to selected workers and boss.
  - Use group webhooks (participants join) to confirm group is ready.
- Worker notifications (1:1 WhatsApp):
  - Requires opt-in + template strategy for business-initiated messages.
- Boss “approval mode”:
  - Allow boss to choose from applicants instead of first-come.
