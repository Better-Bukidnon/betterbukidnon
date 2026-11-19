import type { MetadataRoute } from 'next';
import { ROUTES } from '@/features/seo/routes';

export const dynamic = 'force-static';

const SITE_URL = process.env.SITE_URL ?? 'https://betterbukidnon.org';

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({ url: `${SITE_URL}${route}` }));
}
