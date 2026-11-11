'use client';

import { Boxes, EnvelopeHeart, Github } from 'react-bootstrap-icons';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT } from '@/features/i18n/useT';
import type en from '@/features/i18n/i18n/en.json';
// Stamped at build time; only `npm run version:*` changes it.
import { version } from '../../../public/version.json';

const REPO = 'https://github.com/Better-Bukidnon/betterbukidnon';
const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

type Key = keyof typeof en;

const QUICK_LINKS: { href: string; key: Key }[] = [
  { href: '/sitemap', key: 'footer-sitemap' },
  { href: 'https://bukidnon.gov.ph/', key: 'footer-citizens-charter' },
  { href: '/terms', key: 'footer-terms-of-use' },
  { href: '/privacy', key: 'footer-privacy-policy' },
  { href: '/accessibility', key: 'footer-accessibility' },
  { href: '/faq', key: 'footer-faq' },
];

// The Sangguniang Panlalawigan entry used to repeat the portal link below, so it is gone.
const RESOURCES: { href: string; key: Key }[] = [
  { href: 'https://data.gov.ph', key: 'footer-open-data-philippines' },
  { href: 'https://www.foi.gov.ph/', key: 'footer-freedom-of-information' },
  { href: 'https://bukidnon.gov.ph/', key: 'footer-official-lgu-bukidnon-portal' },
  { href: 'https://www.facebook.com/lgubukidnon', key: 'footer-lgu-bukidnon-facebook' },
  { href: 'https://blgf.gov.ph/', key: 'footer-blgf-portal' },
  { href: 'https://cmci.dti.gov.ph/', key: 'footer-cmci-dti-portal' },
];

const linkClass =
  'inline-flex min-h-11 items-center text-white/80 no-underline transition-colors duration-150 ease-out hover:text-white hover:underline';

export function Footer() {
  const t = useT(chromeDictionary);

  const column = (titleKey: Key, links: { href: string; key: Key }[]) => (
    <div>
      <h2 className="mb-xs text-base font-semibold text-white">{t(titleKey)}</h2>
      <ul className="text-sm">
        {links.map((link) => (
          <li key={link.key}>
            <a
              href={link.href}
              className={linkClass}
              {...(link.href.startsWith('http') ? external : {})}
            >
              {t(link.key)}
              {link.href.startsWith('http') && (
                <span className="sr-only"> {t('nav-opens-new-tab')}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer data-surface="dark" className="mt-xl bg-primary-dark text-white">
      <div className="mx-auto grid max-w-site gap-lg px-sm py-xl md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized images */}
          <img
            src="/assets/images/logo/better-bukidnon-logo-white.svg"
            alt="Better Bukidnon logo"
            width={180}
            height={48}
            className="mb-sm h-12 w-auto"
          />
          <p className="mb-sm max-w-[28rem] text-sm text-white/80">
            {t('footer-empowering-the-people-of-bukidnon-with-transparent')}
          </p>
          <p className="max-w-[28rem] text-sm font-semibold text-white">{t('footer-disclaimer')}</p>
        </div>
        {column('footer-quick-links', QUICK_LINKS)}
        {column('footer-resources', RESOURCES)}
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-site flex-wrap items-center gap-x-md gap-y-xs px-sm py-sm text-sm">
          <h2 className="font-semibold">{t('footer-about-title')}</h2>
          {/* Accent is 4.2:1 here, so it must stay large bold text (AA large: 3:1). */}
          <p className="text-white/80">
            {t('footer-cost')}: <span className="text-xl font-bold text-accent">₱0</span>
          </p>
          <a href="mailto:volunteer@betterbukidnon.org" className={`${linkClass} gap-xs`}>
            <EnvelopeHeart aria-hidden /> {t('footer-volunteer')}
          </a>
          <a href={REPO} {...external} className={`${linkClass} gap-xs`}>
            <Github aria-hidden /> {t('footer-contribute')}
            <span className="sr-only"> {t('nav-opens-new-tab')}</span>
          </a>
          <a
            href="https://bettergov.ph"
            {...external}
            aria-label="BetterGov.ph"
            className="inline-flex min-h-11 items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized images */}
            <img
              src="/assets/images/logo/bettergov-footer.svg"
              alt=""
              width={120}
              height={28}
              loading="lazy"
            />
          </a>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-site flex-wrap gap-x-md gap-y-1 px-sm py-sm text-xs text-white/70">
          <span>&copy; 2026 BetterBukidnon.org</span>
          <span>MIT | CC BY 4.0</span>
          <span>{t('footer-template-credit')}</span>
          <span className="inline-flex items-center gap-1">
            <Boxes aria-hidden /> {t('footer-version', { version })}
          </span>
        </div>
      </div>
    </footer>
  );
}
