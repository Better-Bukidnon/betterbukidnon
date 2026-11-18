import { z } from 'zod'
import dpwhJson from '../../../../../data/dpwh-projects.json'
import fiscalJson from '../../../../../data/fiscal_transparency.json'
import { parseContent } from '@/lib/schemas'

const amount = z.number().finite()

// One reporting period of the Statement of Receipts and Expenditures, in millions of pesos. A
// missing (or zero) total is the sum of its parts, as legacy's transparency-v2.js computed it.
const periodSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  range: z.string().optional(),
  income: z
    .object({ local: amount, external: amount, total: amount.optional() })
    .transform((income) => ({ ...income, total: income.total || income.local + income.external })),
  expenditures: z
    .object({
      gps: amount,
      social: amount,
      economic: amount,
      debt: amount,
      total: amount.optional(),
    })
    .transform((spent) => ({
      ...spent,
      total: spent.total || spent.gps + spent.social + spent.economic + spent.debt,
    })),
  netIncome: amount,
  fundBalance: amount,
})
export type FiscalPeriod = z.output<typeof periodSchema>

export const fiscalDataSchema = z.object({
  _status: z.enum(['empty', 'verified']),
  _source: z.string().min(1),
  province: z.string().min(1),
  fiscal_years: z.array(
    z.object({
      year: z.number().int(),
      source_url: z.url(),
      periods: z.array(periodSchema),
    }),
  ),
})

export const fiscalData = parseContent(
  fiscalDataSchema,
  fiscalJson,
  'data/fiscal_transparency.json',
)

/** The latest fiscal year with figures, leaving out periods with no income or spending. */
export function latestFiscalYear(data = fiscalData) {
  const years = [...data.fiscal_years].sort((a, b) => b.year - a.year)
  for (const year of years) {
    const periods = year.periods.filter(
      (period) => period.income.total !== 0 || period.expenditures.total !== 0,
    )
    if (periods.length) return { year: year.year, sourceUrl: year.source_url, periods }
  }
  return undefined
}

const dpwhDataSchema = z.object({
  projects: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      location: z.string(),
      category: z.string(),
      contractor: z.string(),
      contractorId: z.string().optional(),
      cost: amount,
      // Percent complete, 0-100.
      status: z.number().min(0).max(100),
      completionDate: z.iso.date().nullable(),
    }),
  ),
})
export type DpwhProject = z.infer<typeof dpwhDataSchema>['projects'][number]

export const dpwhProjects = parseContent(
  dpwhDataSchema,
  dpwhJson,
  'data/dpwh-projects.json',
).projects
