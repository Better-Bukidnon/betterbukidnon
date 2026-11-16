import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** A Philippine phone number as a tel: link: (088) 813-5741 -> tel:+63888135741. */
export const telHref = (phone: string) => `tel:+63${phone.replace(/\D/g, '').replace(/^0/, '')}`
