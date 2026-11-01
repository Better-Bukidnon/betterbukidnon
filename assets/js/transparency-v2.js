/**
 * Transparency Page V2 - Interactive Financial Dashboard
 *
 * Figures come from data/fiscal_transparency.json (amounts in millions of pesos).
 * The page shows an empty state with links to the official sources until that
 * file has at least one fiscal year with one reporting period. Expected shape:
 *
 *   {
 *     "fiscal_years": [
 *       {
 *         "year": 2025,
 *         "source_url": "https://blgf.gov.ph/",
 *         "periods": [
 *           {
 *             "id": "q1", "label": "Q1", "range": "Jan - Mar",
 *             "income": { "local": 0, "external": 0, "total": 0 },
 *             "expenditures": { "gps": 0, "social": 0, "economic": 0, "debt": 0, "total": 0 },
 *             "netIncome": 0,
 *             "fundBalance": 0
 *           }
 *         ]
 *       }
 *     ]
 *   }
 */

const FISCAL_DATA_URL = '../data/fiscal_transparency.json';

// Periods of the latest fiscal year, keyed by period id (filled at runtime)
const FINANCIAL_DATA = {};
let periodOrder = [];
let currentYear = null;

// Chart instances
let incomeChart = null;
let expenditureChart = null;
let currentQuarter = null;

/**
 * Format number as Philippine Peso in millions
 */
function formatPeso(value) {
  const num = Number(value);
  if (!isFinite(num)) return '—';
  return `₱${num.toFixed(2)} M`;
}

/**
 * Calculate percentage
 */
function calcPercent(value, total) {
  const v = Number(value);
  const t = Number(total);
  if (!isFinite(v) || !isFinite(t) || t === 0) return '—';
  return ((v / t) * 100).toFixed(1) + '%';
}

function toNumber(value) {
  const num = Number(value);
  return isFinite(num) ? num : 0;
}

/**
 * Normalize one reporting period; returns null if it has no usable figures.
 */
function normalizePeriod(period) {
  if (!period || typeof period !== 'object' || !period.id) return null;
  const income = period.income || {};
  const exp = period.expenditures || {};
  const normalized = {
    id: String(period.id),
    label: String(period.label || period.id),
    range: String(period.range || ''),
    income: {
      local: toNumber(income.local),
      external: toNumber(income.external),
      total: toNumber(income.total) || toNumber(income.local) + toNumber(income.external),
    },
    expenditures: {
      gps: toNumber(exp.gps),
      social: toNumber(exp.social),
      economic: toNumber(exp.economic),
      debt: toNumber(exp.debt),
      total:
        toNumber(exp.total) ||
        toNumber(exp.gps) + toNumber(exp.social) + toNumber(exp.economic) + toNumber(exp.debt),
    },
    netIncome: toNumber(period.netIncome),
    fundBalance: toNumber(period.fundBalance),
  };
  if (normalized.income.total === 0 && normalized.expenditures.total === 0) return null;
  return normalized;
}

/**
 * Pick the latest fiscal year that has at least one usable period.
 * Fills FINANCIAL_DATA / periodOrder and returns the year object, or null.
 */
