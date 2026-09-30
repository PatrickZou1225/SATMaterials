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

  // ── 2025-08 (H8) ────────────────────────────────────────────────────────────
  'sat-cmp-2025-h8-int-01-module-1': {
    10: {
      table: {
        title: 'Cumulative Counts of Fish in Three Taiwanese Tide Pools, 1999-2018',
        headers: ['Species', 'Station 1', 'Station 2', 'Station 3'],
        rows: [
          ['barred flagtail', '249', '64', '16'],
          ['streaky rockskipper', '125', '139', '610'],
          ['blackpotted rockskipper', '83', '74', '31'],
          ['Cocos frillgoby', '50', '64', '90'],
        ],
      },
      bodyStart: 'Lin-Tai Ho and colleagues tracked fish populations',
    },
    11: {
      table: {
        title: 'Numbers of the 23 Non-native Tree Species Reported and the Insect and Fungus Threats to Them',
        headers: ['Country', 'Trees', 'Fungi', 'Insects'],
        rows: [
          ['Austria', '13', '51', '50'],
          ['Belgium', '4', '13', '11'],
          ['Bulgaria', '9', '14', '16'],
        ],
      },
      bodyStart: 'Elisabeth Pötzelsberger and colleagues gathered data',
    },
  },
  'sat-cmp-2025-h8-int-01-module-2': {
    10: {
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
    12: {
      table: {
        title: 'Observed Traits in a Population of Broadleaf Arrowhead, by Flowering Date',
        headers: ['Trait', 'Day 5', 'Day 10', 'Day 15', 'Day 20'],
        rows: [
          ['Total number of open male and female flowers per growth unit', '25', '65', '110', '45'],
          ['Estimated reproductive success rate of male flowers', '0.29', '0.29', '0.29', '0.29'],
          ['Proportion of male flowers', '0.45', '0.50', '0.48', '0.13'],
        ],
      },
      bodyStart: 'The mating environment hypothesis predicts',
    },
  },
  'sat-cmp-2025-h8-int-02-module-1': {
    8: {
      table: {
        title: 'Examples of Hoards found in Ireland and Northern Ireland',
        headers: ['Hoard name', 'Date of contents', 'Year of discovery', 'Description'],
        rows: [
          ['Carrick-on-Suir Hoard', '17th century CE', '2013', 'gold coins'],
          ['Ardagh Hoard', '10th century CE', '1868', 'silver and bronze pieces'],
          ['Balline Hoard', '4th century CE', '1940', 'silver pieces'],
        ],
      },
      bodyStart: 'Deposits of valuable objects, or hoards',
    },
  },
  'sat-cmp-2025-h8-int-02-module-2': {
    11: {
      table: {
        title: 'Examples of Hoards found in Ireland and Northern Ireland',
        headers: ['Hoard name', 'Date of contents', 'Year of discovery', 'Description'],
        rows: [
          ['Broighter Hoard', '1st century BCE', '1896', 'gold pieces'],
          ['Balline Hoard', '4th century CE', '1940', 'silver pieces'],
          ['Dooyork Hoard', '3rd century BCE-2nd century CE', '2001', 'gold, bronze, and beads'],
        ],
      },
      bodyStart: 'Deposits of valuable objects, or hoards',
    },
    12: {
      table: {
        title: 'Fiber Characteristics of Mouflon, Navajo-Churro, and Spanish Merino Sheep',
        headers: ['Type of sheep', 'Diameter of outer coat fibers (in microns)', 'Diameter of inner coat fibers (in microns)'],
        rows: [
          ['Spanish Merino', '19-24', '17-21'],
          ['Navajo-Churro', '35 or higher', '10-35'],
          ['Mouflon', '150', '15'],
        ],
      },
      bodyStart: "Domestic sheep's wild ancestor, the mouflon",
    },
  },
  'sat-cmp-2025-h8-na-01-module-1': {
    9: {
      table: {
        title: 'Cumulative Counts of Fish in Three Taiwanese Tide Pools, 1999-2018',
        headers: ['Species', 'Station 1', 'Station 2', 'Station 3'],
        rows: [
          ['spotted frillgoby', '40', '42', '9'],
          ['blackspot sergeant', '338', '261', '136'],
          ['cheekscaled frillgoby', '38', '45', '36'],
          ['triplefin blenny', '149', '65', '78'],
        ],
      },
      bodyStart: 'Lin-Tai Ho and colleagues tracked fish populations',
    },
    12: {
      table: {
        title: 'Myoglobin (Mb) Levels in the Cardiac Tissue of Three Teleost Species',
        headers: [
          'Species',
          'Heart tissue color',
          'Average Mb level',
          'Standard deviation of Mb level',
          'Number of healthy fish observed',
        ],
        rows: [
          ['Anguilla anguilla', 'red', '33.30', '11.39', '3'],
          ['Bunocephalus coracoideus', 'red', '18.02', '0.59', '3'],
          ['Pantodon buchholzi', 'white', '0.02', '0.01', '4'],
        ],
      },
      bodyStart: 'Myoglobin (Mb) is a protein that primarily aids',
    },
  },
  'sat-cmp-2025-h8-na-02-module-2': {
    10: {
      table: {
        title: 'Highest-Grossing Films in a Language Other than English at US Box Office',
        headers: [
          'Title',
          'Lifetime gross earnings',
          'Opening weekend box office gross earnings',
          'US release date',
          'Director',
          'Oscar nominated?',
        ],
        rows: [
          ['Eat Drink Man Woman', '$7,294,403', '$155,512', 'August 3, 1994', 'Ang Lee', 'Yes'],
          [
            "Huevos: Little Rooster's Egg-cellent Adventure",
            '$9,080,818',
            '$3,424,702',
            'September 4, 2015',
            'Gabriel Riva Palacio Alatriste and Rodolfo Riva Palacio Alatriste',
            'No',
          ],
          ['Instructions Not Included', '$44,467,206', '$7,846,426', 'August 30, 2013', 'Eugenio Derbez', 'No'],
          ['Crouching Tiger, Hidden Dragon', '$128,078,872', '$663,205', 'December 8, 2000', 'Ang Lee', 'Yes'],
        ],
      },
      bodyStart: 'Few of the most commercially successful films in US movie theaters',
    },
  },

  // ── 2025-09 (I9) ────────────────────────────────────────────────────────────
  'sat-cmp-2025-i9-int-01-module-1': {
    11: {
      table: {
        title: 'Average Hours Worked per Person per Year in 1950 and 2017',
        headers: ['Country', '1950', '2017', 'Change in hours', 'Percent change in hours'],
        rows: [
          ['United Kingdom', '2,184', '1,670', '-514', '-24%'],
          ['Australia', '2,178', '1,731', '-447', '-21%'],
          ['Germany', '2,427', '1,354', '-1,074', '-44%'],
          ['Mexico', '2,432', '2,255', '-177', '-7%'],
        ],
      },
      bodyStart: 'A student in an economics course',
    },
    12: {
      table: {
        title: 'Impact of Three Key Industries on Oklahoma Economy in 2017',
        headers: [
          'Industry',
          'Approximate total contribution by industry',
          'Number of people employed by industry',
          'Average contribution per employee by industry',
        ],
        rows: [
          ['Construction', '$6,797,300,000', '77,247', '$87,994'],
          ['Professional services', '$7,694,000,000', '69,846', '$110,157'],
          ['Tribal economic activity', '$7,312,400,000', '51,674', '$141,510'],
        ],
      },
      bodyStart: 'The nearly forty tribes located in Oklahoma',
    },
  },
  'sat-cmp-2025-i9-int-02-module-2': {
    8: {
      table: {
        title: 'Broken-Wing Display in Various Bird Species',
        headers: ['Species name', 'Common name', 'Order', 'Performs broken-wing display?'],
        rows: [
          ['Gallinago paraguaiae', 'South American snipe', 'Charadriiformes', 'No'],
          ['Grus canadensis', 'sandhill crane', 'Gruiforms', 'Yes'],
          ['Zenaida meloda', 'West Peruvian dove', 'Columbiformes', 'No'],
          ['Actitis hypoleucos', 'common sandpiper', 'Charadriiforms', 'Yes'],
          ['Coccyzus americanus', 'yellow-billed cuckoo', 'Cuculiformes', 'Yes'],
        ],
      },
      bodyStart: 'While observing birds for a biology class',
    },
    9: {
      table: {
        title: 'Organic Compounds Detected in Sequential Extracts from A0106',
        headers: ['Solvent (sequence #)', 'Alkanes', 'Dimethyl sulfides', 'Naphthalene'],
        rows: [
          ['Hexane (1)', 'present', 'absent', 'absent'],
          ['Dichloromethane only (2)', 'present', 'absent', 'present'],
          ['Methanol only (3)', 'absent', 'present', 'present'],
          ['Dichloromethane and methanol (4)', 'present', 'absent', 'present'],
        ],
      },
      bodyStart: 'After sample A0106 was retrieved from the asteroid Ryugu',
    },
  },
  'sat-cmp-2025-i9-na-01-module-1': {
    11: {
      table: {
        title: 'Examples of Hoards found in Ireland and Northern Ireland',
        headers: ['Hoard name', 'Date of contents', 'Year of discovery', 'Description'],
        rows: [
          ['Broighter Hoard', '1st century BCE', '1896', 'gold pieces'],
          ['Balline Hoard', '4th century CE', '1940', 'silver pieces'],
          ['Dooyork Hoard', '3rd century BCE–2nd century CE', '2001', 'gold, bronze, and beads'],
        ],
      },
      bodyStart: 'Deposits of valuable objects, or hoards',
    },
  },
  'sat-cmp-2025-i9-na-01-module-2': {
    9: {
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
          ['Linda L. Sweanor et al.', 'New Mexico (United States)', 'radio-collar tracking', '2,059', '2.00'],
          ['Gregory A. Davidson et al.', 'Oregon (United States)', 'scat-detecting dogs', '1,225', '5.50'],
          ['A.J. Noss et al.', 'Bolivia', 'regular camera trapping', '215', '7.99'],
          ['David M. Choate et al.', 'Utah (United States)', 'helicopter surveying', '1,300', '10.24'],
        ],
      },
      bodyStart: 'Studies of the population density of cougars',
    },
  },
  'sat-cmp-2025-i9-na-02-module-1': {
    12: {
      table: {
        title: 'Numbers of the 23 Non-native Tree Species Reported and the Insect and Fungus Threats to Them',
        headers: ['Country', 'Trees', 'Fungi', 'Insects'],
        rows: [
          ['Great Britain', '18', '290', '120'],
          ['Belgium', '4', '13', '11'],
          ['Poland', '10', '25', '105'],
        ],
      },
      bodyStart: 'Elisabeth Pötzelsberger and colleagues gathered data',
    },
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
          ['6', 'dark', '4.03', '2.95', '1.85', '2.15'],
          ['3', 'dark', '3.88', '2.51', '2.35', '2.65'],
        ],
      },
      bodyStart: 'Studies have found that when looking at other people',
    },
  },
  'sat-cmp-2025-i9-na-02-module-2': {
    9: {
      table: {
        title: 'Broken-Wing Display in Various Bird Species',
        headers: ['Species name', 'Common name', 'Order', 'Performs broken-wing display?'],
        rows: [
          ['Coccyzus americanus', 'yellow-billed cuckoo', 'Cuculiformes', 'Yes'],
          ['Actitis hypoleucos', 'common sandpiper', 'Charadriiformes', 'Yes'],
          ['Cinclosoma ajax', 'painted quail-thrush', 'Passeriformes', 'No'],
          ['Calidris maritima', 'purple sandpiper', 'Charadriiformes', 'No'],
          ['Dendroica pinus', 'pine warbler', 'Passeriformes', 'Yes'],
        ],
      },
      bodyStart: 'While observing birds for a biology class',
    },
  },

  // ── 2025-10 (J10) ───────────────────────────────────────────────────────────
  'sat-cmp-2025-j10-int-01-module-1': {
    11: {
      table: {
        title: 'Bird Species by Average Mass',
        headers: ['Common name', 'Average mass (kg)', 'Capable of flight?'],
        rows: [
          ['Lesser rhea', '19.6', 'No'],
          ['Dalmatian pelican', '11.5', 'Yes'],
          ['Andean condor', '11.3', 'Yes'],
          ['Northern cassowary', '44.0', 'No'],
        ],
      },
      bodyStart: 'Most bird species that are capable of flight weigh less than a kilogram',
    },
  },
  'sat-cmp-2025-j10-int-01-module-2': {
    8: {
      table: {
        title: "Orbital Period in Earth Days of Three of Jupiter's Moons",
        headers: ['Moon', 'Orbital period (days)'],
        rows: [
          ['Europa', '3.6'],
          ['Leda', '240.9'],
          ['Arche', '723.9'],
        ],
      },
      bodyStart: 'The orbital period of a moon is the time it takes',
    },
    9: {
      table: {
        title: 'Years That RSRs Were Implemented in Four US States',
        headers: ['Year', 'State'],
        rows: [
          ['2002', 'Wisconsin'],
          ['2003', 'Virginia'],
          ['2006', 'New Jersey'],
          ['2009', 'Washington'],
        ],
      },
      bodyStart: 'Regulations called RSRs prevent insurance companies',
    },
    10: {
      table: {
        title: 'Reported Annual Travel Distances in Four Studies of Migrating Animal Populations',
        headers: ['Species', 'Continent', 'Distance (km)', 'Measurement method'],
        rows: [
          ['Mule deer', 'North America', '772', 'RTD'],
          ['Caribou', 'North America', '3,807', 'GPS'],
          ['Gray wolf', 'North America', '2,155', 'GPS'],
          ['White-eared kob', 'Africa', '400', 'RTD'],
        ],
      },
      bodyStart: 'Some studies of migrating animals measure',
    },
    11: {
      table: {
        title: 'Millions of Metric Tons of Copper Mined in 1995 and 2020',
        headers: ['Country', '1995', '2020'],
        rows: [
          ['Poland', '0.38', '0.39'],
          ['Kazakhstan', '0.26', '0.55'],
          ['Chile', '2.49', '5.73'],
          ['United States', '1.85', '1.20'],
        ],
      },
      bodyStart: 'A student is researching copper mining',
    },
  },
  'sat-cmp-2025-j10-int-01-module-3': {
    8: {
      table: {
        title: 'Examples of Hoards found in Ireland and Northern Ireland',
        headers: ['Hoard name', 'Date of contents', 'Year of discovery', 'Description'],
        rows: [
          ['Carrick-on-Suir Hoard', '17th century CE', '2013', 'gold coins'],
          ['Ardagh Hoard', '10th century CE', '1868', 'silver and bronze pieces'],
          ['Balline Hoard', '4th century CE', '1940', 'silver pieces'],
        ],
      },
      bodyStart: 'Deposits of valuable objects, called hoards',
    },
    9: {
      table: {
        title: 'Impact of Four Key Industries on Oklahoma Economy in 2017',
        headers: [
          'Industry',
          'Approximate total contribution by industry',
          'Number of people employed by industry',
          'Average contribution per employee by industry',
        ],
        rows: [
          ['Retail', '$10,738,800,000', '179,208', '$59,924'],
          ['Tribal economic activity', '$7,312,400,000', '51,674', '$141,510'],
          ['Health care', '$13,727,300,000', '193,514', '$70,937'],
          ['Accommodation/food services', '$5,242,100,000', '150,373', '$34,861'],
        ],
      },
      bodyStart: 'The nearly forty tribes located in Oklahoma',
    },
    10: {
      table: {
        title: 'Average Ratings of Perceived Personality Traits of Dogs and Human Willingness to Keep or Interact with Them',
        headers: [
          'Image ID number',
          'Irises',
          'Not friendly (0)-Friendly (5)',
          'Immature (0)-Mature (5)',
          'Would not keep (0)-Would keep (3)',
          'Would not interact with (0)-Would interact with (3)',
        ],
        rows: [
          ['20', 'light', '2.08', '4.06', '1.5', '1.75'],
          ['16', 'light', '1.61', '3.64', '1.3', '1.6'],
          ['11', 'dark', '3.18', '2.94', '1.85', '2.05'],
          ['3', 'dark', '3.88', '2.51', '2.35', '2.65'],
        ],
      },
      bodyStart: 'Studies have found that when looking at other people',
    },
  },
  'sat-cmp-2025-j10-int-02-module-1': {
    13: {
      table: {
        title: 'Mean Body Mass of Birds Known to Perform Broken-Wing Display',
        headers: ['Bird', 'Mean body mass (grams)'],
        rows: [
          ['ruddy turnstone', '137'],
          ['swamp palm bulbul', '61'],
          ['blue-winged teal', '398'],
        ],
      },
      bodyStart: 'One antipredator defense that the masked lapwing uses',
    },
  },
  'sat-cmp-2025-j10-int-02-module-2': {
    8: {
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
          ['Randy D. Johnson', 'North Dakota (United States)', 'radio-collar tracking', '6,467', '2.78'],
          ['Gregory A. Davidson et al.', 'Oregon (United States)', 'scat-detecting dogs', '1,225', '5.50'],
          ['Juan I. Zanón-Martinez et al.', 'Argentina', 'regular camera trapping', '1,179', '4.90'],
          ['David M. Choate et al.', 'Utah (United States)', 'helicopter surveying', '1,300', '10.24'],
        ],
      },
      bodyStart: 'Studies of the population density of cougars',
    },
    10: {
      table: {
        title: 'Projected Percent Change in Agricultural Production and Market Price under Tariff-Elimination Scenario',
        headers: ['Country', 'Percent change in total production', 'Percent change in market prices'],
        rows: [
          ['Argentina', '+0.90', '+1.02'],
          ['India', '-1.34', '-1.98'],
          ['Russia', '-3.48', '-0.99'],
          ['United States', '+1.76', '+0.44'],
        ],
      },
      bodyStart: 'A tariff is a tax on imported goods',
    },
    13: {
      table: {
        title: 'Reported Annual Travel Distances in Four Studies of Migrating Animal Populations',
        headers: ['Species', 'Continent', 'Distance (km)', 'Measurement method'],
        rows: [
          ['Mule deer', 'North America', '772', 'RTD'],
          ['Caribou', 'North America', '3,807', 'GPS'],
          ['Gray wolf', 'North America', '2,155', 'GPS'],
          ['White-eared kob', 'Africa', '400', 'RTD'],
        ],
      },
      bodyStart: 'Some studies of migrating animals measure',
    },
  },
  'sat-cmp-2025-j10-na-01-module-1': {
    12: {
      table: {
        title: 'Average Hours Worked per Person per Year in 1950 and 2017',
        headers: ['Country', '1950', '2017', 'Change in hours', 'Percent change in hours'],
        rows: [
          ['Brazil', '2,042', '1,709', '-333', '-16%'],
          ['Japan', '2,030', '1,738', '-292', '-14%'],
          ['Switzerland', '2,040', '1,590', '-450', '-22%'],
          ['Germany', '2,427', '1,354', '-1,074', '-44%'],
        ],
      },
      bodyStart: 'A student in an economics course',
    },
  },
  'sat-cmp-2025-j10-na-01-module-2': {
    10: {
      table: {
        title: 'Brown Bears in Katmai National Park, Alaska',
        headers: ['Bear identification number', 'Sex', 'Age (years)', 'Approximate weight (pounds)'],
        rows: [
          ['122', 'male', '3', '200'],
          ['117', 'female', '6', '325'],
          ['157', 'male', '7', '450'],
          ['123', 'female', '11', '350'],
        ],
      },
      bodyStart: 'Scientists collected information about brown bears',
    },
    11: {
      table: {
        title: 'Year That Foreign Investors Were First Allowed to Purchase Shares',
        headers: ['Country', 'Year'],
        rows: [
          ['India', '1986'],
          ['Morocco', '1988'],
          ['Indonesia', '1989'],
        ],
      },
      bodyStart: 'In the 1980s and 1990s, many countries began allowing foreign investors',
    },
  },

  // ── 2025-11 (K11) ───────────────────────────────────────────────────────────
  'sat-cmp-2025-k11-int-01-module-1': {
    10: {
      table: {
        title: 'Home Console and Computer Games of the 1980s',
        headers: ['Title', 'Approximate number of units sold worldwide', 'Genre', 'Developer'],
        rows: [
          ['Super Mario Brothers 2', '7,460,000', 'platformer', 'Nintendo EAD'],
          ['Ice Hockey', '2,420,000', 'sports', 'Nintendo R&D2'],
          ['Where in the World Is Carmen Sandiego?', '4,000,000', 'education', 'Broderbund'],
          ['Tetris', '43,000,000', 'puzzle', 'Nintendo R&D1'],
        ],
      },
      bodyStart: 'A student is writing a paper on the global rise of the home video game industry',
    },
    12: {
      table: {
        title: 'Effect of Various Soil Treatments on Mean Pineapple Fruit Weight and Size',
        headers: ['Soil treatment', 'Weight (grams)', 'Length (centimeters)', 'Diameter (centimeters)'],
        rows: [
          ['Control', '825.9', '6.14', '13.63'],
          ['Biochar', '915.7', '6.56', '13.63'],
          ['Compost', '864.8', '6.15', '13.22'],
          ['Biochar and compost', '979.3', '6.76', '13.68'],
          ['Biochar and NPK fertilizer', '1032.1', '6.78', '13.96'],
        ],
      },
      bodyStart: 'Working in Ghana, Emmanuel Hanyabui and colleagues',
    },
  },
  'sat-cmp-2025-k11-int-01-module-2': {
    14: {
      table: {
        title: 'Highest Major Summits in India',
        headers: ['Summit', 'Elevation (meters)', 'Mountain range', 'Prominence (meters)'],
        rows: [
          ['Kangto', '7,060', 'Assam Himalaya', '2,195'],
          ['Saser Kangri III', '7,495', 'Saser Karakoram', '850'],
          ['Langpo', '6,965', 'Sikkim Himalaya', '560'],
          ['Sri Kailash', '6,932', 'Garhwal Himalaya', '1,092'],
          ['Mount Lakshmi', '6,983', 'Rimo Karakoram', '800'],
        ],
      },
      bodyStart: 'Mountain summits are often described',
    },
  },
  'sat-cmp-2025-k11-int-02-module-1': {
    10: {
      table: {
        title: 'Millions of Metric Tons of Copper Mined in 1995 and 2020',
        headers: ['Country', '1995', '2020'],
        rows: [
          ['Indonesia', '0.44', '0.51'],
          ['Mexico', '0.33', '0.73'],
          ['Peru', '0.38', '2.15'],
          ['United States', '1.85', '1.20'],
        ],
      },
      bodyStart: 'While doing research for a paper about metal exports',
    },
  },
  'sat-cmp-2025-k11-int-02-module-2': {
    9: {
      table: {
        title: 'Effect of Various Soil Treatments on Mean Pineapple Fruit Weight and Size',
        headers: ['Soil treatment', 'Weight (grams)', 'Length (centimeters)', 'Diameter (centimeters)'],
        rows: [
          ['Control', '825.9', '6.14', '13.63'],
          ['Biochar', '915.7', '6.56', '13.63'],
          ['Compost', '864.8', '6.15', '13.22'],
          ['Biochar and compost', '979.3', '6.76', '13.68'],
          ['Biochar and NPK fertilizer', '1032.1', '6.78', '13.96'],
        ],
      },
      bodyStart: 'Working in Ghana, Emmanuel Hanyabui and colleagues',
    },
    10: {
      table: {
        title: "Percentages of New Year's Resolution Makers Who Make Certain Kinds of Resolutions",
        headers: ['Type of resolution', 'Age 18-29', 'Age 30-49', 'Age 50-64', 'Age 65+'],
        rows: [
          ['Health and exercise', '79', '80', '79', '76'],
          ['Finances', '68', '63', '56', '47'],
          ['Personal relationships', '63', '53', '58', '52'],
          ['Hobbies', '65', '53', '51', '45'],
        ],
      },
      bodyStart: 'A Pew Research Center survey conducted in January 2024',
    },
  },
  'sat-cmp-2025-k11-int-03-module-1': {
    11: {
      table: {
        title: 'Members of the Girl Scouts of America, by Age Category, 1992–1995 (in thousands)',
        headers: ['Category', '1992', '1993', '1994', '1995'],
        rows: [
          ['Ambassadors (older than 17)', '863', '826', '802', '784'],
          ['Seniors (14–17 years)', '50', '43', '45', '52'],
          ['Daisies (5–6 years)', '207', '191', '190', '195'],
          ['Brownies (6–8 years)', '1,319', '1,225', '1,181', '1,142'],
        ],
      },
      bodyStart: 'The Girl Scouts of America is an organization famous',
    },
  },
  'sat-cmp-2025-k11-int-03-module-2': {
    9: {
      table: {
        title: 'Ranking of Environmental and Sociocultural Benefits of Urban Agriculture (scale of 1 to 25; 1 = highest)',
        headers: ['Social or ecological service', 'Project leaders', 'Stakeholders', 'General public'],
        rows: [
          ['improvement of social cohesion', '17', '10', '9'],
          ['prevention of soil erosion', '13', '11', '23'],
          ['conservation of genetic variability', '5', '18', '16'],
          ['improvement of urban aesthetics and art inspiration', '8', '4', '6'],
          ['enhancement of pollination', '1', '7', '12'],
        ],
      },
      bodyStart: 'Esther Sanyé-Mengual',
    },
    10: {
      table: {
        title: "Percentages of New Year's Resolution Makers Who Make Certain Kinds of Resolutions",
        headers: ['Type of resolution', 'Age 18-29', 'Age 30-49', 'Age 50-64', 'Age 65+'],
        rows: [
          ['Health and exercise', '79', '80', '79', '76'],
          ['Finances', '68', '63', '56', '47'],
          ['Personal relationships', '63', '53', '58', '52'],
          ['Hobbies', '65', '53', '51', '45'],
        ],
      },
      bodyStart: 'A Pew Research Center survey conducted in January 2024',
    },
  },
  'sat-cmp-2025-k11-na-01-module-1': {
    10: {
      table: {
        title: 'Effect of Various Soil Treatments on Mean Pineapple Fruit Weight and Size',
        headers: ['Soil treatment', 'Weight (grams)', 'Length (centimeters)', 'Diameter (centimeters)'],
        rows: [
          ['Control', '825.9', '6.14', '13.63'],
          ['Biochar', '915.7', '6.56', '13.63'],
          ['Compost', '864.8', '6.15', '13.22'],
          ['Biochar and compost', '979.3', '6.76', '13.68'],
          ['Biochar and NPK fertilizer', '1032.1', '6.78', '13.96'],
        ],
      },
      bodyStart: 'Working in Ghana, Emmanuel Hanyabui and colleagues',
    },
  },

  // ── 2025-12 (L12) ───────────────────────────────────────────────────────────
  'sat-cmp-2025-l12-int-01-module-1': {
    13: {
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
  },
  'sat-cmp-2025-l12-int-01-module-3': {
    10: {
      table: {
        title: 'Examples of Hoards Found in Ireland and Northern Ireland',
        headers: ['Hoard name', 'Date of contents', 'Year of discovery', 'Description'],
        rows: [
          ['Coggalbeg Hoard', '24th-19th century BCE', '1945', 'gold pieces'],
          ['Balline Hoard', '4th century CE', '1940', 'silver pieces'],
          ['Ardagh Hoard', '10th century CE', '1868', 'silver and bronze pieces'],
        ],
      },
      bodyStart: 'An anthropologist is recording the metal contents',
    },
  },
  'sat-cmp-2025-l12-int-02-module-1': {
    11: {
      table: {
        title: 'Minimum and Maximum Depths of Stony Coral Species in Caribbean and Indo-Pacific Waters',
        headers: ['Species', 'Location', 'Minimum depth (meters)', 'Maximum depth (meters)'],
        rows: [
          ['Agaricia grahamae', 'Caribbean', '20', '115'],
          ['Acropora bushyensis', 'Indo-Pacific', '0', '5'],
          ['Mussa angulosa', 'Caribbean', '5', '30'],
          ['Indophyllia macassarensis', 'Indo-Pacific', '20', '25'],
        ],
      },
      bodyStart: 'A marine biologist is researching four stony coral species',
    },
    12: {
      table: {
        title: 'Myoglobin (Mb) Levels in the Cardiac Tissue of Three Teleost Species',
        headers: [
          'Species',
          'Heart tissue color',
          'Average Mb level',
          'Standard deviation of Mb level',
          'Number of healthy fish observed',
        ],
        rows: [
          ['Anguilla anguilla', 'red', '33.30', '11.39', '3'],
          ['Bunocephalus coracoideus', 'red', '18.02', '0.59', '3'],
          ['Pantodon buchholzi', 'white', '0.02', '0.01', '4'],
        ],
      },
      bodyStart: 'Myoglobin (Mb) is a protein that primarily aids',
    },
  },
  'sat-cmp-2025-l12-int-02-module-2': {
    10: {
      table: {
        title: 'Bird Species by Average Mass',
        headers: ['Common name', 'Average mass (kg)', 'Capable of flight?'],
        rows: [
          ['Great bustard', '10.6', 'Yes'],
          ['Trumpeter swan', '12.7', 'Yes'],
          ['Emperor penguin', '31.5', 'No'],
          ['Common ostrich', '104.0', 'No'],
        ],
      },
      bodyStart: 'Most bird species that are capable of flight weigh less than a kilogram',
    },
    12: {
      table: {
        title: 'Monthly Temperatures and Wing Centroid Sizes of Fruit Fly Specimens',
        headers: [
          'Month',
          'Average high (°F)',
          'Average low (°F)',
          'Average male wing centroid size (mm)',
          'Average female wing centroid size (mm)',
        ],
        rows: [
          ['June', '80', '56', '2.01', '2.31'],
          ['July', '87', '62', '2.02', '2.31'],
          ['October', '67', '44', '1.98', '2.29'],
          ['May', '73', '50', '1.98', '2.27'],
        ],
      },
      bodyStart: 'Drosophila (fruit flies) have generation times',
    },
  },
  'sat-cmp-2025-l12-na-01-module-1': {
    12: {
      table: {
        title: 'Four European High-Speed Rail Hubs',
        headers: ['Hub', 'Country', 'Hub type'],
        rows: [
          ['København H', 'Denmark', 'existing hub (urban)'],
          ['Lille Europe', 'France', 'peripheral replacement (urban periphery)'],
          ['Reggio Emilia AV Mediopadana', 'Italy', 'distributed services (urban periphery)'],
          ['Stuttgart Hbf', 'Germany', 'existing hub (urban)'],
        ],
      },
      bodyStart: 'Installing a new high-speed rail (HSR) hub in an area',
    },
  },
  'sat-cmp-2025-l12-na-01-module-2': {
    10: {
      table: {
        title: 'Sewing Technology Found at Pleistocene Sites, by Latitude',
        headers: ['Site', 'Region', 'Technology', 'Years before present(BP)', 'Latitude (°N)'],
        rows: [
          ['Khayrgas Cave', 'Siberia', 'eyed needles', '25,000', '60'],
          ['Malaya Syia', 'Europe', 'awls', '36,000', '54'],
          ['Stajnia Cave', 'Europe', 'awls', '42,000', '37'],
          ['Shizitan', 'East Asia', 'eyed needles', '26,000-23,000', '36'],
          ['Yafteh Cave', 'Southwest Asia', 'awls', '40,000', '33'],
        ],
      },
      bodyStart: 'During the Pleistocene, people began using sharpened bone awls',
    },
  },

  // ── 2026-09 (I9) ────────────────────────────────────────────────────────────
  'sat-cmp-2026-i9-int-02-module-1': {
    11: {
      table: {
        title: "Emoji Users' Agreement with Statements About Emoji Use at Work",
        headers: ['Statement', 'Agreement (% of users)'],
        rows: [
          ['boosts creativity', '58'],
          ['improves efficiency of team decision-making', '62'],
          ['improves sense of connection with others', '63'],
          ['makes new tasks seem more appealing', '79'],
        ],
      },
      bodyStart: 'Emojis are small images',
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
