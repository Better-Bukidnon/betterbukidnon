import en from '@/features/errors/i18n/en.json';
import type { Dictionary } from '@/features/i18n/useT';

export type ErrorsKey = keyof typeof en;

export const errorsDictionary: Dictionary<ErrorsKey> = {
  en,
  load: {
    fil: () => import('@/features/errors/i18n/fil.json'),
    ceb: () => import('@/features/errors/i18n/ceb.json'),
  },
};
