import { Icon, type IconName } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'
import { useReveal } from '@/lib/use-reveal'
import { cn } from '@/lib/utils'
import { m } from '@/paraglide/messages'

/* Pieces shared by the Budget page's sections (legacy assets/css/transparency-v2.css). */

/** Legacy `.sre-label` / `.infra-label-v5` / `.resources-label`: the small uppercase tag. */
export function Label({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <span className="mb-2 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.5px] text-primary">
      <Icon name={icon} /> <span>{children}</span>
    </span>
  )
}

/** Legacy section `h2`s: 1.5rem, and 1.25rem from 575px down. */
export const heading = 'mb-1 text-[1.5rem] font-bold text-ink max-sm:text-[1.25rem]'
export const intro = 'm-0 text-[0.9375rem] text-ink-light'

/** Legacy `.infra-section-v5` (and `.infra-section-alt`), which fades in on scroll. */
export function InfraSection({
  alt,
  icon,
  label,
  title,
  description,
  children,
}: {
  alt?: boolean
  icon: IconName
  label: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <RevealSection className={cn('py-16 max-sm:py-12', alt ? 'bg-surface-alt' : 'bg-white')}>
      <div className="container-site">
        <div className="mb-10 text-center">
          <Label icon={icon}>{label}</Label>
          {/* .infra-header-v5 h2 also steps down to 1.375rem from 767px. */}
          <h2 className={cn(heading, 'max-md:text-[1.375rem]')}>{title}</h2>
          <p className={intro}>{description}</p>
        </div>
        {children}
      </div>
    </RevealSection>
  )
}

/** A section with this page's `.animate-on-scroll`: 30px over 0.6s, from 50px above the fold. */
export function RevealSection({
  className,
  children,
}: {
  className: string
  children: React.ReactNode
}) {
  const ref = useReveal<HTMLElement>({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
  return (
    <section
      ref={ref}
      className={cn('legacy-reveal [--reveal-duration:0.6s] [--reveal-offset:30px]', className)}
    >
      {children}
    </section>
  )
}

/** Legacy `.trans-empty-v2`: no data yet, with links to the official sources. */
export function EmptyState({
  icon,
  text,
  links,
}: {
  icon: IconName
  text: string
  links: { href: string; label: string }[]
}) {
  return (
    <div
      role="status"
      className="mx-auto mb-8 max-w-180 rounded-[14px] border border-dashed border-[rgba(0,50,160,0.25)] bg-white px-6 py-7 text-center max-sm:px-4 max-sm:py-5.5"
    >
      <Icon
        name={icon}
        aria-hidden="true"
        className="mb-2 inline-block text-[1.75rem] text-primary"
      />
      <h3 className="m-0 mb-1.5 text-[1.0625rem] font-semibold text-ink">
        {m.budget_empty_title()}
      </h3>
      <p className="m-0 mb-3.5 text-[0.875rem] leading-[1.6] text-ink-light">{text}</p>
      <ul className="m-0 flex list-none flex-wrap justify-center gap-2 p-0">
        {links.map((link) => (
          <li key={link.href}>
            <SiteLink
              href={link.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,50,160,0.2)] px-3.5 py-2 text-[0.8125rem] font-medium text-primary no-underline transition-all duration-200 hover:border-primary hover:bg-[rgba(0,50,160,0.06)] hover:no-underline focus-visible:border-primary focus-visible:bg-[rgba(0,50,160,0.06)]"
            >
              <span>{link.label}</span>{' '}
              <Icon
                name={link.href.startsWith('/') ? 'arrow-right' : 'box-arrow-up-right'}
                aria-hidden="true"
              />
            </SiteLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Legacy `.sre-source`: "Source:" and the official link. */
export function SourceNote({
  href,
  label,
  className,
}: {
  href: string
  label: string
  className?: string
}) {
  return (
    <p className={cn('m-0 text-center text-[0.8125rem] text-ink-light', className)}>
      <Icon name="info-circle" /> <span>{m.budget_source_label()}</span>{' '}
      <SiteLink href={href} className="text-primary">
        {label}
      </SiteLink>
    </p>
  )
}

/** Legacy `.trans-explain-grid` of `.trans-explain-card`s. */
export function ExplainGrid({
  cards,
  className,
}: {
  cards: { icon: IconName; title: string; text: string }[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-[repeat(4,1fr)] gap-4 max-lg:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-1',
        className,
      )}
    >
      {cards.map((card) => (
        <div key={card.icon} className="rounded-[14px] border border-black/6 bg-white p-5">
          <h3 className="m-0 mb-2 flex items-center gap-2 text-[0.9375rem] font-semibold text-ink">
            <Icon name={card.icon} className="text-primary" /> <span>{card.title}</span>
          </h3>
          <p className="m-0 text-[0.8125rem] leading-[1.6] text-ink-light">{card.text}</p>
        </div>
      ))}
    </div>
  )
}
