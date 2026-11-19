import type { MDXContent } from 'mdx/types';
import type { Locale } from '@/features/i18n/locales';

/** A compiled office MDX file: the body plus its frontmatter (from remark-mdx-frontmatter). */
export interface OfficeModule {
  default: MDXContent;
  frontmatter: unknown;
}

/**
 * The bundler turns this template into one chunk per MDX file, so a locale's body is fetched
 * only when a visitor switches to it.
 */
export function loadOfficeModule(slug: string, locale: Locale): Promise<OfficeModule> {
  return import(`@/content/service-details/${slug}/${locale}.mdx`);
}
