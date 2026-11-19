import type { Metadata } from 'next';
import en from '@/features/services/i18n/en.json';
import { ServicesIndexPage } from '@/features/services/ServicesIndexPage';

export const metadata: Metadata = {
  title: en['services-title'],
  description: en['services-subtitle'],
  alternates: { canonical: '/services' },
};

export default function Page() {
  return <ServicesIndexPage />;
}
