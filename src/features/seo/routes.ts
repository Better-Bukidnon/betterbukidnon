import { officeSlugs } from '@/features/service-details/officeData';
import { CATEGORY_SLUGS } from '@/features/services/categories';

/**
 * Every page URL of the site (spec §3.3). sitemap.xml and the route-coverage test read this.
 * Category and office routes come from the same sources their pages are generated from.
 */
export const ROUTES = [
  '/',
  '/services',
  ...CATEGORY_SLUGS.map((c) => `/services/${c}`),
  ...officeSlugs().map((o) => `/service-details/${o}`),
  '/government',
  '/government/officials',
  '/statistics',
  '/legislative',
  '/legislative/ordinance-framework',
  '/legislative/resolution-framework',
  '/budget',
  '/news',
  '/projects',
  '/contact',
  '/faq',
  '/terms',
  '/privacy',
  '/accessibility',
  '/sitemap',
];

/** Served from the export root but not listed in the sitemap. */
export const ROOT_FILES = [
  '403.html',
  '404.html',
  '500.html',
  'offline.html',
  'robots.txt',
  'sitemap.xml',
  'manifest.webmanifest',
  'sw.js',
  'version.json',
  'assets/images/banners/opengraph.png',
  // Security headers for Cloudflare (public/_headers); postbuild.js also fails without it.
  '_headers',
  // Public data, same URLs as the pre-Next.js site (copied by scripts/postbuild.js).
  'data/news.json',
  'data/projects.json',
  'data/services.json',
  'data/officials.json',
];
