/**
 * Transparency Page 2025 - Financial Data and Utilities (legacy layout)
 *
 * Not loaded by any page; budget/index.html uses transparency-v2.js, which
 * reads data/fiscal_transparency.json. Kept for reference and tests.
 *
 * SRE_DATA holds one entry per quarter ('q1', 'q2', ...) in millions of pesos,
 * copied from the official BLGF Statement of Receipts and Expenditures.
 * It is empty until official figures for the Province of Bukidnon are added;
 * while empty, every update function below does nothing.
 *
 * Entry shape:
 *   q1: {
 *     period: 'Q1 2025', periodLabel: 'Jan - Mar',
 *     income: {
 *       local: {
 *         taxRevenue: { realPropertyTax: { generalFund, sef, total }, businessTax, otherTaxes, total },
 *         nonTaxRevenue: { regulatoryFees, serviceCharges, economicEnterprises, otherReceipts, total },
 *         total,
 *       },
 *       external: { nationalTaxAllotment, otherShares, interLocalTransfers, extraordinaryReceipts, total },
 *       total,
 *     },
 *     expenditures: {
 *       generalPublicServices,
 *       socialServices: { education, health, labor, housing, socialWelfare, total },
 *       economicServices, debtService, total,
 *     },
 *     netOperatingIncome, fundBalanceEnd, fundBalanceBeginning,
 *   }
 */
const SRE_DATA = {};

/**
 * Format a numeric value as Philippine Peso in millions
 * @param {number} value - The value in millions
 * @returns {string} Formatted string like "₱123.45 M"
 */
function formatPesoMillions(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '₱0.00 M';
  }
  const num = Number(value);
  const rounded = Math.round(num * 100) / 100;
  return `₱${rounded.toFixed(2)} M`;
}

/**
 * Calculate percentage of a value relative to total
 * @param {number} value - The part value
 * @param {number} total - The total value
 * @returns {number} Percentage rounded to 1 decimal place
 */
function calculatePercentage(value, total) {
  if (!total || total === 0) {
    return 0;
  }
  const percentage = (value / total) * 100;
  return Math.round(percentage * 10) / 10;
}

// Export for testing (CommonJS style for Node.js/Vitest)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SRE_DATA, formatPesoMillions, calculatePercentage };
}

// Current state
let currentQuarter = 'q1';
let incomeChart = null;
let expenditureChart = null;

/**
 * Select a quarter and update all sections
 * @param {string} quarter - 'q1' or 'q2'
 */
