import type { Barangay } from './data'

export const directoryPaths = {
  lgus: '/lgus',
  lgu: (slug: string) => `/lgus/${slug}`,
  barangays: '/barangays',
  barangay: (lguSlug: string, barangaySlug: string) => `/barangays/${lguSlug}/${barangaySlug}`,
} as const

/** Dataset slugs identify both the parent LGU and the barangay. Routes keep those segments separate. */
export function barangayPath(barangay: Pick<Barangay, 'lgu_slug' | 'slug'>) {
  const parts = barangay.slug.split('/')
  const [lguSlug, barangaySlug] = parts
  if (parts.length !== 2 || lguSlug !== barangay.lgu_slug || !barangaySlug)
    throw new Error(`Invalid barangay route slug: ${barangay.slug}`)
  return directoryPaths.barangay(lguSlug, barangaySlug)
}

export function directoryBarangaySlug(lguSlug: string, barangaySlug: string) {
  return `${lguSlug}/${barangaySlug}`
}
