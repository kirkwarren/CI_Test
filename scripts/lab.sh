#!/usr/bin/env bash
# Bundle + run the strategy-lab gauntlet (same esbuild pattern as analyze.sh).
set -euo pipefail
cd "$(dirname "$0")/.."
npx esbuild scripts/lab-src.mjs --bundle --platform=node --format=cjs \
  --outfile=node_modules/.cache/lab.bundle.cjs --log-level=warning
node node_modules/.cache/lab.bundle.cjs
