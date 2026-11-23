# Legacy static-site archive

The retired root static site is preserved by the annotated Git tag
`legacy-static-site-pre-70-org-develop`, which points to commit
`495a0efb9da0bcee9c42696c4ba220e88c3f0034` (the state immediately before issue #70 cleanup).
After merging this change, publish the tag with:

```bash
git push origin legacy-static-site-pre-70-org-develop
```

Use `git switch --detach legacy-static-site-pre-70-org-develop` to inspect or recover the former HTML,
CSS, JavaScript, browser fixtures, and parity tools.

## Retained compatibility

- `apps/web/public/_redirects` permanently redirects the former `*.html` URLs to canonical app
  routes.
- `/barangays/profile?code=…` remains the public compatibility route and redirects to the
  canonical barangay profile when the code is recognized.
- App-owned public assets, source data, build tooling, SEO checks, and Cloudflare configuration
  remain in the repository.

## Removed by issue #70

- Root HTML pages and their static-site runtime files.
- The legacy `assets/` tree after app-owned equivalents were verified.
- Static-site Chrome regeneration, Playwright fixtures, and screenshot/parity utilities.

The only production runtime is now the prerendered application in `apps/web`, deployed from
`apps/web/dist/client`.
