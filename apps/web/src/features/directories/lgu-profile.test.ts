import { describe, expect, it } from 'vite-plus/test'
import { findBarangaysForLgu, findLgu, lgus } from './data'
import { directoryPaths } from './paths'

describe('LGU profiles', () => {
  it('provides a profile route and complete barangay set for every LGU', () => {
    for (const lgu of lgus) {
      expect(findLgu(lgu.slug)).toBe(lgu)
      expect(directoryPaths.lgu(lgu.slug)).toBe(`/lgus/${lgu.slug}`)
      expect(findBarangaysForLgu(lgu.slug)).toHaveLength(lgu.barangay_count)
      expect(lgu.sources.length).toBeGreaterThan(0)
    }
  })
})
