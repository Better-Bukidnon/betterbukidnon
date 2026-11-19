import type { Category } from '@/features/services/types';

/** Converted from fce5da9:services/business.html. */
export const business: Category = {
  crumb: 'biz-bc',
  icon: 'shop',
  badge: 'biz-badge',
  title: 'biz-h1',
  desc: 'biz-hdesc',
  contacts: [],
  sections: [
    {
      title: 'biz-x1',
      intro: 'biz-x2',
      cards: [
        {
          icon: 'building',
          title: 'biz-x4',
          text: 'biz-x5',
          link: {
            href: '/government#lgus',
            label: 'biz-x3',
          },
        },
        {
          icon: 'file-earmark-text',
          title: 'biz-x7',
          text: 'biz-x8',
          link: {
            href: '/service-details/business-permits-licensing',
            label: 'biz-x6',
          },
        },
        {
          icon: 'clipboard-check',
          title: 'biz-x9',
          text: 'biz-x10',
        },
      ],
    },
    {
      title: 'biz-x11',
      intro: 'biz-x12',
      cards: [
        {
          icon: 'cash-coin',
          title: 'biz-x14',
          text: 'biz-x15',
          link: {
            href: '/service-details/provincial-treasurer',
            label: 'biz-x13',
          },
        },
        {
          icon: 'diagram-3',
          title: 'biz-x17',
          text: 'biz-x18',
          link: {
            href: '/service-details/provincial-planning',
            label: 'biz-x16',
          },
        },
        {
          icon: 'geo-alt',
          title: 'biz-x20',
          text: 'biz-x21',
          link: {
            href: '/government#lgus',
            label: 'biz-x19',
          },
        },
      ],
    },
  ],
  note: {
    text: 'biz-note',
    href: 'https://bukidnon.gov.ph/',
    link: 'biz-note-link',
  },
};
