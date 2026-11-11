'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Check2, ChevronDown, Globe2 } from 'react-bootstrap-icons';
import { useLocale } from '@/features/i18n/LanguageProvider';
import { LOCALES } from '@/features/i18n/locales';

export function LanguageMenu() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      setOpen(false);
      toggleRef.current?.focus();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      const options = optionRefs.current;
      const index = options.indexOf(document.activeElement as HTMLButtonElement);
      const start =
        index === -1
          ? LOCALES.findIndex((l) => l.code === locale)
          : index + (e.key === 'ArrowDown' ? 1 : -1);
      // Wait for the list to render before moving focus.
      requestAnimationFrame(() => options[(start + options.length) % options.length]?.focus());
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- arrow keys from the toggle and options bubble here
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={onKeyDown}
      onBlur={(e) => {
        if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        className="flex min-h-11 items-center gap-1.5 rounded-base border border-black/10 px-3 text-sm font-semibold text-text hover:bg-bg-alt"
        aria-expanded={open}
        aria-controls="lang-menu-list"
        onClick={() => setOpen(!open)}
      >
        <Globe2 aria-hidden />
        <span>{current.code.toUpperCase()}</span>
        <span className="sr-only">, Language: {current.name}</span>
        <ChevronDown aria-hidden className="size-3" />
      </button>
      <div
        id="lang-menu-list"
        hidden={!open}
        className="absolute right-0 z-50 mt-1 min-w-52 rounded-base border border-black/5 bg-bg p-xs shadow-md"
      >
        {LOCALES.map((option, i) => (
          <button
            key={option.code}
            ref={(el) => {
              optionRefs.current[i] = el;
            }}
            type="button"
            lang={option.code}
            aria-pressed={locale === option.code}
            className={`flex min-h-11 w-full items-center gap-xs rounded-base px-3 text-left text-sm hover:bg-bg-alt ${
              locale === option.code ? 'font-semibold text-primary' : 'text-text'
            }`}
            onClick={() => {
              setLocale(option.code);
              setOpen(false);
              toggleRef.current?.focus();
            }}
          >
            <Check2 aria-hidden className={locale === option.code ? '' : 'invisible'} />
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}
