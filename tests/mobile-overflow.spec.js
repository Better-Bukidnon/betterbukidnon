// @ts-check
// Page content must fit a phone screen: nothing inside <main> may be wider than the
// viewport, because that makes the whole page scroll sideways (issue #31).
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Every page in sitemap.xml, as a path on the local server
const PAGES = [
  ...fs
    .readFileSync(path.join(__dirname, '..', 'sitemap.xml'), 'utf8')
    .matchAll(/<loc>([^<]+)<\/loc>/g),
].map((m) => {
  const pathname = new URL(m[1]).pathname;
  return pathname.endsWith('/') ? pathname : `${pathname}.html`;
});

const WIDTHS = [375, 412];

/** How many pixels the content of <main> sticks out past its own box. */
const mainOverflow = (page) =>
  page.evaluate(() => {
    const main = document.querySelector('main');
    return main ? main.scrollWidth - main.clientWidth : 0;
  });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('bb-vol-popup-v1', '1'));
  // Local files only: map tiles, feeds and web fonts are not part of the layout under test
  await page.route('**/*', (route) =>
    route.request().url().startsWith('http://localhost') ? route.continue() : route.abort()
  );
});

for (const width of WIDTHS) {
  test(`no page content is wider than a ${width}px screen`, async ({ page }, info) => {
    test.skip(info.project.name !== 'chrome', 'layout check at a fixed width, run once');
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 800 });

    const tooWide = [];
    for (const url of PAGES) {
      await page.goto(url, { waitUntil: 'load' });
      const overflow = await mainOverflow(page);
      if (overflow > 0) tooWide.push(`${url}: ${overflow}px too wide`);
    }
    expect(tooWide).toEqual([]);
  });
}

test.describe('tables on a phone', () => {
  test.beforeEach(async ({ page }, info) => {
    test.skip(info.project.name !== 'chrome', 'layout check at a fixed width, run once');
    await page.setViewportSize({ width: 375, height: 800 });
  });

  test('the civil registry table fits or scrolls inside its own box', async ({ page }) => {
    await page.goto('/service-details/civil-registrar.html');
    const wrapper = page.locator('.table-responsive').first();
    await expect(wrapper).toBeVisible();
    const box = await wrapper.boundingBox();
    expect(box.x + box.width).toBeLessThanOrEqual(375);
    expect(await wrapper.evaluate((el) => getComputedStyle(el).overflowX)).toBe('auto');
  });

  test('the business permit steps table shows all three columns', async ({ page }) => {
    await page.goto('/service-details/business-permits-licensing.html');
    const lastHeader = page.locator('.process-table thead th').last();
    await expect(lastHeader).toBeVisible();
    const box = await lastHeader.boundingBox();
    expect(box.x + box.width).toBeLessThanOrEqual(375);
  });

  // The data files are empty until records are added, so serve one record to render the table
  for (const kind of ['resolution', 'ordinance']) {
    test(`the ${kind} table stays inside the screen when it has records`, async ({ page }) => {
      await page.route(`**/data/${kind}s.json`, (route) =>
        route.fulfill({
          json: {
            [`${kind}s`]: [
              {
                [`${kind}No`]: '2026-001',
                title:
                  'A measure with a long title, as most of them have, appropriating funds for the ' +
                  'repair and maintenance of provincial roads and bridges in the four districts',
                sessionDate: '2026-01-15',
              },
            ],
          },
        })
      );
      await page.goto(`/legislative/${kind}-framework.html`);
      await expect(page.locator(`#${kind}-table-body tr`)).toHaveCount(1);
      await expect(page.locator(`#${kind}-table-wrap`)).toBeVisible();
      expect(await mainOverflow(page)).toBe(0);
    });
  }
});
