import type { Metadata } from 'next';
import en from '@/features/legislative/i18n/en.json';
import { FrameworkPage } from '@/features/legislative/FrameworkPage';

export const metadata: Metadata = {
  title: en['reso-page-title'],
  description: en['reso-page-desc'],
  alternates: { canonical: '/legislative/resolution-framework' },
};

export default function Page() {
  return <FrameworkPage kind="reso" />;
}
