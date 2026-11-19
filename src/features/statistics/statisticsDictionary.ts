import en from '@/features/statistics/i18n/en.json';
import type { Dictionary } from '@/features/i18n/useT';

export type StatisticsKey = keyof typeof en;

export const statisticsDictionary: Dictionary<StatisticsKey> = {
  en,
  load: {
    fil: () => import('@/features/statistics/i18n/fil.json'),
    ceb: () => import('@/features/statistics/i18n/ceb.json'),
  },
};
