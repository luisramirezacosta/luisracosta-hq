# CUSTOMIZATION BRIEF — even-admin/paperclip fork

**For:** Claude Code (CTO)
**From:** [P] Perplexity Computer + [L] Luis (Board)
**Date:** April 4, 2026
**Repo:** https://github.com/even-admin/paperclip

---

## CONTEXT

This is a fork of paperclipai/paperclip (28K+ stars, MIT license). It's a Node.js server + React UI that orchestrates AI agent teams. We're customizing it for Luis Ramirez Acosta's personal brand marketing factory.

The platform already works. We're NOT rewriting it. We're adding integrations and customizing the UI.

## WHAT THE PLATFORM ALREADY HAS (do not rebuild)

- Agent org chart (CEO, CTO, CMO)
- Ticket/issue system (Kanban board)
- Heartbeat system (agents wake on schedule, do work, sleep)
- Budget tracking per agent
- Embedded PostgreSQL (PGlite, local, no setup)
- Claude Code adapter (packages/adapters/claude-local/)
- Plugin SDK (packages/plugins/sdk/) with events, jobs, webhooks, state, tools
- Skills system
- Approval workflow
- Dashboard UI (React)

## WHAT WE'RE ADDING — 4 MODULES

### Module 1: X (Twitter) Integration Plugin

**Goal:** When an issue with label "tweet" is moved to "approved" status, automatically post to X via their API v2.

**Implementation:** Use the Paperclip Plugin SDK (`@paperclipai/plugin-sdk`).

```
packages/plugins/x-integration/
├── manifest.json          ← Plugin manifest (name, config schema, events)
├── src/
│   ├── worker.ts          ← definePlugin() — subscribes to issue.updated event
│   ├── x-client.ts        ← X API v2 client (OAuth 1.0a, post tweet, post thread)
│   └── types.ts
└── package.json
```

**Behavior:**
1. Subscribe to `issue.updated` event via plugin SDK
2. When an issue status changes to "approved" AND has label "tweet":
   - Read the issue description (the tweet text)
   - Post to X via API v2
   - Add a comment to the issue with the tweet URL
   - Move issue to "done"
3. For threads: if the description contains `---` separators, post as a thread (reply chain)

**Config (stored in plugin settings, never in code):**
```json
{
  "x_api_key": { "type": "secret" },
  "x_api_key_secret": { "type": "secret" },
  "x_access_token": { "type": "secret" },
  "x_access_token_secret": { "type": "secret" },
  "account_handle": "@fold_mx"
}
```

**X API v2 endpoint:** `POST https://api.x.com/2/tweets`
**Auth:** OAuth 1.0a (HMAC-SHA1 signature)
**Thread posting:** Post first tweet, get ID, post reply with `reply.in_reply_to_tweet_id`

### Module 2: LinkedIn Integration Plugin

**Goal:** Same pattern as X — issue approved with label "linkedin" → post to LinkedIn.

```
packages/plugins/linkedin-integration/
├── manifest.json
├── src/
│   ├── worker.ts
│   ├── linkedin-client.ts  ← LinkedIn API v2 (OAuth 2.0, post article/text)
│   └── types.ts
└── package.json
```

**LinkedIn API:** `POST https://api.linkedin.com/v2/ugcPosts`
**Auth:** OAuth 2.0 Bearer token
**Note:** LinkedIn API access requires a LinkedIn Page or verified developer app. May need to be Phase 2 if Luis doesn't have API access yet. Build the plugin structure anyway so it's ready.

### Module 3: Approval Flow Enhancement

**Goal:** Before any post goes live, Luis gets a notification and can approve/reject from the dashboard or mobile (via Tailscale).

**Implementation:** Paperclip already has an approval system. Enhance it:

1. When CMO creates a tweet/linkedin issue → status = "review"
2. CEO agent reviews against VOICE.md → status = "approved" (or sends back)
3. Board (Luis) gets a notification in the UI → final approve or reject
4. On board approval → plugin fires and posts

**This is mostly configuration of existing features**, not new code. The approval gates are already in Paperclip. We just need:
- A "Board Approval Required" flag on issues with "tweet" or "linkedin" labels
- A clean mobile-friendly approval view in the UI

### Module 4: UI Customization

**Goal:** Restyle the Paperclip dashboard to match Luis's design language.

**Changes (CSS/theme only, not structural):**
- Color scheme: black and white (like luisracosta.com)
- Typography: match the personal site fonts
- Remove/hide features Luis doesn't use (ClipMart, companies marketplace)
- Clean, minimal dashboard — no visual clutter
- Mobile-responsive approval cards

**Location:** `ui/src/` — look for theme/styling files. This is a React app, likely uses Tailwind or CSS modules.

---

## WHAT NOT TO DO

- Do NOT rewrite the core platform
- Do NOT remove existing adapters (Claude, Codex, Cursor, etc.)
- Do NOT break the embedded PostgreSQL setup
- Do NOT add external database dependencies
- Do NOT modify the heartbeat or ticket system architecture
- Do NOT add frameworks that aren't already in the stack

## ARCHITECTURE REFERENCE

```
paperclip/
├── server/src/          ← Node.js API (Express/Fastify)
├── ui/src/              ← React dashboard
├── packages/
│   ├── adapters/        ← Agent adapters (claude-local, codex-local, etc.)
│   ├── db/              ← Database (Drizzle ORM + PGlite)
│   ├── plugins/         ← Plugin SDK + examples ← WE ADD HERE
│   └── shared/          ← Shared types and validators
├── skills/              ← Agent skills (para-memory, etc.)
├── cli/                 ← CLI tools
└── docs/                ← Documentation
```

## PRIORITY ORDER

1. **X Integration Plugin** — highest value, Luis can start posting this week
2. **Approval Flow** — must work before any auto-posting goes live
3. **UI Customization** — cosmetic but important for daily use
4. **LinkedIn Plugin** — same pattern as X, build once X works

## CREDENTIALS

All API keys go in `.env.local` (already in .gitignore). Never hardcode. Never commit. The plugin SDK has a `ctx.secrets.resolve()` method for this.

## REFERENCE FILES

These live in the companion repo (even-admin/luisracosta-hq):
- `.paperclip/VOICE.md` — Brand voice rules (agents must read before producing content)
- `.paperclip/company.json` — Company mission and goals
- `.paperclip/agents/` — CEO, CMO, CTO agent configs
- `data/content-calendar.json` — Weekly content targets
- `data/tweets/reference-first-10.md` — Tweet examples for voice calibration

## SUCCESS CRITERIA

When this is done:
1. Luis opens Paperclip on his Mac Mini
2. CMO agent has drafted 4 tweets in español mexicano, in Luis's voice
3. CEO agent reviewed them against VOICE.md
4. Luis sees them in the dashboard, taps "approve" on his phone
5. The X plugin posts them to @fold_mx (or his personal account)
6. The issue automatically moves to "done" with the tweet URL attached

That's the factory.
