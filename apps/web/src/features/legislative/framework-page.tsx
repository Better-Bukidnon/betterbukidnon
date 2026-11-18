import { ScrollRegion } from '@/components/ui/scroll-region'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import {
  dataTable,
  dataTableCell,
  dataTableHead,
  infoCardIcon,
  legacyGrid,
  legacyNote,
  primaryButton,
} from '@/components/layout/legacy'
import { PageHeader } from '@/components/layout/page-header'
import { Icon, type IconName } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'
import { contactDirectory } from '@/config/contact'
import type { Message } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { m } from '@/paraglide/messages'
import { ordinances, resolutions } from './data'

/*
 * The Ordinance and Resolution framework pages, reproducing legacy
 * legislative/ordinance-framework.html and resolution-framework.html: what the document is,
 * its categories, the steps to pass one, and the published records (an empty state until the
 * data files have records, as legacy's ordinances.js / resolutions.js showed).
 */

type Row = { number: string; title: string; date: string }

type Framework = {
  crumb: Message
  badgeIcon: IconName
  badge: Message
  title: Message
  description: Message
  whatIs: Message
  whatIsText: Message[]
  categoriesTitle: Message
  categories: { icon: IconName; label: Message }[]
  processTitle: Message
  processSubtitle: Message
  steps: { title: Message; text: Message }[]
  /** What follows the steps: the LGU explainer card (ordinances) or a link back (resolutions). */
  AfterSteps: () => React.ReactNode
  recordsTitle: Message
  recordsSubtitle: Message
  emptyIcon: IconName
  emptyTitle: Message
  emptyText: Message
  tableCaption: Message
  columns: [Message, Message, Message]
  viewOfficial: Message
  records: Row[]
}

const ordinanceFramework: Framework = {
  crumb: m.leg_ordinance_framework,
  badgeIcon: 'journal-text',
  badge: m.ord_page_badge,
  title: m.ord_page_title,
  description: m.ord_page_desc,
  whatIs: m.ord_what_is,
  whatIsText: [m.ord_what_is_p1, m.ord_what_is_p2],
  categoriesTitle: m.ord_categories_title,
  categories: [
    { icon: 'cash-coin', label: m.ord_cat_revenue },
    { icon: 'wallet2', label: m.ord_cat_appropriations },
    { icon: 'flower1', label: m.ord_cat_agriculture },
    { icon: 'heart-pulse', label: m.ord_cat_health_social },
    { icon: 'tree', label: m.ord_cat_environment },
    { icon: 'signpost-2', label: m.ord_cat_infrastructure },
  ],
  processTitle: m.ord_process_title,
  processSubtitle: m.ord_process_subtitle,
  steps: [
    { title: m.ord_step_1_title, text: m.ord_step_1_desc },
    { title: m.ord_step_2_title, text: m.ord_step_2_desc },
    { title: m.ord_step_3_title, text: m.ord_step_3_desc },
    { title: m.ord_step_4_title, text: m.ord_step_4_desc },
    { title: m.ord_step_5_title, text: m.ord_step_5_desc },
    { title: m.ord_step_6_title, text: m.ord_step_6_desc },
  ],
  AfterSteps: LguCard,
  recordsTitle: m.ord_records_title,
  recordsSubtitle: m.ord_records_subtitle,
  emptyIcon: 'journal-x',
  emptyTitle: m.ord_empty_title,
  emptyText: m.ord_empty_desc,
  tableCaption: m.ord_table_caption,
  columns: [m.ord_table_number, m.ord_table_title, m.ord_table_date],
  viewOfficial: m.ord_view_records_official,
  records: ordinances.ordinances.map((record) => ({
    number: record.ordinanceNo,
    title: record.title,
    date: record.sessionDate,
  })),
}

