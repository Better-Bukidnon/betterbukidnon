'use client';

import { errorsDictionary, type ErrorsKey } from '@/features/errors/errorsDictionary';
import { useT } from '@/features/i18n/useT';
import { buttonPrimary } from '@/shared/ui';

export const ERRORS = {
  403: {
    title: 'err403-access-forbidden',
    desc: 'err403-you-dont-have-permission-to-access-this-resource',
    links: [
      ['/', 'err403-go-to-homepage'],
      ['/contact', 'err403-contact-us'],
    ],
  },
  404: {
    title: 'err404-page-not-found',
    desc: 'err404-the-requested-page-is-not-accessible-at-this-time',
    links: [
      ['/', 'err404-go-to-homepage'],
      ['/services', 'err404-browse-services'],
    ],
  },
  500: {
    title: 'err500-server-error',
    desc: 'err500-were-experiencing-technical-difficulties-our-team',
    links: [
      ['/', 'err500-go-to-homepage'],
      ['/contact', 'err500-contact-us'],
    ],
  },
} satisfies Record<number, { title: ErrorsKey; desc: ErrorsKey; links: [string, ErrorsKey][] }>;

/** 403, 404 and 500 pages. Links are absolute, since Cloudflare serves these from any URL. */
export function ErrorPage({ code }: { code: keyof typeof ERRORS }) {
  const t = useT(errorsDictionary);
  const { title, desc, links } = ERRORS[code];
  return (
    <section className="mx-auto max-w-2xl px-sm py-xl text-center">
      <span className="mb-sm block text-6xl font-bold text-primary">{code}</span>
      <h1 className="mb-sm text-3xl font-bold">{t(title)}</h1>
      <p className="mb-md text-text-light">{t(desc)}</p>
      <div className="flex flex-wrap justify-center gap-sm">
        {links.map(([href, label], i) => (
          <a
            key={href}
            href={href}
            className={
              i
                ? 'inline-flex min-h-11 items-center rounded-base border border-primary px-md font-semibold'
                : buttonPrimary
            }
          >
            {t(label)}
          </a>
        ))}
      </div>
    </section>
  );
}
