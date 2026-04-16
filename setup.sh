#!/bin/bash
# Staff Setup — Install staff skills into any project
#
# Usage (from your target project root):
#   /path/to/staff/setup.sh
#   OR
#   git clone <staff-repo-url> /tmp/staff && /tmp/staff/setup.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET="$(pwd)"

echo "Installing Staff into: $TARGET"
echo ""

# Copy command files
mkdir -p "$TARGET/.claude/commands"
cp "$SCRIPT_DIR/.claude/commands/"*.md "$TARGET/.claude/commands/"
echo "  Installed skills:"
for f in "$SCRIPT_DIR/.claude/commands/"*.md; do
  name=$(basename "$f" .md)
  echo "    /$name"
done

# Copy config template if it doesn't exist
if [ ! -f "$TARGET/staff-config.md" ]; then
  cp "$SCRIPT_DIR/staff-config.md" "$TARGET/staff-config.md"
  echo ""
  echo "  Created staff-config.md — fill in your project details."
else
  echo ""
  echo "  staff-config.md already exists — skipping."
fi

# Ensure docs directory exists
mkdir -p "$TARGET/docs"

# Add staff section to CLAUDE.md if not already present
if [ -f "$TARGET/CLAUDE.md" ]; then
  if ! grep -q "## Staff" "$TARGET/CLAUDE.md"; then
    cat >> "$TARGET/CLAUDE.md" << 'STAFFBLOCK'

## Staff

This project has the Staff team-of-experts system installed. Teams are available as slash commands (`/design`, `/engineering`, `/product`, `/qa`, etc.) and each runs a 3-persona expert panel.

**If `staff-config.md` is still blank (unfilled template), proactively tell the user**: "It looks like Staff is installed but not configured yet. Run `/setup` to set up your project profile — it's a quick interview that helps all the teams give better advice."
STAFFBLOCK
    echo "  Updated CLAUDE.md with Staff section."
  fi
else
  cat > "$TARGET/CLAUDE.md" << 'STAFFBLOCK'
## Staff

This project has the Staff team-of-experts system installed. Teams are available as slash commands (`/design`, `/engineering`, `/product`, `/qa`, etc.) and each runs a 3-persona expert panel.

**If `staff-config.md` is still blank (unfilled template), proactively tell the user**: "It looks like Staff is installed but not configured yet. Run `/setup` to set up your project profile — it's a quick interview that helps all the teams give better advice."
STAFFBLOCK
  echo "  Created CLAUDE.md with Staff section."
fi

echo ""
echo "Done. Staff is installed."
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  IMPORTANT: Restart Claude Code to load the new commands.   ║"
echo "║                                                             ║"
echo "║  After restarting, run:  /setup                              ║"
echo "║  This will interview you about your project and configure   ║"
echo "║  the staff teams to give relevant, tailored advice.         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Available teams after restart:"
echo "  /setup          — Configure staff for your project (run this first)"
echo "  /design         — Design team (Elena, David, Greta)"
echo "  /engineering    — Engineering team (Priya, Marcus, Anders)"
echo "  /product        — Product team (Sofia, Daniel, Chidi)"
echo "  /qa             — QA team — The Breakers (Pavel, Fatima, Freja)"
echo "  /seo            — SEO team (Isabela, Klaus, Nour)"
echo "  /accounting     — Accounting team (Mei, Johan, Anya)"
echo "  /moments        — Moments team (Amélie, Viktor, Nadia)"
echo "  /copy           — Copy & Voice team (Clara, Astrid, Leila)"
echo "  /analytics      — Analytics team (Oliver, Bianca, Hazel)"
echo "  /accessibility  — Accessibility team (Tomás, Ayesha, Niamh)"
echo "  /experts        — Domain expert panel (adapts to project)"
echo "  /all-hands      — Full team meeting with notes + what's next"
