import type { Metadata } from 'next';
import en from '@/features/errors/i18n/en.json';
import { ErrorPage } from '@/features/errors/ErrorPage';

export const metadata: Metadata = {
  title: en['err403-access-forbidden'],
  robots: { index: false },
};

export default function Page() {
  return <ErrorPage code={403} />;
}
