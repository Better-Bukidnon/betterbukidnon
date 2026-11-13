import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { LanguageProvider } from '@/features/i18n/LanguageProvider';
import { localeScript } from '@/features/i18n/locales';
import { Footer } from '@/features/layout/Footer';
import { Header } from '@/features/layout/Header';
import { HotlineBar } from '@/features/layout/HotlineBar';
import { SkipLink } from '@/features/layout/SkipLink';
import { PwaBanners } from '@/features/pwa/PwaBanners';
import './globals.css';

// Self-hosted from node_modules, so the build needs no network.
const inter = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  weight: '300 700',
  variable: '--font-inter',
  display: 'swap',
});

const SITE_URL = process.env.SITE_URL ?? 'https://betterbukidnon.org';

export const viewport: Viewport = { themeColor: '#0032a0' };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BetterBukidnon.org | Provincial Services Portal',
    template: '%s | BetterBukidnon.org',
  },
  description:
    'BetterBukidnon.org - Provincial services, officials, hotlines and public information for the people of Bukidnon. A volunteer civic project, not an official government website.',
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    siteName: 'BetterBukidnon.org',
    images: [{ url: '/assets/images/banners/opengraph.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/assets/images/logo/favicon.svg', apple: '/assets/images/logo/favicon.svg' },
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'BetterBukidnon' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The head script sets lang and data-locale before hydration.
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeScript }} />
      </head>
      <body>
        <LanguageProvider>
          <SkipLink />
          <HotlineBar />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <PwaBanners />
        </LanguageProvider>
      </body>
    </html>
  );
}
