/**
 * Officials page renderer
 * Reads data/officials.json and renders the Governor, Vice Governor, the
 * Sangguniang Panlalawigan (district Board Members and ex officio members) and
 * the House representatives into #officials-container.
 *
 * Labels carry data-i18n keys; the translation engine's MutationObserver
 * translates them when they are added to the page. Names are inserted as
 * escaped text and are never translated.
 */
document.addEventListener('DOMContentLoaded', () => {
  const officialsContainer = document.getElementById('officials-container');
  if (!officialsContainer) return;

  const ORDINALS = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' };
  // Ex officio seat id -> card colour modifier in style.css
  const SEAT_MODIFIERS = { abc: 'liga', sk: 'sk', ipmr: 'ipmr' };

  fetch('../data/officials.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      officialsContainer.innerHTML = renderOfficials(data || {});
    })
    .catch((error) => {
      console.error('Error fetching officials data:', error);
      officialsContainer.innerHTML =
        '<p class="text-center" data-i18n="officials-load-error">' +
        'We could not load the list of officials. Please try again later.</p>';
    });

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function districtLabel(district) {
    const n = Number(district);
    const text = (ORDINALS[n] || escapeHtml(district)) + ' District';
    return ORDINALS[n] ? `<span data-i18n="officials-district-${n}">${text}</span>` : text;
  }

  function sortedDistricts(list) {
    return [...new Set(list.map((item) => Number(item.district)))]
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => a - b);
  }

  function executiveCard(official, titleKey, fallbackTitle, roleKey) {
    const role =
      roleKey && official.role ? `<p data-i18n="${roleKey}">${escapeHtml(official.role)}</p>` : '';
    return `
      <div class="official-card card">
        <div class="official-photo">
          <i class="bi bi-person-circle" style="font-size: 6rem; color: var(--color-primary)" aria-hidden="true"></i>
        </div>
        <div class="official-info">
          <h3>${escapeHtml(official.name)}</h3>
          <p class="official-title" data-i18n="${titleKey}">${escapeHtml(official.title || fallbackTitle)}</p>
          ${role}
        </div>
      </div>`;
  }

  function memberCard(name, badgeHtml, extraClass) {
    return `
      <div class="board-member-card card text-center${extraClass ? ' ' + extraClass : ''}">
        <i class="bi bi-person-badge" style="font-size: 3rem; color: var(--color-primary)" aria-hidden="true"></i>
        <h4>${escapeHtml(name)}</h4>
        <p class="badge badge-info">${badgeHtml}</p>
      </div>`;
  }

  function sectionHeading(key, text, introKey, introText) {
    const intro = introKey ? `<p class="text-center" data-i18n="${introKey}">${introText}</p>` : '';
    return `<h2 class="text-center" data-i18n="${key}">${text}</h2>${intro}`;
  }

  function renderOfficials(data) {
    let html = '';

    // Governor and Vice Governor
    if (data.governor || data.vice_governor) {
      html += '<div style="margin-bottom: var(--spacing-xl)">';
      html += sectionHeading('officials-executive-branch', 'Executive Branch');
      html += '<div class="grid grid-2">';
      if (data.governor) {
        html += executiveCard(data.governor, 'officials-provincial-governor', 'Governor');
      }
      if (data.vice_governor) {
        html += executiveCard(
          data.vice_governor,
          'officials-provincial-vice-governor',
          'Vice Governor',
          'officials-presiding-officer-sp'
        );
      }
      html += '</div></div>';
    }

    // Sangguniang Panlalawigan
    const boardMembers = asArray(data.board_members);
    const exOfficio = asArray(data.ex_officio);
    if (boardMembers.length || exOfficio.length) {
      html += '<div style="margin-bottom: var(--spacing-xl)">';
      html += sectionHeading(
        'officials-sangguniang-bayan-members',
        'Sangguniang Panlalawigan (Provincial Board)',
        'officials-sp-intro',
        'The Vice Governor presides. The Board has 10 Board Members elected by district and 4 ex officio members.'
      );

      sortedDistricts(boardMembers).forEach((district) => {
        html += `<h3 class="text-center" style="font-size: 1.25rem; margin-top: var(--spacing-lg)">${districtLabel(district)}</h3>`;
        html += '<div class="grid grid-4">';
        boardMembers
          .filter((member) => Number(member.district) === district)
          .forEach((member) => {
            html += memberCard(
              member.name,
              '<span data-i18n="officials-sb-member">Board Member</span>'
            );
          });
        html += '</div>';
      });

      if (exOfficio.length) {
        html +=
          '<h3 class="text-center" style="font-size: 1.25rem; margin-top: var(--spacing-lg)" data-i18n="officials-ex-officio-members">Ex officio members</h3>';
        html += '<div class="grid grid-4">';
        exOfficio.forEach((member) => {
          const id = String(member.id || '').replace(/[^a-z0-9-]/gi, '');
          const seat = escapeHtml(member.seat || '');
          const badge = id ? `<span data-i18n="officials-seat-${id}">${seat}</span>` : seat;
          const modifier = SEAT_MODIFIERS[id];
          html += memberCard(member.name, badge, modifier ? `board-member-card--${modifier}` : '');
        });
        html += '</div>';
        html +=
          '<p class="text-center" style="font-size: 0.875rem; color: var(--color-text-light); margin-top: var(--spacing-md)" data-i18n="officials-ex-officio-note">' +
          'Ex officio members sit on the Board because of the league or federation they lead. ' +
          'These seats can change mid-term; confirm current holders with the Sangguniang Panlalawigan.</p>';
      }
      html += '</div>';
    }

    // House of Representatives
    const representatives = asArray(data.representatives);
    if (representatives.length) {
      html += '<div style="margin-bottom: var(--spacing-xl)">';
      html += sectionHeading(
        'officials-house-reps',
        'House of Representatives',
        'officials-house-reps-intro',
        'Each of the four legislative districts of Bukidnon elects one member of the House of Representatives.'
      );
      html += '<div class="grid grid-4">';
      [...representatives]
        .sort((a, b) => Number(a.district) - Number(b.district))
        .forEach((rep) => {
          html += memberCard(
            rep.name,
            `${districtLabel(rep.district)} · <span data-i18n="officials-representative">Representative</span>`
          );
        });
      html += '</div></div>';
    }

    if (!html) {
      return (
        '<p class="text-center" data-i18n="officials-no-data">' +
        'We are still gathering this information.</p>'
      );
    }

    // Sources and last verified date
    const sources = asArray(data.sources).filter((s) => s && /^https:\/\//.test(s.url || ''));
    if (sources.length || data.last_verified) {
      html += '<p class="text-center" style="font-size: 0.875rem; color: var(--color-text-light)">';
      if (sources.length) {
        html += '<span data-i18n="officials-sources-label">Sources:</span> ';
        html += sources
          .map(
            (s) =>
              `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.name || s.url)}</a>`
          )
          .join('; ');
        html += '. ';
      }
      if (data.last_verified) {
        html += `<span data-i18n="officials-last-verified">Last verified:</span> ${escapeHtml(data.last_verified)}`;
      }
      html += '</p>';
    }

    return html;
  }
});
