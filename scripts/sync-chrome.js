#!/usr/bin/env node
/**
 * Keeps the shared page chrome (skip link, hotline bar, header, footer) identical on every page.
 *
 * The single source for each block is a template in scripts/chrome/. Every static page keeps a
 * complete copy of the block between two marker comments, so the site works without a build,
 * without JavaScript and without layout shift. This script rewrites those copies.
 *
 *   node scripts/sync-chrome.js           rewrite every page from the templates
 *   node scripts/sync-chrome.js --check   change nothing; exit 1 if any page is out of date
 *
 * Markers in a page:
 *
 *   <!-- chrome:header -->
 *   ...generated, do not edit...
 *   <!-- /chrome:header -->
 *
 * Options go after the block name: `<!-- chrome:footer no-margin-top -->`.
 *
 * Template tokens:
 *   {{root}}        path from the page to the site root ('' , '../' or '/' for the error pages)
 *   {{home}}        link to the homepage ('./', '../' or '/')
 *   {{version}}     version from version.json
 *   {{active:key}}  ` class="active"` when the page belongs to nav item `key`, otherwise nothing
 *   {{opt name}}    ` name` when the page's marker lists the option `name`, otherwise nothing
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TEMPLATE_DIR = path.join(__dirname, 'chrome');

/** Blocks in page order. The marker name matches the template file name. */
const BLOCKS = ['skip-link', 'hotline', 'header', 'footer'];

/** Pages that intentionally have no shared chrome (standalone offline fallback). */
const EXEMPT = new Set(['offline.html']);

/** Folders that never hold site pages. */
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  'react-app',
  'docs',
  'admin',
  'scripts',
  'tests',
  'test-results',
  'playwright-report',
  'screenshots',
  'release',
  '.git',
  '.claude',
  '.wrangler',
]);

/** The error pages are served from any URL, so their links must be absolute. */
const ABSOLUTE_ROOT_PAGES = new Set(['403.html', '404.html', '500.html']);

/** First folder of a page -> the top-level nav item that is highlighted on it. */
const SECTION_NAV = {
  services: 'services',
  'service-details': 'services',
  government: 'government',
  statistics: 'statistics',
  legislative: 'legislative',
  budget: 'transparency',
  projects: 'projects',
  contact: 'contact',
};

/** Pages that also highlight an entry inside a dropdown. */
const PAGE_NAV = {
  'index.html': ['home'],
  'legislative/ordinance-framework.html': ['ordinance-framework'],
  'legislative/resolution-framework.html': ['resolution-framework'],
};

function findPages(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) findPages(path.join(dir, entry.name), out);
    } else if (entry.name.endsWith('.html')) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function pageContext(rel, version) {
  const depth = rel.split('/').length - 1;
  const absolute = ABSOLUTE_ROOT_PAGES.has(rel);
  const root = absolute ? '/' : '../'.repeat(depth);
  const home = absolute ? '/' : depth === 0 ? './' : root;
  const active = new Set(PAGE_NAV[rel] || []);
  const section = SECTION_NAV[rel.split('/')[0]];
  if (depth > 0 && section) active.add(section);
  return { root, home, version, active };
}

function render(template, ctx, options, rel, name) {
  return template.replace(/\{\{\s*([a-z-]+)(?:[: ]([a-z-]+))?\s*\}\}/g, (token, key, arg) => {
    if (key === 'root') return ctx.root;
    if (key === 'home') return ctx.home;
    if (key === 'version') return ctx.version;
    if (key === 'active' && arg) return ctx.active.has(arg) ? ' class="active"' : '';
    if (key === 'opt' && arg) return options.includes(arg) ? ' ' + arg : '';
    throw new Error(`${rel}: unknown token ${token} in chrome/${name}.html`);
  });
}

/**
 * The React app has its own header (react-app/src/components/layout/Header.tsx). It is not
 * generated, so compare the links of both and report any that exist in only one of them.
 */
