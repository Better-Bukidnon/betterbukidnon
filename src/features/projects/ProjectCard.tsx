'use client';

import {
  CashCoin,
  ConeStriped,
  Grid3x3GapFill,
  JournalText,
  type Icon,
} from 'react-bootstrap-icons';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT, type Vars } from '@/features/i18n/useT';
import type { Project } from '@/features/projects/projectsData';
import {
  lookup,
  projectsDictionary,
  type ProjectsKey,
} from '@/features/projects/projectsDictionary';
import { card } from '@/shared/ui';

// The Bootstrap Icons class names used in projects.json; add one here with a new project icon.
const ICONS: Record<string, Icon> = {
  'bi-cash-coin': CashCoin,
  'bi-journal-text': JournalText,
  'bi-cone-striped': ConeStriped,
};

export function ProjectIcon({ project, className }: { project: Project; className?: string }) {
  const Glyph = ICONS[project.icon] ?? Grid3x3GapFill;
  return <Glyph aria-hidden className={className} />;
}

export interface ProjectText {
  t: (key: ProjectsKey, vars?: Vars) => string;
  name: (p: Project) => string;
  desc: (p: Project) => string;
  category: (slug: string) => string;
  repoLabel: (p: Project) => string;
  newTab: string;
}

/** Same keys as fce5da9:assets/js/projects.js: `proj-<id>-name|desc`, `proj-cat-<slug>`, JSON fallback. */
export function useProjectText(): ProjectText {
  const t = useT(projectsDictionary);
  const nav = useT(chromeDictionary);
  return {
    t,
    name: (p) => lookup(t, `proj-${p.id}-name`, p.name),
    desc: (p) => lookup(t, `proj-${p.id}-desc`, p.description),
    category: (slug) => lookup(t, `proj-cat-${slug}`, slug[0].toUpperCase() + slug.slice(1)),
    repoLabel: (p) => (p.repos[0]?.name ?? '').replace('/', ' / '),
    newTab: nav('nav-opens-new-tab'),
  };
}

export const hostOf = (url: string) => {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
};

const label =
  'rounded-sm border border-black/10 bg-bg px-2.5 py-0.5 text-xs font-semibold text-text';

/** Status, type and category labels. The card passes `showType={false}` to keep to two. */
export function ProjectBadges({
  project,
  text,
  showType = true,
}: {
  project: Project;
  text: ProjectText;
  showType?: boolean;
}) {
  const type = project.type === 'community' ? 'community' : 'org';
  return (
    <div className="flex flex-wrap gap-1">
      <span className={label}>{lookup(text.t, `proj-tab-${project.status}`, project.status)}</span>
      {showType && <span className={label}>{text.t(`proj-type-${type}`)}</span>}
      <span className={label}>{text.category(project.category)}</span>
    </div>
  );
}

export function ProjectCard({
  project,
  text,
  onDetails,
}: {
  project: Project;
  text: ProjectText;
  onDetails: () => void;
}) {
  const name = text.name(project);
  return (
    <li className={`${card} flex flex-col overflow-hidden p-0`}>
      <div className="flex flex-col gap-xs bg-bg-alt p-md text-text">
        <ProjectIcon project={project} className="size-8 text-primary" />
        <ProjectBadges project={project} text={text} showType={false} />
        <span className="text-sm text-text-light">{text.repoLabel(project)}</span>
      </div>
      <div className="flex-1 p-md">
        <h2 className="mb-xs text-lg font-semibold">{name}</h2>
        <p className="mb-xs text-sm text-text-light">{text.desc(project)}</p>
        {project.repos.map((r) => (
          <p key={r.url} className="text-xs break-all text-text-light">
            {r.url.replace(/^https?:\/\//, '')}
          </p>
        ))}
      </div>
      <div className="flex items-center justify-between gap-sm border-t border-black/5 px-md py-xs">
        <span className="text-sm text-text-light">{hostOf(project.url)}</span>
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={onDetails}
          className="inline-flex min-h-11 items-center gap-1 font-semibold text-primary hover:text-primary-dark"
        >
          {text.t('proj-view-details')} <span className="sr-only">- {name}</span>
        </button>
      </div>
    </li>
  );
}
