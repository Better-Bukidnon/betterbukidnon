import { useMemo, useState } from 'react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Icon, type IconName } from '@/components/ui/icon'
import { formatNumber } from '@/lib/utils'
import { m } from '@/paraglide/messages'
import { findBarangaysForLgu, type Lgu } from './data'

const profileLinks: { href: string; icon: IconName; label: () => string }[] = [
  { href: '#overview', icon: 'grid-1x2-fill', label: m.dir_profile_overview },
  { href: '#leadership', icon: 'person-badge-fill', label: m.dir_profile_leadership },
  { href: '#barangays', icon: 'pin-map-fill', label: m.dir_barangays },
  { href: '#references', icon: 'journal-check', label: m.dir_profile_references },
]

export function LguProfilePage({ lgu }: { lgu: Lgu }) {
  const [query, setQuery] = useState('')
  const barangays = findBarangaysForLgu(lgu.slug)
  const shownBarangays = useMemo(() => {
    const value = query.trim().toLocaleLowerCase()
    return value
      ? barangays.filter(
          (barangay) =>
            barangay.name.toLocaleLowerCase().includes(value) || barangay.psgc_code.includes(value),
        )
      : barangays
  }, [barangays, query])
  const seal = lgu.seal.path.split('/').at(-1)

  return (
    <>
      <Breadcrumbs
        items={[
          { label: m.nav_home(), link: { to: '/' } },
          { label: m.nav_government(), link: { to: '/government' } },
          { label: m.dir_lgus(), link: { to: '/lgus' } },
          { label: lgu.name },
        ]}
      />
      <section className="bg-linear-135 from-primary to-primary-dark py-7 text-white">
        <div className="container-site flex items-center gap-5 max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-3.5">
          <div className="flex size-[84px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/35 bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
            {seal ? (
              <img
                src={`/images/seals/${seal}`}
                alt={`${lgu.name} ${m.dir_profile_seal()}`}
                className="size-full object-contain"
              />
            ) : (
              <Icon name="shield-fill" className="text-[2rem] text-primary" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap gap-2">
              <Pill icon="building">
                {lgu.classification}
                {lgu.is_capital ? ` · ${m.dir_capital()}` : ''}
              </Pill>
              <Pill icon="diagram-3">{m.dir_district({ count: lgu.district })}</Pill>
              <Pill icon="hash">PSGC {lgu.psgc_code}</Pill>
            </div>
            <h1 className="mb-1 text-[1.9rem] leading-[1.2] text-white">{lgu.name}</h1>
            <p className="mb-1 text-[0.84rem] font-medium text-white/85">
              {m.dir_profile_location()}
            </p>
            <p className="mb-0 max-w-205 text-[0.9rem] leading-[1.55] text-white/94">
              {lgu.introduction}
            </p>
          </div>
        </div>
      </section>
      <div className="sticky top-0 z-30 border-b border-black/8 bg-white/96 shadow-[0_2px_8px_rgba(15,23,42,0.03)] backdrop-blur-sm">
        <nav
          aria-label={m.dir_profile_sections()}
          className="container-site flex gap-1.5 overflow-x-auto py-2.5"
        >
          {profileLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-3.5 py-1.75 text-[0.8125rem] font-semibold text-ink no-underline hover:border-primary/15 hover:bg-primary/6 hover:text-primary hover:no-underline"
            >
              <Icon name={link.icon} className="text-primary" /> {link.label()}
            </a>
          ))}
        </nav>
      </div>
      <Overview lgu={lgu} />
      <Leadership lgu={lgu} />
      <Barangays lgu={lgu} shown={shownBarangays} query={query} setQuery={setQuery} />
      <References lgu={lgu} />
    </>
  )
}

function Pill({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.25 rounded-full border border-white/24 bg-white/16 px-2.5 py-0.75 text-[0.72rem] font-bold tracking-[0.02em] text-white">
      <Icon name={icon} /> {children}
    </span>
  )
}

