#!/usr/bin/env -S pnpm exec tsx

/**
 * Cross-platform version bump script for BetterBukidnon.
 *
 * Usage:
 *   pnpm tsx scripts/bump-version.ts patch   (default)
 *   pnpm tsx scripts/bump-version.ts minor
 *   pnpm tsx scripts/bump-version.ts major
 *   pnpm tsx scripts/bump-version.ts          (shows current version)
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const VERSION_FILE = path.join(__dirname, '..', 'version.json')
const PACKAGE_FILE = path.join(__dirname, '..', 'package.json')

let versionData
try {
  versionData = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'))
} catch {
  console.error('Error: version.json not found or invalid')
  process.exit(1)
}

const bumpType = process.argv[2] || ''

if (!bumpType) {
  console.log('Current version: ' + versionData.version)
  console.log('Usage: pnpm tsx scripts/bump-version.ts [major|minor|patch]')
  process.exit(0)
}

let major = versionData.major
let minor = versionData.minor
let patch = versionData.patch
const oldVersion = versionData.version

switch (bumpType) {
  case 'major':
    major++
    minor = 0
    patch = 0
    break
  case 'minor':
    minor++
    patch = 0
    break
  case 'patch':
    patch++
    break
  default:
    console.error('Invalid bump type: ' + bumpType)
    console.error('Use: major, minor, or patch')
    process.exit(1)
}

const newVersion = major + '.' + minor + '.' + patch
const today = new Date().toISOString().split('T')[0]

console.log('Bumping: ' + oldVersion + ' -> ' + newVersion)

versionData.version = newVersion
versionData.major = major
versionData.minor = minor
versionData.patch = patch
versionData.lastUpdated = today
fs.writeFileSync(VERSION_FILE, JSON.stringify(versionData, null, 2) + '\n')

try {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_FILE, 'utf8'))
  pkg.version = newVersion
  fs.writeFileSync(PACKAGE_FILE, JSON.stringify(pkg, null, 2) + '\n')
} catch (e) {
  console.warn('Warning: Could not update package.json:', e.message)
}

console.log('Done! Version is now ' + newVersion)
