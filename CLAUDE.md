# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page true-scale solar-system visualisation. Pluto's diameter (2,376 km) = 1 pixel. The scrollable strip is about 10 million pixels wide end to end (Sun → Voyager 1). See `README.md` for user-facing usage and controls.

## How to run

No build step. Open `index.html` directly (`file://` works) or serve the folder:

```
python -m http.server 8765
```

A `.claude/launch.json` defines a preview server named `static` on port 8765 for the same purpose.

There are no tests, no linter, no package manager — pure vanilla JS/CSS/HTML by deliberate choice. **Don't add a bundler, framework, or ES-module imports** — `data.js` and `script.js` are loaded as plain `<script>` tags so `BODIES`, `PX_PER_KM`, `KM_PER_AU`, `SPEED_OF_LIGHT_KM_S`, and `TOTAL_DISTANCE_KM`/`TOTAL_WIDTH_PX` are top-level globals shared between files. Switching to modules breaks `file://` opening.

## Architecture

### The single scale constant

Everything derives from `PX_PER_KM = 1 / 2376` (defined in `data.js`). Any new positioning logic should multiply km values by this constant, never hardcode pixel offsets.

### Coordinate system

The Sun is **not** at strip x = 0. At startup `buildStrip()` computes `SUN_CENTER_PX = max(window.innerWidth / 2, sunRadiusPx + 80)` so the Sun is fully visible at scrollLeft = 0. All body positions use the helper:

```js
strip_x(distance_km) = SUN_CENTER_PX + distance_km * PX_PER_KM
```

The HUD's "distance from Sun" reads off the **viewport centre**, not the left edge: `camera_distance_km() = (scrollLeft + clientWidth/2 - SUN_CENTER_PX) / PX_PER_KM`.

`SUN_CENTER_PX` is fixed once at boot. Window resize is intentionally not handled (re-laying out 30+ bodies on every resize would be jarring). If you change this, update all callers.

### Distance conventions in data

This trips people up:

- **Main `BODIES` array**: `distance_km` is from the **Sun's centre**.
- **`zoom.items[]` (Earth, Mars, Jupiter, Saturn, Pluto detail views)**: `distance_km` is from the **parent body's centre**.
- Some `zoom.items` (satellites) also carry an `altitude_km` field for label readability — that's the height above the parent's surface and is used **only** for the displayed label ("408 km up"). Positioning always uses `distance_km`.

Don't mix these — for Moon, `distance_km: 384_400` is the standard centre-to-centre value; for ISS, `distance_km: 6_779` is Earth radius (6,371) + altitude (408).

### Sub-zoom uses an auto-computed scale

`openSubzoom(body)` ignores any `scale_km_per_px` from data and recomputes `Math.round(anchorDiamKm / 110)` so the parent body renders at ~110 px wide. The result is stashed on `body.zoom._scale_km_per_px` for `buildSubzoomStrip` to read. If you want to change the parent's visual size, edit `targetParentPx` in `openSubzoom`.

### Single rAF-throttled scroll handler

`onScroll` schedules one `requestAnimationFrame` callback that calls `updateAll()` — which updates HUD distance, light-time, next-body, stars parallax position, minimap cursor, every body's `.in-view` class, the milestone card, and (debounced) the URL hash. **Don't add a second scroll listener.** New per-frame updates go into `updateAll()`.

### Why stars are a fixed-viewport background, not a strip child

Chromium and friends cap painted layer surfaces at ~16,384 px. A 10M-px-wide element with any background, gradient, or filter risks rendering breakage. So:

- `.strip` itself has no background.
- Stars live in two fixed-position layers (`.stars-bg`, `.stars-bg-near`) whose `background-position-x` is updated on scroll for parallax.
- Belt regions (asteroid belt, Kuiper belt) use tiled CSS `background-image` (browsers tile the painting; the surface itself is bounded by the element width but tiling happens at render time).
- **Never add `transform: translateZ(0)`, `will-change`, or `backdrop-filter` to anything wider than ~16k px** (i.e. `.strip` or anything spanning a large fraction of it).

### Native scroll, hidden scrollbar

The native horizontal scrollbar is hidden because at 10M-px width the thumb is ~1 px wide and unusable. The minimap is the navigation aid. Browsers convert vertical wheel input to horizontal scroll automatically when only `overflow-x` overflows; do not intercept `wheel` events.

### Minimap is logarithmic

Linear would compress all the inner planets to the leftmost 1%. The log scale is `log10(d + 1) / log10(MAX + 1)` (defined in `LOG_TOTAL`, `logFraction`, `inverseLogFraction`). When you change the strip's end (e.g. adding bodies past Voyager 1), `TOTAL_DISTANCE_KM` in `data.js` recomputes from the last body — no manual update needed.

### URL hash format

`#mars`, `#voyager-1` → body id. `#dist=5.2au` or `#dist=12345km` → arbitrary distance. `updateUrlHash` debounces by 350 ms and uses `history.replaceState` (never `pushState`) so the back button isn't flooded.

## Adding bodies

See `README.md` "Adding or editing bodies". The only non-obvious bit is the `distance_km` convention (above) and that the array is sorted by `distance_km` at the bottom of `data.js` — additions just need to be valid entries; sorting happens automatically.

## Files

`index.html` shell + HUD + minimap + sub-zoom overlay markup. `style.css` all styling. `data.js` `BODIES` array + scale constants. `script.js` strip build, scroll handler, sub-zoom, minimap, keyboard, URL hash.
