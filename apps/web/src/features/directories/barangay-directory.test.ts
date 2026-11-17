import { describe, expect, it } from 'vite-plus/test'
import { barangays } from './data'
import { filterBarangays, initialBarangayFilters, pageCount, pageItems } from './barangay-directory'

describe('barangay directory filters', () => {
  it('finds a barangay by name or PSGC and narrows to an LGU', () => {
    expect(
      filterBarangays(barangays, { ...initialBarangayFilters, query: 'Casisang' }),
    ).toHaveLength(1)
    expect(
      filterBarangays(barangays, { ...initialBarangayFilters, query: '1001312001' }),
    ).toHaveLength(1)
    expect(
      filterBarangays(barangays, { ...initialBarangayFilters, lgu: 'malaybalay-city' }),
    ).toHaveLength(46)
  })

  it('paginates the 464-item directory without dropping records', () => {
    const filtered = filterBarangays(barangays, initialBarangayFilters)
    const pages = pageCount(filtered.length)
    expect(pages).toBe(20)
    expect(pageItems(filtered, pages)).toHaveLength(8)
  })
})
