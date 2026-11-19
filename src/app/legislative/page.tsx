import type { Metadata } from 'next';
import en from '@/features/legislative/i18n/en.json';
import { LegislativePage } from '@/features/legislative/LegislativePage';

export const metadata: Metadata = {
  title: en['leg-legislative-documents'],
  description: en['leg-ordinances-and-resolutions-of-the-sangguniang'],
  alternates: { canonical: '/legislative' },
};

export default function Page() {
  return <LegislativePage />;
}
