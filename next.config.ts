import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

// Office pages (src/content/service-details/**.mdx) compile at build time. Plugins are named by
// string so Turbopack can pass them to the loader; frontmatter becomes `export const frontmatter`.
const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-frontmatter'], ['remark-mdx-frontmatter', { name: 'frontmatter' }]],
  },
});

export default function config(phase: string): NextConfig {
  return withMDX({
    // Fully static: `next build` writes out/, and scripts/merge-legacy.js turns it into dist/.
    output: 'export',
    // /services/health is exported as services/health.html, which Cloudflare's
    // html_handling "auto-trailing-slash" serves at the same clean URL as before.
    trailingSlash: false,
    // `page.dev.tsx` routes (the admin news editor) exist only under `next dev`;
    // scripts/postbuild.js fails the build if one reaches out/.
    pageExtensions: phase === PHASE_DEVELOPMENT_SERVER ? ['dev.tsx', 'tsx', 'ts'] : ['tsx', 'ts'],
    images: { unoptimized: true },
    poweredByHeader: false,
    // Stop Next from picking up a workspace file above the repo.
    turbopack: { root: __dirname },
    reactStrictMode: true,
    env: {
      SITE_URL: process.env.SITE_URL || 'https://betterbukidnon.org',
    },
  });
}
