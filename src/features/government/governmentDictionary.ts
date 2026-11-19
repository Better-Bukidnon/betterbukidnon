import en from '@/features/government/i18n/en.json';
import type { Dictionary } from '@/features/i18n/useT';

export type GovernmentKey = keyof typeof en;

export const governmentDictionary: Dictionary<GovernmentKey> = {
  en,
  load: {
    fil: () => import('@/features/government/i18n/fil.json'),
    ceb: () => import('@/features/government/i18n/ceb.json'),
  },
};
