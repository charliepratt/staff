# Staff

This repository contains a portable team-of-experts skill system for Claude Code. Each skill invokes a panel of three personas who analyze, debate, and reach consensus.

## How It Works

- Skills live in `.claude/commands/` and are invoked as slash commands (`/design`, `/engineering`, etc.)
- Every team reads `staff-config.md` to adapt their expertise to the current project
- Each team has 3 distinct personas with different perspectives
- The process: individual analysis -> debate -> consensus vote -> final recommendation
- `/all-hands` convenes all teams and outputs versioned meeting notes + a living what's-next doc

## Installation

Run `setup.sh` from the target project root to copy skills and config template. The script will:
1. Copy all command files to `.claude/commands/`
2. Create `staff-config.md` (if it doesn't exist)
3. Add a Staff section to the project's `CLAUDE.md` that prompts users to run `/setup`
4. Print a restart reminder with next steps

After restarting Claude, the CLAUDE.md instruction will trigger Claude to proactively suggest `/setup` if the config is still blank.

## Teams

| Command | Team | Personas |
|---------|------|----------|
| `/setup` | Setup | Interviews user, fills out staff-config.md |
| `/design` | Design | Elena (aesthetic), David (UX), Greta (systems) |
| `/engineering` | Engineering | Priya (architect), Marcus (implementer), Anders (security/reliability) |
| `/seo` | SEO | Isabela (technical), Klaus (content), Nour (growth) |
| `/accounting` | Accounting | Mei (unit economics), Johan (strategic finance), Anya (ops/risk) |
| `/product` | Product | Sofia (user advocate), Daniel (market strategist), Chidi (execution realist) |
| `/moments` | Moments | Amélie (emotional design), Viktor (friction hunter), Nadia (storyteller) |
| `/copy` | Copy & Voice | Clara (voice architect), Astrid (UX writer), Leila (narrative strategist) |
| `/qa` | QA — The Breakers | Pavel (chaos engineer), Fatima (user chaos), Freja (regression guardian) |
| `/analytics` | Analytics — The Signals | Oliver (experimentation), Bianca (product analytics), Hazel (behavioral science) |
| `/accessibility` | Accessibility — The Includers | Tomás (assistive tech), Ayesha (inclusive design), Niamh (compliance/standards) |
| `/experts` | Expert Panel | Adapts to project domain via staff-config.md |
| `/all-hands` | All Teams | Full meeting with notes output to docs/ |
