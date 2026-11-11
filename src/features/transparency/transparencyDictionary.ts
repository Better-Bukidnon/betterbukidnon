import en from '@/features/transparency/i18n/en.json';
import type { Dictionary } from '@/features/i18n/useT';

export type TransparencyKey = keyof typeof en;

export const transparencyDictionary: Dictionary<TransparencyKey> = {
  en,
  load: {
    fil: () => import('@/features/transparency/i18n/fil.json'),
    ceb: () => import('@/features/transparency/i18n/ceb.json'),
  },
};