const resolutionFramework: Framework = {
  crumb: m.leg_resolution_framework,
  badgeIcon: 'file-earmark-text',
  badge: m.reso_page_badge,
  title: m.reso_page_title,
  description: m.reso_page_desc,
  whatIs: m.reso_what_is,
  whatIsText: [m.reso_what_is_p1, m.reso_what_is_p2],
  categoriesTitle: m.reso_types_title,
  categories: [
    { icon: 'award', label: m.reso_type_commendation },
    { icon: 'envelope-paper', label: m.reso_type_request },
    { icon: 'hand-thumbs-up', label: m.reso_type_support },
    { icon: 'exclamation-circle', label: m.reso_type_condolence },
    { icon: 'clipboard-check', label: m.reso_type_authorization },
    { icon: 'search', label: m.reso_type_review },
  ],
  processTitle: m.reso_process_title,
  processSubtitle: m.reso_process_subtitle,
  steps: [
    { title: m.reso_step_1_title, text: m.reso_step_1_desc },
    { title: m.reso_step_2_title, text: m.reso_step_2_desc },
    { title: m.reso_step_3_title, text: m.reso_step_3_desc },
    { title: m.reso_step_4_title, text: m.reso_step_4_desc },
    { title: m.reso_step_5_title, text: m.reso_step_5_desc },
  ],
  AfterSteps: () => (
    <p className={legacyNote}>
      <SiteLink href="/legislative" className="text-primary">
        <Icon name="arrow-right" /> <span>{m.reso_see_flowchart()}</span>
      </SiteLink>
    </p>
  ),
  recordsTitle: m.reso_records_title,
  recordsSubtitle: m.reso_records_subtitle,
  emptyIcon: 'file-earmark-x',
  emptyTitle: m.reso_empty_title,
  emptyText: m.reso_empty_desc,
  tableCaption: m.reso_table_caption,
  columns: [m.reso_table_number, m.reso_table_title, m.reso_table_date],
  viewOfficial: m.reso_view_records_official,
  records: resolutions.resolutions.map((record) => ({
    number: record.resolutionNo,
    title: record.title,
    date: record.sessionDate,
  })),
}

export const OrdinanceFrameworkPage = () => <FrameworkPage framework={ordinanceFramework} />
export const ResolutionFrameworkPage = () => <FrameworkPage framework={resolutionFramework} />

// Section heading of these pages: 1.5rem from an inline style in legacy, with an optional grey intro.
function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="mb-2 text-[1.5rem]">{title}</h2>
      {subtitle && <p className="text-ink-light">{subtitle}</p>}
    </div>
  )
}

