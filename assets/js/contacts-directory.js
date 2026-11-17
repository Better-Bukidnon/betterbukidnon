/**
 * BetterBukidnon Interactive Office & Emergency Contact Directory (Task 01)
 */
(function () {
  'use strict';

  var LEVEL_LABELS = {
    national: 'Nationwide',
    provincial: 'Provincial',
    city: 'City',
    municipality: 'Municipality',
    barangay: 'Barangay',
  };

  var CATEGORY_LABELS = {
    emergency: 'Emergency',
    government: 'Government Office',
    healthcare: 'Healthcare',
    public_service: 'Public Service',
  };

  function renderContactCard(c, sv) {
    var esc = sv.escapeHtml;
    var sealHtml = sv.renderSealImage(
      c.seal_path ? { path: c.seal_path } : null,
      c.name + ' seal',
      '../',
      'bb-seal-frame--sm'
    );

    var levelLabel = LEVEL_LABELS[c.level] || c.level;
    var catLabel = CATEGORY_LABELS[c.category] || c.category;

    var phoneHtml = c.phone
      ? '<div class="bb-contact-actions">' +
        '<a href="' +
        esc(c.tel_href || 'tel:' + c.phone.replace(/[^0-9+]/g, '')) +
        '" class="btn btn-primary btn-sm">' +
        '<i class="bi bi-telephone-fill" aria-hidden="true"></i> ' +
        esc(c.phone) +
        '</a>' +
        '<button type="button" class="bb-btn-copy" data-copy="' +
        esc(c.phone) +
        '" aria-label="Copy phone number ' +
        esc(c.phone) +
        '">' +
        '<i class="bi bi-clipboard" aria-hidden="true"></i> <span>Copy</span>' +
        '</button>' +
        '</div>'
      : '<span class="bb-empty-note">Phone not published</span>';

    var links = [];
    if (c.email) {
      links.push(
        '<a href="mailto:' +
          esc(c.email) +
          '"><i class="bi bi-envelope" aria-hidden="true"></i> ' +
          esc(c.email) +
          '</a>'
      );
    }
    if (c.website) {
      links.push(
        '<a href="' +
          esc(c.website) +
          '" target="_blank" rel="noopener noreferrer"><i class="bi bi-globe2" aria-hidden="true"></i> Website</a>'
      );
    }
    if (c.coordinates && c.coordinates.lat && c.coordinates.lon) {
      links.push(
        '<a href="https://www.openstreetmap.org/?mlat=' +
          encodeURIComponent(c.coordinates.lat) +
          '&mlon=' +
          encodeURIComponent(c.coordinates.lon) +
          '#map=15/' +
          encodeURIComponent(c.coordinates.lat) +
          '/' +
          encodeURIComponent(c.coordinates.lon) +
          '" target="_blank" rel="noopener noreferrer"><i class="bi bi-geo-alt" aria-hidden="true"></i> Map</a>'
      );
    }

    return (
      '<article class="bb-card" data-contact-id="' +
      esc(c.id) +
      '">' +
      '<div class="bb-card-top">' +
      sealHtml +
      '<div class="bb-card-heading">' +
      '<h3 class="bb-card-title">' +
      esc(c.name) +
      '</h3>' +
      '<p class="bb-card-subtitle">' +
      esc(levelLabel) +
      ' &middot; ' +
      esc(catLabel) +
      '</p>' +
      '</div>' +
      '</div>' +
      '<p class="bb-card-desc">' +
      esc(c.responsibilities) +
      '</p>' +
      (c.location
        ? '<p class="bb-card-subtitle"><i class="bi bi-geo-alt" aria-hidden="true"></i> ' +
          esc(c.location) +
          '</p>'
        : '') +
      '<div class="bb-card-actions">' +
      phoneHtml +
      '</div>' +
      (links.length > 0 ? '<div class="bb-card-links">' + links.join('') + '</div>' : '') +
      '</article>'
    );
  }

  function initContactsDirectory() {
    var grid = document.getElementById('contacts-directory-grid');
    if (!grid || !window.BBSourceVerification) return;

    var sv = window.BBSourceVerification;
    var searchInput = document.getElementById('contacts-search');
    var levelSelect = document.getElementById('contacts-level-filter');
    var categorySelect = document.getElementById('contacts-category-filter');
    var countEl = document.getElementById('contacts-results-count');

    var allContacts = [];

    function applyFilters() {
      var q = (searchInput ? searchInput.value : '').trim().toLowerCase();
      var lvl = levelSelect ? levelSelect.value : 'all';
      var cat = categorySelect ? categorySelect.value : 'all';

      var filtered = allContacts.filter(function (c) {
        if (lvl !== 'all' && c.level !== lvl) return false;
        if (cat !== 'all' && c.category !== cat) return false;
        if (q) {
          var hay = [c.name, c.abbr, c.responsibilities, c.location, c.phone, c.coverage]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });

      if (countEl) {
        countEl.textContent =
          'Showing ' + filtered.length + ' of ' + allContacts.length + ' contacts';
      }

      if (filtered.length === 0) {
        grid.innerHTML =
          '<div class="bb-empty-state" style="grid-column: 1 / -1">' +
          '<i class="bi bi-search" aria-hidden="true"></i>' +
          '<p>No matching contacts found. Try clearing your filters.</p>' +
          '</div>';
        return;
      }

      grid.innerHTML = filtered
        .map(function (c) {
          return renderContactCard(c, sv);
        })
        .join('');
    }

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.bb-btn-copy');
      if (!btn) return;
      var text = btn.getAttribute('data-copy');
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          var span = btn.querySelector('span');
          if (span) {
            span.textContent = 'Copied!';
            setTimeout(function () {
              span.textContent = 'Copy';
            }, 1800);
          }
        });
      }
    });

    [searchInput, levelSelect, categorySelect].forEach(function (el) {
      if (el) {
        el.addEventListener('input', applyFilters);
        el.addEventListener('change', applyFilters);
      }
    });

    fetch('../data/contacts.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        allContacts = Array.isArray(data.contacts) ? data.contacts : [];
        applyFilters();
      })
      .catch(function () {
        grid.innerHTML =
          '<div class="bb-empty-state" style="grid-column: 1 / -1">' +
          '<i class="bi bi-exclamation-circle" aria-hidden="true"></i>' +
          '<p>Unable to load contact directory. Please refer to the emergency hotlines and Capitol table below.</p>' +
          '</div>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactsDirectory);
  } else {
    initContactsDirectory();
  }
})();
