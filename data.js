// Solar system data. All distances in km from the Sun. Diameters in km.
// Scale base: Pluto diameter (2,376 km) = 1 pixel.
// Probe positions are approximate as of 2026 and drift slowly outward.
// Sources: NASA planetary fact sheets, JPL Horizons.

const PX_PER_KM = 1 / 2376;
const KM_PER_AU = 149_597_870.7;
const SPEED_OF_LIGHT_KM_S = 299_792.458;

const BODIES = [
  {
    id: "sun",
    name: "Sun",
    type: "star",
    distance_km: 0,
    diameter_km: 1_391_400,
    color: "#ffd24a",
    glow: "#ff8a00",
    description: "G-type main-sequence star. 99.86% of the solar system's mass."
  },
  {
    id: "mercury",
    name: "Mercury",
    type: "planet",
    distance_km: 57_909_050,
    diameter_km: 4_879,
    color: "#9c8a76",
    description: "The smallest planet. A year here is 88 Earth days."
  },
  {
    id: "venus",
    name: "Venus",
    type: "planet",
    distance_km: 108_208_000,
    diameter_km: 12_104,
    color: "#e7c97a",
    description: "Hottest planet. Surface ~465 °C under a runaway-greenhouse atmosphere."
  },
  {
    id: "earth",
    name: "Earth",
    type: "planet",
    distance_km: 149_597_870,
    diameter_km: 12_742,
    color: "#4a90e2",
    description: "1 AU from the Sun. Light takes 8 minutes 20 seconds to reach here.",
    zoom: {
      anchor_diameter_km: 12_742,
      items: [
        // distance_km is from Earth's CENTRE; the label shows "X km up" (above surface) for satellites.
        { id: "iss",     name: "ISS",                          distance_km: 6_779,     altitude_km: 408,        diameter_km: 0.1,  color: "#ddd",  description: "International Space Station orbits ~408 km up." },
        { id: "hubble",  name: "Hubble Space Telescope",       distance_km: 6_911,     altitude_km: 540,        diameter_km: 0.05, color: "#ddd",  description: "Operating since 1990 at ~540 km altitude." },
        { id: "starlink",name: "Starlink shell",               distance_km: 6_921,     altitude_km: 550,        diameter_km: 0.01, color: "#aaa",  description: "Thousands of internet satellites in low Earth orbit." },
        { id: "gps",     name: "GPS constellation",            distance_km: 26_551,    altitude_km: 20_180,     diameter_km: 0.01, color: "#aaa",  description: "Navigation satellites at medium Earth orbit (~20,200 km up)." },
        { id: "geo",     name: "Geostationary ring",           distance_km: 42_157,    altitude_km: 35_786,     diameter_km: 0.01, color: "#aaa",  description: "Where TV and weather sats sit — one orbit per day." },
        { id: "moon",    name: "Moon",                         distance_km: 384_400,                            diameter_km: 3_474, color: "#bbb", description: "Light takes 1.3 seconds to reach the Moon." },
        { id: "jwst",    name: "James Webb Space Telescope",   distance_km: 1_500_000,                          diameter_km: 0.02, color: "#ffd", description: "At the Sun–Earth L2 point, ~1.5 million km from Earth." }
      ]
    }
  },
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    distance_km: 227_939_200,
    diameter_km: 6_779,
    color: "#cd5c4f",
    description: "The Red Planet. Home to Olympus Mons — a volcano 22 km tall.",
    zoom: {
      anchor_diameter_km: 6_779,
      items: [
        // distance_km is from Mars' centre
        { id: "phobos", name: "Phobos", distance_km: 9_376,  diameter_km: 22.4, color: "#aaa", description: "Mars' larger moon. Spiraling inward, will crash or break up in ~50 million years." },
        { id: "deimos", name: "Deimos", distance_km: 23_463, diameter_km: 12.4, color: "#aaa", description: "Mars' smaller, more distant moon." }
      ]
    }
  },
  {
    id: "asteroid-belt",
    name: "Asteroid Belt",
    type: "belt",
    distance_km: 329_000_000,
    distance_km_end: 478_000_000,
    color: "#665544",
    description: "Hundreds of thousands of rocky bodies between Mars and Jupiter. Total mass < 4% of the Moon."
  },
  {
    id: "ceres",
    name: "Ceres",
    type: "dwarf",
    distance_km: 413_700_000,
    diameter_km: 939,
    color: "#a89888",
    description: "Largest object in the asteroid belt. A dwarf planet."
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    distance_km: 778_340_821,
    diameter_km: 139_820,
    color: "#c88b3a",
    description: "The largest planet. More mass than all other planets combined.",
    zoom: {
      anchor_diameter_km: 139_820,
      items: [
        { id: "io",       name: "Io",       distance_km: 421_800,   diameter_km: 3_643, color: "#e8c971", description: "Most volcanically active body in the solar system." },
        { id: "europa",   name: "Europa",   distance_km: 671_034,   diameter_km: 3_122, color: "#d4c5a4", description: "Icy crust hides a global ocean — possibly habitable." },
        { id: "ganymede", name: "Ganymede", distance_km: 1_070_400, diameter_km: 5_268, color: "#a89a7c", description: "Largest moon in the solar system. Bigger than Mercury." },
        { id: "callisto", name: "Callisto", distance_km: 1_882_700, diameter_km: 4_821, color: "#8a7866", description: "Most heavily cratered surface known." }
      ]
    }
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "planet",
    distance_km: 1_426_666_422,
    diameter_km: 116_460,
    color: "#e4c98a",
    description: "Famous for its rings — mostly water ice, less than 30 m thick on average.",
    rings: { inner_km: 67_000, outer_km: 140_000 },
    zoom: {
      anchor_diameter_km: 116_460,
      items: [
        { id: "mimas",     name: "Mimas",     distance_km: 185_520,   diameter_km: 396,   color: "#bbb", description: "The 'Death Star' moon — a giant crater dominates one side." },
        { id: "enceladus", name: "Enceladus", distance_km: 238_000,   diameter_km: 504,   color: "#ddd", description: "Geysers of water ice erupt from a subsurface ocean." },
        { id: "titan",     name: "Titan",     distance_km: 1_221_870, diameter_km: 5_150, color: "#d4a96a", description: "Thick atmosphere, lakes of liquid methane. Larger than Mercury." }
      ]
    }
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "planet",
    distance_km: 2_870_658_186,
    diameter_km: 50_724,
    color: "#7fd9e6",
    description: "Tilted 98° — effectively rolls along its orbit."
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "planet",
    distance_km: 4_498_396_441,
    diameter_km: 49_244,
    color: "#3f5fd5",
    description: "Fastest winds in the solar system — over 2,000 km/h. Light takes 4 hours to get here."
  },
  {
    id: "kuiper-belt",
    name: "Kuiper Belt",
    type: "belt",
    distance_km: 4_500_000_000,
    distance_km_end: 7_500_000_000,
    color: "#3a4458",
    description: "Ring of icy bodies beyond Neptune. Home to Pluto, Eris, Haumea, Makemake."
  },
  {
    id: "pluto",
    name: "Pluto",
    type: "dwarf",
    distance_km: 5_906_380_000,
    diameter_km: 2_376,
    color: "#c1a87d",
    description: "The reference. One pixel. Reclassified as a dwarf planet in 2006.",
    zoom: {
      anchor_diameter_km: 2_376,
      items: [
        { id: "charon", name: "Charon", distance_km: 19_571, diameter_km: 1_212, color: "#998877", description: "Half the diameter of Pluto. They orbit a common point in space between them." }
      ]
    }
  },
  {
    id: "new-horizons",
    name: "New Horizons",
    type: "probe",
    distance_km: 9_000_000_000,
    color: "#7fffa8",
    description: "Launched 2006, flew past Pluto in 2015. Now exploring the Kuiper Belt."
  },
  {
    id: "termination-shock",
    name: "Termination Shock",
    type: "milestone",
    distance_km: 13_500_000_000,
    color: "#88aaff",
    description: "Where the solar wind slows below the speed of sound. ~90 AU from the Sun."
  },
  {
    id: "pioneer-11",
    name: "Pioneer 11",
    type: "probe",
    distance_km: 17_500_000_000,
    color: "#7fffa8",
    description: "Launched 1973. Last contact 1995. Drifting silently toward the constellation Aquila."
  },
  {
    id: "heliopause",
    name: "Heliopause",
    type: "milestone",
    distance_km: 18_000_000_000,
    color: "#88aaff",
    description: "Boundary where the Sun's influence ends and interstellar space begins. ~120 AU."
  },
  {
    id: "pioneer-10",
    name: "Pioneer 10",
    type: "probe",
    distance_km: 21_000_000_000,
    color: "#7fffa8",
    description: "Launched 1972. Last contact 2003. Heading toward Aldebaran — will arrive in ~2 million years."
  },
  {
    id: "voyager-2",
    name: "Voyager 2",
    type: "probe",
    distance_km: 21_500_000_000,
    color: "#7fffa8",
    description: "Launched 1977. Crossed the heliopause in 2018. Still transmitting."
  },
  {
    id: "voyager-1",
    name: "Voyager 1",
    type: "probe",
    distance_km: 25_000_000_000,
    color: "#7fffa8",
    description: "Humanity's most distant object. Crossed the heliopause in 2012. Still talking to us, barely."
  }
];