/** Legacy global `.info-card`: an icon column and the text. */
function InfoCard({
  icon,
  className,
  children,
}: {
  icon: IconName
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('flex overflow-hidden rounded-xl border border-line bg-white', className)}>
      <div className={infoCardIcon}>
        <Icon name={icon} />
      </div>
      <div className="flex-1 px-8 py-6 [&_h3]:mb-4 [&_h3]:text-[1.125rem] [&_h3]:text-ink [&_p]:mb-2 [&_p]:text-[0.9375rem] [&_p]:leading-[1.6] [&_p]:text-ink-light [&_p:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

// Ordinances only: how the provincial ordinances relate to those of the cities and municipalities.
function LguCard() {
  return (
    <InfoCard icon="diagram-2" className="mx-auto mt-8 max-w-205">
      <h3>{m.ord_lgu_title()}</h3>
      <p>{m.ord_lgu_desc()}</p>
      <p>
        <SiteLink href="/government#lgus">
          <span>{m.ord_see_lgu_list()}</span>
        </SiteLink>{' '}
        ·{' '}
        <SiteLink href="/legislative">
          <span>{m.ord_see_flowchart()}</span>
        </SiteLink>
      </p>
    </InfoCard>
  )
}

function FrameworkPage({ framework: f }: { framework: Framework }) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: m.leg_home(), link: { to: '/' } },
          { label: m.nav_legislative(), link: { to: '/legislative' } },
          { label: f.crumb() },
        ]}
      />
      <PageHeader
        badge={f.badge()}
        icon={f.badgeIcon}
        title={f.title()}
        description={f.description()}
      />

      <section className="section-y">
        <div className="container-site">
          <InfoCard icon="info-circle">
            <h3>{f.whatIs()}</h3>
            {f.whatIsText.map((text) => (
              <p key={text()}>{text()}</p>
            ))}
          </InfoCard>
        </div>
      </section>

      <section className="section-y bg-surface-alt">
        <div className="container-site">
          <Heading title={f.categoriesTitle()} />
          <div className={cn(legacyGrid[3], 'gap-4')}>
            {f.categories.map((category) => (
              <div
                key={category.icon}
                className="flex items-center gap-2.5 rounded-[10px] border border-line bg-white px-6 py-4 text-[0.9375rem] font-medium text-ink transition-all duration-200 hover:border-primary hover:shadow-[0_2px_8px_rgba(0,50,160,0.08)]"
              >
                <Icon name={category.icon} className="text-[1.125rem] text-primary" />
                <span>{category.label()}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-site">
          <Heading title={f.processTitle()} subtitle={f.processSubtitle()} />
          <ol className="mx-auto max-w-205 list-none p-0">
            {f.steps.map((step, i) => (
              <li
                key={step.title()}
                className="relative mb-2.5 rounded-site border border-black/6 bg-white py-3.5 pl-14 pr-4 max-[769px]:py-3 max-[769px]:pl-13 max-[769px]:pr-3"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-3.5 flex size-7 items-center justify-center rounded-md bg-primary text-[0.75rem] font-bold text-white max-[769px]:left-3 max-[769px]:top-3"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="m-0 mb-1 text-[0.9375rem] font-semibold text-ink">{step.title()}</h3>
                <p className="m-0 text-[0.875rem] leading-[1.55] text-ink-light">{step.text()}</p>
              </li>
            ))}
          </ol>
          <f.AfterSteps />
        </div>
      </section>

      <section className="section-y bg-surface-alt">
        <div className="container-site">
          <Heading title={f.recordsTitle()} subtitle={f.recordsSubtitle()} />
          {f.records.length === 0 ? (
            <div
              role="status"
              className="mx-auto max-w-160 rounded-site border border-dashed border-primary/25 bg-white px-6 py-8 text-center"
            >
              <Icon name={f.emptyIcon} className="mb-2 inline-block text-[1.75rem] text-primary" />
              <h3 className="m-0 mb-1.5 text-[1rem] font-semibold text-ink">{f.emptyTitle()}</h3>
              <p className="mb-4 mt-0 text-[0.875rem] leading-[1.6] text-ink-light">
                <span>{f.emptyText()}</span>{' '}
                <SiteLink href={contactDirectory.website} className="break-words">
                  {contactDirectory.website}
                </SiteLink>
              </p>
            </div>
          ) : (
            <RecordsTable framework={f} />
          )}
          <div className="mt-8 text-center">
            <SiteLink href={contactDirectory.website} className={primaryButton}>
              <Icon name="box-arrow-up-right" /> <span>{f.viewOfficial()}</span>
            </SiteLink>
          </div>
        </div>
      </section>
    </>
  )
}

/** Legacy `.data-table`: the published records, once the data files have any. */
function RecordsTable({ framework: f }: { framework: Framework }) {
  return (
    <ScrollRegion label={f.tableCaption()}>
      <table className={cn(dataTable, 'shadow-sm')}>
        <caption className="sr-only">{f.tableCaption()}</caption>
        <thead>
          <tr>
            {f.columns.map((column) => (
              <th key={column()} className={dataTableHead}>
                {column()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {f.records.map((record) => (
            <tr key={record.number}>
              <td className={cn(dataTableCell, 'whitespace-nowrap font-medium text-primary')}>
                {record.number}
              </td>
              <td className={cn(dataTableCell, 'leading-[1.5] text-ink')}>{record.title}</td>
              <td className={cn(dataTableCell, 'whitespace-nowrap text-ink-light')}>
                {record.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollRegion>
  )
}
