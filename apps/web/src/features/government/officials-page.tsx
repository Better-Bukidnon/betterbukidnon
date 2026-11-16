import { Fragment } from 'react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { legacyCard, legacyGrid } from '@/components/layout/legacy'
import { Icon } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'
import { cn } from '@/lib/utils'
import { m } from '@/paraglide/messages'
import { officials } from './data'

/*
 * The Elected Officials page, reproducing legacy government/officials.html with the markup
 * assets/js/officials.js rendered there from data/officials.json. It is prerendered here, so
 * the list shows without JavaScript.
 */

// English-only on purpose: the legacy page showed these untranslated. The translated
// gov_district_* labels are the Government page's.
const districts = [
  m.officials_district_1,
  m.officials_district_2,
  m.officials_district_3,
  m.officials_district_4,
]
const districtLabel = (district: number) => districts[district - 1]?.() ?? ''

const boardByDistrict = [...new Set(officials.board_members.map((member) => member.district))]
  .sort((a, b) => a - b)
  .map((district) => ({
    district,
    members: officials.board_members.filter((member) => member.district === district),
  }))
const representatives = [...officials.representatives].sort((a, b) => a.district - b.district)
const sources = officials.sources.filter((source) => source.url.startsWith('https://'))

// Legacy default .grid gaps: 32px for .grid-2 from 1200px, 16px for .grid-4 from 1025 to
// 1199px, 24px otherwise.
const grid2 = cn(legacyGrid[2], 'gap-6 min-[1200px]:gap-8')
const grid4 = cn(legacyGrid[4], 'gap-6 min-[1025px]:max-[1199px]:gap-4')
const districtHeading = 'mt-8 text-center text-[1.25rem]'
const executiveCard = cn(legacyCard, 'h-full text-center')
// Legacy .board-member-card.card.text-center: its own padding (16px 20px) wins over .card from
// 1025px up; below that the responsive .card padding applies.
const memberCard = cn(
  legacyCard,
  'h-full rounded-xl border-line px-5 py-4 text-center max-xl:p-6 max-md:p-4 max-[481px]:p-2',
)

export function OfficialsPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: m.gov_home(), link: { to: '/' } },
          { label: m.gov_government(), link: { to: '/government' } },
          { label: m.officials_breadcrumb() },
        ]}
      />
      <section className="section-y bg-surface-alt">
        <div className="container-site text-center">
          <h1>{m.officials_elected_officials()}</h1>
          <p className="text-[1.125rem] text-ink-light">
            {m.officials_meet_the_leaders_serving_the_province_of()}
          </p>
          <p>{m.officials_term_note()}</p>
        </div>
      </section>
      <section className="section-y">
        <div className="container-site">
          <Group title={m.officials_executive_branch()}>
            <div className={grid2}>
              <ExecutiveCard
                name={officials.governor.name}
                title={m.officials_provincial_governor()}
              />
              <ExecutiveCard
                name={officials.vice_governor.name}
                title={m.officials_provincial_vice_governor()}
                role={officials.vice_governor.role}
              />
            </div>
          </Group>

          <Group title={m.officials_sangguniang_bayan_members()} intro={m.officials_sp_intro()}>
            {boardByDistrict.map(({ district, members }) => (
              <div key={district}>
                <h3 className={districtHeading}>{districtLabel(district)}</h3>
                <div className={grid4}>
                  {members.map((member) => (
                    <MemberCard key={member.name} name={member.name}>
                      {m.officials_sb_member()}
                    </MemberCard>
                  ))}
                </div>
              </div>
            ))}
            <h3 className={districtHeading}>{m.officials_ex_officio_members()}</h3>
            <div className={grid4}>
              {officials.ex_officio.map((member) => (
                <MemberCard key={member.id} name={member.name}>
                  {member.seat}
                </MemberCard>
              ))}
            </div>
            <p className="mt-6 text-center text-[0.875rem] text-ink-light">
              {m.officials_ex_officio_note()}
            </p>
          </Group>

          <Group title={m.officials_house_reps()} intro={m.officials_house_reps_intro()}>
            <div className={grid4}>
              {representatives.map((rep) => (
                <MemberCard key={rep.name} name={rep.name}>
                  {districtLabel(rep.district)} · {m.officials_representative()}
                </MemberCard>
              ))}
            </div>
          </Group>

          <p className="text-center text-[0.875rem] text-ink-light">
            {m.officials_sources_label()}{' '}
            {sources.map((source, i) => (
              <Fragment key={source.url}>
                {i > 0 && '; '}
                <SiteLink href={source.url}>{source.name}</SiteLink>
              </Fragment>
            ))}
            . {m.officials_last_verified()} {officials.last_verified}
          </p>

          <p className="mt-8 text-center">
            <span>{m.officials_contacts_note()}</span>{' '}
            <SiteLink href="/government#offices">{m.officials_government_page_link()}</SiteLink>
          </p>
        </div>
      </section>
    </>
  )
}

/** One block of the page: a centred heading, an optional intro, then its cards. */
function Group({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-12">
      <h2 className="text-center">{title}</h2>
      {intro && <p className="text-center">{intro}</p>}
      {children}
    </div>
  )
}

/** Legacy `.official-card`: a large person icon, the name, the title and the role. */
function ExecutiveCard({ name, title, role }: { name: string; title: string; role?: string }) {
  return (
    <div className={executiveCard}>
      <div className="mb-6">
        <Icon
          name="person-circle"
          className="text-[6rem] text-primary max-xl:text-[5rem] max-md:text-[4rem]"
        />
      </div>
      <div>
        <h3>{name}</h3>
        <p className="mb-6 text-[0.875rem] font-semibold uppercase text-primary">{title}</p>
        {role && <p>{role}</p>}
      </div>
    </div>
  )
}

/** Legacy `.board-member-card`: a person badge icon, the name and a seat badge. */
function MemberCard({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className={memberCard}>
      <Icon name="person-badge" className="text-[3rem] text-primary" />
      <h4>{name}</h4>
      <p className="inline-block rounded px-2 py-1 text-[0.75rem] font-semibold uppercase bg-primary-tint text-info">
        {children}
      </p>
    </div>
  )
}
