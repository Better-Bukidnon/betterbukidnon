import type { Metadata } from 'next';
import en from '@/features/legal/i18n/en.json';
import { TermsPage } from '@/features/legal/TermsPage';

export const metadata: Metadata = {
  title: en['terms-terms-of-use'],
  description: en['terms-guidelines-for-using-betterbukidnonorg'],
  alternates: { canonical: '/terms' },
};

export default function Page() {
  return <TermsPage />;
}
