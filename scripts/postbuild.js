#!/usr/bin/env node
/**
 * Runs after `next build` on out/, the deploy directory:
 *
 *   1. Fails if a dev-only route (app/admin, see pageExtensions in next.config.ts) was exported,
 *      or if out/_headers (CSP, HSTS, X-Frame-Options; copied from public/) is missing: without
 *      it the site would deploy with no security headers and the build would still pass.
 *   2. Copies each nested segment-prefetch file (x/__next.a/b/__PAGE__.txt) to the flat name the
 *      router requests (x/__next.a.b.__PAGE__.txt). Without it every <Link> prefetch 404s.
 *      ponytail: workaround for vercel/next.js#85374; delete once Next exports flat names.
 *   3. Strips every <script> from offline.html, so the service-worker fallback is plain HTML+CSS:
 *      it needs no JS chunk and never hydrates under the URL it is served for.
 *   4. Writes out/sw.js from public/sw.js with the precache list (core routes, /offline and the
 *      /_next/static files they load) and a CACHE_VERSION hashed from those files.
 *   5. Copies src/content/data/*.json to out/data/, so the public data URLs the old site served
 *      (/data/news.json, /data/projects.json, /data/officials.json, ...) keep working.
 */
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'out');
const DATA = path.join(ROOT, 'src', 'content', 'data');
const CORE_ROUTES = ['/', '/services', '/news', '/projects', '/contact', '/offline'];
const STATIC_FILES = [
  '/manifest.webmanifest',
  '/assets/images/logo/better-bukidnon-logo.svg',
  '/assets/images/logo/better-bukidnon-logo-white.svg',
  '/assets/images/logo/favicon.svg',
  '/assets/images/logo/favicon.ico',
];

const fileOf = (url) =>
  path.join(OUT, url === '/' ? 'index.html' : path.extname(url) ? url : `${url}.html`);

function assetsOf(htmlFile) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const assets = [...html.matchAll(/(?:href|src)="(\/_next\/static\/[^"?#]+)"/g)].map((m) => m[1]);
  // Fonts and images referenced from the CSS.
  for (const css of assets.filter((a) => a.endsWith('.css'))) {
    const text = fs.readFileSync(fileOf(css), 'utf8');
    for (const [, ref] of text.matchAll(
      /url\(["']?([^"')]+\.(?:woff2?|png|svg|jpg|webp))["']?\)/g
    )) {
      if (!/^(data:|https?:)/.test(ref))
        assets.push(path.posix.resolve(path.posix.dirname(css), ref));
    }
  }
  return assets;
}

/** Returns how many flat copies were written under dir. */
function flattenSegments(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === '_next') continue;
    const full = path.join(dir, entry.name);
    if (!entry.name.startsWith('__next.')) {
      count += flattenSegments(full);
      continue;
    }
    const walk = (sub, prefix) => {
      for (const e of fs.readdirSync(sub, { withFileTypes: true })) {
        const name = `${prefix}.${e.name}`;
        if (e.isDirectory()) walk(path.join(sub, e.name), name);
        else {
          fs.copyFileSync(path.join(sub, e.name), path.join(dir, name));
          count++;
        }
      }
    };
    walk(full, entry.name);
  }
  return count;
}

function main() {
  if (!fs.existsSync(OUT)) throw new Error('out/ not found: run `next build` first');

  for (const devOnly of ['admin', 'admin.html']) {
    if (fs.existsSync(path.join(OUT, devOnly))) {
      throw new Error(
        `out/${devOnly} exists: dev-only routes must not be exported (pageExtensions)`
      );
    }
  }

  if (!fs.existsSync(path.join(OUT, '_headers'))) {
    throw new Error('out/_headers not found: the site would ship without CSP or HSTS');
  }

  console.log(`Flattened ${flattenSegments(OUT)} segment-prefetch files (vercel/next.js#85374)`);

  const offline = fileOf('/offline');
  fs.writeFileSync(
    offline,
    fs
      .readFileSync(offline, 'utf8')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
      .replace(/<link\b[^>]*(?:as="script"|rel="modulepreload")[^>]*>/g, '')
  );

  const routes = CORE_ROUTES.filter((r) => fs.existsSync(fileOf(r)));
  const urls = [
    ...new Set([...routes, ...routes.flatMap((r) => assetsOf(fileOf(r))), ...STATIC_FILES]),
  ].sort();
  const hash = crypto.createHash('sha256');
  for (const url of urls) hash.update(url).update(fs.readFileSync(fileOf(url)));
  const version = `next-${hash.digest('hex').slice(0, 12)}`;

  let sw = fs.readFileSync(path.join(ROOT, 'public', 'sw.js'), 'utf8');
  for (const [pattern, value] of [
    [/^const CACHE_VERSION = .*;$/m, `const CACHE_VERSION = ${JSON.stringify(version)};`],
    [/^const PRECACHE_URLS = \[\];$/m, `const PRECACHE_URLS = ${JSON.stringify(urls, null, 2)};`],
  ]) {
    if (!pattern.test(sw)) throw new Error(`public/sw.js: ${pattern} not found`);
    sw = sw.replace(pattern, value);
  }
  fs.writeFileSync(path.join(OUT, 'sw.js'), sw);
  console.log(`sw.js ${version}: precaching ${urls.length} files (${routes.join(', ')})`);

  const dataFiles = fs.readdirSync(DATA).filter((f) => f.endsWith('.json'));
  fs.mkdirSync(path.join(OUT, 'data'), { recursive: true });
  for (const f of dataFiles) fs.copyFileSync(path.join(DATA, f), path.join(OUT, 'data', f));
  console.log(`Copied ${dataFiles.length} data files to out/data/`);
}

main();
