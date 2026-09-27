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

  return { passage: passage.slice(at).trim(), table: override.table }
}
