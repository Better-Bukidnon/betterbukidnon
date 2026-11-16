/*
 * Class strings for the legacy site's global CSS (assets/css/style.css and responsive.css),
 * shared by the pages that reproduce it.
 */

/**
 * Legacy `.grid-2/3/4`: auto-fit below 1200px (so `.grid-2` can show three columns from 1025
 * to 1199px), fixed counts from 1200px (`.grid-4` from 1025px), two columns up to 1024px and
 * one below 768px. Add the gap the page uses.
 */
export const legacyGrid = {
  2: 'grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] min-[1200px]:grid-cols-2 max-xl:grid-cols-2 max-md:grid-cols-1',
  3: 'grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] min-[1200px]:grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1',
  4: 'grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] min-[1025px]:grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1',
} as const

/** Legacy `.card`: lifts on hover; padding 24px, 16px on phones, 8px up to 480px. */
export const legacyCard =
  'flex h-auto flex-col rounded-site border border-surface-alt bg-white p-6 shadow-sm transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] max-md:p-4 max-[481px]:p-2 motion-reduce:hover:translate-y-0'

/** Legacy `.btn` without its padding and colours. */
export const legacyButton =
  'inline-block rounded-site border-2 text-center font-semibold no-underline transition-all duration-200 hover:no-underline'

/** Legacy `.btn.btn-primary`. */
export const primaryButton = `${legacyButton} border-transparent bg-primary px-6 py-3 text-white hover:-translate-y-0.5 hover:bg-primary-dark hover:text-white hover:shadow-md max-md:px-5 max-md:py-2.5 max-md:text-[0.9375rem]`

/** Legacy `.btn.btn-secondary.btn-sm`: a small outlined button. */
export const outlineButtonSmall = `${legacyButton} border-primary bg-white px-4 py-2 text-[0.875rem] text-primary hover:bg-surface-alt max-md:px-3 max-md:py-1.5 max-md:text-[0.8125rem]`
