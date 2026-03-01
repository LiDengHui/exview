#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

usage() {
  cat <<USAGE
Usage: bash scripts/release-all.sh --version <x.y.z[-beta.0|-rc.0]> --tag <beta|rc|latest> [--dry-run] [--yes]

Examples:
  bash scripts/release-all.sh --version 0.1.2-beta.0 --tag beta --dry-run
  bash scripts/release-all.sh --version 0.1.2-rc.0 --tag rc --yes
  bash scripts/release-all.sh --version 0.1.2 --tag latest --yes
USAGE
}

VERSION=""
TAG=""
DRY_RUN=false
AUTO_YES=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --version)
      VERSION="${2:-}"
      shift 2
      ;;
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

if [[ -z "$VERSION" || -z "$TAG" ]]; then
  echo "[error] --version and --tag are required" >&2
  usage
  exit 1
fi

if [[ "$TAG" != "beta" && "$TAG" != "rc" && "$TAG" != "latest" ]]; then
  echo "[error] unsupported tag: $TAG" >&2
  exit 1
fi

run_cmd() {
  if $DRY_RUN; then
    echo "[dry-run] $*"
  else
    eval "$*"
  fi
}

echo "==> 1/7 version bump -> $VERSION"
run_cmd "node scripts/bump-version.mjs '$VERSION'"
run_cmd "pnpm install"

echo "==> 2/7 changelog draft"
run_cmd "node scripts/release-notes-draft.mjs"

echo "==> 3/7 release precheck"
if $DRY_RUN; then
  run_cmd "bash scripts/release-beta.sh --dry-run"
else
  run_cmd "bash scripts/release-beta.sh"
fi

echo "==> 4/7 publish"
PUB_FLAGS="--tag $TAG"
if $DRY_RUN; then PUB_FLAGS="$PUB_FLAGS --dry-run"; fi
if $AUTO_YES; then PUB_FLAGS="$PUB_FLAGS --yes"; fi
run_cmd "bash scripts/release-publish.sh $PUB_FLAGS"

echo "==> 5/7 commit release version"
run_cmd "git add packages/schema-shared/package.json packages/schema-form/package.json packages/schema-table/package.json pnpm-lock.yaml"
run_cmd "git commit -m 'release: $VERSION'"

echo "==> 6/7 git tag"
run_cmd "git tag v$VERSION"

echo "==> 7/7 done"
echo "Next: git push && git push --tags"
echo "Release notes draft: tmp/RELEASE_NOTES_DRAFT.md"
