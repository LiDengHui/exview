# Beta Release Guide

## Prerequisites
- npm account already logged in (`npm whoami`)
- workspace is clean (`git status`)

## Quick Precheck
```bash
bash scripts/release-beta.sh
```

This will:
1. install dependencies
2. run web tests
3. build all packages
4. generate local tarballs into `tmp/release-pack`

## Publish (manual)
```bash
cd packages/schema-shared && npm publish --tag beta --access public
cd ../schema-form && npm publish --tag beta --access public
cd ../schema-table && npm publish --tag beta --access public
```

## Versioning Advice
- Start from `0.1.x-beta.y`
- Keep `schema-shared` first, then form/table
- Update CHANGELOG when API changes (schema fields / exposed methods)
