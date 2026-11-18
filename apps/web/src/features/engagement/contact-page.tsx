import { ScrollRegion } from '@/components/ui/scroll-region'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import {
  dataTable,
  dataTableCell,
  dataTableHead,
  infoCardIcon,
  legacyGrid,
  legacyNote,
} from '@/components/layout/legacy'
import { PageHeader } from '@/components/layout/page-header'
import { Icon, type IconName } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'
import { capitolDirectory, contactDirectory } from '@/config/contact'
import { repositoryUrl, volunteerEmail } from '@/config/navigation'
import { m } from '@/paraglide/messages'
import { telHref } from '@/lib/utils'

const directoryLabels = {
  main: m.contact_dir_main_line,
  pgo: m.contact_dir_pgo,
  pho: m.contact_dir_pho,
  peo: m.contact_dir_peo,
  peo_waterworks: m.contact_dir_peo_waterworks,
  pswdo: m.contact_dir_pswdo,
  pto: m.contact_dir_pto,
  ppdo: m.contact_dir_ppdo,
  pdrrmd: m.contact_dir_pdrrmd,
  pictd: m.contact_dir_pictd,
} as const

const hotlineDetails = [
  { ...contactDirectory.hotlines[0], icon: 'telephone-fill', label: m.contact_hl_911 },
  {
    ...contactDirectory.hotlines[1],
    icon: 'exclamation-triangle-fill',
    label: m.contact_hl_pdrrmd,
  },
  { ...contactDirectory.hotlines[2], icon: 'shield-fill', label: m.contact_hl_police },
  { ...contactDirectory.hotlines[3], icon: 'fire', label: m.contact_hl_fire },
  { ...contactDirectory.hotlines[4], icon: 'heart-pulse-fill', label: m.contact_hl_pho },
  { ...contactDirectory.hotlines[5], icon: 'heart-fill', label: m.contact_hl_pswdo },
] as const satisfies readonly {
  icon: IconName
  label: () => string
  display: string
  href: string
}[]

export function ContactPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: m.contact_home(), link: { to: '/' } }, { label: m.contact_contact() }]}
      />
      <PageHeader
        icon="telephone-fill"
        badge={m.contact_contact()}
        title={m.contact_title()}
        description={m.contact_subtitle()}
      />
      <section className="section-y pb-0">
        <div className="container-site max-w-[1026px]">
          <div className="info-card" role="note">
            <div className={infoCardIcon}>
              <Icon name="info-circle-fill" />
            </div>
            <div className="info-card-content">
              <h2 className="mb-2 text-[1.125rem]">{m.contact_notice_title()}</h2>
              <p>{m.contact_notice_text()}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-y">
        <div className="container-site max-w-[1026px]">
          <div className={legacyGrid[3]}>
            {[
              {
                icon: 'geo-alt-fill' as const,
                label: m.contact_address,
                value: contactDirectory.address,
                note: m.contact_provincial_government,
              },
              {
                icon: 'telephone-fill' as const,
                label: m.contact_main_line,
                value: contactDirectory.phone,
                note: m.contact_hours,
                href: telHref(contactDirectory.phone),
              },
              {
                icon: 'globe2' as const,
                label: m.contact_official_website,
                value: 'bukidnon.gov.ph',
                note: m.contact_provincial_government,
                href: contactDirectory.website,
              },
            ].map((card) => (
              <ContactCard key={card.value} {...card} />
            ))}
          </div>
        </div>
      </section>
      <OfficeHours />
      <section className="section-y">
        <div className="container-site">
          <SectionTitle
            icon="exclamation-triangle-fill"
            badge={m.contact_emergency()}
            title={m.contact_hotlines()}
            description={m.contact_hotlines_desc()}
          />
          <div className="grid grid-cols-[repeat(3,1fr)] gap-4 max-[1200px]:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-1">
            {hotlineDetails.map((hotline) => (
              <a
                key={hotline.href}
                href={hotline.href}
                className="flex flex-col items-center gap-2 rounded-[10px] border border-red-300 bg-white p-6 text-ink no-underline transition hover:border-red-500 hover:shadow-[0_4px_12px_rgba(239,68,68,.15)] hover:no-underline"
              >
                <Icon name={hotline.icon} className="text-[1.5rem] text-red-600" />
                <span className="text-center text-[.8125rem] text-ink-light">
                  {hotline.label()}
                </span>
                <span className="text-[1rem] font-semibold">{hotline.display}</span>
              </a>
            ))}
          </div>
          <p className={'mt-4 ' + legacyNote}>
            <Icon name="info-circle" /> {m.contact_hotlines_note()}
          </p>
        </div>
      </section>
      <Directory />
      <Map />
      <VolunteerContacts />
    </>
  )
}

function ContactCard({
  icon,
  label,
  value,
  note,
  href,
}: {
  icon: IconName
  label: () => string
  value: string
  note: () => string
  href?: string
}) {
  const cardClass =
    'flex overflow-hidden rounded-xl border border-line bg-white text-ink no-underline transition hover:border-primary hover:shadow-[0_4px_16px_rgba(0,50,160,.1)] hover:text-ink hover:no-underline'
  const content = (
    <>
      <div className="flex w-14 shrink-0 items-center justify-center bg-linear-135 from-primary to-secondary text-[1.25rem] text-white">
        <Icon name={icon} />
      </div>
      <div className="flex-1 p-6">
        <h3 className="mb-1 text-[.8125rem] font-semibold tracking-[.5px] text-ink-light uppercase">
          {label()}
        </h3>
        <p className="mb-1 text-[1rem] font-semibold">{value}</p>
        <span className="text-[.8125rem] text-ink-light">{note()}</span>
      </div>
    </>
  )
  return href ? (
    <SiteLink href={href} className={cardClass}>
      {content}
    </SiteLink>
  ) : (
    <div className={cardClass}>{content}</div>
  )
}

