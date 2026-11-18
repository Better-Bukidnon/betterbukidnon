# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 2.x     | Yes       |
| < 2.0   | No        |

## Reporting a Vulnerability

We take security seriously at BetterBukidnon.org. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, report it privately using either:

- **GitHub (preferred):** [Report a vulnerability](https://github.com/Better-Bukidnon/betterbukidnon/security/advisories/new). It's also under the Security tab → "Report a vulnerability".
- **Email:** **volunteer@betterbukidnon.org**

Include in your report:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

| Action             | Timeframe             |
| ------------------ | --------------------- |
| Acknowledgment     | Within 48 hours       |
| Initial Assessment | Within 7 days         |
| Resolution Target  | Within 30 days        |
| Public Disclosure  | After fix is deployed |

## Security Measures

### Current Implementations

**Hosting:**

- Cloudflare Workers serves the prerendered files in `apps/web/dist/client`; there is no
  application server. See [deployment.md](docs/deployment.md) and `wrangler.jsonc`.
- HTTPS and response security headers are managed at the hosting layer. This repository does
  not configure production CSP, HSTS, framing, MIME-sniffing, or referrer headers. Verify the
  active Cloudflare configuration before relying on any of them.

**Application Security:**

- No user authentication, database, or application-server processing
- Routes are prerendered to HTML; browser code provides interactive features
- Search history and the volunteer-dialog dismissal flag are stored in browser local storage
- External requests include Open-Meteo weather data, OpenStreetMap maps, and the Facebook page
  embed; check the active app sources when this list changes

**Data Security:**

- Civic data is sourced from public government portals and documented in `docs/bukidnon-facts.md`
- The app does not send search history or volunteer-dialog state to a project backend

### Third-Party Services

| Service                     | Purpose                      | Data Shared                 |
| --------------------------- | ---------------------------- | --------------------------- |
| Open-Meteo API              | Weather data                 | Bukidnon coordinates        |
| Open ER API                 | PHP exchange rate            | Browser request metadata    |
| OpenStreetMap               | Map embed and tiles          | Browser request metadata    |
| Facebook                    | Embedded page feed           | Browser request metadata    |
| Facebook Graph API (CI job) | Scheduled public news import | Page ID and access token     |

## Best Practices for Contributors

When contributing code:

1. **Never commit secrets** - API keys, passwords, or credentials
2. **Validate inputs** - Sanitize any user-facing inputs
3. **Use HTTPS** - All external resources must use HTTPS
4. **Review dependencies** - Check for known vulnerabilities
5. **Check hosting headers** - Verify the active deployment configuration before adding scripts,
   embeds, or other third-party origins.

## Scope

This security policy covers:

- The BetterBukidnon.org website
- The GitHub repository
- Associated build tools and scripts

Out of scope:

- Third-party services and APIs (Open-Meteo, Open ER API, OpenStreetMap, Facebook)
- User's local environment
- Social media accounts

## Contact

For security concerns: [report a vulnerability privately](https://github.com/Better-Bukidnon/betterbukidnon/security/advisories/new) or email **volunteer@betterbukidnon.org**

For general inquiries: open a [GitHub issue](https://github.com/Better-Bukidnon/betterbukidnon/issues)

---

Thank you for helping keep BetterBukidnon.org secure for the community.
