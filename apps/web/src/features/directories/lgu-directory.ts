import type { Lgu } from './data'

export type LguClassification = Lgu['classification'] | 'all'
export type LguSort = 'name-asc' | 'name-desc' | 'population-desc' | 'barangays-desc'

export type LguFilters = {
  query: string
  classification: LguClassification
  district: number | 'all'
  sort: LguSort
}

export const initialLguFilters: LguFilters = {
  query: '',
  classification: 'all',
  district: 'all',
  sort: 'name-asc',
}

export function filterLgus(lgus: readonly Lgu[], filters: LguFilters) {
  const query = filters.query.trim().toLowerCase()
  const matching = lgus.filter((lgu) => {
    if (filters.classification !== 'all' && lgu.classification !== filters.classification)
      return false
    if (filters.district !== 'all' && lgu.district !== filters.district) return false
    if (!query) return true
    return [lgu.name, lgu.official_name, lgu.psgc_code, lgu.leadership.mayor.name]
      .join(' ')
      .toLowerCase()
      .includes(query)
  })
  return [...matching].sort((a, b) => {
    if (filters.sort === 'name-desc') return b.name.localeCompare(a.name)
    if (filters.sort === 'population-desc') return b.population.latest - a.population.latest
    if (filters.sort === 'barangays-desc') return b.barangay_count - a.barangay_count
    return a.name.localeCompare(b.name)
  })
}
