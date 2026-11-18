/**
 * BetterBukidnon City & Municipality Directory (Task 03 - Part A)
 *
 * Added & Changed:
 * - Renders searchable, filterable cards for all 22 Bukidnon LGUs (2 component cities, 20 municipalities).
 * - Displays official LGU seal, locality introduction, PSA population, barangay count, and 2025-2028 Mayor.
 */
(function () {
  'use strict';

  function formatNumber(n) {
    return typeof n === 'number' ? n.toLocaleString('en-US') : 'N/A';
  }

  function renderLguCard(lgu, sv, rootPrefix) {
    var esc = sv.escapeHtml;
    var sealHtml = sv.renderSealImage(lgu.seal, lgu.name + ' official seal', rootPrefix);
    var mayorObj = lgu.leadership && lgu.leadership.mayor;
    var mayorText = mayorObj && mayorObj.name ? esc(mayorObj.name) : 'Pending';
    var profileHref = rootPrefix + 'lgus/' + encodeURIComponent(lgu.slug) + '/';

    return (
      '<article class="bb-card" data-lgu-slug="' +
      esc(lgu.slug) +
      '">' +
      '<div class="bb-card-top">' +
      sealHtml +
      '<div class="bb-card-heading">' +
      '<h3 class="bb-card-title">' +
      esc(lgu.name) +
      '</h3>' +
      '<p class="bb-card-subtitle">' +
      esc(lgu.classification) +
      (lgu.is_capital ? ' (Capital)' : '') +
      ' &middot; District ' +
      esc(lgu.district) +
      '</p>' +
      '</div>' +
      '</div>' +
      (lgu.introduction
        ? '<p class="bb-card-intro">' + esc(lgu.introduction) + '</p>'
        : '') +
      '<div class="bb-card-meta">' +
      '<div class="bb-meta-item">' +
      '<span class="bb-meta-label">Population (' +
      esc(lgu.population.latest_year) +
      ')</span>' +
      '<span class="bb-meta-value">' +
      formatNumber(lgu.population.latest) +
      '</span>' +
      '</div>' +
      '<div class="bb-meta-item">' +
      '<span class="bb-meta-label">Barangays</span>' +
      '<span class="bb-meta-value">' +
      formatNumber(lgu.barangay_count) +
      '</span>' +
      '</div>' +
      '<div class="bb-meta-item" style="grid-column: 1 / -1">' +
      '<span class="bb-meta-label">Mayor (2025&ndash;2028)</span>' +
      '<span class="bb-meta-value">' +
      mayorText +
      '</span>' +
      '</div>' +
      '</div>' +
      '<div class="bb-card-actions">' +
      '<a href="' +
      profileHref +
      '" class="btn btn-primary btn-sm">' +
      'View Profile <i class="bi bi-arrow-right" aria-hidden="true"></i>' +
      '</a>' +
      (lgu.website
        ? '<a href="' +
          esc(lgu.website) +
          '" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">' +
          '<i class="bi bi-globe2" aria-hidden="true"></i> Website' +
          '</a>'
        : '') +
      '</div>' +
      '</article>'
    );
  }

  function initLguDirectory() {
    var grid = document.getElementById('lgu-directory-grid');
    if (!grid || !window.BBSourceVerification) return;

    var sv = window.BBSourceVerification;
    var rootPrefix = grid.getAttribute('data-root') || '../';
    var searchInput = document.getElementById('lgu-search');
    var typeSelect = document.getElementById('lgu-type-filter');
    var districtSelect = document.getElementById('lgu-district-filter');
    var sortSelect = document.getElementById('lgu-sort');
    var countEl = document.getElementById('lgu-results-count');

    var allLgus = [];

    function applyFilters() {
      var q = (searchInput ? searchInput.value : '').trim().toLowerCase();
      var type = typeSelect ? typeSelect.value : 'all';
      var dist = districtSelect ? districtSelect.value : 'all';
      var sortBy = sortSelect ? sortSelect.value : 'name-asc';

      var filtered = allLgus.filter(function (lgu) {
        if (type !== 'all' && lgu.classification !== type) return false;
        if (dist !== 'all' && String(lgu.district) !== dist) return false;
        if (q) {
          var hay = [
            lgu.name,
            lgu.official_name,
            lgu.psgc_code,
            lgu.leadership && lgu.leadership.mayor && lgu.leadership.mayor.name,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });

      filtered.sort(function (a, b) {
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'pop-desc') return (b.population.latest || 0) - (a.population.latest || 0);
        if (sortBy === 'brgy-desc') return (b.barangay_count || 0) - (a.barangay_count || 0);
        return a.name.localeCompare(b.name);
      });

      if (countEl) {
        countEl.textContent =
          'Showing ' + filtered.length + ' of ' + allLgus.length + ' cities and municipalities';
      }

      if (filtered.length === 0) {
        grid.innerHTML =
          '<div class="bb-empty-state" style="grid-column: 1 / -1">' +
          '<i class="bi bi-search" aria-hidden="true"></i>' +
          '<p>No cities or municipalities match your search criteria.</p>' +
          '</div>';
        return;
      }

      grid.innerHTML = filtered
        .map(function (lgu) {
          return renderLguCard(lgu, sv, rootPrefix);
        })
        .join('');
    }

    [searchInput, typeSelect, districtSelect, sortSelect].forEach(function (el) {
      if (el) {
        el.addEventListener('input', applyFilters);
        el.addEventListener('change', applyFilters);
      }
    });

    fetch(rootPrefix + 'data/lgus.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        allLgus = Array.isArray(data.lgus) ? data.lgus : [];
        applyFilters();
      })
      .catch(function () {
        grid.innerHTML =
          '<div class="bb-empty-state" style="grid-column: 1 / -1">' +
          '<i class="bi bi-exclamation-circle" aria-hidden="true"></i>' +
          '<p>Unable to load LGU directory data.</p>' +
          '</div>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLguDirectory);
  } else {
    initLguDirectory();
  }
})();
