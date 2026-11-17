import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = join(root, 'apps/web/dist/client');
const redirectsPath = join(root, 'apps/web/public/_redirects');
const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...values] = arg.replace(/^--/, '').split('=');
    return [key, values.join('=')];
  })
);

if (!args.routes) {
  console.error(
    'Choose routes to keep runs targeted. Example:\n' +
      '  pnpm visual:parity -- --routes=/,/projects --locales=en,fil --widths=1366,375'
  );
  process.exit(1);
}

if (!existsSync(clientDir)) {
  console.error('Build the app first with `pnpm build`.');
  process.exit(1);
}

const routes = args.routes.split(',').map(normalizeRoute);
const locales = (args.locales || 'en').split(',');
const widths = (args.widths || '1366,375').split(',').map(Number);
const height = Number(args.height || 900);
const browserName = args.browser || 'chromium';
const outputDir = resolve(root, args.out || 'screenshots/parity');
const redirectMap = new Map();

for (const line of readFileSync(redirectsPath, 'utf8').split(/\r?\n/)) {
  const [source, target] = line.trim().split(/\s+/);
  if (source?.startsWith('/') && target?.startsWith('/')) redirectMap.set(target, source);
}
redirectMap.set('/404', '/404.html');

const pages = routes.map((route) => {
  const legacyPath = redirectMap.get(route);
  if (!legacyPath) throw new Error(`No legacy URL mapping for ${route} in ${redirectsPath}`);
  const absoluteLegacyPath = resolve(root, `.${legacyPath}`);
  if (
    (absoluteLegacyPath !== root && !absoluteLegacyPath.startsWith(`${root}${sep}`)) ||
    !existsSync(absoluteLegacyPath)
  ) {
    throw new Error(`Legacy page does not exist: ${legacyPath}`);
  }
  return { route, legacyPath };
});

const servers = [];
let browser;

try {
  const legacy = await startStaticServer(root);
  servers.push(legacy);
  const app = await startStaticServer(clientDir);
  servers.push(app);

  const browserType = { chromium, firefox, webkit }[browserName];
  if (!browserType) throw new Error(`Unsupported browser: ${browserName}`);
  browser = await browserType.launch({ headless: true });
  mkdirSync(outputDir, { recursive: true });
  const captures = [];

  for (const width of widths) {
    for (const locale of locales) {
      if (!['en', 'fil', 'ceb'].includes(locale)) throw new Error(`Unsupported locale: ${locale}`);
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
        serviceWorkers: 'block',
      });
      await context.addInitScript((selectedLocale) => {
        localStorage.setItem('selectedLang', selectedLocale);
        localStorage.setItem('bb-vol-popup-v1', '1');
      }, locale);

      for (const { route, legacyPath } of pages) {
        const appPath = locale === 'en' ? route : `/${locale}${route === '/' ? '' : route}`;
        const name = fileName(`${route === '/' ? 'home' : route.slice(1)}-${locale}-${width}`);
        const legacyPage = await context.newPage();
        const appPage = await context.newPage();

        await Promise.all([
          visit(legacyPage, `${legacy.base}${legacyPath}`),
          visit(appPage, `${app.base}${appPath}`),
        ]);
        await Promise.all([prepareFullPage(legacyPage), prepareFullPage(appPage)]);
        const legacyViewport = `${name}-legacy-top.png`;
        const appViewport = `${name}-app-top.png`;
        const legacyImage = `${name}-legacy-full.png`;
        const appImage = `${name}-app-full.png`;
        await legacyPage.screenshot({ path: join(outputDir, legacyViewport) });
        await appPage.screenshot({ path: join(outputDir, appViewport) });
        await legacyPage.screenshot({ path: join(outputDir, legacyImage), fullPage: true });
        await appPage.screenshot({ path: join(outputDir, appImage), fullPage: true });

        captures.push({ route, locale, width, legacyViewport, appViewport, legacyImage, appImage });
        console.log(`${route} (${locale}, ${width}px)`);
        await legacyPage.close();
        await appPage.close();
      }
      await context.close();
    }
  }

  writeFileSync(join(outputDir, 'manifest.json'), `${JSON.stringify(captures, null, 2)}\n`);
  writeFileSync(join(outputDir, 'index.html'), renderReport(captures));
  console.log(`\nSaved ${captures.length} viewport and full-page pairs to ${outputDir}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await browser?.close();
  await Promise.all(servers.map((server) => stop(server.process)));
}

function normalizeRoute(route) {
  if (route === '/' || route === '') return '/';
  return `/${route.replace(/^\/+|\/+$/g, '')}`;
}

function fileName(value) {
  return value.replace(/[^a-zA-Z0-9-]+/g, '-');
}

async function visit(page, url) {
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
  if (response && response.status() >= 400) {
    throw new Error(`Page returned ${response.status()}: ${url}`);
  }
  await page.addStyleTag({
    content:
      '*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important;scroll-behavior:auto!important}',
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle', { timeout: 2500 }).catch(() => {});
}

async function prepareFullPage(page) {
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let top = 0; top < pageHeight; top += 800) {
    await page.evaluate((y) => window.scrollTo(0, y), top);
    await page.waitForTimeout(40);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(
    () =>
      new Promise((resolveFrame) =>
        requestAnimationFrame(() => requestAnimationFrame(resolveFrame))
      )
  );
  await page.waitForTimeout(300);
}

async function startStaticServer(directory) {
  const port = await availablePort();
  const child = spawn(
    'python3',
    ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', directory],
    { stdio: 'ignore' }
  );
  const base = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Static server exited for ${directory}`);
    try {
      const response = await fetch(base);
      const ready = response.ok;
      await response.arrayBuffer();
      if (ready) return { base, process: child };
    } catch {
      await new Promise((resolveWait) => setTimeout(resolveWait, 100));
    }
  }
  child.kill('SIGTERM');
  throw new Error(`Timed out starting static server for ${directory}`);
}

