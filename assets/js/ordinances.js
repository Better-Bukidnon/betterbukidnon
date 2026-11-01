/* Better Bukidnon - Ordinance Table JavaScript */

/**
 * Fetches ordinance data from the JSON file
 * @returns {Promise<Array>} Array of ordinance objects (empty on any failure)
 */
async function fetchOrdinances() {
  try {
    const response = await fetch('../data/ordinances.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data && data.ordinances) ? data.ordinances : [];
  } catch (error) {
    console.warn('Could not load ordinances:', error);
    return [];
  }
}

/**
 * Escapes a value for safe insertion into HTML
 * @param {*} value - Any value
 * @returns {string} Escaped string
 */
function escapeOrdinanceHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sorts ordinances newest first: by session date, then by ordinance number.
 * Numbering formats vary, so numbers are compared as natural-order strings.
 * @param {Array} ordinances - Array of ordinance objects
 * @returns {Array} Sorted copy of the array
 */
function sortOrdinancesByNumber(ordinances) {
  return [...ordinances].sort((a, b) => {
    const dateA = String(a.sessionDate || '');
    const dateB = String(b.sessionDate || '');
    if (dateA !== dateB) return dateB.localeCompare(dateA);
    return String(b.ordinanceNo || '').localeCompare(String(a.ordinanceNo || ''), undefined, {
      numeric: true,
    });
  });
}

/**
 * Formats ordinance number for display
 * @param {string} ordinanceNo - Ordinance number
 * @returns {string} Ordinance number as-is
 */
function formatOrdinanceNo(ordinanceNo) {
  return ordinanceNo;
}

/**
 * Formats session date for display
 * @param {string} dateString - ISO date string (e.g., "2025-01-06")
 * @returns {string} Formatted date (e.g., "January 6, 2025")
 */
function formatSessionDate(dateString) {
  try {
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.warn('Invalid date format:', dateString);
    return dateString;
  }
}

/**
 * Shows the empty state (and hides the table) when there are no records.
 * The empty-state markup lives in the page so it is translated with the rest
 * of the page and still makes sense if this script never runs.
 * @param {boolean} isEmpty - Whether there are no records to show
 */
function toggleOrdinanceEmptyState(isEmpty) {
  const emptyState = document.getElementById('ordinance-empty');
  const tableWrap = document.getElementById('ordinance-table-wrap');
  if (emptyState) emptyState.hidden = !isEmpty;
  if (tableWrap) tableWrap.hidden = isEmpty;
}

/**
 * Renders the ordinance table to the DOM
 * @param {Array} ordinances - Array of ordinance objects
 */
function renderOrdinanceTable(ordinances) {
  const tableBody = document.getElementById('ordinance-table-body');

  if (!tableBody) {
    return;
  }

  const valid = (ordinances || []).filter((ordinance) => {
    const ok = ordinance && ordinance.ordinanceNo && ordinance.title && ordinance.sessionDate;
    if (!ok) console.warn('Skipping invalid ordinance record:', ordinance);
    return ok;
  });

  tableBody.innerHTML = '';

  if (valid.length === 0) {
    toggleOrdinanceEmptyState(true);
    return;
  }

  valid.forEach((ordinance) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td data-label="Ordinance No.">${escapeOrdinanceHtml(formatOrdinanceNo(ordinance.ordinanceNo))}</td>
            <td data-label="Title">${escapeOrdinanceHtml(ordinance.title)}</td>
            <td data-label="Session Date">${escapeOrdinanceHtml(formatSessionDate(ordinance.sessionDate))}</td>
        `;
    tableBody.appendChild(row);
  });
  toggleOrdinanceEmptyState(false);
}

/**
 * Main initialization function for the ordinance table
 */
async function initOrdinanceTable() {
  try {
    const ordinances = await fetchOrdinances();
    renderOrdinanceTable(sortOrdinancesByNumber(ordinances));
  } catch (error) {
    console.warn('Error initializing ordinance table:', error);
    toggleOrdinanceEmptyState(true);
  }
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initOrdinanceTable);
}

// Export functions for testing (if module system is available)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchOrdinances,
    escapeOrdinanceHtml,
    sortOrdinancesByNumber,
    formatOrdinanceNo,
    formatSessionDate,
    renderOrdinanceTable,
    initOrdinanceTable,
  };
}
