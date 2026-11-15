/**
 * BetterBukidnon Individual LGU Profile Renderer (Task 03 - Part B)
 *
 * Added & Changed:
 * - Renders all 22 City and Municipality profile pages from data/lgus.json and data/barangays.json.
 * - Hero banner with official LGU seal, classification/district/PSGC pills, and locality introduction.
 * - Sticky sub-navigation bar for quick section jumps.
 * - 4-column KPI dashboard (Population, Land Area, Barangays, Classification) and info strip.
 * - Unified cards for Leadership (Mayor & Vice Mayor), Government Offices, Barangay sub-directory,
 *   Public Services, Infrastructure, and Official References.
 */
(function () {
  'use strict';

  function fmt(n) {
    return typeof n === 'number' ? n.toLocaleString('en-US') : 'Unavailable';
  }

  var STANDARD_OFFICES = [
    {
      name: "Mayor's Office",
      icon: 'bi-building-fill',
      role: 'Chief executive office, local governance, and public assistance',
    },
    {
      name: "Vice Mayor's Office",
      icon: 'bi-person-workspace',
      role: 'Presiding office of the local Sanggunian',
    },
    {
      name: 'Sangguniang Panlungsod / Bayan',
      icon: 'bi-bank2',
      role: 'Local legislative body, ordinances, and resolutions',
    },
    {
      name: 'Local Civil Registry Office',
      icon: 'bi-file-earmark-person-fill',
      role: 'Birth, marriage, and death certificate registration',
    },
    {
      name: "Treasurer's Office",
      icon: 'bi-cash-coin',
      role: 'Local tax collection, fees, and revenue management',
    },
    {
      name: "Assessor's Office",
      icon: 'bi-house-check-fill',
      role: 'Real property assessment and tax declarations',
    },
    {
      name: 'Business Permits & Licensing Office',
      icon: 'bi-shop',
      role: 'Business permit applications and renewals',
    },
    {
      name: 'Engineering Office',
      icon: 'bi-tools',
      role: 'Local public works, building permits, and infrastructure',
    },
    {
      name: 'Planning & Development Office',
      icon: 'bi-compass-fill',
      role: 'Comprehensive land use and development planning',
    },
    {
      name: 'Health Office',
      icon: 'bi-heart-pulse-fill',
      role: 'Rural/city health units, immunization, and sanitation',
    },
    {
      name: 'Social Welfare & Development Office',
      icon: 'bi-people-fill',
      role: 'Social assistance, senior/PWD, and family welfare',
    },
    {
      name: 'Agriculture Office',
      icon: 'bi-tree-fill',
      role: 'Farmer support, crop programs, and veterinary services',
    },
    {
      name: 'DRRM Office (CDRRMO / MDRRMO)',
      icon: 'bi-shield-fill-exclamation',
      role: 'Disaster preparedness, emergency response, and rescue',
    },
  ];

  function renderProfile(lgu, barangays, contacts, dpwhProjects, sv, rootPrefix) {
    var esc = sv.escapeHtml;
    var root = document.getElementById('lgu-profile-root');
    if (!root) return;

    var coordText =
      lgu.coordinates && lgu.coordinates.lat && lgu.coordinates.lon
        ? lgu.coordinates.lat.toFixed(4) + '° N, ' + lgu.coordinates.lon.toFixed(4) + '° E'
        : 'Pending verification';

    var mapHref =
      lgu.coordinates && lgu.coordinates.lat && lgu.coordinates.lon
        ? 'https://www.openstreetmap.org/?mlat=' +
          encodeURIComponent(lgu.coordinates.lat) +
          '&mlon=' +
          encodeURIComponent(lgu.coordinates.lon) +
          '#map=13/' +
          encodeURIComponent(lgu.coordinates.lat) +
          '/' +
          encodeURIComponent(lgu.coordinates.lon)
        : null;

    var sealHtml = sv.renderSealImage(
      lgu.seal,
      lgu.name + ' official seal',
      rootPrefix,
      'bb-seal-frame--lg'
    );

    var ordDistrict =
      lgu.district === 1
        ? '1st'
        : lgu.district === 2
          ? '2nd'
          : lgu.district === 3
            ? '3rd'
            : '4th';

    // 1. Hero & Sticky Sub-Navigation
    var heroHtml =
      '<section class="bb-profile-hero">' +
      '<div class="container bb-profile-hero-inner">' +
      sealHtml +
      '<div class="bb-profile-hero-body">' +
      '<div class="bb-profile-hero-tags">' +
      '<span class="bb-hero-pill"><i class="bi bi-building" aria-hidden="true"></i> ' +
      esc(lgu.classification) +
      (lgu.is_capital ? ' &middot; Provincial Capital' : '') +
      '</span>' +
      '<span class="bb-hero-pill"><i class="bi bi-diagram-3" aria-hidden="true"></i> ' +
      ordDistrict +
      ' District</span>' +
      '<span class="bb-hero-pill"><i class="bi bi-hash" aria-hidden="true"></i> PSGC ' +
      esc(lgu.psgc_code) +
      '</span>' +
      '</div>' +
      '<h1>' +
      esc(lgu.name) +
      '</h1>' +
      '<p class="bb-profile-hero-sub">Province of Bukidnon &middot; Region X (Northern Mindanao)</p>' +
      (lgu.introduction ? '<p class="bb-profile-intro">' + esc(lgu.introduction) + '</p>' : '') +
      '</div>' +
      '</div>' +
      '</section>';

    var navHtml =
      '<div class="bb-profile-nav-bar">' +
      '<div class="container">' +
      '<nav class="bb-profile-nav" aria-label="Profile sections">' +
      '<a href="#overview" class="bb-profile-nav-link is-active"><i class="bi bi-grid-1x2-fill" aria-hidden="true"></i> Overview</a>' +
      '<a href="#leadership" class="bb-profile-nav-link"><i class="bi bi-person-badge-fill" aria-hidden="true"></i> Leadership</a>' +
      '<a href="#offices" class="bb-profile-nav-link"><i class="bi bi-building-fill" aria-hidden="true"></i> Government Offices</a>' +
      '<a href="#barangays" class="bb-profile-nav-link"><i class="bi bi-pin-map-fill" aria-hidden="true"></i> Barangays (' +
      barangays.length +
      ')</a>' +
      '<a href="#services" class="bb-profile-nav-link"><i class="bi bi-briefcase-fill" aria-hidden="true"></i> Public Services</a>' +
      '<a href="#infrastructure" class="bb-profile-nav-link"><i class="bi bi-cone-striped" aria-hidden="true"></i> Infrastructure</a>' +
      '<a href="#references" class="bb-profile-nav-link"><i class="bi bi-journal-check" aria-hidden="true"></i> References</a>' +
      '</nav>' +
      '</div>' +
      '</div>';

    var overviewHtml =
      '<section class="section bb-profile-section" id="overview">' +
      '<div class="container">' +
      '<div class="bb-profile-section-head">' +
      '<div>' +
      '<h2><i class="bi bi-bar-chart-line-fill" aria-hidden="true"></i> Key Demographics &amp; Jurisdiction</h2>' +
      '<p class="bb-profile-section-sub">Official PSA census metrics, land area, and administrative profile for ' +
      esc(lgu.name) +
      '</p>' +
      '</div>' +
      (mapHref
        ? '<a href="' +
          mapHref +
          '" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm"><i class="bi bi-geo-alt-fill" aria-hidden="true"></i> Open in OpenStreetMap</a>'
        : '') +
      '</div>' +
      '<div class="bb-kpi-grid">' +
      '<div class="bb-kpi-card">' +
      '<div class="bb-kpi-icon" aria-hidden="true"><i class="bi bi-people-fill"></i></div>' +
      '<div class="bb-kpi-body">' +
      '<span class="bb-kpi-label">Population (' +
      esc(lgu.population.latest_year) +
      ')</span>' +
      '<div class="bb-kpi-value">' +
      fmt(lgu.population.latest) +
      '</div>' +
      '<span class="bb-kpi-note">' +
      esc(lgu.population.latest_source) +
      (lgu.population.population_2024
        ? ' &middot; 2020: ' + fmt(lgu.population.population_2020)
        : '') +
      '</span>' +
      '</div>' +
      '</div>' +
      '<div class="bb-kpi-card">' +
      '<div class="bb-kpi-icon" aria-hidden="true"><i class="bi bi-aspect-ratio-fill"></i></div>' +
      '<div class="bb-kpi-body">' +
      '<span class="bb-kpi-label">Land Area</span>' +
      '<div class="bb-kpi-value">' +
      (lgu.area_km2 ? lgu.area_km2.toLocaleString('en-US') + ' km²' : 'Pending') +
      '</div>' +
      '<span class="bb-kpi-note">Approx. ' +
      fmt(lgu.population.density_per_km2) +
      ' residents / km²</span>' +
      '</div>' +
      '</div>' +
      '<div class="bb-kpi-card">' +
      '<div class="bb-kpi-icon" aria-hidden="true"><i class="bi bi-pin-map-fill"></i></div>' +
      '<div class="bb-kpi-body">' +
      '<span class="bb-kpi-label">Barangays</span>' +
      '<div class="bb-kpi-value">' +
      fmt(lgu.barangay_count) +
      ' Barangays</div>' +
      '<span class="bb-kpi-note">PSA PSGC Geographic Dataset</span>' +
      '</div>' +
      '</div>' +
      '<div class="bb-kpi-card">' +
      '<div class="bb-kpi-icon" aria-hidden="true"><i class="bi bi-bank"></i></div>' +
      '<div class="bb-kpi-body">' +
      '<span class="bb-kpi-label">Classification</span>' +
      '<div class="bb-kpi-value">' +
      esc(lgu.classification) +
      '</div>' +
      '<span class="bb-kpi-note">' +
      ordDistrict +
      ' Legislative District (RA 10184)</span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="bb-info-strip">' +
      '<div class="bb-info-strip-items">' +
      '<div class="bb-meta-item"><span class="bb-meta-label">Seat of Government</span><span class="bb-meta-value">' +
      (lgu.hall_address ? esc(lgu.hall_address) : esc(lgu.name) + ' Municipal / City Hall') +
      '</span></div>' +
      '<div class="bb-meta-item"><span class="bb-meta-label">Geographic Coordinates</span><span class="bb-meta-value">' +
      esc(coordText) +
      '</span></div>' +
      '<div class="bb-meta-item"><span class="bb-meta-label">Official Portal</span><span class="bb-meta-value">' +
      (lgu.website
        ? '<a href="' +
          esc(lgu.website) +
          '" target="_blank" rel="noopener noreferrer">' +
          esc(lgu.website) +
          ' <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a>'
        : 'Refer to Provincial Capitol Directory') +
      '</span></div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</section>';

    // 2. Leadership
    var mayor = lgu.leadership.mayor;
    var vm = lgu.leadership.vice_mayor;
    var mayorStatusNote =
      mayor.status === 'verified'
        ? 'Verified on official LGU portal'
        : '2025 election results &middot; Pending official directory confirmation';
    var vmStatusNote =
      vm.status === 'verified'
        ? 'Verified on official LGU portal'
        : '2025 election results &middot; Pending official directory confirmation';
    var leadershipHtml =
      '<section class="section bb-profile-section bg-alt" id="leadership">' +
      '<div class="container">' +
      '<div class="bb-profile-section-head">' +
      '<div>' +
      '<h2><i class="bi bi-person-badge-fill" aria-hidden="true"></i> Local Government Leadership</h2>' +
      '<p class="bb-profile-section-sub">Elected executive and presiding officials for the 2025&ndash;2028 term</p>' +
      '</div>' +
      '</div>' +
      '<div class="bb-card-grid bb-card-grid--2">' +
      '<article class="bb-card" style="border-top:3px solid var(--color-primary)">' +
      '<div class="bb-card-top">' +
      '<div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-person-badge-fill"></i></div>' +
      '<div class="bb-card-heading"><span class="bb-badge bb-badge--city" style="margin-bottom:4px">Local Chief Executive</span><h3 class="bb-card-title">' +
      esc(mayor.name) +
      '</h3><p class="bb-card-subtitle">' +
      esc(mayor.title) +
      (mayor.party ? ' &middot; ' + esc(mayor.party) : '') +
      '</p><p class="bb-card-subtitle" style="font-size:0.75rem;margin-top:4px;opacity:0.85">' +
      mayorStatusNote +
      '</p></div>' +
      '</div>' +
      '</article>' +
      '<article class="bb-card" style="border-top:3px solid var(--color-primary)">' +
      '<div class="bb-card-top">' +
      '<div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-person-badge"></i></div>' +
      '<div class="bb-card-heading"><span class="bb-badge bb-badge--muni" style="margin-bottom:4px">Presiding Officer, Sanggunian</span><h3 class="bb-card-title">' +
      esc(vm.name) +
      '</h3><p class="bb-card-subtitle">' +
      esc(vm.title) +
      (vm.party ? ' &middot; ' + esc(vm.party) : '') +
      '</p><p class="bb-card-subtitle" style="font-size:0.75rem;margin-top:4px;opacity:0.85">' +
      vmStatusNote +
      '</p></div>' +
      '</div>' +
      '</article>' +
      '</div>' +
      '</div>' +
      '</section>';

    // 3. Government Offices
    var lguContacts = contacts.filter(function (c) {
      return c.lgu_slug === lgu.slug;
    });
    var officesHtml =
      '<section class="section bb-profile-section" id="offices">' +
      '<div class="container">' +
      '<div class="bb-profile-section-head">' +
      '<div>' +
      '<h2><i class="bi bi-building-fill" aria-hidden="true"></i> Government Offices &amp; Public Contacts</h2>' +
      '<p class="bb-profile-section-sub">Key departments, emergency responders, and front-line service offices in ' +
      esc(lgu.name) +
      '</p>' +
      '</div>' +
      '</div>' +
      (lguContacts.length > 0
        ? '<div class="bb-card-grid" style="margin-bottom:var(--spacing-md)">' +
          lguContacts
            .map(function (c) {
              return (
                '<article class="bb-card" style="border-left:4px solid var(--color-primary)">' +
                '<div class="bb-card-top">' +
                '<div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-telephone-inbound-fill"></i></div>' +
                '<div class="bb-card-heading"><h3 class="bb-card-title">' +
                esc(c.name) +
                '</h3><p class="bb-card-subtitle">' +
                esc(c.responsibilities) +
                '</p></div>' +
                '</div>' +
                (c.phone
                  ? '<div class="bb-card-actions"><a href="' +
                    esc(c.tel_href) +
                    '" class="btn btn-primary btn-sm"><i class="bi bi-telephone-fill" aria-hidden="true"></i> ' +
                    esc(c.phone) +
                    '</a></div>'
                  : '') +
                '</article>'
              );
            })
            .join('') +
          '</div>'
        : '') +
      '<div class="bb-card-grid">' +
      STANDARD_OFFICES.map(function (o) {
        return (
          '<article class="bb-card">' +
          '<div class="bb-card-top">' +
          '<div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi ' +
          o.icon +
          '"></i></div>' +
          '<div class="bb-card-heading"><h3 class="bb-card-title">' +
          esc(o.name) +
          '</h3><p class="bb-card-subtitle">' +
          esc(o.role) +
          '</p></div>' +
          '</div>' +
          '</article>'
        );
      }).join('') +
      '</div>' +
      '</div>' +
      '</section>';

    // 4. Barangay Directory
    var brgyHtml =
      '<section class="section bb-profile-section bg-alt" id="barangays">' +
      '<div class="container">' +
      '<div class="bb-profile-section-head">' +
      '<div><h2><i class="bi bi-pin-map-fill" aria-hidden="true"></i> Barangays of ' +
      esc(lgu.name) +
      ' (' +
      barangays.length +
      ')</h2><p class="bb-profile-section-sub">Complete directory of all ' +
      barangays.length +
      ' component barangays and Punong Barangays</p></div>' +
      '<input type="search" id="lgu-brgy-filter" class="bb-input" style="max-width:280px" placeholder="Filter barangays..." aria-label="Filter barangays in ' +
      esc(lgu.name) +
      '" />' +
      '</div>' +
      '<div id="lgu-brgy-grid" class="bb-card-grid"></div>' +
      '</div>' +
      '</section>';

    // 5. Public Services
    var servicesHtml =
      '<section class="section bb-profile-section" id="services">' +
      '<div class="container">' +
      '<div class="bb-profile-section-head">' +
      '<div>' +
      '<h2><i class="bi bi-briefcase-fill" aria-hidden="true"></i> Citizen &amp; Business Service Guides</h2>' +
      '<p class="bb-profile-section-sub">Step-by-step requirements and procedures for local government transactions in ' +
      esc(lgu.name) +
      '</p>' +
      '</div>' +
      '</div>' +
      '<div class="bb-card-grid">' +
      '<a href="' +
      rootPrefix +
      'services/certificates.html" class="bb-card"><div class="bb-card-top"><div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-file-earmark-text-fill"></i></div><div class="bb-card-heading"><h3 class="bb-card-title">Civil Registration</h3><p class="bb-card-subtitle">Birth, marriage, and death certificates via Local Civil Registry</p></div></div></a>' +
      '<a href="' +
      rootPrefix +
      'services/business.html" class="bb-card"><div class="bb-card-top"><div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-shop"></i></div><div class="bb-card-heading"><h3 class="bb-card-title">Business Permits</h3><p class="bb-card-subtitle">New business registration and annual BPLO renewals</p></div></div></a>' +
      '<a href="' +
      rootPrefix +
      'services/tax-payments.html" class="bb-card"><div class="bb-card-top"><div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-cash-stack"></i></div><div class="bb-card-heading"><h3 class="bb-card-title">Local Taxes &amp; Fees</h3><p class="bb-card-subtitle">Real property tax and local treasury payments</p></div></div></a>' +
      '<a href="' +
      rootPrefix +
      'services/social-services.html" class="bb-card"><div class="bb-card-top"><div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-people-fill"></i></div><div class="bb-card-heading"><h3 class="bb-card-title">Social Welfare</h3><p class="bb-card-subtitle">AICS, senior citizen, solo parent, and PWD assistance</p></div></div></a>' +
      '<a href="' +
      rootPrefix +
      'services/health.html" class="bb-card"><div class="bb-card-top"><div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-heart-pulse-fill"></i></div><div class="bb-card-heading"><h3 class="bb-card-title">Health Services</h3><p class="bb-card-subtitle">City/municipal health centers and provincial hospitals</p></div></div></a>' +
      '<a href="' +
      rootPrefix +
      'services/agriculture.html" class="bb-card"><div class="bb-card-top"><div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-tree-fill"></i></div><div class="bb-card-heading"><h3 class="bb-card-title">Agricultural Assistance</h3><p class="bb-card-subtitle">RSBSA, seed distribution, and veterinary programs</p></div></div></a>' +
      '</div>' +
      '</div>' +
      '</section>';

    // 6. Infrastructure
    var matchedProjects = dpwhProjects.filter(function (p) {
      var text = JSON.stringify(p).toLowerCase();
      return text.indexOf(lgu.name.toLowerCase()) !== -1;
    });
    var infraHtml =
      '<section class="section bb-profile-section bg-alt" id="infrastructure">' +
      '<div class="container">' +
      '<div class="bb-profile-section-head">' +
      '<div>' +
      '<h2><i class="bi bi-cone-striped" aria-hidden="true"></i> Infrastructure &amp; Public Works</h2>' +
      '<p class="bb-profile-section-sub">Public works and transparency monitoring for ' +
      esc(lgu.name) +
      '</p>' +
      '</div>' +
      '<a href="' +
      rootPrefix +
      'budget/" class="btn btn-secondary btn-sm">Open Transparency Portal <i class="bi bi-arrow-right" aria-hidden="true"></i></a>' +
      '</div>' +
      (matchedProjects.length > 0
        ? '<p>Matched ' + matchedProjects.length + ' project record(s) for ' + esc(lgu.name) + '.</p>'
        : '<div class="bb-info-strip"><div><strong>Provincial &amp; National Infrastructure Tracker</strong><p class="bb-empty-note">Explore provincial road networks, fiscal allocations, and public works disclosures on the <a href="' +
          rootPrefix +
          'budget/">Transparency Portal</a> and <a href="https://infra.betterbukidnon.org" target="_blank" rel="noopener noreferrer">BetterBukidnon Infrastructure Tracker</a>.</p></div></div>') +
      '</div>' +
      '</section>';

    // 7. References
    var refsHtml =
      '<section class="section bb-profile-section" id="references">' +
      '<div class="container">' +
      '<div class="bb-profile-section-head">' +
      '<div>' +
      '<h2><i class="bi bi-journal-check" aria-hidden="true"></i> Official References &amp; Attribution</h2>' +
      '<p class="bb-profile-section-sub">Authoritative government publications and datasets backing this profile</p>' +
      '</div>' +
      '</div>' +
      sv.renderCitations(lgu.sources) +
      (lgu.seal && lgu.seal.source_url
        ? '<p class="bb-empty-note" style="margin-top:var(--spacing-sm)">Official seal reference: <a href="' +
          esc(lgu.seal.source_url) +
          '" target="_blank" rel="noopener noreferrer">Wikimedia / Official Seal File</a> (' +
          esc(lgu.seal.license || 'Official Government Seal') +
          ')</p>'
        : '') +
      '</div>' +
      '</section>';

    root.innerHTML =
      heroHtml +
      navHtml +
      overviewHtml +
      leadershipHtml +
      officesHtml +
      brgyHtml +
      servicesHtml +
      infraHtml +
      refsHtml;

    // Wire sub-navigation active state
    var navLinks = root.querySelectorAll('.bb-profile-nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.forEach(function (l) {
          l.classList.remove('is-active');
        });
        link.classList.add('is-active');
      });
    });

    // Wire barangay sub-filter
    var brgyGrid = document.getElementById('lgu-brgy-grid');
    var brgyFilter = document.getElementById('lgu-brgy-filter');

    function renderBrgys(list) {
      if (!brgyGrid) return;
      if (list.length === 0) {
        brgyGrid.innerHTML =
          '<div class="bb-empty-state" style="grid-column:1/-1"><p>No matching barangays.</p></div>';
        return;
      }
      brgyGrid.innerHTML = list
        .map(function (b) {
          var pbName =
            b.leadership && b.leadership.punong_barangay
              ? esc(b.leadership.punong_barangay.name)
              : 'Pending';
          return (
            '<article class="bb-card">' +
            '<div class="bb-card-top">' +
            sv.renderSealImage(
              b.seal && b.seal.path ? b.seal : lgu.seal,
              b.name + ' seal',
              rootPrefix,
              'bb-seal-frame--sm'
            ) +
            '<div class="bb-card-heading"><h3 class="bb-card-title">' +
            esc(b.name) +
            '</h3><p class="bb-card-subtitle">PSGC ' +
            esc(b.psgc_code) +
            '</p></div>' +
            '</div>' +
            (b.introduction ? '<p class="bb-card-intro">' + esc(b.introduction) + '</p>' : '') +
            '<div class="bb-card-meta">' +
            '<div class="bb-meta-item" style="grid-column: 1 / -1">' +
            '<span class="bb-meta-label">Punong Barangay (2023&ndash;2025)</span>' +
            '<span class="bb-meta-value">' +
            pbName +
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
        })
        .join('');
    }

    renderBrgys(barangays);
    if (brgyFilter) {
      brgyFilter.addEventListener('input', function () {
        var q = brgyFilter.value.trim().toLowerCase();
        renderBrgys(
          barangays.filter(function (b) {
            return !q || b.name.toLowerCase().indexOf(q) !== -1 || b.psgc_code.indexOf(q) !== -1;
          })
        );
      });
    }
  }

  function initLguProfile() {
    var main = document.getElementById('main-content');
    if (!main || !window.BBSourceVerification) return;
    var slug = main.getAttribute('data-lgu-slug');
    if (!slug) return;
    var rootPrefix = main.getAttribute('data-root') || '../../';

    Promise.all([
      fetch(rootPrefix + 'data/lgus.json').then((r) => r.json()),
      fetch(rootPrefix + 'data/barangays.json').then((r) => r.json()),
      fetch(rootPrefix + 'data/contacts.json')
        .then((r) => r.json())
        .catch(() => ({ contacts: [] })),
      fetch(rootPrefix + 'data/dpwh-projects.json')
        .then((r) => r.json())
        .catch(() => ({ projects: [] })),
    ])
      .then(function (results) {
        var lgus = results[0].lgus || [];
        var lgu = lgus.find(function (l) {
          return l.slug === slug;
        });
        if (!lgu) return;
        var brgys = (results[1].barangays || []).filter(function (b) {
          return b.lgu_slug === slug;
        });
        var contacts = results[2].contacts || [];
        var dpwh = results[3].projects || [];
        renderProfile(lgu, brgys, contacts, dpwh, window.BBSourceVerification, rootPrefix);
      })
      .catch(function () {
        var root = document.getElementById('lgu-profile-root');
        if (root) {
          root.innerHTML =
            '<div class="container section"><div class="bb-empty-state"><p>Unable to load LGU profile data.</p></div></div>';
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLguProfile);
  } else {
    initLguProfile();
  }
})();
