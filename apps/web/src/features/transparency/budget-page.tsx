import { useState } from 'react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Icon, type IconName } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'
import { blgfUrl, contactDirectory } from '@/config/contact'
import { m } from '@/paraglide/messages'
import {
  EmptyState,
  ExplainGrid,
  heading,
  InfraSection,
  intro,
  Label,
  RevealSection,
  SourceNote,
} from './budget-ui'
import { dpwhProjects, latestFiscalYear } from './data'
import { DpwhProjects } from './dpwh-projects'
import { FiscalReport, PeriodToggle } from './fiscal-report'

/*
 * The Budget page, reproducing legacy budget/index.html and assets/css/transparency-v2.css,
 * with what transparency-v2.js and dpwh-projects.js drew from data/fiscal_transparency.json
 * and data/dpwh-projects.json. Each shows an empty state with the official sources until its
 * file has data.
 */

const fiscalYear = latestFiscalYear()
const fdpp = 'https://fdpp.dilg.gov.ph/'
const dpwh = 'https://www.dpwh.gov.ph/'

export function BudgetPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: m.budget_home(), link: { to: '/' } }, { label: m.budget_breadcrumb() }]}
      />
      <section className="relative bg-linear-135 from-primary to-secondary pb-14 pt-12 text-center max-sm:pb-11 max-sm:pt-9">
        <div className="container-site">
          <div className="relative z-1">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/12 px-4 py-1.5 text-[0.8125rem] font-medium text-white backdrop-blur-[4px]">
              <Icon name="shield-check" /> <span>{m.budget_financial_transparency()}</span>
            </span>
            <h1 className="mb-1.5 text-[2rem] font-bold text-white max-sm:text-[1.5rem]">
              {m.budget_title()}
            </h1>
            <p className="m-0 text-[1rem] text-white/85">{m.budget_subtitle()}</p>
          </div>
        </div>
      </section>
      <Receipts />
      <InfraSection
        alt
        icon="book"
        label={m.budget_howto_label()}
        title={m.budget_howto_title()}
        description={m.budget_howto_subtitle()}
      >
        <ExplainGrid
          cards={[
            {
              icon: 'journal-check',
              title: m.budget_howto_ordinance_title(),
              text: m.budget_howto_ordinance_desc(),
            },
            {
              icon: 'arrow-left-right',
              title: m.budget_howto_compare_title(),
              text: m.budget_howto_compare_desc(),
            },
            {
              icon: 'pie-chart',
              title: m.budget_howto_sources_title(),
              text: m.budget_howto_sources_desc(),
            },
            {
              icon: 'list-check',
              title: m.budget_howto_required_title(),
              text: m.budget_howto_required_desc(),
            },
          ]}
        />
      </InfraSection>
      <InfraSection
        icon="building-gear"
        label={m.budget_public_works()}
        title={m.budget_infrastructure_investments()}
        description={m.budget_major_development_projects_serving_the_community()}
      >
        <EmptyState
          icon="cone-striped"
          text={m.budget_infra_empty_desc()}
          links={[
            {
              href: '/service-details/provincial-engineering',
              label: m.budget_provincial_engineers_office(),
            },
            {
              href: contactDirectory.website,
              label: m.budget_provincial_government_of_bukidnon(),
            },
            {
              href: 'https://sumbongsapangulo.ph/flood-control-map/',
              label: m.budget_flood_control_map(),
            },
          ]}
        />
      </InfraSection>
      <InfraSection
        alt
        icon="building"
        label={m.budget_national_government_projects()}
        title={m.budget_dpwh_infrastructure_projects_in_bukidnon()}
        description={m.budget_dpwh_desc()}
      >
        {dpwhProjects.length === 0 ? (
          <EmptyState
            icon="cone-striped"
            text={m.budget_dpwh_empty_desc()}
            links={[{ href: dpwh, label: m.budget_dpwh_name() }]}
          />
        ) : (
          <>
            <DpwhProjects projects={dpwhProjects} />
            <SourceNote href={dpwh} label={m.budget_dpwh_name()} className="mt-6" />
          </>
        )}
      </InfraSection>
      <Resources />
    </>
  )
}

