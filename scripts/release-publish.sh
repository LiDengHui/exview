#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

usage() {
  cat <<USAGE
Usage: bash scripts/release-publish.sh --tag <beta|rc|latest> [--dry-run] [--yes]

Options:
  --tag <tag>   npm dist-tag to publish with (beta|rc|latest)
  --dry-run     print commands without executing
  --yes         skip interactive confirmation
USAGE
}

TAG=""
DRY_RUN=false
AUTO_YES=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tag)
      TAG="${2:-}"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --yes)
      AUTO_YES=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$TAG" ]]; then
  echo "[error] --tag is required" >&2
  usage
  exit 1
fi

if [[ "$TAG" != "beta" && "$TAG" != "rc" && "$TAG" != "latest" ]]; then
  echo "[error] unsupported tag: $TAG (expected beta|rc|latest)" >&2
  exit 1
fi

run_cmd() {
  if $DRY_RUN; then
    echo "[dry-run] $*"
  else
    eval "$*"
  fi
}

echo "==> preflight 1/4 workspace clean"
if $DRY_RUN; then
  echo "[dry-run] skip clean check"
else
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "[error] workspace has uncommitted changes. Please commit/stash first." >&2
    git status --short
    exit 1
  fi
fi

echo "==> preflight 2/4 npm auth"
if $DRY_RUN; then
  echo "[dry-run] npm whoami"
else
  npm whoami >/dev/null
  echo "npm auth ok"
fi

echo "==> preflight 3/4 run release precheck"
run_cmd "bash scripts/release-beta.sh"

echo "==> preflight 4/4 summary"
echo "tag=$TAG"
echo "packages: @exview/schema-shared, @exview/schema-form, @exview/schema-table"

if ! $AUTO_YES && ! $DRY_RUN; then
  read -r -p "Proceed publishing with tag '$TAG'? (yes/no): " CONFIRM
  if [[ "$CONFIRM" != "yes" ]]; then
    echo "aborted"
    exit 1
  fi
fi

for pkg in packages/schema-shared packages/schema-form packages/schema-table; do
  echo "==> publishing $pkg with tag=$TAG"
  run_cmd "(cd '$pkg' && npm publish --tag '$TAG' --access public)"
done

echo "Publish complete."
echo "Next steps:"
echo "1) verify npm dist-tags"
echo "2) update CHANGELOG / release notes"
echo "3) tag git commit and push tags"