// Sorted by distance for binary-search lookups
BODIES.sort((a, b) => a.distance_km - b.distance_km);

// Total strip extent (a bit past the last body so it doesn't hug the edge)
const TOTAL_DISTANCE_KM = BODIES[BODIES.length - 1].distance_km * 1.02;
const TOTAL_WIDTH_PX = TOTAL_DISTANCE_KM * PX_PER_KM;

// ============================================================
// Glossary — astronomical terms that appear in descriptions.
// Any term whose key appears in body text gets a dotted-underline
// inline link that opens a tooltip with the definition.
// Keys are matched case-insensitively as whole words/phrases.
// ============================================================
const GLOSSARY = {
  "G-type main-sequence star": "A star fusing hydrogen into helium in its core, with a surface around 5,300–6,000 K. The Sun is the textbook example. They live about 10 billion years before swelling into red giants. About 7% of stars in the Milky Way are G-type.",
  "main sequence": "The long, stable phase of a star's life when it fuses hydrogen into helium in its core. Stars spend roughly 90% of their lifetime here.",
  "spectral class": "Stars are classified by surface temperature with the letters O, B, A, F, G, K, M (hottest to coolest). The Sun is G; red dwarfs are M.",
  "AU": "Astronomical Unit — the average Earth–Sun distance, 149,597,870 km. The yardstick used for distances inside the solar system.",
  "light-year": "The distance light travels in one year — about 9.46 trillion km, or 63,241 AU. The nearest star (Proxima Centauri) is 4.24 light-years away.",
  "dwarf planet": "A round body orbiting the Sun that hasn't cleared its orbital neighbourhood of other debris. Pluto, Ceres, Eris, Haumea, and Makemake are recognised.",
  "Kuiper Belt": "A ring of icy bodies beyond Neptune, from about 30 to 50 AU. Home to Pluto and most short-period comets.",
  "L2": "The Sun–Earth Lagrange Point 2, about 1.5 million km behind Earth (away from the Sun). A spacecraft here orbits the Sun in sync with Earth. James Webb lives at L2.",
  "Lagrange point": "One of five points in a two-body system (e.g. Sun + Earth) where a small object can stay in a fixed position relative to both. There are five: L1–L5.",
  "heliopause": "The boundary where the Sun's solar wind is balanced by interstellar gas — roughly 120 AU out. Beyond this, you're in interstellar space.",
  "termination shock": "Where the solar wind slows from supersonic to subsonic as it pushes against interstellar gas. Voyager 1 crossed it in 2004.",
  "solar wind": "A stream of charged particles (mostly electrons and protons) flowing outward from the Sun at hundreds of km/s.",
  "geostationary": "An orbit ~35,786 km above Earth's equator where a satellite's orbital period matches Earth's rotation, so it appears to hover over a fixed point. Used for TV and weather sats.",
  "ecliptic": "The plane of Earth's orbit around the Sun. The other planets orbit close to this same plane.",
  "perigee": "The closest point of an orbit around Earth. Opposite of apogee.",
  "apogee": "The farthest point of an orbit around Earth.",
  "retrograde": "Moving or rotating in the opposite direction to most bodies in the system. Venus rotates retrograde."
};

