import en from '@/features/services/i18n/en.json';
import type { Dictionary } from '@/features/i18n/useT';

export const servicesDictionary: Dictionary<keyof typeof en> = {
  en,
  load: {
    fil: () => import('@/features/services/i18n/fil.json'),
    ceb: () => import('@/features/services/i18n/ceb.json'),
  },
};
