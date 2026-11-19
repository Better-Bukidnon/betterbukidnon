import { agriculture } from '@/features/services/categories/agriculture';
import { business } from '@/features/services/categories/business';
import { certificates } from '@/features/services/categories/certificates';
import { education } from '@/features/services/categories/education';
import { environment } from '@/features/services/categories/environment';
import { infrastructure } from '@/features/services/categories/infrastructure';
import { publicSafety } from '@/features/services/categories/public-safety';
import { socialServices } from '@/features/services/categories/social-services';
import { taxPayments } from '@/features/services/categories/tax-payments';
import type { Category, ServicesKey } from '@/features/services/types';

/** Category pages built from the generic template. /services/health keeps its own layout. */
export const categories = {
  agriculture,
  business,
  certificates,
  education,
  environment,
  infrastructure,
  'public-safety': publicSafety,
  'social-services': socialServices,
  'tax-payments': taxPayments,
} satisfies Record<string, Category>;

export type TemplateCategory = keyof typeof categories;
export type CategorySlug = TemplateCategory | 'health';

export const CATEGORY_SLUGS = [
  ...(Object.keys(categories) as TemplateCategory[]),
  'health',
] as const;

export function isCategorySlug(value: unknown): value is CategorySlug {
  return CATEGORY_SLUGS.some((s) => s === value);
}

/** Breadcrumb label of each category page, reused by the office pages under it. */
export function categoryCrumb(slug: CategorySlug): ServicesKey {
  return slug === 'health' ? 'health-page-badge' : categories[slug].crumb;
}