function selectLatestYear(data) {
  const years = Array.isArray(data && data.fiscal_years) ? data.fiscal_years.slice() : [];
  years.sort((a, b) => toNumber(b && b.year) - toNumber(a && a.year));

  for (const year of years) {
    const periods = (Array.isArray(year && year.periods) ? year.periods : [])
      .map(normalizePeriod)
      .filter(Boolean);
    if (periods.length) {
      Object.keys(FINANCIAL_DATA).forEach((key) => delete FINANCIAL_DATA[key]);
      periods.forEach((p) => {
        FINANCIAL_DATA[p.id] = p;
      });
      periodOrder = periods.map((p) => p.id);
      return year;
    }
  }
  return null;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/**
 * Animate value change
 */
function animateValue(element, newValue) {
  if (!element) return;
  element.classList.add('updating');
  setTimeout(() => {
    element.textContent = newValue;
    element.classList.remove('updating');
  }, 150);
}

/**
 * Update all displayed values for selected period
 */
function updateDisplay(quarter) {
  const data = FINANCIAL_DATA[quarter];
  if (!data) return;

  // Update metrics
  animateValue(document.getElementById('sre-total-income'), formatPeso(data.income.total));
  animateValue(document.getElementById('sre-total-expense'), formatPeso(data.expenditures.total));
  animateValue(document.getElementById('sre-net-income'), formatPeso(data.netIncome));
  animateValue(document.getElementById('sre-fund-balance'), formatPeso(data.fundBalance));

  // Update income breakdown
  const incomeTotal = data.income.total;
  setText('sre-income-local', formatPeso(data.income.local));
  setText('sre-income-local-pct', calcPercent(data.income.local, incomeTotal));
  setText('sre-income-external', formatPeso(data.income.external));
  setText('sre-income-external-pct', calcPercent(data.income.external, incomeTotal));

  // Update expenditure breakdown
  const exp = data.expenditures;
  setText('sre-exp-gps', formatPeso(exp.gps));
  setText('sre-exp-gps-pct', calcPercent(exp.gps, exp.total));
  setText('sre-exp-social', formatPeso(exp.social));
  setText('sre-exp-social-pct', calcPercent(exp.social, exp.total));
  setText('sre-exp-economic', formatPeso(exp.economic));
  setText('sre-exp-economic-pct', calcPercent(exp.economic, exp.total));
  setText('sre-exp-debt', formatPeso(exp.debt));
  setText('sre-exp-debt-pct', calcPercent(exp.debt, exp.total));

  // Update charts
  if (incomeChart) {
    incomeChart.data.datasets[0].data = [data.income.local, data.income.external];
    incomeChart.update('active');
  }

  if (expenditureChart) {
    expenditureChart.data.datasets[0].data = [exp.gps, exp.social, exp.economic, exp.debt];
    expenditureChart.update('active');
  }
}

/**
 * Initialize charts with Chart.js
 */
function initCharts() {
  const incomeCtx = document.getElementById('incomeChartV2');
  const expenditureCtx = document.getElementById('expenditureChartV2');

  if (!incomeCtx || !expenditureCtx || typeof Chart === 'undefined') return;

  const data = FINANCIAL_DATA[currentQuarter];
  if (!data) return;

  // Chart.js default options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    layout: {
      padding: 4,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        titleFont: { size: 13, weight: '600' },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            return `₱${Number(context.raw).toFixed(2)} M`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 600,
      easing: 'easeOutQuart',
    },
  };

  // Income Chart
  incomeChart = new Chart(incomeCtx, {
    type: 'doughnut',
    data: {
      labels: ['Local Sources', 'External Sources'],
      datasets: [
        {
          data: [data.income.local, data.income.external],
          backgroundColor: ['#10b981', '#0ea5e9'],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 0,
          hoverBorderWidth: 3,
          hoverBorderColor: '#ffffff',
        },
      ],
    },
    options: chartOptions,
  });

  // Store original colors for highlight/restore
  incomeChart._originalColors = ['#10b981', '#0ea5e9'];

  // Expenditure Chart
  expenditureChart = new Chart(expenditureCtx, {
    type: 'doughnut',
    data: {
      labels: ['General Public Services', 'Social Services', 'Economic Services', 'Debt Service'],
      datasets: [
        {
          data: [
            data.expenditures.gps,
            data.expenditures.social,
            data.expenditures.economic,
            data.expenditures.debt,
          ],
          backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 0,
          hoverBorderWidth: 3,
          hoverBorderColor: '#ffffff',
        },
      ],
    },
    options: chartOptions,
  });

  // Store original colors for highlight/restore
  expenditureChart._originalColors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
}

/**
 * Build the period toggle buttons from the loaded periods
 */
