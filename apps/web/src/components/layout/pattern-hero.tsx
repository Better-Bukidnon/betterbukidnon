import { Icon, type IconName } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

/**
 * Legacy `.leg-hero` / `.stats-hero`: a centred gradient hero with a faint cross pattern, a
 * frosted badge, the title and a subtitle. `tabletStep` adds `.leg-hero`'s extra step down at
 * 768px and below.
 */
export function PatternHero({
  icon,
  badge,
  title,
  subtitle,
  tabletStep,
}: {
  icon: IconName
  badge: string
  title: string
  subtitle: string
  tabletStep?: boolean
}) {
  return (
    <section
      className={cn(
        'legacy-hero-pattern bg-linear-135 from-primary to-secondary pb-14 pt-12 text-center max-sm:pb-11 max-sm:pt-9',
        tabletStep && 'max-[769px]:pb-12 max-[769px]:pt-10',
      )}
    >
      <div className="container-site">
        <div className="relative z-1">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-[0.875rem] font-medium text-white backdrop-blur-[4px]">
            <Icon name={icon} /> <span>{badge}</span>
          </span>
          <h1
            className={cn(
              'mb-2 text-[2rem] font-bold text-white max-sm:text-[1.5rem]',
              tabletStep && 'max-[769px]:text-[1.75rem]',
            )}
          >
            {title}
          </h1>
          <p
            className={cn('m-0 text-[1rem] text-white/85', tabletStep && 'max-sm:text-[0.9375rem]')}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  )
}
