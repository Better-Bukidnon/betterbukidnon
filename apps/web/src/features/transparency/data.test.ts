import { describe, expect, it } from 'vite-plus/test'
import { dpwhProjects, fiscalData, fiscalDataSchema, latestFiscalYear } from './data'

const period = (id: string, local: number) => ({
  id,
  label: id.toUpperCase(),
  income: { local, external: 2 },
  expenditures: { gps: 1, social: 1, economic: 1, debt: 0 },
  netIncome: 0,
  fundBalance: 0,
})

describe('transparency data', () => {
  it('validates the fiscal and DPWH data at import time', () => {
    expect(fiscalData.fiscal_years).toEqual([])
    expect(dpwhProjects).toEqual([])
    expect(latestFiscalYear()).toBeUndefined()
  })

  it('picks the latest year with figures and fills in missing totals', () => {
    const year = latestFiscalYear(
      fiscalDataSchema.parse({
        ...fiscalData,
        fiscal_years: [
          { year: 2024, source_url: 'https://blgf.gov.ph/', periods: [period('q1', 1)] },
          {
            year: 2025,
            source_url: 'https://blgf.gov.ph/',
            periods: [
              period('q1', 3),
              {
                ...period('q2', 0),
                income: { local: 0, external: 0 },
                expenditures: { gps: 0, social: 0, economic: 0, debt: 0 },
              },
            ],
          },
        ],
      }),
    )
    expect(year?.year).toBe(2025)
    expect(year?.periods.map((item) => item.id)).toEqual(['q1'])
    expect(year?.periods[0]?.income.total).toBe(5)
    expect(year?.periods[0]?.expenditures.total).toBe(3)
  })
})
