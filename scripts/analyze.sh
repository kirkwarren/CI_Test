#!/usr/bin/env bash
# Bundle the analysis script with esbuild (so it can import the engine exactly
# as the app does) and run it under Node.
set -euo pipefail
cd "$(dirname "$0")/.."
npx esbuild scripts/analyze-src.mjs --bundle --platform=node --format=cjs \
  --outfile=node_modules/.cache/analyze.bundle.cjs --log-level=warning
node node_modules/.cache/analyze.bundle.cjs
