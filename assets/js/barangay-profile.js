/**
 * BetterBukidnon Individual Barangay Profile Renderer (Task 04 - Part D)
 *
 * Added & Changed:
 * - Renders individual profiles for all 464 Bukidnon barangays via ?code=<PSGC>.
 * - Hero banner with official barangay/LGU seal, parent LGU link, district, PSGC pill, and introduction.
 * - Sticky sub-navigation bar, 4-column KPI dashboard, Punong Barangay leadership card,
 *   front-line barangay hall services, location coordinates, and official DILG/PSA citations.
 */
(function () {
  'use strict';

  var BARANGAY_SERVICES = [
    {
      name: 'Barangay Clearance',
      icon: 'bi-file-earmark-check-fill',
      desc: 'Issued in person at the Barangay Hall for employment, business permits, and valid ID requirements.',
    },
    {
      name: 'Barangay Certification',
      icon: 'bi-award-fill',
      desc: 'Certificates of Residency, Indigency, Solo Parent, and Good Moral Character for public assistance.',
    },
    {
      name: 'Katarungang Pambarangay',
      icon: 'bi-people-fill',
      desc: 'Lupong Tagapamayapa community mediation, dispute resolution, and legal referral coordination.',
    },
    {
      name: 'Barangay Health Station (BHS)',
      icon: 'bi-heart-pulse-fill',
      desc: 'Primary maternal care, child immunization, nutrition monitoring, and RHU health referrals.',
    },
    {
      name: 'Disaster Response (BDRRMC)',
      icon: 'bi-shield-fill-exclamation',
      desc: 'Local early warning alerts, evacuation center management, and Municipal/City DRRMO coordination.',
    },
    {
      name: 'Youth &amp; Community Programs',
      icon: 'bi-stars',
      desc: 'Sangguniang Kabataan (SK) sports, educational assistance, and civic engagement initiatives.',
    },
  ];

  function renderProfile(brgy, lgu, sv, rootPrefix) {
    var esc = sv.escapeHtml;
    var root = document.getElementById('brgy-profile-root');
    if (!root) return;

    document.title = 'Barangay ' + brgy.name + ', ' + brgy.lgu_name + ' | BetterBukidnon.org';
    var bcName = document.getElementById('brgy-breadcrumb-name');
    if (bcName) bcName.textContent = brgy.name;

    var sealHtml = sv.renderSealImage(
      brgy.seal && brgy.seal.path ? brgy.seal : lgu && lgu.seal ? lgu.seal : null,
      brgy.name + ' seal',
      rootPrefix,
      'bb-seal-frame--lg'
    );

    var pb = brgy.leadership && brgy.leadership.punong_barangay;
    var pbName = pb && pb.name ? esc(pb.name) : 'Not published';
    var pbTerm = (brgy.leadership && brgy.leadership.term) || '2023–2025';
    var ordDistrict =
      brgy.district === 1
        ? '1st'
        : brgy.district === 2
          ? '2nd'
          : brgy.district === 3
            ? '3rd'
            : '4th';

    var hero =
      '<section class="bb-profile-hero">' +
      '<div class="container bb-profile-hero-inner">' +
      sealHtml +
      '<div class="bb-profile-hero-body">' +
      '<div class="bb-profile-hero-tags">' +
      '<span class="bb-hero-pill"><i class="bi bi-building" aria-hidden="true"></i> <a href="' +
      rootPrefix +
      'lgus/' +
      encodeURIComponent(brgy.lgu_slug) +
      '/">' +
      esc(brgy.lgu_name) +
      '</a></span>' +
      '<span class="bb-hero-pill"><i class="bi bi-diagram-3" aria-hidden="true"></i> ' +
      ordDistrict +
      ' District</span>' +
      '<span class="bb-hero-pill"><i class="bi bi-hash" aria-hidden="true"></i> PSGC ' +
      esc(brgy.psgc_code) +
      '</span>' +
      '</div>' +
      '<h1>Barangay ' +
      esc(brgy.name) +
      '</h1>' +
      '<p class="bb-profile-hero-sub">Component Barangay of ' +
      esc(brgy.lgu_name) +
      ', Province of Bukidnon &middot; Region X</p>' +
      (brgy.introduction ? '<p class="bb-profile-intro">' + esc(brgy.introduction) + '</p>' : '') +
      '</div>' +
      '</div>' +
      '</section>';

    var navHtml =
      '<div class="bb-profile-nav-bar">' +
      '<div class="container">' +
      '<nav class="bb-profile-nav" aria-label="Barangay profile sections">' +
      '<a href="#overview" class="bb-profile-nav-link is-active"><i class="bi bi-grid-1x2-fill" aria-hidden="true"></i> Overview</a>' +
      '<a href="#leadership" class="bb-profile-nav-link"><i class="bi bi-person-badge-fill" aria-hidden="true"></i> Leadership</a>' +
      '<a href="#services" class="bb-profile-nav-link"><i class="bi bi-briefcase-fill" aria-hidden="true"></i> Services</a>' +
      '<a href="#location" class="bb-profile-nav-link"><i class="bi bi-geo-alt-fill" aria-hidden="true"></i> Location &amp; Contacts</a>' +
      '<a href="#references" class="bb-profile-nav-link"><i class="bi bi-journal-check" aria-hidden="true"></i> References</a>' +
      '</nav>' +
      '</div>' +
      '</div>';

    var overview =
      '<section class="section bb-profile-section" id="overview">' +
      '<div class="container">' +
      '<div class="bb-profile-section-head">' +
      '<div>' +
      '<h2><i class="bi bi-bar-chart-line-fill" aria-hidden="true"></i> Barangay Overview &amp; Key Details</h2>' +
      '<p class="bb-profile-section-sub">Official administrative and demographic summary for Barangay ' +
      esc(brgy.name) +
      '</p>' +
      '</div>' +
      '<a href="' +
      rootPrefix +
      'lgus/' +
      encodeURIComponent(brgy.lgu_slug) +
      '/" class="btn btn-secondary btn-sm"><i class="bi bi-arrow-left" aria-hidden="true"></i> ' +
      esc(brgy.lgu_name) +
      ' Profile</a>' +
      '</div>' +
      '<div class="bb-kpi-grid">' +
      '<div class="bb-kpi-card">' +
      '<div class="bb-kpi-icon" aria-hidden="true"><i class="bi bi-building"></i></div>' +
      '<div class="bb-kpi-body">' +
      '<span class="bb-kpi-label">City / Municipality</span>' +
      '<div class="bb-kpi-value"><a href="' +
      rootPrefix +
      'lgus/' +
      encodeURIComponent(brgy.lgu_slug) +
      '/">' +
      esc(brgy.lgu_name) +
      '</a></div>' +
      '<span class="bb-kpi-note">LGU PSGC: ' +
      esc(brgy.lgu_psgc) +
      '</span>' +
      '</div>' +
      '</div>' +
      '<div class="bb-kpi-card">' +
      '<div class="bb-kpi-icon" aria-hidden="true"><i class="bi bi-person-badge-fill"></i></div>' +
      '<div class="bb-kpi-body">' +
      '<span class="bb-kpi-label">Punong Barangay</span>' +
      '<div class="bb-kpi-value" style="font-size:1.05rem">' +
      pbName +
      '</div>' +
      '<span class="bb-kpi-note">Term ' +
      esc(pbTerm) +
      ' &middot; DILG Region X</span>' +
      '</div>' +
      '</div>' +
      '<div class="bb-kpi-card">' +
      '<div class="bb-kpi-icon" aria-hidden="true"><i class="bi bi-people-fill"></i></div>' +
      '<div class="bb-kpi-body">' +
      '<span class="bb-kpi-label">Population</span>' +
      '<div class="bb-kpi-value">' +
      (brgy.population && brgy.population.value
        ? brgy.population.value.toLocaleString('en-US')
        : 'See LGU Census') +
      '</div>' +
      '<span class="bb-kpi-note">' +
      (brgy.population && brgy.population.year
        ? 'PSA Census (' + esc(brgy.population.year) + ')'
        : 'Included in ' + esc(brgy.lgu_name) + ' PSA total') +
      '</span>' +
      '</div>' +
      '</div>' +
      '<div class="bb-kpi-card">' +
      '<div class="bb-kpi-icon" aria-hidden="true"><i class="bi bi-diagram-3-fill"></i></div>' +
      '<div class="bb-kpi-body">' +
      '<span class="bb-kpi-label">Legislative District</span>' +
      '<div class="bb-kpi-value">' +
      ordDistrict +
      ' District</div>' +
      '<span class="bb-kpi-note">PSGC ' +
      esc(brgy.psgc_code) +
      '</span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</section>';

    var leadership =
      '<section class="section bb-profile-section bg-alt" id="leadership">' +
      '<div class="container">' +
      '<div class="bb-profile-section-head">' +
      '<div>' +
      '<h2><i class="bi bi-person-badge-fill" aria-hidden="true"></i> Barangay Leadership (' +
      esc(pbTerm) +
      ')</h2>' +
      '<p class="bb-profile-section-sub">Sangguniang Barangay executive and council structure</p>' +
      '</div>' +
      '</div>' +
      '<div class="bb-card-grid">' +
      '<article class="bb-card" style="border-top:3px solid var(--color-primary)">' +
      '<div class="bb-card-top">' +
      '<div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-person-badge-fill"></i></div>' +
      '<div class="bb-card-heading"><span class="bb-badge bb-badge--city" style="margin-bottom:4px">Punong Barangay</span><h3 class="bb-card-title">' +
      pbName +
      '</h3><p class="bb-card-subtitle">Barangay Chief Executive &middot; Term ' +
      esc(pbTerm) +
      ' (DILG Directory &middot; Historical record)</p></div>' +
      '</div>' +
      '</article>' +
      '<article class="bb-card" style="border-top:3px solid var(--color-primary)"><div class="bb-card-top"><div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-people-fill"></i></div><div class="bb-card-heading"><span class="bb-badge bb-badge--muni" style="margin-bottom:4px">Legislative Council</span><h3 class="bb-card-title">Sangguniang Barangay</h3><p class="bb-card-subtitle">7 Elected Barangay Kagawads &amp; Lupong Tagapamayapa</p></div></div></article>' +
      '<article class="bb-card" style="border-top:3px solid var(--color-primary)"><div class="bb-card-top"><div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-person-lines-fill"></i></div><div class="bb-card-heading"><span class="bb-badge bb-badge--muni" style="margin-bottom:4px">Youth &amp; Administration</span><h3 class="bb-card-title">SK &amp; Barangay Secretariat</h3><p class="bb-card-subtitle">SK Chairperson, Barangay Secretary &amp; Barangay Treasurer</p></div></div></article>' +
      '</div>' +
      '</div>' +
      '</section>';

    var services =
      '<section class="section bb-profile-section" id="services">' +
      '<div class="container">' +
      '<div class="bb-profile-section-head">' +
      '<div>' +
      '<h2><i class="bi bi-briefcase-fill" aria-hidden="true"></i> Barangay Hall Front-Line Services</h2>' +
      '<p class="bb-profile-section-sub">Certifications, clearances, and community support available at Barangay ' +
      esc(brgy.name) +
      ' Hall</p>' +
      '</div>' +
      '</div>' +
      '<div class="bb-card-grid">' +
      BARANGAY_SERVICES.map(function (s) {
        return (
          '<article class="bb-card">' +
          '<div class="bb-card-top">' +
          '<div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi ' +
          s.icon +
          '"></i></div>' +
          '<div class="bb-card-heading"><h3 class="bb-card-title">' +
          s.name +
          '</h3><p class="bb-card-subtitle">' +
          esc(s.desc) +
          '</p></div>' +
          '</div>' +
          '</article>'
        );
      }).join('') +
      '</div>' +
      '</div>' +
      '</section>';

    var lat = lgu && lgu.coordinates ? lgu.coordinates.lat : null;
    var lon = lgu && lgu.coordinates ? lgu.coordinates.lon : null;
    var contactsMap =
      '<section class="section bb-profile-section bg-alt" id="location">' +
      '<div class="container">' +
      '<div class="bb-profile-section-head">' +
      '<div>' +
      '<h2><i class="bi bi-geo-alt-fill" aria-hidden="true"></i> Location &amp; Directory Coordination</h2>' +
      '<p class="bb-profile-section-sub">Geographic coordinates and municipal contact channels for Barangay ' +
      esc(brgy.name) +
      '</p>' +
      '</div>' +
      '</div>' +
      '<div class="bb-card-grid bb-card-grid--2">' +
      '<article class="bb-card">' +
      '<div class="bb-card-top">' +
      '<div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-telephone-inbound-fill"></i></div>' +
      '<div class="bb-card-heading"><h3 class="bb-card-title">LGU &amp; Emergency Coordination</h3><p class="bb-card-subtitle">For municipal-level assistance, visit the <a href="' +
      rootPrefix +
      'lgus/' +
      encodeURIComponent(brgy.lgu_slug) +
      '/">' +
      esc(brgy.lgu_name) +
      ' profile</a> or the <a href="' +
      rootPrefix +
      'contact/">Provincial Contact &amp; Hotline Directory</a>.</p></div>' +
      '</div>' +
      '</article>' +
      '<article class="bb-card">' +
      '<div class="bb-card-top">' +
      '<div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-compass-fill"></i></div>' +
      '<div class="bb-card-heading"><h3 class="bb-card-title">Geographic Reference</h3><p class="bb-card-subtitle">' +
      (lat && lon
        ? esc(brgy.lgu_name) + ' Reference Center: ' + lat.toFixed(4) + '° N, ' + lon.toFixed(4) + '° E'
        : 'Coordinates unavailable.') +
      '</p></div>' +
      '</div>' +
      (lat && lon
        ? '<div class="bb-card-actions"><a href="https://www.openstreetmap.org/?mlat=' +
          encodeURIComponent(lat) +
          '&mlon=' +
          encodeURIComponent(lon) +
          '#map=13/' +
          encodeURIComponent(lat) +
          '/' +
          encodeURIComponent(lon) +
          '" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm"><i class="bi bi-geo-alt-fill" aria-hidden="true"></i> Open in OpenStreetMap</a></div>'
        : '') +
      '</article>' +
      '</div>' +
      '</div>' +
      '</section>';

    var refs =
      '<section class="section bb-profile-section" id="references">' +
      '<div class="container">' +
      '<div class="bb-profile-section-head">' +
      '<div>' +
      '<h2><i class="bi bi-journal-check" aria-hidden="true"></i> Official Sources &amp; Verification</h2>' +
      '<p class="bb-profile-section-sub">Authoritative DILG and PSA PSGC records for Barangay ' +
      esc(brgy.name) +
      '</p>' +
      '</div>' +
      '</div>' +
      sv.renderCitations(brgy.sources) +
      '</div>' +
      '</section>';

    root.innerHTML = hero + navHtml + overview + leadership + services + contactsMap + refs;

    var navLinks = root.querySelectorAll('.bb-profile-nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.forEach(function (l) {
          l.classList.remove('is-active');
        });
        link.classList.add('is-active');
      });
    });
  }

  function initBarangayProfile() {
    var root = document.getElementById('brgy-profile-root');
    if (!root || !window.BBSourceVerification) return;

    var params = new URLSearchParams(window.location.search);
    var code = params.get('code');
    var rootPrefix = root.getAttribute('data-root') || '../../';

    if (!code) {
      root.innerHTML =
        '<div class="container section"><div class="bb-empty-state"><i class="bi bi-geo-alt" aria-hidden="true"></i><p>No barangay PSGC code specified. <a href="' +
        rootPrefix +
        'barangays/">Browse the Barangay Directory</a>.</p></div></div>';
      return;
    }

    Promise.all([
      fetch(rootPrefix + 'data/barangays.json').then((r) => r.json()),
      fetch(rootPrefix + 'data/lgus.json').then((r) => r.json()),
    ])
      .then(function (res) {
        var brgy = (res[0].barangays || []).find(function (b) {
          return b.psgc_code === code || b.psgc_9digit === code;
        });
        if (!brgy) {
          root.innerHTML =
            '<div class="container section"><div class="bb-empty-state"><p>Barangay not found for code "' +
            window.BBSourceVerification.escapeHtml(code) +
            '". <a href="' +
            rootPrefix +
            'barangays/">Return to Barangay Directory</a>.</p></div></div>';
          return;
        }
        var lgu = (res[1].lgus || []).find(function (l) {
          return l.slug === brgy.lgu_slug;
        });
        renderProfile(brgy, lgu, window.BBSourceVerification, rootPrefix);
      })
      .catch(function () {
        root.innerHTML =
          '<div class="container section"><div class="bb-empty-state"><p>Unable to load barangay profile data.</p></div></div>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBarangayProfile);
  } else {
    initBarangayProfile();
  }
})();