function selectQuarter(quarter) {
  if (!SRE_DATA[quarter]) {
    quarter = Object.keys(SRE_DATA)[0];
  }
  if (!quarter) return; // no official data yet

  currentQuarter = quarter;
  const data = SRE_DATA[quarter];

  // Update tab states
  document.querySelectorAll('.quarter-tab').forEach((tab) => {
    const isActive = tab.dataset.quarter === quarter;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Update all sections
  updateMetrics(data);
  updateIncomeSection(data);
  updateExpenditureSection(data);
}

/**
 * Update metric cards with new data
 * @param {Object} data - Quarter data object
 */
function updateMetrics(data) {
  const metricIncome = document.getElementById('metric-income');
  const metricExpenditures = document.getElementById('metric-expenditures');
  const metricNet = document.getElementById('metric-net');
  const metricBalance = document.getElementById('metric-balance');
  const metricIncomeSource = document.getElementById('metric-income-source');
  const metricExpendituresSource = document.getElementById('metric-expenditures-source');

  if (metricIncome) {
    animateValue(metricIncome, data.income.total);
  }
  if (metricExpenditures) {
    animateValue(metricExpenditures, data.expenditures.total);
  }
  if (metricNet) {
    animateValue(metricNet, data.netOperatingIncome);
  }
  if (metricBalance) {
    animateValue(metricBalance, data.fundBalanceEnd);
  }
  if (metricIncomeSource) {
    metricIncomeSource.textContent = data.period;
  }
  if (metricExpendituresSource) {
    metricExpendituresSource.textContent = data.period;
  }
}

/**
 * Animate a value change in an element
 * @param {HTMLElement} element - Target element
 * @param {number} newValue - New value to display
 */
function animateValue(element, newValue) {
  element.classList.add('value-updating');
  setTimeout(() => {
    element.textContent = formatPesoMillions(newValue);
    element.classList.remove('value-updating');
  }, 150);
}

/**
 * Update income section with new data
 * @param {Object} data - Quarter data object
 */
function updateIncomeSection(data) {
  const income = data.income;
  const total = income.total;

  // Update period text
  const periodText = document.getElementById('income-period-text');
  if (periodText) {
    periodText.textContent = `Breakdown of provincial revenue for ${data.period}`;
  }

  // Update local sources
  updateElement('income-local-amount', formatPesoMillions(income.local.total));
  updateElement('income-local-pct', calculatePercentage(income.local.total, total) + '%');
  updateElement('income-tax-revenue', formatPesoMillions(income.local.taxRevenue.total));
  updateElement('income-rpt', formatPesoMillions(income.local.taxRevenue.realPropertyTax.total));
  updateElement('income-business-tax', formatPesoMillions(income.local.taxRevenue.businessTax));
  updateElement('income-non-tax', formatPesoMillions(income.local.nonTaxRevenue.total));

  // Update external sources
  updateElement('income-external-amount', formatPesoMillions(income.external.total));
  updateElement('income-external-pct', calculatePercentage(income.external.total, total) + '%');
  updateElement('income-nta', formatPesoMillions(income.external.nationalTaxAllotment));
  updateElement('income-other-shares', formatPesoMillions(income.external.otherShares));

  // Update chart
  if (incomeChart) {
    incomeChart.data.datasets[0].data = [income.local.total, income.external.total];
    incomeChart.update('active');
  }
}

/**
 * Update expenditure section with new data
 * @param {Object} data - Quarter data object
 */
function updateExpenditureSection(data) {
  const exp = data.expenditures;
  const total = exp.total;

  // Calculate percentages
  const gpsPct = calculatePercentage(exp.generalPublicServices, total);
  const socialPct = calculatePercentage(exp.socialServices.total, total);
  const economicPct = calculatePercentage(exp.economicServices, total);
  const debtPct = calculatePercentage(exp.debtService, total);

  // Update General Public Services
  updateElement('exp-gps-amount', formatPesoMillions(exp.generalPublicServices));
  updateElement('exp-gps-pct', gpsPct + '%');
  updateBarWidth('exp-gps-bar', gpsPct);

  // Update Social Services
  updateElement('exp-social-amount', formatPesoMillions(exp.socialServices.total));
  updateElement('exp-social-pct', socialPct + '%');
  updateBarWidth('exp-social-bar', socialPct);
  updateElement('exp-health', formatPesoMillions(exp.socialServices.health));
  updateElement('exp-welfare', formatPesoMillions(exp.socialServices.socialWelfare));
  updateElement('exp-education', formatPesoMillions(exp.socialServices.education));

  // Update Economic Services
  updateElement('exp-economic-amount', formatPesoMillions(exp.economicServices));
  updateElement('exp-economic-pct', economicPct + '%');
  updateBarWidth('exp-economic-bar', economicPct);

  // Update Debt Service
  updateElement('exp-debt-amount', formatPesoMillions(exp.debtService));
  updateElement('exp-debt-pct', debtPct + '%');
  updateBarWidth('exp-debt-bar', debtPct);

  // Update chart
  if (expenditureChart) {
    expenditureChart.data.datasets[0].data = [
      exp.generalPublicServices,
      exp.socialServices.total,
      exp.economicServices,
      exp.debtService,
    ];
    expenditureChart.update('active');
  }
}

/**
 * Helper to update element text content
 */
function updateElement(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}

/**
 * Helper to update progress bar width
 */
function updateBarWidth(id, percentage) {
  const el = document.getElementById(id);
  if (el) {
    el.style.width = percentage + '%';
  }
}

/**
 * Initialize charts
 */
function initCharts() {
  const incomeCtx = document.getElementById('incomeChart');
  const expenditureCtx = document.getElementById('expenditureChart');

  if (!SRE_DATA[currentQuarter]) return; // no official data yet

  if (incomeCtx && typeof Chart !== 'undefined') {
    const data = SRE_DATA[currentQuarter];
    incomeChart = new Chart(incomeCtx, {
      type: 'doughnut',
      data: {
        labels: ['Local Sources', 'External Sources'],
        datasets: [
          {
            data: [data.income.local.total, data.income.external.total],
            backgroundColor: ['#10b981', '#0ea5e9'],
            borderWidth: 0,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.label + ': ₱' + context.raw.toFixed(2) + ' M';
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 800,
        },
      },
    });
  }

  if (expenditureCtx && typeof Chart !== 'undefined') {
    const data = SRE_DATA[currentQuarter];
    const exp = data.expenditures;
    expenditureChart = new Chart(expenditureCtx, {
      type: 'doughnut',
      data: {
        labels: ['General Public Services', 'Social Services', 'Economic Services', 'Debt Service'],
        datasets: [
          {
            data: [
              exp.generalPublicServices,
              exp.socialServices.total,
              exp.economicServices,
              exp.debtService,
            ],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'],
            borderWidth: 0,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.label + ': ₱' + context.raw.toFixed(2) + ' M';
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 800,
        },
      },
    });
  }
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
  // SRE breakdown tab click handlers (new design)
  document.querySelectorAll('.sre-tab').forEach((tab) => {
    tab.addEventListener('click', function () {
      const quarter = this.dataset.quarter;
      selectQuarter(quarter);

      // Update tab states
      document.querySelectorAll('.sre-tab').forEach((t) => {
        const isActive = t.dataset.quarter === quarter;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    });
  });

  // Legacy quarter tab support (if any remain)
  document.querySelectorAll('.quarter-tab').forEach((tab) => {
    tab.addEventListener('click', function () {
      const quarter = this.dataset.quarter;
      selectQuarter(quarter);
    });

    // Keyboard support
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const quarter = this.dataset.quarter;
        selectQuarter(quarter);
      }
    });
  });
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  if (typeof IntersectionObserver === 'undefined') return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.animate-on-scroll, .metric-card').forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Initialize expenditure bar widths from data attributes
 */
function initExpenditureBars() {
  document.querySelectorAll('.expenditure-fill[data-width]').forEach((bar) => {
    const width = bar.dataset.width;
    if (width) {
      bar.style.width = width + '%';
    }
  });
}

/**
 * Initialize the page
 */
function init() {
  initEventListeners();
  initCharts();
  initScrollAnimations();
  initExpenditureBars();

  // Set initial data display
  selectQuarter('q1');
}

// Run initialization when DOM is ready (only in browser environment)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
