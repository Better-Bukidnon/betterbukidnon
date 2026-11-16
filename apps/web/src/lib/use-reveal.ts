import { useEffect, useRef } from 'react'

type OnVisible<T> = (element: T) => (() => void) | void

/**
 * Runs `onVisible` once the element scrolls into view (after `delay` ms), e.g. to lazy-load a
 * chart. `onVisible` may return a cleanup.
 */
export function useOnceVisible<T extends HTMLElement>({
  delay = 0,
  threshold = 0.2,
  onVisible,
}: {
  delay?: number
  threshold?: number
  onVisible: OnVisible<T>
}) {
  const ref = useRef<T>(null)
  const callback = useRef(onVisible)
  callback.current = onVisible

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let timer: number | undefined
    let cleanup: (() => void) | void
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        timer = window.setTimeout(() => {
          cleanup = callback.current(element)
        }, delay)
      },
      { threshold },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
      cleanup?.()
    }
  }, [delay, threshold])

  return ref
}

/** Marks a `legacy-reveal` element `data-visible` once it scrolls into view, so it animates in. */
export function useReveal<T extends HTMLElement>({
  delay,
  onReveal,
}: { delay?: number; onReveal?: OnVisible<T> } = {}) {
  return useOnceVisible<T>({
    delay,
    onVisible: (element) => {
      element.dataset.visible = ''
      return onReveal?.(element)
    },
  })
}
