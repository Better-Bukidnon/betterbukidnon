import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Icon, type IconName } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'
import { formatNumber } from '@/lib/utils'
import { m } from '@/paraglide/messages'
import type { Barangay, Lgu } from './data'
import { directoryPaths } from './paths'

const services: { icon: IconName; title: () => string; text: () => string }[] = [
  {
    icon: 'file-earmark-check-fill',
    title: m.dir_service_clearance,
    text: m.dir_service_clearance_text,
  },
  {
    icon: 'award-fill',
    title: m.dir_service_certification,
    text: m.dir_service_certification_text,
  },
  { icon: 'people-fill', title: m.dir_service_mediation, text: m.dir_service_mediation_text },
  { icon: 'heart-pulse-fill', title: m.dir_service_health, text: m.dir_service_health_text },
  {
    icon: 'shield-fill-exclamation',
    title: m.dir_service_disaster,
    text: m.dir_service_disaster_text,
  },
  { icon: 'stars', title: m.dir_service_youth, text: m.dir_service_youth_text },
]

export function BarangayProfilePage({ barangay, lgu }: { barangay: Barangay; lgu: Lgu }) {
  const seal = (barangay.seal.path || lgu.seal.path).split('/').at(-1)
  const leader = barangay.leadership.punong_barangay
  const population = barangay.population.value
    ? formatNumber(barangay.population.value)
    : m.dir_profile_population_unavailable()
  return (
    <>
      <Breadcrumbs
        items={[
          { label: m.nav_home(), link: { to: '/' } },
          { label: m.nav_government(), link: { to: '/government' } },
          { label: m.dir_barangays(), link: { to: '/barangays' } },
          { label: barangay.name },
        ]}
      />
      <section className="bg-linear-135 from-primary to-primary-dark py-7 text-white">
        <div className="container-site flex items-center gap-5 max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-3.5">
          <div className="flex size-[84px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/35 bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
            {seal ? (
              <img src={`/images/seals/${seal}`} alt="" className="size-full object-contain" />
            ) : (
              <Icon name="geo-alt-fill" className="text-[2rem] text-primary" />
            )}
          </div>
          <div>
            <div className="mb-1.5 flex flex-wrap gap-2">
              <SiteLink
                href={directoryPaths.lgu(lgu.slug)}
                className="inline-flex items-center gap-1.25 rounded-full border border-white/24 bg-white/16 px-2.5 py-0.75 text-[0.72rem] font-bold text-white no-underline hover:text-white"
              >
                <Icon name="building" /> {lgu.name}
              </SiteLink>
              <Pill icon="diagram-3">{m.dir_district({ count: barangay.district })}</Pill>
              <Pill icon="hash">PSGC {barangay.psgc_code}</Pill>
            </div>
            <h1 className="mb-1 text-[1.9rem] leading-[1.2] text-white">
              {m.dir_profile_barangay_name({ name: barangay.name })}
            </h1>
            <p className="mb-1 text-[0.84rem] font-medium text-white/85">
              {m.dir_profile_barangay_location({ lgu: lgu.name })}
            </p>
            <p className="mb-0 max-w-205 text-[0.9rem] leading-[1.55] text-white/94">
              {barangay.introduction}
            </p>
          </div>
        </div>
      </section>
      <section className="section-y">
        <div className="container-site">
          <Header
            icon="bar-chart-line-fill"
            title={m.dir_profile_barangay_overview()}
            text={m.dir_profile_barangay_overview_text({ name: barangay.name })}
            action={
              <SiteLink
                href={directoryPaths.lgu(lgu.slug)}
                className="inline-flex items-center gap-1.5 rounded-site border-2 border-primary px-3 py-1.5 text-[0.8125rem] font-semibold text-primary no-underline"
              >
                <Icon name="arrow-left" /> {lgu.name} {m.dir_view_profile()}
              </SiteLink>
            }
          />
          <div className="grid grid-cols-4 gap-3.5 max-lg:grid-cols-2 max-[640px]:grid-cols-1">
            <Metric
              icon="building"
              label={m.dir_lgu_filter()}
              value={lgu.name}
              note={`LGU PSGC: ${barangay.lgu_psgc}`}
            />
            <Metric
              icon="person-badge-fill"
              label={m.dir_profile_punong_barangay()}
              value={leader?.name ?? m.dir_profile_leadership_pending()}
              note={barangay.leadership.term}
            />
            <Metric
              icon="people-fill"
              label={m.dir_population({
                year: barangay.population.year ?? lgu.population.latest_year,
              })}
              value={population}
              note={
                barangay.population.value
                  ? m.dir_profile_psgc_dataset()
                  : m.dir_profile_population_lgu_total()
              }
            />
            <Metric
              icon="diagram-3-fill"
              label={m.dir_legislative_district()}
              value={m.dir_district({ count: barangay.district })}
              note={`PSGC ${barangay.psgc_code}`}
            />
          </div>
        </div>
      </section>
      <section className="section-y bg-surface-alt">
        <div className="container-site">
          <Header
            icon="person-badge-fill"
            title={m.dir_profile_barangay_leadership({ term: barangay.leadership.term })}
            text={m.dir_profile_barangay_leadership_text()}
          />
          <article className="max-w-160 rounded-xl border border-black/8 border-t-[3px] border-t-primary bg-white px-[18px] py-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
            <span className="inline-flex rounded-full bg-primary/8 px-2.5 py-0.75 text-[0.72rem] font-bold text-primary">
              {m.dir_profile_punong_barangay()}
            </span>
            <h2 className="mb-0.5 mt-1 text-[1rem] text-primary">
              {leader?.name ?? m.dir_profile_leadership_pending()}
            </h2>
            <p className="mb-0 text-[0.8125rem] text-ink-light">
              {leader?.position ?? m.dir_profile_leadership_pending()}
            </p>
          </article>
        </div>
      </section>
      <section className="section-y">
        <div className="container-site">
          <Header
            icon="briefcase-fill"
            title={m.dir_profile_barangay_services()}
            text={m.dir_profile_barangay_services_text({ name: barangay.name })}
          />
          <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-[640px]:grid-cols-1">
            {services.map((service) => (
              <article
                key={service.icon}
                className="flex gap-3 rounded-xl border border-black/8 border-t-[3px] border-t-primary/75 bg-white px-[18px] py-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)]"
              >
                <Icon name={service.icon} className="text-[1.2rem] text-primary" />
                <div>
                  <h2 className="mb-0.5 text-[1rem] text-primary">{service.title()}</h2>
                  <p className="mb-0 text-[0.8125rem] leading-[1.45] text-ink-light">
                    {service.text()}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-y bg-surface-alt">
        <div className="container-site">
          <Header
            icon="journal-check"
            title={m.dir_profile_references()}
            text={m.dir_profile_references_description()}
          />
          {barangay.sources.map((source) => (
            <article
              key={source.url}
              className="mb-2 rounded-site border border-black/8 bg-white px-3.5 py-3"
            >
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary"
              >
                {source.agency}: {source.title} <Icon name="box-arrow-up-right" />
              </a>
              <p className="mb-0 mt-0.5 text-[0.8125rem] text-ink-light">{source.scope}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
function Pill({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.25 rounded-full border border-white/24 bg-white/16 px-2.5 py-0.75 text-[0.72rem] font-bold text-white">
      <Icon name={icon} /> {children}
    </span>
  )
}
function Header({
  icon,
  title,
  text,
  action,
}: {
  icon: IconName
  title: string
  text: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-[18px] flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="mb-0.75 flex items-center gap-2 text-[1.3rem] text-ink">
          <Icon name={icon} className="text-primary" /> {title}
        </h2>
        <p className="mb-0 text-[0.84rem] text-ink-light">{text}</p>
      </div>
      {action}
    </div>
  )
}
function Metric({
  icon,
  label,
  value,
  note,
}: {
  icon: IconName
  label: string
  value: string
  note: string
}) {
  return (
    <article className="flex gap-3 rounded-xl border border-black/8 border-t-[3px] border-t-primary bg-white px-[18px] py-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <Icon name={icon} className="text-[1.15rem] text-primary" />
      <div>
        <p className="mb-0.5 text-[0.7rem] font-bold uppercase text-ink-light">{label}</p>
        <p className="mb-0 text-[1.05rem] font-extrabold text-ink">{value}</p>
        <p className="mb-0 text-[0.75rem] text-ink-light">{note}</p>
      </div>
    </article>
  )
}
