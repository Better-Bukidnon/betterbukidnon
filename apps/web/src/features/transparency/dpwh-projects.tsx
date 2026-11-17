import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { cn, formatNumber } from '@/lib/utils'
import { m } from '@/paraglide/messages'
import type { DpwhProject } from './data'

/*
 * The DPWH project list once data/dpwh-projects.json has projects, as legacy's dpwh-projects.js
 * drew it: a summary bar, category tabs, and a table that shows 8 rows and loads 8 more as it
 * scrolls into view (or on "Load More"). Its labels are English-only, as legacy had them.
 */

const firstRows = 8
const moreRows = 8

const categories = [
  {
    id: 'buildings',
    label: m.budget_dpwh_buildings,
    badge: 'bg-[rgba(139,92,246,0.1)] text-[#7c3aed]',
  },
  { id: 'roads', label: m.budget_dpwh_roads, badge: 'bg-[rgba(59,130,246,0.1)] text-[#2563eb]' },
  { id: 'flood', label: m.budget_dpwh_flood, badge: 'bg-[rgba(0,119,190,0.1)] text-[#0077be]' },
  { id: 'water', label: m.budget_dpwh_water, badge: 'bg-[rgba(6,182,212,0.1)] text-[#0891b2]' },
] as const
type CategoryId = (typeof categories)[number]['id']

type Category = (typeof categories)[number]
const byId = (id: CategoryId) => categories.find((category) => category.id === id) as Category

const categoryOf = (project: DpwhProject) =>
  byId(
    project.category.includes('Flood')
      ? 'flood'
      : project.category.includes('Road')
        ? 'roads'
        : project.category.includes('Water')
          ? 'water'
          : 'buildings',
  )

/** Each project with its category and completion, plus the summary and the filter tabs. */
function summarize(projects: DpwhProject[]) {
  const rows = projects.map((project) => ({
    project,
    category: categoryOf(project),
    done: project.status >= 100,
  }))
  const count = (id: CategoryId) => rows.filter((row) => row.category.id === id).length
  const completed = rows.filter((row) => row.done).length
  const totalCost = projects.reduce((total, project) => total + project.cost, 0)
  return {
    rows,
    summary: [
      [projects.length, m.budget_dpwh_projects],
      [`₱${(totalCost / 1_000_000).toFixed(1)}M`, m.budget_dpwh_total_investment],
      [completed, m.budget_dpwh_completed],
      [projects.length - completed, m.budget_dpwh_ongoing],
    ] as const,
    tabs: [
      { id: 'all' as const, label: m.budget_dpwh_all, total: projects.length },
      ...categories
        .map((category) => ({ ...category, total: count(category.id) }))
        // Legacy always offers the first three categories, and Water only when used.
        .filter((tab) => tab.id !== 'water' || tab.total > 0),
    ],
  }
}

const truncate = (text: string, length = 80) =>
  text.length <= length ? text : `${text.slice(0, length).trim()}…`

