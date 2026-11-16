import { Link } from '@tanstack/react-router'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import {
  legacyCard as card,
  legacyGrid as grid,
  outlineButtonSmall,
  primaryButton,
} from '@/components/layout/legacy'
import { PageHeader } from '@/components/layout/page-header'
import { Icon, type IconName } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'
import type { Message } from '@/lib/i18n'
import { cn, telHref } from '@/lib/utils'
import { m } from '@/paraglide/messages'
import { demographics, officials } from './data'

/*
 * The Provincial Government page, reproducing legacy government/index.html and the global
 * legacy CSS it uses (.section, .grid-*, .card, .executive-card, .board-member-card,
 * .dept-card, .data-table).
 */

// The labels of the four districts, in order (district n is districts[n - 1]).
const districts = [m.gov_district_1, m.gov_district_2, m.gov_district_3, m.gov_district_4]
const districtLabel = (district: number) => districts[district - 1]?.() ?? ''

const number = (value: number) => value.toLocaleString('en-US')

type Lgu = (typeof demographics.lgus)[number]
// Legacy order: the capital, then the other city, then the municipalities alphabetically.
const lguKind = (lgu: Lgu) => (lgu.capital ? 0 : lgu.type === 'city' ? 1 : 2)
const lguTypes = [m.gov_type_capital_city, m.gov_type_component_city, m.gov_type_municipality]
const lgus = [...demographics.lgus].sort(
  (a, b) => lguKind(a) - lguKind(b) || a.name.localeCompare(b.name),
)
const totalPopulation = lgus.reduce((total, lgu) => total + lgu.population_2020, 0)
const totalBarangays = lgus.reduce((total, lgu) => total + lgu.barangays, 0)

const districtSummaries = districts.map((label, i) => {
  const members = lgus.filter((lgu) => lgu.district === i + 1)
  return {
    label,
    boardMembers: officials.board_members.filter((member) => member.district === i + 1),
    representative: officials.representatives.find((rep) => rep.district === i + 1)?.name,
    lguNames: members
      .map((lgu) => lgu.name)
      .sort((a, b) => a.localeCompare(b))
      .join(', '),
    population: members.reduce((total, lgu) => total + lgu.population_2020, 0),
  }
})

type Office = {
  icon: IconName
  title: Message
  description: Message
  href?: string
  phones: { number: string; note?: Message; call?: boolean }[]
}

