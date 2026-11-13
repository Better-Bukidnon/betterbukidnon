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

// Every page URL of the pre-Next.js site (`git ls-tree -r --name-only fce5da9`). Frozen on purpose:
// ROUTES is derived from the page sources, so deleting a page would also drop it from ROUTES.
// Remove an entry here only when the URL is retired on purpose.
const LEGACY_ROUTES = [
  '/',
  '/accessibility',
  '/budget',
  '/contact',
  '/faq',
  '/government',
  '/government/officials',
  '/legislative',
  '/legislative/ordinance-framework',
  '/legislative/resolution-framework',
  '/news',
  '/privacy',
  '/projects',
  '/sitemap',
  '/statistics',
  '/terms',
  '/services',
  ...[
    'agriculture',
    'business',
    'certificates',
    'education',
    'environment',
    'health',
    'infrastructure',
    'public-safety',
    'social-services',
    'tax-payments',
  ].map((c) => `/services/${c}`),
  ...[
    'birth-certificate',
    'business-permits-licensing',
    'civil-registrar',
    'death-certificate',
    'human-resource-management',
    'marriage-certificate',
    'pdrrmd',
    'property-declaration',
    'provincial-accounting',
    'provincial-agriculture',
    'provincial-assessor',
    'provincial-budget',
    'provincial-engineering',
    'provincial-general-services',
    'provincial-health-office',
    'provincial-planning',
    'provincial-treasurer',
    'pswdo',
  ].map((o) => `/service-details/${o}`),
];

it.each(LEGACY_ROUTES)('legacy route %s is still a route', (route) => {
  expect(ROUTES).toContain(route);
});

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
