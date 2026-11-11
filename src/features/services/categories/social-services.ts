import type { Category } from '@/features/services/types';

/** Converted from legacy/services/social-services.html. */
export const socialServices: Category = {
  crumb: 'social-bc',
  icon: 'people-fill',
  badge: 'social-badge',
  title: 'social-h1',
  desc: 'social-hdesc',
  contacts: [
    {
      href: 'tel:0888135734',
      label: 'social-x1',
      value: 'social-x2',
    },
  ],
  sections: [
    {
      title: 'social-x3',
      intro: 'social-x4',
      cards: [
        {
          icon: 'people-fill',
          title: 'social-x6',
          text: 'social-x7',
          link: {
            href: '/service-details/pswdo',
            label: 'social-x5',
          },
        },
        {
          icon: 'cash-coin',
          title: 'social-x8',
          text: 'social-x9',
        },
        {
          icon: 'people',
          title: 'social-x11',
          text: 'social-x12',
          link: {
            href: '/government#lgus',
            label: 'social-x10',
          },
        },
      ],
    },
    {
      title: 'social-x13',
      intro: 'social-x14',
      cards: [
        {
          icon: 'person-vcard',
          title: 'social-x16',
          text: 'social-x17',
          link: {
            href: '/government#lgus',
            label: 'social-x15',
          },
        },
        {
          icon: 'flag',
          title: 'social-x18',
          text: 'social-x19',
        },
        {
          icon: 'telephone',
          title: 'social-x21',
          text: 'social-x22',
          link: {
            href: '/service-details/pswdo',
            label: 'social-x20',
          },
        },
      ],
    },
  ],
  note: {
    text: 'social-note',
    href: 'https://bukidnon.gov.ph/',
    link: 'social-note-link',
  },
};
