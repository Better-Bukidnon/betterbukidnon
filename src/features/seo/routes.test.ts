import fs from 'node:fs';
import path from 'node:path';
import { ROOT_FILES, ROUTES } from '@/features/seo/routes';

// Route coverage (spec §9): runs against out/ after `npm run build`, skipped when there is none.
// `npm run check:routes` requires it.
const OUT = path.resolve('out');
const hasOut = fs.existsSync(OUT);
if (!hasOut && process.env.npm_lifecycle_event === 'check:routes') {
  throw new Error('out/ not found: run `npm run build` first');
}

/** Cloudflare html_handling "auto-trailing-slash": /x/y is x/y.html or x/y/index.html. */
const fileFor = (route: string) =>
  (route === '/'
    ? ['index.html']
    : [`${route.slice(1)}.html`, `${route.slice(1)}/index.html`]
  ).find((f) => fs.existsSync(path.join(OUT, f)));

describe.skipIf(!hasOut)('route coverage (out/)', () => {
  it.each(ROUTES)('%s resolves to a file', (route) => {
    expect(fileFor(route)).toBeDefined();
  });

  it.each(ROOT_FILES)('%s exists at the root', (file) => {
    expect(fs.existsSync(path.join(OUT, file))).toBe(true);
  });

  it('sitemap.xml lists exactly the route list', () => {
    const xml = fs.readFileSync(path.join(OUT, 'sitemap.xml'), 'utf8');
    const paths = [...xml.matchAll(/<loc>https?:\/\/[^/<]+([^<]*)<\/loc>/g)].map(
      (m) => m[1] || '/'
    );
    expect([...paths].sort()).toEqual([...ROUTES].sort());
  });

  it('ships no dev-only admin route', () => {
    expect(fs.existsSync(path.join(OUT, 'admin'))).toBe(false);
  });
});
