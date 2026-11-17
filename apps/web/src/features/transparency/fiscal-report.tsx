import type { Chart, ChartConfiguration } from 'chart.js'
import { useEffect, useRef, useState } from 'react'
import { Icon, type IconName } from '@/components/ui/icon'
import { LazyChart } from '@/components/ui/lazy-chart'
import { cn } from '@/lib/utils'
import { m } from '@/paraglide/messages'
import { SourceNote } from './budget-ui'
import type { FiscalPeriod } from './data'

/*
 * The Statement of Receipts and Expenditures once data/fiscal_transparency.json has figures,
 * as legacy's transparency-v2.js drew it: four totals, then income and expenditure doughnuts
 * with their breakdowns. Hovering a breakdown row dims the chart's other segments.
 */

const peso = (value: number) => `₱${value.toFixed(2)} M`
const percent = (value: number, total: number) =>
  total === 0 ? '—' : `${((value / total) * 100).toFixed(1)}%`

// A breakdown message; its chart label (shown in tooltips) is drawn in English, as in legacy.
type SliceMessage = (inputs?: Record<string, never>, options?: { locale?: 'en' }) => string
type Slice = { key: string; color: string; name: SliceMessage; detail: SliceMessage }

const incomeSlices: Slice[] = [
  {
    key: 'local',
    color: '#10b981',
    name: m.budget_local_sources,
    detail: m.budget_tax_nontax_revenue,
  },
  {
    key: 'external',
    color: '#0ea5e9',
    name: m.budget_external_sources,
    detail: m.budget_national_tax_allotment,
  },
]

const expenditureSlices: Slice[] = [
  {
    key: 'gps',
    color: '#3b82f6',
    name: m.budget_general_public_services,
    detail: m.budget_administration_operations,
  },
  {
    key: 'social',
    color: '#8b5cf6',
    name: m.budget_social_services,
    detail: m.budget_health_education_welfare,
  },
  {
    key: 'economic',
    color: '#f59e0b',
    name: m.budget_economic_services,
    detail: m.budget_infrastructure_development,
  },
  {
    key: 'debt',
    color: '#ef4444',
    name: m.budget_debt_service,
    detail: m.budget_interest_charges,
  },
]

const metrics: {
  icon: IconName
  gradient: string
  label: () => string
  value: (period: FiscalPeriod) => number
}[] = [
  {
    icon: 'arrow-down-circle',
    gradient: 'from-[#10b981] to-[#059669]',
    label: m.budget_total_income,
    value: (period) => period.income.total,
  },
  {
    icon: 'arrow-up-circle',
    gradient: 'from-[#f59e0b] to-[#d97706]',
    label: m.budget_total_expenditures,
    value: (period) => period.expenditures.total,
  },
  {
    icon: 'plus-slash-minus',
    gradient: 'from-[#3b82f6] to-[#2563eb]',
    label: m.budget_net_operating_income,
    value: (period) => period.netIncome,
  },
  {
    icon: 'wallet2',
    gradient: 'from-[#8b5cf6] to-[#7c3aed]',
    label: m.budget_fund_balance_end,
    value: (period) => period.fundBalance,
  },
]

