# Routine: Weekly Content Cycle

**Schedule:** Every Monday at 8:30am CST (when CEO heartbeat fires)
**Owner:** CEO → delegates to CMO and CTO

## The Cycle

### Monday — Plan
CEO reviews:
1. Research briefs delivered by [P] (check `data/research-requests/` for completed briefs)
2. Trending topics in AI/tech that align with Luis's pillars
3. Previous week's content performance (if metrics available)

CEO creates tickets:
- 3-4 tweet topics for the week (assign to CMO)
- 2 LinkedIn post topics (assign to CMO)
- 1 article task if in cycle (assign to CMO)
- Any website/landing page work (assign to CTO)

### Tuesday-Wednesday — Draft
CMO writes:
- Tweet batch → `data/tweets/week-YYYY-MM-DD.md`
- LinkedIn batch → `data/linkedin/week-YYYY-MM-DD.md`
- Article progress (if applicable) → `packages/articles/drafts/`

### Thursday — Review
CEO reviews all drafts against VOICE.md:
- Approve or send back with specific notes
- Mark approved content as "ready to post"

### Friday — Ship & Queue
- Approved tweets/LinkedIn posts marked ready for Luis to post
- CTO deploys any approved article HTML to website
- CEO updates content calendar for next week
- CEO files research requests for [P] for the following week

## File Locations

| What | Where |
|------|-------|
| Tweet drafts | `data/tweets/week-YYYY-MM-DD.md` |
| LinkedIn drafts | `data/linkedin/week-YYYY-MM-DD.md` |
| Article drafts | `packages/articles/drafts/` |
| Content calendar | `data/content-calendar.json` |
| Research requests | `data/research-requests/` |
| Research briefs (from [P]) | `packages/articles/research/` |
