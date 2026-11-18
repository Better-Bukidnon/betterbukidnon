import { ScrollRegion } from '@/components/ui/scroll-region'
import type { ChartConfiguration, ChartType } from 'chart.js'
import { useRef, useState } from 'react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { PatternHero } from '@/components/layout/pattern-hero'
import { dataTable, dataTableCell, dataTableHead, primaryButton } from '@/components/layout/legacy'
import { Icon, type IconName } from '@/components/ui/icon'
import { LazyChart } from '@/components/ui/lazy-chart'
import { SiteLink } from '@/components/ui/site-link'
import { blgfUrl, contactDirectory } from '@/config/contact'
import { demographics } from '@/features/government/data'
import {
  districts,
  englishDistrictLabel as districtName,
  provincePopulation,
} from '@/features/government/districts'
import { useReveal } from '@/lib/use-reveal'
import { cn, formatNumber as format } from '@/lib/utils'
import { m } from '@/paraglide/messages'
import { competitiveIndex } from './data'

/*
 * The Statistics page, reproducing legacy statistics/index.html, assets/css/statistics.css and
 * what assets/js/statistics-new.js rendered from data/demographics.json and
 * data/competitive-index.json: the key figures, population growth, the district breakdown,
 * the city and municipality table, two Chart.js charts, the CMCI block and two info sections.
 * Everything but the charts is prerendered.
 */

// One colour per legislative district, as in the legacy charts and district list.
const districtColors = ['#0032a0', '#f77f00', '#06a77d', '#8b5cf6']
const { population, population_2020: census2020, counts } = demographics
const growth = ((population.total - census2020.total) / census2020.total) * 100
const lgus = [...demographics.lgus].sort((a, b) => a.name.localeCompare(b.name))
const sum = (key: 'population_2020' | 'area_km2' | 'barangays') =>
  lgus.reduce((total, lgu) => total + lgu[key], 0)
const largestDistrict = Math.max(...districts.map((district) => district.population))
const share = (value: number) => ((value / provincePopulation) * 100).toFixed(1)

const psa = 'https://psa.gov.ph/'
const cmciUrl = 'https://cmci.dti.gov.ph/'

export function StatisticsPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: m.stats_home(), link: { to: '/' } }, { label: m.nav_statistics() }]}
      />
      <PatternHero
        icon="bar-chart-fill"
        badge={m.stats_provincial_data()}
        title={m.stats_title()}
        subtitle={m.stats_subtitle()}
      />
      <Metrics />
      <Trends />
      <Distribution />
      <LguTable />
      <BarChart />
      <CompetitiveIndex />
      <People />
      <Pending />
    </>
  )
}

type MetricData = {
  icon: IconName
  value: number
  decimals?: number
  /** Count up from 0 when revealed, as legacy does for some figures. */
  count?: boolean
  label: string
  source: string
}

