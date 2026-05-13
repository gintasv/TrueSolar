// Internationalisation for the solar-system site.
// Two languages: English (default, sourced mostly from BODIES / GLOSSARY / BODY_DETAILS in data.js)
// and Lithuanian (translated below). Loaded as a plain script tag so I18N is a global.

const I18N = {
  current: 'en',
  defaultLanguage: 'en',
  supported: ['en', 'lt'],
  storageKey: 'solarsystem.lang',

  locale: { en: 'en-US', lt: 'lt-LT' },

  // Static UI strings keyed by `data-i18n` attribute or by name in script.js
  strings: {
    en: {
      'page.title': 'The Solar System, if Pluto were 1 pixel',
      'hud.distanceFromSun': 'Distance from Sun',
      'hud.lightFromSun': 'Light from Sun',
      'hud.next': 'Next',
      'hud.interstellar': 'interstellar space',
      'hud.scaleDefault': '1 pixel = Pluto (2,376 km)',
      'aria.units': 'Distance units',
      'aria.lang': 'Language',
      'aria.minimap': 'Solar system minimap',
      'aria.bodyIndex': 'Jump to body',
      'aria.glossary': 'Glossary',
      'aria.subzoomClose': 'Close detail view',
      'aria.infoClose': 'Close info panel',
      'aria.body': '{name}, {dist} from Sun',
      'aria.zoomBtn': 'View {name} detail',
      'intro.h1': 'The Solar System at True Scale',
      'intro.p1.html': 'On this page, <strong>Pluto is 1 pixel</strong>. Everything — the planets, their distances, the moons, the spacecraft — is sized in proportion. Scroll right.',
      'intro.p2.html': 'You will travel <strong>25 billion kilometres</strong>, or about ten million pixels. Most of it will be empty. That is the point.',
      'intro.tip.scroll.html': '<kbd>→</kbd> scroll',
      'intro.tip.jump.html': '<kbd>1</kbd>–<kbd>9</kbd> jump to a planet',
      'intro.tip.sun.html': '<kbd>0</kbd> back to the Sun',
      'intro.tip.end.html': '<kbd>End</kbd> the very end',
      'intro.begin': 'Begin',
      'nav.bodies': 'Bodies',
      'nav.glossary': 'Glossary',
      'subzoom.titleDefault': 'Earth detail',
      'subzoom.title': '{name} detail',
      'subzoom.scale': '1 pixel = {km} km',
      'subzoom.scaleHud': '1 px = {km} km — {name} detail',
      'subzoom.intro.html': '<strong>{name}</strong> — {description}<br>Scroll right to see what orbits here. Click an item for details.',
      'info.titleDefault': 'Body',
      'info.distance': 'Distance from Sun',
      'info.diameter': 'Diameter',
      'info.lightTime': 'Light from Sun',
      'info.type': 'Type',
      'info.factsTitle': 'Did you know',
      'milestone.learnMore': 'Learn more →',
      'label.diameterShort': '⌀ {km} km',
      'label.diameterSep': ' · ⌀ {km} km',
      'label.altitudeUp': '{km} km up',
      'label.altitudeUpThou': '{km},000 km up',
      'type.star': 'star',
      'type.planet': 'planet',
      'type.dwarf': 'dwarf planet',
      'type.moon': 'moon',
      'type.satellite': 'satellite',
      'type.probe': 'probe',
      'type.belt': 'belt',
      'type.milestone': 'milestone'
    },
    lt: {
      'page.title': 'Saulės sistema, jei Plutonas būtų 1 pikselis',
      'hud.distanceFromSun': 'Atstumas nuo Saulės',
      'hud.lightFromSun': 'Šviesa nuo Saulės',
      'hud.next': 'Toliau',
      'hud.interstellar': 'tarpžvaigždinė erdvė',
      'hud.scaleDefault': '1 pikselis = Plutonas (2 376 km)',
      'aria.units': 'Atstumo vienetai',
      'aria.lang': 'Kalba',
      'aria.minimap': 'Saulės sistemos žemėlapis',
      'aria.bodyIndex': 'Pereiti prie kūno',
      'aria.glossary': 'Žodynas',
      'aria.subzoomClose': 'Uždaryti detalų vaizdą',
      'aria.infoClose': 'Uždaryti informacijos langą',
      'aria.body': '{name}, {dist} nuo Saulės',
      'aria.zoomBtn': 'Peržiūrėti {name} detales',
      'intro.h1': 'Saulės sistema tikru masteliu',
      'intro.p1.html': 'Šiame puslapyje <strong>Plutonas yra 1 pikselis</strong>. Viskas — planetos, jų atstumai, palydovai, kosminiai laivai — yra proporcingo dydžio. Slinkite į dešinę.',
      'intro.p2.html': 'Jūs nukeliausite <strong>25 milijardus kilometrų</strong>, arba apie dešimt milijonų pikselių. Didžioji dalis bus tuščia. Toks ir yra esmė.',
      'intro.tip.scroll.html': '<kbd>→</kbd> slinkti',
      'intro.tip.jump.html': '<kbd>1</kbd>–<kbd>9</kbd> pereiti prie planetos',
      'intro.tip.sun.html': '<kbd>0</kbd> atgal į Saulę',
      'intro.tip.end.html': '<kbd>End</kbd> pats galas',
      'intro.begin': 'Pradėti',
      'nav.bodies': 'Kūnai',
      'nav.glossary': 'Žodynas',
      'subzoom.titleDefault': 'Žemės detalus vaizdas',
      'subzoom.title': '{name} – detalus vaizdas',
      'subzoom.scale': '1 pikselis = {km} km',
      'subzoom.scaleHud': '1 px = {km} km — {name} detalus vaizdas',
      'subzoom.intro.html': '<strong>{name}</strong> — {description}<br>Slinkite į dešinę, kad pamatytumėte, kas čia skrieja. Spustelėkite objektą, kad pamatytumėte išsamiau.',
      'info.titleDefault': 'Kūnas',
      'info.distance': 'Atstumas nuo Saulės',
      'info.diameter': 'Skersmuo',
      'info.lightTime': 'Šviesa nuo Saulės',
      'info.type': 'Tipas',
      'info.factsTitle': 'Ar žinojai',
      'milestone.learnMore': 'Sužinoti daugiau →',
      'label.diameterShort': '⌀ {km} km',
      'label.diameterSep': ' · ⌀ {km} km',
      'label.altitudeUp': '{km} km virš paviršiaus',
      'label.altitudeUpThou': '{km} 000 km virš paviršiaus',
      'type.star': 'žvaigždė',
      'type.planet': 'planeta',
      'type.dwarf': 'nykštukinė planeta',
      'type.moon': 'palydovas',
      'type.satellite': 'palydovas',
      'type.probe': 'zondas',
      'type.belt': 'juosta',
      'type.milestone': 'riba'
    }
  },

  // Unit suffixes used by formatNumber / formatDistance / formatLightTime.
  // Light-time units have a leading space; number-magnitude suffixes follow whatever the
  // original English used (compact, no space) for English and the natural Lithuanian
  // convention (with space + abbreviation period) for Lithuanian.
  units: {
    en: {
      km: ' km',
      au: ' AU',
      mAU: ' mAU',
      mi: ' mi',
      s: ' s',
      ms: ' ms',
      us: ' μs',
      minSep: ' min ',
      hSep: ' h ',
      min: ' min',
      days: ' days',
      numK: 'K',
      numM: 'M',
      numB: 'B',
      numT: 'T',
      dashNoDist: '—',
      sep: ' · '
    },
    lt: {
      km: ' km',
      au: ' AV',
      mAU: ' mAV',
      mi: ' myl.',
      s: ' s',
      ms: ' ms',
      us: ' μs',
      minSep: ' min ',
      hSep: ' val. ',
      min: ' min',
      days: ' d.',
      numK: ' tūkst.',
      numM: ' mln.',
      numB: ' mlrd.',
      numT: ' trln.',
      dashNoDist: '—',
      sep: ' · '
    }
  },

  // Body name + short description overrides. Only `lt` is populated;
  // for `en` we fall back to BODIES (and zoom.items).
  bodies: {
    lt: {
      'sun':              { name: 'Saulė',              description: 'G klasės pagrindinės sekos žvaigždė. Joje sutelkta 99,86 % visos Saulės sistemos masės.' },
      'mercury':          { name: 'Merkurijus',         description: 'Mažiausia planeta. Metai čia trunka 88 Žemės paras.' },
      'venus':            { name: 'Venera',             description: 'Karščiausia planeta. Paviršiaus temperatūra apie 465 °C dėl įsibėgėjusio šiltnamio efekto.' },
      'earth':            { name: 'Žemė',               description: '1 AV nuo Saulės. Šviesai pasiekti čia reikia 8 minučių 20 sekundžių.' },
      'mars':             { name: 'Marsas',             description: 'Raudonoji planeta. Joje stūkso Olimpo kalnas — 22 km aukščio ugnikalnis.' },
      'asteroid-belt':    { name: 'Asteroidų juosta',   description: 'Šimtai tūkstančių uolinių kūnų tarp Marso ir Jupiterio. Bendra masė mažesnė nei 4 % Mėnulio.' },
      'ceres':            { name: 'Cerera',             description: 'Didžiausias asteroidų juostos objektas. Nykštukinė planeta.' },
      'jupiter':          { name: 'Jupiteris',          description: 'Didžiausia planeta. Masyvesnė už visas kitas planetas kartu sudėjus.' },
      'saturn':           { name: 'Saturnas',           description: 'Garsus savo žiedais — daugiausia vandens ledo, vidutiniškai mažiau nei 30 m storio.' },
      'uranus':           { name: 'Uranas',             description: 'Pakreiptas 98° kampu — tarsi riedantis savo orbita.' },
      'neptune':          { name: 'Neptūnas',           description: 'Sparčiausi vėjai Saulės sistemoje — daugiau nei 2 000 km/val. Šviesai pasiekti čia reikia 4 valandų.' },
      'kuiper-belt':      { name: 'Koiperio juosta',    description: 'Ledinių kūnų žiedas už Neptūno. Čia gyvena Plutonas, Eridė, Haumėja, Makemakė.' },
      'pluto':            { name: 'Plutonas',           description: 'Etalonas. Vienas pikselis. 2006 m. priskirtas nykštukinėms planetoms.' },
      'new-horizons':     { name: '„New Horizons"',     description: 'Paleistas 2006 m., 2015 m. praskriejo pro Plutoną. Dabar tyrinėja Koiperio juostą.' },
      'termination-shock':{ name: 'Sustojimo banga',    description: 'Vieta, kur saulės vėjas sulėtėja iki ikigarsinio greičio. ~90 AV nuo Saulės.' },
      'pioneer-11':       { name: '„Pioneer 11"',       description: 'Paleistas 1973 m. Paskutinis ryšys 1995 m. Tylėdamas dreifuoja Erelio žvaigždyno link.' },
      'heliopause':       { name: 'Heliopauzė',         description: 'Riba, kur baigiasi Saulės įtaka ir prasideda tarpžvaigždinė erdvė. ~120 AV.' },
      'pioneer-10':       { name: '„Pioneer 10"',       description: 'Paleistas 1972 m. Paskutinis ryšys 2003 m. Skrieja Aldebarano link — pasieks po ~2 milijonų metų.' },
      'voyager-2':        { name: '„Voyager 2"',        description: 'Paleistas 1977 m. 2018 m. kirto heliopauzę. Vis dar siunčia signalus.' },
      'voyager-1':        { name: '„Voyager 1"',        description: 'Tolimiausias žmonijos sukurtas objektas. 2012 m. kirto heliopauzę. Vis dar kalba su mumis, vos vos.' },

      // Zoom items (subzoom satellites and moons)
      'iss':       { name: 'TKS',                                 description: 'Tarptautinė kosminė stotis skrieja ~408 km virš Žemės.' },
      'hubble':    { name: 'Habblo kosminis teleskopas',          description: 'Veikia nuo 1990 m. ~540 km aukštyje.' },
      'starlink':  { name: 'Starlink palydovai',                  description: 'Tūkstančiai interneto palydovų žemoje Žemės orbitoje.' },
      'gps':       { name: 'GPS palydovai',                       description: 'Navigacijos palydovai vidutinėje Žemės orbitoje (~20 200 km virš paviršiaus).' },
      'geo':       { name: 'Geostacionarus žiedas',               description: 'Kur sėdi TV ir orų palydovai — vienas apsisukimas per parą.' },
      'moon':      { name: 'Mėnulis',                             description: 'Šviesai pasiekti Mėnulį reikia 1,3 sekundės.' },
      'jwst':      { name: 'Džeimso Vebo kosminis teleskopas',    description: 'Saulės–Žemės L2 taške, ~1,5 milijono km nuo Žemės.' },
      'phobos':    { name: 'Fobas',                               description: 'Didesnis Marso palydovas. Sukasi vis arčiau — po ~50 milijonų metų sudužs arba subyrės.' },
      'deimos':    { name: 'Deimas',                              description: 'Mažesnis ir tolimesnis Marso palydovas.' },
      'io':        { name: 'Ijo',                                 description: 'Vulkaniškai aktyviausias kūnas Saulės sistemoje.' },
      'europa':    { name: 'Europa',                              description: 'Ledine pluta dengia visuotinį vandenyną — galbūt tinkamą gyvybei.' },
      'ganymede':  { name: 'Ganimedas',                           description: 'Didžiausias Saulės sistemos palydovas. Didesnis už Merkurijų.' },
      'callisto':  { name: 'Kalisto',                             description: 'Stipriausiai krateriais išmuštas žinomas paviršius.' },
      'mimas':     { name: 'Mimas',                               description: '„Mirties žvaigždės" palydovas — vieną jo pusę užima milžiniškas krateris.' },
      'enceladus': { name: 'Enceladas',                           description: 'Iš povandeninio vandenyno trykšta vandens ledo geizeriai.' },
      'titan':     { name: 'Titanas',                             description: 'Tanki atmosfera, skystojo metano ežerai. Didesnis už Merkurijų.' },
      'charon':    { name: 'Charonas',                            description: 'Pusės Plutono skersmens. Skrieja apie bendrą tašką tarp jų.' }
    }
  },

  // Glossary translations. Keys are the canonical English glossary keys
  // (matching GLOSSARY in data.js). `term` is the visible word/phrase in the
  // current language; `definition` is the popover text.
  glossary: {
    lt: {
      'G-type main-sequence star': {
        term: 'G klasės pagrindinės sekos žvaigždė',
        definition: 'Žvaigždė, savo branduolyje sintezuojanti vandenilį į helį, kurios paviršiaus temperatūra apie 5 300–6 000 K. Saulė yra tipinis pavyzdys. Tokios žvaigždės gyvena maždaug 10 milijardų metų prieš išsipūsdamos į raudonąsias milžines.'
      },
      'main sequence': {
        term: 'pagrindinė seka',
        definition: 'Ilgas stabilus žvaigždės gyvenimo etapas, kai jos branduolyje vandenilis virsta heliu. Žvaigždės šiame etape praleidžia maždaug 90 % savo gyvenimo.'
      },
      'spectral class': {
        term: 'spektrinė klasė',
        definition: 'Žvaigždės klasifikuojamos pagal paviršiaus temperatūrą raidėmis O, B, A, F, G, K, M (nuo karščiausių iki vėsiausių). Saulė priklauso G klasei.'
      },
      'AU': {
        term: 'AV',
        definition: 'Astronominis vienetas — vidutinis atstumas tarp Žemės ir Saulės, 149 597 870 km. Pagrindinis Saulės sistemos atstumų matas.'
      },
      'light-year': {
        term: 'šviesmetis',
        definition: 'Atstumas, kurį šviesa nukeliauja per vienus metus — apie 9,46 trilijono km, arba 63 241 AV. Artimiausia žvaigždė (Proksima Kentauro) yra 4,24 šviesmečio atstumu.'
      },
      'dwarf planet': {
        term: 'nykštukinė planeta',
        definition: 'Apvalus kūnas, skriejantis aplink Saulę, bet neišvalęs savo orbitos nuo kitų objektų. Pripažintos: Plutonas, Cerera, Eridė, Haumėja, Makemakė.'
      },
      'Kuiper Belt': {
        term: 'Koiperio juosta',
        definition: 'Ledinių kūnų žiedas už Neptūno, maždaug nuo 30 iki 50 AV. Čia gyvena Plutonas ir dauguma trumpaperiodžių kometų.'
      },
      'L2': {
        term: 'L2',
        definition: 'Saulės–Žemės antrasis Lagranžo taškas, ~1,5 mln. km už Žemės (priešingoje pusėje nuo Saulės). Šiame taške esantis erdvėlaivis sukasi aplink Saulę sinchroniškai su Žeme. Čia gyvena Džeimso Vebo teleskopas.'
      },
      'Lagrange point': {
        term: 'Lagranžo taškas',
        definition: 'Vienas iš penkių dviejų kūnų sistemos taškų (pvz., Saulė + Žemė), kuriuose mažas objektas gali išlikti pastovioje padėtyje abiejų atžvilgiu. Jų yra penki: L1–L5.'
      },
      'heliopause': {
        term: 'heliopauzė',
        definition: 'Riba, kur Saulės vėją subalansuoja tarpžvaigždinės dujos — maždaug 120 AV nuotoliu. Toliau prasideda tarpžvaigždinė erdvė.'
      },
      'termination shock': {
        term: 'sustojimo banga',
        definition: 'Vieta, kur saulės vėjas iš viršgarsinio greičio sulėtėja iki ikigarsinio, atsimušdamas į tarpžvaigždines dujas. Voyager 1 ją kirto 2004 m.'
      },
      'solar wind': {
        term: 'saulės vėjas',
        definition: 'Įkrautų dalelių (daugiausia elektronų ir protonų) srautas, sklindantis iš Saulės šimtais km/s greičiu.'
      },
      'geostationary': {
        term: 'geostacionari',
        definition: 'Orbita ~35 786 km virš Žemės pusiaujo, kur palydovo apsisukimo periodas sutampa su Žemės sukimosi periodu — taigi palydovas tarsi kabo virš to paties taško. Naudojama TV ir orų palydovams.'
      },
      'ecliptic': {
        term: 'ekliptika',
        definition: 'Žemės orbitos aplink Saulę plokštuma. Kitos planetos skrieja arti tos pačios plokštumos.'
      },
      'perigee': {
        term: 'perigėjas',
        definition: 'Artimiausias orbitos aplink Žemę taškas. Priešingas apogėjui.'
      },
      'apogee': {
        term: 'apogėjus',
        definition: 'Tolimiausias orbitos aplink Žemę taškas.'
      },
      'retrograde': {
        term: 'retrogradinis',
        definition: 'Judantis arba besisukantis priešinga kryptimi nei dauguma sistemos kūnų. Venera sukasi retrogradiškai.'
      }
    }
  },

  // BODY_DETAILS overrides — only the body ids that need translation.
  details: {
    lt: {
      'sun': {
        overview: 'G klasės pagrindinės sekos žvaigždė, kuriai maždaug 4,6 milijardo metų ir kuriai dar liko apie 5 milijardus metų prieš ją išsipučiant į raudonąją milžinę. Saulėje sutelkta 99,86 % visos Saulės sistemos masės — visos planetos, palydovai, asteroidai ir kometos sudaro vos 0,14 %.',
        facts: [
          'Paviršiaus temperatūra ~5 500 °C; branduolio temperatūra ~15 mln. °C.',
          'Kas sekundę į helį paverčia apie 600 mln. tonų vandenilio.',
          'Šviesai nuo Saulės paviršiaus pasiekti Žemę reikia 8 minučių 20 sekundžių.',
          'Saulės skersmuo (1,39 mln. km) yra 109 kartus didesnis už Žemės.'
        ]
      },
      'earth': {
        overview: 'Vienintelė žinoma vieta visatoje, kur yra gyvybės. Lygiai vienas AV nuo Saulės pagal apibrėžimą — AV yra sukalibruotas pagal vidutinį Žemės orbitos spindulį.',
        facts: [
          '71 % paviršiaus padengta vandeniu — vienintelis kietas Saulės sistemos kūnas su skystojo vandens jūromis.',
          'Magnetinis laukas nukreipia didžiąją dalį saulės vėjo, todėl mes vis dar turime atmosferą.',
          'Paros ilgis pamažu didėja — apie 1,7 ms per šimtmetį, nes Mėnulis vagia sukimosi energiją.'
        ]
      },
      'jupiter': {
        overview: 'Dujinė milžinė, kurios masė daugiau nei dvigubai didesnė už visų kitų planetų kartu sudėjus. Jeigu gimdama būtų buvusi maždaug 80 kartų masyvesnė, būtų tapusi žvaigžde.',
        facts: [
          'Didžioji raudonoji dėmė — audra, platesnė už Žemę, stebima nuo 1830 m.',
          'Turi 95 žinomus palydovus — keturis didžiausius (Ijo, Europą, Ganimedą, Kalisto) atrado Galilėjus 1610 m.',
          'Stipri jos gravitacija saugo vidines planetas nuo daugelio kometų ir asteroidų.'
        ]
      },
      'saturn': {
        overview: 'Antra pagal dydį planeta, garsi savo žiedų sistema. Žiedai įspūdingi, bet nepaprastai ploni — vidutiniškai vos 10–30 metrų storio, o jų skersmuo siekia 280 000 km.',
        facts: [
          'Tankis mažesnis nei vandens — jei rastumėte pakankamai didelę vonią, Saturnas plūduriuotų.',
          'Turi mažiausiai 146 žinomus palydovus; Titanas turi tankią atmosferą ir skystojo metano ežerus.',
          'Žiedai daugiausia iš vandens ledo su uolienų pėdsakais — galbūt suskilusio palydovo liekanos.'
        ]
      },
      'pluto': {
        overview: '2006 m. priskirtas nykštukinėms planetoms, nes savo orbitos zonoje dalijasi vieta su kitais Koiperio juostos objektais. „New Horizons" 2015 m. liepą praskriejo pro jį ir parodė netikėtai sudėtingą pasaulį su vandens ledo kalnais ir užšalusio azoto lygumomis.',
        facts: [
          'Turi penkis žinomus palydovus; Charonas toks didelis, kad Plutonas ir Charonas skrieja apie tašką tuščioje erdvėje tarp jų.',
          'Vieni orbitos metai čia trunka 248 Žemės metus.',
          'Paviršiaus temperatūra apie −230 °C — pakankamai šalta, kad azotas užšaltų.'
        ]
      },
      'voyager-1': {
        overview: 'Paleistas 1977 m. rugsėjį, skirtas Jupiterio–Saturno skrydžiui. Pranoko lūkesčius: 2020-aisiais vis dar siunčia signalus iš anapus heliopauzės, tai tolimiausias žmogaus pagamintas objektas.',
        facts: [
          'Veža Aukso įrašą — patefono plokštelę su Žemės garsais, muzika ir sveikinimais.',
          'Į tarpžvaigždinę erdvę už heliopauzės įžengė 2012 m. rugpjūčio 25 d.',
          'Radijo signalui pasiekti Žemę reikia daugiau nei 22 valandų.',
          'Maitinamas plutonio RTG, kurio energijos užteks maždaug iki 2025–2030 m.'
        ]
      },
      'moon': {
        overview: 'Vienintelis natūralus Žemės palydovas, susiformavęs maždaug prieš 4,5 milijardo metų iš nuolaužų, kai į priešistorinę Žemę rėžėsi Marso dydžio kūnas.',
        facts: [
          'Žemei visada rodo tą patį šoną (sukibęs potvyniais).',
          'Lėtai tolsta nuo Žemės — maždaug 3,8 cm per metus.',
          'Be Mėnulio Žemės ašies polinkis per milijonus metų svyruotų chaotiškai.'
        ]
      },
      'mercury': {
        overview: 'Mažiausia planeta ir arčiausia Saulės. Beveik be atmosferos, todėl temperatūra tarp dienos ir nakties svyruoja drastiškai. Merkurijų aplankė tik du erdvėlaiviai — „Mariner 10" ir „MESSENGER".',
        facts: [
          'Metai čia trunka 88 Žemės paras, bet saulinė para (nuo saulėtekio iki saulėtekio) — 176 Žemės paras.',
          'Temperatūra svyruoja nuo −180 °C naktį iki +430 °C dieną.',
          'Nepaisant artumo Saulei, prie polių esančiuose nuolat šešėliuose krateriuose yra vandens ledo.',
          'Paviršius gausiai išmuštas krateriais, panašiai kaip mūsų Mėnulis.'
        ]
      },
      'venus': {
        overview: 'Beveik tokio paties dydžio kaip Žemė, bet įsibėgėjęs šiltnamio efektas CO₂ atmosferoje pavertė ją karščiausiu pasauliu Saulės sistemoje. Paviršiaus slėgis 92 kartus didesnis nei Žemės — tarsi stovėtum po beveik kilometru vandens.',
        facts: [
          'Paviršiaus temperatūra ~465 °C — karštesnė nei Merkurijaus, nors yra toliau nuo Saulės.',
          'Sukasi retrogradiškai — Saulė teka vakaruose ir leidžiasi rytuose.',
          'Para Veneroje (243 Žemės paros) ilgesnė už jos metus (225 Žemės paros).',
          'Virš sausos uolingos vulkanų sklidinos planetos plaukioja sieros rūgšties debesys.'
        ]
      },
      'mars': {
        overview: 'Šalta, sausa ir rūdžių spalvos planeta dėl geležies oksido paviršiuje. Po Žemės — labiausiai tyrinėtas Saulės sistemos kūnas; čia dabar darbuojasi keli marsaeigiai, nusileidimo aparatai ir orbitiniai zondai.',
        facts: [
          'Olimpo kalnas yra didžiausias Saulės sistemos ugnikalnis — 22 km aukščio, triskart aukštesnis už Everestą.',
          'Turi du mažus palydovus (Fobą ir Deimą), greičiausiai pagautus asteroidus.',
          'Stiprių senovinio skystojo vandens pėdsakų — išdžiūvę upių slėniai, ežerų dugnai, druskų sankaupos.',
          'Para Marse trunka 24 val. 37 min. — beveik kaip Žemėje.'
        ]
      },
      'ceres': {
        overview: 'Didžiausias asteroidų juostos objektas ir vienintelė vidinės Saulės sistemos nykštukinė planeta. Atrasta 1801 m. — pirmasis kada nors rastas asteroidas, iš pradžių klasifikuotas kaip planeta, vėliau pažemintas iki asteroido, o 2006 m. paaukštintas iki nykštukinės planetos.',
        facts: [
          'Sudaro maždaug 25 % visos asteroidų juostos masės.',
          'Plutoje yra vandens ledo, o po paviršiumi — galimas sūrus vandenynas.',
          'Aplankyta NASA „Dawn" zondo 2015–2018 m.',
          'Šviesios dėmės Okatorio krateryje pasirodė esančios natrio karbonato — sūraus vandens paliktos druskos.'
        ]
      },
      'uranus': {
        overview: 'Ledinė milžinė — daugiausia vandens, metano ir amoniako ledo aplink mažą uolinį branduolį. Metanas atmosferoje suteikia jam blyškiai žaliai mėlyną atspalvį. Garsus tuo, kad pasviręs ant šono, tikriausiai dėl senovinio susidūrimo.',
        facts: [
          'Ašis pakreipta 98° — tarsi rieda savo orbita. Kiekvienas polius gauna 42 metus saulės šviesos, po to 42 metus tamsos.',
          'Šalčiausia išmatuota atmosfera Saulės sistemoje: −224 °C.',
          'Turi 27 žinomus palydovus, daugumos pavadinimai paimti iš Šekspyro veikalų (Titanija, Oberonas, Miranda…).',
          'Aplankytas tik vieno erdvėlaivio — „Voyager 2" 1986 m.'
        ]
      },
      'neptune': {
        overview: 'Toliausiai esanti milžiniška planeta, gilios mėlynos spalvos dėl atmosferos metano. Atrasta 1846 m. matematiškai — numatyta pagal Urano orbitos sutrikimus ir per parą patvirtinta teleskopu. Joje pučia sparčiausi vėjai Saulės sistemoje.',
        facts: [
          'Vėjo greitis siekia daugiau nei 2 000 km/val. — viršgarsinis.',
          'Vieni orbitos metai trunka 165 Žemės metus; nuo atradimo apsuko tik vieną orbitą.',
          'Didžiausias palydovas Tritonas skrieja atgal — tai stipriai užsimena, kad jis pagautas iš Koiperio juostos.',
          'Aplankyta tik „Voyager 2" 1989 m. — tada atrasta Didžioji tamsi dėmė (vėliau išnyko).'
        ]
      },
      'new-horizons': {
        overview: 'Paleistas 2006 m. sausį, kad iš arti apžvelgtų Plutoną. Praskriejo pro jį 2015 m. liepos 14 d., o paskui nuskriejo toliau ir 2019 m. Naujųjų Metų dieną praskriejo pro Arokotą — mažą Koiperio juostos objektą.',
        facts: [
          'Greičiausias kada nors paleistas erdvėlaivis — paliko Žemę daugiau nei 16 km/s greičiu.',
          'Iki Plutono skrido 9 metus ir 5 mėnesius.',
          'Atskleidė širdies formos azoto ledo ledyną ir aukštus vandens ledo kalnus Plutone.',
          'Vis dar veikia Koiperio juostoje; signalai iki Žemės keliauja apie 8 valandas.'
        ]
      },
      'pioneer-10': {
        overview: 'Pirmasis erdvėlaivis, kirtęs asteroidų juostą, ir pirmasis aplankęs Jupiterį. Paleistas 1972 m. kovą. NASA prarado ryšį 2003 m. — jo plutonio energijos šaltinis pernelyg susidėvėjo radijo siųstuvui.',
        facts: [
          'Jupiterį pasiekė 1973 m. gruodį — skrydis įrodė, kad erdvėlaiviai gali išgyventi asteroidų juostą ir Jupiterio radiaciją.',
          'Veža „Pioneer" plokštelę — vyro, moters ir Žemės vietos diagramą galimiems ateiviams.',
          'Skrieja žvaigždės Aldebarano link. Kosminiu mastu pro ją praskries po maždaug 2 milijonų metų.',
          'Vis dar tylėdamas dreifuoja į išorę, nors jau nebegirdime.'
        ]
      },
      'pioneer-11': {
        overview: 'Pioneer 10 sesutė. Paleista 1973 m. balandį. Pasinaudojo Jupiterio gravitacija, kad būtų nusviesta į Saturną — pirmasis erdvėlaivis, aplankęs šią planetą. Paskutinis ryšys 1995 m.',
        facts: [
          'Pirmieji artimi Saturno ir jo žiedų vaizdai (1979 m. rugsėjį) — šešeriais metais anksčiau už „Voyager".',
          'Veža tą pačią „Pioneer" plokštelę kaip ir sesė.',
          'Skrieja Erelio žvaigždyno link.',
          'Atrado anksčiau nežinomą Saturno žiedą (F žiedą) ir du naujus palydovus.'
        ]
      },
      'voyager-2': {
        overview: 'Vienintelis erdvėlaivis, aplankęs Uraną ir Neptūną. Paleistas 1977 m. rugpjūtį — šešiolika dienų ANKSČIAU už „Voyager 1", nors numeris didesnis. Lėtesnė trajektorija leido praskrieti pro visas keturias milžiniškas planetas vieną kartą per 176 metus pasitaikančiu išsidėstymu.',
        facts: [
          'Praskriejo pro Jupiterį (1979), Saturną (1981), Uraną (1986) ir Neptūną (1989).',
          'Per didįjį turą atrado 11 naujų palydovų ir du naujus žiedus.',
          'Į tarpžvaigždinę erdvę už heliopauzės įžengė 2018 m. lapkričio 5 d. — 6 metais po „Voyager 1".',
          'Veža identišką Aukso įrašą su sveikinimais 55 kalbomis ir žmonijos muzika.'
        ]
      },
      'termination-shock': {
        overview: 'Vieta, kur viršgarsinis saulės vėjas staiga sulėtėja iki ikigarsinio greičio, atsimušdamas į tarpžvaigždines dujas. Yra maždaug 80–100 AV nuo Saulės. Toliau plyti heliosferinis apvalkalas — turbulentinė pereinamoji sritis — ir tada heliopauzė.',
        facts: [
          '„Voyager 1" ją kirto 2004 m. gruodį.',
          '„Voyager 2" — 2007 m. rugpjūtį.',
          'Kertant, saulės vėjo dalelių greitis krenta nuo ~400 km/s iki ~100 km/s.',
          'Ne fiksuota riba — ji plečiasi ir traukiasi pagal 11 metų saulės aktyvumo ciklą.'
        ]
      },
      'heliopause': {
        overview: 'Heliosferos — Saulės įtakos burbulo aplink mūsų žvaigždę — išorinis kraštas. Čia saulės vėjo išorinis spaudimas tiksliai subalansuojamas iš išorės besispaudžiančių tarpžvaigždinių dujų. Daugelis tai laiko tikrąja Saulės sistemos riba.',
        facts: [
          'Yra maždaug 120 AV nuo Saulės (~18 mlrd. km).',
          '„Voyager 1" ją kirto 2012 m. rugpjūčio 25 d. — pirmasis žmogaus sukurtas objektas tarpžvaigždinėje erdvėje.',
          '„Voyager 2" sekė 2018 m. lapkričio 5 d.',
          'Anapus jos kitų žvaigždžių dalelių daugiau nei mūsų Saulės.'
        ]
      }
    }
  },

  // ---- helpers ----

  t(key, params) {
    const dict = this.strings[this.current] || this.strings.en;
    let str = dict[key];
    if (str == null) str = this.strings.en[key];
    if (str == null) return key;
    if (params) {
      str = str.replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? String(params[k]) : ''));
    }
    return str;
  },

  unit(key) {
    const u = this.units[this.current] || this.units.en;
    return u[key] != null ? u[key] : this.units.en[key];
  },

  _findInBodies(id) {
    if (typeof BODIES === 'undefined') return null;
    for (const b of BODIES) {
      if (b.id === id) return b;
      if (b.zoom && b.zoom.items) {
        for (const it of b.zoom.items) {
          if (it.id === id) return it;
        }
      }
    }
    return null;
  },

  bodyName(id) {
    const tr = this.bodies[this.current];
    if (tr && tr[id] && tr[id].name) return tr[id].name;
    const fallback = this._findInBodies(id);
    return fallback ? fallback.name : id;
  },

  bodyDescription(id) {
    const tr = this.bodies[this.current];
    if (tr && tr[id] && tr[id].description) return tr[id].description;
    const fallback = this._findInBodies(id);
    return fallback ? (fallback.description || '') : '';
  },

  // Returns array of { key, term, definition } for the current language.
  // `key` is the canonical English glossary key (used for data-term stability).
  glossaryEntries() {
    if (typeof GLOSSARY === 'undefined') return [];
    const tr = this.glossary[this.current];
    return Object.keys(GLOSSARY).map(k => {
      if (tr && tr[k]) return { key: k, term: tr[k].term, definition: tr[k].definition };
      return { key: k, term: k, definition: GLOSSARY[k] };
    });
  },

  glossaryEntryByTerm(termText) {
    const lower = termText.toLowerCase();
    return this.glossaryEntries().find(e => e.term.toLowerCase() === lower) || null;
  },

  glossaryEntryByKey(key) {
    return this.glossaryEntries().find(e => e.key === key) || null;
  },

  detailsFor(id) {
    const tr = this.details[this.current];
    const base = (typeof BODY_DETAILS !== 'undefined') ? BODY_DETAILS[id] : null;
    if (!base) return null;
    if (!tr || !tr[id]) return base;
    // Merge: keep image/image_credit from base, override overview/facts
    return {
      image: base.image,
      image_credit: base.image_credit,
      overview: tr[id].overview != null ? tr[id].overview : base.overview,
      facts: tr[id].facts != null ? tr[id].facts : base.facts
    };
  },

  typeLabel(type) {
    return this.t('type.' + type);
  },

  setLanguage(code) {
    if (!this.supported.includes(code)) code = this.defaultLanguage;
    this.current = code;
    try { document.documentElement.lang = code; } catch (_) {}
    try { localStorage.setItem(this.storageKey, code); } catch (_) {}
  },

  // Resolves initial language from URL > localStorage > default. Called once at boot.
  resolveInitial() {
    let code = null;
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('lang');
      if (q && this.supported.includes(q)) code = q;
    } catch (_) {}
    if (!code) {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored && this.supported.includes(stored)) code = stored;
      } catch (_) {}
    }
    if (!code) code = this.defaultLanguage;
    this.current = code;
    try { document.documentElement.lang = code; } catch (_) {}
    return code;
  }
};

// Resolve language as early as possible so document.documentElement.lang reflects it.
I18N.resolveInitial();