// ============================================================
// Extended details for bodies that have richer write-ups.
// Optional. If a body has `details`, a "Learn more" affordance
// appears on its milestone card and opens an info panel.
// ============================================================
const BODY_DETAILS = {
  "sun": {
    overview: "A G-type main-sequence star roughly 4.6 billion years old, with another ~5 billion years before it swells into a red giant. The Sun contains 99.86% of the mass of the entire solar system — every planet, moon, asteroid and comet combined is the remaining 0.14%.",
    facts: [
      "Surface temperature ~5,500 °C; core temperature ~15 million °C.",
      "Fuses about 600 million tonnes of hydrogen into helium every second.",
      "Light from its surface takes 8 minutes 20 seconds to reach Earth.",
      "Its diameter (1.39 million km) is 109 times Earth's."
    ]
  },
  "earth": {
    overview: "The only known place in the universe with life. Exactly one AU from the Sun by definition — the AU is calibrated to Earth's average orbital radius.",
    facts: [
      "71% of the surface is water — the only solid body in the solar system with liquid water seas.",
      "Magnetic field deflects most of the solar wind, which is why we still have an atmosphere.",
      "Day length is slowly increasing — about 1.7 milliseconds per century, as the Moon steals rotational energy."
    ]
  },
  "jupiter": {
    overview: "A gas giant with more than twice the mass of every other planet combined. If it had been about 80 times more massive at birth, it would have become a star.",
    facts: [
      "The Great Red Spot is a storm wider than Earth, observed continuously since 1830.",
      "Has 95 known moons — the four largest (Io, Europa, Ganymede, Callisto) were discovered by Galileo in 1610.",
      "Its strong gravity shields the inner planets from many comets and asteroids."
    ]
  },
  "saturn": {
    overview: "The second-largest planet, famous for its ring system. The rings are spectacular but extraordinarily thin — only about 10 to 30 metres thick on average, with a diameter of 280,000 km.",
    facts: [
      "Less dense than water — Saturn would float, if you found a big enough bathtub.",
      "Has at least 146 known moons; Titan has a thick atmosphere and lakes of liquid methane.",
      "The rings are mostly water ice with traces of rocky material, possibly the remnants of a shattered moon."
    ]
  },
  "pluto": {
    overview: "Reclassified as a dwarf planet in 2006 because it shares its orbital neighbourhood with other Kuiper Belt objects. New Horizons flew past in July 2015, revealing a surprisingly complex world with mountains of water ice and plains of frozen nitrogen.",
    facts: [
      "Has five known moons; Charon is so large that Pluto and Charon orbit a point in empty space between them.",
      "An orbital year here lasts 248 Earth years.",
      "Surface temperature about −230 °C — cold enough that nitrogen freezes solid."
    ]
  },
  "voyager-1": {
    overview: "Launched September 1977, intended for a Jupiter–Saturn flyby. It overperformed: still transmitting in the 2020s from beyond the heliopause, the most distant human-made object in existence.",
    facts: [
      "Carries the Golden Record — a phonograph disc with sounds, music, and greetings from Earth.",
      "Crossed the heliopause into interstellar space on August 25, 2012.",
      "Radio signal takes over 22 hours to reach Earth.",
      "Powered by a plutonium RTG that will run out around 2025–2030."
    ]
  },
  "moon": {
    overview: "Earth's only natural satellite, formed about 4.5 billion years ago from debris when a Mars-sized body smashed into the proto-Earth.",
    facts: [
      "Always shows the same face to Earth (tidally locked).",
      "Slowly drifting away from Earth at about 3.8 cm per year.",
      "Without the Moon, Earth's axial tilt would wobble chaotically over millions of years."
    ]
  },
  "mercury": {
    overview: "The smallest planet and the closest to the Sun. Barely any atmosphere, so temperatures swing wildly between day and night. Mercury has been visited by only two spacecraft — Mariner 10 and MESSENGER.",
    facts: [
      "A year here is 88 Earth days, but a solar day (sunrise to sunrise) lasts 176 Earth days.",
      "Temperatures range from −180 °C at night to +430 °C in daylight.",
      "Despite being closest to the Sun, water ice exists in permanently shadowed craters at its poles.",
      "Surface is heavily cratered, much like our Moon."
    ]
  },
  "venus": {
    overview: "Nearly the same size as Earth, but a runaway greenhouse atmosphere of CO₂ has turned it into the hottest world in the solar system. The surface pressure is 92 times Earth's — equivalent to standing under almost a kilometre of water.",
    facts: [
      "Surface temperature ~465 °C, hotter than Mercury despite being further from the Sun.",
      "Rotates retrograde — the Sun rises in the west and sets in the east.",
      "A day on Venus (243 Earth days) is longer than its year (225 Earth days).",
      "Clouds of sulphuric acid float above a dry, rocky surface dominated by volcanoes."
    ]
  },
  "mars": {
    overview: "Cold, dry, and rust-coloured from iron oxide on its surface. The most explored body in the solar system after Earth — currently home to several rovers, landers, and orbiters from multiple space agencies.",
    facts: [
      "Olympus Mons is the largest volcano in the solar system — 22 km tall, three times the height of Mount Everest.",
      "Has two tiny moons (Phobos and Deimos), probably captured asteroids.",
      "Strong evidence of ancient liquid water — dry river channels, lake beds, and salt deposits.",
      "A day on Mars is 24 hours 37 minutes — almost identical to Earth's."
    ]
  },
  "ceres": {
    overview: "Largest object in the asteroid belt and the only dwarf planet in the inner solar system. Discovered in 1801 — the first asteroid ever found, originally classified as a planet before being demoted to asteroid, then promoted again to dwarf planet in 2006.",
    facts: [
      "Contains about 25% of the entire asteroid belt's mass.",
      "Has water ice mixed into its crust and possibly a salty subsurface ocean.",
      "Visited by NASA's Dawn spacecraft from 2015 to 2018.",
      "Bright spots in Occator Crater turned out to be sodium carbonate deposits — salts left behind by briny water."
    ]
  },
  "uranus": {
    overview: "An ice giant — mostly water, methane, and ammonia ices around a small rocky core. Methane in the atmosphere gives it a pale blue-green colour. Famously tilted on its side, probably from an ancient collision.",
    facts: [
      "Axis tilted 98° — effectively rolls along its orbit. Each pole gets 42 years of sunlight followed by 42 years of darkness.",
      "Coldest measured atmosphere in the solar system: −224 °C.",
      "Has 27 known moons, mostly named after Shakespeare characters (Titania, Oberon, Miranda…).",
      "Visited by only one spacecraft — Voyager 2 in 1986."
    ]
  },
  "neptune": {
    overview: "Outermost giant planet, deep blue from atmospheric methane. Discovered in 1846 using mathematics — predicted from the way it tugged on Uranus's orbit, then confirmed by telescope within a day. Has the fastest winds in the solar system.",
    facts: [
      "Wind speeds reach over 2,000 km/h — supersonic.",
      "An orbital year is 165 Earth years; it has only completed one full orbit since being discovered.",
      "Its largest moon, Triton, orbits backward — strongly hinting it's a captured Kuiper Belt object.",
      "Visited only by Voyager 2 in 1989, which discovered the Great Dark Spot (since vanished)."
    ]
  },
  "new-horizons": {
    overview: "Launched January 2006 to do the first close-up reconnaissance of Pluto. Flew past on July 14, 2015 and then continued outward, flying by Arrokoth — a small Kuiper Belt object — on New Year's Day 2019.",
    facts: [
      "Fastest launch ever — left Earth at over 16 km/s, faster than any prior mission.",
      "Took 9 years and 5 months to reach Pluto.",
      "Revealed Pluto's heart-shaped nitrogen-ice glacier and tall mountains of water ice.",
      "Still operating in the Kuiper Belt; signals take about 8 hours one-way to reach Earth."
    ]
  },
  "pioneer-10": {
    overview: "First spacecraft to traverse the asteroid belt and the first to visit Jupiter. Launched March 1972. NASA lost contact in 2003 — its plutonium power source had decayed too far to keep the radio running.",
    facts: [
      "Reached Jupiter in December 1973 — a flyby that proved spacecraft could survive the asteroid belt and Jupiter's radiation.",
      "Carries the Pioneer plaque — a diagram of a man, a woman, and Earth's location, intended for any alien finders.",
      "Heading toward the star Aldebaran. It will pass close (in cosmic terms) in about 2 million years.",
      "Still drifting silently outward, even though we can no longer hear it."
    ]
  },
  "pioneer-11": {
    overview: "Sister probe to Pioneer 10. Launched April 1973. Used Jupiter's gravity to slingshot to Saturn, becoming the first spacecraft to visit that planet. Last contact in 1995.",
    facts: [
      "First close-up images of Saturn and its rings (September 1979) — six years before Voyager.",
      "Carries the same Pioneer plaque as its sister probe.",
      "Heading toward the constellation Aquila.",
      "Discovered a previously unknown ring around Saturn (the F-ring) and two new moons."
    ]
  },
  "voyager-2": {
    overview: "The only spacecraft to have visited Uranus and Neptune. Launched August 1977 — sixteen days BEFORE Voyager 1, despite the lower number. Took a slower trajectory that allowed it to fly past all four giant planets in a once-every-176-years alignment.",
    facts: [
      "Flew past Jupiter (1979), Saturn (1981), Uranus (1986), and Neptune (1989).",
      "Discovered 11 new moons and two new rings during the grand tour.",
      "Crossed the heliopause into interstellar space on November 5, 2018 — 6 years after Voyager 1.",
      "Carries an identical Golden Record, with greetings in 55 languages and music from across human cultures."
    ]
  },
  "termination-shock": {
    overview: "The point where the supersonic solar wind suddenly slows to subsonic speeds as it pushes against the surrounding interstellar gas. Located roughly 80–100 AU from the Sun. Beyond it lies the heliosheath — a turbulent boundary region — and then the heliopause.",
    facts: [
      "Voyager 1 crossed it in December 2004.",
      "Voyager 2 crossed it in August 2007.",
      "At the crossing, solar-wind particle speeds drop from ~400 km/s to ~100 km/s.",
      "Not a fixed boundary — it expands and contracts with the 11-year solar activity cycle."
    ]
  },
  "heliopause": {
    overview: "The outer edge of the heliosphere — the bubble of solar influence around our Sun. Out here, the solar wind's outward pressure is exactly balanced by interstellar gas pushing in. Many consider this the true edge of the solar system.",
    facts: [
      "Located about 120 AU from the Sun (~18 billion km).",
      "Voyager 1 crossed it on August 25, 2012 — the first human-made object to enter interstellar space.",
      "Voyager 2 followed on November 5, 2018.",
      "Beyond it, particles from other stars outnumber those from our Sun."
    ]
  }
};
