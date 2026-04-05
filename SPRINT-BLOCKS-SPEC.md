# SPRINT BLOCKS — Core UX Spec for Mission Control

## The Problem

Luis works in focused sprint blocks — one thing at a time. He's bad at tracking, remembering, and staying concentrated across many tasks. The dashboard must enforce focus, not scatter attention.

## How Sprint Blocks Work

A **project** is broken into **blocks**. Each block has 3-7 small tasks. You finish all tasks in a block → next block unlocks. You finish all blocks → project done.

When a block is **active**, that's the ONLY thing on screen. No distractions. No other projects. Just: "Here are your 5 tasks. Finish them."

## The UX

### Default View: Project List
When no block is active, show all projects with progress:

```
┌─────────────────────────────────────────────┐
│ Close a $50-100K Client          ████░░ 2/4 │
│ Block 3: Work the Pipeline — 0/5 tasks      │
│                                  [Enter] →  │
├─────────────────────────────────────────────┤
│ luisracosta.com Upgrade           ██░░░ 1/3 │
│ Block 2: Content — 0/4 tasks                │
│                                  [Enter] →  │
├─────────────────────────────────────────────┤
│ fold.mx Launch                    █░░░░ 1/4 │
│ Block 1: Stage Content — 2/5 tasks          │
│                                  [Enter] →  │
└─────────────────────────────────────────────┘
```

Each project shows:
- Project name
- Block progress bar (blocks completed / total blocks)
- Current block name + task count
- "Enter" button to start working

### Active Block View: FOCUS MODE

When you click "Enter" on a project, the entire dashboard transforms into focus mode:

```
┌─────────────────────────────────────────────┐
│ ← Back                                      │
│                                              │
│ Close a $50-100K Client                      │
│ Block 1: Foundation                          │
│ ━━━━━━━━━━━━━━━━━━━━━━ 3/6 tasks            │
│                                              │
│ ✓ Fix Dr. Ramírez Google review link         │
│ ✓ Publish first 5 tweets on X               │
│ ✓ WhatsApp JP — check-in on Terra 58        │
│ ○ Add newsletter signup to luisracosta.com   │
│ ○ Update GitHub profile README              │
│ ○ Publish fold.mx first IG batch            │
│                                              │
│ ─────────────────────────────────────────── │
│ Next block: Visibility (unlocks when done)   │
└─────────────────────────────────────────────┘
```

Rules:
- **Only the current block's tasks are visible.** No peeking ahead.
- **Check off tasks as you complete them.** Saves to localStorage.
- **When all tasks are checked → "Block Complete" celebration** (subtle — just a line: "Block 1 done. Ready for Block 2?" with a button)
- **Next block unlocks.** Previous blocks show as completed (collapsed).
- **"Back" exits focus mode** and returns to project list.
- **No other sections visible in focus mode.** Pipeline, content cadence, hunting links — all hidden. Just the block.

### Block States

- **Locked** — future block, grayed out, can't enter
- **Active** — current block, highlighted, can enter focus mode
- **Complete** — all tasks checked, green checkmark, collapsed

## Data Structure

Add to `data/state.json`:

