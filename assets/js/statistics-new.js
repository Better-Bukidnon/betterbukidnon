/**
 * Statistics Page - Data, Animations & Charts
 * Better Bukidnon Portal
 *
 * Province-level numbers in the page header are static HTML. The district
 * breakdown, the city/municipality table and both charts are rendered from
 * data/demographics.json; the CMCI block is rendered from
 * data/competitive-index.json when that file has scores. Every renderer copes
 * with a missing or empty dataset and leaves an empty-state message instead.
 */

// Brand colors
const COLORS = {
  primary: '#0032a0',
  primaryDark: '#002170',
  secondary: '#003D82',
  accent: '#F77F00',
  success: '#06A77D',
  info: '#0077BE',
};

// One color per legislative district (1st to 4th)
const DISTRICT_COLORS = [COLORS.primary, COLORS.accent, COLORS.success, '#8B5CF6'];

const ORDINALS = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' };

const DATA_URLS = {
  demographics: '../data/demographics.json',
  cmci: '../data/competitive-index.json',
};

// Chart instances
const charts = {};

// Loaded datasets
const state = {
  lgus: [],
  districts: [],
};

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatNumber(value, decimals) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '–';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals || 0,
    maximumFractionDigits: decimals || 0,
  });
}

/** Translate a key for text drawn on canvas (charts are not DOM text). */
function tr(key, fallback) {
  const engine = typeof window !== 'undefined' ? window.TranslationEngine : null;
  if (engine && typeof engine.getTranslation === 'function') {
    return engine.getTranslation(key) || fallback;
  }
  return fallback;
}

function districtText(district) {
  return (ORDINALS[district] || String(district)) + ' District';
}

function districtSpan(district) {
  const text = escapeHtml(districtText(district));
  return ORDINALS[district] ? `<span data-i18n="stats-district-${district}">${text}</span>` : text;
}

function emptyMessage(key, text) {
  return `<span data-i18n="${key}">${text}</span>`;
}

/** Fetch a JSON file; resolve to null instead of throwing. */
function loadJSON(url) {
  if (typeof fetch !== 'function') return Promise.resolve(null);
  return fetch(url)
    .then((response) => (response.ok ? response.json() : null))
    .catch((error) => {
      console.warn('[statistics] Could not load', url, error);
      return null;
    });
}

/** Keep only well-formed LGU rows. */
function normalizeLgus(data) {
  const list = data && Array.isArray(data.lgus) ? data.lgus : [];
  return list.filter(
    (lgu) =>
      lgu &&
      typeof lgu.name === 'string' &&
      typeof lgu.population_2020 === 'number' &&
      Number.isFinite(Number(lgu.district))
  );
}

/** Sum the LGU rows into one entry per legislative district. */
function groupByDistrict(lgus) {
  const byDistrict = new Map();
  lgus.forEach((lgu) => {
    const district = Number(lgu.district);
    if (!byDistrict.has(district)) {
      byDistrict.set(district, { district, population: 0, barangays: 0, lgus: [] });
    }
    const entry = byDistrict.get(district);
    entry.population += lgu.population_2020;
    entry.barangays += typeof lgu.barangays === 'number' ? lgu.barangays : 0;
    entry.lgus.push(lgu.name);
  });
  return [...byDistrict.values()].sort((a, b) => a.district - b.district);
}

/* ------------------------------------------------------------------ */
/* Animations                                                         */
/* ------------------------------------------------------------------ */

/**
 * Animate number counting
 */
