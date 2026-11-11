import type { Metadata } from 'next';
import en from '@/features/legislative/i18n/en.json';
import { FrameworkPage } from '@/features/legislative/FrameworkPage';

export const metadata: Metadata = {
  title: en['ord-page-title'],
  description: en['ord-page-desc'],
  alternates: { canonical: '/legislative/ordinance-framework' },
};

export default function Page() {
  return <FrameworkPage kind="ord" />;
}
