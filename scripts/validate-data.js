#!/usr/bin/env node
/**
 * BetterBukidnon Data Quality & Integrity Validator (BB-15 / Task 02)
 *
 * Checks:
 *  - JSON syntax across data/*.json
 *  - Canonical LGU dataset (22 LGUs, unique PSGC codes/slugs, valid seals, source metadata)
 *  - Barangay dataset (464 barangays, unique PSGC codes/slugs, valid parent LGU links, counts)
 *  - Contact directory dataset (unique IDs, valid categories/levels, verification metadata)
 *  - Internal HTML links and local asset references (images, CSS, JS)
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const VALID_STATUSES = new Set([
  'verified',
  'pending_verification',
  'historical',
  'unavailable',
  'disputed',
]);
const ALLOWED_IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.svg', '.webp', '.ico']);
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.next',
  'out',
  'public',
  'src',
  'react-app',
  'docs',
  'admin',
  'scripts',
  'tests',
  'test-results',
  'playwright-report',
  'screenshots',
  '.git',
  '.claude',
  '.wrangler',
]);
const DATA_ONLY = process.argv.includes('--data-only');

function resolveAssetPath(relAssetPath) {
  const cleanRel = relAssetPath.replace(/^\/+/, '');
  const rootCandidate = path.join(ROOT, cleanRel);
  if (fs.existsSync(rootCandidate)) return rootCandidate;
  const publicCandidate = path.join(ROOT, 'public', cleanRel);
  if (fs.existsSync(publicCandidate)) return publicCandidate;
  return rootCandidate;
}

const errors = [];
const warnings = [];

function err(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function readJson(relPath) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    err(`Missing required data file: ${relPath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (e) {
    err(`Malformed JSON in ${relPath}: ${e.message}`);
    return null;
  }
}

function validateSources(sources, context) {
  if (!Array.isArray(sources) || sources.length === 0) {
    err(`${context}: missing required "sources" array`);
    return;
  }
  sources.forEach((src, i) => {
    if (!src.agency && !src.name) {
      err(`${context} source[${i}]: missing "agency" or "name"`);
    }
    if (!src.url || typeof src.url !== 'string') {
      err(`${context} source[${i}]: missing "url"`);
    }
    if (src.status && !VALID_STATUSES.has(src.status)) {
      err(`${context} source[${i}]: invalid status "${src.status}"`);
    }
    if (src.last_verified) {
      const d = Date.parse(src.last_verified);
      if (Number.isNaN(d)) {
        err(`${context} source[${i}]: invalid last_verified date "${src.last_verified}"`);
      } else if (Date.now() - d > 365 * 24 * 60 * 60 * 1000) {
        warn(`${context} source[${i}]: verification date ${src.last_verified} is over 1 year old`);
      }
    }
  });
}

function validateAllJsonFiles() {
  for (const entry of fs.readdirSync(DATA_DIR)) {
    if (!entry.endsWith('.json')) continue;
    readJson(path.join('data', entry));
  }
}

function validateLgusAndBarangays() {
  const lguDoc = readJson('data/lgus.json');
  const brgyDoc = readJson('data/barangays.json');
  if (!lguDoc || !brgyDoc) return;

  const lgus = lguDoc.lgus;
  if (!Array.isArray(lgus) || lgus.length !== 22) {
    err(`data/lgus.json: expected 22 LGUs, found ${Array.isArray(lgus) ? lgus.length : 'non-array'}`);
    return;
  }

  const lguByPsgc = new Map();
  const lguBySlug = new Map();

  for (const lgu of lgus) {
    const ctx = `LGU "${lgu.name || lgu.slug || 'unknown'}"`;
    for (const field of [
      'psgc_code',
      'slug',
      'name',
      'classification',
      'district',
      'population',
      'barangay_count',
      'coordinates',
      'leadership',
      'sources',
    ]) {
      if (lgu[field] === undefined || lgu[field] === null) {
        err(`${ctx}: missing required field "${field}"`);
      }
    }

    if (lgu.psgc_code) {
      if (lguByPsgc.has(lgu.psgc_code)) {
        err(`${ctx}: duplicate PSGC code "${lgu.psgc_code}"`);
      }
      lguByPsgc.set(lgu.psgc_code, lgu);
    }

    if (lgu.slug) {
      if (lguBySlug.has(lgu.slug)) {
        err(`${ctx}: duplicate slug "${lgu.slug}"`);
      }
      lguBySlug.set(lgu.slug, lgu);
    }

    if (lgu.seal && lgu.seal.status === 'verified' && lgu.seal.path) {
      const sealFull = resolveAssetPath(lgu.seal.path);
      const ext = path.extname(lgu.seal.path).toLowerCase();
      if (!ALLOWED_IMAGE_EXTS.has(ext)) {
        err(`${ctx}: unsupported seal image format "${ext}" (${lgu.seal.path})`);
      }
      if (!fs.existsSync(sealFull)) {
        err(`${ctx}: missing seal image file "${lgu.seal.path}"`);
      }
    }

    for (const role of ['mayor', 'vice_mayor']) {
      const official = lgu.leadership && lgu.leadership[role];
      if (!official || !official.name) {
        err(`${ctx}: missing leadership.${role}.name`);
        continue;
      }
      if (!VALID_STATUSES.has(official.status)) {
        err(`${ctx}: invalid leadership.${role}.status "${official.status}"`);
      }
      if (official.status === 'verified') {
        const srcUrl = official.source_url || '';
        if (!srcUrl.includes('.gov.ph') || /^https?:\/\/(www\.)?comelec\.gov\.ph\/?$/i.test(srcUrl)) {
          err(
            `${ctx}: leadership.${role} ("${official.name}") is marked "verified" without a specific official .gov.ph source_url (${srcUrl})`
          );
        }
      }
    }

    validateSources(lgu.sources, ctx);
  }

  const barangays = brgyDoc.barangays;
  if (!Array.isArray(barangays) || barangays.length === 0) {
    err('data/barangays.json: missing or empty "barangays" array');
    return;
  }

  const brgyPsgc = new Set();
  const brgySlugs = new Set();
  const countByLgu = new Map();

  for (const b of barangays) {
    const ctx = `Barangay "${b.name || b.psgc_code || 'unknown'}"`;
    for (const field of ['psgc_code', 'name', 'slug', 'lgu_psgc', 'lgu_slug', 'lgu_name']) {
      if (!b[field]) {
        err(`${ctx}: missing required field "${field}"`);
      }
    }

    if (b.psgc_code) {
      if (brgyPsgc.has(b.psgc_code)) {
        err(`${ctx}: duplicate barangay PSGC code "${b.psgc_code}"`);
      }
      brgyPsgc.add(b.psgc_code);
    }

    if (b.slug) {
      if (brgySlugs.has(b.slug)) {
        err(`${ctx}: duplicate barangay slug "${b.slug}"`);
      }
      brgySlugs.add(b.slug);
    }

    const parent = lguByPsgc.get(b.lgu_psgc);
    if (!parent) {
      err(`${ctx}: lgu_psgc "${b.lgu_psgc}" does not match any LGU in data/lgus.json`);
    } else if (parent.slug !== b.lgu_slug) {
      err(`${ctx}: lgu_slug "${b.lgu_slug}" does not match parent LGU slug "${parent.slug}"`);
    }

    countByLgu.set(b.lgu_slug, (countByLgu.get(b.lgu_slug) || 0) + 1);
    validateSources(b.sources, ctx);
  }

  for (const lgu of lgus) {
    const actual = countByLgu.get(lgu.slug) || 0;
    if (actual !== lgu.barangay_count) {
      err(
        `LGU "${lgu.name}": barangay_count is ${lgu.barangay_count}, but data/barangays.json has ${actual}`
      );
    }
  }
}

function validateContacts() {
  const contactsPath = path.join(DATA_DIR, 'contacts.json');
  if (!fs.existsSync(contactsPath)) return;
  const doc = readJson('data/contacts.json');
  const lguDoc = readJson('data/lgus.json');
  if (!doc || !Array.isArray(doc.contacts)) {
    err('data/contacts.json: missing "contacts" array');
    return;
  }

  const validSlugs = new Set((lguDoc?.lgus || []).map((l) => l.slug));
  const ids = new Set();

  for (const c of doc.contacts) {
    const ctx = `Contact "${c.name || c.id || 'unknown'}"`;
    for (const field of ['id', 'name', 'level', 'category', 'verification_status', 'sources']) {
      if (!c[field]) {
        err(`${ctx}: missing required field "${field}"`);
      }
    }
    if (c.id) {
      if (ids.has(c.id)) err(`${ctx}: duplicate contact id "${c.id}"`);
      ids.add(c.id);
    }
    if (c.verification_status && !VALID_STATUSES.has(c.verification_status)) {
      err(`${ctx}: invalid verification_status "${c.verification_status}"`);
    }
    if (c.lgu_slug && !validSlugs.has(c.lgu_slug)) {
      err(`${ctx}: unknown lgu_slug "${c.lgu_slug}"`);
    }
    if (c.phone && /(?:^|\D)(?:09\d{2}|\+?63\s*9\d{2})/.test(c.phone)) {
      if (!c.is_official_agency_mobile || c.verification_status !== 'verified') {
        err(
          `${ctx}: mobile number "${c.phone}" is not permitted unless confirmed as an institutional agency line (is_official_agency_mobile: true, verification_status: "verified")`
        );
      }
    }
    validateSources(c.sources, ctx);
  }
}

function findHtmlPages(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) findHtmlPages(path.join(dir, entry.name), out);
    } else if (entry.name.endsWith('.html')) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function validateHtmlAssetsAndLinks() {
  const pages = findHtmlPages(ROOT);
  const attrRe = /\b(?:href|src)="([^"]+)"/g;

  for (const pagePath of pages) {
    const relPage = path.relative(ROOT, pagePath);
    const html = fs.readFileSync(pagePath, 'utf8');
    let match;
    while ((match = attrRe.exec(html)) !== null) {
      const target = match[1].trim();
      if (
        !target ||
        target.startsWith('#') ||
        target.startsWith('http://') ||
        target.startsWith('https://') ||
        target.startsWith('mailto:') ||
        target.startsWith('tel:') ||
        target.startsWith('data:') ||
        target.startsWith('javascript:') ||
        target.includes('{{')
      ) {
        continue;
      }

      const cleanTarget = target.split('#')[0].split('?')[0];
      if (!cleanTarget) continue;

      // Special exception: /services/health is built by Next.js in dist/
      if (cleanTarget.endsWith('/services/health') || cleanTarget === 'services/health') continue;

      const resolved = cleanTarget.startsWith('/')
        ? path.join(ROOT, cleanTarget.slice(1))
        : path.resolve(path.dirname(pagePath), cleanTarget);

      if (cleanTarget.endsWith('/')) {
        if (!fs.existsSync(path.join(resolved, 'index.html'))) {
          err(`${relPage}: broken directory reference "${target}" (missing index.html)`);
        }
      } else {
        if (!fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
          err(
            `${relPage}: broken or extensionless local reference "${target}" (must include .html or trailing /)`
          );
        }
      }
    }
  }
}

validateAllJsonFiles();
validateLgusAndBarangays();
validateContacts();
if (!DATA_ONLY && fs.existsSync(path.join(ROOT, 'index.html'))) {
  validateHtmlAssetsAndLinks();
}

if (warnings.length > 0) {
  console.warn(`Warnings (${warnings.length}):`);
  warnings.forEach((w) => console.warn(`  [WARN] ${w}`));
}

if (errors.length > 0) {
  console.error(`Validation failed with ${errors.length} error(s):`);
  errors.forEach((e) => console.error(`  [ERROR] ${e}`));
  process.exit(1);
}

console.log('Data and asset validation passed with 0 errors.');