/** Legacy `.sre-section-v2`: the Statement of Receipts and Expenditures and its explainers. */
function Receipts() {
  const [periodId, setPeriodId] = useState(fiscalYear?.periods[0]?.id)
  const period = fiscalYear?.periods.find((item) => item.id === periodId)
  const hasData = fiscalYear !== undefined && period !== undefined
  return (
    <RevealSection className="bg-[#f8fafc] pb-16 pt-12 max-sm:pb-12 max-sm:pt-9">
      <div className="container-site">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-6 max-lg:flex-col max-lg:items-start">
          <div className="min-w-70 flex-1">
            <Label icon="graph-up-arrow">{m.budget_financial_report()}</Label>
            <h2 className={heading}>{m.budget_statement_of_receipts_expenditures()}</h2>
            <p className={intro}>
              {fiscalYear ? `FY ${fiscalYear.year}` : m.budget_sre_subtitle()}
            </p>
          </div>
          {hasData && (
            <PeriodToggle periods={fiscalYear.periods} active={period.id} onSelect={setPeriodId} />
          )}
        </div>
        {hasData ? (
          <FiscalReport period={period} sourceUrl={fiscalYear.sourceUrl} />
        ) : (
          <EmptyState
            icon="hourglass-split"
            text={m.budget_sre_empty_desc()}
            links={[
              { href: blgfUrl, label: m.budget_bureau_of_local_government_finance_blgf() },
              {
                href: contactDirectory.website,
                label: m.budget_provincial_government_of_bukidnon(),
              },
              { href: fdpp, label: m.budget_full_disclosure_policy_portal() },
            ]}
          />
        )}
        <ExplainGrid
          className="mt-8"
          cards={[
            {
              icon: 'file-earmark-bar-graph',
              title: m.budget_explain_sre_title(),
              text: m.budget_explain_sre_desc(),
            },
            {
              icon: 'arrow-down-circle',
              title: m.budget_explain_income_title(),
              text: m.budget_explain_income_desc(),
            },
            {
              icon: 'arrow-up-circle',
              title: m.budget_explain_expense_title(),
              text: m.budget_explain_expense_desc(),
            },
            {
              icon: 'wallet2',
              title: m.budget_explain_balance_title(),
              text: m.budget_explain_balance_desc(),
            },
          ]}
        />
      </div>
    </RevealSection>
  )
}

/** Legacy `.resources-section-v2`: where to find the official figures. */
function Resources() {
  const resources: { href: string; icon: IconName; title: string; text: string }[] = [
    {
      href: contactDirectory.website,
      icon: 'bank',
      title: m.budget_provincial_government_of_bukidnon(),
      text: m.budget_source_pgb_desc(),
    },
    {
      href: fdpp,
      icon: 'folder2-open',
      title: m.budget_full_disclosure_policy_portal(),
      text: m.budget_source_fdpp_desc(),
    },
    {
      href: blgfUrl,
      icon: 'graph-up',
      title: m.budget_bureau_of_local_government_finance_blgf(),
      text: m.budget_source_blgf_desc(),
    },
    {
      href: 'https://www.dbm.gov.ph/',
      icon: 'cash-stack',
      title: m.budget_dbm_name(),
      text: m.budget_source_dbm_desc(),
    },
    {
      href: dpwh,
      icon: 'cone-striped',
      title: m.budget_dpwh_name(),
      text: m.budget_source_dpwh_desc(),
    },
    {
      href: 'https://www.coa.gov.ph/',
      icon: 'clipboard-data',
      title: m.budget_coa_name(),
      text: m.budget_source_coa_desc(),
    },
  ]
  return (
    <section aria-labelledby="budget-sources-title" className="bg-[#f8fafc] py-16 max-sm:py-12">
      <div className="container-site">
        <div className="mb-8 text-center">
          <Label icon="link-45deg">{m.budget_sources_label()}</Label>
          <h2 id="budget-sources-title" className={heading}>
            {m.budget_sources_title()}
          </h2>
          <p className={intro}>{m.budget_sources_desc()}</p>
        </div>
        <div className="mx-auto grid max-w-175 grid-cols-[repeat(2,1fr)] gap-5 max-lg:grid-cols-1">
          {resources.map((resource) => (
            <SiteLink
              key={resource.href}
              href={resource.href}
              className="group flex items-center gap-4 rounded-[14px] border border-black/6 bg-white p-5 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(0,50,160,0.1)]"
            >
              <div className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-linear-135 from-primary to-secondary text-[1.375rem] text-white">
                <Icon name={resource.icon} />
              </div>
              <div className="flex-1">
                <h4 className="m-0 mb-0.5 text-[0.9375rem] font-semibold text-ink">
                  {resource.title}
                </h4>
                <p className="m-0 text-[0.8125rem] text-ink-light">{resource.text}</p>
              </div>
              <Icon
                name="arrow-up-right"
                aria-hidden="true"
                className="-translate-x-1 text-[1rem] text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
              />
            </SiteLink>
          ))}
        </div>
      </div>
    </section>
  )
}
