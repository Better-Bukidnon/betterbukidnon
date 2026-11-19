'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { DEFAULT_LOCALE, LOCALES, STORAGE_KEY, type Locale } from '@/features/i18n/locales';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Pre-rendered HTML is English; the head script already picked the visitor's locale.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const picked = document.documentElement.dataset.locale;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync from the pre-paint head script
    if (LOCALES.some((l) => l.code === picked)) setLocaleState(picked as Locale);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    document.documentElement.dataset.locale = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked (private mode): the choice lasts for this page only.
    }
  }, []);

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
