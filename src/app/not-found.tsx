import type { Metadata } from 'next';
import en from '@/features/errors/i18n/en.json';
import { ErrorPage } from '@/features/errors/ErrorPage';

export const metadata: Metadata = { title: en['err404-page-not-found'], robots: { index: false } };

export default function NotFound() {
  return <ErrorPage code={404} />;
}
