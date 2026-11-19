import type { Metadata } from 'next';
import en from '@/features/errors/i18n/en.json';
import { OfflinePage } from '@/features/errors/OfflinePage';

export const metadata: Metadata = { title: en['offline'], robots: { index: false } };

export default function Page() {
  return <OfflinePage />;
}
