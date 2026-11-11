'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale } from '@/features/i18n/LanguageProvider';
import type { Locale } from '@/features/i18n/locales';

type Strings<K extends string> = Record<K, string>;
type Loader<K extends string> = () => Promise<{ default: Partial<Strings<K>> }>;

/** English is bundled; other locales load on demand. A missing loader or key falls back to English. */
export interface Dictionary<K extends string> {
  en: Strings<K>;
  load: Partial<Record<Exclude<Locale, 'en'>, Loader<K>>>;
}

export type Vars = Record<string, string | number>;

export function interpolate(text: string, vars?: Vars): string {
  if (!vars) return text;
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (token, name: string) =>
    name in vars ? String(vars[name]) : token
  );
}

/** Keys are typed from the English JSON, so a typo is a compile error. */
export function useT<K extends string>(dict: Dictionary<K>) {
  const { locale } = useLocale();
  const [loaded, setLoaded] = useState<{ locale: Locale; strings: Partial<Strings<K>> }>();

  useEffect(() => {
    const load = locale === 'en' ? undefined : dict.load[locale];
    if (!load) return;
    let live = true;
    load().then((mod) => live && setLoaded({ locale, strings: mod.default }));
    return () => {
      live = false;
    };
  }, [locale, dict]);

  const strings = loaded?.locale === locale ? loaded.strings : undefined;
  return useCallback(
    (key: K, vars?: Vars) => interpolate(strings?.[key] ?? dict.en[key], vars),
    [strings, dict]
  );
}
