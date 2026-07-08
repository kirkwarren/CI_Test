#!/usr/bin/env bash
# Bundle + run the long-horizon (megatrends + weekly allocation) runner.
set -euo pipefail
cd "$(dirname "$0")/.."
npx esbuild scripts/longterm-src.mjs --bundle --platform=node --format=cjs \
  --outfile=node_modules/.cache/longterm.bundle.cjs --log-level=warning
node node_modules/.cache/longterm.bundle.cjs