function SectionHeader({
  id,
  icon,
  title,
  description,
  action,
}: {
  id: string
  icon: IconName
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div id={id} className="mb-[18px] flex scroll-mt-24 flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="mb-0.75 flex items-center gap-2 text-[1.3rem] text-ink">
          <Icon name={icon} className="text-[1.15rem] text-primary" /> {title}
        </h2>
        <p className="mb-0 text-[0.84rem] text-ink-light">{description}</p>
      </div>
      {action}
    </div>
  )
}

function Overview({ lgu }: { lgu: Lgu }) {
  const mapUrl = `https://www.openstreetmap.org/?mlat=${lgu.coordinates.lat}&mlon=${lgu.coordinates.lon}#map=13/${lgu.coordinates.lat}/${lgu.coordinates.lon}`
  const metrics: { icon: IconName; label: string; value: string; note: string }[] = [
    {
      icon: 'people-fill',
      label: m.dir_population({ year: lgu.population.latest_year }),
      value: formatNumber(lgu.population.latest),
      note: lgu.population.latest_source,
    },
    {
      icon: 'aspect-ratio-fill',
      label: m.dir_profile_land_area(),
      value: `${formatNumber(lgu.area_km2)} km²`,
      note: m.dir_profile_density({ count: formatNumber(lgu.population.density_per_km2) }),
    },
    {
      icon: 'pin-map-fill',
      label: m.dir_barangays(),
      value: formatNumber(lgu.barangay_count),
      note: m.dir_profile_psgc_dataset(),
    },
    {
      icon: 'bank',
      label: m.dir_classification(),
      value: lgu.classification,
      note: m.dir_district({ count: lgu.district }),
    },
  ]
  return (
    <section className="section-y" id="overview">
      <div className="container-site">
        <SectionHeader
          id="overview-heading"
          icon="bar-chart-line-fill"
          title={m.dir_profile_demographics()}
          description={m.dir_profile_demographics_description({ name: lgu.name })}
          action={
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-site border-2 border-primary px-3 py-1.5 text-[0.8125rem] font-semibold text-primary no-underline hover:bg-surface-alt hover:no-underline"
            >
              <Icon name="geo-alt-fill" /> {m.dir_profile_open_map()}
            </a>
          }
        />
        <div className="grid grid-cols-4 gap-3.5 max-lg:grid-cols-2 max-[640px]:grid-cols-1">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="flex gap-3 rounded-xl border border-black/8 border-t-[3px] border-t-primary bg-white px-[18px] py-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-primary/8 text-[1.15rem] text-primary">
                <Icon name={metric.icon} />
              </span>
              <div className="min-w-0">
                <p className="mb-0.5 text-[0.7rem] font-bold uppercase tracking-[0.04em] text-ink-light">
                  {metric.label}
                </p>
                <p className="mb-0 text-[1.25rem] font-extrabold leading-[1.25] text-ink">
                  {metric.value}
                </p>
                <p className="mb-0 text-[0.75rem] text-ink-light">{metric.note}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-x-6 gap-y-3 rounded-xl border border-black/8 bg-white px-5 py-4 text-[0.8125rem] shadow-[0_1px_4px_rgba(15,23,42,0.03)] max-lg:grid-cols-2 max-[640px]:grid-cols-1">
          <Meta
            label={m.dir_profile_seat()}
            value={lgu.hall_address ?? `${lgu.name} Municipal / City Hall`}
          />
          <Meta
            label={m.dir_profile_coordinates()}
            value={`${lgu.coordinates.lat.toFixed(4)}° N, ${lgu.coordinates.lon.toFixed(4)}° E`}
          />
          <Meta
            label={m.dir_official_website()}
            value={lgu.website ?? m.dir_profile_portal_unavailable()}
            href={lgu.website}
          />
        </div>
      </div>
    </section>
  )
}

function Meta({ label, value, href }: { label: string; value: string; href?: string | null }) {
  return (
    <div className="min-w-0">
      <p className="mb-0.5 text-[0.6875rem] uppercase tracking-[0.03em] text-ink-light">{label}</p>
      {href ? (
        <a
          className="break-words font-semibold text-primary"
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          {value} <Icon name="box-arrow-up-right" />
        </a>
      ) : (
        <p className="mb-0 break-words font-semibold text-ink">{value}</p>
      )}
    </div>
  )
}

