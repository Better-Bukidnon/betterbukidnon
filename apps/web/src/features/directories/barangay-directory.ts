import type { Barangay } from './data'

export type BarangaySort = 'name-asc' | 'name-desc' | 'lgu-asc'
export type BarangayFilters = { query: string; lgu: string; sort: BarangaySort; page: number }

export const barangaysPerPage = 24
export const initialBarangayFilters: BarangayFilters = {
  query: '',
  lgu: 'all',
  sort: 'name-asc',
  page: 1,
}

export function filterBarangays(barangays: readonly Barangay[], filters: BarangayFilters) {
  const query = filters.query.trim().toLocaleLowerCase()
  const filtered = barangays.filter(
    (barangay) =>
      (filters.lgu === 'all' || barangay.lgu_slug === filters.lgu) &&
      (!query ||
        barangay.name.toLocaleLowerCase().includes(query) ||
        barangay.psgc_code.includes(query)),
  )
  return [...filtered].sort((a, b) => {
    if (filters.sort === 'lgu-asc')
      return a.lgu_name.localeCompare(b.lgu_name) || a.name.localeCompare(b.name)
    const order = a.name.localeCompare(b.name)
    return filters.sort === 'name-desc' ? -order : order
  })
}

export const pageCount = (total: number) => Math.max(1, Math.ceil(total / barangaysPerPage))
export const pageItems = <T>(items: readonly T[], page: number) =>
  items.slice((page - 1) * barangaysPerPage, page * barangaysPerPage)
