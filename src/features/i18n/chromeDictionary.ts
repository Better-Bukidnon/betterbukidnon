import en from '@/features/i18n/i18n/en.json';
import type { Dictionary } from '@/features/i18n/useT';

/** Shared chrome strings (nav-*, footer-*), used by the layout and by page breadcrumbs. */
export const chromeDictionary: Dictionary<keyof typeof en> = {
  en,
  load: {
    fil: () => import('@/features/i18n/i18n/fil.json'),
    ceb: () => import('@/features/i18n/i18n/ceb.json'),
  },
};