```json
{
  "projects": [
    {
      "id": "close-client",
      "name": "Close a $50-100K Client",
      "deadline": "2026-05-05",
      "blocks": [
        {
          "id": "foundation",
          "name": "Foundation",
          "week": 1,
          "tasks": [
            {"id": "t1", "text": "Fix Dr. Ramírez Google review link in GHL", "tag": "client", "done": false},
            {"id": "t2", "text": "Publish first 5 tweets on X", "tag": "content", "done": false},
            {"id": "t3", "text": "WhatsApp JP — check-in on Terra 58", "tag": "outreach", "done": false},
            {"id": "t4", "text": "Add newsletter signup to luisracosta.com", "tag": "setup", "done": false},
            {"id": "t5", "text": "Update GitHub profile README", "tag": "setup", "done": false},
            {"id": "t6", "text": "Publish fold.mx first IG batch", "tag": "content", "done": false}
          ]
        },
        {
          "id": "visibility",
          "name": "Visibility",
          "week": 2,
          "tasks": [
            {"id": "t7", "text": "Write Dr. Ramírez case study", "tag": "content", "done": false},
            {"id": "t8", "text": "Publish case study on LinkedIn", "tag": "content", "done": false},
            {"id": "t9", "text": "Write anchor piece #1 for blog", "tag": "content", "done": false},
            {"id": "t10", "text": "Set up HubSpot CRM", "tag": "setup", "done": false},
            {"id": "t11", "text": "Send warm outreach to 5 targets", "tag": "outreach", "done": false}
          ]
        },
        {
          "id": "pipeline",
          "name": "Pipeline",
          "week": 3,
          "tasks": [
            {"id": "t12", "text": "Second touch on all 5 outreach contacts", "tag": "outreach", "done": false},
            {"id": "t13", "text": "Outreach to 5 more targets from ICP list", "tag": "outreach", "done": false},
            {"id": "t14", "text": "Write anchor piece #2", "tag": "content", "done": false},
            {"id": "t15", "text": "Send newsletter #1", "tag": "content", "done": false},
            {"id": "t16", "text": "Do free AI audit call if any lead is warm", "tag": "outreach", "done": false}
          ]
        },
        {
          "id": "close",
          "name": "Close",
          "week": 4,
          "tasks": [
            {"id": "t17", "text": "Follow up on all proposals sent", "tag": "outreach", "done": false},
            {"id": "t18", "text": "Ask Dr. Ramírez for referrals", "tag": "outreach", "done": false},
            {"id": "t19", "text": "Ask Servimueble/Diego for referrals", "tag": "outreach", "done": false},
            {"id": "t20", "text": "Write anchor piece #3", "tag": "content", "done": false},
            {"id": "t21", "text": "Send newsletter #2", "tag": "content", "done": false}
          ]
        }
      ]
    },
    {
      "id": "website-upgrade",
      "name": "luisracosta.com Upgrade",
      "deadline": "2026-04-12",
      "blocks": [
        {
          "id": "structure",
          "name": "Page Structure",
          "week": 1,
          "tasks": [
            {"id": "w1", "text": "Add service cards section (AI Systems, fCTO, Digital Transformation)", "tag": "setup", "done": false},
            {"id": "w2", "text": "Add stack grid section", "tag": "setup", "done": false},
            {"id": "w3", "text": "Fix article links (currently broken)", "tag": "setup", "done": false},
            {"id": "w4", "text": "Add newsletter signup form", "tag": "setup", "done": false}
          ]
        },
        {
          "id": "content",
          "name": "Content",
          "week": 1,
          "tasks": [
            {"id": "w5", "text": "Write case study from Dr. Ramírez project", "tag": "content", "done": false},
            {"id": "w6", "text": "Add Elsewhere links (X, LinkedIn, GitHub, fold.mx)", "tag": "setup", "done": false},
            {"id": "w7", "text": "Update contact to contacto@luisracosta.com + WhatsApp", "tag": "setup", "done": false},
            {"id": "w8", "text": "Add footer", "tag": "setup", "done": false}
          ]
        },
        {
          "id": "launch",
          "name": "Launch",
          "week": 2,
          "tasks": [
            {"id": "w9", "text": "Review full site on mobile", "tag": "review", "done": false},
            {"id": "w10", "text": "Push to GitHub Pages", "tag": "setup", "done": false},
            {"id": "w11", "text": "Share link on X and LinkedIn", "tag": "content", "done": false}
          ]
        }
      ]
    },
    {
      "id": "fold-launch",
      "name": "fold.mx Launch",
      "deadline": "2026-04-19",
      "blocks": [
        {
          "id": "stage-content",
          "name": "Stage Content",
          "week": 1,
          "tasks": [
            {"id": "f1", "text": "Publish first 3 IG posts (cover + deepdive)", "tag": "content", "done": false},
            {"id": "f2", "text": "Publish first 5 tweets from fold account", "tag": "content", "done": false},
            {"id": "f3", "text": "Push first article live on fold.mx", "tag": "content", "done": false},
            {"id": "f4", "text": "Set up fold newsletter signup", "tag": "setup", "done": false},
            {"id": "f5", "text": "Post IG stories (3 launch stories)", "tag": "content", "done": false}
          ]
        },
        {
          "id": "cadence",
          "name": "Hit Cadence",
          "week": 2,
          "tasks": [
            {"id": "f6", "text": "3 IG posts this week", "tag": "content", "done": false},
            {"id": "f7", "text": "5 tweets this week", "tag": "content", "done": false},
            {"id": "f8", "text": "1 article published", "tag": "content", "done": false},
            {"id": "f9", "text": "Newsletter #1 sent", "tag": "content", "done": false}
          ]
        }
      ]
    }
  ]
}
```

Task completion state is stored in localStorage (keyed by task id). state.json provides the structure, localStorage provides the checkbox state.

## How [P] and Luis Use This Together

When Luis says "let's work" or starts a sprint block:
1. Luis opens hq.luisracosta.com → enters a project → sees his block
2. He tells [P] which task he's on
3. [P] provides whatever support is needed for that specific task (drafts, research, etc.)
4. Luis checks it off when done
5. When all tasks done → next block
6. When all blocks done → project complete

[P] updates state.json via GitHub when:
- New projects are added
- Blocks need to be restructured
- Tasks need to be added, removed, or reworded

## Integration with Existing Sections

The sprint blocks view is THE MAIN VIEW of Mission Control. The other sections (pipeline, content cadence, numbers, hunting links) become a secondary view accessible via a "Dashboard" tab or link at the top. Two modes:

- **Blocks** (default) — sprint block focus view
- **Dashboard** — pipeline, cadence, numbers, platforms

Simple tab toggle at the top. Nothing fancy.
