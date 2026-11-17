export const contactDirectory = {
  address: 'Provincial Capitol Compound, Barangay 9, Malaybalay City, Bukidnon 8700',
  officeHours: 'Monday to Friday, 8:00 AM–5:00 PM',
  website: 'https://bukidnon.gov.ph/',
  phone: '(088) 813-5741',
  hotlines: [
    { label: 'Emergency', display: '911', href: 'tel:911' },
    { label: 'PDRRMD', display: '(088) 813-1262', href: 'tel:+63888131262' },
    { label: 'Police', display: '(088) 813-4263', href: 'tel:+63888134263' },
    { label: 'Fire', display: '(088) 813-5449', href: 'tel:+63888135449' },
    { label: 'Provincial Health Office', display: '(088) 813-5631', href: 'tel:+63888135631' },
    { label: 'Provincial Social Welfare', display: '(088) 813-5734', href: 'tel:+63888135734' },
  ],
} as const

/** Capitol directory reproduced from the contact page's published source. */
export const capitolDirectory = [
  { office: 'main', abbreviation: '–', phone: '(088) 813-5741' },
  { office: 'pgo', abbreviation: 'PGO', phone: '(088) 813-2457' },
  { office: 'pho', abbreviation: 'PHO', phone: '(088) 813-5631', href: '/services/health' },
  { office: 'peo', abbreviation: 'PEO', phone: '(088) 813-3656', href: '/services/infrastructure' },
  { office: 'peo_waterworks', abbreviation: '–', phone: '(088) 813-3688' },
  {
    office: 'pswdo',
    abbreviation: 'PSWDO',
    phone: '(088) 813-5734',
    href: '/services/social-services',
  },
  { office: 'pto', abbreviation: 'PTO', phone: '(088) 813-2474', href: '/services/tax-payments' },
  { office: 'ppdo', abbreviation: 'PPDO', phone: '(088) 813-2564' },
  {
    office: 'pdrrmd',
    abbreviation: 'PDRRMD',
    phone: '(088) 813-1262',
    href: '/services/public-safety',
  },
  { office: 'pictd', abbreviation: 'PICTD', phone: '(088) 813-1603' },
] as const

// Bureau of Local Government Finance: the official source for LGU income and spending.
export const blgfUrl = 'https://blgf.gov.ph/'
