#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
fi

run_cmd() {
  if $DRY_RUN; then
    echo "[dry-run] $*"
  else
    eval "$*"
  fi
}

echo "==> precheck 0/6 workspace clean"
if [[ -n "$(git status --porcelain)" ]]; then
  echo "[error] workspace has uncommitted changes. Please commit/stash first." >&2
  git status --short
  exit 1
fi

echo "==> precheck 1/6 install deps"
run_cmd "pnpm install"

echo "==> precheck 2/6 run tests"
run_cmd "pnpm --filter @exview/web test"

echo "==> precheck 3/6 build workspace"
run_cmd "pnpm -r build"

echo "==> precheck 4/6 package preview"
run_cmd "mkdir -p tmp/release-pack"
for pkg in packages/schema-shared packages/schema-form packages/schema-table; do
  echo "-- pack preview: $pkg"
  run_cmd "(cd '$pkg' && pnpm pack --pack-destination ../../tmp/release-pack)"
done

echo "==> precheck 5/6 npm auth check"
if $DRY_RUN; then
  echo "[dry-run] npm whoami"
else
  npm whoami >/dev/null
  echo "npm auth ok"
fi

echo "==> precheck 6/6 changelog draft"
run_cmd "node scripts/release-notes-draft.mjs"

echo "Beta release precheck complete. Artifacts in tmp/release-pack"
if $DRY_RUN; then
  echo "Mode: dry-run (no command executed)"
fi
