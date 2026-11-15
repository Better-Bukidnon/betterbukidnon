import { cn } from '@/lib/utils'
import { createContext, useContext } from 'react'

/**
 * Markdown tables in documents, in the legacy `.fee-table` styles: a blue header row (office
 * guides) or, inside a `<Topic>`, the light header of the guide layout. `<Danger>` marks a
 * cell in red (such as a penalty) and `<TableNote>` is the small source line under a table.
 */
type TableStyle = 'blue' | 'light' | 'process'
const TableContext = createContext<TableStyle>('blue')

export function TableScope({ value, children }: { value: TableStyle; children: React.ReactNode }) {
  return <TableContext value={value}>{children}</TableContext>
}

const blueHeading =
  'bg-primary px-3 py-2.5 text-left text-[0.6875rem] font-semibold uppercase text-white'

const styles: Record<TableStyle, { table: string; th: string; td: string }> = {
  blue: {
    table:
      'w-full border-collapse overflow-hidden rounded-site border border-black/6 bg-white text-[0.75rem] [&_tr:hover_td]:bg-primary/2 [&_tr:last-child_td]:border-b-0',
    th: blueHeading,
    td: 'border-b border-black/4 px-3 py-2',
  },
  light: {
    table: 'mt-6 w-full border-collapse text-[0.875rem] [&_tr:hover]:bg-surface-alt',
    th: 'border-b border-line bg-surface-alt p-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.5px] text-ink',
    td: 'border-b border-line p-3 text-left',
  },
  process: {
    table:
      'w-full border-collapse overflow-hidden rounded-site border border-black/6 bg-white text-[0.75rem] max-[769px]:text-[0.6875rem] [&_tr:hover]:bg-primary/2 [&_tr:last-child_td]:border-b-0',
    th: blueHeading,
    td: 'border-b border-black/4 px-3 py-2.5 align-top [&_strong]:font-semibold',
  },
}

/**
 * Legacy `.table-responsive`: cells at least 100px (the second 300px). It scrolls sideways;
 * legacy let it overflow below 768px, which made the whole page scroll.
 */
const scrollWrap =
  'relative w-full overflow-x-auto [&_td]:min-w-25 [&_td:nth-child(2)]:min-w-75 [&_th]:min-w-25 [&_th:nth-child(2)]:min-w-75'

export function Table({ children }: { children?: React.ReactNode }) {
  const style = useContext(TableContext)
  const table = <table className={styles[style].table}>{children}</table>
  return style === 'light' ? <div className={scrollWrap}>{table}</div> : table
}

export function TableHeading({ children }: { children?: React.ReactNode }) {
  return <th className={styles[useContext(TableContext)].th}>{children}</th>
}

export function TableCell({ children }: { children?: React.ReactNode }) {
  return <td className={styles[useContext(TableContext)].td}>{children}</td>
}

export function Danger({ children }: { children: React.ReactNode }) {
  return <span className="text-danger">{children}</span>
}

export function TableNote({ children }: { children: React.ReactNode }) {
  // A div: formatted MDX puts the text on its own lines, which makes it a paragraph.
  return <div className="mt-2 text-[0.6875rem] text-ink-light [&_p]:m-0">{children}</div>
}

/**
 * Legacy `.process-table` (Business Permits): a Markdown table of steps with a blue header,
 * in the `.table-responsive` scroll wrapper. `widths` sets the column widths in percent, such
 * as `"34,40,26"`.
 */
export function ProcessTable({ widths, children }: { widths?: string; children: React.ReactNode }) {
  const columns = widths?.split(',').map((width) => `${width.trim()}%`) ?? []
  return (
    <div
      className={cn(
        scrollWrap,
        '[&_th:nth-child(1)]:w-(--w1) [&_th:nth-child(2)]:w-(--w2) [&_th:nth-child(3)]:w-(--w3) [&_th:nth-child(4)]:w-(--w4)',
      )}
      style={Object.fromEntries(columns.map((width, i) => [`--w${i + 1}`, width]))}
    >
      <TableScope value="process">{children}</TableScope>
    </div>
  )
}

/** The small numbered square before a step's title in a `ProcessTable`. */
export function StepBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="mr-1.5 inline-flex size-5 items-center justify-center rounded bg-primary text-[0.625rem] font-bold text-white">
      {children}
    </span>
  )
}
