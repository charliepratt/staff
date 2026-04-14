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

echo ""
echo "Done. Available commands:"
echo "  /design         — Design team (Elena, David, Greta)"
echo "  /engineering    — Engineering team (Priya, Marcus, Anders)"
echo "  /seo            — SEO team (Isabela, Klaus, Nour)"
echo "  /accounting     — Accounting team (Mei, Johan, Anya)"
echo "  /product        — Product team (Sofia, Daniel, Chidi)"
echo "  /moments        — Moments team (Amélie, Viktor, Nadia)"
echo "  /copy           — Copy & Voice team (Clara, Astrid, Leila)"
echo "  /qa             — QA team (Pavel, Fatima, Freja)"
echo "  /analytics      — Analytics team (Oliver, Bianca, Hazel)"
echo "  /accessibility  — Accessibility team (Tomás, Ayesha, Niamh)"
echo "  /experts        — Domain expert panel (adapts to project)"
echo "  /all-hands      — Full team meeting with notes + what's next"
echo ""
echo "Start by filling out staff-config.md, then try: /all-hands Initial project review"