function Leadership({ lgu }: { lgu: Lgu }) {
  const officials = [
    {
      icon: 'person-badge-fill' as const,
      badge: m.dir_profile_chief_executive(),
      official: lgu.leadership.mayor,
    },
    {
      icon: 'person-badge' as const,
      badge: m.dir_profile_presiding_officer(),
      official: lgu.leadership.vice_mayor,
    },
  ]
  return (
    <section className="section-y bg-surface-alt" id="leadership">
      <div className="container-site">
        <SectionHeader
          id="leadership-heading"
          icon="person-badge-fill"
          title={m.dir_profile_leadership()}
          description={m.dir_profile_leadership_description({ term: lgu.leadership.term })}
        />
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {officials.map(({ icon, badge, official }) => (
            <article
              key={official.title}
              className="flex gap-3 rounded-xl border border-black/8 border-t-[3px] border-t-primary bg-white px-[18px] py-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-site bg-primary/6 text-[1.25rem] text-primary">
                <Icon name={icon} />
              </span>
              <div>
                <span className="inline-flex rounded-full bg-primary/8 px-2.5 py-0.75 text-[0.72rem] font-bold text-primary">
                  {badge}
                </span>
                <h3 className="mb-0.5 mt-1 text-[1rem] text-primary">{official.name}</h3>
                <p className="mb-0 text-[0.8125rem] text-ink-light">
                  {official.title}
                  {official.party ? ` · ${official.party}` : ''}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Barangays({
  lgu,
  shown,
  query,
  setQuery,
}: {
  lgu: Lgu
  shown: ReturnType<typeof findBarangaysForLgu>
  query: string
  setQuery: (value: string) => void
}) {
  return (
    <section className="section-y" id="barangays">
      <div className="container-site">
        <SectionHeader
          id="barangays-heading"
          icon="pin-map-fill"
          title={m.dir_profile_barangays({ name: lgu.name, count: lgu.barangay_count })}
          description={m.dir_profile_barangays_description({ count: lgu.barangay_count })}
          action={
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={m.dir_profile_filter_barangays()}
              aria-label={m.dir_profile_filter_barangays()}
              className="w-70 rounded-site border border-black/16 bg-white px-2.5 py-2 text-[0.875rem] text-ink outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,50,160,0.15)] max-[640px]:w-full"
            />
          }
        />
        {shown.length ? (
          <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-[640px]:grid-cols-1">
            {shown.map((barangay) => (
              <article
                key={barangay.psgc_code}
                className="rounded-xl border border-black/8 border-t-[3px] border-t-primary/75 bg-white px-[18px] py-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)]"
              >
                <h3 className="mb-0.5 text-[1rem] text-primary">{barangay.name}</h3>
                <p className="mb-2 text-[0.8125rem] text-ink-light">PSGC {barangay.psgc_code}</p>
                <p className="mb-0 text-[0.8125rem] leading-[1.5] text-ink-light">
                  {barangay.leadership.punong_barangay
                    ? `${m.dir_profile_punong_barangay()}: ${barangay.leadership.punong_barangay.name}`
                    : m.dir_profile_leadership_pending()}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-site border border-dashed border-black/18 bg-white px-6 py-12 text-center text-ink-light">
            <Icon name="search" className="mb-2 text-[1.75rem] text-primary" />
            <p className="mb-0">{m.dir_profile_no_barangays()}</p>
          </div>
        )}
      </div>
    </section>
  )
}

function References({ lgu }: { lgu: Lgu }) {
  return (
    <section className="section-y bg-surface-alt" id="references">
      <div className="container-site">
        <SectionHeader
          id="references-heading"
          icon="journal-check"
          title={m.dir_profile_references()}
          description={m.dir_profile_references_description()}
        />
        <div className="flex flex-col gap-2">
          {lgu.sources.map((source) => (
            <article
              key={source.url}
              className="rounded-site border border-black/8 bg-white px-3.5 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary"
                >
                  {source.agency}: {source.title} <Icon name="box-arrow-up-right" />
                </a>
                <span className="text-[0.75rem] text-ink-light">
                  {m.dir_profile_verified({ date: source.last_verified })}
                </span>
              </div>
              <p className="mb-0 mt-0.5 text-[0.8125rem] text-ink-light">{source.scope}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
