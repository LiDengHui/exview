#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const outDir = resolve(root, 'tmp')
mkdirSync(outDir, { recursive: true })

function sh(cmd) {
  return execSync(cmd, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim()
}

const latestTag = (() => {
  try {
    return sh('git describe --tags --abbrev=0')
  } catch {
    return ''
  }
})()

const range = latestTag ? `${latestTag}..HEAD` : 'HEAD'
const commits = sh(`git log --pretty=format:"- %h %s" ${range}`)

const content = `# Release Notes Draft\n\nGenerated: ${new Date().toISOString()}\n\n${latestTag ? `Base tag: ${latestTag}` : 'Base tag: (none)'}\nRange: ${range}\n\n## Commits\n\n${commits || '- (no commits found)'}\n`

const out = resolve(outDir, 'RELEASE_NOTES_DRAFT.md')
writeFileSync(out, content, 'utf8')
console.log(`wrote ${out}`)
