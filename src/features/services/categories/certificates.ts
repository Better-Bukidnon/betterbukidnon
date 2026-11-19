import type { Category } from '@/features/services/types';

/** Converted from fce5da9:services/certificates.html. */
export const certificates: Category = {
  crumb: 'cert-bc',
  icon: 'file-earmark-text-fill',
  badge: 'cert-badge',
  title: 'cert-h1',
  desc: 'cert-hdesc',
  contacts: [],
  sections: [
    {
      title: 'cert-x1',
      intro: 'cert-x2',
      cards: [
        {
          icon: 'building',
          title: 'cert-x4',
          text: 'cert-x5',
          link: {
            href: '/government#lgus',
            label: 'cert-x3',
          },
        },
        {
          icon: 'journal-check',
          title: 'cert-x7',
          text: 'cert-x8',
          link: {
            href: '/service-details/civil-registrar',
            label: 'cert-x6',
          },
        },
        {
          icon: 'flag',
          title: 'cert-x10',
          text: 'cert-x11',
          link: {
            href: 'https://psa.gov.ph/',
            label: 'cert-x9',
          },
        },
      ],
    },
    {
      title: 'cert-x12',
      intro: 'cert-x13',
      cards: [
        {
          icon: 'emoji-smile',
          title: 'cert-x15',
          text: 'cert-x16',
          link: {
            href: '/service-details/birth-certificate',
            label: 'cert-x14',
          },
        },
        {
          icon: 'heart',
          title: 'cert-x18',
          text: 'cert-x19',
          link: {
            href: '/service-details/marriage-certificate',
            label: 'cert-x17',
          },
        },
        {
          icon: 'flower1',
          title: 'cert-x21',
          text: 'cert-x22',
          link: {
            href: '/service-details/death-certificate',
            label: 'cert-x20',
          },
        },
      ],
    },
  ],
  note: {
    text: 'cert-note',
    href: 'https://bukidnon.gov.ph/',
    link: 'cert-note-link',
  },
};
