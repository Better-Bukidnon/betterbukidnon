import type { Metadata } from 'next';
import en from '@/features/legal/i18n/en.json';
import { AccessibilityPage } from '@/features/legal/AccessibilityPage';

export const metadata: Metadata = {
  title: en['access-title'],
  description: en['access-subtitle'],
  alternates: { canonical: '/accessibility' },
};

export default function Page() {
  return <AccessibilityPage />;
}
