import { Children, cloneElement, isValidElement } from 'react'
import { Icon, type IconName } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'
import { cn } from '@/lib/utils'
import { cardBase, ListScope } from './box'

/*
 * Blocks for the legacy certificate layout (birth, death and marriage certificates): a notice,
 * two ways to get a copy, numbered process cards, and requirements with an FAQ beside a
 * column of cards. Sections and quick facts reuse `Section` and `Stats`.
 */

const card = `${cardBase} p-3.5`
const cardHeading = 'mb-2.5 flex items-center gap-1.5 text-[0.8125rem] font-semibold text-ink'

/** Legacy `.notice-box`: who handles the document, with a link to the right office. */
export function Notice({
  icon = 'info-circle',
  title,
  children,
}: {
  icon?: IconName
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-3.5 rounded-site border border-primary/15 bg-linear-135 from-primary/6 to-primary/2 p-3.5 [&_a]:font-semibold [&_a]:text-primary [&_p]:m-0 [&_p]:text-[0.75rem] [&_p]:leading-[1.5] [&_p]:text-ink">
      <h4 className="mb-2 flex items-center gap-1.5 text-[0.8125rem] font-semibold text-primary">
        <Icon name={icon} />
        <span>{title}</span>
      </h4>
      {children}
    </div>
  )
}

/** Legacy `.route-grid`: two boxes side by side, one column up to 768px. */
export function RouteGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(2,1fr)] gap-3.5 max-[769px]:grid-cols-1">{children}</div>
  )
}

/**
 * Legacy `.req-box`: a titled box with a Markdown list. Numbered lists are steps; bullet
 * lists get a check, as in legacy.
 */
export function ListBox({
  icon,
  title,
  children,
}: {
  icon?: IconName
  /** Omit for a box with only a list. */
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('listbox', card)}>
      {title && (
        <h4 className={cardHeading}>
          {icon && <Icon name={icon} className="text-primary" />}
          <span>{title}</span>
        </h4>
      )}
      <ListScope value={{ icon: 'check-circle-fill', variant: 'compact' }}>{children}</ListScope>
    </div>
  )
}

/** Legacy `.req-note`: a small line under a list, usually a link. */
export function ListNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2.5 text-[0.6875rem] leading-[1.45] text-ink-light [&_a]:text-primary [&_p]:m-0">
      {children}
    </div>
  )
}

/** Legacy three-per-row grid (two up to 992px, one on phones), as `.process-grid` and `.staff-grid`. */
export const threeUp =
  'grid grid-cols-[repeat(3,1fr)] gap-2.5 max-[993px]:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-1'

/** Legacy `.process-grid`: numbered cards, three per row (two up to 992px, one on phones). */
export function ProcessCards({ children }: { children: React.ReactNode }) {
  let number = 0
  return (
    <div className={threeUp}>
      {Children.map(children, (child) =>
        isValidElement<{ number?: number }>(child)
          ? cloneElement(child, { number: ++number })
          : null,
      )}
    </div>
  )
}

/** One `.process-card`; `final` gives the last step the green number. */
export function ProcessCard({
  title,
  final = false,
  number,
  children,
}: {
  title: string
  final?: boolean
  /** Set by `ProcessCards`. */
  number?: number
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        card,
        '[&_p]:mb-0 [&_p]:text-[0.6875rem] [&_p]:leading-[1.4] [&_p]:text-ink-light',
      )}
    >
      <div
        className={cn(
          'mb-2 inline-flex size-5.5 items-center justify-center rounded-[5px] text-[0.625rem] font-bold text-white',
          final ? 'bg-success' : 'bg-primary',
        )}
      >
        {number}
      </div>
      <h4 className="mb-1 text-[0.8125rem] font-semibold text-ink">{title}</h4>
      {children}
    </div>
  )
}

/** Legacy `.info-grid`: a wide column and a narrow one, stacked up to 992px. */
export function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-[2fr_1fr] gap-3.5 max-[993px]:grid-cols-1">{children}</div>
}

export function InfoMain({ children }: { children: React.ReactNode }) {
  // Legacy spaces the boxes 14px apart.
  return <div className="[&>.listbox]:mb-3.5">{children}</div>
}

export function InfoSide({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

/** Legacy `.faq-item`: a question that opens to show its answer. */
export function Faq({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    // Legacy's global `.faq-item` adds 24px padding (16px on phones) around the question.
    <details className="group mb-2 overflow-hidden rounded-site border border-black/6 bg-white p-6 max-md:p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-3 text-[0.8125rem] font-semibold text-ink hover:bg-primary/2 [&::-webkit-details-marker]:hidden">
        <span>{question}</span>
        <Icon
          name="chevron-down"
          className="text-primary transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="px-3.5 pb-3 text-[0.75rem] leading-[1.6] text-ink-light [&_p]:m-0">
        {children}
      </div>
    </details>
  )
}

/** Legacy `.sidebar-card`: a titled card in the narrow column. */
export function SideCard({
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
        'mb-2.5 [&_p]:mb-1.5 [&_p]:mt-0 [&_p]:text-[0.75rem] [&_p]:text-ink-light',
      )}
    >
      <h4 className={cardHeading}>
        <Icon name={icon} className="text-primary" />
        <span>{title}</span>
      </h4>
      <ListScope value={{ variant: 'compact' }}>{children}</ListScope>
    </div>
  )
}

/** Office hours with a clock, as a line in a `SideCard`. */
export function Hours({ children }: { children: React.ReactNode }) {
  return (
    <p>
      <Icon name="clock" /> <span>{children}</span>
    </p>
  )
}

/** A link on its own in a `SideCard` (not in a paragraph), as legacy has it. */
export function SideLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <SiteLink
      href={href}
      className="text-[0.75rem] text-primary no-underline hover:underline [&_p]:inline [&_p]:m-0"
    >
      {children}
    </SiteLink>
  )
}

/** Legacy `.sidebar-card .btn.btn-primary`: a full-width button. */
export function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <SiteLink
      href={href}
      className="mt-2.5 block w-full rounded-md border-2 border-transparent bg-primary px-4 py-2.5 text-center text-[0.75rem] font-medium text-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:text-white hover:no-underline hover:shadow-md [&_p]:inline [&_p]:m-0"
    >
      {children}
    </SiteLink>
  )
}
