import type { Metadata } from 'next';
import { loadOffice, officeSlugs } from '@/features/service-details/officeData';
import { OfficePage } from '@/features/service-details/OfficePage';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return officeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { fm } = await loadOffice(slug);
  return {
    title: fm.title,
    description: fm.summary,
    alternates: { canonical: `/service-details/${slug}` },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { fm, Content, translated } = await loadOffice(slug);
  return <OfficePage fm={fm} Content={Content} translated={translated} />;
}
