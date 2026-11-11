/** Adding a language: add it here, then add `<code>.json` next to each feature's en.json. */
export const LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'fil', name: 'Filipino' },
  { code: 'ceb', name: 'Cebuano (Binisaya)' },
] as const;

export type Locale = (typeof LOCALES)[number]['code'];

export const DEFAULT_LOCALE: Locale = 'en';

/** Same key as the legacy site, so returning visitors keep their choice. */
export const STORAGE_KEY = 'selectedLang';

/**
 * Saved choice, then browser language, then English. Self-contained on purpose:
 * localeScript inlines its source into <head>.
 */
export function detectLocale(
  saved: string | null,
  browser: string | undefined,
  codes: readonly string[]
): Locale {
  if (saved && codes.indexOf(saved) !== -1) return saved as Locale;
  const code = (browser || '').split('-')[0].toLowerCase();
  if (code === 'tl' || code === 'fil') return 'fil';
  if (code === 'ceb' || code === 'bis') return 'ceb';
  return 'en';
}

/** Runs before paint: sets <html lang> and data-locale so the provider starts in the right locale. */
export const localeScript = `try{var l=(${detectLocale.toString()})(localStorage.getItem(${JSON.stringify(
  STORAGE_KEY
)}),navigator.language,${JSON.stringify(LOCALES.map((l) => l.code))});document.documentElement.lang=l;document.documentElement.dataset.locale=l}catch(e){}`;
