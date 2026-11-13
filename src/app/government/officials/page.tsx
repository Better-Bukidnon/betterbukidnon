import type { Metadata } from 'next';
import en from '@/features/government/i18n/en.json';
import { OfficialsPage } from '@/features/government/OfficialsPage';

export const metadata: Metadata = {
  title: en['officials-elected-officials'],
  description: en['officials-meet-the-leaders-serving-the-province-of'],
  alternates: { canonical: '/government/officials' },
};

export default function Page() {
  return <OfficialsPage />;
}
