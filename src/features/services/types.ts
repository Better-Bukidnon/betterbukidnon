import type en from '@/features/services/i18n/en.json';
import type { ServiceIcon } from '@/features/services/serviceIcons';

export type ServicesKey = keyof typeof en;

export interface CategoryCard {
  icon: ServiceIcon;
  title: ServicesKey;
  text: ServicesKey;
  link?: { href: string; label: ServicesKey };
}

/** One /services/<slug> page: every string is a key in the services dictionary. */
export interface Category {
  crumb: ServicesKey;
  icon: ServiceIcon;
  badge: ServicesKey;
  title: ServicesKey;
  desc: ServicesKey;
  contacts: { href: string; label: ServicesKey; value: ServicesKey }[];
  sections: { title: ServicesKey; intro: ServicesKey; cards: CategoryCard[] }[];
  note: { text: ServicesKey; href: string; link: ServicesKey };
}
