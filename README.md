# Staff

A team-of-experts system for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Type a slash command, and a panel of three specialists will independently analyze your question, debate tradeoffs, and deliver a consensus recommendation.

12 teams cover design, engineering, product, QA, analytics, accessibility, copy, SEO, accounting, moments, and a domain-adaptive expert panel. Works on any kind of project — software, content, business, research.

## Setup

Open Claude Code in your project and say:

> Ingest https://github.com/charliepratt/staff and set it up for this project.

Claude will run `setup.sh`, which installs the team commands and creates a `staff-config.md` file. **Restart Claude Code** after setup so it picks up the new commands.

After restarting, Claude will notice the config is blank and prompt you to run `/setup`. This is a short interview — it asks about your project in a few rounds (what it is, tech stack, stage, business model, competitors, what domain experts you need) and fills out `staff-config.md` for you. Every team reads this file to tailor their advice to your situation.

You can re-run `/setup` any time to update your project config.

## How It Works

Every team follows the same process:

1. **Individual Analysis** — Each persona examines the topic through their specific lens
2. **Debate** — The three discuss openly, challenging assumptions and surfacing tradeoffs
3. **Consensus Vote** — Each states their position and votes (Agree / Agree with reservations / Disagree)
4. **Final Recommendation** — A unified recommendation with specific actions and next steps

## Teams

| Command | Team | Personas | Focus |
|---------|------|----------|-------|
| `/setup` | Setup | *(interactive)* | Interviews you, fills out staff-config.md |
| `/design` | Design | Elena, David, Greta | Aesthetics, UX, design systems |
| `/engineering` | Engineering | Priya, Marcus, Anders | Architecture, implementation, security |
| `/product` | Product | Sofia, Daniel, Chidi | Users, market strategy, execution |
| `/qa` | QA — "The Breakers" | Pavel, Fatima, Freja | Chaos engineering, edge cases, regression |
| `/analytics` | Analytics — "The Signals" | Oliver, Bianca, Hazel | Experimentation, metrics, behavioral science |
| `/accessibility` | Accessibility — "The Includers" | Tomás, Ayesha, Niamh | Assistive tech, inclusive design, compliance |
| `/copy` | Copy & Voice | Clara, Astrid, Leila | Voice, UX writing, narrative |
| `/seo` | SEO | Isabela, Klaus, Nour | Technical SEO, content, growth |
| `/accounting` | Accounting | Mei, Johan, Anya | Unit economics, strategic finance, ops/risk |
| `/moments` | Moments | Amélie, Viktor, Nadia | Emotional design, friction, storytelling |
| `/experts` | Expert Panel | *(adapts to project)* | Domain specialists defined in config |
| `/all-hands` | All Teams | Everyone | Full cross-functional meeting with notes |

## Example Usage

```
/design Should the settings page use a sidebar or tabs?

/engineering Should we use event sourcing for order processing?

/product We're launching next month with only email auth — is that enough?

/qa Review the checkout flow for edge cases

/analytics We're tracking DAU and NPS — are we measuring the right things?

/accounting Is our pricing sustainable at 1,000 users?

/all-hands We just closed our seed round. What should we prioritize for the next 90 days?
```

## The All-Hands

`/all-hands` convenes every team for a structured cross-functional meeting:

- Each of the 11 teams presents one insight, one concern, and one recommendation
- Teams discuss across disciplines — agreements, conflicts, dependencies
- Everyone votes on the final direction

It writes two documents into `docs/`:
- **Versioned meeting notes** (v1.0, v1.1, etc.) with full team presentations and discussion
- **What's next** — a living priority list with status tracking that updates each meeting

## The Expert Panel

Most teams have fixed personas — Design is always Elena, David, and Greta. `/experts` is different. It assembles three domain specialists based on your project context.

Building a healthcare app? It brings in clinical, regulatory, and health-tech experts. Fintech? Risk, compliance, and payments specialists. You can let it choose automatically based on your `staff-config.md`, or specify exactly which roles you want at the table.

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

## License

MIT
