import type { Metadata } from 'next';
import en from '@/features/transparency/i18n/en.json';
import { BudgetPage } from '@/features/transparency/BudgetPage';

export const metadata: Metadata = {
  title: en['budget-title'],
  description: en['budget-subtitle'],
  alternates: { canonical: '/budget' },
};

export default function Page() {
  return <BudgetPage />;
}
