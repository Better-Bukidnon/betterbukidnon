import en from '@/features/legal/i18n/en.json';
import type { Dictionary } from '@/features/i18n/useT';

export type LegalKey = keyof typeof en;

export const legalDictionary: Dictionary<LegalKey> = {
  en,
  load: {
    fil: () => import('@/features/legal/i18n/fil.json'),
    ceb: () => import('@/features/legal/i18n/ceb.json'),
  },
};