function reactHeaderDrift(templates) {
  const normalize = (href) => {
    if (/^https?:/.test(href)) return href;
    const clean = href.replace(/^\{\{(?:root|home)\}\}/, '/').replace(/^\/+/, '/');
    return clean.length > 1 ? clean.replace(/\/$/, '') : clean;
  };
  const collect = (text, pattern) =>
    new Set(
      Array.from(text.matchAll(pattern), (m) => m[1])
        .filter((href) => !href.startsWith('#'))
        .map(normalize)
    );
  const tsx = fs.readFileSync(
    path.join(ROOT, 'react-app', 'src', 'components', 'layout', 'Header.tsx'),
    'utf8'
  );
  const inTemplate = collect(templates.header, /href="([^"]+)"/g);
  const inReact = collect(tsx, /href(?:=|:\s*)['"]([^'"]+)['"]/g);
  const problems = [];
  for (const href of inTemplate)
    if (!inReact.has(href)) problems.push(`Header.tsx is missing the link ${href}`);
  for (const href of inReact)
    if (!inTemplate.has(href))
      problems.push(`scripts/chrome/header.html is missing the link ${href}`);
  return problems;
}

async function main() {
  const check = process.argv.includes('--check');
  const prettier = require('prettier');
  const prettierConfig = (await prettier.resolveConfig(path.join(ROOT, 'index.html'))) || {};
  const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'version.json'), 'utf8')).version;
  const templates = Object.fromEntries(
    BLOCKS.map((name) => [name, fs.readFileSync(path.join(TEMPLATE_DIR, `${name}.html`), 'utf8')])
  );

  const stale = [];
  const problems = reactHeaderDrift(templates);
  const pages = findPages(ROOT, []).sort();

  for (const file of pages) {
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    if (EXEMPT.has(rel)) continue;

    const ctx = pageContext(rel, version);
    const original = fs.readFileSync(file, 'utf8');
    let content = original;

    for (const name of BLOCKS) {
      const marker = new RegExp(
        `^([ \\t]*)<!-- chrome:${name}((?: [a-z-]+)*) -->\\n(?:[\\s\\S]*?\\n)?[ \\t]*<!-- /chrome:${name} -->`,
        'm'
      );
      const found = content.match(marker);
      if (!found) {
        problems.push(
          `${rel}: missing <!-- chrome:${name} --> ... <!-- /chrome:${name} --> markers`
        );
        continue;
      }
      const indent = found[1];
      const options = found[2].trim().split(/\s+/).filter(Boolean);
      const rendered = render(templates[name], ctx, options, rel, name);
      const formatted = await prettier.format(rendered, {
        ...prettierConfig,
        parser: 'html',
        printWidth: (prettierConfig.printWidth || 80) - indent.length,
      });
      const body = formatted
        .trimEnd()
        .split('\n')
        .map((line) => (line ? indent + line : line))
        .join('\n');
      const open = `${indent}<!-- chrome:${name}${options.map((o) => ' ' + o).join('')} -->`;
      const close = `${indent}<!-- /chrome:${name} -->`;
      content = content.replace(marker, () => `${open}\n${body}\n${close}`);
    }

    if (content !== original) {
      stale.push(rel);
      if (!check) fs.writeFileSync(file, content);
    }
  }

  if (problems.length) {
    console.error(problems.join('\n'));
    process.exitCode = 1;
  }
  if (check) {
    if (stale.length) {
      console.error(
        `Shared page chrome is out of date in ${stale.length} file(s):\n  ` +
          stale.join('\n  ') +
          '\nRun `npm run chrome` and commit the result.'
      );
      process.exitCode = 1;
    } else if (!problems.length) {
      console.log(`Shared page chrome is up to date (${pages.length - EXEMPT.size} pages).`);
    }
  } else {
    console.log(`Synced shared page chrome: ${stale.length} page(s) changed.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
