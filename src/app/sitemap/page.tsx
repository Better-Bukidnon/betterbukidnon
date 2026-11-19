import type { Metadata } from 'next';
import en from '@/features/legal/i18n/en.json';
import { SitemapPage } from '@/features/legal/SitemapPage';

export const metadata: Metadata = {
  title: en['sitemap-sitemap'],
  description: en['sitemap-navigate-all-pages-and-services-of-better-bukidnon'],
  alternates: { canonical: '/sitemap' },
};

export default function Page() {
  return <SitemapPage />;
}
