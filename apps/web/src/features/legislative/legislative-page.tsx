import { useState } from 'react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { legacyNote as note } from '@/components/layout/legacy'
import { PatternHero } from '@/components/layout/pattern-hero'
import { Icon, type IconName } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'
import { contactDirectory } from '@/config/contact'
import { officials } from '@/features/government/data'
import { districts } from '@/features/government/districts'
import type { Message } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { m } from '@/paraglide/messages'

/*
 * The Legislative page, reproducing legacy legislative/index.html and assets/css/legislative.css:
 * the hero, the two framework cards, the Sangguniang Panlalawigan members, the ordinance and
 * resolution process flows (tabs), and two explainer sections.
 */

const exOfficioRoles: Record<string, Message> = {
  abc: m.leg_role_abc_president,
  pcl: m.leg_role_pcl_president,
  sk: m.leg_role_sk_president,
  ipmr: m.leg_role_ipmr,
}

type FlowStep = { title: Message; text: Message }

const ordinanceSteps: FlowStep[] = [
  {
    title: m.leg_file_proposed_ordinance,
    text: m.leg_submit_the_proposed_ordinance_to_the_sangguniang,
  },
  {
    title: m.leg_first_reading_referral_to_committee,
    text: m.leg_initial_reading_and_assignment_to_the_relevant,
  },
  {
    title: m.leg_public_hearing_committee_action,
    text: m.leg_committee_conducts_public_hearing_and_deliberates,
  },
  { title: m.leg_committee_report, text: m.leg_committee_submits_findings_and_recommendations_to },
  { title: m.leg_second_reading, text: m.leg_detailed_discussion_and_debate_on_the_proposed },
  {
    title: m.leg_third_and_final_reading,
    text: m.leg_final_voting_on_the_proposed_ordinance_by_the,
  },
  { title: m.leg_presented_to_the_governor, text: m.leg_presented_to_the_governor_desc },
  { title: m.leg_governor_approval_or_veto, text: m.leg_governor_approval_or_veto_desc },
  { title: m.leg_veto_override, text: m.leg_veto_override_desc },
  { title: m.leg_posting_publication, text: m.leg_public_posting_and_publication_of_the_approved },
  { title: m.leg_takes_effect, text: m.leg_ordinance_takes_effect_and_is_enforced_within_the },
]

const resolutionSteps: FlowStep[] = [
  {
    title: m.leg_file_proposed_resolution,
    text: m.leg_submit_the_proposed_resolution_to_the_sangguniang,
  },
  {
    title: m.leg_inclusion_in_session_agenda,
    text: m.leg_resolution_is_scheduled_for_inclusion_in_the,
  },
  {
    title: m.leg_committee_meeting_approval,
    text: m.leg_committee_reviews_and_approves_the_proposed,
  },
  { title: m.leg_approval_in_session, text: m.leg_approval_in_session_desc },
  { title: m.leg_official_signing, text: m.leg_secretary_to_the_sanggunian_and_presiding_officer },
  {
    title: m.leg_posting_transmittal,
    text: m.leg_resolution_is_posted_publicly_and_transmitted_to,
  },
]

const tabs = [
  {
    id: 'ordinances',
    icon: 'journal-bookmark-fill',
    label: m.leg_for_ordinances,
    steps: ordinanceSteps,
  },
  {
    id: 'resolutions',
    icon: 'file-earmark-ruled-fill',
    label: m.leg_for_resolutions,
    steps: resolutionSteps,
  },
] as const

type InfoCardData = { icon: IconName; title: Message; text: Message }

const relationCards: InfoCardData[] = [
  { icon: 'bank', title: m.leg_relation_who_title, text: m.leg_relation_who_desc },
  { icon: 'search', title: m.leg_relation_review_title, text: m.leg_relation_review_desc },
  { icon: 'check2-circle', title: m.leg_relation_outcome_title, text: m.leg_relation_outcome_desc },
  { icon: 'house-door', title: m.leg_relation_barangay_title, text: m.leg_relation_barangay_desc },
]

