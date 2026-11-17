import { describe, expect, it } from 'vite-plus/test'
import { lgus } from './data'
import { filterLgus, initialLguFilters } from './lgu-directory'

describe('LGU directory filters', () => {
  it('finds LGUs by locality, PSGC code, and mayor', () => {
    expect(filterLgus(lgus, { ...initialLguFilters, query: 'Malaybalay' })).toHaveLength(1)
    expect(filterLgus(lgus, { ...initialLguFilters, query: '1001321000' })[0]?.slug).toBe(
      'valencia-city',
    )
    expect(filterLgus(lgus, { ...initialLguFilters, query: 'Sulatan' })[0]?.slug).toBe('talakag')
  })

  it('filters by classification and district', () => {
    expect(
      filterLgus(lgus, { ...initialLguFilters, classification: 'Component City' }),
    ).toHaveLength(2)
    expect(
      filterLgus(lgus, { ...initialLguFilters, district: 1 }).every((lgu) => lgu.district === 1),
    ).toBe(true)
  })

  it('sorts the complete directory by population and barangay count', () => {
    const population = filterLgus(lgus, { ...initialLguFilters, sort: 'population-desc' })
    const barangays = filterLgus(lgus, { ...initialLguFilters, sort: 'barangays-desc' })
    expect(population[0]?.name).toBe('Valencia City')
    expect(barangays[0]?.barangay_count).toBeGreaterThanOrEqual(barangays[1]?.barangay_count ?? 0)
  })
})
