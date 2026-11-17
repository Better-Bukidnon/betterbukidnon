import { useMemo, useState } from 'react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { PageHeader } from '@/components/layout/page-header'
import { Icon } from '@/components/ui/icon'
import { m } from '@/paraglide/messages'
import { barangays, lgus, lguBySlug, type Barangay } from './data'
import {
  filterBarangays,
  initialBarangayFilters,
  barangaysPerPage,
  pageCount,
  pageItems,
  type BarangayFilters,
  type BarangaySort,
} from './barangay-directory'

const fieldLabel = 'mb-1 block text-[0.75rem] font-semibold text-ink-light'
const fieldControl =
  'w-full rounded-site border border-black/16 bg-white px-2.5 py-2 text-[0.875rem] text-ink outline-none transition-[border-color,box-shadow] focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,50,160,0.15)]'

export function BarangayDirectoryPage() {
  const [filters, setFilters] = useState<BarangayFilters>(initialBarangayFilters)
  const shown = useMemo(() => filterBarangays(barangays, filters), [filters])
  const pages = pageCount(shown.length)
  const page = Math.min(filters.page, pages)
  const items = pageItems(shown, page)
  const update = (values: Partial<BarangayFilters>) =>
    setFilters((current) => ({ ...current, ...values }))
  const updateFilter = (values: Partial<BarangayFilters>) => update({ ...values, page: 1 })

  return (
    <>
      <Breadcrumbs
        items={[
          { label: m.nav_home(), link: { to: '/' } },
          { label: m.nav_government(), link: { to: '/government' } },
          { label: m.dir_barangays() },
        ]}
      />
      <PageHeader
        badge={m.dir_barangay_badge({ count: barangays.length })}
        icon="geo-alt-fill"
        title={m.dir_barangay_title()}
        description={m.dir_barangay_description({ count: barangays.length, lgus: lgus.length })}
      />
      <section className="section-y">
        <div className="container-site">
          <div
            role="search"
            aria-label={m.dir_search_barangay()}
            className="mb-4 grid grid-cols-[2fr_1fr_1fr] items-end gap-2.5 rounded-site border border-black/8 bg-white px-3.5 py-3 shadow-sm max-lg:grid-cols-2 max-[640px]:grid-cols-1"
          >
            <Field label={m.dir_search_barangay()}>
              <input
                id="barangay-search"
                type="search"
                value={filters.query}
                onChange={(event) => updateFilter({ query: event.target.value })}
                placeholder={m.dir_search_barangay_placeholder()}
                className={fieldControl}
              />
            </Field>
            <Field label={m.dir_lgu_filter()}>
              <select
                value={filters.lgu}
                onChange={(event) => updateFilter({ lgu: event.target.value })}
                className={fieldControl}
              >
                <option value="all">
                  {m.dir_all_lgus_barangays({ lgus: lgus.length, count: barangays.length })}
                </option>
                {lgus.map((lgu) => (
                  <option key={lgu.slug} value={lgu.slug}>
                    {lgu.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={m.dir_sort_by()}>
              <select
                value={filters.sort}
                onChange={(event) => updateFilter({ sort: event.target.value as BarangaySort })}
                className={fieldControl}
              >
                <option value="name-asc">{m.dir_barangay_name_asc()}</option>
                <option value="name-desc">{m.dir_barangay_name_desc()}</option>
                <option value="lgu-asc">{m.dir_barangay_lgu_asc()}</option>
              </select>
            </Field>
          </div>
          <p className="mb-4 text-[0.8125rem] text-ink-light" aria-live="polite">
            {m.dir_barangay_showing({
              from: shown.length ? (page - 1) * barangaysPerPage + 1 : 0,
              to: (page - 1) * barangaysPerPage + items.length,
              total: shown.length,
            })}
          </p>
          {items.length ? (
            <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-[640px]:grid-cols-1">
              {items.map((barangay) => (
                <BarangayCard key={barangay.psgc_code} barangay={barangay} />
              ))}
            </div>
          ) : (
            <Empty />
          )}
          {pages > 1 && (
            <Pagination page={page} pages={pages} setPage={(next) => update({ page: next })} />
          )}
        </div>
      </section>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <label className={fieldLabel}>{label}</label>
      {children}
    </div>
  )
}
function BarangayCard({ barangay }: { barangay: Barangay }) {
  const seal = lguBySlug.get(barangay.lgu_slug)?.seal.path.split('/').at(-1)
  return (
    <article className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-black/8 border-t-[3px] border-t-primary/75 bg-white px-[18px] py-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-site border border-black/8 bg-surface-alt p-[3px] text-[1.15rem] text-primary">
          {seal ? (
            <img src={`/images/seals/${seal}`} alt="" className="size-full object-contain" />
          ) : (
            <Icon name="geo-alt-fill" />
          )}
        </span>
        <div className="min-w-0">
          <h2 className="mb-0.5 text-[1rem] text-primary">{barangay.name}</h2>
          <p className="mb-0 text-[0.8125rem] text-ink-light">{barangay.lgu_name}</p>
        </div>
      </div>
      <p className="mb-0 line-clamp-3 text-[0.8125rem] leading-[1.5] text-ink-light">
        {barangay.introduction}
      </p>
      <p className="mb-0 text-[0.8125rem] text-ink-light">
        PSGC {barangay.psgc_code} · {m.dir_district({ count: barangay.district })}
      </p>
      <dl className="border-t border-black/6 pt-2 text-[0.8125rem]">
        <dt className="text-[0.6875rem] uppercase tracking-[0.03em] text-ink-light">
          {m.dir_profile_punong_barangay()}
        </dt>
        <dd className="m-0 font-semibold text-ink">
          {barangay.leadership.punong_barangay?.name ?? m.dir_profile_leadership_pending()}
        </dd>
      </dl>
    </article>
  )
}
function Empty() {
  return (
    <div className="rounded-site border border-dashed border-black/18 bg-white px-6 py-12 text-center text-ink-light">
      <Icon name="search" className="mb-2 text-[1.75rem] text-primary" />
      <p className="mb-0">{m.dir_profile_no_barangays()}</p>
    </div>
  )
}
function Pagination({
  page,
  pages,
  setPage,
}: {
  page: number
  pages: number
  setPage: (page: number) => void
}) {
  const numbers = Array.from({ length: pages }, (_, index) => index + 1)
  return (
    <nav
      aria-label={m.dir_barangay_pagination()}
      className="mt-6 flex flex-wrap justify-center gap-2"
    >
      {numbers.map((number) => (
        <button
          key={number}
          type="button"
          aria-current={number === page ? 'page' : undefined}
          onClick={() => setPage(number)}
          className={
            number === page
              ? 'rounded-site bg-primary px-3 py-1.5 text-[0.8125rem] font-semibold text-white'
              : 'rounded-site border border-black/12 bg-white px-3 py-1.5 text-[0.8125rem] font-semibold text-primary hover:bg-surface-alt'
          }
        >
          {number}
        </button>
      ))}
    </nav>
  )
}
