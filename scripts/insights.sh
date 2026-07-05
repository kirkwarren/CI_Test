#!/usr/bin/env bash
# Bundle + run the deep-studies script (same esbuild pattern as analyze.sh).
set -euo pipefail
cd "$(dirname "$0")/.."
npx esbuild scripts/insights-src.mjs --bundle --platform=node --format=cjs \
  --outfile=node_modules/.cache/insights.bundle.cjs --log-level=warning
node node_modules/.cache/insights.bundle.cjs
