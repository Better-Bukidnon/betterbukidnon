'use client';

import { TelephoneFill } from 'react-bootstrap-icons';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT } from '@/features/i18n/useT';

/**
 * One calm line: the single number that matters in an emergency, plus the full directory.
 * It replaces a six-number ticker that moved on its own and pushed the page down on phones.
 */
export function HotlineBar() {
  const t = useT(chromeDictionary);
  return (
    <div data-surface="dark" className="bg-danger text-sm text-white">
      <div className="mx-auto flex max-w-site items-center justify-between gap-sm px-sm">
        <a
          href="tel:911"
          className="inline-flex min-h-11 items-center gap-xs font-semibold text-white no-underline hover:underline"
        >
          <TelephoneFill aria-hidden /> {t('hotline-emergency')}{' '}
          <span className="tabular-nums">911</span>
        </a>
        <a
          href="/contact#hotlines"
          className="inline-flex min-h-11 items-center font-medium text-white underline underline-offset-2 hover:no-underline"
        >
          {t('hotline-all')}
        </a>
      </div>
    </div>
  );
}
