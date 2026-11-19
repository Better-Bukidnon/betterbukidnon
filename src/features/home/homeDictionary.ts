import en from '@/features/home/i18n/en.json';
import type { Dictionary } from '@/features/i18n/useT';

export type HomeKey = keyof typeof en;

export const homeDictionary: Dictionary<HomeKey> = {
  en,
  load: {
    fil: () => import('@/features/home/i18n/fil.json'),
    ceb: () => import('@/features/home/i18n/ceb.json'),
  },
};
