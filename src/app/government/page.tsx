import type { Metadata } from 'next';
import en from '@/features/government/i18n/en.json';
import { GovernmentPage } from '@/features/government/GovernmentPage';

export const metadata: Metadata = {
  title: en['gov-title'],
  description: en['gov-subtitle'],
  alternates: { canonical: '/government' },
};

export default function Page() {
  return <GovernmentPage />;
}
