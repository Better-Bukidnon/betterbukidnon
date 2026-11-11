'use client';

import { useState, type ComponentType, type SVGProps } from 'react';
import {
  ArrowRepeat,
  Book,
  CalendarCheck,
  CalendarEvent,
  Check2Square,
  FileEarmarkPlus,
  FileEarmarkRuledFill,
  FileText,
  JournalBookmarkFill,
  JournalText,
  Megaphone,
  Pen,
  People,
  PeopleFill,
  RocketTakeoff,
  Send,
  SendCheck,
} from 'react-bootstrap-icons';
import { useT } from '@/features/i18n/useT';
import {
  legislativeDictionary,
  type LegislativeKey,
} from '@/features/legislative/legislativeDictionary';
import { SectionHeading } from '@/shared/SectionHeading';
import { card, section } from '@/shared/ui';

type Step = [ComponentType<SVGProps<SVGSVGElement>>, LegislativeKey, LegislativeKey];

const FLOWS: Record<'ordinances' | 'resolutions', Step[]> = {
  ordinances: [
    [
      FileEarmarkPlus,
      'leg-file-proposed-ordinance',
      'leg-submit-the-proposed-ordinance-to-the-sangguniang',
    ],
    [
      Book,
      'leg-first-reading-referral-to-committee',
      'leg-initial-reading-and-assignment-to-the-relevant',
    ],
    [
      People,
      'leg-public-hearing-committee-action',
      'leg-committee-conducts-public-hearing-and-deliberates',
    ],
    [FileText, 'leg-committee-report', 'leg-committee-submits-findings-and-recommendations-to'],
    [JournalText, 'leg-second-reading', 'leg-detailed-discussion-and-debate-on-the-proposed'],
    [
      Check2Square,
      'leg-third-and-final-reading',
      'leg-final-voting-on-the-proposed-ordinance-by-the',
    ],
    [Send, 'leg-presented-to-the-governor', 'leg-presented-to-the-governor-desc'],
    [CalendarCheck, 'leg-governor-approval-or-veto', 'leg-governor-approval-or-veto-desc'],
    [ArrowRepeat, 'leg-veto-override', 'leg-veto-override-desc'],
    [Megaphone, 'leg-posting-publication', 'leg-public-posting-and-publication-of-the-approved'],
    [RocketTakeoff, 'leg-takes-effect', 'leg-ordinance-takes-effect-and-is-enforced-within-the'],
  ],
  resolutions: [
    [
      FileEarmarkPlus,
      'leg-file-proposed-resolution',
      'leg-submit-the-proposed-resolution-to-the-sangguniang',
    ],
    [
      CalendarEvent,
      'leg-inclusion-in-session-agenda',
      'leg-resolution-is-scheduled-for-inclusion-in-the',
    ],
    [
      PeopleFill,
      'leg-committee-meeting-approval',
      'leg-committee-reviews-and-approves-the-proposed',
    ],
    [Check2Square, 'leg-approval-in-session', 'leg-approval-in-session-desc'],
    [Pen, 'leg-official-signing', 'leg-secretary-to-the-sanggunian-and-presiding-officer'],
    [SendCheck, 'leg-posting-transmittal', 'leg-resolution-is-posted-publicly-and-transmitted-to'],
  ],
};

const TABS = [
  { id: 'ordinances', Icon: JournalBookmarkFill, label: 'leg-for-ordinances' },
  { id: 'resolutions', Icon: FileEarmarkRuledFill, label: 'leg-for-resolutions' },
] as const;

/** The two flowcharts from legacy/legislative/index.html; the toggles are aria-pressed buttons. */
export function LegislativeProcess() {
  const t = useT(legislativeDictionary);
  const [active, setActive] = useState<keyof typeof FLOWS>('ordinances');
  const steps = FLOWS[active];
  return (
    <section className="bg-bg-alt">
      <div className={section}>
        <SectionHeading title={t('leg-flowchart-for-legislative-proposal')}>
          <p>{t('leg-stepbystep-process-for-enacting-ordinances-and')}</p>
        </SectionHeading>
        <div className="mb-md flex flex-wrap justify-center gap-sm">
          {TABS.map(({ id, Icon, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={active === id}
              aria-controls="leg-flow"
              onClick={() => setActive(id)}
              className={`inline-flex min-h-11 items-center gap-xs rounded-base border-2 border-primary px-md font-semibold ${
                active === id ? 'bg-primary text-white' : 'bg-bg text-primary hover:bg-primary/5'
              }`}
            >
              <Icon aria-hidden /> {t(label)}
              <small className="font-normal">
                {t('leg-steps-count', { count: FLOWS[id].length })}
              </small>
            </button>
          ))}
        </div>
        <ol id="leg-flow" aria-live="polite" className="grid gap-sm sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(([Icon, title, desc], i) => (
            <li key={title} className={`${card} ${i === steps.length - 1 ? 'border-success' : ''}`}>
              <div className="mb-xs flex items-center gap-xs">
                <span className="text-sm font-bold text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Icon aria-hidden className="text-xl text-primary" />
              </div>
              <h3 className="mb-1 font-semibold">{t(title)}</h3>
              <p className="text-sm text-text-light">{t(desc)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
