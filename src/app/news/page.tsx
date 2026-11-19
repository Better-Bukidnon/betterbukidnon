import type { Metadata } from 'next';
import en from '@/features/news/i18n/en.json';
import { NewsPage } from '@/features/news/NewsPage';

export const metadata: Metadata = {
  title: en['news-news-updates'],
  description: en['news-stay-informed-about-the-latest-happenings-in'],
  alternates: { canonical: '/news' },
};

export default function Page() {
  return <NewsPage />;
}
