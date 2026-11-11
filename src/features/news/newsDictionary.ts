import en from '@/features/news/i18n/en.json';
import type { Dictionary } from '@/features/i18n/useT';

export type NewsKey = keyof typeof en;

export const newsDictionary: Dictionary<NewsKey> = {
  en,
  load: {
    fil: () => import('@/features/news/i18n/fil.json'),
    ceb: () => import('@/features/news/i18n/ceb.json'),
  },
};
