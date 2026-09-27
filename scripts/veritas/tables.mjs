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
