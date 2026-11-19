import type { Metadata } from 'next';
import en from '@/features/legal/i18n/en.json';
import { FaqPage } from '@/features/legal/FaqPage';

export const metadata: Metadata = {
  title: en['faq-title'],
  description: en['faq-subtitle'],
  alternates: { canonical: '/faq' },
};

export default function Page() {
  return <FaqPage />;
}
