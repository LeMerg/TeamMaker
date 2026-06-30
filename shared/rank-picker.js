/* ── Rank picker: small dropdown with rank logos, replaces native <select> ──
   Each page must define before use:
     window.PAGE_RANKS    = [{label, value, ...}, ...]
     window.PAGE_RANK_IMG = { [label]: 'path/to/logo.webp', ... }
   Optional: window.onRankFieldChange(fieldId, value) — called after a pick.

   The dropdown list is "ported" to document.body while open. This is
   required because several ancestor cards use clip-path for their cut-corner
   look, and per the CSS spec, clip-path/transform/filter on an ancestor
   creates a new containing block that traps even position:fixed children
   inside its own clipped box. Moving the dropdown out to <body> guarantees
   it always renders fully, on top of everything else.
*/
(function () {
  function rankByValue(value) {
    return (window.PAGE_RANKS || []).find(r => r.value === value) || (window.PAGE_RANKS || [])[0];
  }
  function imgFor(rank) {
    return (window.PAGE_RANK_IMG && window.PAGE_RANK_IMG[rank.label]) || '';
  }
  function dispLabel(rank) {
    return (typeof window.translateRankLabel === 'function') ? window.translateRankLabel(rank.label) : rank.label;
  }
  function triggerContent(rank) {
    const img = imgFor(rank);
    return `${img ? `<img src="${img}" alt="">` : ''}<span>${dispLabel(rank)}</span><i class="ti ti-chevron-down chev"></i>`;
  }

  window.renderRankField = function (fieldId, value) {
    const ranks = window.PAGE_RANKS || [];
    const opts = ranks.map(r => {
      const img = imgFor(r);
      return `<div class="rank-opt${r.value === value ? ' active' : ''}" onclick="selectRankOption('${fieldId}', ${r.value})">${img ? `<img src="${img}" alt="">` : ''}<span>${dispLabel(r)}</span></div>`;
    }).join('');
    const cur = rankByValue(value);
    return `<div class="rank-field" id="${fieldId}" data-value="${value}">
      <button type="button" class="rank-trigger" onclick="event.stopPropagation(); toggleRankDropdown('${fieldId}')">${triggerContent(cur)}</button>
      <div class="rank-dropdown" data-owner="${fieldId}">${opts}</div>
    </div>`;
  };

  window.getRankFieldValue = function (fieldId) {
    const el = document.getElementById(fieldId);
    return el ? parseInt(el.dataset.value, 10) : null;
  };

  window.toggleRankDropdown = function (fieldId) {
    const el = document.getElementById(fieldId);
    if (!el) return;
    const isOpen = el.classList.contains('open');
    closeAllRankDropdowns();
    if (!isOpen) openDropdown(el);
  };

  function openDropdown(el) {
    const dropdown = el.querySelector('.rank-dropdown');
    if (!dropdown) return;
    // Park a placeholder so we know exactly where to put the dropdown back.
    const placeholder = document.createElement('span');
    placeholder.style.display = 'none';
    placeholder.className = 'rank-dropdown-anchor';
    dropdown.parentNode.insertBefore(placeholder, dropdown);
    dropdown._anchor = placeholder;
    document.body.appendChild(dropdown);
    dropdown.classList.add('open');
    el.classList.add('open');
    positionDropdown(el);
  }

  function positionDropdown(el) {
    const trigger = el.querySelector('.rank-trigger');
    const dropdown = document.body.querySelector(`.rank-dropdown[data-owner="${el.id}"]`);
    if (!trigger || !dropdown) return;
    const rect = trigger.getBoundingClientRect();
    const margin = 10;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    // Natural height = however tall the full option list wants to be.
    dropdown.style.maxHeight = 'none';
    const naturalHeight = dropdown.scrollHeight || 280;
    // Pick whichever side has more room, then cap the dropdown height to
    // whatever actually fits there — it will never overflow off-screen,
    // and it now renders above any other card since it lives in <body>.
    const openUpward = spaceAbove > spaceBelow;
    const available = Math.max(120, openUpward ? spaceAbove : spaceBelow);
    dropdown.style.maxHeight = Math.min(naturalHeight, available) + 'px';
    dropdown.style.minWidth = Math.max(170, rect.width) + 'px';
    dropdown.style.left = Math.min(rect.left, window.innerWidth - 190) + 'px';
    if (openUpward) {
      dropdown.style.top = '';
      dropdown.style.bottom = (window.innerHeight - rect.top + 6) + 'px';
    } else {
      dropdown.style.bottom = '';
      dropdown.style.top = (rect.bottom + 6) + 'px';
    }
  }

  window.closeAllRankDropdowns = function () {
    document.querySelectorAll('.rank-field.open').forEach(el => {
      el.classList.remove('open');
      const dropdown = document.body.querySelector(`.rank-dropdown[data-owner="${el.id}"]`);
      if (dropdown) {
        dropdown.classList.remove('open');
        dropdown.style.maxHeight = ''; dropdown.style.top = ''; dropdown.style.bottom = ''; dropdown.style.left = ''; dropdown.style.minWidth = '';
        if (dropdown._anchor && dropdown._anchor.parentNode) {
          dropdown._anchor.parentNode.insertBefore(dropdown, dropdown._anchor);
          dropdown._anchor.remove();
          dropdown._anchor = null;
        }
      }
    });
  };

  window.selectRankOption = function (fieldId, value) {
    const el = document.getElementById(fieldId);
    if (!el) return;
    el.dataset.value = value;
    const rank = rankByValue(value);
    el.querySelector('.rank-trigger').innerHTML = triggerContent(rank);
    const dropdown = document.body.querySelector(`.rank-dropdown[data-owner="${fieldId}"]`) || el.querySelector('.rank-dropdown');
    dropdown.querySelectorAll('.rank-opt').forEach(o => o.classList.remove('active'));
    const ranks = window.PAGE_RANKS || [];
    const idx = ranks.findIndex(r => r.value === value);
    const optEls = dropdown.querySelectorAll('.rank-opt');
    if (optEls[idx]) optEls[idx].classList.add('active');
    closeAllRankDropdowns();
    if (typeof window.onRankFieldChange === 'function') window.onRankFieldChange(fieldId, value);
  };

  window.rankBadge = function (value) {
    const rank = rankByValue(value);
    const img = imgFor(rank);
    return `<span class="rank-badge">${img ? `<img src="${img}" alt="">` : ''}${dispLabel(rank)}</span>`;
  };

  document.addEventListener('click', function (e) {
    if (e.target.closest('.rank-dropdown')) return;
    if (!e.target.closest('.rank-field')) closeAllRankDropdowns();
  });
  document.addEventListener('scroll', function (e) {
    const openField = document.querySelector('.rank-field.open');
    if (!openField) return;
    // Scrolling inside the dropdown's own option list should not close it.
    if (e.target.closest && e.target.closest('.rank-dropdown')) return;
    // Any other scroll (e.g. the side panel) just repositions the dropdown.
    positionDropdown(openField);
  }, true);
  window.addEventListener('resize', function () {
    const openField = document.querySelector('.rank-field.open');
    if (openField) positionDropdown(openField);
  });
})();