/** Legacy `.sre-period-toggle`: one button per period, shown when there are two or more. */
export function PeriodToggle({
  periods,
  active,
  onSelect,
}: {
  periods: FiscalPeriod[]
  active: string
  onSelect: (id: string) => void
}) {
  if (periods.length < 2) return null
  return (
    <div
      role="tablist"
      aria-label={m.budget_select_period()}
      className="flex gap-1 rounded-xl border border-black/6 bg-white p-1 shadow-[0_1px_3px_rgba(0,0,0,0.08)] max-sm:w-full"
    >
      {periods.map((period) => (
        <button
          key={period.id}
          type="button"
          role="tab"
          aria-selected={period.id === active}
          onClick={() => onSelect(period.id)}
          className="group flex min-w-[90px] cursor-pointer flex-col items-center rounded-[10px] border-none bg-transparent px-6 py-2.5 leading-[normal] transition-all duration-200 [font-family:revert] not-aria-selected:hover:bg-primary/4 aria-selected:bg-primary max-sm:flex-1 max-sm:px-4"
        >
          <span className="text-[1rem] font-bold text-ink transition-colors duration-200 group-aria-selected:text-white">
            {period.label}
          </span>
          {period.range && (
            <span className="mt-0.5 text-[0.6875rem] text-ink-light transition-colors duration-200 group-aria-selected:text-white">
              {period.range}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export function FiscalReport({ period, sourceUrl }: { period: FiscalPeriod; sourceUrl: string }) {
  // Legacy dims the totals for 150ms while they change to the new period.
  const [shown, setShown] = useState(period)
  const updating = shown !== period
  useEffect(() => {
    const timer = window.setTimeout(() => setShown(period), 150)
    return () => window.clearTimeout(timer)
  }, [period])

  return (
    <div>
      <div className="mb-8 grid grid-cols-[repeat(4,1fr)] gap-4 max-lg:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-1 max-sm:gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.icon}
            className="flex items-center gap-3.5 rounded-2xl border border-black/4 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,50,160,0.1)] max-sm:p-4"
          >
            <div
              className={cn(
                'flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-135 text-[1.25rem] text-white',
                metric.gradient,
              )}
            >
              <Icon name={metric.icon} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span
                className={cn(
                  'text-[1.375rem] font-bold leading-[1.2] text-ink transition-[opacity,transform] duration-150 max-sm:text-[1.25rem]',
                  updating && 'scale-[0.98] opacity-50',
                )}
              >
                {peso(metric.value(shown))}
              </span>
              <span className="text-[0.75rem] font-medium text-ink-light">{metric.label()}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-8 grid grid-cols-[repeat(2,1fr)] gap-6 max-lg:grid-cols-1">
        <Breakdown
          icon="pie-chart"
          title={m.budget_income_sources()}
          slices={incomeSlices}
          values={period.income}
        />
        <Breakdown
          icon="bar-chart"
          title={m.budget_expenditure_allocation()}
          slices={expenditureSlices}
          values={period.expenditures}
        />
      </div>
      <SourceNote href={sourceUrl} label={m.budget_bureau_of_local_government_finance_blgf()} />
    </div>
  )
}

/** Legacy `.sre-breakdown-panel`: a doughnut chart and one row per slice. */
function Breakdown({
  icon,
  title,
  slices,
  values,
}: {
  icon: IconName
  title: string
  slices: Slice[]
  /** The period's income or expenditures: an amount per slice key, and the total. */
  values: Record<string, number> & { total: number }
}) {
  const chart = useRef<Chart<'doughnut'> | null>(null)
  const colors = slices.map((slice) => slice.color)
  const amounts = slices.map((slice) => values[slice.key] ?? 0)

  useEffect(() => {
    const current = chart.current
    if (!current?.data.datasets[0]) return
    current.data.datasets[0].data = slices.map((slice) => values[slice.key] ?? 0)
    current.update('active')
  }, [slices, values])

  // Legacy dims the other segments (to 25% alpha) instead of offsetting the hovered one.
  const highlight = (index?: number) => {
    const dataset = chart.current?.data.datasets[0]
    if (!dataset) return
    const shown = colors.map((color, i) =>
      index === undefined || i === index ? color : `${color}40`,
    )
    dataset.backgroundColor = shown
    dataset.hoverBackgroundColor = shown
    chart.current?.update('none')
  }

  const config = (): ChartConfiguration<'doughnut'> => ({
    type: 'doughnut',
    data: {
      labels: slices.map((slice) => slice.name({}, { locale: 'en' })),
      datasets: [
        {
          data: amounts,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 0,
          hoverBorderWidth: 3,
          hoverBorderColor: '#ffffff',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      layout: { padding: 4 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: 12,
          titleFont: { size: 13, weight: 600 },
          bodyFont: { size: 12 },
          cornerRadius: 8,
          callbacks: { label: ({ raw }) => peso(Number(raw)) },
        },
      },
      animation: { animateRotate: true, animateScale: true, duration: 600, easing: 'easeOutQuart' },
    },
  })

  return (
    <div className="overflow-hidden rounded-[20px] border border-black/4 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="border-b border-black/6 px-5 py-4">
        <h3 className="m-0 flex items-center gap-2 text-[0.9375rem] font-semibold text-ink">
          <Icon name={icon} className="text-[1rem] text-primary" /> <span>{title}</span>
        </h3>
      </div>
      <div className="p-5">
        <div className="relative mb-5 h-45 overflow-hidden max-sm:h-40">
          <LazyChart config={config} chartRef={chart} />
        </div>
        <div className="flex flex-col gap-3">
          {slices.map((slice, i) => (
            <div
              key={slice.key}
              onMouseEnter={() => highlight(i)}
              onMouseLeave={() => highlight()}
              className="flex items-center gap-3 rounded-[10px] bg-[#f8fafc] p-3 transition-all duration-200 hover:bg-[#f1f5f9]"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <div className="min-w-0 flex-1">
                <span className="block text-[0.875rem] font-semibold text-ink">{slice.name()}</span>
                <span className="mt-px block text-[0.75rem] text-ink-light">{slice.detail()}</span>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[0.9375rem] font-bold text-ink">{peso(amounts[i] ?? 0)}</span>
                <span className="rounded bg-black/4 px-1.5 py-0.5 text-[0.6875rem] text-ink-light">
                  {percent(amounts[i] ?? 0, values.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
