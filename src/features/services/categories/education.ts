import type { Category } from '@/features/services/types';

/** Converted from legacy/services/education.html. */
export const education: Category = {
  crumb: 'edu-bc',
  icon: 'mortarboard-fill',
  badge: 'edu-badge',
  title: 'edu-h1',
  desc: 'edu-hdesc',
  contacts: [],
  sections: [
    {
      title: 'edu-x1',
      intro: 'edu-x2',
      cards: [
        {
          icon: 'journal-bookmark',
          title: 'edu-x3',
          text: 'edu-x4',
        },
        {
          icon: 'award',
          title: 'edu-x6',
          text: 'edu-x7',
          link: {
            href: '/service-details/pswdo',
            label: 'edu-x5',
          },
        },
        {
          icon: 'cash-stack',
          title: 'edu-x9',
          text: 'edu-x10',
          link: {
            href: '/budget',
            label: 'edu-x8',
          },
        },
      ],
    },
    {
      title: 'edu-x11',
      intro: 'edu-x12',
      cards: [
        {
          icon: 'backpack',
          title: 'edu-x13',
          text: 'edu-x14',
        },
        {
          icon: 'building',
          title: 'edu-x16',
          text: 'edu-x17',
          link: {
            href: '/government#lgus',
            label: 'edu-x15',
          },
        },
        {
          icon: 'bank',
          title: 'edu-x18',
          text: 'edu-x19',
        },
      ],
    },
  ],
  note: {
    text: 'edu-note',
    href: 'https://bukidnon.gov.ph/',
    link: 'edu-note-link',
  },
};
