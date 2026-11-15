import { Icon, type IconName } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

/**
 * Legacy service-detail `.mto-section`: a 40px band, grey when `alt`, with an optional
 * `.section-header` (title on the left, intro on the right; stacked and centred on phones).
 */
export function Section({
  alt = false,
  icon,
  title,
  intro,
  children,
}: {
  alt?: boolean
  icon?: IconName
  title?: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn('py-10', alt && 'bg-surface-alt')}>
      <div className="container-site">
        {title && <SectionHeading icon={icon} title={title} intro={intro} />}
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
}: {
  icon?: IconName
  title: string
  intro?: string
}) {
  return (
    <div className="section-heading mb-5 flex items-center justify-between max-md:flex-col max-md:gap-4 max-md:text-center">
      <h2 className="mb-1 flex items-center gap-2 text-[1.125rem] text-ink">
        {icon && <Icon name={icon} className="text-[1rem] text-primary" />}
        <span>{title}</span>
      </h2>
      {intro && <p className="m-0 text-[0.8125rem] text-ink-light">{intro}</p>}
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