function animateCount(element, target, duration = 2000) {
  if (!Number.isFinite(target)) return;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * easeOut);

    element.textContent = formatNumber(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = formatNumber(target);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Animate progress bars within an element
 */
function animateBars(container) {
  if (!container) return;
  container.querySelectorAll('.bar-wrap .bar').forEach((bar) => {
    const width = bar.dataset.width;
    if (width) {
      setTimeout(() => {
        bar.style.width = width + '%';
      }, 100);
    }
  });
}

/**
 * Intersection Observer for scroll animations
 */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.animate-on-scroll, .metric-card');

  if (typeof IntersectionObserver === 'undefined') {
    targets.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');

            // Count-up animation for metric cards
            const countEl = entry.target.querySelector('[data-count]');
            if (countEl) {
              animateCount(countEl, parseInt(countEl.dataset.count, 10));
            }

            animateBars(entry.target);
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------------ */
/* Renderers                                                          */
/* ------------------------------------------------------------------ */

/**
 * Population by legislative district (list beside the doughnut chart)
 */
function renderDistrictList(districts) {
  const list = document.getElementById('district-list');
  if (!list) return;

  if (!districts.length) {
    list.innerHTML = `<p class="stats-empty">${emptyMessage(
      'stats-no-data',
      'We are still gathering this information.'
    )}</p>`;
    return;
  }

  const max = Math.max(...districts.map((d) => d.population));
  const total = districts.reduce((sum, d) => sum + d.population, 0);

  list.innerHTML = districts
    .map((d, i) => {
      const width = max > 0 ? Math.round((d.population / max) * 100) : 0;
      const share = total > 0 ? ((d.population / total) * 100).toFixed(1) : '0.0';
      const color = DISTRICT_COLORS[i % DISTRICT_COLORS.length];
      return `
        <div class="district-row" style="--district-color: ${color}">
          <span class="district-name">${districtSpan(d.district)}</span>
          <span class="district-pop">${formatNumber(d.population)} <small>(${share}%)</small></span>
          <div class="bar-wrap"><div class="bar" data-width="${width}"></div></div>
          <span class="district-lgus">${d.lgus.map(escapeHtml).join(', ')}</span>
        </div>`;
    })
    .join('');

  // The section may already be visible by the time the data arrives
  animateBars(list);
}

/**
 * City and municipality table
 */
function renderLguTable(lgus) {
  const body = document.getElementById('lgu-table-body');
  const foot = document.getElementById('lgu-table-foot');
  if (!body) return;

  if (!lgus.length) {
    body.innerHTML = `<tr><td colspan="5" class="stats-empty">${emptyMessage(
      'stats-no-data',
      'We are still gathering this information.'
    )}</td></tr>`;
    if (foot) foot.innerHTML = '';
    return;
  }

  const sorted = [...lgus].sort((a, b) => a.name.localeCompare(b.name));

  body.innerHTML = sorted
    .map((lgu) => {
      const capital = lgu.capital
        ? ' <small class="stats-capital" data-i18n="stats-capital">(capital)</small>'
        : '';
      return `
        <tr>
          <th scope="row">${escapeHtml(lgu.name)}${capital}</th>
          <td>${districtSpan(Number(lgu.district))}</td>
          <td class="num">${formatNumber(lgu.population_2020)}</td>
          <td class="num">${formatNumber(lgu.area_km2, 2)}</td>
          <td class="num">${formatNumber(lgu.barangays)}</td>
        </tr>`;
    })
    .join('');

  if (foot) {
    const sum = (key) =>
      lgus.reduce((total, lgu) => total + (typeof lgu[key] === 'number' ? lgu[key] : 0), 0);
    foot.innerHTML = `
      <tr>
        <th scope="row" colspan="2" data-i18n="stats-total-province">Province of Bukidnon</th>
        <td class="num">${formatNumber(sum('population_2020'))}</td>
        <td class="num">${formatNumber(Math.round(sum('area_km2') * 100) / 100, 2)}</td>
        <td class="num">${formatNumber(sum('barangays'))}</td>
      </tr>`;
  }
}

/**
 * CMCI scores (only when data/competitive-index.json has been filled in)
 */
function renderCMCI(data) {
  const target = document.getElementById('cmci-data');
  const empty = document.getElementById('cmci-empty');
  if (!target) return;

  const years = data && Array.isArray(data.years) ? data.years : [];
  const pillars = data && Array.isArray(data.pillars) ? data.pillars : [];
  const overall = data && Array.isArray(data.overall) ? data.overall : [];
  if (!years.length || (!pillars.length && !overall.length)) return; // keep the empty state

  const cell = (value) =>
    `<td class="num">${typeof value === 'number' ? formatNumber(value, 2) : '–'}</td>`;
  const row = (label, scores) =>
    `<tr><th scope="row">${label}</th>${years
      .map((_, i) => cell(Array.isArray(scores) ? scores[i] : null))
      .join('')}</tr>`;

  let rows = '';
  if (overall.length) {
    rows += row('<span data-i18n="stats-cmci-overall">Overall score</span>', overall);
  }
  pillars.forEach((pillar) => {
    if (pillar) rows += row(escapeHtml(pillar.name || pillar.id || ''), pillar.scores);
  });

  target.innerHTML = `
    <table class="data-table stats-lgu-table">
      <thead>
        <tr>
          <th scope="col" data-i18n="stats-cmci-pillar">Pillar</th>
          ${years.map((y) => `<th scope="col" class="num">${escapeHtml(y)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
  target.hidden = false;
  if (empty) empty.hidden = true;
}

/* ------------------------------------------------------------------ */
/* Charts                                                             */
/* ------------------------------------------------------------------ */

function chartsAvailable() {
  return typeof Chart !== 'undefined';
}

/** Replace a chart's canvas with a short message. */
function showChartFallback(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !canvas.parentElement) return;
  const wrapper = canvas.parentElement;
  wrapper.classList.add('chart-wrapper-empty');
  wrapper.innerHTML = `<p class="stats-empty">${emptyMessage(
    'stats-chart-unavailable',
    'The chart could not be shown. The same figures are in the table on this page.'
  )}</p>`;
}

const tooltipStyle = {
  backgroundColor: 'rgba(0, 50, 160, 0.95)',
  titleFont: { size: 14, weight: '600' },
  bodyFont: { size: 13 },
  padding: 12,
  cornerRadius: 8,
};

/**
 * Doughnut chart: 2020 population by legislative district
 */
function createDistrictChart() {
  const ctx = document.getElementById('districtChart');
  if (!ctx || charts.district) return;
  if (!chartsAvailable() || !state.districts.length) {
    showChartFallback('districtChart');
    return;
  }

  charts.district = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: state.districts.map((d) =>
        tr(`stats-district-${d.district}`, districtText(d.district))
      ),
      datasets: [
        {
          data: state.districts.map((d) => d.population),
          backgroundColor: state.districts.map(
            (_, i) => DISTRICT_COLORS[i % DISTRICT_COLORS.length]
          ),
          borderColor: '#fff',
          borderWidth: 3,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { animateRotate: true, animateScale: true, duration: 1500 },
      cutout: '55%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 14, padding: 12, font: { size: 12 }, usePointStyle: true },
        },
        tooltip: {
          ...tooltipStyle,
          callbacks: {
            label: (item) => {
              const total = item.dataset.data.reduce((a, b) => a + b, 0);
              const pct = total > 0 ? ((item.raw / total) * 100).toFixed(1) : '0.0';
              return `${formatNumber(item.raw)} (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

/**
 * Horizontal bar chart: 2020 population of each city and municipality
 */
function createBarChart() {
  const ctx = document.getElementById('populationBarChart');
  if (!ctx || charts.bar) return;
  if (!chartsAvailable() || !state.lgus.length) {
    showChartFallback('populationBarChart');
    return;
  }

  const sorted = [...state.lgus].sort((a, b) => b.population_2020 - a.population_2020);
  const populationLabel = tr('stats-population', 'Population');

  charts.bar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sorted.map((lgu) => lgu.name),
      datasets: [
        {
          label: populationLabel,
          data: sorted.map((lgu) => lgu.population_2020),
          backgroundColor: sorted.map(
            (lgu) => DISTRICT_COLORS[(Number(lgu.district) - 1) % DISTRICT_COLORS.length]
          ),
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1500, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipStyle,
          displayColors: false,
          callbacks: {
            label: (item) => `${populationLabel}: ${formatNumber(item.raw)}`,
            afterLabel: (item) => {
              const lgu = sorted[item.dataIndex];
              return lgu ? tr(`stats-district-${lgu.district}`, districtText(lgu.district)) : '';
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { size: 11 }, callback: (v) => formatNumber(v) },
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 11 }, autoSkip: false },
        },
      },
    },
  });
}

/**
 * Create charts when their canvas scrolls into view
 */
function initCharts() {
  const creators = {
    districtChart: createDistrictChart,
    populationBarChart: createBarChart,
  };
  const canvases = Object.keys(creators)
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (typeof IntersectionObserver === 'undefined') {
    canvases.forEach((canvas) => creators[canvas.id]());
    return;
  }

  const chartObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          creators[entry.target.id]();
          chartObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  canvases.forEach((canvas) => chartObserver.observe(canvas));
}

/* ------------------------------------------------------------------ */
/* Init                                                               */
/* ------------------------------------------------------------------ */

function initStatisticsPage() {
  initScrollAnimations();

  const demographicsReady = loadJSON(DATA_URLS.demographics).then((data) => {
    state.lgus = normalizeLgus(data);
    state.districts = groupByDistrict(state.lgus);
    renderDistrictList(state.districts);
    renderLguTable(state.lgus);
    initCharts();
  });

  const cmciReady = loadJSON(DATA_URLS.cmci).then(renderCMCI);

  return Promise.all([demographicsReady, cmciReady]).catch((error) => {
    console.error('[statistics] Failed to render statistics:', error);
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initStatisticsPage);
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    COLORS,
    DISTRICT_COLORS,
    animateCount,
    formatNumber,
    normalizeLgus,
    groupByDistrict,
    renderDistrictList,
    renderLguTable,
    renderCMCI,
    initStatisticsPage,
  };
}