// Dates are calendar days, so format them in UTC to keep the day the record gives.
const dateFormat = new Intl.DateTimeFormat('en-PH', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

const th =
  'whitespace-nowrap px-3.5 py-3 text-left text-[0.6875rem] font-semibold uppercase tracking-[0.4px] text-white max-sm:px-3 max-sm:py-2.5'
const td = 'border-b border-black/4 px-3.5 py-3 align-top leading-[1.4] max-sm:px-3 max-sm:py-2.5'
const tabButton =
  'group inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-black/10 bg-white px-3.5 py-2 text-[0.8125rem] font-medium leading-[normal] text-ink-light transition-all duration-150 [font-family:revert] not-aria-selected:hover:border-primary not-aria-selected:hover:bg-[rgba(26,95,42,0.03)] not-aria-selected:hover:text-primary aria-selected:border-primary aria-selected:bg-primary aria-selected:text-white aria-selected:hover:border-secondary aria-selected:hover:bg-secondary max-sm:px-2.5 max-sm:py-1.5 max-sm:text-[0.75rem]'

export function DpwhProjects({ projects }: { projects: DpwhProject[] }) {
  const [filter, setFilter] = useState<'all' | CategoryId>('all')
  const [shown, setShown] = useState(firstRows)
  const [loading, setLoading] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { rows, summary, tabs } = useMemo(() => summarize(projects), [projects])
  const filtered = filter === 'all' ? rows : rows.filter((row) => row.category.id === filter)
  const remaining = filtered.length - shown

  // Legacy shows skeleton rows for 150ms before the next rows appear.
  const loadMore = () => {
    if (loading || remaining <= 0) return
    setLoading(true)
    window.setTimeout(() => {
      setShown((rows) => rows + moreRows)
      setLoading(false)
    }, 150)
  }
  const onLoadMoreVisible = useEffectEvent(loadMore)

  useEffect(() => {
    const element = loadMoreRef.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMoreVisible()
      },
      { rootMargin: '100px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const selectFilter = (id: 'all' | CategoryId) => {
    setFilter(id)
    setShown(firstRows)
  }

  return (
    <div>
      <div className="mb-4 flex justify-center gap-8 rounded-[10px] border border-black/6 bg-white px-6 py-4 max-lg:gap-5 max-lg:px-4 max-lg:py-3.5 max-sm:grid max-sm:grid-cols-[repeat(2,1fr)] max-sm:gap-3 max-sm:p-3">
        {summary.map(([value, label]) => (
          <div key={label()} className="flex flex-col items-center text-center">
            <span className="text-[1.25rem] font-bold leading-[1.2] text-primary max-lg:text-[1.125rem] max-sm:text-[1rem]">
              {value}
            </span>
            <span className="mt-0.5 text-[0.6875rem] uppercase tracking-[0.3px] text-ink-light max-sm:text-[0.625rem]">
              {label()}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div
          role="tablist"
          aria-label={m.budget_dpwh_filter()}
          className="flex flex-wrap gap-1.5 max-sm:gap-1"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tab.id === filter}
              onClick={() => selectFilter(tab.id)}
              className={tabButton}
            >
              {tab.label()}{' '}
              <span className="rounded-lg bg-black/6 px-1.5 py-0.5 text-[0.625rem] font-semibold group-aria-selected:bg-white/20 max-sm:px-1 max-sm:py-px max-sm:text-[0.5625rem]">
                {tab.total}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-black/6 bg-white max-lg:overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-[0.8125rem] max-lg:min-w-175 max-sm:min-w-150 max-sm:text-[0.75rem]">
          <thead className="sticky top-0 z-10 bg-[#0032a0]">
            <tr>
              <th scope="col" className={cn(th, 'w-[38%]')}>
                {m.budget_dpwh_description()}
              </th>
              <th scope="col" className={cn(th, 'w-[22%]')}>
                {m.budget_dpwh_contractor()}
              </th>
              <th scope="col" className={cn(th, 'w-[16%] text-right')}>
                {m.budget_dpwh_cost()}
              </th>
              <th scope="col" className={cn(th, 'w-[12%] text-center')}>
                {m.budget_dpwh_status()}
              </th>
              <th scope="col" className={cn(th, 'w-[12%] text-right')}>
                {m.budget_dpwh_completed()}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, shown).map(({ project, category, done }) => {
              return (
                <tr
                  key={project.id}
                  className="transition-[background] duration-150 hover:bg-[rgba(26,95,42,0.02)] [&:last-child>td]:border-b-0"
                >
                  <td className={td}>
                    <div className="mb-1 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-[3px] bg-[rgba(26,95,42,0.08)] px-[5px] py-0.5 text-[0.5625rem] font-bold tracking-[0.2px] text-primary">
                        {project.id}
                      </span>
                      <span
                        className={cn(
                          'rounded-md px-1.5 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.2px]',
                          category.badge,
                        )}
                      >
                        {category.label()}
                      </span>
                    </div>
                    <span
                      title={project.name}
                      className="mb-[3px] block truncate text-[0.8125rem] font-semibold leading-[1.35] text-ink"
                    >
                      {truncate(project.name)}
                    </span>
                    <span className="flex items-center gap-[3px] text-[0.6875rem] text-ink-light">
                      <Icon name="geo-alt" className="text-[0.5625rem] text-info" />
                      {project.location}
                    </span>
                  </td>
                  <td className={td}>
                    <span className="block text-[0.8125rem] font-medium leading-[1.35] text-ink">
                      {project.contractor}
                    </span>
                    {project.contractorId && (
                      <span className="mt-0.5 block text-[0.625rem] text-ink-light">
                        #{project.contractorId}
                      </span>
                    )}
                  </td>
                  <td
                    className={cn(
                      td,
                      'whitespace-nowrap text-right text-[0.8125rem] font-semibold leading-[1.4] text-success',
                    )}
                  >
                    ₱{formatNumber(project.cost, 2)}
                  </td>
                  <td className={cn(td, 'text-center')}>
                    <span
                      className={cn(
                        'inline-block rounded-[10px] px-2 py-[3px] text-[0.625rem] font-semibold uppercase tracking-[0.2px]',
                        done ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fef3c7] text-[#92400e]',
                      )}
                    >
                      {done ? m.budget_dpwh_completed() : `${project.status.toFixed(0)}%`}
                    </span>
                  </td>
                  <td
                    className={cn(
                      td,
                      'whitespace-nowrap text-right text-[0.75rem] leading-[1.4] text-ink-light',
                    )}
                  >
                    {project.completionDate
                      ? dateFormat.format(new Date(project.completionDate))
                      : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div ref={loadMoreRef} className="border-t border-black/4 p-4 text-center">
          {loading ? (
            Array.from({ length: Math.min(moreRows, remaining) }, (_, i) => (
              <div
                key={i}
                className="mx-4 my-2 h-14 animate-[skeleton-shimmer_1.2s_infinite] rounded bg-[linear-gradient(90deg,#f0f0f0_25%,#e8e8e8_50%,#f0f0f0_75%)] bg-size-[200%_100%]"
              />
            ))
          ) : remaining > 0 ? (
            <button
              type="button"
              onClick={loadMore}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-primary bg-white px-5 py-2.5 text-[0.8125rem] font-semibold leading-[normal] text-primary transition-all duration-150 [font-family:revert] hover:bg-primary hover:text-white max-sm:px-4 max-sm:py-2 max-sm:text-[0.75rem]"
            >
              {m.budget_dpwh_load_more()}{' '}
              <span className="text-[0.6875rem] font-normal opacity-70">
                {m.budget_dpwh_remaining({ count: remaining })}
              </span>
            </button>
          ) : (
            <span className="text-[0.75rem] text-ink-light">
              {m.budget_dpwh_showing_all({ count: filtered.length })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
