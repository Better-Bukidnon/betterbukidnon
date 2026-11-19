import en from '@/features/legislative/i18n/en.json';
import type { Dictionary } from '@/features/i18n/useT';

export type LegislativeKey = keyof typeof en;

export const legislativeDictionary: Dictionary<LegislativeKey> = {
  en,
  load: {
    fil: () => import('@/features/legislative/i18n/fil.json'),
    ceb: () => import('@/features/legislative/i18n/ceb.json'),
  },
};
