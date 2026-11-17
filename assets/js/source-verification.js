/**
 * BetterBukidnon Shared Source Verification & Citation Helper (BB-14)
 * Renders consistent verification badges, safe fallbacks, and source citation lists.
 */
(function (global) {
  'use strict';

  var STATUS_META = {
    verified: {
      label: 'Verified',
      icon: 'bi-patch-check-fill',
      className: 'bb-badge bb-badge--verified',
    },
    pending_verification: {
      label: 'Pending Verification',
      icon: 'bi-clock-history',
      className: 'bb-badge bb-badge--pending',
    },
    historical: {
      label: 'Historical Record',
      icon: 'bi-archive',
      className: 'bb-badge bb-badge--historical',
    },
    unavailable: {
      label: 'Not Published',
      icon: 'bi-dash-circle',
      className: 'bb-badge bb-badge--unavailable',
    },
    disputed: {
      label: 'Needs Review',
      icon: 'bi-exclamation-triangle-fill',
      className: 'bb-badge bb-badge--disputed',
    },
  };

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderStatusBadge(status, customLabel) {
    var meta = STATUS_META[status] || STATUS_META.pending_verification;
    var label = customLabel || meta.label;
    return (
      '<span class="' +
      meta.className +
      '">' +
      '<i class="bi ' +
      meta.icon +
      '" aria-hidden="true"></i> ' +
      '<span>' +
      escapeHtml(label) +
      '</span>' +
      '</span>'
    );
  }

  function renderCitations(sources) {
    if (!Array.isArray(sources) || sources.length === 0) {
      return (
        '<p class="bb-empty-note">' +
        '<i class="bi bi-info-circle" aria-hidden="true"></i> ' +
        'No external source citations recorded yet.' +
        '</p>'
      );
    }

    var items = sources
      .map(function (src) {
        var agency = escapeHtml(src.agency || 'Official Source');
        var title = escapeHtml(src.title || src.name || 'Reference');
        var url = src.url ? escapeHtml(src.url) : '';
        var verified = src.last_verified ? 'Verified: ' + escapeHtml(src.last_verified) : '';
        var pubDate = src.publication_date
          ? 'Published: ' + escapeHtml(src.publication_date)
          : '';
        var scope = src.scope ? escapeHtml(src.scope) : '';

        var titleHtml = url
          ? '<a href="' +
            url +
            '" target="_blank" rel="noopener noreferrer">' +
            title +
            ' <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a>'
          : title;

        var metaParts = [agency, pubDate, verified].filter(Boolean).join(' &middot; ');

        return (
          '<li class="bb-citation-item">' +
          '<div class="bb-citation-header">' +
          '<strong>' +
          titleHtml +
          '</strong>' +
          '</div>' +
          (metaParts ? '<div class="bb-citation-meta">' + metaParts + '</div>' : '') +
          (scope ? '<div class="bb-citation-scope">Scope: ' + scope + '</div>' : '') +
          '</li>'
        );
      })
      .join('');

    return '<ul class="bb-citation-list">' + items + '</ul>';
  }

  function renderSealImage(sealObj, altText, rootPrefix, sizeClass) {
    var prefix = rootPrefix || '../';
    var cls = sizeClass ? ' ' + sizeClass : '';
    if (sealObj && sealObj.path) {
      var src = sealObj.path.indexOf('http') === 0 ? sealObj.path : prefix + sealObj.path;
      return (
        '<div class="bb-seal-frame' +
        cls +
        '">' +
        '<img src="' +
        escapeHtml(src) +
        '" alt="' +
        escapeHtml(altText) +
        '" loading="lazy" onerror="this.parentElement.classList.add(\'bb-seal-frame--fallback\');this.remove();" />' +
        '</div>'
      );
    }
    return (
      '<div class="bb-seal-frame bb-seal-frame--fallback' +
      cls +
      '" aria-hidden="true">' +
      '<i class="bi bi-shield-fill"></i>' +
      '</div>'
    );
  }

  global.BBSourceVerification = {
    STATUS_META: STATUS_META,
    escapeHtml: escapeHtml,
    renderStatusBadge: renderStatusBadge,
    renderCitations: renderCitations,
    renderSealImage: renderSealImage,
  };
})(window);
