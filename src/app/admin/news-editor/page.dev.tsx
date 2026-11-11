import type { Metadata } from 'next';
import { NewsEditor } from '@/features/news/NewsEditor';

// Dev-only: `.dev.tsx` is a page extension only under `next dev` (next.config.ts).
export const metadata: Metadata = { title: 'News Curation (dev)', robots: { index: false } };

export default function Page() {
  return <NewsEditor />;
}
