import type { Metadata } from 'next';
import en from '@/features/services/i18n/en.json';
import { CATEGORY_SLUGS, categories, type CategorySlug } from '@/features/services/categories';
import { CategoryPage } from '@/features/services/CategoryPage';
import { HealthPage } from '@/features/services/HealthPage';

type Props = { params: Promise<{ category: CategorySlug }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const c = category === 'health' ? undefined : categories[category];
  return {
    title: en[c ? c.title : 'health-page-title'],
    description: en[c ? c.desc : 'health-page-desc'],
    alternates: { canonical: `/services/${category}` },
  };
}

export default async function Page({ params }: Props) {
  const { category } = await params;
  return category === 'health' ? <HealthPage /> : <CategoryPage slug={category} />;
}
