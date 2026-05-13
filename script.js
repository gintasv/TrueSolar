(function () {
  'use strict';

  // ============================================================
  // DOM references
  // ============================================================
  const STRIP = document.getElementById('strip');
  const VIEWPORT = document.getElementById('strip-viewport');
  const HUD = document.querySelector('.hud');
  const HUD_DISTANCE = document.getElementById('hud-distance');
  const HUD_LIGHT_TIME = document.getElementById('hud-light-time');
  const HUD_NEXT = document.getElementById('hud-next');
  const HUD_SCALE = document.getElementById('hud-scale');
  const MINIMAP_TRACK = document.getElementById('minimap-track');
  const MINIMAP_CURSOR = document.getElementById('minimap-cursor');
  const MILESTONE_CARD = document.getElementById('milestone-card');
  const INTRO_CARD = document.getElementById('intro-card');
  const INTRO_DISMISS = document.getElementById('intro-dismiss');
  const STARS_BG = document.querySelector('.stars-bg');
  const STARS_BG_NEAR = document.querySelector('.stars-bg-near');
  const STARS_BG_FG = document.querySelector('.stars-bg-foreground');
  const MOTION_STREAKS = document.querySelector('.motion-streaks');
  const SUBZOOM_OVERLAY = document.getElementById('subzoom-overlay');
  const SUBZOOM_TITLE = document.getElementById('subzoom-title');
  const SUBZOOM_SCALE = document.getElementById('subzoom-scale');
  const SUBZOOM_VIEWPORT = document.getElementById('subzoom-viewport');
  const SUBZOOM_STRIP = document.getElementById('subzoom-strip');
  const SUBZOOM_DETAIL = document.getElementById('subzoom-detail');
  const SUBZOOM_CLOSE = document.getElementById('subzoom-close');
  const BODY_INDEX_TOGGLE = document.getElementById('body-index-toggle');
  const BODY_INDEX_LIST = document.getElementById('body-index-list');
  const GLOSSARY_NAV_TOGGLE = document.getElementById('glossary-nav-toggle');
  const GLOSSARY_NAV_LIST = document.getElementById('glossary-nav-list');
  const GLOSSARY_POPOVER = document.getElementById('glossary-popover');
  const GLOSSARY_POPOVER_TERM = document.getElementById('glossary-popover-term');
  const GLOSSARY_POPOVER_DEF = document.getElementById('glossary-popover-def');
  const INFO_PANEL = document.getElementById('info-panel');
  const INFO_PANEL_TITLE = document.getElementById('info-panel-title');
  const INFO_PANEL_BODY = document.getElementById('info-panel-body');
  const INFO_PANEL_CLOSE = document.getElementById('info-panel-close');

  // ============================================================
  // State
  // ============================================================
  let SUN_CENTER_PX = 0;
  let unitMode = 'km';
  const MIN_TOUCH_PX = 28;
  const POINT_BODIES = BODIES.filter(b => b.type !== 'belt');
  let currentSubzoomBody = null;
  let currentInfoPanelBody = null;

  // ============================================================
  // Glossary linkify + popover
  // ============================================================
  // GLOSSARY_BY_LOWER maps lowercased display-term → { canonical: <English key>, definition }
  // canonical key is stable across languages so popovers can be re-rendered after a switch.
  let GLOSSARY_BY_LOWER = {};
  let GLOSSARY_REGEX = null;
  let GLOSSARY_LAST_ANCHOR = null;

  function rebuildGlossaryIndex() {
    GLOSSARY_BY_LOWER = {};
    const entries = I18N.glossaryEntries();
    entries.forEach(e => {
      GLOSSARY_BY_LOWER[e.term.toLowerCase()] = { canonical: e.key, term: e.term, definition: e.definition };
    });
    const sortedTerms = entries.map(e => e.term).sort((a, b) => b.length - a.length);
    const escapedTerms = sortedTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    // Use Unicode-aware lookarounds so non-ASCII Lithuanian letters are treated as letters.
    GLOSSARY_REGEX = escapedTerms.length
      ? new RegExp('(?<![\\p{L}])(' + escapedTerms.join('|') + ')(?![\\p{L}])', 'giu')
      : null;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  function linkifyGlossary(text) {
    const safe = escapeHtml(text);
    if (!GLOSSARY_REGEX) return safe;
    return safe.replace(GLOSSARY_REGEX, (match) => {
      const entry = GLOSSARY_BY_LOWER[match.toLowerCase()];
      if (!entry) return match;
      return '<button type="button" class="glossary-term" data-term="'
        + escapeHtml(entry.canonical) + '">' + match + '</button>';
    });
  }

  let popoverOpenFor = null;
  function showGlossaryPopover(termKey, anchorEl) {
    const entry = I18N.glossaryEntryByKey(termKey);
    if (!entry) return;
    popoverOpenFor = termKey;
    GLOSSARY_LAST_ANCHOR = anchorEl;
    GLOSSARY_POPOVER_TERM.textContent = entry.term;
    GLOSSARY_POPOVER_DEF.textContent = entry.definition;
    GLOSSARY_POPOVER.hidden = false;
    GLOSSARY_POPOVER.setAttribute('aria-hidden', 'false');
    // Position above the anchor; flip below if no room
    const rect = anchorEl.getBoundingClientRect();
    GLOSSARY_POPOVER.style.left = '0px';
    GLOSSARY_POPOVER.style.top = '0px';
    const pw = GLOSSARY_POPOVER.offsetWidth;
    const ph = GLOSSARY_POPOVER.offsetHeight;
    let left = rect.left + rect.width / 2 - pw / 2;
    left = Math.max(8, Math.min(window.innerWidth - pw - 8, left));
    let top = rect.top - ph - 10;
    if (top < 8) top = rect.bottom + 10;
    GLOSSARY_POPOVER.style.left = left + 'px';
    GLOSSARY_POPOVER.style.top = top + 'px';
  }
  function hideGlossaryPopover() {
    popoverOpenFor = null;
    GLOSSARY_POPOVER.hidden = true;
    GLOSSARY_POPOVER.setAttribute('aria-hidden', 'true');
  }

  // Delegate clicks on any .glossary-term to open the popover
  document.addEventListener('click', (e) => {
    const term = e.target.closest('.glossary-term');
    if (term) {
      e.preventDefault();
      e.stopPropagation();
      const key = term.dataset.term;
      if (popoverOpenFor === key) hideGlossaryPopover();
      else showGlossaryPopover(key, term);
      return;
    }
    // Don't hide popover if click landed inside the popover itself or
    // on a glossary-nav button (those open their own popover next).
    if (e.target.closest('.glossary-popover')) return;
    if (e.target.closest('.glossary-nav-list')) return;
    hideGlossaryPopover();
  });

  // ============================================================
  // Formatting
  // ============================================================
  function currentLocale() { return I18N.locale[I18N.current] || 'en-US'; }

  function fmtFixed(n, digits) {
    return n.toLocaleString(currentLocale(), { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }

  function formatNumber(n) {
    if (n === 0) return '0';
    const abs = Math.abs(n);
    const loc = currentLocale();
    if (abs < 1) return fmtFixed(n, 2);
    if (abs < 1000) return Math.round(n).toLocaleString(loc);
    if (abs < 1e6) return fmtFixed(n / 1000, 1) + I18N.unit('numK');
    if (abs < 1e9) return fmtFixed(n / 1e6, 2) + I18N.unit('numM');
    if (abs < 1e12) return fmtFixed(n / 1e9, 2) + I18N.unit('numB');
    return fmtFixed(n / 1e12, 2) + I18N.unit('numT');
  }

  function formatDistance(km) {
    if (unitMode === 'au') {
      const au = km / KM_PER_AU;
      if (au < 0.001) return fmtFixed(au * 1000, 1) + I18N.unit('mAU');
      if (au < 1) return fmtFixed(au, 3) + I18N.unit('au');
      return fmtFixed(au, 2) + I18N.unit('au');
    }
    if (unitMode === 'mi') {
      return formatNumber(km * 0.621371) + I18N.unit('mi');
    }
    return formatNumber(km) + I18N.unit('km');
  }

  function formatLightTime(km) {
    if (km === 0) return '0' + I18N.unit('s');
    const seconds = km / SPEED_OF_LIGHT_KM_S;
    const loc = currentLocale();
    if (seconds < 0.001) return Math.round(seconds * 1e6).toLocaleString(loc) + I18N.unit('us');
    if (seconds < 1) return Math.round(seconds * 1000).toLocaleString(loc) + I18N.unit('ms');
    if (seconds < 60) return fmtFixed(seconds, 1) + I18N.unit('s');
    if (seconds < 3600) {
      const m = Math.floor(seconds / 60);
      const s = Math.round(seconds % 60);
      return m + I18N.unit('minSep') + s + I18N.unit('s');
    }
    if (seconds < 86400) {
      const h = Math.floor(seconds / 3600);
      const m = Math.round((seconds % 3600) / 60);
      return h + I18N.unit('hSep') + m + I18N.unit('min');
    }
    return fmtFixed(seconds / 86400, 1) + I18N.unit('days');
  }

  function bodyDistanceShort(body) {
    if (body.distance_km === 0) return I18N.unit('dashNoDist');
    if (body.distance_km >= KM_PER_AU * 0.3) {
      return fmtFixed(body.distance_km / KM_PER_AU, 2) + I18N.unit('au');
    }
    return formatNumber(body.distance_km) + I18N.unit('km');
  }

  // ============================================================
  // Coordinate transforms
  // ============================================================
  function strip_x(distance_km) {
    return SUN_CENTER_PX + distance_km * PX_PER_KM;
  }

  function camera_distance_km() {
    const cameraX = VIEWPORT.scrollLeft + VIEWPORT.clientWidth / 2;
    return Math.max(0, (cameraX - SUN_CENTER_PX) / PX_PER_KM);
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ============================================================
  // Build the strip
  // ============================================================
  function buildStrip() {
    // Place Sun so it is fully visible at scrollLeft=0, centered in initial viewport.
    const sunRadiusPx = BODIES[0].diameter_km * PX_PER_KM / 2;
    SUN_CENTER_PX = Math.max(window.innerWidth / 2, sunRadiusPx + 80);

    const totalWidth = SUN_CENTER_PX + TOTAL_WIDTH_PX + 400;
    STRIP.style.width = totalWidth + 'px';

    BODIES.forEach(body => {
      if (body.type === 'belt') buildBelt(body);
      else buildBody(body);
    });
  }

  function buildBody(body) {
    const wrap = document.createElement('div');
    wrap.className = 'body';
    wrap.id = 'body-' + body.id;
    wrap.dataset.id = body.id;
    wrap.dataset.type = body.type;
    wrap.style.left = strip_x(body.distance_km) + 'px';
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('role', 'link');
    wrap.setAttribute('aria-label', I18N.t('aria.body', { name: I18N.bodyName(body.id), dist: bodyDistanceShort(body) }));

    // Size: dot diameter or min touch target
    const diameterPx = body.diameter_km
      ? Math.max(body.diameter_km * PX_PER_KM, 1)
      : 2;
    const wrapSize = Math.max(diameterPx, MIN_TOUCH_PX);
    wrap.style.width = wrapSize + 'px';
    wrap.style.height = wrapSize + 'px';
    wrap.style.setProperty('--dot-radius', (diameterPx / 2) + 'px');

    // Visible dot
    const dot = document.createElement('span');
    dot.className = 'body-dot';
    dot.style.width = diameterPx + 'px';
    dot.style.height = diameterPx + 'px';
    if (body.color) dot.style.background = body.color;
    wrap.appendChild(dot);

    // Saturn-style rings
    if (body.rings) {
      const ringOuter = (body.rings.outer_km * 2) * PX_PER_KM;
      const ringHeight = Math.max(ringOuter * 0.22, 6);
      const rings = document.createElement('span');
      rings.className = 'body-rings';
      rings.style.width = ringOuter + 'px';
      rings.style.height = ringHeight + 'px';
      wrap.appendChild(rings);
    }

    // Label
    const labelPos = (body.type === 'probe' || body.type === 'milestone') ? 'below' : 'above';
    const label = document.createElement('span');
    label.className = 'body-label ' + labelPos;
    let meta = '';
    if (body.distance_km > 0) {
      meta = bodyDistanceShort(body);
      if (body.diameter_km) meta += I18N.t('label.diameterSep', { km: formatNumber(body.diameter_km) });
    } else if (body.diameter_km) {
      meta = I18N.t('label.diameterShort', { km: formatNumber(body.diameter_km) });
    }
    label.innerHTML = '<span class="body-label-name">' + escapeHtml(I18N.bodyName(body.id)) + '</span>' +
      (meta ? '<span class="body-label-meta">' + escapeHtml(meta) + '</span>' : '');
    wrap.appendChild(label);

    // Zoom affordance
    if (body.zoom) {
      const zoomBtn = document.createElement('button');
      zoomBtn.className = 'body-zoom-btn';
      zoomBtn.type = 'button';
      zoomBtn.setAttribute('aria-label', I18N.t('aria.zoomBtn', { name: I18N.bodyName(body.id) }));
      zoomBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openSubzoom(body);
      });
      wrap.appendChild(zoomBtn);
    }

    // Navigation: click → centre on body; keyboard Enter same
    wrap.addEventListener('click', (e) => {
      if (e.target.closest('.body-zoom-btn')) return;
      e.preventDefault();
      scrollToBody(body);
    });
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (body.zoom && (e.shiftKey || e.altKey)) openSubzoom(body);
        else scrollToBody(body);
      }
    });

    STRIP.appendChild(wrap);
    body._element = wrap;
  }

  function buildBelt(belt) {
    const startX = strip_x(belt.distance_km);
    const endX = strip_x(belt.distance_km_end);
    const wrap = document.createElement('div');
    wrap.className = 'belt';
    wrap.style.left = startX + 'px';
    wrap.style.width = (endX - startX) + 'px';

    const label = document.createElement('span');
    label.className = 'belt-label';
    label.textContent = I18N.bodyName(belt.id);
    wrap.appendChild(label);

    STRIP.appendChild(wrap);
    belt._element = wrap;
  }

  // ============================================================
  // Minimap (logarithmic scale)
  // ============================================================
  // Log scale: distance 0 → fraction 0, distance MAX → fraction 1.
  // Uses log10(d + 1) so log(0) is defined; small distances cluster near the left.
  const LOG_TOTAL = Math.log10(TOTAL_DISTANCE_KM + 1);

  function logFraction(distance_km) {
    if (distance_km <= 0) return 0;
    return Math.log10(distance_km + 1) / LOG_TOTAL;
  }

  function inverseLogFraction(fraction) {
    return Math.max(0, Math.pow(10, fraction * LOG_TOTAL) - 1);
  }

  function buildMinimap() {
    BODIES.forEach(body => {
      if (body.type === 'belt') return;
      const tick = document.createElement('div');
      tick.className = 'minimap-tick type-' + body.type;
      tick.style.left = (logFraction(body.distance_km) * 100) + '%';
      tick.dataset.id = body.id;
      const lbl = document.createElement('span');
      lbl.className = 'minimap-tick-label';
      lbl.textContent = I18N.bodyName(body.id);
      tick.appendChild(lbl);
      tick.title = I18N.bodyName(body.id);
      MINIMAP_TRACK.appendChild(tick);
    });

    MINIMAP_TRACK.addEventListener('click', (e) => {
      const rect = MINIMAP_TRACK.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const distKm = inverseLogFraction(fraction);
      scrollToDistance(distKm, true);
    });
  }

  // ============================================================
  // Body index nav (sidebar list)
  // ============================================================
  function buildBodyIndex() {
    POINT_BODIES.forEach(body => {
      const li = document.createElement('li');
      li.dataset.id = body.id;
      const a = document.createElement('a');
      a.href = '#' + body.id;
      a.innerHTML = escapeHtml(I18N.bodyName(body.id)) + '<span class="meta">' + escapeHtml(bodyDistanceShort(body)) + '</span>';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToBody(body);
        toggleBodyIndex(false);
      });
      li.appendChild(a);
      BODY_INDEX_LIST.appendChild(li);
    });

    BODY_INDEX_TOGGLE.addEventListener('click', () => {
      toggleBodyIndex(BODY_INDEX_LIST.hidden);
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.body-index')) toggleBodyIndex(false);
    });
  }
  function toggleBodyIndex(open) {
    BODY_INDEX_LIST.hidden = !open;
    BODY_INDEX_TOGGLE.setAttribute('aria-expanded', String(open));
  }

  // ============================================================
  // Scroll handling — single rAF-throttled handler for all updates
  // ============================================================
  let rafScheduled = false;
  let hashUpdateTimer = null;
  let milestoneShownId = null;
  let milestoneHideTimer = null;

  function onScroll() {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      updateAll();
    });
  }

  // Add an `is-scrolling` class to <body> while the user is actively scrolling,
  // remove it ~250 ms after they stop. The spaceship flame and motion streaks
  // listen to this class to bloom/fade.
  let scrollActivityTimer = null;
  // Direction tracking for the spaceship orientation. Only flip when the user
  // moves more than DIRECTION_THRESHOLD_PX in one direction, so jitter at rest
  // (sub-pixel browser noise, smooth-scroll easing tail) doesn't toggle the flip.
  let lastScrollForDir = -1;
  const DIRECTION_THRESHOLD_PX = 4;
  function updateFlyingDirection(currentScrollLeft) {
    if (lastScrollForDir < 0) { lastScrollForDir = currentScrollLeft; return; }
    const delta = currentScrollLeft - lastScrollForDir;
    if (Math.abs(delta) < DIRECTION_THRESHOLD_PX) return;
    const flyingLeft = delta < 0;
    if (flyingLeft !== document.body.classList.contains('is-flying-left')) {
      document.body.classList.toggle('is-flying-left', flyingLeft);
    }
    lastScrollForDir = currentScrollLeft;
  }
  function markScrollActivity() {
    if (!document.body.classList.contains('is-scrolling')) {
      document.body.classList.add('is-scrolling');
    }
    if (scrollActivityTimer) clearTimeout(scrollActivityTimer);
    scrollActivityTimer = setTimeout(() => {
      document.body.classList.remove('is-scrolling');
      scrollActivityTimer = null;
    }, 280);
  }

  function updateAll() {
    const scrollLeft = VIEWPORT.scrollLeft;
    const viewportWidth = VIEWPORT.clientWidth;
    const cameraX = scrollLeft + viewportWidth / 2;
    const distanceKm = Math.max(0, (cameraX - SUN_CENTER_PX) / PX_PER_KM);

    HUD_DISTANCE.textContent = formatDistance(distanceKm);
    HUD_LIGHT_TIME.textContent = formatLightTime(distanceKm);

    const nextBody = findNextBody(distanceKm);
    if (nextBody) {
      const remaining = nextBody.distance_km - distanceKm;
      HUD_NEXT.textContent = I18N.bodyName(nextBody.id) + I18N.unit('sep') + formatDistance(Math.max(0, remaining));
    } else {
      HUD_NEXT.textContent = I18N.t('hud.interstellar');
    }

    // Star parallax — multiply background-position-x by depth factor.
    // Far stars drift slowly, mid stars normal, foreground stars rush past.
    STARS_BG.style.backgroundPositionX = (-scrollLeft * 0.15) + 'px';
    STARS_BG_NEAR.style.backgroundPositionX = (-scrollLeft * 0.45) + 'px';
    if (STARS_BG_FG) STARS_BG_FG.style.backgroundPositionX = (-scrollLeft * 0.95) + 'px';
    if (MOTION_STREAKS) MOTION_STREAKS.style.backgroundPositionX = (-scrollLeft * 1.4) + 'px';

    // Mark scroll activity for the spaceship flame + motion streaks
    markScrollActivity();
    updateFlyingDirection(scrollLeft);

    // Minimap cursor
    const f = logFraction(distanceKm);
    MINIMAP_CURSOR.style.left = 'calc(' + (f * 100) + '% - 4px)';

    // Toggle in-view class for visible body labels
    const inViewMargin = viewportWidth * 0.6;
    POINT_BODIES.forEach(body => {
      if (!body._element) return;
      const bodyX = strip_x(body.distance_km);
      const visible = Math.abs(bodyX - cameraX) < inViewMargin;
      body._element.classList.toggle('in-view', visible);
    });

    // Milestone card — show body if camera is close to it. Also use the
    // same "near a body" check to land the spaceship (fade it out, as if
    // we've docked).
    const nearest = findNearestPointBody(distanceKm);
    let landed = false;
    if (nearest) {
      const nearestX = strip_x(nearest.distance_km);
      const proximityPx = nearest.diameter_km
        ? Math.max(nearest.diameter_km * PX_PER_KM, 40)
        : 60;
      const nearBody = Math.abs(nearestX - cameraX) < proximityPx + 20;
      if (nearBody) {
        showMilestone(nearest);
        landed = true;
      } else {
        scheduleHideMilestone();
      }
    }
    if (landed !== document.body.classList.contains('is-landed')) {
      document.body.classList.toggle('is-landed', landed);
    }

    // URL hash — debounced
    if (hashUpdateTimer) clearTimeout(hashUpdateTimer);
    hashUpdateTimer = setTimeout(() => updateUrlHash(distanceKm), 350);
  }

  function findNextBody(currentKm) {
    for (let i = 0; i < POINT_BODIES.length; i++) {
      if (POINT_BODIES[i].distance_km > currentKm + 1) return POINT_BODIES[i];
    }
    return null;
  }

  function findNearestPointBody(currentKm) {
    let best = null;
    let bestDelta = Infinity;
    for (const b of POINT_BODIES) {
      const d = Math.abs(b.distance_km - currentKm);
      if (d < bestDelta) { bestDelta = d; best = b; }
    }
    return best;
  }

  function showMilestone(body) {
    if (milestoneShownId === body.id) {
      if (milestoneHideTimer) { clearTimeout(milestoneHideTimer); milestoneHideTimer = null; }
      return;
    }
    milestoneShownId = body.id;
    MILESTONE_CARD.hidden = false;
    renderMilestone(body);
    if (milestoneHideTimer) { clearTimeout(milestoneHideTimer); milestoneHideTimer = null; }
  }
  function renderMilestone(body) {
    const hasDetails = !!BODY_DETAILS[body.id];
    MILESTONE_CARD.innerHTML =
      '<div class="name">' + escapeHtml(I18N.bodyName(body.id)) + '</div>' +
      '<div class="desc">' + linkifyGlossary(I18N.bodyDescription(body.id)) + '</div>' +
      (hasDetails
        ? '<button type="button" class="milestone-learn-more" data-body-id="' + escapeHtml(body.id) + '">' + escapeHtml(I18N.t('milestone.learnMore')) + '</button>'
        : '');
  }
  function scheduleHideMilestone() {
    if (!milestoneShownId || milestoneHideTimer) return;
    milestoneHideTimer = setTimeout(() => {
      milestoneShownId = null;
      MILESTONE_CARD.hidden = true;
      milestoneHideTimer = null;
    }, 600);
  }

  function updateUrlHash(distanceKm) {
    const nearest = findNearestPointBody(distanceKm);
    let hash = '';
    if (nearest && nearest.diameter_km) {
      const proximityKm = Math.max(nearest.diameter_km * 30, 200_000);
      if (Math.abs(nearest.distance_km - distanceKm) < proximityKm) {
        hash = '#' + nearest.id;
      }
    }
    if (!hash && distanceKm > 1e6) {
      const au = distanceKm / KM_PER_AU;
      hash = '#dist=' + au.toFixed(2) + 'au';
    }
    try {
      const search = window.location.search || '';
      if (hash) history.replaceState(null, '', window.location.pathname + search + hash);
      else history.replaceState(null, '', window.location.pathname + search);
    } catch (_) {
      // file:// or sandboxed — silently ignore
    }
  }

  // ============================================================
  // Navigation
  // ============================================================
  function scrollToBody(body, smooth = true) {
    scrollToDistance(body.distance_km, smooth);
  }

  function scrollToDistance(km, smooth) {
    const x = strip_x(km);
    const target = x - VIEWPORT.clientWidth / 2;
    const behavior = (smooth && !prefersReducedMotion()) ? 'smooth' : 'auto';
    VIEWPORT.scrollTo({ left: target, behavior });
  }

  function jumpFromHash() {
    const h = decodeURIComponent(window.location.hash.slice(1));
    if (!h) return;
    if (h.startsWith('dist=')) {
      const m = h.match(/dist=([\d.]+)(au|km)?/i);
      if (m) {
        const val = parseFloat(m[1]);
        const km = (m[2] && m[2].toLowerCase() === 'km') ? val : val * KM_PER_AU;
        scrollToDistance(km, false);
      }
      return;
    }
    const body = BODIES.find(b => b.id === h);
    if (body) scrollToBody(body, false);
  }

  // ============================================================
  // Keyboard
  // ============================================================
  const NUMBER_TARGETS = {
    '0': 'sun',
    '1': 'mercury',
    '2': 'venus',
    '3': 'earth',
    '4': 'mars',
    '5': 'jupiter',
    '6': 'saturn',
    '7': 'uranus',
    '8': 'neptune',
    '9': 'pluto'
  };

  function setupKeyboard() {
    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') stopArrowPan(-1);
      else if (e.key === 'ArrowRight') stopArrowPan(1);
    });
    // Safety: cancel pan if focus leaves (otherwise scroll keeps going after Alt-Tab)
    window.addEventListener('blur', () => { arrowPanDir = 0; });
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, [contenteditable="true"]')) return;
      if (!SUBZOOM_OVERLAY.hidden) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeSubzoom();
        }
        return;
      }
      if (e.key === 'Escape') {
        if (popoverOpenFor) { e.preventDefault(); hideGlossaryPopover(); return; }
        if (!INFO_PANEL.hidden) { e.preventDefault(); closeInfoPanel(); return; }
      }
      const key = e.key;
      if (Object.prototype.hasOwnProperty.call(NUMBER_TARGETS, key)) {
        const id = NUMBER_TARGETS[key];
        const body = BODIES.find(b => b.id === id);
        if (body) { e.preventDefault(); scrollToBody(body); }
      } else if (key === 'Home') {
        e.preventDefault();
        VIEWPORT.scrollTo({ left: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      } else if (key === 'End') {
        e.preventDefault();
        VIEWPORT.scrollTo({ left: STRIP.offsetWidth, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      } else if (key === '[') {
        e.preventDefault();
        stepBody(-1);
      } else if (key === ']') {
        e.preventDefault();
        stepBody(1);
      } else if (key === 'ArrowLeft') {
        e.preventDefault();
        if (!e.repeat) startArrowPan(-1);
      } else if (key === 'ArrowRight') {
        e.preventDefault();
        if (!e.repeat) startArrowPan(1);
      } else if (key === 'PageUp') {
        e.preventDefault();
        VIEWPORT.scrollBy({ left: -VIEWPORT.clientWidth * 4, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      } else if (key === 'PageDown') {
        e.preventDefault();
        VIEWPORT.scrollBy({ left: VIEWPORT.clientWidth * 4, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
    });
  }

  // Arrow-key pan: constant-speed scroll while the key is held. No leapfrogs
  // because we drive scrollLeft directly each frame instead of queuing
  // smooth-scroll animations.
  // Arrow-key pan calibrated to 7× the speed of light through represented space.
  const ARROW_PAN_C_MULTIPLIER = 7;
  const ARROW_PAN_PX_PER_SEC = ARROW_PAN_C_MULTIPLIER * SPEED_OF_LIGHT_KM_S * PX_PER_KM;
  let arrowPanDir = 0;       // -1 = left, 0 = stopped, 1 = right
  let arrowPanRafId = null;
  let arrowPanLastT = 0;
  function startArrowPan(direction) {
    arrowPanDir = direction;
    if (arrowPanRafId) return;
    arrowPanLastT = performance.now();
    const tick = (now) => {
      if (arrowPanDir === 0) { arrowPanRafId = null; return; }
      const dt = Math.min(50, now - arrowPanLastT);
      arrowPanLastT = now;
      VIEWPORT.scrollLeft += arrowPanDir * ARROW_PAN_PX_PER_SEC * (dt / 1000);
      arrowPanRafId = requestAnimationFrame(tick);
    };
    arrowPanRafId = requestAnimationFrame(tick);
  }
  function stopArrowPan(direction) {
    if (arrowPanDir === direction) arrowPanDir = 0;
  }

  function stepBody(direction) {
    const currentKm = camera_distance_km();
    if (direction > 0) {
      const next = POINT_BODIES.find(b => b.distance_km > currentKm + 1000);
      if (next) scrollToBody(next);
    } else {
      let prev = null;
      for (const b of POINT_BODIES) {
        if (b.distance_km < currentKm - 1000) prev = b;
        else break;
      }
      if (prev) scrollToBody(prev);
    }
  }

  // ============================================================
  // Sub-zoom (Earth detail, etc.)
  // ============================================================
  function openSubzoom(body) {
    if (!body.zoom) return;
    // Auto-pick scale so the parent body is ~110 px wide
    const targetParentPx = 110;
    const anchorDiamKm = body.zoom.anchor_diameter_km || body.diameter_km;
    const scaleKmPerPx = Math.round(anchorDiamKm / targetParentPx);
    body.zoom._scale_km_per_px = scaleKmPerPx;

    currentSubzoomBody = body;
    renderSubzoomChrome(body, scaleKmPerPx);
    buildSubzoomStrip(body);
    SUBZOOM_OVERLAY.hidden = false;
    SUBZOOM_OVERLAY.setAttribute('aria-hidden', 'false');
    SUBZOOM_CLOSE.focus();
  }

  function renderSubzoomChrome(body, scaleKmPerPx) {
    const loc = currentLocale();
    const kmStr = scaleKmPerPx.toLocaleString(loc);
    const name = I18N.bodyName(body.id);
    SUBZOOM_TITLE.textContent = I18N.t('subzoom.title', { name });
    SUBZOOM_SCALE.textContent = I18N.t('subzoom.scale', { km: kmStr });
    HUD.classList.add('subzoom-mode');
    HUD_SCALE.textContent = I18N.t('subzoom.scaleHud', { km: kmStr, name });
  }

  function closeSubzoom() {
    SUBZOOM_OVERLAY.hidden = true;
    SUBZOOM_OVERLAY.setAttribute('aria-hidden', 'true');
    HUD.classList.remove('subzoom-mode');
    HUD_SCALE.textContent = I18N.t('hud.scaleDefault');
    SUBZOOM_STRIP.innerHTML = '';
    SUBZOOM_DETAIL.innerHTML = '';
    currentSubzoomBody = null;
    VIEWPORT.focus();
  }

  function buildSubzoomStrip(body) {
    SUBZOOM_STRIP.innerHTML = '';
    const scaleKmPerPx = body.zoom._scale_km_per_px || body.zoom.scale_km_per_px || 1;
    const pxPerKm = 1 / scaleKmPerPx;
    const anchorDiamKm = body.zoom.anchor_diameter_km || body.diameter_km;
    const anchorDiamPx = anchorDiamKm * pxPerKm;
    const anchorX = Math.max(anchorDiamPx / 2 + 40, 80);
    const itemDistance = (it) => (it.distance_km != null ? it.distance_km : (it.altitude_km || 0));
    const farthest = Math.max.apply(null, body.zoom.items.map(itemDistance));
    const totalWidth = anchorX + farthest * pxPerKm + 300;
    SUBZOOM_STRIP.style.width = totalWidth + 'px';

    // Orbit rings for items that benefit from one (GEO, GPS)
    body.zoom.items.forEach(item => {
      if (item.id === 'geo' || item.id === 'gps') {
        const ringDiam = itemDistance(item) * 2 * pxPerKm;
        const ring = document.createElement('div');
        ring.className = 'subzoom-ring';
        ring.style.width = ringDiam + 'px';
        ring.style.height = ringDiam + 'px';
        ring.style.left = anchorX + 'px';
        SUBZOOM_STRIP.appendChild(ring);
      }
    });

    // Anchor (parent) body
    const anchorEl = createSubzoomItem(
      {
        id: body.id,
        name: I18N.bodyName(body.id),
        type: body.type,
        diameter_km: anchorDiamKm,
        color: body.color,
        description: I18N.bodyDescription(body.id)
      },
      pxPerKm,
      anchorX,
      true,
      'below',
      0
    );
    SUBZOOM_STRIP.appendChild(anchorEl);

    // Place items. Alternate above/below by index for global spacing; stack vertically
    // when items are clustered close horizontally.
    const sortedItems = body.zoom.items.slice().sort((a, b) => itemDistance(a) - itemDistance(b));
    let lastX = -Infinity;
    let clusterCount = 0;
    sortedItems.forEach((item, i) => {
      const x = anchorX + itemDistance(item) * pxPerKm;
      if (x - lastX < 180) clusterCount++;
      else clusterCount = 0;
      lastX = x;
      const placement = (i % 2 === 0) ? 'above' : 'below';
      const stackOffset = Math.floor(clusterCount / 2) * 18;
      const el = createSubzoomItem(item, pxPerKm, x, false, placement, stackOffset);
      SUBZOOM_STRIP.appendChild(el);
    });

    SUBZOOM_VIEWPORT.scrollLeft = 0;
    SUBZOOM_DETAIL.innerHTML = I18N.t('subzoom.intro.html', {
      name: escapeHtml(I18N.bodyName(body.id)),
      description: escapeHtml(I18N.bodyDescription(body.id))
    });
  }

  function createSubzoomItem(item, pxPerKm, x, isAnchor, placement, stackOffset) {
    placement = placement || 'below';
    stackOffset = stackOffset || 0;
    const wrap = document.createElement('button');
    wrap.className = 'subzoom-body';
    wrap.type = 'button';
    wrap.dataset.id = item.id;
    wrap.dataset.type = item.type;
    wrap.style.left = x + 'px';

    const minSize = isAnchor ? 4 : 3;
    const dotDiameter = Math.max((item.diameter_km || 0) * pxPerKm, minSize);
    const dot = document.createElement('span');
    dot.className = 'subzoom-body-dot';
    dot.style.display = 'block';
    dot.style.width = dotDiameter + 'px';
    dot.style.height = dotDiameter + 'px';
    dot.style.background = item.color || '#aaa';
    wrap.appendChild(dot);

    const displayName = isAnchor ? item.name : I18N.bodyName(item.id);
    if (!isAnchor) {
      const label = document.createElement('span');
      label.className = 'subzoom-body-label subzoom-body-label-' + placement;
      label.style.setProperty('--stack-offset', stackOffset + 'px');
      let altText = '';
      const loc = currentLocale();
      // Prefer the human-natural "altitude above surface" if present (used for satellites)
      if (item.altitude_km != null && item.altitude_km > 0) {
        if (item.altitude_km < 1000) altText = I18N.t('label.altitudeUp', { km: Math.round(item.altitude_km).toLocaleString(loc) });
        else altText = I18N.t('label.altitudeUpThou', { km: (item.altitude_km / 1000).toFixed(0) });
      } else if (item.distance_km != null && item.distance_km > 0) {
        if (item.distance_km < 1e6) altText = (item.distance_km / 1000).toFixed(0) + 'k km';
        else altText = fmtFixed(item.distance_km / 1e6, 2) + 'M km';
      }
      label.textContent = displayName + (altText ? I18N.unit('sep') + altText : '');
      wrap.appendChild(label);
    }

    wrap.addEventListener('click', (e) => {
      e.preventDefault();
      const detName = isAnchor ? item.name : I18N.bodyName(item.id);
      const detDesc = isAnchor ? (item.description || '') : I18N.bodyDescription(item.id);
      SUBZOOM_DETAIL.innerHTML = '<strong>' + escapeHtml(detName) + '</strong> — ' + escapeHtml(detDesc);
      const target = x - SUBZOOM_VIEWPORT.clientWidth / 2;
      SUBZOOM_VIEWPORT.scrollTo({
        left: target,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    });
    return wrap;
  }

  SUBZOOM_CLOSE.addEventListener('click', closeSubzoom);
  SUBZOOM_OVERLAY.addEventListener('click', (e) => {
    if (e.target === SUBZOOM_OVERLAY) closeSubzoom();
  });

  // ============================================================
  // Info panel (Learn more) + Glossary nav
  // ============================================================
  function openInfoPanel(body) {
    const det = I18N.detailsFor(body.id);
    if (!det) return;
    currentInfoPanelBody = body;
    renderInfoPanel(body, det);
    INFO_PANEL.hidden = false;
    INFO_PANEL.setAttribute('aria-hidden', 'false');
    INFO_PANEL.classList.add('entering');
    requestAnimationFrame(() => INFO_PANEL.classList.remove('entering'));
  }

  function renderInfoPanel(body, det) {
    const displayName = I18N.bodyName(body.id);
    INFO_PANEL_TITLE.textContent = displayName;

    const loc = currentLocale();
    let html = '';
    if (det.image) {
      html += '<figure class="info-panel-figure">'
           +    '<img src="' + escapeHtml(det.image) + '" alt="' + escapeHtml(displayName) + '" loading="lazy" referrerpolicy="no-referrer">'
           + (det.image_credit ? '<figcaption>' + escapeHtml(det.image_credit) + '</figcaption>' : '')
           + '</figure>';
    }
    html += '<div class="stats">';
    if (body.distance_km > 0) {
      const distStr = fmtFixed(body.distance_km / KM_PER_AU, 2) + I18N.unit('au') + I18N.unit('sep') + formatNumber(body.distance_km) + I18N.unit('km');
      html += '<span class="label">' + escapeHtml(I18N.t('info.distance')) + '</span>'
           +  '<span class="value">' + escapeHtml(distStr) + '</span>';
    }
    if (body.diameter_km) {
      html += '<span class="label">' + escapeHtml(I18N.t('info.diameter')) + '</span>'
           +  '<span class="value">' + escapeHtml(formatNumber(body.diameter_km) + I18N.unit('km')) + '</span>';
    }
    if (body.distance_km > 0) {
      html += '<span class="label">' + escapeHtml(I18N.t('info.lightTime')) + '</span>'
           +  '<span class="value">' + escapeHtml(formatLightTime(body.distance_km)) + '</span>';
    }
    if (body.type) {
      html += '<span class="label">' + escapeHtml(I18N.t('info.type')) + '</span><span class="value">' + escapeHtml(I18N.typeLabel(body.type)) + '</span>';
    }
    html += '</div>';

    if (det.overview) {
      html += '<p>' + linkifyGlossary(det.overview) + '</p>';
    }
    if (det.facts && det.facts.length) {
      html += '<h3>' + escapeHtml(I18N.t('info.factsTitle')) + '</h3><ul>';
      det.facts.forEach(f => { html += '<li>' + linkifyGlossary(f) + '</li>'; });
      html += '</ul>';
    }

    INFO_PANEL_BODY.innerHTML = html;
  }

  function closeInfoPanel() {
    INFO_PANEL.hidden = true;
    INFO_PANEL.setAttribute('aria-hidden', 'true');
    INFO_PANEL_BODY.innerHTML = '';
    currentInfoPanelBody = null;
    hideGlossaryPopover();
  }

  INFO_PANEL_CLOSE.addEventListener('click', closeInfoPanel);

  // Delegate Learn-more clicks on milestone card
  MILESTONE_CARD.addEventListener('click', (e) => {
    const btn = e.target.closest('.milestone-learn-more');
    if (!btn) return;
    const body = BODIES.find(b => b.id === btn.dataset.bodyId);
    if (body) openInfoPanel(body);
  });

  function buildGlossaryNav() {
    populateGlossaryNav();
    GLOSSARY_NAV_TOGGLE.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !GLOSSARY_NAV_LIST.hidden;
      GLOSSARY_NAV_LIST.hidden = isOpen;
      GLOSSARY_NAV_TOGGLE.setAttribute('aria-expanded', String(!isOpen));
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.glossary-nav')) {
        GLOSSARY_NAV_LIST.hidden = true;
        GLOSSARY_NAV_TOGGLE.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function populateGlossaryNav() {
    GLOSSARY_NAV_LIST.innerHTML = '';
    const entries = I18N.glossaryEntries().slice().sort((a, b) => a.term.localeCompare(b.term, currentLocale()));
    entries.forEach(entry => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = entry.term;
      btn.dataset.glossaryKey = entry.key;
      btn.addEventListener('click', () => {
        showGlossaryPopover(entry.key, btn);
      });
      li.appendChild(btn);
      GLOSSARY_NAV_LIST.appendChild(li);
    });
  }

  // ============================================================
  // Unit toggle
  // ============================================================
  function setupUnitToggle() {
    document.querySelectorAll('.hud-unit-toggle button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.hud-unit-toggle button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        unitMode = btn.dataset.unit;
        updateAll();
      });
    });
  }

  // ============================================================
  // Language toggle + translation application
  // ============================================================
  function applyTranslations() {
    // Static [data-i18n] / [data-i18n-html] / [data-i18n-aria] nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = I18N.t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = I18N.t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', I18N.t(el.getAttribute('data-i18n-aria')));
    });

    // Glossary lookup tables depend on current language; rebuild before re-rendering text.
    rebuildGlossaryIndex();

    // Body labels on the strip
    document.querySelectorAll('.body').forEach(el => {
      const id = el.dataset.id;
      if (!id) return;
      const body = BODIES.find(b => b.id === id);
      if (!body) return;
      const nameEl = el.querySelector('.body-label-name');
      if (nameEl) nameEl.textContent = I18N.bodyName(id);
      const metaEl = el.querySelector('.body-label-meta');
      if (metaEl) {
        let meta = '';
        if (body.distance_km > 0) {
          meta = bodyDistanceShort(body);
          if (body.diameter_km) meta += I18N.t('label.diameterSep', { km: formatNumber(body.diameter_km) });
        } else if (body.diameter_km) {
          meta = I18N.t('label.diameterShort', { km: formatNumber(body.diameter_km) });
        }
        metaEl.textContent = meta;
      }
      el.setAttribute('aria-label', I18N.t('aria.body', { name: I18N.bodyName(id), dist: bodyDistanceShort(body) }));
      const zb = el.querySelector('.body-zoom-btn');
      if (zb) zb.setAttribute('aria-label', I18N.t('aria.zoomBtn', { name: I18N.bodyName(id) }));
    });

    // Belt labels
    document.querySelectorAll('.belt .belt-label').forEach(el => {
      const wrap = el.parentElement;
      const belt = BODIES.find(b => b._element === wrap);
      if (belt) el.textContent = I18N.bodyName(belt.id);
    });

    // Minimap tick labels & titles
    MINIMAP_TRACK.querySelectorAll('.minimap-tick').forEach(tick => {
      const id = tick.dataset.id;
      if (!id) return;
      tick.title = I18N.bodyName(id);
      const lbl = tick.querySelector('.minimap-tick-label');
      if (lbl) lbl.textContent = I18N.bodyName(id);
    });

    // Body index list
    BODY_INDEX_LIST.querySelectorAll('li').forEach(li => {
      const id = li.dataset.id;
      if (!id) return;
      const body = POINT_BODIES.find(b => b.id === id);
      if (!body) return;
      const a = li.querySelector('a');
      if (a) a.innerHTML = escapeHtml(I18N.bodyName(id)) + '<span class="meta">' + escapeHtml(bodyDistanceShort(body)) + '</span>';
    });

    // Glossary nav list
    populateGlossaryNav();

    // HUD scale badge: subzoom-mode keeps its own template; default uses hud.scaleDefault
    if (HUD.classList.contains('subzoom-mode') && currentSubzoomBody) {
      const scale = (currentSubzoomBody.zoom && currentSubzoomBody.zoom._scale_km_per_px) || 1;
      renderSubzoomChrome(currentSubzoomBody, scale);
    } else {
      HUD_SCALE.textContent = I18N.t('hud.scaleDefault');
    }

    // Re-render any open overlays / cards
    if (currentSubzoomBody) {
      buildSubzoomStrip(currentSubzoomBody);
    }
    if (currentInfoPanelBody) {
      const det = I18N.detailsFor(currentInfoPanelBody.id);
      if (det) renderInfoPanel(currentInfoPanelBody, det);
    }
    if (milestoneShownId) {
      const body = BODIES.find(b => b.id === milestoneShownId);
      if (body) renderMilestone(body);
    }
    if (popoverOpenFor && GLOSSARY_LAST_ANCHOR) {
      // Re-show with current-language content (same anchor element).
      showGlossaryPopover(popoverOpenFor, GLOSSARY_LAST_ANCHOR);
    }

    // HUD values that recompute via updateAll
    updateAll();
  }

  function setupLanguageToggle() {
    document.querySelectorAll('.hud-lang-toggle button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === I18N.current);
      btn.addEventListener('click', () => {
        const code = btn.dataset.lang;
        if (code === I18N.current) return;
        I18N.setLanguage(code);
        document.querySelectorAll('.hud-lang-toggle button').forEach(b => {
          b.classList.toggle('active', b.dataset.lang === I18N.current);
        });
        // Update URL with the new ?lang= value, preserving hash.
        try {
          const url = new URL(window.location.href);
          if (I18N.current === I18N.defaultLanguage) url.searchParams.delete('lang');
          else url.searchParams.set('lang', I18N.current);
          history.replaceState(null, '', url.pathname + (url.search || '') + (url.hash || ''));
        } catch (_) {}
        applyTranslations();
      });
    });
  }

  // ============================================================
  // Intro card
  // ============================================================
  function setupIntro() {
    if (!INTRO_CARD) return;
    INTRO_DISMISS.addEventListener('click', () => {
      INTRO_CARD.classList.add('dismissed');
      setTimeout(() => INTRO_CARD.remove(), 500);
      VIEWPORT.focus();
    });
    let dismissed = false;
    const onFirstScroll = () => {
      if (dismissed) return;
      if (VIEWPORT.scrollLeft > 50) {
        dismissed = true;
        INTRO_CARD.classList.add('dismissed');
        setTimeout(() => INTRO_CARD.remove(), 500);
        VIEWPORT.removeEventListener('scroll', onFirstScroll);
      }
    };
    VIEWPORT.addEventListener('scroll', onFirstScroll, { passive: true });
  }

  // ============================================================
  // Init
  // ============================================================
  function init() {
    // I18N.resolveInitial() already ran in i18n.js; rebuild glossary index
    // for the resolved language before any text is built.
    rebuildGlossaryIndex();
    // Apply static-string translations once before constructing dynamic content,
    // so the intro card / HUD labels reflect the current language from the first paint.
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = I18N.t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = I18N.t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', I18N.t(el.getAttribute('data-i18n-aria')));
    });

    buildStrip();
    buildMinimap();
    buildBodyIndex();
    buildGlossaryNav();
    setupKeyboard();
    setupUnitToggle();
    setupLanguageToggle();
    setupIntro();

    VIEWPORT.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', jumpFromHash);

    // Mouse wheel → horizontal scroll. We intercept only when the user is
    // scrolling vertically (deltaY) with no horizontal gesture, so a
    // trackpad's native horizontal pan still goes through untouched.
    // WHEEL_SPEED slows the wheel down so each tick covers less distance.
    const WHEEL_SPEED = 0.67;
    VIEWPORT.addEventListener('wheel', (e) => {
      if (e.deltaX !== 0 || e.deltaY === 0) return;
      let dx = e.deltaY;
      if (e.deltaMode === 1) dx *= 16;                              // LINE
      else if (e.deltaMode === 2) dx *= VIEWPORT.clientWidth * 0.9; // PAGE
      e.preventDefault();
      VIEWPORT.scrollLeft += dx * WHEEL_SPEED;
    }, { passive: false });

    // Touch → horizontal scroll, geared down to match wheel feel, with
    // a custom inertia loop because we override the browser's native
    // scrolling (which is what makes mobile scroll "too fast" otherwise).
    const TOUCH_SPEED = WHEEL_SPEED;
    const TOUCH_MOVE_THRESHOLD = 4;     // px of finger movement before we take over (preserves taps)
    const INERTIA_DECAY_PER_16MS = 0.94;
    const INERTIA_STOP_THRESHOLD = 0.02;
    let touchActive = false;
    let touchOwnedScroll = false;
    let touchStartScreenX = 0;
    let touchStartScrollLeft = 0;
    let touchLastScreenX = 0;
    let touchLastTime = 0;
    let touchVelocity = 0;              // scroll-px per ms (already speed-adjusted)
    let inertiaRafId = null;
    function cancelTouchInertia() {
      if (inertiaRafId) { cancelAnimationFrame(inertiaRafId); inertiaRafId = null; }
    }
    VIEWPORT.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) { touchActive = false; return; }
      cancelTouchInertia();
      touchActive = true;
      touchOwnedScroll = false;
      touchStartScreenX = e.touches[0].clientX;
      touchStartScrollLeft = VIEWPORT.scrollLeft;
      touchLastScreenX = touchStartScreenX;
      touchLastTime = performance.now();
      touchVelocity = 0;
    }, { passive: true });
    VIEWPORT.addEventListener('touchmove', (e) => {
      if (!touchActive || e.touches.length !== 1) return;
      const x = e.touches[0].clientX;
      const screenDx = touchStartScreenX - x;
      if (!touchOwnedScroll) {
        if (Math.abs(screenDx) < TOUCH_MOVE_THRESHOLD) return;
        touchOwnedScroll = true;
      }
      e.preventDefault();
      VIEWPORT.scrollLeft = touchStartScrollLeft + screenDx * TOUCH_SPEED;
      const now = performance.now();
      const dt = now - touchLastTime;
      if (dt > 0) {
        touchVelocity = ((touchLastScreenX - x) / dt) * TOUCH_SPEED;
      }
      touchLastScreenX = x;
      touchLastTime = now;
    }, { passive: false });
    function endTouch() {
      if (!touchActive) return;
      touchActive = false;
      if (!touchOwnedScroll) return;     // tap, not a drag — leave inertia alone
      let v = touchVelocity;
      if (Math.abs(v) < INERTIA_STOP_THRESHOLD) return;
      let lastT = performance.now();
      const tick = (now) => {
        const dt = now - lastT;
        lastT = now;
        VIEWPORT.scrollLeft += v * dt;
        v *= Math.pow(INERTIA_DECAY_PER_16MS, dt / 16);
        if (Math.abs(v) > INERTIA_STOP_THRESHOLD) {
          inertiaRafId = requestAnimationFrame(tick);
        } else {
          inertiaRafId = null;
        }
      };
      inertiaRafId = requestAnimationFrame(tick);
    }
    VIEWPORT.addEventListener('touchend', endTouch, { passive: true });
    VIEWPORT.addEventListener('touchcancel', endTouch, { passive: true });

    if (window.location.hash) {
      jumpFromHash();
    }
    onScroll();
    VIEWPORT.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