function Metrics() {
  const metrics: MetricData[] = [
    {
      icon: 'people-fill',
      value: population.total,
      count: true,
      label: m.stats_population(),
      source: m.stats_metric_population_source(),
    },
    {
      icon: 'rulers',
      value: demographics.land_area_km2,
      decimals: 2,
      label: m.stats_metric_land_area(),
      source: m.stats_metric_land_area_source(),
    },
    {
      icon: 'buildings-fill',
      value: counts.cities + counts.municipalities,
      label: m.stats_metric_lgus(),
      source: m.stats_metric_lgus_source(),
    },
    {
      icon: 'geo-alt-fill',
      value: counts.barangays,
      count: true,
      label: m.stats_metric_barangays(),
      source: m.stats_metric_barangays_source(),
    },
  ]
  return (
    <section className="relative z-2 mt-10 pb-15">
      <div className="container-site">
        <div className="grid grid-cols-[repeat(4,1fr)] gap-5 max-lg:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-1 max-sm:gap-3">
          {metrics.map((metric, i) => (
            <Metric key={metric.icon} delay={i * 100} {...metric} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Metric({
  icon,
  value,
  decimals,
  count,
  label,
  source,
  delay,
}: MetricData & { delay: number }) {
  const figure = useRef<HTMLDivElement>(null)
  const ref = useReveal<HTMLDivElement>({
    delay,
    // Legacy counts up over 2 seconds (ease-out cubic). The text is set directly, so the card
    // doesn't re-render every frame; the prerendered text is the final value.
    onReveal: () => {
      if (!count) return
      const start = performance.now()
      let frame = 0
      const step = (now: number) => {
        const progress = Math.min((now - start) / 2000, 1)
        if (figure.current) {
          figure.current.textContent = format(Math.floor(value * (1 - (1 - progress) ** 3)))
        }
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
      return () => cancelAnimationFrame(frame)
    },
  })
  return (
    <div
      ref={ref}
      className="legacy-reveal rounded-2xl border border-black/4 bg-white px-6 py-7 text-center shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,50,160,0.12)] max-sm:p-5"
    >
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-[14px] bg-linear-135 from-primary to-secondary text-[1.5rem] text-white">
        <Icon name={icon} />
      </div>
      <div
        ref={figure}
        className="mb-1 text-[2rem] font-bold leading-[1.2] text-ink max-sm:text-[1.5rem]"
      >
        {format(value, decimals)}
      </div>
      <div className="mb-1 text-[0.9375rem] font-semibold text-ink">{label}</div>
      <div className="text-[0.8125rem] text-ink-light">{source}</div>
    </div>
  )
}

/** Legacy `.stats-section`, which fades in on scroll; `alt` is its grey (even) background. */
function Section({
  id,
  alt,
  icon,
  tag,
  title,
  description,
  children,
}: {
  id?: string
  alt?: boolean
  icon: IconName
  tag: string
  title: string
  description: string
  children: React.ReactNode
}) {
  const ref = useReveal<HTMLElement>()
  return (
    <section
      ref={ref}
      id={id}
      className={cn('legacy-reveal py-20 max-sm:py-12', alt && 'bg-surface-alt')}
    >
      <div className="container-site">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3.5 py-1.5 text-[0.8125rem] font-semibold text-primary">
            <Icon name={icon} /> <span>{tag}</span>
          </span>
          <h2 className="mb-2 text-[1.75rem] text-ink max-sm:text-[1.5rem]">{title}</h2>
          <p className="m-0 text-[1rem] text-ink-light">{description}</p>
        </div>
        {children}
      </div>
    </section>
  )
}

/** Legacy `.data-source`: the centred note under a section. */
function SourceLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 text-center text-[0.8125rem] text-ink-light [&_a]:text-primary [&_a:hover]:underline">
      <Icon name="info-circle" className="mr-1" /> {children}
    </p>
  )
}

function Source({ href = psa, label = m.stats_philippine_statistics_authority_psa() }) {
  return (
    <SourceLine>
      <span>{m.stats_source_label()}</span> <SiteLink href={href}>{label}</SiteLink>
    </SourceLine>
  )
}

const note = 'mx-auto my-0 max-w-180 text-center text-[0.9375rem] text-ink-light'

function Trends() {
  const stat =
    'rounded-xl border px-8 py-5 text-center max-lg:px-6 max-lg:py-4 max-sm:px-5 max-sm:py-3'
  const label = 'mb-1 text-[0.8125rem]'
  const value = 'text-[1.5rem] font-bold max-sm:text-[1.25rem]'
  return (
    <Section
      alt
      icon="graph-up"
      tag={m.stats_growth()}
      title={m.stats_population_trends()}
      description={m.stats_population_trends_desc()}
    >
      <div className="mb-10 flex flex-wrap items-center justify-center gap-6 max-lg:gap-4">
        <div className={cn(stat, 'border-black/6 bg-white')}>
          <span className={cn(label, 'text-ink-light')}>{census2020.year}</span>{' '}
          <span className={cn(value, 'text-ink')}>{format(census2020.total)}</span>
        </div>
        <div className="text-[1.25rem] text-ink-light">
          <Icon name="arrow-right" />
        </div>
        <div className={cn(stat, 'border-0 bg-linear-135 from-primary to-secondary text-white')}>
          <span className={label}>{population.year}</span>{' '}
          <span className={value}>{format(population.total)}</span>
        </div>
        <div className={cn(stat, 'border-success bg-[rgba(6,167,125,0.1)]')}>
          <span className={cn(label, 'text-ink-light')}>{m.stats_growth()}</span>{' '}
          <span className={cn(value, 'text-success')}>+{growth.toFixed(1)}%</span>
        </div>
      </div>
      <p className={note}>{m.stats_density_note()}</p>
      <Source />
    </Section>
  )
}

function Distribution() {
  return (
    <Section
      icon="pie-chart-fill"
      tag={m.stats_distribution()}
      title={m.stats_population_by_district()}
      description={m.stats_2020_census()}
    >
      <div className="grid grid-cols-[1fr_1fr] items-start gap-10 max-lg:grid-cols-1">
        <ChartBox
          className="h-100 max-lg:h-[350px]"
          label={m.stats_district_chart_aria()}
          config={districtChart}
        />
        <div className="flex flex-col gap-2">
          {districts.map((district, i) => (
            <div
              key={district.lguNames}
              style={{ '--district-color': districtColors[i] } as React.CSSProperties}
              className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 rounded-lg border border-l-4 border-black/4 border-l-(--district-color) bg-white px-4 py-3"
            >
              <span className="font-semibold text-ink">
                <span>{districtName(i + 1)}</span>
              </span>
              <span className="whitespace-nowrap text-right font-semibold text-ink">
                {format(district.population)}{' '}
                <small className="text-[smaller] font-normal text-ink-light">
                  ({share(district.population)}%)
                </small>
              </span>
              <div className="col-span-full h-2 overflow-hidden rounded bg-surface-alt">
                <div
                  className="h-full w-(--bar) rounded bg-(--district-color) transition-[width] delay-100 duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] reveal-pending:w-0"
                  style={
                    {
                      '--bar': `${Math.round((district.population / largestDistrict) * 100)}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
              <span className="col-span-full text-[0.8125rem] leading-[1.4] text-ink-light">
                {district.lguNames}
              </span>
            </div>
          ))}
        </div>
      </div>
      <SourceLine>
        <SiteLink href="/government#districts">{m.stats_see_district_members()}</SiteLink>
      </SourceLine>
    </Section>
  )
}

// The legacy .data-table, restyled by .stats-lgu-table.
const statsTable = cn(
  dataTable,
  'min-w-140 text-[0.9375rem] max-md:text-[0.9375rem] max-sm:text-[0.8125rem]',
)
const tableWrap = 'rounded-xl border border-black/6 bg-white'
const num = 'text-right tabular-nums whitespace-nowrap'
const rowHead = cn(dataTableCell, 'font-semibold text-ink')
const footCell = 'border-t-2 border-t-primary'

const columns = [
  [m.stats_th_lgu, false],
  [m.stats_th_district, false],
  [m.stats_th_population_2020, true],
  [m.stats_th_area, true],
  [m.stats_th_barangays, true],
] as const

function LguTable() {
  return (
    <Section
      alt
      id="lgu-statistics"
      icon="table"
      tag={m.stats_lgus_tag()}
      title={m.stats_lgus_title()}
      description={m.stats_lgus_desc()}
    >
      <ScrollRegion label={m.stats_lgus_caption()} className={tableWrap}>
        <table className={statsTable}>
          <caption className="sr-only">{m.stats_lgus_caption()}</caption>
          <thead>
            <tr>
              {columns.map(([label, numeric]) => (
                <th key={label()} scope="col" className={cn(dataTableHead, numeric && num)}>
                  {label()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lgus.map((lgu) => (
              <tr key={lgu.name}>
                <th scope="row" className={rowHead}>
                  {lgu.name}
                  {lgu.capital && (
                    <>
                      {' '}
                      <small className="text-[smaller] font-normal text-ink-light">
                        {m.stats_capital()}
                      </small>
                    </>
                  )}
                </th>
                <td className={dataTableCell}>
                  <span>{districtName(lgu.district)}</span>
                </td>
                <td className={cn(dataTableCell, num)}>{format(lgu.population_2020)}</td>
                <td className={cn(dataTableCell, num)}>{format(lgu.area_km2, 2)}</td>
                <td className={cn(dataTableCell, num)}>{format(lgu.barangays)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {/* Legacy's row-header rule outranks its tfoot rule here: semibold, no background. */}
            <tr>
              <th scope="row" colSpan={2} className={cn(rowHead, footCell)}>
                {m.stats_total_province()}
              </th>
              {[
                format(provincePopulation),
                format(sum('area_km2'), 2),
                format(sum('barangays')),
              ].map((total, i) => (
                <td
                  key={i}
                  className={cn(dataTableCell, num, footCell, 'bg-surface-alt font-bold text-ink')}
                >
                  {total}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </ScrollRegion>
      <Source />
    </Section>
  )
}

function BarChart() {
  return (
    <Section
      icon="bar-chart-fill"
      tag={m.stats_visual()}
      title={m.stats_population_bar_chart()}
      description={m.stats_population_bar_chart_desc()}
    >
      <ChartBox
        className="relative h-150 max-sm:h-125 max-sm:p-4"
        label={m.stats_bar_chart_aria()}
        config={populationChart}
      />
      <Source />
    </Section>
  )
}

function CompetitiveIndex() {
  const { years, overall, pillars } = competitiveIndex
  const rows = [
    ...(overall.length ? [{ id: 'overall', label: m.stats_cmci_overall(), scores: overall }] : []),
    ...pillars.map((pillar) => ({ id: pillar.id, label: pillar.name, scores: pillar.scores })),
  ]
  const hasScores = years.length > 0 && rows.length > 0
  return (
    <Section
      alt
      id="competitive-index"
      icon="trophy-fill"
      tag={m.stats_competitiveness()}
      title={m.stats_bukidnon_competitive_index()}
      description={m.stats_cities_and_municipalities_competitiveness_index()}
    >
      {hasScores ? (
        <ScrollRegion label={m.stats_bukidnon_competitive_index()} className={tableWrap}>
          <table className={statsTable}>
            <thead>
              <tr>
                <th scope="col" className={dataTableHead}>
                  {m.stats_cmci_pillar()}
                </th>
                {years.map((year) => (
                  <th key={year} scope="col" className={cn(dataTableHead, num)}>
                    {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row" className={rowHead}>
                    {row.label}
                  </th>
                  {years.map((year, i) => {
                    const value = row.scores[i]
                    return (
                      <td key={year} className={cn(dataTableCell, num)}>
                        {typeof value === 'number' ? format(value, 2) : '–'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
      ) : (
        <div className="mx-auto max-w-180 rounded-xl border border-dashed border-[rgba(0,50,160,0.3)] bg-white px-6 py-8 text-center max-sm:px-4 max-sm:py-5">
          <Icon
            name="hourglass-split"
            aria-hidden="true"
            className="mb-3 block text-[2rem] text-primary"
          />
          <p className="mb-4 text-ink-light">{m.stats_cmci_empty()}</p>
          <SiteLink
            href={cmciUrl}
            className={cn(
              primaryButton,
              'px-4 py-2 text-[0.875rem] max-md:px-3 max-md:py-1.5 max-md:text-[0.8125rem]',
            )}
          >
            {m.stats_cmci_link()}
          </SiteLink>
        </div>
      )}
      <Source href={cmciUrl} label={m.stats_dti_cities_and_municipalities_competitiveness()} />
    </Section>
  )
}

const infoGrid = 'grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5'
const infoCard =
  'rounded-xl border border-black/6 bg-white p-6 max-sm:px-4 max-sm:py-5 [&_h3]:mb-3 [&_h3]:text-[1.0625rem] [&_h3]:text-ink [&_ul]:mb-3 [&_ul]:mt-0 [&_ul]:pl-5 [&_ul]:leading-[1.7]'

const languages = ['Higaonon', 'Hiligaynon', 'Binukid', 'Talaandig', 'Ilocano', 'Matigsalug']
const peoples = [
  'Bukidnon',
  'Higaonon',
  'Talaandig',
  'Manobo',
  'Matigsalug',
  'Tigwahanon',
  'Umayamnon',
]

function People() {
  return (
    <Section
      icon="translate"
      tag={m.stats_people_tag()}
      title={m.stats_people_title()}
      description={m.stats_people_desc()}
    >
      <div className={infoGrid}>
        <div className={infoCard}>
          <h3>{m.stats_languages_title()}</h3>
          <ul>
            <li>
              Cebuano / Binisaya <span>{m.stats_most_widely_spoken()}</span>
            </li>
            {languages.map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <p className={cn(note, 'text-left text-[0.8125rem]')}>{m.stats_languages_note()}</p>
        </div>
        <div className={infoCard}>
          <h3>{m.stats_peoples_title()}</h3>
          <ul>
            {peoples.map((people) => (
              <li key={people}>{people}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

function Pending() {
  const cards = [
    {
      title: m.stats_pending_finance(),
      href: blgfUrl,
      link: m.stats_bureau_of_local_government_finance_blgf(),
    },
    {
      title: m.stats_pending_poverty(),
      href: psa,
      link: m.stats_philippine_statistics_authority_psa(),
    },
    {
      title: m.stats_pending_province(),
      href: contactDirectory.website,
      link: m.stats_official_lgu_bukidnon_portal(),
    },
  ]
  return (
    <Section
      alt
      icon="clipboard-check"
      tag={m.stats_pending_tag()}
      title={m.stats_pending_title()}
      description={m.stats_pending_desc()}
    >
      <div className={infoGrid}>
        {cards.map((card) => (
          <div key={card.href} className={infoCard}>
            <h3>{card.title}</h3>
            <SiteLink href={card.href}>{card.link}</SiteLink>
          </div>
        ))}
      </div>
    </Section>
  )
}

/** Legacy `.chart-wrapper` / `.distribution-chart`: the card around a chart, or a note if it can't load. */
function ChartBox<T extends ChartType>({
  className,
  label,
  config,
}: {
  className: string
  label: string
  config: () => ChartConfiguration<T>
}) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      className={cn(
        'rounded-xl border border-black/6 bg-white p-6 [&_canvas]:max-h-full',
        className,
        failed && 'h-auto max-lg:h-auto max-sm:h-auto',
      )}
    >
      {failed ? (
        <p className="m-0 p-4 text-center text-[0.9375rem] text-ink-light">
          {m.stats_chart_unavailable()}
        </p>
      ) : (
        <LazyChart label={label} config={config} onError={() => setFailed(true)} />
      )}
    </div>
  )
}

const tooltip = {
  backgroundColor: 'rgba(0, 50, 160, 0.95)',
  titleFont: { size: 14, weight: 600 },
  bodyFont: { size: 13 },
  padding: 12,
  cornerRadius: 8,
} as const

function districtChart(): ChartConfiguration<'doughnut'> {
  return {
    type: 'doughnut',
    data: {
      labels: districts.map((_, i) => districtName(i + 1)),
      datasets: [
        {
          data: districts.map((district) => district.population),
          backgroundColor: districtColors,
          borderColor: '#fff',
          borderWidth: 3,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { animateRotate: true, animateScale: true, duration: 1500 },
      cutout: '55%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 14, padding: 12, font: { size: 12 }, usePointStyle: true },
        },
        tooltip: {
          ...tooltip,
          callbacks: {
            label: ({ raw }) => `${format(raw as number)} (${share(raw as number)}%)`,
          },
        },
      },
    },
  }
}

function populationChart(): ChartConfiguration<'bar'> {
  const sorted = [...lgus].sort((a, b) => b.population_2020 - a.population_2020)
  const label = m.stats_population()
  return {
    type: 'bar',
    data: {
      labels: sorted.map((lgu) => lgu.name),
      datasets: [
        {
          label,
          data: sorted.map((lgu) => lgu.population_2020),
          backgroundColor: sorted.map((lgu) => districtColors[lgu.district - 1] ?? ''),
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1500, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltip,
          displayColors: false,
          callbacks: {
            label: (item) => `${label}: ${format(item.raw as number)}`,
            afterLabel: (item) => districtName(sorted[item.dataIndex]?.district ?? 0),
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { size: 11 }, callback: (value) => format(Number(value)) },
        },
        y: { grid: { display: false }, ticks: { font: { size: 11 }, autoSkip: false } },
      },
    },
  }
}