async function availablePort() {
  const server = createServer();
  await new Promise((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolveListen);
  });
  const { port } = server.address();
  await new Promise((resolveClose) => server.close(resolveClose));
  return port;
}

function stop(child) {
  return new Promise((resolveStop) => {
    if (child.exitCode !== null || child.signalCode !== null) return resolveStop();
    child.once('exit', resolveStop);
    child.kill('SIGTERM');
  });
}

function renderReport(captures) {
  const rows = captures
    .map(
      ({ route, locale, width, legacyViewport, appViewport, legacyImage, appImage }, index) => `
        <section class="capture">
          <h2>${escapeHtml(route)} <small>${locale} · ${width}px</small></h2>
          <h3>Viewport</h3>
          <label>App opacity <input type="range" min="0" max="100" value="50" data-overlay="viewport-${index}"></label>
          <div class="pair" id="viewport-${index}">
            <img src="${legacyViewport}" alt="Legacy ${escapeHtml(route)} at ${width}px, viewport">
            <img class="overlay" src="${appViewport}" alt="Migrated app ${escapeHtml(route)} at ${width}px, viewport">
          </div>
          <h3>Full page</h3>
          <label>App opacity <input type="range" min="0" max="100" value="50" data-overlay="full-${index}"></label>
          <div class="pair" id="full-${index}">
            <img src="${legacyImage}" alt="Legacy ${escapeHtml(route)} at ${width}px">
            <img class="overlay" src="${appImage}" alt="Migrated app ${escapeHtml(route)} at ${width}px">
          </div>
          <p><a href="${legacyImage}">Legacy full page</a> · <a href="${appImage}">App full page</a></p>
        </section>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Visual parity review</title>
<style>
  body{font:16px/1.5 system-ui,sans-serif;margin:24px;color:#172033;background:#f5f7fa}
  h1{margin:0 0 8px}h2{font-size:1.1rem}.capture{padding:20px;margin:20px 0;background:white;border:1px solid #dce2ea;border-radius:12px}
  small{font-weight:400;color:#526174;margin-left:8px}label{display:flex;align-items:center;gap:10px;margin:8px 0}
  input{width:220px}.pair{position:relative;display:inline-block;max-width:100%;line-height:0;background:#ddd}
  .pair img{display:block;width:auto;max-width:100%;height:auto}.pair .overlay{position:absolute;inset:0;opacity:.5}
  p{font-size:.85rem;margin-bottom:0}a{color:#0032a0}
</style>
<h1>Visual parity review</h1>
<p>Compare the legacy capture with the app capture. Use the slider to fade the app over the legacy image.
  Dynamic data and external map tiles can vary between captures.</p>
${rows}
<script>
  document.querySelectorAll('[data-overlay]').forEach((slider)=>slider.addEventListener('input',()=>{
    document.querySelector('#'+slider.dataset.overlay+' .overlay').style.opacity=slider.value/100
  }))
</script>
</html>`;
}

function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char]
  );
}
