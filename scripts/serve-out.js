#!/usr/bin/env node
/**
 * Serves out/ the way Cloudflare's static-assets runtime does (wrangler.jsonc), for the
 * Playwright smoke suite and local previews:
 *
 *   - html_handling "auto-trailing-slash": /x/y serves x/y.html or x/y/index.html
 *   - not_found_handling "404-page": anything else gets out/404.html with status 404
 *
 * Usage: node scripts/serve-out.js [port]   (default 4173, or $PORT)
 */
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out');
const PORT = Number(process.argv[2] || process.env.PORT || 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

const isFile = (f) => fs.existsSync(f) && fs.statSync(f).isFile();

/** Returns the file to serve for a URL path, or undefined. Never leaves out/. */
function resolve(urlPath) {
  const rel = path.normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, '');
  const base = path.join(OUT, rel);
  if (base !== OUT && !base.startsWith(OUT + path.sep)) return undefined;
  const candidates = urlPath.endsWith('/')
    ? [path.join(base, 'index.html')]
    : [base, `${base}.html`, path.join(base, 'index.html')];
  return candidates.find(isFile);
}

if (!fs.existsSync(OUT)) {
  console.error('out/ not found: run `npm run build` first');
  process.exit(1);
}

http
  .createServer((req, res) => {
    let file;
    try {
      file = resolve(new URL(req.url, 'http://localhost').pathname);
    } catch {
      file = undefined;
    }
    const status = file ? 200 : 404;
    file ??= path.join(OUT, '404.html');
    res.writeHead(status, {
      'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
    });
    fs.createReadStream(file).pipe(res);
  })
  // Loopback only, so `out/` isn't exposed on the LAN. Doesn't send `_headers` (no CSP/HSTS).
  .listen(PORT, '127.0.0.1', () => console.log(`Serving out/ at http://127.0.0.1:${PORT}`));