// Same order and numbers as the legacy page; each office links to its service guide.
const offices: Office[] = [
  {
    icon: 'heart-pulse-fill',
    title: m.gov_provincial_health_office,
    description: m.gov_pho_desc,
    href: '/service-details/provincial-health-office',
    phones: [{ number: '(088) 813-5631' }],
  },
  {
    icon: 'people-fill',
    title: m.gov_pswdo_title,
    description: m.gov_pswdo_desc,
    href: '/service-details/pswdo',
    phones: [{ number: '(088) 813-5734' }],
  },
  {
    icon: 'exclamation-triangle-fill',
    title: m.gov_pdrrmd_title,
    description: m.gov_disaster_preparedness_emergency_response_risk,
    href: '/service-details/pdrrmd',
    phones: [{ number: '(088) 813-1262' }],
  },
  {
    icon: 'cash-coin',
    title: m.gov_provincial_treasurers_office,
    description: m.gov_tax_payments_real_property_tax_revenue_collection,
    href: '/service-details/provincial-treasurer',
    phones: [{ number: '(088) 813-2474' }],
  },
  {
    icon: 'house-door-fill',
    title: m.gov_provincial_assessors_office,
    description: m.gov_property_assessment_tax_declarations_land_records,
    href: '/service-details/provincial-assessor',
    phones: [],
  },
  {
    icon: 'building-fill-gear',
    title: m.gov_provincial_engineering_office,
    description: m.gov_engineering_desc,
    href: '/service-details/provincial-engineering',
    phones: [
      { number: '(088) 813-3656' },
      { number: '(088) 813-3688', note: m.gov_peo_waterworks },
    ],
  },
  {
    icon: 'tree-fill',
    title: m.gov_provincial_agriculture_office,
    description: m.gov_agriculture_desc,
    href: '/service-details/provincial-agriculture',
    phones: [],
  },
  {
    icon: 'clipboard-data-fill',
    title: m.gov_provincial_planning_development,
    description: m.gov_planning_desc,
    href: '/service-details/provincial-planning',
    phones: [{ number: '(088) 813-2564' }],
  },
  {
    icon: 'piggy-bank-fill',
    title: m.gov_provincial_budget_office,
    description: m.gov_budget_preparation_appropriations_fiscal,
    href: '/service-details/provincial-budget',
    phones: [],
  },
  {
    icon: 'calculator-fill',
    title: m.gov_provincial_accounting_office,
    description: m.gov_financial_records_disbursements_accounting,
    href: '/service-details/provincial-accounting',
    phones: [],
  },
  {
    icon: 'gear-fill',
    title: m.gov_provincial_general_services_office,
    description: m.gov_property_management_procurement_administration,
    href: '/service-details/provincial-general-services',
    phones: [],
  },
  {
    icon: 'person-badge-fill',
    title: m.gov_human_resource_management,
    description: m.gov_personnel_services_recruitment_employee_records,
    href: '/service-details/human-resource-management',
    phones: [],
  },
  {
    icon: 'pc-display',
    title: m.gov_pictd_title,
    description: m.gov_pictd_desc,
    phones: [{ number: '(088) 813-1603', call: true }],
  },
]

const exOfficioStyle: Record<string, { label: Message; badge: string }> = {
  abc: {
    label: m.gov_liga_ng_mga_barangay_president,
    badge: 'bg-[rgba(247,127,0,0.12)] text-[#8a4200]',
  },
  pcl: { label: m.gov_pcl_president, badge: '' },
  sk: { label: m.gov_sk_federation_president, badge: 'bg-[rgba(6,167,125,0.12)] text-[#04664d]' },
  ipmr: { label: m.gov_ipmr, badge: 'bg-[rgba(124,58,237,0.1)] text-[#5b21b6]' },
}

const jumpLinks = [
  ['#leadership', m.gov_jump_leadership],
  ['#provincial-board', m.gov_jump_board],
  ['#offices', m.gov_jump_offices],
  ['#districts', m.gov_jump_districts],
  ['#lgus', m.gov_jump_lgus],
] as const

export function GovernmentPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: m.nav_home(), link: { to: '/' } }, { label: m.nav_government() }]}
      />
      <PageHeader
        badge={m.gov_government()}
        icon="building-fill"
        title={m.gov_title()}
        description={m.gov_subtitle()}
      />
      <div className="container-site">
        <nav aria-label={m.gov_on_this_page()} className="my-6 flex flex-wrap justify-center gap-2">
          {jumpLinks.map(([href, label]) => (
            <a key={href} href={href} className={outlineButtonSmall}>
              {label()}
            </a>
          ))}
        </nav>
      </div>
      <Leadership />
      <ProvincialBoard />
      <Offices />
      <Districts />
      <Lgus />
    </>
  )
}

/** The centred badge, heading and intro that open each section. */
const toneGradient = {
  primary: 'from-primary to-secondary',
  success: 'from-success to-[#05c793]',
  info: 'from-info to-[#0099cc]',
} as const

function SectionIntro({
  icon,
  badge,
  tone,
  title,
  children,
}: {
  icon: IconName
  badge: string
  tone: keyof typeof toneGradient
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="mb-12 text-center">
      <span
        className={cn(
          'mb-4 inline-flex items-center gap-2 rounded-full bg-linear-135 px-5 py-2 text-[0.875rem] text-white',
          toneGradient[tone],
        )}
      >
        <Icon name={icon} />
        <span>{badge}</span>
      </span>
      <h2 className="mb-2 text-[1.75rem]">{title}</h2>
      {children}
    </div>
  )
}

