import { Icon, type IconName } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

/**
 * Legacy service-detail `.mto-section`: a 40px band, grey when `alt`, with an optional
 * `.section-header` (title on the left, intro on the right; stacked and centred on phones).
 * `large` is the bigger heading of the Property Declaration page.
 */
export function Section({
  alt = false,
  icon,
  title,
  intro,
  large = false,
  children,
}: {
  alt?: boolean
  icon?: IconName
  title?: string
  intro?: string
  large?: boolean
  children: React.ReactNode
}) {
  return (
    <section className={cn('py-10', alt && 'bg-surface-alt')}>
      <div className="container-site">
        {title && <SectionHeading icon={icon} title={title} intro={intro} large={large} />}
        {children}
      </div>
    </section>
  )
}

/** The `.section-header` on its own, for a heading inside a section (certificate pages). */
export function SectionHeading({
  icon,
  title,
  intro,
  large = false,
}: {
  icon?: IconName
  title: string
  intro?: string
  large?: boolean
}) {
  return (
    <div
      className={cn(
        // Below other content (a box, a list), legacy gives the heading 20px of space.
        'section-heading flex items-center justify-between not-first:mt-5 max-md:flex-col max-md:gap-4 max-md:text-center',
        large ? 'mb-6' : 'mb-5',
      )}
    >
      <h2
        className={cn(
          'mb-1 flex items-center gap-2 text-ink',
          large ? 'text-[1.25rem]' : 'text-[1.125rem]',
        )}
      >
        {icon && <Icon name={icon} className={cn('text-primary', !large && 'text-[1rem]')} />}
        <span>{title}</span>
      </h2>
      {intro && (
        <p className={cn('m-0 text-ink-light', large ? 'text-[0.875rem]' : 'text-[0.8125rem]')}>
          {intro}
        </p>
      )}
    </div>
  )
}

/**
 * Legacy `.grid.grid-2` with a 16px gap: two columns, one below 768px. A table right after it
 * gets the 16px space legacy gives it.
 */
export function Columns({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 [&+table]:mt-4">{children}</div>
}
