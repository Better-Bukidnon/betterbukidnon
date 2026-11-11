import type { Metadata } from 'next';
import en from '@/features/legal/i18n/en.json';
import { PrivacyPage } from '@/features/legal/PrivacyPage';

export const metadata: Metadata = {
  title: en['privacy-privacy-policy'],
  description: en['privacy-how-we-collect-use-and-protect-your-information'],
  alternates: { canonical: '/privacy' },
};

export default function Page() {
  return <PrivacyPage />;
}
