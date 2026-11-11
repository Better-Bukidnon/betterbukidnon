import type { Category } from '@/features/services/types';

/** Converted from legacy/services/tax-payments.html. */
export const taxPayments: Category = {
  crumb: 'tax-bc',
  icon: 'cash-coin',
  badge: 'tax-badge',
  title: 'tax-h1',
  desc: 'tax-hdesc',
  contacts: [
    {
      href: 'tel:0888132474',
      label: 'tax-x1',
      value: 'tax-x2',
    },
  ],
  sections: [
    {
      title: 'tax-x3',
      intro: 'tax-x4',
      cards: [
        {
          icon: 'house',
          title: 'tax-x6',
          text: 'tax-x7',
          link: {
            href: '/service-details/provincial-treasurer',
            label: 'tax-x5',
          },
        },
        {
          icon: 'building',
          title: 'tax-x9',
          text: 'tax-x10',
          link: {
            href: '/government#lgus',
            label: 'tax-x8',
          },
        },
        {
          icon: 'file-earmark-ruled',
          title: 'tax-x12',
          text: 'tax-x13',
          link: {
            href: '/service-details/property-declaration',
            label: 'tax-x11',
          },
        },
      ],
    },
    {
      title: 'tax-x14',
      intro: 'tax-x15',
      cards: [
        {
          icon: 'person-vcard',
          title: 'tax-x17',
          text: 'tax-x18',
          link: {
            href: '/government#lgus',
            label: 'tax-x16',
          },
        },
        {
          icon: 'shop',
          title: 'tax-x20',
          text: 'tax-x21',
          link: {
            href: '/service-details/business-permits-licensing',
            label: 'tax-x19',
          },
        },
        {
          icon: 'receipt',
          title: 'tax-x23',
          text: 'tax-x24',
          link: {
            href: '/service-details/provincial-treasurer',
            label: 'tax-x22',
          },
        },
      ],
    },
  ],
  note: {
    text: 'tax-note',
    href: 'https://bukidnon.gov.ph/',
    link: 'tax-note-link',
  },
};
