#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const nextVersion = process.argv[2]
if (!nextVersion) {
  console.error('Usage: node scripts/bump-version.mjs <version>')
  process.exit(1)
}

const root = resolve(process.cwd())
const packages = [
  'packages/schema-shared/package.json',
  'packages/schema-form/package.json',
  'packages/schema-table/package.json'
]

for (const rel of packages) {
  const p = resolve(root, rel)
  const json = JSON.parse(readFileSync(p, 'utf8'))
  json.version = nextVersion

  if (json.dependencies && json.dependencies['@exview/schema-shared']) {
    json.dependencies['@exview/schema-shared'] = nextVersion
  }

  writeFileSync(p, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`updated ${rel} -> ${nextVersion}`)
}
