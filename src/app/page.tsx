import type { Metadata } from 'next';
import { HomePage } from '@/features/home/HomePage';

const title = 'BetterBukidnon.org | Bukidnon Civic Portal';
const description =
  'Services, officials, hotlines and public information for the people of Bukidnon, gathered by volunteers in one easy-to-read place.';

export const metadata: Metadata = {
  title: { absolute: title },
  description:
    'BetterBukidnon.org is a volunteer civic portal for the Province of Bukidnon: provincial services, officials, emergency hotlines, statistics and public information in English, Filipino and Cebuano.',
  alternates: { canonical: '/' },
  // Page-level openGraph/twitter replace the layout's, so the shared fields are repeated.
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    siteName: 'BetterBukidnon.org',
    url: '/',
    title,
    description,
    images: [{ url: '/assets/images/banners/opengraph.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title, description },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BetterBukidnon.org',
  alternateName: 'Better Bukidnon',
  url: 'https://betterbukidnon.org',
  description:
    'Volunteer civic portal for the Province of Bukidnon, Philippines. Not an official government website.',
  inLanguage: ['en', 'fil', 'ceb'],
  publisher: {
    '@type': 'Organization',
    name: 'BetterBukidnon volunteers',
    url: 'https://github.com/Better-Bukidnon/betterbukidnon',
  },
  about: {
    '@type': 'GovernmentOrganization',
    name: 'Provincial Government of Bukidnon',
    url: 'https://bukidnon.gov.ph',
    telephone: '+63 88 813 5741',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Provincial Capitol Compound, Barangay 9',
      addressLocality: 'Malaybalay City',
      addressRegion: 'Bukidnon',
      postalCode: '8700',
      addressCountry: 'PH',
    },
    geo: { '@type': 'GeoCoordinates', latitude: '8.1575', longitude: '125.1278' },
    areaServed: { '@type': 'AdministrativeArea', name: 'Bukidnon' },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://betterbukidnon.org/services?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage />
    </>
  );
}
