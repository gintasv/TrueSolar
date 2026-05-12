# The Solar System, if Pluto were 1 pixel

A scrollable, true-scale visualisation of the solar system. **Pluto's diameter (2,376 km) is the unit: 1 pixel.** Everything else — the planets, their orbital distances, the moons, the spacecraft — is sized in strict proportion. The strip is about 10 million pixels wide end to end. Most of it is empty. That is the point.

## Opening it

Just double-click `index.html`. Everything works over `file://` — no build step, no server, no dependencies.

If your browser blocks something via `file://`, run a tiny local server from this folder:

```
# Python 3 (preinstalled on most systems)
python -m http.server 8080
# then open http://localhost:8080
```

## Controls

| Key | Action |
| --- | --- |
| `→` / `←` | Scroll one viewport |
| `PgUp` / `PgDn` | Scroll four viewports |
| `0` | Jump to the Sun |
| `1`–`9` | Jump to Mercury through Pluto |
| `Home` / `End` | Jump to the Sun / Voyager 1 |
| `[` / `]` | Previous / next body |
| Click on minimap | Jump to that position |
| Click a planet's `+` button | Open its detail view (Earth shows ISS, GPS, Moon, etc. at proper scale) |
| `Esc` | Close detail view |

## Files

- `index.html` — page shell, HUD, minimap, sub-zoom overlay
- `style.css` — all styling
- `data.js` — celestial-body data (planets, belts, moons, satellites, probes)
- `script.js` — strip construction, scroll handling, HUD updates, sub-zoom, minimap, keyboard, URL hash

## Adding or editing bodies

Open `data.js` and add an entry to the `BODIES` array. Every body needs:

- `id` — kebab-case, used in URL hashes
- `name` — display name
- `type` — `star`, `planet`, `dwarf`, `moon`, `satellite`, `probe`, `belt`, or `milestone`
- `distance_km` — average orbital radius from the Sun (for `belt`, this is the inner edge — pair with `distance_km_end`)
- `diameter_km` — optional for `probe`, `milestone`, and `belt`
- `color` — CSS colour string
- `description` — one or two sentences shown in the milestone card

A body can also have a `zoom` block to enable an Earth-style detail view of its moons / satellites. See the `earth` entry for the shape.

## Data sources

Distances and diameters are average orbital values from the NASA planetary fact sheets (https://nssdc.gsfc.nasa.gov/planetary/factsheet/). Spacecraft positions are approximate as of early 2026 and drift slowly outward — check JPL Horizons (https://ssd.jpl.nasa.gov/horizons/) for current state vectors if you want fresh values.

Planets, of course, are not stationary. The numbers here are *average* distances, useful for a feel of scale. A given snapshot of the real solar system has all the planets in different positions.

## A note on accuracy

The scale is honest: 1 pixel = 2,376 km = Pluto's diameter, applied to every body's diameter and to every orbital distance. The exceptions are explicit:

- **Sub-zoom views** (Earth, Mars, Jupiter, Saturn, Pluto) rebase the scale to show their moons and nearby satellites. The HUD changes colour and a banner declares the new scale. The point is precisely that ISS, Hubble, and GPS are sub-pixel from Earth at the main scale — so the detail view exists to show them honestly at a different, clearly-labelled scale.
- The asteroid belt and Kuiper belt are drawn as tinted regions, not as individual objects. The actual belt is mostly empty too; the band is a visualisation aid.
- Saturn's rings are drawn as a flattened ellipse around Saturn. Their inner and outer radii are to scale.
