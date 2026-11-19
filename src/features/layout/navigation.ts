import type en from '@/features/i18n/i18n/en.json';
import { projects } from '@/features/projects/projectsData';

type ChromeKey = keyof typeof en;

export interface NavLink {
  href: string;
  /** Dictionary key, or a fixed label (project names are the same in every language). */
  label: ChromeKey | { text: string };
  external?: boolean;
}

export interface NavItem extends NavLink {
  /** First URL segments that highlight this item. */
  sections: string[];
  children?: NavLink[];
}

export const NAV: NavItem[] = [
  { href: '/', label: 'nav-home', sections: [] },
  {
    href: '/services',
    label: 'nav-services',
    sections: ['services', 'service-details'],
    children: [
      { href: '/services/certificates', label: 'nav-certificates' },
      { href: '/services/business', label: 'nav-business' },
      { href: '/services/tax-payments', label: 'nav-tax-payments' },
      { href: '/services/social-services', label: 'nav-social-services' },
      { href: '/services/health', label: 'nav-health' },
      { href: '/services/agriculture', label: 'nav-agriculture' },
      { href: '/services/infrastructure', label: 'nav-infrastructure' },
      { href: '/services/education', label: 'nav-education' },
      { href: '/services/public-safety', label: 'nav-public-safety' },
      { href: '/services/environment', label: 'nav-environment' },
    ],
  },
  { href: '/government', label: 'nav-government', sections: ['government'] },
  { href: '/statistics', label: 'nav-statistics', sections: ['statistics'] },
  {
    href: '/legislative',
    label: 'nav-legislative',
    sections: ['legislative'],
    children: [
      { href: '/legislative/ordinance-framework', label: 'nav-ordinance-framework' },
      { href: '/legislative/resolution-framework', label: 'nav-resolution-framework' },
    ],
  },
  { href: '/budget', label: 'nav-transparency', sections: ['budget'] },
  {
    href: '/projects',
    label: 'nav-projects',
    sections: ['projects'],
    children: [
      ...projects.map((p) => ({ href: p.url, label: { text: p.name }, external: true })),
      { href: '/projects', label: 'nav-projects-all' },
    ],
  },
  { href: '/contact', label: 'nav-contact', sections: ['contact'] },
];

const trim = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

export function isActive(item: NavItem, pathname: string): boolean {
  const path = trim(pathname);
  if (item.href === '/') return path === '/';
  return item.sections.includes(path.split('/')[1] ?? '');
}

export function isCurrent(link: NavLink, pathname: string): boolean {
  return !link.external && trim(pathname) === link.href;
}
