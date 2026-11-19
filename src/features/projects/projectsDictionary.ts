import en from '@/features/projects/i18n/en.json';
import type { Dictionary } from '@/features/i18n/useT';

export type ProjectsKey = keyof typeof en;

export const projectsDictionary: Dictionary<ProjectsKey> = {
  en,
  load: {
    fil: () => import('@/features/projects/i18n/fil.json'),
    ceb: () => import('@/features/projects/i18n/ceb.json'),
  },
};

const isKey = (key: string): key is ProjectsKey => key in en;

/** For keys built from data (`proj-<id>-name`); data the dictionary lacks falls back to `fallback`. */
export const lookup = (t: (key: ProjectsKey) => string, key: string, fallback: string) =>
  isKey(key) ? t(key) : fallback;
