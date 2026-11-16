import { outlineButtonSmall } from '@/components/layout/legacy'
import { Icon, type IconName } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'

/** Legacy service-detail `.charter-note`: the volunteer-guide disclaimer, tinted blue. */
export function CharterNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="note"
      className="mb-4 flex items-start gap-2.5 rounded-site border border-l-4 border-primary/15 border-l-primary bg-primary/5 px-3.5 py-3 text-[0.8125rem] leading-[1.5] text-ink [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_p]:m-0"
    >
      <Icon name="info-circle-fill" className="mt-0.5 shrink-0 text-[1rem] text-primary" />
      {children}
    </div>
  )
}

/** Legacy `.btn.btn-secondary.btn-sm` on its own line. */
export function LinkButton({
  href,
  icon,
  children,
}: {
  href: string
  icon?: IconName
  children: React.ReactNode
}) {
  return (
    // A div, not the legacy p: formatted MDX wraps the label in its own paragraph.
    <div className="mt-4 [&_p]:m-0 [&_p]:inline">
      <SiteLink href={href} className={outlineButtonSmall}>
        {icon && <Icon name={icon} />} <span>{children}</span>
      </SiteLink>
    </div>
  )
}
