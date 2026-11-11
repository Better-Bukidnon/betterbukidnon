import en from '@/features/service-details/i18n/en.json';
import type { Dictionary } from '@/features/i18n/useT';

export const serviceDetailsDictionary: Dictionary<keyof typeof en> = {
  en,
  load: {
    fil: () => import('@/features/service-details/i18n/fil.json'),
    ceb: () => import('@/features/service-details/i18n/ceb.json'),
  },
};
