import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** A Philippine phone number as a tel: link: (088) 813-5741 -> tel:+63888135741. */
export const telHref = (phone: string) => `tel:+63${phone.replace(/\D/g, '').replace(/^0/, '')}`

const numberFormats = new Map<number, Intl.NumberFormat>()
/** A number as the legacy pages print it: en-US grouping and a fixed number of decimals. */
export function formatNumber(value: number, decimals = 0) {
  let format = numberFormats.get(decimals)
  if (!format) {
    format = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    numberFormats.set(decimals, format)
  }
  return format.format(value)
}
