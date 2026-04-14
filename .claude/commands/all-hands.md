# All Hands

Read `staff-config.md` in the project root to understand the project context. If it doesn't exist, ask the user to describe the project before proceeding.

You are convening a full all-hands meeting of every team. This is the big table — Design, Engineering, SEO, Accounting, Product, Moments, Copy & Voice, QA, Analytics, Accessibility, and the Expert Panel all present.

## Pre-Meeting Setup

Before starting:
1. Read `staff-config.md` for project context.
2. Check `docs/whats-next.md` if it exists — review current status of open items.
3. Check `docs/` for any existing `all-hands-v*.md` files to determine the next version number.
   - If no prior versions exist, this is **v1.0**
   - Otherwise increment by 0.1 from the highest existing version (e.g., v1.2 -> v1.3)

## Meeting Structure

### 1. State of the Project
Brief summary of where things stand — what's been accomplished since last all-hands (reference `whats-next.md` if it exists), what the current focus is, and what's on the table today.

### 2. Team Presentations
Each team presents their perspective on the topic or current project state. For each team, briefly channel all three personas into a unified team position:

- **Design Team** (Elena, David, Greta) — visual direction, UX, system coherence
- **Engineering Team** (Priya, Marcus, Anders) — technical approach, implementation, reliability
- **SEO Team** (Isabela, Klaus, Nour) — discoverability, content strategy, growth
- **Accounting Team** (Mei, Johan, Anya) — unit economics, financial strategy, risk
- **Product Team** (Sofia, Daniel, Chidi) — user needs, market positioning, execution reality
- **Moments Team** (Amélie, Viktor, Nadia) — micro-interactions, friction, emotional arc
- **Copy & Voice Team** (Clara, Astrid, Leila) — product voice, UX writing, brand narrative
- **QA Team** (Pavel, Fatima, Freja) — failure modes, edge cases, test strategy
- **Analytics Team** (Oliver, Bianca, Hazel) — measurement, experimentation, behavioral insight
- **Accessibility Team** (Tomás, Ayesha, Niamh) — assistive tech, inclusive design, compliance
- **Expert Panel** — domain-specific insights (assemble per `staff-config.md`)

Each team presentation should be concise but substantive — 1 key insight, 1 concern, 1 recommendation.

### 3. Cross-Team Discussion
The teams engage with each other:
- Where do teams agree? Where do they conflict?
- What dependencies exist between recommendations?
- What's the most important thing the project should focus on right now?

Write this as a natural multi-party dialogue with teams referencing and building on each other's points.

### 4. Final Consensus
Each team votes on the overall direction:
- **Agree** / **Agree with reservations** / **Disagree**

Then synthesize into a unified recommendation with:
- **Top priority** — the single most important thing to do next
- **Supporting actions** — 2-3 additional priorities
- **Parking lot** — good ideas that should wait
- **Risks to watch** — things that could derail progress

## Output Documents

After completing the meeting, generate two documents:

### Document 1: All Hands Notes
Write to `docs/all-hands-v{VERSION}.md` with this format:

```markdown
# All Hands v{VERSION}

**Date**: {today's date}
**Topic**: {the topic or "General Review"}

## State of the Project
{summary}

## Team Presentations

### Design
{team position}

### Engineering
{team position}

### SEO
{team position}

### Accounting
{team position}

### Product
{team position}

### Moments
{team position}

### Copy & Voice
{team position}

### QA
{team position}

### Analytics
{team position}

### Accessibility
{team position}

### Expert Panel
{team position}

## Cross-Team Discussion
{key points of discussion}

## Consensus
{final recommendation with priorities}
```

### Document 2: What's Next
Read the existing `docs/whats-next.md` if it exists, then update it. If it doesn't exist, create it. Use this format:

```markdown
# What's Next

*Last updated: {today's date} (All Hands v{VERSION})*

## Priorities

{For each item, use one of these status indicators:}
{○ = not started}
{◑ = in progress}
{✅ = done}

### High Priority
- ○ {item}
- ◑ {item}
- ✅ {item}

### Medium Priority
- ○ {item}

### Parking Lot
- {items that were explicitly deferred}

## History
- v{VERSION} ({date}): {one-line summary of this meeting's focus}
- {previous entries preserved}
```

When updating an existing `whats-next.md`:
- Preserve items from previous meetings
- Update statuses based on what's been accomplished
- Add new items from this meeting
- Move completed items to the bottom of their section (keep them visible with ✅)
- Add this meeting to the History section

Create the `docs/` directory if it doesn't exist.

---

## Topic

$ARGUMENTS
