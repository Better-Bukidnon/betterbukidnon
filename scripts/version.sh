#!/bin/bash

# Compatibility wrapper for scripts/bump-version.ts.
#
# Usage: ./scripts/version.sh [major|minor|patch]

BUMP_TYPE=${1:-""}

if [ -z "$BUMP_TYPE" ]; then
    pnpm exec tsx "$(dirname "$0")/bump-version.ts"
else
    pnpm exec tsx "$(dirname "$0")/bump-version.ts" "$BUMP_TYPE"
fi
