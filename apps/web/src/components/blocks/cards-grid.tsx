import { Icon, type IconName } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'
import { cn } from '@/lib/utils'
import { cardBase as card, ListScope } from './box'
import { threeUp } from './certificate'

/*
 * Card grids from the Business Permits and Property Declaration pages: titled cards, info
 * tiles, field groups, requirement cards and contact cards.
 */

/** Legacy `.staff-grid`: three cards per row, two up to 992px, one on phones. */
export function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className={threeUp}>{children}</div>
}

/** Legacy `.staff-card`: a short title (a link when `href` is set) and one line of text. */
export function InfoCard({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn(card, 'p-3 [&_p]:m-0 [&_p]:text-[0.6875rem] [&_p]:text-ink-light')}>
      <h4 className="mb-0.5 text-[0.75rem] font-semibold text-ink">
        {href ? (
          <SiteLink href={href} className="text-primary">
            {title}
          </SiteLink>
        ) : (
          title
        )}
      </h4>
      {children}
    </div>
  )
}

/** Legacy `.info-grid` and `.requirements-grid` (Property Declaration): three tiles per row, two up to 992px, one up to 768px. */
export function Tiles({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(3,1fr)] gap-3 max-[993px]:grid-cols-[repeat(2,1fr)] max-[769px]:grid-cols-1">
      {children}
    </div>
  )
}

/**
 * Legacy `.info-card`: a small label and a short answer. Legacy's global `.info-card` rule
 * makes it a flex row, so the label sits beside the answer.
 */
export function Tile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        card,
        'flex overflow-hidden p-4 [&_p]:m-0 [&_p]:text-[0.875rem] [&_p]:font-medium [&_p]:text-ink',
      )}
    >
      <h4 className="mb-1.5 text-[0.75rem] font-medium uppercase tracking-[0.5px] text-ink-light">
        {label}
      </h4>
      {children}
    </div>
  )
}

/** Legacy `.form-fields`: two groups per row, one up to 480px. */
export function FieldGroups({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(2,1fr)] gap-4 max-[481px]:grid-cols-1">{children}</div>
  )
}

/** Legacy `.field-group`: a titled card whose Markdown list gets checks and row lines, in grey. */
export function FieldGroup({
  icon,
  title,
  children,
}: {
  icon: IconName
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        card,
        'p-4 [&_li]:text-[0.8125rem] [&_li]:text-ink-light [&_li>i]:text-[0.75rem]',
      )}
    >
      <h4 className="mb-3 flex items-center gap-1.5 text-[0.875rem] font-semibold text-ink">
        <Icon name={icon} className="text-[1rem] text-primary" />
        <span>{title}</span>
      </h4>
      <ListScope value={{ icon: 'check-circle-fill' }}>{children}</ListScope>
    </div>
  )
}

/** Legacy `.req-card`: a titled card with a plain bulleted Markdown list. */
export function RequirementCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        card,
        'p-3.5 [&_li]:mb-[3px] [&_ul]:m-0 [&_ul]:list-disc [&_ul]:pl-3.5 [&_ul]:text-[0.75rem] [&_ul]:text-ink-light',
      )}
    >
      <h4 className="mb-2 text-[0.8125rem] font-semibold text-ink">{title}</h4>
      <ListScope value={{ variant: 'plain' }}>{children}</ListScope>
    </div>
  )
}

/** Legacy `.card` with padding 20px: a contact or links card that lifts on hover. */
export function ContactBox({
  icon,
  title,
  children,
}: {
  icon: IconName
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col rounded-site border border-surface-alt bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 motion-reduce:hover:translate-y-0 [&>p]:mb-2.5 [&>p]:text-[0.8125rem] [&>p]:text-ink-light">
      <h3 className="mb-3 flex items-center gap-2 text-[0.9375rem]">
        <Icon name={icon} className="text-primary" />
        <span>{title}</span>
      </h3>
      {children}
    </div>
  )
}

/** A list with an icon on each item; `muted` is the grey, more spaced version. */
export function IconList({
  muted = false,
  children,
}: {
  muted?: boolean
  children: React.ReactNode
}) {
  return (
    <ul
      className={cn(
        'm-0 list-none p-0 text-[0.75rem] [&_p]:contents',
        muted ? 'text-ink-light [&>li]:mb-1.5' : 'text-ink [&>li]:mb-1',
      )}
    >
      {children}
    </ul>
  )
}

export function IconItem({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <li>
      <Icon name={icon} className="mr-1.5 text-primary" /> <span>{children}</span>
    </li>
  )
}