const aboutCards: InfoCardData[] = [
  {
    icon: 'journal-bookmark',
    title: m.leg_ordinances,
    text: m.leg_local_laws_with_permanent_and_general_application,
  },
  {
    icon: 'file-earmark-text',
    title: m.leg_resolutions,
    text: m.leg_expressions_of_the_legislative_bodys_will_or,
  },
  { icon: 'people', title: m.leg_public_participation, text: m.leg_public_participation_desc },
  { icon: 'shield-check', title: m.leg_transparency, text: m.leg_transparency_desc },
]

export function LegislativePage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: m.leg_home(), link: { to: '/' } }, { label: m.nav_legislative() }]}
      />
      <PatternHero
        tabletStep
        icon="bank2"
        badge={m.leg_sangguniang_bayan()}
        title={m.leg_legislative_documents()}
        subtitle={m.leg_ordinances_and_resolutions_of_the_sangguniang()}
      />
      <Frameworks />
      <Members />
      <Process />
      <section className="bg-surface-alt py-15 max-[769px]:py-10">
        <div className="container-site">
          <SectionHeader
            icon="diagram-2-fill"
            tag={m.leg_relation_tag()}
            title={m.leg_relation_title()}
            id="leg-relation-title"
          >
            {m.leg_relation_desc()}
          </SectionHeader>
          <div className="grid grid-cols-[repeat(2,1fr)] gap-3 max-[769px]:grid-cols-1">
            {relationCards.map((card) => (
              <InfoCard key={card.icon} card={card} />
            ))}
          </div>
          <p className={note}>
            <SiteLink href="/government#lgus" className="text-primary">
              <Icon name="arrow-right" /> <span>{m.leg_see_lgu_list()}</span>
            </SiteLink>
          </p>
        </div>
      </section>
      <section className="py-15 max-[769px]:py-10">
        <div className="container-site">
          <SectionHeader
            icon="info-circle-fill"
            tag={m.leg_about()}
            title={m.leg_understanding_local_legislation()}
          >
            {m.leg_learn_about_the_legislative_process_of_the()}
          </SectionHeader>
          <div className="grid grid-cols-[repeat(4,1fr)] gap-3 max-xl:grid-cols-[repeat(2,1fr)] max-[769px]:gap-2.5 max-sm:grid-cols-1">
            {aboutCards.map((card) => (
              <InfoCard key={card.icon} card={card} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Frameworks() {
  const cards = [
    {
      href: '/legislative/ordinance-framework',
      icon: 'journal-bookmark-fill',
      title: m.leg_ordinance_framework(),
      text: m.leg_provincial_ordinances_enacted_by_the_sangguniang(),
      link: m.leg_browse_ordinances(),
    },
    {
      href: '/legislative/resolution-framework',
      icon: 'file-earmark-ruled-fill',
      title: m.leg_resolution_framework(),
      text: m.leg_resolutions_passed_by_the_sp(),
      link: m.leg_browse_resolutions(),
    },
  ] as const
  return (
    <section className="bg-surface-alt py-20 max-[769px]:py-12">
      <div className="container-site">
        <div className="mx-auto grid max-w-225 grid-cols-[repeat(2,1fr)] gap-6 max-[769px]:grid-cols-1 max-[769px]:gap-4">
          {cards.map((card) => (
            <SiteLink
              key={card.href}
              href={card.href}
              className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-black/6 bg-white p-8 text-center text-ink no-underline transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] before:absolute before:inset-x-0 before:top-0 before:h-1 before:scale-x-0 before:bg-linear-90 before:from-primary before:to-info before:transition-transform before:duration-300 hover:-translate-y-2 hover:border-transparent hover:text-ink hover:no-underline hover:shadow-[0_16px_48px_rgba(0,50,160,0.15)] hover:before:scale-x-100 max-[769px]:p-6 max-sm:p-5"
            >
              <div className="mb-6 flex size-18 items-center justify-center rounded-[20px] bg-linear-135 from-primary to-secondary text-[2rem] text-white transition-transform duration-300 group-hover:scale-110 max-[769px]:mb-4 max-[769px]:size-15 max-[769px]:text-[1.5rem] max-sm:mb-3 max-sm:size-13 max-sm:rounded-[14px] max-sm:text-[1.25rem]">
                <Icon name={card.icon} />
              </div>
              <div>
                <h2 className="mb-3 text-[1.375rem] font-bold text-ink max-[769px]:text-[1.25rem] max-sm:mb-2 max-sm:text-[1.125rem]">
                  {card.title}
                </h2>
                <p className="mb-5 text-[0.9375rem] leading-[1.6] text-ink-light max-sm:mb-4 max-sm:text-[0.875rem]">
                  {card.text}
                </p>
                <span className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-primary transition-[gap] duration-300 group-hover:gap-3">
                  <Icon
                    name="arrow-right"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                  <span>{card.link}</span>
                </span>
              </div>
            </SiteLink>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Legacy `.leg-info-header` (and `.leg-process-header`): a tag, a heading and an intro. */
function SectionHeader({
  icon,
  tag,
  title,
  id,
  smallFrom = 769,
  children,
}: {
  icon: IconName
  tag: string
  title: string
  id?: string
  /** The width (exclusive) below which the heading shrinks to 1.25rem. */
  smallFrom?: 769 | 576
  children: React.ReactNode
}) {
  return (
    <div className="mb-8 text-center">
      <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-[5px] text-[0.75rem] font-semibold text-primary">
        <Icon name={icon} />
        <span>{tag}</span>
      </span>
      <h2
        id={id}
        className={cn(
          'mb-1.5 text-[1.5rem] text-ink',
          smallFrom === 769 ? 'max-[769px]:text-[1.25rem]' : 'max-sm:text-[1.25rem]',
        )}
      >
        {title}
      </h2>
      <p className="m-0 text-[0.9375rem] text-ink-light">{children}</p>
    </div>
  )
}

function Members() {
  const groups: {
    icon: IconName
    title: string
    description: string
    members: { name: string; role?: string }[]
  }[] = [
    {
      icon: 'person-badge',
      title: m.leg_presiding_officer(),
      description: m.leg_presiding_officer_desc(),
      members: [{ name: officials.vice_governor.name, role: m.leg_role_vice_governor() }],
    },
    ...districts.map((district) => ({
      icon: 'geo-alt' as const,
      title: district.label(),
      description: district.lguNames,
      members: district.boardMembers.map((member) => ({ name: member.name })),
    })),
    {
      icon: 'person-lines-fill',
      title: m.leg_ex_officio_members(),
      description: m.leg_ex_officio_desc(),
      members: officials.ex_officio.map((member) => ({
        name: member.name,
        role: exOfficioRoles[member.id]?.() ?? member.seat,
      })),
    },
  ]
  return (
    <section className="py-15 max-[769px]:py-10">
      <div className="container-site">
        <SectionHeader
          icon="people-fill"
          tag={m.leg_members_tag()}
          title={m.leg_members_title()}
          id="leg-members-title"
        >
          {m.leg_members_desc()}
        </SectionHeader>
        <div className="grid grid-cols-[repeat(3,1fr)] gap-3 max-xl:grid-cols-[repeat(2,1fr)] max-[769px]:grid-cols-1">
          {groups.map((group) => (
            <div key={group.title} className="rounded-site border border-black/6 bg-white p-4">
              <h3 className="mb-1 flex items-center gap-2 text-[0.9375rem] font-semibold text-ink">
                <Icon name={group.icon} className="text-primary" />
                <span>{group.title}</span>
              </h3>
              <p className="mb-3 mt-0 text-[0.8125rem] leading-[1.5] text-ink-light">
                {group.description}
              </p>
              <ul className="m-0 list-none p-0">
                {group.members.map((member) => (
                  <li
                    key={member.name}
                    className="flex flex-col gap-0.5 border-t border-black/6 py-2 text-[0.875rem] text-ink first:border-t-0 first:pt-0"
                  >
                    {member.name}
                    {member.role && (
                      <span className="text-[0.75rem] text-ink-light">{member.role}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className={note}>
          <span>{m.leg_members_note()}</span>{' '}
          <SiteLink href={contactDirectory.website} className="text-primary">
            bukidnon.gov.ph
          </SiteLink>
        </p>
      </div>
    </section>
  )
}

function Process() {
  const [active, setActive] = useState<(typeof tabs)[number]['id']>('ordinances')
  return (
    <section className="bg-surface-alt py-15 max-[769px]:py-10">
      <div className="container-site">
        <SectionHeader
          icon="diagram-3-fill"
          tag={m.leg_process_flow()}
          title={m.leg_flowchart_for_legislative_proposal()}
          smallFrom={576}
        >
          {m.leg_stepbystep_process_for_enacting_ordinances_and()}
        </SectionHeader>
        <div
          role="tablist"
          className="mb-8 flex justify-center gap-3 max-[769px]:mx-auto max-[769px]:max-w-80 max-[769px]:flex-col max-[769px]:items-stretch max-[769px]:gap-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tab.id === active}
              aria-controls={tab.id}
              onClick={() => setActive(tab.id)}
              className="group flex cursor-pointer items-center gap-2.5 rounded-site border border-black/8 bg-white px-6 py-3 leading-[normal] transition-all duration-200 [font-family:revert] hover:border-primary aria-selected:border-primary aria-selected:bg-primary max-[769px]:justify-center max-[769px]:px-5 max-[769px]:py-2.5"
            >
              <Icon
                name={tab.icon}
                className="text-[1.125rem] text-ink-light group-aria-selected:text-white"
              />
              <span className="text-[0.9375rem] font-semibold text-ink group-aria-selected:text-white">
                {tab.label()}
              </span>
              {/* English-only, as on the legacy page. */}
              <small className="rounded-[10px] bg-black/4 px-2 py-0.5 text-[0.75rem] text-ink-light group-aria-selected:bg-white/20 group-aria-selected:text-white">
                {tab.steps.length} Steps
              </small>
            </button>
          ))}
        </div>
        {tabs.map((tab) => (
          <div key={tab.id} id={tab.id} role="tabpanel" hidden={tab.id !== active}>
            <div className="grid grid-cols-[repeat(4,1fr)] gap-3 max-xl:grid-cols-[repeat(3,1fr)] max-[769px]:grid-cols-[repeat(2,1fr)] max-[769px]:gap-2.5 max-sm:grid-cols-1">
              {tab.steps.map((step, i) => {
                const final = i === tab.steps.length - 1
                return (
                  <div key={step.title()} className="flex">
                    <div
                      className={cn(
                        'relative flex flex-1 flex-col rounded-site border px-3.5 pb-3.5 pt-4 transition-all duration-200 hover:shadow-[0_2px_12px_rgba(0,50,160,0.08)] max-[769px]:px-3 max-[769px]:pb-3 max-[769px]:pt-3.5 max-sm:flex-row max-sm:items-start max-sm:gap-3 max-sm:p-3',
                        final
                          ? 'border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.03)] hover:border-success'
                          : 'border-black/6 bg-white hover:border-primary',
                      )}
                    >
                      <div
                        className={cn(
                          'mb-2.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md text-[0.6875rem] font-bold text-white max-sm:mb-0 max-sm:mt-0.5',
                          final ? 'bg-success' : 'bg-primary',
                        )}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <h4 className="mb-1 text-[0.8125rem] font-semibold leading-[1.3] text-ink max-[769px]:text-[0.75rem] max-sm:text-[0.8125rem]">
                        {step.title()}
                      </h4>
                      <p className="m-0 flex-1 text-[0.75rem] leading-[1.4] text-ink-light max-[769px]:text-[0.6875rem] max-sm:text-[0.75rem]">
                        {step.text()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/** Legacy `.leg-info-card`: an icon square, a title and a short text. */
function InfoCard({ card }: { card: InfoCardData }) {
  return (
    <div className="flex flex-col rounded-site border border-black/6 bg-white p-4 text-left transition-all duration-200 hover:border-primary hover:shadow-[0_2px_12px_rgba(0,50,160,0.08)] max-[769px]:p-3.5 max-sm:flex-row max-sm:items-start max-sm:gap-3 max-sm:p-3">
      <div className="mb-3 flex size-9 items-center justify-center rounded-site bg-primary text-[1rem] text-white max-[769px]:mb-2.5 max-[769px]:size-8 max-[769px]:text-[0.875rem] max-sm:mb-0 max-sm:shrink-0">
        <Icon name={card.icon} />
      </div>
      <h3 className="mb-1.5 text-[0.875rem] font-semibold text-ink max-[769px]:text-[0.8125rem]">
        {card.title()}
      </h3>
      <p className="m-0 flex-1 text-[0.75rem] leading-[1.5] text-ink-light max-[769px]:text-[0.6875rem] max-sm:text-[0.75rem]">
        {card.text()}
      </p>
    </div>
  )
}
