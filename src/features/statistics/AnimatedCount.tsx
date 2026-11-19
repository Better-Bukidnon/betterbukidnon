'use client';

import { useEffect, useRef, useState } from 'react';

const format = (v: number) => v.toLocaleString('en-US');

/**
 * Counts up to `value` once scrolled into view (strong ease-out, 0.9 s). A counter already on
 * screen at load keeps its final number, so it never flashes back to 0; one that starts off
 * screen is armed at 0 before it can be seen.
 * The HTML and reduced-motion users get the final number; an invisible copy of it
 * reserves the width so the count never shifts the layout.
 */
const DURATION_MS = 900;

export function AnimatedCount({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduce || typeof IntersectionObserver === 'undefined') return;
    const rect = el.getBoundingClientRect();
    // Already seen at its final value: counting back from 0 would be a visible flash.
    if (rect.bottom > 0 && rect.top < window.innerHeight) return;
    let frame = 0;
    const armFrame = requestAnimationFrame(() => setShown(0));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / DURATION_MS, 1);
          setShown(Math.floor(value * (1 - (1 - p) ** 4)));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(armFrame);
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      <span className="invisible">{format(value)}</span>
      <span className="absolute inset-0">{format(shown)}</span>
    </span>
  );
}
