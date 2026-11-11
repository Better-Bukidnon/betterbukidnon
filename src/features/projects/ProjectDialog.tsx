'use client';

import { useEffect, useRef } from 'react';
import { BoxArrowUpRight, Github, XLg } from 'react-bootstrap-icons';
import type { Project } from '@/features/projects/projectsData';
import { ProjectBadges, ProjectIcon, type ProjectText } from '@/features/projects/ProjectCard';
import { buttonPrimary } from '@/shared/ui';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

/**
 * View Details, as a native modal <dialog> like VolunteerPopup: the browser traps focus, makes
 * the page inert and closes on Escape; focus goes back to the button that opened it.
 */
export function ProjectDialog({
  project,
  text,
  onClose,
}: {
  project: Project | null;
  text: ProjectText;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!project || !dialog || dialog.open) return;
    opener.current = document.activeElement as HTMLElement | null;
    dialog.showModal();
  }, [project]);

  const close = () => ref.current?.close();
  const { t } = text;
  const repos = project?.repos ?? [];

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click; Escape is the native keyboard path
    <dialog
      ref={ref}
      aria-labelledby="project-dialog-title"
      aria-modal="true"
      onClose={() => {
        onClose();
        opener.current?.focus();
      }}
      onClick={(e) => e.target === e.currentTarget && close()}
      className="m-auto w-[min(92vw,560px)] overflow-hidden rounded-2xl bg-bg p-0 text-text shadow-md backdrop:bg-black/60 motion-safe:open:animate-pop"
    >
      {project && (
        <>
          <div className="relative flex items-center gap-sm bg-bg-alt p-md text-text">
            <ProjectIcon project={project} className="size-10 text-primary" />
            <div className="flex-1">
              <ProjectBadges project={project} text={text} />
              <span className="mt-1 block text-sm text-text-light">{text.repoLabel(project)}</span>
            </div>
            <button
              type="button"
              onClick={close}
              className="flex min-h-11 items-center gap-1 rounded-full px-sm text-text hover:bg-black/5"
            >
              <XLg aria-hidden /> {t('proj-close')}
            </button>
          </div>
          <div className="p-md">
            <h2 id="project-dialog-title" className="mb-1 text-xl font-bold">
              {text.name(project)}
            </h2>
            <a href={project.url} {...external} className="mb-md inline-block text-sm break-all">
              {project.url}
            </a>
            <h3 className="mb-1 font-semibold">{t('proj-about')}</h3>
            <p className="mb-md text-text-light">{text.desc(project)}</p>
            <h3 className="mb-1 font-semibold">{t('proj-contributors')}</h3>
            <p className="mb-md">
              <a
                href={repos.length ? `${repos[0].url}/graphs/contributors` : project.url}
                {...external}
                className="inline-flex items-center gap-1"
              >
                {t('proj-contributors-link')} <BoxArrowUpRight aria-hidden />
                <span className="sr-only">{text.newTab}</span>
              </a>
            </p>
            <h3 className="mb-1 font-semibold">{t('proj-repository')}</h3>
            <ul className="mb-sm space-y-1">
              {repos.map((r) => (
                <li key={r.url}>
                  <a href={r.url} {...external} className="inline-flex items-center gap-xs">
                    <Github aria-hidden /> {r.url.replace(/^https?:\/\//, '')}{' '}
                    <BoxArrowUpRight aria-hidden />
                    <span className="sr-only">{text.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-sm border-t border-black/5 bg-bg-alt p-md">
            <span className="text-sm text-text-light">
              {t('proj-repos-count', { count: repos.length })}
            </span>
            <a href={project.url} {...external} className={buttonPrimary}>
              {t('proj-visit-project')} <BoxArrowUpRight aria-hidden />
              <span className="sr-only">{text.newTab}</span>
            </a>
          </div>
        </>
      )}
    </dialog>
  );
}
