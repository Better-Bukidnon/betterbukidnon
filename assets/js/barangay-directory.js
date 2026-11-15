/**
 * BetterBukidnon Barangay Directory (Task 04 - Part C & E)
 *
 * Added & Changed:
 * - Renders searchable, LGU-filterable, paginated directory of all 464 Bukidnon barangays.
 * - Displays barangay seal (or parent LGU seal fallback), barangay introduction, PSGC code,
 *   and Punong Barangay (2023–2025 DILG directory).
 */
(function () {
  'use strict';

  var PAGE_SIZE = 24;

  function renderBarangayCard(b, lguMap, sv, rootPrefix) {
    var esc = sv.escapeHtml;
    var parentLgu = lguMap && b.lgu_slug ? lguMap[b.lgu_slug] : null;
    var sealSource =
      b.seal && b.seal.path ? b.seal : parentLgu && parentLgu.seal ? parentLgu.seal : null;
    var sealHtml = sv.renderSealImage(
      sealSource,
      b.name + ' seal',
      rootPrefix,
      'bb-seal-frame--sm'
    );
    var pb = b.leadership && b.leadership.punong_barangay;
    var pbText = pb && pb.name ? esc(pb.name) : 'Pending';
    var termText = b.leadership && b.leadership.term ? ' (' + esc(b.leadership.term) + ')' : '';

    return (
      '<article class="bb-card" data-brgy-psgc="' +
      esc(b.psgc_code) +
      '">' +
      '<div class="bb-card-top">' +
      sealHtml +
      '<div class="bb-card-heading">' +
      '<h3 class="bb-card-title">' +
      esc(b.name) +
      '</h3>' +
      '<p class="bb-card-subtitle"><a href="' +
      rootPrefix +
      'lgus/' +
      encodeURIComponent(b.lgu_slug) +
      '/">' +
      esc(b.lgu_name) +
      '</a> &middot; PSGC ' +
      esc(b.psgc_code) +
      '</p>' +
      '</div>' +
      '</div>' +
      (b.introduction
        ? '<p class="bb-card-intro">' + esc(b.introduction) + '</p>'
        : '') +
      '<div class="bb-card-meta">' +
      '<div class="bb-meta-item" style="grid-column: 1 / -1">' +
      '<span class="bb-meta-label">Punong Barangay' +
      termText +
      '</span>' +
      '<span class="bb-meta-value">' +
      pbText +
      '</span>' +
      '</div>' +
      '</div>' +
      '<div class="bb-card-actions">' +
      '<a href="' +
      rootPrefix +
      'barangays/profile/?code=' +
      encodeURIComponent(b.psgc_code) +
      '" class="btn btn-primary btn-sm">View Profile <i class="bi bi-arrow-right" aria-hidden="true"></i></a>' +
      '</div>' +
      '</article>'
    );
  }

  function initBarangayDirectory() {
    var grid = document.getElementById('brgy-directory-grid');
    if (!grid || !window.BBSourceVerification) return;

    var sv = window.BBSourceVerification;
    var rootPrefix = grid.getAttribute('data-root') || '../';
    var searchInput = document.getElementById('brgy-search');
    var lguSelect = document.getElementById('brgy-lgu-filter');
    var sortSelect = document.getElementById('brgy-sort');
    var countEl = document.getElementById('brgy-results-count');
    var paginationEl = document.getElementById('brgy-pagination');

    var allBrgys = [];
    var lguMap = {};
    var currentPage = 1;

    var params = new URLSearchParams(window.location.search);
    var initialLgu = params.get('lgu') || 'all';

    function renderPage(filtered) {
      var totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;
      var start = (currentPage - 1) * PAGE_SIZE;
      var slice = filtered.slice(start, start + PAGE_SIZE);

      if (countEl) {
        countEl.textContent =
          'Showing ' +
          (filtered.length === 0 ? 0 : start + 1) +
          '–' +
          Math.min(start + PAGE_SIZE, filtered.length) +
          ' of ' +
          filtered.length +
          ' barangays (Total: ' +
          allBrgys.length +
          ')';
      }

      if (slice.length === 0) {
        grid.innerHTML =
          '<div class="bb-empty-state" style="grid-column:1/-1">' +
          '<i class="bi bi-search" aria-hidden="true"></i>' +
          '<p>No barangays match your search or selected city/municipality.</p>' +
          '</div>';
      } else {
        grid.innerHTML = slice
          .map(function (b) {
            return renderBarangayCard(b, lguMap, sv, rootPrefix);
          })
          .join('');
      }

      if (paginationEl) {
        if (totalPages <= 1) {
          paginationEl.innerHTML = '';
        } else {
          paginationEl.innerHTML =
            '<button type="button" class="btn btn-secondary btn-sm" id="brgy-prev" ' +
            (currentPage <= 1 ? 'disabled' : '') +
            '><i class="bi bi-chevron-left" aria-hidden="true"></i> Previous</button>' +
            '<span style="font-size:0.875rem;padding:0 8px">Page ' +
            currentPage +
            ' of ' +
            totalPages +
            '</span>' +
            '<button type="button" class="btn btn-secondary btn-sm" id="brgy-next" ' +
            (currentPage >= totalPages ? 'disabled' : '') +
            '>Next <i class="bi bi-chevron-right" aria-hidden="true"></i></button>';

          var prevBtn = document.getElementById('brgy-prev');
          var nextBtn = document.getElementById('brgy-next');
          if (prevBtn) {
            prevBtn.addEventListener('click', function () {
              if (currentPage > 1) {
                currentPage--;
                renderPage(filtered);
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            });
          }
          if (nextBtn) {
            nextBtn.addEventListener('click', function () {
              if (currentPage < totalPages) {
                currentPage++;
                renderPage(filtered);
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            });
          }
        }
      }
    }

    function applyFilters(resetPage) {
      if (resetPage) currentPage = 1;
      var q = (searchInput ? searchInput.value : '').trim().toLowerCase();
      var lgu = lguSelect ? lguSelect.value : 'all';
      var sortBy = sortSelect ? sortSelect.value : 'name-asc';

      var filtered = allBrgys.filter(function (b) {
        if (lgu !== 'all' && b.lgu_slug !== lgu) return false;
        if (q) {
          var pbName =
            b.leadership && b.leadership.punong_barangay ? b.leadership.punong_barangay.name : '';
          var hay = (b.name + ' ' + b.lgu_name + ' ' + b.psgc_code + ' ' + pbName).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });

      filtered.sort(function (a, b) {
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'lgu-asc') {
          var c = a.lgu_name.localeCompare(b.lgu_name);
          return c !== 0 ? c : a.name.localeCompare(b.name);
        }
        return a.name.localeCompare(b.name);
      });

      renderPage(filtered);
    }

    [searchInput, lguSelect, sortSelect].forEach(function (el) {
      if (el) {
        el.addEventListener('input', function () {
          applyFilters(true);
        });
        el.addEventListener('change', function () {
          applyFilters(true);
        });
      }
    });

    Promise.all([
      fetch(rootPrefix + 'data/lgus.json').then((r) => r.json()),
      fetch(rootPrefix + 'data/barangays.json').then((r) => r.json()),
    ])
      .then(function (res) {
        var lgus = res[0].lgus || [];
        allBrgys = res[1].barangays || [];
        lgus.forEach(function (l) {
          lguMap[l.slug] = l;
        });

        if (lguSelect) {
          lgus
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(function (l) {
              var opt = document.createElement('option');
              opt.value = l.slug;
              opt.textContent = l.name + ' (' + l.barangay_count + ')';
              lguSelect.appendChild(opt);
            });
          if (initialLgu !== 'all') lguSelect.value = initialLgu;
        }

        applyFilters(true);
      })
      .catch(function () {
        grid.innerHTML =
          '<div class="bb-empty-state" style="grid-column:1/-1">' +
          '<i class="bi bi-exclamation-circle" aria-hidden="true"></i>' +
          '<p>Unable to load barangay directory.</p>' +
          '</div>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBarangayDirectory);
  } else {
    initBarangayDirectory();
  }
})();
