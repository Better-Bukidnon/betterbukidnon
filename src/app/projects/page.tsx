import type { Metadata } from 'next';
import en from '@/features/projects/i18n/en.json';
import { ProjectsPage } from '@/features/projects/ProjectsPage';

export const metadata: Metadata = {
  title: en['proj-title'],
  description: en['proj-subtitle'],
  alternates: { canonical: '/projects' },
};

export default function Page() {
  return <ProjectsPage />;
}