function OfficeHours() {
  const rows = [
    [m.contact_monday_friday, '8:00 AM - 5:00 PM', 'check-circle-fill', m.contact_open],
    [m.contact_saturday_sunday, m.contact_closed(), 'x-circle-fill', m.contact_closed],
    [m.contact_national_local_holidays, m.contact_closed(), 'x-circle-fill', m.contact_closed],
    [m.contact_emergencies, m.contact_call_911(), 'telephone-fill', () => '24/7'],
  ] as const
  return (
    <section className="bg-surface-alt py-8">
      <div className="container-site max-w-[1026px]">
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <div className="flex items-center gap-4 bg-linear-135 from-primary to-secondary px-8 py-6 text-white max-sm:px-6 max-sm:py-4">
            <Icon name="clock-fill" className="text-[1.25rem]" />
            <h2 className="m-0 text-[1.125rem] text-white">{m.contact_office_hours()}</h2>
          </div>
          <div className="grid grid-cols-[repeat(4,1fr)] max-[993px]:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-1">
            {rows.map(([day, time, icon, status]) => (
              <div
                key={day()}
                className="flex flex-col items-center border-r border-line p-6 text-center last:border-r-0 max-[993px]:border-b max-[993px]:nth-[2n]:border-r-0 max-sm:border-r-0"
              >
                <span className="mb-1 text-[.875rem] font-semibold">{day()}</span>
                <span
                  className={
                    'mb-2 text-[1rem] font-bold ' +
                    (icon === 'x-circle-fill' ? 'text-ink-light' : 'text-primary')
                  }
                >
                  {time}
                </span>
                <span
                  className={
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[.75rem] font-semibold ' +
                    (icon === 'x-circle-fill'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-700')
                  }
                >
                  <Icon name={icon} />
                  {status()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionTitle({
  icon,
  badge,
  title,
  description,
}: {
  icon: IconName
  badge: string
  title: string
  description: string
}) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-tint px-3 py-1 text-[.8125rem] font-semibold text-primary">
          <Icon name={icon} />
          {badge}
        </span>
        <h2 className="m-0 text-[1.5rem]">{title}</h2>
      </div>
      <p className="m-0 max-w-3xl text-ink-light">{description}</p>
    </div>
  )
}

function Directory() {
  return (
    <section className="section-y bg-surface-alt">
      <div className="container-site">
        <SectionTitle
          icon="building-fill"
          badge={m.contact_directory_badge()}
          title={m.contact_directory_title()}
          description={m.contact_directory_desc()}
        />
        <ScrollRegion label={m.contact_directory_title()}>
          <table className={dataTable}>
            <caption className="sr-only">{m.contact_directory_title()}</caption>
            <thead>
              <tr>
                <th className={dataTableHead}>{m.contact_dir_office()}</th>
                <th className={dataTableHead}>{m.contact_dir_abbr()}</th>
                <th className={dataTableHead}>{m.contact_dir_telephone()}</th>
              </tr>
            </thead>
            <tbody>
              {capitolDirectory.map((entry) => (
                <tr key={entry.office}>
                  <td className={dataTableCell}>
                    {'href' in entry && entry.href ? (
                      <SiteLink href={entry.href}>{directoryLabels[entry.office]()}</SiteLink>
                    ) : (
                      directoryLabels[entry.office]()
                    )}
                  </td>
                  <td className={dataTableCell}>{entry.abbreviation}</td>
                  <td className={dataTableCell}>
                    <a href={telHref(entry.phone)}>{entry.phone}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
        <p className={'mt-4 ' + legacyNote}>
          <Icon name="exclamation-circle" /> {m.contact_directory_verify()}
        </p>
      </div>
    </section>
  )
}

function Map() {
  return (
    <section className="section-y">
      <div className="container-site">
        <SectionTitle
          icon="map-fill"
          badge={m.contact_map_badge()}
          title={m.contact_map_title()}
          description={m.contact_map_desc()}
        />
        <div className="overflow-hidden rounded-2xl border border-black/6 bg-white shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_12px_rgba(0,0,0,.03)]">
          <iframe
            className="block h-[300px] w-full border-0"
            src="https://www.openstreetmap.org/export/embed.html?bbox=125.1000%2C8.1350%2C125.1550%2C8.1800&layer=mapnik&marker=8.1575%2C125.1278"
            title={m.contact_map_iframe_title()}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <p className="m-0 flex items-center gap-2 border-t border-black/5 bg-white px-6 py-3 text-[.75rem] text-ink-light">
            <Icon name="geo-alt-fill" className="text-primary" />
            {m.contact_map_caption()}{' '}
            <SiteLink href="https://www.openstreetmap.org/?mlat=8.1575&mlon=125.1278#map=15/8.1575/125.1278">
              {m.contact_map_larger()}
            </SiteLink>
          </p>
        </div>
      </div>
    </section>
  )
}

function VolunteerContacts() {
  return (
    <section className="section-y bg-surface-alt">
      <div className="container-site">
        <SectionTitle
          icon="people-fill"
          badge={m.contact_volunteers_badge()}
          title={m.contact_site_title()}
          description={m.contact_site_desc()}
        />
        <div className={legacyGrid[2]}>
          <ContactCard
            icon="envelope-fill"
            label={m.contact_volunteer_team}
            value={volunteerEmail}
            note={m.contact_volunteer_reply}
            href={`mailto:${volunteerEmail}`}
          />
          <ContactCard
            icon="github"
            label={m.contact_source_code}
            value="github.com/Better-Bukidnon/betterbukidnon"
            note={m.contact_github_note}
            href={repositoryUrl}
          />
        </div>
      </div>
    </section>
  )
}
