import { act, render, screen } from '@testing-library/react';
import ceb from '@/features/i18n/i18n/ceb.json';
import en from '@/features/i18n/i18n/en.json';
import fil from '@/features/i18n/i18n/fil.json';
import { LanguageProvider, useLocale } from '@/features/i18n/LanguageProvider';
import { detectLocale, localeScript } from '@/features/i18n/locales';
import { interpolate, useT, type Dictionary } from '@/features/i18n/useT';

const CODES = ['en', 'fil', 'ceb'];

describe('detectLocale', () => {
  it('prefers the saved choice, then the browser language, then English', () => {
    expect(detectLocale('ceb', 'tl-PH', CODES)).toBe('ceb');
    expect(detectLocale(null, 'tl-PH', CODES)).toBe('fil');
    expect(detectLocale(null, 'fil', CODES)).toBe('fil');
    expect(detectLocale(null, 'bis', CODES)).toBe('ceb');
    expect(detectLocale('xx', 'ja-JP', CODES)).toBe('en');
    expect(detectLocale(null, undefined, CODES)).toBe('en');
  });

  it('runs standalone inside the head script', () => {
    localStorage.setItem('selectedLang', 'fil');
    new Function(localeScript)();
    expect(document.documentElement.lang).toBe('fil');
    expect(document.documentElement.dataset.locale).toBe('fil');
    localStorage.clear();
  });
});

describe('interpolate', () => {
  it('fills placeholders and leaves unknown ones', () => {
    expect(interpolate('Showing {{count}} of {{ total }}', { count: 3, total: 9 })).toBe(
      'Showing 3 of 9'
    );
    expect(interpolate('Hi {{name}}', {})).toBe('Hi {{name}}');
  });
});

describe('useT', () => {
  const dict: Dictionary<'a' | 'b'> = {
    en: { a: 'A-en', b: 'B-en' },
    load: { fil: async () => ({ default: { a: 'A-fil' } }) },
  };

  function Probe() {
    const t = useT(dict);
    const { setLocale } = useLocale();
    return (
      <>
        <p>
          {t('a')} {t('b')}
        </p>
        <button onClick={() => setLocale('fil')}>fil</button>
        <button onClick={() => setLocale('ceb')}>ceb</button>
      </>
    );
  }

  it('lazy-loads a locale and falls back to English per key and per missing locale', async () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    expect(screen.getByText('A-en B-en')).toBeTruthy();

    await act(async () => screen.getByText('fil').click());
    expect(await screen.findByText('A-fil B-en')).toBeTruthy();
    expect(localStorage.getItem('selectedLang')).toBe('fil');

    await act(async () => screen.getByText('ceb').click());
    expect(screen.getByText('A-en B-en')).toBeTruthy();
  });
});

describe('chrome dictionaries', () => {
  it('only translate keys that exist in English', () => {
    for (const other of [fil, ceb]) {
      expect(Object.keys(other).filter((k) => !(k in en))).toEqual([]);
    }
  });
});
