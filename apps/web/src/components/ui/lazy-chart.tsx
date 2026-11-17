import type { Chart, ChartConfiguration, ChartType } from 'chart.js'
import { useOnceVisible } from '@/lib/use-reveal'

/**
 * A Chart.js canvas that loads the library and draws once it scrolls into view. `chartRef`
 * receives the chart, for updates; `onError` runs if Chart.js fails to load.
 */
export function LazyChart<T extends ChartType>({
  label,
  config,
  chartRef,
  onError,
}: {
  label?: string
  config: () => ChartConfiguration<T>
  chartRef?: React.RefObject<Chart<T> | null>
  onError?: () => void
}) {
  const ref = useOnceVisible<HTMLCanvasElement>({
    threshold: 0.1,
    onVisible: (canvas) => {
      let chart: Chart<T> | undefined
      let cancelled = false
      import('@/lib/chart')
        .then(({ Chart }) => {
          if (cancelled) return
          chart = new Chart<T>(canvas, config())
          if (chartRef) chartRef.current = chart
        })
        .catch(() => onError?.())
      return () => {
        cancelled = true
        chart?.destroy()
        if (chartRef) chartRef.current = null
      }
    },
  })
  return <canvas ref={ref} role={label ? 'img' : undefined} aria-label={label} />
}
