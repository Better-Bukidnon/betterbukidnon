'use client';

import type { MDXContent } from 'mdx/types';
import { useEffect, useState, type ReactNode } from 'react';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useLocale } from '@/features/i18n/LanguageProvider';
import type { Locale } from '@/features/i18n/locales';
import { useT } from '@/features/i18n/useT';
import {
  validateTranslation,
  type TranslatedFrontmatter,
} from '@/features/service-details/frontmatter';
import { loadOfficeModule } from '@/features/service-details/officeModule';
import { serviceDetailsDictionary } from '@/features/service-details/serviceDetailsDictionary';
import { servicesDictionary } from '@/features/services/servicesDictionary';
import type { ServicesKey } from '@/features/services/types';
import { PageHero } from '@/shared/PageHero';

interface Loaded {
  locale: Locale;
  head: TranslatedFrontmatter;
  Body: MDXContent;
}

/**
 * Hero + body of an office page. English is server-rendered (`children`); another locale's MDX
 * is fetched on switch, and a locale without a file keeps English plus a "not yet translated" note.
 */
export function LocalizedOffice({
  slug,
  translated,
  head,
  parent,
  children,
}: {
  slug: string;
  translated: Locale[];
  head: TranslatedFrontmatter;
  parent: { href: string; label: { services: ServicesKey } | { chrome: 'nav-government' } };
  children: ReactNode;
}) {
  const { locale } = useLocale();
  const nav = useT(chromeDictionary);
  const s = useT(servicesDictionary);
  const t = useT(serviceDetailsDictionary);
  const [loaded, setLoaded] = useState<Loaded>();
  const hasFile = locale !== 'en' && translated.includes(locale);

  useEffect(() => {
    if (!hasFile) return;
    let live = true;
    loadOfficeModule(slug, locale).then((mod) => {
      const fm = validateTranslation(mod.frontmatter, `${slug}/${locale}.mdx`);
      if (live) setLoaded({ locale, head: fm, Body: mod.default });
    });
    return () => {
      live = false;
    };
  }, [slug, locale, hasFile]);

  const current = loaded?.locale === locale ? loaded : undefined;
  const shown = current?.head ?? head;
  const parentLabel =
    'services' in parent.label ? s(parent.label.services) : nav(parent.label.chrome);

  return (
    <>
      <PageHero
        crumbs={[
          { label: nav('nav-home'), href: '/' },
          { label: nav('nav-services'), href: '/services' },
          { label: parentLabel, href: parent.href },
          { label: shown.title },
        ]}
        title={shown.title}
        description={shown.summary}
      />
      <div className="mx-auto max-w-site px-sm py-lg">
        {locale !== 'en' && !hasFile && (
          <p role="note" className="mb-md rounded-base bg-bg-alt p-sm text-sm text-text-light">
            {t('sd-not-translated')}
          </p>
        )}
        {current ? <current.Body /> : children}
      </div>
    </>
  );
}