function initPeriodToggle() {
  const toggle = document.getElementById('sre-period-toggle');
  if (!toggle) return;

  toggle.innerHTML = '';
  if (periodOrder.length < 2) {
    toggle.hidden = true;
    return;
  }

  periodOrder.forEach((id) => {
    const period = FINANCIAL_DATA[id];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sre-period-btn' + (id === currentQuarter ? ' active' : '');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', id === currentQuarter ? 'true' : 'false');
    btn.dataset.quarter = id;

    const q = document.createElement('span');
    q.className = 'sre-period-q';
    q.textContent = period.label;
    btn.appendChild(q);

    if (period.range) {
      const range = document.createElement('span');
      range.className = 'sre-period-range';
      range.textContent = period.range;
      btn.appendChild(range);
    }

    btn.addEventListener('click', function () {
      const quarter = this.dataset.quarter;
      if (quarter === currentQuarter) return;

      toggle.querySelectorAll('.sre-period-btn').forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      currentQuarter = quarter;
      updateDisplay(quarter);
    });

    toggle.appendChild(btn);
  });
  toggle.hidden = false;
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  if (typeof IntersectionObserver === 'undefined') {
    // Fallback: show all elements
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Initialize breakdown item hover effects
 */
function initBreakdownInteractions() {
  const items = document.querySelectorAll('.sre-breakdown-item');

  items.forEach((item) => {
    item.addEventListener('mouseenter', function () {
      highlightChartSegment(this.dataset.type, true);
    });

    item.addEventListener('mouseleave', function () {
      highlightChartSegment(this.dataset.type, false);
    });
  });
}

/**
 * Highlight chart segment on hover
 */
function highlightChartSegment(type, highlight) {
  const incomeTypes = ['local', 'external'];
  const expTypes = ['gps', 'social', 'economic', 'debt'];

  let chart = null;
  let index = -1;

  if (incomeTypes.includes(type)) {
    chart = incomeChart;
    index = incomeTypes.indexOf(type);
  } else if (expTypes.includes(type)) {
    chart = expenditureChart;
    index = expTypes.indexOf(type);
  }

  if (chart && index >= 0) {
    const dataset = chart.data.datasets[0];

    if (highlight) {
      // Dim other segments instead of displacing the hovered one
      const dimmedColors = dataset.backgroundColor.map((color, i) => {
        if (i === index) return color;
        return color + '40';
      });
      dataset.hoverBackgroundColor = dimmedColors;
      dataset.backgroundColor = dimmedColors;
      dataset.backgroundColor[index] = chart._originalColors[index];
    } else {
      dataset.backgroundColor = [...chart._originalColors];
      dataset.hoverBackgroundColor = [...chart._originalColors];
    }
    chart.update('none');
  }
}

/**
 * Show either the data panels or the empty state
 */
function showFiscalData(hasData) {
  const empty = document.getElementById('sre-empty');
  const panel = document.getElementById('sre-data');
  if (empty) empty.hidden = hasData;
  if (panel) panel.hidden = !hasData;
}

/**
 * Load data/fiscal_transparency.json; resolves to the parsed object or null
 */
function loadFiscalData() {
  if (typeof fetch === 'undefined') return Promise.resolve(null);
  return fetch(FISCAL_DATA_URL)
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);
}

/**
 * Initialize the page
 */
function init() {
  initScrollAnimations();

  loadFiscalData().then((data) => {
    const year = selectLatestYear(data);
    if (!year) {
      showFiscalData(false);
      return;
    }

    currentYear = year.year;
    currentQuarter = periodOrder[0];
    showFiscalData(true);

    const periodText = document.getElementById('sre-period-text');
    if (periodText && currentYear) {
      periodText.removeAttribute('data-i18n');
      periodText.textContent = `FY ${currentYear}`;
    }
    const sourceLink = document.getElementById('sre-source-link');
    if (sourceLink && year.source_url && /^https?:\/\//i.test(String(year.source_url))) {
      sourceLink.href = String(year.source_url);
    }

    initPeriodToggle();
    initCharts();
    updateDisplay(currentQuarter);
    initBreakdownInteractions();
  });
}

// Run when DOM is ready
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FINANCIAL_DATA, formatPeso, calcPercent, normalizePeriod, selectLatestYear };
}
