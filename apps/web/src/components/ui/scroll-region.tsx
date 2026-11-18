import { cn } from '@/lib/utils'
import { createContext, useContext } from 'react'

/**
 * The accessible name for a scrollable region that has no `label` of its own: a `<Section>` or
 * `<Topic>` sets it to its title, so a table inside is named after its heading.
 */
export const ScrollRegionLabel = createContext<string | undefined>(undefined)

/**
 * A sideways-scrolling wrapper for a wide table. It takes focus, so keyboard users can scroll it
 * with the arrow keys, and it is a named region so screen readers say what they are in.
 */
export function ScrollRegion({
  label,
  className,
  style,
  children,
}: {
  label?: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const inherited = useContext(ScrollRegionLabel)
  const name = label ?? inherited
  return (
    <div
      role={name ? 'region' : undefined}
      aria-label={name}
      tabIndex={0}
      style={style}
      className={cn('overflow-x-auto focus-visible:outline-offset-[-3px]', className)}
    >
      {children}
    </div>
  )
}
