'use client';

import { useId, useMemo, useState, type KeyboardEvent } from 'react';
import { Building, Folder, Search } from 'react-bootstrap-icons';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT } from '@/features/i18n/useT';
import { searchServices } from '@/features/search/serviceIndex';

/**
 * ARIA 1.2 combobox over services.json. Without JS the form still submits to /services?q=.
 * ponytail: legacy recent/popular searches, "did you mean" and category chips are not ported;
 * add them if visitors miss them.
 */
export function ServiceSearch({ placeholder, label }: { placeholder: string; label: string }) {
  const t = useT(chromeDictionary);
  const id = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const results = useMemo(() => searchServices(query), [query]);
  const showList = open && query.trim().length >= 2;
  const optionId = (i: number) => `${id}-option-${i}`;

  const go = (url: string) => window.location.assign(url);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((i) => Math.max(-1, Math.min(results.length - 1, i + step)));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    } else if (e.key === 'Enter' && showList && active >= 0 && results[active]) {
      e.preventDefault();
      go(results[active].url);
    }
  };

  return (
    <form
      role="search"
      action="/services"
      className="relative"
      onSubmit={(e) => {
        if (!results.length) return; // no match: fall through to /services?q=
        e.preventDefault();
        go(results[0].url);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <div className="flex rounded-base border border-black/20 bg-bg focus-within:border-primary">
        <input
          type="search"
          name="q"
          role="combobox"
          aria-label={label}
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={`${id}-listbox`}
          aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="min-h-12 min-w-0 flex-1 rounded-l-base bg-transparent px-sm text-text outline-none placeholder:text-text-light"
        />
        <button
          type="submit"
          aria-label={t('search-submit')}
          className="flex min-h-12 w-12 items-center justify-center rounded-r-base bg-primary text-white transition-colors duration-150 ease-out hover:bg-primary-dark"
        >
          <Search aria-hidden />
        </button>
      </div>

      {showList && (
        <div className="absolute inset-x-0 top-full z-30 mt-1 max-h-96 overflow-y-auto rounded-base border border-black/10 bg-bg text-left text-text shadow-md">
          <ul id={`${id}-listbox`} role="listbox" aria-label={t('search-results')}>
            {results.map((s, i) => (
              <li
                key={s.id}
                id={optionId(i)}
                role="option"
                aria-selected={i === active}
                className={`border-b border-black/5 last:border-0 ${i === active ? 'bg-primary/10' : ''}`}
              >
                <a
                  href={s.url}
                  tabIndex={-1}
                  className="block px-sm py-xs text-text no-underline hover:bg-primary/5"
                >
                  <span className="block font-semibold">{s.title}</span>
                  <span className="flex flex-wrap gap-x-sm text-xs text-text-light">
                    <span className="inline-flex items-center gap-1">
                      <Folder aria-hidden /> {s.category}
                    </span>
                    {s.office && (
                      <span className="inline-flex items-center gap-1">
                        <Building aria-hidden /> {s.office}
                      </span>
                    )}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {!results.length && (
            <p className="px-sm py-sm text-sm text-text-light" role="status">
              {t('search-none')}
            </p>
          )}
        </div>
      )}
    </form>
  );
}
