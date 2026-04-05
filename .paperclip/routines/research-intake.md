# Routine: Research Intake from [P]

**Schedule:** As needed (triggered by CEO when research briefs arrive)
**Owner:** CEO

## How Research Flows In

Perplexity Computer ([P]) operates outside Paperclip. It produces:
- Trending AI/tech topic summaries
- Deep research for specific articles (data, stats, quotes, sources)
- Competitive intelligence
- Industry analysis

Luis or [P] saves these to `packages/articles/research/` or `data/research-requests/completed/`.

## CEO's Job on Intake

1. Read the research brief
2. Decide which content pillar it maps to
3. Create a ticket for CMO with:
   - The research brief file path
   - Which content format (tweet? LinkedIn? article?)
   - Which pillar (futuro de computación, IA economía real, fe+tech, industria, disciplina)
   - Deadline
   - Any specific angle Luis wants

## Research Request Format

When the CEO needs [P] to research something, save a file to `data/research-requests/`:

```markdown
# Research Request: [Topic]

**Date:** YYYY-MM-DD
**Priority:** high/medium/low
**For:** tweet / linkedin / article
**Pillar:** [which content pillar]

## What We Need
[Specific questions, data points, or angles to explore]

## Context
[Why this matters now, any time sensitivity]

## Output Format
[What the brief should look like — data points, quotes, narrative, etc.]
```
