import { useMemo, useState } from 'react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { PageHeader } from '@/components/layout/page-header'
import { Icon } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'
import { cn, formatNumber } from '@/lib/utils'
import { m } from '@/paraglide/messages'
import type { Lgu } from './data'
import { directoryPaths } from './paths'
import {
  filterLgus,
  initialLguFilters,
  type LguClassification,
  type LguFilters,
  type LguSort,
} from './lgu-directory'

const districts = [1, 2, 3, 4] as const

const fieldLabel = 'mb-1 block text-[0.75rem] font-semibold text-ink-light'
const fieldControl =
  'w-full rounded-site border border-black/16 bg-white px-2.5 py-2 text-[0.875rem] text-ink outline-none transition-[border-color,box-shadow] focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,50,160,0.15)]'

export function LguDirectoryPage({ lgus }: { lgus: Lgu[] }) {
  const cityCount = lgus.filter((lgu) => lgu.classification === 'Component City').length
  const municipalityCount = lgus.length - cityCount
  const [filters, setFilters] = useState<LguFilters>(initialLguFilters)
  const shown = useMemo(() => filterLgus(lgus, filters), [filters])
  const update = (values: Partial<LguFilters>) =>
    setFilters((current) => ({ ...current, ...values }))

  return (
    <>
      <Breadcrumbs
        items={[
          { label: m.nav_home(), link: { to: '/' } },
          { label: m.nav_government(), link: { to: '/government' } },
          { label: m.dir_lgus() },
        ]}
      />
      <PageHeader
        badge={m.dir_lgu_badge()}
        icon="buildings-fill"
        title={m.dir_lgu_title()}
        description={m.dir_lgu_description()}
      />
      <section className="section-y">
        <div className="container-site">
          <div
            role="search"
            aria-label={m.dir_search_lgu()}
            className="mb-4 grid grid-cols-[2fr_1fr_1fr_1fr] items-end gap-2.5 rounded-site border border-black/8 bg-white px-3.5 py-3 shadow-sm max-lg:grid-cols-2 max-[640px]:grid-cols-1"
          >
            <div className="min-w-0">
              <label htmlFor="lgu-search" className={fieldLabel}>
                {m.dir_search_lgu()}
              </label>
              <input
                id="lgu-search"
                type="search"
                value={filters.query}
                placeholder={m.dir_search_lgu_placeholder()}
                onChange={(event) => update({ query: event.target.value })}
                className={fieldControl}
              />
            </div>
            <SelectField
              id="lgu-classification"
              label={m.dir_classification()}
              value={filters.classification}
              onChange={(value) => update({ classification: value as LguClassification })}
            >
              <option value="all">{m.dir_all_lgus({ count: lgus.length })}</option>
              <option value="Component City">{m.dir_component_cities({ count: cityCount })}</option>
              <option value="Municipality">
                {m.dir_municipalities({ count: municipalityCount })}
              </option>
            </SelectField>
            <SelectField
              id="lgu-district"
              label={m.dir_legislative_district()}
              value={String(filters.district)}
              onChange={(value) => update({ district: value === 'all' ? 'all' : Number(value) })}
            >
              <option value="all">{m.dir_all_districts()}</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {m.dir_district({ count: district })}
                </option>
              ))}
            </SelectField>
            <SelectField
              id="lgu-sort"
              label={m.dir_sort_by()}
              value={filters.sort}
              onChange={(value) => update({ sort: value as LguSort })}
            >
              <option value="name-asc">{m.dir_name_asc()}</option>
              <option value="name-desc">{m.dir_name_desc()}</option>
              <option value="population-desc">{m.dir_population_highest()}</option>
              <option value="barangays-desc">{m.dir_barangays_most()}</option>
            </SelectField>
          </div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[0.8125rem] text-ink-light">
            <span aria-live="polite">
              {m.dir_showing({ shown: shown.length, total: lgus.length })}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-site border-2 border-primary px-3 py-1.5 font-semibold text-primary">
              <Icon name="geo-alt-fill" /> {m.dir_browse_barangays({ count: 464 })}
            </span>
          </div>
          {shown.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-[640px]:grid-cols-1">
              {shown.map((lgu) => (
                <LguCard key={lgu.slug} lgu={lgu} />
              ))}
            </div>
          ) : (
            <div className="rounded-site border border-black/8 bg-white px-6 py-12 text-center text-ink-light">
              <Icon name="search" className="mb-2 block text-[1.75rem] text-primary" />
              <p className="m-0">{m.dir_no_lgus()}</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function SelectField({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldControl}
      >
        {children}
      </select>
    </div>
  )
}

function LguCard({ lgu }: { lgu: Lgu }) {
  const sealFile = lgu.seal.path.split('/').at(-1)
  const [missingSeal, setMissingSeal] = useState(!sealFile)
  const classification =
    lgu.classification === 'Component City' ? m.dir_component_city() : m.dir_municipality()

  return (
    <article className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-[rgba(15,23,42,0.08)] border-t-[3px] border-t-primary/75 bg-white px-[18px] py-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_6px_16px_rgba(0,50,160,0.09)] motion-reduce:hover:translate-y-0">
      <div className="flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-site border border-black/8 bg-surface-alt p-[3px] text-[1.25rem] text-primary">
          {!missingSeal ? (
            <img
              src={`/images/seals/${sealFile}`}
              alt={lgu.name}
              loading="lazy"
              className="size-full object-contain"
              onError={() => setMissingSeal(true)}
            />
          ) : (
            <Icon name="shield-fill" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="mb-0.5 text-[1rem] leading-[1.3] text-primary">{lgu.name}</h2>
          <p className="m-0 text-[0.8125rem] leading-[1.35] text-ink-light">
            {classification}
            {lgu.is_capital && ` · ${m.dir_capital()}`} · {m.dir_district({ count: lgu.district })}
          </p>
        </div>
      </div>
      <p className="mb-0 line-clamp-3 text-[0.8125rem] leading-[1.5] text-ink-light">
        {lgu.introduction}
      </p>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-black/6 pt-2 text-[0.8125rem]">
        <Meta
          label={m.dir_population({ year: lgu.population.latest_year })}
          value={formatNumber(lgu.population.latest)}
        />
        <Meta label={m.dir_barangays()} value={formatNumber(lgu.barangay_count)} />
        <Meta
          label={m.dir_mayor({ term: lgu.leadership.term })}
          value={lgu.leadership.mayor.name}
          wide
        />
      </dl>
      <div className="mt-auto pt-1.5">
        <SiteLink
          href={directoryPaths.lgu(lgu.slug)}
          className="mr-2 inline-flex items-center gap-1.5 rounded-site bg-primary px-3 py-1.5 text-[0.8125rem] font-semibold text-white no-underline hover:bg-primary-dark hover:no-underline"
        >
          {m.dir_view_profile()} <Icon name="arrow-right" />
        </SiteLink>
        {lgu.website && (
          <SiteLink
            href={lgu.website}
            className="inline-flex items-center gap-1.5 rounded-site border-2 border-primary px-3 py-1.5 text-[0.8125rem] font-semibold text-primary no-underline transition-colors hover:bg-surface-alt hover:no-underline"
          >
            <Icon name="globe2" /> {m.dir_official_website()}
          </SiteLink>
        )}
      </div>
    </article>
  )
}

function Meta({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={cn('min-w-0', wide && 'col-span-full')}>
      <dt className="text-[0.6875rem] uppercase tracking-[0.03em] text-ink-light">{label}</dt>
      <dd className="m-0 break-words font-semibold text-ink">{value}</dd>
    </div>
  )
}
