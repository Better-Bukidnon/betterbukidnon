'use client';

import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT } from '@/features/i18n/useT';

export function SkipLink() {
  const t = useT(chromeDictionary);
  return (
    <a href="#main-content" className="skip-link">
      {t('nav-skip-to-main-content')}
    </a>
  );
}
