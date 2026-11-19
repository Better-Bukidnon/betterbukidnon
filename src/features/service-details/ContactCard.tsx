'use client';

import type { ReactNode } from 'react';
import {
  Building,
  CalendarCheck,
  Clock,
  Envelope,
  GeoAlt,
  Link45deg,
  Map,
  Person,
  Telephone,
} from 'react-bootstrap-icons';
import { useT } from '@/features/i18n/useT';
import type { OfficeFrontmatter } from '@/features/service-details/frontmatter';
import { serviceDetailsDictionary } from '@/features/service-details/serviceDetailsDictionary';
import { card } from '@/shared/ui';

const tapTarget = 'inline-flex min-h-11 items-center gap-xs';

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-xs">
      <dt className="mt-1 text-primary">
        {icon}
        <span className="sr-only">{label}</span>
      </dt>
      <dd>
        <span aria-hidden className="block text-sm text-text-light">
          {label}
        </span>
        {children}
      </dd>
    </div>
  );
}

/** Office facts from the English frontmatter; labels follow the active locale. */
export function ContactCard({ fm }: { fm: OfficeFrontmatter }) {
  const t = useT(serviceDetailsDictionary);
  const { office } = fm;

  return (
    <aside aria-labelledby="office-information" className={`${card} mt-xl`}>
      <h2 id="office-information" className="mb-sm text-2xl font-semibold">
        {t('sd-contact-title')}
      </h2>
      <dl className="grid gap-sm md:grid-cols-2">
        <Row icon={<Building aria-hidden />} label={t('sd-office')}>
          {office.name}
        </Row>
        {office.head && (
          <Row icon={<Person aria-hidden />} label={t('sd-head')}>
            {office.head}
          </Row>
        )}
        <Row icon={<GeoAlt aria-hidden />} label={t('sd-address')}>
          {office.address}
          {office.mapLink && (
            <a
              href={office.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`${tapTarget} flex`}
            >
              <Map aria-hidden /> {t('sd-map')}
            </a>
          )}
        </Row>
        <Row icon={<Clock aria-hidden />} label={t('sd-hours')}>
          {office.hours}
        </Row>
        {office.phone && (
          <Row icon={<Telephone aria-hidden />} label={t('sd-phone')}>
            <a
              href={`tel:+63${office.phone.replace(/\D/g, '').replace(/^0/, '')}`}
              className={tapTarget}
            >
              {office.phone}
            </a>
          </Row>
        )}
        {office.email && (
          <Row icon={<Envelope aria-hidden />} label={t('sd-email')}>
            <a href={`mailto:${office.email}`} className={tapTarget}>
              {office.email}
            </a>
          </Row>
        )}
        <Row icon={<CalendarCheck aria-hidden />} label={t('sd-last-verified')}>
          <time dateTime={fm.lastVerified}>{fm.lastVerified}</time>
        </Row>
        <Row icon={<Link45deg aria-hidden />} label={t('sd-sources')}>
          <ul>
            {fm.sources.map((s) => (
              <li key={s}>
                <a
                  href={s}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${tapTarget} break-all`}
                >
                  {s.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
              </li>
            ))}
          </ul>
        </Row>
      </dl>
    </aside>
  );
}
