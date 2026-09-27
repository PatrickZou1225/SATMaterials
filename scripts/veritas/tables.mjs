// Hand-built tables for questions whose table Veritas renders as divs: the
// capture flattens the cells into the passage text ("Country 1995 2020 Indonesia
// 0.44 0.51 …") with no <table> markup to recover, so each one is transcribed by
// hand from the flattened text. The converter applies these at conversion time
// (rather than the generated .ts being edited by hand) so re-running the
// converter reproduces the structured table.
//
// Key: the raw module file's basename, i.e. "<set-slug>-module-<n>". That name is
// assigned when the captures are staged, so it is stable across re-conversions.
//
// Entry shape: { <question id>: { table: { title?, headers, rows }, bodyStart } }
//   table     — the structured table to render under the passage.
//   bodyStart — the opening words of the prose that follows the flattened table.
//               Everything before it is the table's text and is dropped from
//               `passage`, so the table is not shown twice. Omit only when the
//               whole passage was the table (nothing but the table was captured).
export const tableOverrides = {
  // ── 2025-03 (C3) ────────────────────────────────────────────────────────────
  'sat-cmp-2025-c3-int-01-module-1': {
    9: {
      table: {
        title: 'Millions of Metric Tons of Copper Mined in 1995 and 2020',
        headers: ['Country', '1995', '2020'],
        rows: [
          ['Indonesia', '0.44', '0.51'],
          ['United States', '1.85', '1.20'],
          ['Kazakhstan', '0.26', '0.55'],
          ['Chile', '2.49', '5.73'],
        ],
      },
      bodyStart: 'While doing research for a paper',
    },
    11: {
      table: {
        title: 'Average Monetized Productivity Loss at Two Points After Programs Began, in Australian Dollars',
        headers: ['Type of training', '12 weeks', '12 months'],
        rows: [
          ['EET', '268', '171'],
          ['EHP', '282', '436'],
        ],
      },
      bodyStart: 'Michelle Pereira et al. hypothesized',
    },
  },
  'sat-cmp-2025-c3-int-02-module-1': {
    10: {
      table: {
        title: 'Population and Population Density of African Countries in 2015',
        headers: ['Country', 'Density (inhabitants/km2)', 'Area (km2)', 'Estimated population'],
        rows: [
          ['Sāo Tomé and Príncipe', '189.8', '1,001', '190,000'],
          ['Ethiopia', '88.2', '1,127,127', '99,391,000'],
          ['Mauritania', '3.9', '1,030,700', '4,068,000'],
          ['Angola', '20.1', '1,246,700', '25,022,000'],
        ],
      },
      bodyStart: 'As the second-most populous continent',
    },
    12: {
      table: {
        title: 'Three Candidate Lava Worlds, by Modeled Mass, Density, and Surface Temperature',
        headers: ['Planet', 'Mass (Earth masses)', 'Density ratio', 'Temperature (kelvins)'],
        rows: [
          ['HD 80653 b', '5.6', '7.4', '2,300'],
          ['Kepler-10 b', '3.6', '6.0', '2,130'],
          ['K2-265 b', '0.8', '7.1', '1,400'],
        ],
      },
      bodyStart: 'If a planet orbits in close proximity',
    },
    13: {
      table: {
        title: 'Average Monetized Productivity Loss at Two Points After Programs Began, in Australian Dollars',
        headers: ['Type of training', '12 weeks', '12 months'],
        rows: [
          ['EET', '268', '171'],
          ['EHP', '282', '436'],
        ],
      },
      bodyStart: 'Michelle Pereira et al. hypothesized',
    },
  },
  'sat-cmp-2025-c3-int-02-module-2': {
    9: {
      table: {
        title: 'Minimum and Maximum Depths of Stony Coral Species in Caribbean and Indo-Pacific Waters',
        headers: ['Species', 'Minimum depth (meters)', 'Maximum depth (meters)'],
        rows: [
          ['Acropora echinata', '8', '25'],
          ['Astreopora expansa', '5', '15'],
          ['Heliofungia fralinae', '3', '27'],
          ['Scolymia lacera', '10', '80'],
        ],
      },
      bodyStart: 'Some scientists have suggested',
    },
    12: {
      table: {
        title: 'Home Video Game Systems of the 1970s and 1980s',
        headers: ['System', 'Manufacturer', 'System type', 'Approximate number of units sold worldwide'],
        rows: [
          ['ColecoVision', 'Coleco', 'console', '2,000,000'],
          ['Intellivision', 'Mattel', 'console', '3,000,000'],
          ['MSX', 'ASCII Corp.', 'computer', '4,000,000'],
          ['Game & Watch', 'Nintendo', 'handheld', '18,600,000'],
        ],
      },
      bodyStart: 'A student is writing a research paper',
    },
  },
  'sat-cmp-2025-c3-int-03-module-1': {
    13: {
      table: {
        title: 'Average Monetized Productivity Loss at Two Points After Programs Began, in Australian Dollars',
        headers: ['Type of training', '12 weeks', '12 months'],
        rows: [
          ['EET', '268', '171'],
          ['EHP', '282', '436'],
        ],
      },
      bodyStart: 'Michelle Pereira et al. hypothesized',
    },
  },
  'sat-cmp-2025-c3-int-04-module-1': {
    11: {
      table: {
        title: 'Millions of Metric Tons of Copper Mined in 1995 and 2020',
        headers: ['Country', '1995', '2020'],
        rows: [
          ['Mexico', '0.33', '0.73'],
          ['United States', '1.5', '1.20'],
          ['Peru', '0.38', '2.15'],
          ['Poland', '0.38', '0.39'],
        ],
      },
      bodyStart: 'While doing research for a paper',
    },
  },
  'sat-cmp-2025-c3-int-04-module-2': {
    10: {
      table: {
        title: 'Reported Annual Travel Distances in Four Studies of Migrating Animal Populations',
        headers: ['Species', 'Continent', 'Distance (km)', 'Measurement method'],
        rows: [
          ['Brown bear', 'North America', '1325', 'GPS'],
          ['Tibetan antelope', 'Asia', '700', 'RTD'],
          ['Caribou', 'North America', '4,868', 'GPS'],
          ['Reindeer', 'Asia', '1,200', 'RTD'],
        ],
      },
      bodyStart: 'Some studies of migrating animals measure',
    },
  },
  'sat-cmp-2025-c3-int-05-module-1': {
    12: {
      table: {
        title: 'Average Monetized Productivity Loss at Two Points After Programs Began, in Australian Dollars',
        headers: ['Type of training', '12 weeks', '12 months'],
        rows: [
          ['EET', '268', '171'],
          ['EHP', '282', '436'],
        ],
      },
      bodyStart: 'Michelle Pereira et al. hypothesized',
    },
  },
  'sat-cmp-2025-c3-int-05-module-2': {
    11: {
      table: {
        title: 'Minimum and Maximum Depths of Stony Coral Species in Caribbean and Indo-Pacific Waters',
        headers: ['Species', 'Minimum depth (meters)', 'Maximum depth (meters)'],
        rows: [
          ['Psammocora albopicta', '1', '28'],
          ['Agaricia grahamae', '20', '115'],
          ['Astreopora gracilis', '5', '15'],
          ['Acropora echinata', '8', '25'],
        ],
      },
      bodyStart: 'Some scientists have suggested',
    },
  },
  'sat-cmp-2025-c3-na-01-module-2': {
    9: {
      table: {
        title: 'Minimum and Maximum Depths of Stony Coral Species in Caribbean and Indo-Pacific Waters',
        headers: ['Species', 'Minimum depth (meters)', 'Maximum depth (meters)'],
        rows: [
          ['Agaricia grahamae', '20', '115'],
          ['Acropora striata', '10', '25'],
          ['Danafungia scruposa', '1', '27'],
          ['Acropora anthocercis', '5', '10'],
        ],
      },
      bodyStart: 'Some scientists have suggested',
    },
  },
  'sat-cmp-2025-c3-na-03-module-2': {
    10: {
      table: {
        title: 'Studies of Cougar Population Density',
        headers: [
          'Study authors',
          'Location',
          'Methods',
          'Study area (square kilometers)',
          'Maximum density (cougars per 100 square kilometers)',
        ],
        rows: [
          ['Ross Clarke', 'British Columbia (Canada)', 'radio-collar tracking', '3,045', '0.72'],
          ['Verónica A. Quiroga et al.', 'Argentina', 'regular camera trapping', '1,882', '1.26'],
          ['Richard A. Beausoleil et al.', 'Washington (United States)', 'biopsy darting', '7,939', '2.40'],
          ['David M. Choate et al.', 'Utah (United States)', 'helicopter surveying', '1,300', '10.24'],
        ],
      },
      bodyStart: 'Studies of the population density of cougars',
    },
  },

  // ── 2025-05 (E5) ────────────────────────────────────────────────────────────
  'sat-cmp-2025-e5-int-01-module-1': {
    11: {
      table: {
        title: 'Effect of Neighboring Species on Pollinator Visits to Target Species',
        headers: ['Neighboring species', 'Target species', 'Effect value'],
        rows: [
          ['leafy spurge', 'Lewis flax', '-0.3238'],
          ['Himalayan balsam', 'marsh woundwort', '0.7905'],
          ['Canadian wood betony', 'mayapple', '0.4729'],
        ],
      },
      bodyStart: 'Researchers Carolina Laura Morales',
    },
    12: {
      table: {
        title: 'Impact of Four Key Industries on Oklahoma Economy in 2017',
        headers: [
          'Industry',
          'Approximate total contribution by industry',
          'Number of people employed by industry',
          'Average contribution per employee by industry',
        ],
        rows: [
          ['Accommodation/food service', '$5,242,100,000', '150,373', '$34,861'],
          ['Tribal economic activity', '$7,312,400,000', '51,674', '$141,510'],
          ['Health care', '$13,727,300,000', '193,514', '$70,937'],
          ['Retail', '$10,738,800,000', '179,208', '$59,924'],
        ],
      },
      bodyStart: 'The nearly forty tribes located in Oklahoma',
    },
  },
  'sat-cmp-2025-e5-int-01-module-2': {
    9: {
      table: {
        title: 'Ranking of Environmental and Sociocultural Benefits of Urban Agriculture (scale of 1 to 25; 1 = highest)',
        headers: ['Social or ecological service', 'Project leaders', 'Stakeholders', 'General public'],
        rows: [
          ['provision of medicinal plants', '22', '21', '5'],
          ['enhancement of pollination', '1', '7', '12'],
          ['enhancement of carbon sequestration', '17', '22', '21'],
          ['preservation of cultural konwledge and heritage', '8', '15', '13'],
          ['prevention of soil erosion', '13', '11', '23'],
        ],
      },
      bodyStart: 'Esther Sanyé-Mengual',
    },
  },
  'sat-cmp-2025-e5-int-02-module-1': {
    11: {
      table: {
        title: 'Effect of Neighboring Species on Pollinator Visits to Target Species',
        headers: ['Neighboring species', 'Target species', 'Effect value'],
        rows: [
          ['sticky catchfly', 'common cow-wheat', '0.2379'],
          ['prickly pear', 'jagged lavender', '0.1292'],
          ["viper's-bugloss", 'butterfly flower', '-0.3312'],
        ],
      },
      bodyStart: 'Researchers Carolina Laura Morales',
    },
    12: {
      table: {
        title: 'Impact of Four Key Industries on Oklahoma Economy in 2017',
        headers: [
          'Industry',
          'Approximate total contribution by industry',
          'Number of people employed by industry',
          'Average contribution per employee by industry',
        ],
        rows: [
          ['Accommodation/food services', '$5,242,100,000', '150,373', '$34,861'],
          ['Tribal economic activity', '$7,312,400,000', '51,674', '$141,510'],
          ['Health care', '$13,727,300,000', '193,514', '$70,937'],
          ['Retail', '$10,738,800,000', '179,208', '$59,924'],
        ],
      },
      bodyStart: 'The nearly forty tribes located in Oklahoma',
    },
  },
  'sat-cmp-2025-e5-int-02-module-2': {
    9: {
      table: {
        title: 'Ranking of Environmental and Sociocultural Benefits of Urban Agriculture (scale of 1 to 25; 1 = highest)',
        headers: ['Social or ecological service', 'Project leaders', 'Stakeholders', 'General public'],
        rows: [
          ['increase in global biodiversity', '5', '8', '17'],
          ['provision of food', '4', '15', '8'],
          ['improvement of community building', '17', '12', '10'],
          ['improvement of local microclimate', '13', '14', '20'],
          ['provision of medicinal plants', '22', '21', '5'],
        ],
      },
      bodyStart: 'Esther Sanyé-Mengual',
    },
  },
  'sat-cmp-2025-e5-int-03-module-1': {
    11: {
      table: {
        title: 'Volcanoes in Ecuador',
        headers: ['Name of volcano', 'Year of last eruption', 'Volcano type'],
        rows: [
          ['Wolf', '2022 CE', 'shield'],
          ['Imbabura', '5550 BCE', 'compound'],
          ['Chacana', '1773 CE', 'caldera'],
          ['Tungurahua', '2016 CE', 'stratovolcano'],
        ],
      },
      bodyStart: 'A student is researching volcanoes in Ecuador',
      bodyEnd: '2016 CE',
    },
  },
  'sat-cmp-2025-e5-int-03-module-2': {
    11: {
      table: {
        title: "Properties of TRAPPIST-1 Exoplanets Compared to Earth's Properties",
        headers: ['Planet', 'Orbital period (days)', 'Planet radius (Earth radii)'],
        rows: [
          ['Earth', '365.26', '1'],
          ['TRAPPIST-1b', '1.51', '1.09'],
          ['TRAPPIST-1d', '4.05', '0.77'],
          ['TRAPPIST-1e', '6.1', '0.92'],
          ['TRAPPIST-1f', '9.21', '1.04'],
        ],
      },
      bodyStart: 'TRAPPIST-1 is a planetary system',
      bodyEnd: 'Planet radius (Earth radii)',
    },
    13: {
      table: {
        title: 'Highest Major Summits in India',
        headers: ['Summit', 'Elevation (meters)', 'Mountain range', 'Prominence (meters)'],
        rows: [
          ['Rimo I', '7,385', 'Rimo Karakoram', '1,438'],
          ['Nanda Devi', '7,816', 'Himalayas', '3,139'],
          ['Panchchuli II', '6,904', 'Garhwal Himalaya', '1,614'],
          ['Saser Kangri I/ K22', '7,672', 'Saser Karakoram', '2,304'],
          ['Langpo', '6,965', 'Sikkim Himalaya', '560'],
        ],
      },
      bodyStart: 'Mountain summits are often described',
    },
  },
  'sat-cmp-2025-e5-int-04-module-1': {
    10: {
      table: {
        title: 'Ranking of Environmental and Sociocultural Benefits of Urban Agriculture (scale of 1 to 25; 1 = highest)',
        headers: ['Social or ecological service', 'Project leaders', 'Stakeholders', 'General public'],
        rows: [
          ['provision of raw materials', '22', '25', '15'],
          ['provision of habitat for fauna', '13', '8', '18'],
          ['improvement of attitudes and outlooks', '8', '1', '4'],
          ['contribution to political fulfillment', '21', '23', '24'],
          ['enhancement of pollination', '1', '7', '12'],
        ],
      },
      bodyStart: 'Esther Sanyé-Mengual',
    },
  },
  'sat-cmp-2025-e5-na-01-module-1': {
    12: {
      table: {
        title: 'Total Areas of Five Pueblo Nations in New Mexico',
        headers: ['Tribal nation', 'Area (square miles)'],
        rows: [
          ['Pueblo of Acoma', '595.7'],
          ['Taos Pueblo', '156.2'],
          ['Pueblo of Sandia', '38.9'],
          ['Pueblo de Cochiti', '82.1'],
          ['Pueblo of Pojoaque', '21.4'],
        ],
      },
      bodyStart: 'The Pueblo of Laguna is the largest',
    },
    13: {
      table: {
        title: 'Volcanoes in Ecuador',
        headers: ['Name of volcano', 'Year of last eruption', 'Volcano type'],
        rows: [
          ['Chacana', '1773 CE', 'caldera'],
          ['Imbabura', '5550 BCE', 'compound'],
          ['Chimborazo', '550 BCE', 'stratovolcano'],
          ['Fernandina', '2020 CE', 'shield'],
        ],
      },
      bodyStart: 'A student who is researching volcanoes in Ecuador',
    },
  },
  'sat-cmp-2025-e5-na-01-module-2': {
    13: {
      table: {
        title: 'Value, Cost, and Seigniorage of US Coins by Denomination, 2023',
        headers: [
          'Denomination',
          'Total value of units produced (in millions of dollars)',
          'Gross cost (in millions of dollars)',
          'Seigniorage (in millions of dollars)',
          'Seigniorage per $1 issued (dollars)',
        ],
        rows: [
          ['One-cent', '41.4', '127.4', '-86.0', '-2.08'],
          ['Five-cent', '70.8', '163.4', '-92.6', '-1.31'],
          ['Ten-cent', '266.6', '141.1', '125.5', '0.47'],
          ['Quarter-dollar', '568.4', '264.4', '304.0', '0.53'],
        ],
      },
      bodyStart: 'Issuing a one-dollar coin yields positive seigniorage',
    },
  },

  // ── 2025-06 (F6) ────────────────────────────────────────────────────────────
  'sat-cmp-2025-f6-int-01-module-1': {
    11: {
      table: {
        title: 'US Hydroelectric Power Plants, 2019',
        headers: ['Plant', 'State', 'Mode', 'Generators in plant', 'Average power generation (MWh/yr)', 'Water source'],
        rows: [
          ['J. Woodruff', 'Florida', 'peaking', '3', '193,864', 'Lake Seminole Reservoir'],
          ['Superior Falls', 'Michigan', 'run-of-river', '2', '10,693', 'Montreal River'],
          ['Norway', 'Indiana', 'run-of-river', '4', '19,751', 'Tippecanoe River'],
          ['White River', 'Wisconsin', 'run-of-river', '2', '3,999', 'White River'],
        ],
      },
      bodyStart: 'In 2021, Rocío Uría-Martínez',
    },
    13: {
      table: {
        title: 'Peering at Adult Orangutans by Immature Orangutans',
        headers: [
          'Individual',
          'Site',
          'Sex',
          'Total number of peering events observed',
          "Proportion of peering events directed at permanent residents of immature orangutan's home region",
        ],
        rows: [
          ['1', 'Suaq', 'female', '17', '0.59'],
          ['13', 'Tuanan', 'male', '27', '0.15'],
          ['15', 'Tuanan', 'male', '15', '0.00'],
          ['6', 'Tuanan', 'female', '6', '0.67'],
        ],
      },
      bodyStart: 'One way that young orangutans acquire foraging skills',
    },
  },
  'sat-cmp-2025-f6-int-01-module-2': {
    11: {
      table: {
        title: 'Electricity Capacity Trends (in megawatts) for Four Renewable Technologies in Indonesia (2017—2020)',
        headers: ['Energy', '2017', '2018', '2019', '2020'],
        rows: [
          ['Geothermal', '1,808', '1,948', '2,131', '2,131'],
          ['Renewable hydropower', '5,703', '5,773', '5,976', '6,141'],
          ['Solar', '97.4', '65.5', '155', '185.3'],
          ['Wind', '1.5', '143.5', '154.3', '154.3'],
        ],
      },
      bodyStart: 'Indonesia is trying to increase its electricity capacity',
    },
  },
  'sat-cmp-2025-f6-int-02-module-1': {
    11: {
      table: {
        title: 'Total Areas of Five Tribal Nations around the United States',
        headers: ['Tribal nation', 'Location', 'Area (square miles)'],
        rows: [
          ['White Mountain Apache Tribe', 'Arizona', '2,631'],
          ['Crow Tribe', 'Montana', '3,606'],
          ['Leech Lake Band of Ojibwe', 'Minnesota', '1,311'],
          ['Chickasaw Nation', 'Oklahoma', '7,648'],
          ['Cheyenne River Sioux Tribe', 'South Dakota', '4,419'],
        ],
      },
      bodyStart: 'A citizen of the Leech Lake Band of Ojibwe',
    },
  },
  'sat-cmp-2025-f6-int-02-module-2': {
    12: {
      table: {
        headers: [
          'Termite cape type the spiders looked at first',
          'Percentage of spider attacks on termites with solid black capes',
          'Percentage of spider attacks on termites with solid white capes',
          'Percentage of attacks on termites with black-and-white striped capes',
        ],
        rows: [
          ['solid black cape', '60%', '26%', '13%'],
          ['solid white cape', '14%', '86%', '0%'],
          ['black-and-white striped cape', '25%', '50%', '25%'],
        ],
      },
      bodyStart: 'Some animals evade predation with the help of contrasting markings',
    },
  },
  'sat-cmp-2025-f6-na-01-module-1': {
    9: {
      table: {
        title: 'Average Hours Worked per Person per Year in 1950 and 2017',
        headers: ['Country', '1950', '2017', 'Change in hours', 'Percent change in hours'],
        rows: [
          ['Peru', '2,157', '1,932', '-225', '-10%'],
          ['Canada', '2,209', '1,696', '-513', '-23%'],
          ['Denmark', '2,049', '1,400', '-649', '-32%'],
          ['Finland', '2,053', '1,659', '-394', '-19%'],
        ],
      },
      bodyStart: 'A student in an economics course',
    },
    10: {
      table: {
        title: 'Percent Change in Average Global Market Prices by Commodity in Two Agricultural Trade-Reform Scenarios',
        headers: ['Commodity', 'Percent change in TFA scenario', 'Percent change in tariff-removal scenario'],
        rows: [
          ['Fruits and vegetables', '-1.50', '+0.04'],
          ['Processed foods', '-1.76', '-1.00'],
          ['Rice', '-0.37', '+1.36'],
          ['Wheat', '-1.35', '+0.45'],
        ],
      },
      bodyStart: 'Ratified in 2017 by two-thirds of World Trade Organization',
    },
    11: {
      table: {
        title: 'Value, Cost, and Seigniorage of US Coins by Denomination, 2023',
        headers: [
          'Denomination',
          'Total value of units produced (in millions of dollars)',
          'Gross cost (in millions of dollars)',
          'Seigniorage (in millions of dollars)',
          'Seigniorage per $1 issued (dollars)',
        ],
        rows: [
          ['One-cent', '41.4', '127.4', '-86.0', '-2.08'],
          ['Five-cent', '70.8', '163.4', '-92.6', '-1.31'],
          ['Ten-cent', '266.6', '141.1', '125.5', '0.47'],
          ['Quarter-dollar', '568.4', '264.4', '304.0', '0.53'],
        ],
      },
      bodyStart: 'Issuing a one-dollar coin yields positive seigniorage',
    },
  },
  'sat-cmp-2025-f6-na-01-module-2': {
    14: {
      table: {
        title: 'Average Ratings of Perceived Personality Traits of Dogs and Human Willingness to Keep or Interact with Them',
        headers: [
          'Image ID number',
          'Irises',
          'Not friendly (0)–Friendly (5)',
          'Immature (0)–Mature (5)',
          'Would not keep (0)–Would keep (3)',
          'Would not interact with (0)–Would interact with (3)',
        ],
        rows: [
          ['24', 'light', '2.67', '4.03', '1.4', '1.7'],
          ['14', 'light', '2.11', '3.27', '1.55', '1.85'],
          ['8', 'dark', '3.52', '2.91', '1.9', '2.45'],
          ['3', 'dark', '3.88', '2.51', '2.35', '2.65'],
        ],
      },
      bodyStart: "Interested in how differences in the color of dogs' irises",
    },
  },
}

export function applyTableOverride(passage, override) {
  if (!override) return { passage, table: undefined }

  if (override.bodyStart === undefined) {
    return { passage: '', table: override.table }
  }

  const at = passage.indexOf(override.bodyStart)
  if (at < 0) {
    throw new Error(`table override bodyStart not found in passage: ${override.bodyStart}`)
  }

  let body = passage.slice(at).trim()
  if (override.bodyEnd !== undefined) {
    const stop = body.indexOf(override.bodyEnd)
    if (stop < 0) {
      throw new Error(`table override bodyEnd not found in passage: ${override.bodyEnd}`)
    }
    body = body.slice(0, stop).trim()
  }

  return { passage: body, table: override.table }
}
