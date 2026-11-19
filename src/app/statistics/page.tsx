import type { Metadata } from 'next';
import en from '@/features/statistics/i18n/en.json';
import { StatisticsPage } from '@/features/statistics/StatisticsPage';

export const metadata: Metadata = {
  title: en['stats-title'],
  description: en['stats-subtitle'],
  alternates: { canonical: '/statistics' },
};

export default function Page() {
  return <StatisticsPage />;
}
