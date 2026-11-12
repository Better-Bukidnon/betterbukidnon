import type { Category } from '@/features/services/types';

/** Converted from fce5da9:services/public-safety.html. */
export const publicSafety: Category = {
  crumb: 'safety-bc',
  icon: 'shield-fill-check',
  badge: 'safety-badge',
  title: 'safety-h1',
  desc: 'safety-hdesc',
  contacts: [
    {
      href: 'tel:911',
      label: 'safety-x1',
      value: 'safety-x2',
    },
    {
      href: 'tel:0888131262',
      label: 'safety-x3',
      value: 'safety-x4',
    },
    {
      href: 'tel:0888134263',
      label: 'safety-x5',
      value: 'safety-x6',
    },
    {
      href: 'tel:0888135449',
      label: 'safety-x7',
      value: 'safety-x8',
    },
  ],
  sections: [
    {
      title: 'safety-x9',
      intro: 'safety-x10',
      cards: [
        {
          icon: 'exclamation-triangle',
          title: 'safety-x12',
          text: 'safety-x13',
          link: {
            href: '/service-details/pdrrmd',
            label: 'safety-x11',
          },
        },
        {
          icon: 'shield-check',
          title: 'safety-x14',
          text: 'safety-x15',
        },
        {
          icon: 'fire',
          title: 'safety-x16',
          text: 'safety-x17',
        },
      ],
    },
    {
      title: 'safety-x18',
      intro: 'safety-x19',
      cards: [
        {
          icon: 'heart-pulse',
          title: 'safety-x21',
          text: 'safety-x22',
          link: {
            href: '/service-details/provincial-health-office',
            label: 'safety-x20',
          },
        },
        {
          icon: 'people',
          title: 'safety-x24',
          text: 'safety-x25',
          link: {
            href: '/service-details/pswdo',
            label: 'safety-x23',
          },
        },
        {
          icon: 'building',
          title: 'safety-x27',
          text: 'safety-x28',
          link: {
            href: '/government#lgus',
            label: 'safety-x26',
          },
        },
      ],
    },
  ],
  note: {
    text: 'safety-note',
    href: 'https://bukidnon.gov.ph/',
    link: 'safety-note-link',
  },
};
