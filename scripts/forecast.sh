#!/usr/bin/env bash
# Bundle + run the forecast register / calibration scorer.
set -euo pipefail
cd "$(dirname "$0")/.."
npx esbuild scripts/forecast-src.mjs --bundle --platform=node --format=cjs \
  --outfile=node_modules/.cache/forecast.bundle.cjs --log-level=warning
node node_modules/.cache/forecast.bundle.cjs
