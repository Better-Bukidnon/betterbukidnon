/* Better Bukidnon - Resolution Table JavaScript */

/**
 * Fetches resolution data from the JSON file
 * @returns {Promise<Array>} Array of resolution objects (empty on any failure)
 */
async function fetchResolutions() {
  try {
    const response = await fetch('../data/resolutions.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data && data.resolutions) ? data.resolutions : [];
  } catch (error) {
    console.warn('Could not load resolutions:', error);
    return [];
  }
}

/**
 * Escapes a value for safe insertion into HTML
 * @param {*} value - Any value
 * @returns {string} Escaped string
 */
function escapeResolutionHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sorts resolutions newest first: by session date, then by resolution number.
 * Numbering formats vary, so numbers are compared as natural-order strings.
 * @param {Array} resolutions - Array of resolution objects
 * @returns {Array} Sorted copy of the array
 */
function sortResolutionsByNumber(resolutions) {
  return [...resolutions].sort((a, b) => {
    const dateA = String(a.sessionDate || '');
    const dateB = String(b.sessionDate || '');
    if (dateA !== dateB) return dateB.localeCompare(dateA);
    return String(b.resolutionNo || '').localeCompare(String(a.resolutionNo || ''), undefined, {
      numeric: true,
    });
  });
}

/**
 * Formats resolution number for display
 * @param {string} resolutionNo - Resolution number
 * @returns {string} Resolution number as-is
 */
function formatResolutionNo(resolutionNo) {
  return resolutionNo;
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
function toggleResolutionEmptyState(isEmpty) {
  const emptyState = document.getElementById('resolution-empty');
  const tableWrap = document.getElementById('resolution-table-wrap');
  if (emptyState) emptyState.hidden = !isEmpty;
  if (tableWrap) tableWrap.hidden = isEmpty;
}

/**
 * Renders the resolution table to the DOM
 * @param {Array} resolutions - Array of resolution objects
 * @param {string} [tableBodyId] - The id of the tbody element to populate
 */
function renderResolutionTable(resolutions, tableBodyId) {
  const tableBody = document.getElementById(tableBodyId || 'resolution-table-body');

  if (!tableBody) {
    return;
  }

  const valid = (resolutions || []).filter((resolution) => {
    const ok = resolution && resolution.resolutionNo && resolution.title && resolution.sessionDate;
    if (!ok) console.warn('Skipping invalid resolution record:', resolution);
    return ok;
  });

  tableBody.innerHTML = '';

  if (valid.length === 0) {
    toggleResolutionEmptyState(true);
    return;
  }

  valid.forEach((resolution) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td data-label="Resolution">${escapeResolutionHtml(formatResolutionNo(resolution.resolutionNo))}</td>
            <td data-label="Title">${escapeResolutionHtml(resolution.title)}</td>
            <td data-label="Session Date">${escapeResolutionHtml(formatSessionDate(resolution.sessionDate))}</td>
        `;
    tableBody.appendChild(row);
  });
  toggleResolutionEmptyState(false);
}

/**
 * Main initialization function for the resolution table
 */
async function initResolutionTable() {
  try {
    const resolutions = await fetchResolutions();
    renderResolutionTable(sortResolutionsByNumber(resolutions), 'resolution-table-body');
  } catch (error) {
    console.warn('Error initializing resolution table:', error);
    toggleResolutionEmptyState(true);
  }
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initResolutionTable);
}

// Export functions for testing (if module system is available)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchResolutions,
    escapeResolutionHtml,
    sortResolutionsByNumber,
    formatResolutionNo,
    formatSessionDate,
    renderResolutionTable,
    initResolutionTable,
  };
}