const introNarrow = 'mx-auto my-0 max-w-180 text-ink-light'

function Leadership() {
  const leaders = [
    {
      badge: m.title_governor(),
      official: officials.governor,
      role: m.gov_governor_role(),
      phone: '(088) 813-2457',
      line: m.gov_pgo_line(),
    },
    {
      badge: m.title_vice_governor(),
      official: officials.vice_governor,
      role: m.gov_vice_governor_role(),
      phone: '(088) 813-5741',
      line: m.gov_capitol_main_line(),
    },
  ]
  const contact =
    'flex items-center gap-2.5 rounded-site bg-surface-alt px-3 py-2.5 text-[0.875rem] text-ink no-underline transition-all duration-200 [&_i]:text-[1rem] [&_i]:text-primary'
  return (
    <section id="leadership" className="section-y bg-surface-alt">
      <div className="container-site">
        <SectionIntro
          icon="star-fill"
          badge={m.gov_executive_branch()}
          tone="primary"
          title={m.gov_executive()}
        >
          <p className="text-ink-light">{m.gov_executive_term()}</p>
        </SectionIntro>
        <div className={cn(grid[2], 'gap-8')}>
          {leaders.map((leader) => (
            <div
              key={leader.badge}
              className="overflow-hidden rounded-xl border border-line bg-white transition-all duration-200 hover:border-primary hover:shadow-[0_4px_16px_rgba(0,50,160,0.1)]"
            >
              <div className="bg-linear-135 from-primary to-secondary px-8 py-6 text-center">
                <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.5px] text-white">
                  {leader.badge}
                </span>
                <h3 className="m-0 text-[1.25rem] font-semibold text-white">
                  {leader.official.name}
                </h3>
              </div>
              <div className="px-8 py-6">
                <p className="text-[0.875rem] text-ink-light">{leader.role}</p>
                <div className="flex flex-col gap-2">
                  <a
                    href={telHref(leader.phone)}
                    className={cn(contact, 'hover:bg-primary/8 hover:text-ink hover:no-underline')}
                  >
                    <Icon name="telephone" />
                    {leader.phone}
                    <small className="text-[smaller]">{leader.line}</small>
                  </a>
                  <span className={contact}>
                    <Icon name="clock" />
                    Mon-Fri: 8:00 AM - 5:00 PM
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link to="/government/officials" className={primaryButton}>
            <Icon name="people-fill" /> <span>{m.gov_see_all_officials()}</span>
          </Link>
        </p>
      </div>
    </section>
  )
}

const memberCard = 'rounded-xl border border-line bg-white px-5 py-4 max-md:px-4 max-md:py-3'
const memberBadge =
  'inline-block rounded-full bg-primary/8 px-3 py-1 text-[0.8125rem] font-semibold leading-[1.4] text-primary'

function ProvincialBoard() {
  return (
    <section id="provincial-board" className="section-y">
      <div className="container-site">
        <SectionIntro
          icon="people-fill"
          badge={m.gov_legislative_branch()}
          tone="success"
          title={m.gov_sb_members()}
        >
          <p className={introNarrow}>{m.gov_sb_subtitle()}</p>
        </SectionIntro>
        <h3 className="mb-6 text-center text-[1.25rem]">{m.gov_board_members_by_district()}</h3>
        <div className={cn(grid[4], 'gap-6')}>
          {districtSummaries.map((district) => (
            <div key={district.label()} className={memberCard}>
              <span className={cn(memberBadge, 'mb-1.5')}>{district.label()}</span>
              <ul className="m-0 list-none p-0">
                {district.boardMembers.map((member) => (
                  <li
                    key={member.name}
                    className="m-0 py-2.5 font-medium text-ink not-first:border-t not-first:border-[#f0f1f3] max-md:py-1.75"
                  >
                    {member.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <h3 className="mb-6 mt-12 text-center text-[1.25rem]">{m.gov_ex_officio_members()}</h3>
        <div className={cn(grid[4], 'gap-6')}>
          {officials.ex_officio.map((member) => {
            const seat = exOfficioStyle[member.id]
            return (
              <div key={member.id} className={memberCard}>
                <p className="m-0 font-medium text-ink">{member.name}</p>
                <span className={cn(memberBadge, 'mt-2.5 max-md:mt-1.5', seat?.badge)}>
                  {seat ? seat.label() : member.seat}
                </span>
              </div>
            )
          })}
        </div>
        <p className="mt-6 text-center text-[0.875rem] text-ink-light">{m.gov_ex_officio_note()}</p>
      </div>
    </section>
  )
}

function Offices() {
  return (
    <section id="offices" className="section-y bg-surface-alt">
      <div className="container-site">
        <SectionIntro
          icon="building-fill"
          badge={m.gov_provincial_offices()}
          tone="info"
          title={m.gov_departments()}
        >
          <p className="text-ink-light">{m.gov_dept_subtitle()}</p>
          <p className="mx-auto mb-0 mt-2 max-w-180 text-[0.875rem] text-ink-light">
            {m.gov_offices_phone_note()}
          </p>
        </SectionIntro>
        <div className={cn(grid[3], 'gap-6')}>
          {offices.map((office) => (
            <OfficeCard key={office.icon} office={office} />
          ))}
        </div>
        <div className={cn(card, 'mt-12')}>
          <h3 className="mb-2 text-[1.125rem]">
            <Icon name="signpost-split-fill" className="text-primary" />{' '}
            <span>{m.gov_lgu_services_title()}</span>
          </h3>
          <p className="text-ink-light">{m.gov_lgu_services_desc()}</p>
          <ul className="mb-0 mt-2 pl-5">
            <li>
              <SiteLink href="/service-details/civil-registrar">
                {m.gov_link_civil_registration()}
              </SiteLink>
            </li>
            <li>
              <SiteLink href="/service-details/business-permits-licensing">
                {m.gov_link_business_permits()}
              </SiteLink>
            </li>
            <li>
              <a href="#lgus">{m.gov_link_find_your_lgu()}</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function OfficeCard({ office }: { office: Office }) {
  const body = (
    <>
      <div className="flex min-h-full w-15 shrink-0 items-center justify-center bg-linear-135 from-primary to-secondary text-[1.5rem] text-white">
        <Icon name={office.icon} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3 className="m-0 text-[1rem] font-semibold text-ink transition-colors group-hover:text-primary">
          {office.title()}
        </h3>
        <p className="m-0 text-[0.8125rem] leading-[1.4] text-ink-light">{office.description()}</p>
        {office.phones.length > 0 && (
          <div className="mt-auto flex flex-col gap-1">
            {office.phones.map((phone) => {
              // Legacy links the number only where the office has no services page.
              const Line = phone.call ? 'a' : 'span'
              return (
                <Line
                  key={phone.number}
                  href={phone.call ? telHref(phone.number) : undefined}
                  className={cn(
                    'flex items-center gap-1.5 text-[0.8125rem] text-ink',
                    phone.call &&
                      'no-underline transition-colors hover:text-primary hover:no-underline',
                  )}
                >
                  <Icon name="telephone" className="text-[0.75rem] text-primary" /> {phone.number}
                  {phone.note && (
                    <>
                      {' '}
                      <small className="text-[smaller]">{phone.note()}</small>
                    </>
                  )}
                </Line>
              )
            })}
          </div>
        )}
        {office.href && (
          <span className="mt-2 inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-primary transition-[gap] duration-200 group-hover:gap-2">
            <Icon name="arrow-right" /> <span>{m.gov_view_services()}</span>
          </span>
        )}
      </div>
    </>
  )
  const frame =
    'flex overflow-hidden rounded-xl border border-line bg-white transition-all duration-200 hover:border-primary hover:shadow-[0_4px_16px_rgba(0,50,160,0.1)]'
  return office.href ? (
    <SiteLink
      href={office.href}
      className={cn(
        frame,
        'group cursor-pointer text-inherit no-underline hover:text-inherit hover:no-underline',
      )}
    >
      {body}
    </SiteLink>
  ) : (
    <div className={frame}>{body}</div>
  )
}

function Districts() {
  return (
    <section id="districts" className="section-y">
      <div className="container-site">
        <SectionIntro
          icon="map-fill"
          badge={m.gov_districts_badge()}
          tone="primary"
          title={m.gov_districts_title()}
        >
          <p className={introNarrow}>{m.gov_districts_subtitle()}</p>
        </SectionIntro>
        <div className={cn(grid[2], 'gap-6')}>
          {districtSummaries.map((district) => (
            <div key={district.label()} className={card}>
              <h3 className="mb-2 text-[1.125rem] text-primary">{district.label()}</h3>
              <p className="mb-2">
                <strong>{m.gov_representative()}</strong>: {district.representative}
              </p>
              <p className="mb-2">
                <strong>{m.gov_member_lgus()}</strong>: {district.lguNames}
              </p>
              <p className="m-0 text-ink-light">
                <strong>{m.gov_population_2020()}</strong>: {number(district.population)}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[0.875rem] text-ink-light">
          <span>{m.gov_districts_source()}</span>{' '}
          <SiteLink href="https://en.wikipedia.org/wiki/Legislative_districts_of_Bukidnon">
            {m.gov_districts_source_link()}
          </SiteLink>
        </p>
      </div>
    </section>
  )
}

function Lgus() {
  // Legacy .data-table: every th, including row headers, is white on blue.
  const cell = 'border-b border-surface-alt p-4 text-left max-md:p-2'
  const head = cn(cell, 'bg-primary font-semibold text-white')
  return (
    <section id="lgus" className="section-y bg-surface-alt">
      <div className="container-site">
        <SectionIntro
          icon="geo-alt-fill"
          badge={m.gov_lgus_badge()}
          tone="success"
          title={m.gov_lgus_title()}
        >
          <p className={introNarrow}>{m.gov_lgus_subtitle()}</p>
        </SectionIntro>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse overflow-hidden rounded-site bg-white max-md:text-[0.875rem] [&_tbody_tr:hover]:bg-surface-alt">
            <caption className="sr-only">{m.gov_lgus_caption()}</caption>
            <thead>
              <tr>
                <th className={head}>{m.gov_th_lgu()}</th>
                <th className={head}>{m.gov_th_type()}</th>
                <th className={head}>{m.gov_th_district()}</th>
                <th className={cn(head, 'text-right')}>{m.gov_th_population_2020()}</th>
                <th className={cn(head, 'text-right')}>{m.gov_th_barangays()}</th>
              </tr>
            </thead>
            <tbody>
              {lgus.map((lgu) => (
                <tr key={lgu.name}>
                  <th scope="row" className={head}>
                    {lgu.name}
                  </th>
                  <td className={cell}>{lguTypes[lguKind(lgu)]?.()}</td>
                  <td className={cell}>{districtLabel(lgu.district)}</td>
                  <td className={cn(cell, 'text-right')}>{number(lgu.population_2020)}</td>
                  <td className={cn(cell, 'text-right')}>{lgu.barangays}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold">
                <th colSpan={3} scope="row" className={head}>
                  {m.gov_total_province()}
                </th>
                <td className={cn(cell, 'text-right')}>{number(totalPopulation)}</td>
                <td className={cn(cell, 'text-right')}>{totalBarangays}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-6 text-center text-[0.875rem] text-ink-light">
          <span>{m.gov_lgus_source()}</span>{' '}
          <SiteLink href="/statistics">{m.gov_lgus_more_stats()}</SiteLink>
        </p>
      </div>
    </section>
  )
}
