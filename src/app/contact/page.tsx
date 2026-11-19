import type { Metadata } from 'next';
import en from '@/features/legal/i18n/en.json';
import { ContactPage } from '@/features/legal/ContactPage';

export const metadata: Metadata = {
  title: en['contact-title'],
  description: en['contact-subtitle'],
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return <ContactPage />;
}
