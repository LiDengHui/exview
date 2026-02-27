#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> 1/5 install deps"
pnpm install

echo "==> 2/5 run tests"
pnpm --filter @exview/web test

echo "==> 3/5 build workspace"
pnpm -r build

echo "==> 4/5 package preview"
for pkg in packages/schema-shared packages/schema-form packages/schema-table; do
  echo "-- pack preview: $pkg"
  (cd "$pkg" && pnpm pack --pack-destination ../../tmp/release-pack)
done

echo "==> 5/5 done"
echo "Beta release precheck complete. Artifacts in tmp/release-pack"
