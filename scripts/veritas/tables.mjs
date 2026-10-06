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
  // ── 2023-03 (C3) ────────────────────────────────────────────────────────────
  'sat-cmp-2023-c3-int-01-module-1': {
    8: {
      table: {
        title: 'Studies of the Effects of Tilling vs. No Tilling on Crop Yields',
        headers: ['Authors', 'Crop', 'Crop yield with tilling (kilograms per hectare)', 'Crop yield with no tilling (kilograms per hectare)'],
        rows: [
          ['Bharat Sharma Achayara and colleagues', 'soybeans', '3,062', '2,670'],
          ['Adrian Gracia-Romero and colleagues', 'maize', '2,420', '2,990'],
          ['Daniel Jug and colleagues', 'winter wheat', '4,860', '3,910'],
          ['Min Huang and colleagues', 'rice', '2,534', '5,226'],
        ],
      },
      bodyStart: 'Danijel Jug and colleagues found that tilling',
    },
    9: {
      table: {
        title: 'Population and Area Data for Four Cities in 2018',
        headers: ['City', 'Country', 'UN estimate', 'Reported city proper', 'Reported metropolitan', 'Metropolitan area (square kilometers)'],
        rows: [
          ['Bangkok', 'Thailand', '10,156,000', '5,782,000', '16,255,990', '7,762'],
          ['Toronto', 'Canada', '6,082,000', '2,731,571', '5,928,040', '5,906'],
          ['Huston', 'United States', '6,115,000', '2,325,502', '6,997,384', '21,395'],
          ['Bogota', 'Colombia', '10,574,000', '7,963,000', '12,545,272', '5,934'],
        ],
      },
      bodyStart: 'Population figures for a city can vary significantly',
    },
  },
  'sat-cmp-2023-c3-int-01-module-2': {
    13: {
      table: {
        title: 'Pyramids in Egypt and the Americas',
        headers: ['Pyramid', 'Country', 'Height (meters)', 'Age (years before present)'],
        rows: [
          ['The Pyramid of Khafre', 'Egypt', '143.5', '4,500 to 4,600'],
          ['La Danta', 'Guatemala', '72', '1,900 to 2,300'],
          ['The Tikal Temple IV', 'Guatemala', '70', '1,300'],
          ['The Pyramid of Amenemhet I', 'Egypt', '55', '3,800 to 4,000'],
        ],
      },
      bodyStart: 'One student is writing an essay about four pyramids',
    },
  },

  // ── 2023-05 (E5) ────────────────────────────────────────────────────────────
  'sat-cmp-2023-e5-int-01-module-1': {
    8: {
      table: {
        title: 'Contributions of Three Key Industries to Oklahoma Economy in 2017',
        headers: ['Industry', 'Approximate contribution'],
        rows: [
          ['Real estate', '$18,314,700,000'],
          ['Tribal economic activity', '$7,312,400,000'],
          ['Administration / waste', '$5,830,600,000'],
        ],
      },
      bodyStart: 'The Cherokee Nation, the Seminole Nation, and the more than thirty',
    },
  },
  'sat-cmp-2023-e5-int-01-module-2': {
    5: {
      table: {
        title: 'Ranking of Environmental and Sociocultural Benefits of Urban Agriculture (scale of 1 to 25; 1 = highest)',
        headers: ['Social or ecological service', 'Project leaders', 'Stakeholders', 'General public'],
        rows: [
          ['improvement of attitudes and outlooks', '8', '1', '4'],
          ['provision of food', '4', '15', '8'],
          ['provision of raw materials', '22', '25', '15'],
          ['improvement of physical health', '5', '4', '7'],
          ['enhancement of pollination', '1', '7', '12'],
        ],
      },
      bodyStart: 'Esther Sanye-Mengual, Kathrin Specht, and their team surveyed',
    },
    6: {
      table: {
        title: 'Minimum and Maximum Depths of Stony Coral Species in Caribbean and Indo-Pacific Waters',
        headers: ['Species', 'Minimum depth (meters)', 'Maximum depth (meters)'],
        rows: [
          ['Plerogyra discus', '8', '15'],
          ['Acropora echinata', '8', '25'],
          ['Psammocora albopicta', '1', '28'],
          ['Agaricia undata', '20', '80'],
        ],
      },
      bodyStart: 'Some scientists have suggested that as ocean temperatures rise',
    },
  },

  // ── 2023-06 (F6) ────────────────────────────────────────────────────────────
  'sat-cmp-2023-f6-int-01-module-2': {
    10: {
      table: {
        title: 'Minimum and Maximum Depths of Stony Coral Species in Caribbean and Indo-Pacific Waters',
        headers: ['Species', 'Minimum depth (meters)', 'Maximum depth (meters)', 'Range (meters)'],
        rows: [
          ['Acropora anthocercis', '5', '10', '5'],
          ['Cyphastrea hexasepta', '8', '25', '17'],
          ['Agaricia fragilis', '10', '102', '92'],
          ['Heliofungia fralinae', '3', '27', '24'],
        ],
      },
      bodyStart: 'The table is from a 2018 study',
    },
    12: {
      table: {
        title: 'US Hydroelectric Power Plants, 2019',
        headers: ['Plant', 'State', 'Mode', 'Average power generation (MWh/yr)', 'Water source'],
        rows: [
          ['Scanion', 'Minnesota', 'run-of-river', '7511', 'St. Louis River'],
          ['Kansas River', 'Kansas', 'run-of-river', '15345', 'Kansas River'],
          ['Squa Pan Hydro Station', 'Maine', 'peaking', '881', 'Squa Pan Stream'],
          ['Great Falls', 'Tennessee', 'peaking', '124392', 'Caney Fork River'],
        ],
      },
      bodyStart: 'A run-of-river hydroelectric power plant',
    },
  },
  'sat-cmp-2023-f6-int-02-module-1': {
    11: {
      table: {
        title: 'Impact of Four Key Industries on Oklahoma Economy in 2017',
        headers: ['Industry', 'Approximate total contribution by industry', 'Number of people employed by industry', 'Average contribution per employee by industry'],
        rows: [
          ['Professional services', '$7,694,000,000', '69,846', '$110,157'],
          ['Tribal economic activity', '$7,312,400,000', '51,674', '$141,510'],
          ['Administration / waste', '$5,830,600,000', '96,964', '$60,132'],
          ['Wholesale trade', '$10,723,400,000', '58,346', '$183,790'],
        ],
      },
      bodyStart: 'The Cherokee Nation, the Seminole Nation, and the more than thirty',
    },
  },
  'sat-cmp-2023-f6-int-02-module-2': {
    10: {
      table: {
        title: 'US Hydroelectric Power Plant, 2019',
        headers: ['Plant', 'State', 'Mode', 'Generators in plant', 'Average power generation (MWh/yr)', 'Water source'],
        rows: [
          ['Kaw Hydro', 'Oklahoma', 'run-of-river', '1', '103,163', 'Arkansas River'],
          ['Kankakee Hydro Facility', 'Illinois', 'run-of-river', '3', '1,832', 'Kankakee River'],
          ['Richard B. Russell', 'Georgia', 'peaking', '8', '394,195', 'Savannah River'],
          ['Gaston Shoals', 'South Carolina', 'peaking', '4', '14,059', 'Broad River'],
        ],
      },
      bodyStart: 'A run-of-river hydroelectric power plant',
    },
    11: {
      table: {
        title: 'Days per Winter That Lakes Have Surface Ice',
        headers: ['Lake', 'Latitude (degrees)', '1980-81', '1985-86', '1990-91', '1995-96', '2000-01', '2005-06'],
        rows: [
          ['Kalmarinjärvi', '62.79', '198', '172', '175', '184', '131', '152'],
          ['Lake Neusiedl', '47.82', '77', '86', '87', '128', '50', '104'],
          ['Mirror Lake', '43.94', '122', '129', '125', '136', '141', '119'],
        ],
      },
      bodyStart: 'It is common for freshwater lakes near or above a latitude of 45',
    },
  },

  // ── 2023-08 (H8) ────────────────────────────────────────────────────────────
  'sat-cmp-2023-h8-int-01-module-1': {
    12: {
      table: {
        title: 'Numbers of the 23 Non-native Tree Species Reported and the Insect and Fungus Threats to Them',
        headers: ['Country', 'Trees', 'Fungi', 'Insects'],
        rows: [
          ['Belgium', '4', '13', '11'],
          ['Italy', '14', '57', '42'],
          ['Denmark', '12', '22', '33'],
        ],
      },
      bodyStart: 'Elisabeth Pötzelsberger and colleagues gathered data',
    },
  },
  'sat-cmp-2023-h8-int-01-module-2': {
    11: {
      table: {
        title: 'US Hydroelectric Power Plants, 2019',
        headers: ['Plant', 'State', 'Mode', 'Generators in plant', 'Average power generation (MWh/yr)', 'Water source'],
        rows: [
          ['Spearfish', 'South Dakota', 'run-of-river', '2', '2,204', 'Spearfish Creek'],
          ['Gaston Shoals', 'South Carolina', 'peaking', '4', '14,059', 'Broad River'],
          ['J. Woodruff', 'Florida', 'peaking', '3', '193,864', 'Lake Seminole Reservoir'],
          ['Oneida', 'Idaho', 'run-of-river', '3', '38,783', 'Bear River'],
        ],
      },
      bodyStart: 'A run-of-river hydroelectric power plant',
    },
  },

  // ── 2023-10 (J10) ───────────────────────────────────────────────────────────
  'sat-cmp-2023-j10-int-01-module-1': {
    11: {
      table: {
        title: 'Pyramids in Egypt and the Americas',
        headers: ['Pyramid', 'Country', 'Height (meters)', 'Age (years before present)'],
        rows: [
          ['The Great Pyramid', 'Mexico', '33', '2,050 to 2,400'],
          ['The Pyramid of Djoser', 'Egypt', '60', '4,600 to 4,700'],
          ['The Pyramid of Sahure', 'Egypt', '47', '4,400 to 4,500'],
          ['El Castillo', 'Belize', '40', '1,100 to 1,400'],
        ],
      },
      bodyStart: 'A student is writing an essay about four pyramids',
    },
    13: {
      table: {
        title: 'Monthly Temperatures and Wing Centroid Sizes of Fruit Fly Specimens',
        headers: ['Month', 'Average high (°F)', 'Average low (°F)', 'Average male wing centroid size (mm)', 'Average female wing centroid size (mm)'],
        rows: [
          ['October', '67', '44', '1.98', '2.29'],
          ['May', '73', '50', '1.98', '2.27'],
          ['July', '87', '62', '2.02', '2.31'],
          ['September', '80', '54', '1.98', '2.27'],
        ],
      },
      bodyStart: 'Drosophila (fruit flies) have generation times',
    },
  },
  'sat-cmp-2023-j10-int-01-module-2': {
    9: {
      table: {
        title: 'Brown Bears in Katmai National Park, Alaska',
        headers: ['Bear identification number', 'Sex', 'Age (years)', 'Approximate weight (pounds)'],
        rows: [
          ['106', 'female', '6', '400'],
          ['119', 'male', '10', '800'],
          ['183', 'female', '13', '375'],
          ['122', 'male', '3', '200'],
        ],
      },
      bodyStart: 'Scientists collected information about brown bears',
    },
    10: {
      table: {
        title: 'Cumulative Counts of Fish in Three Taiwanese Tide Pools, 1999-2018',
        headers: ['Species', 'Station 1', 'Station 2', 'Station 3'],
        rows: [
          ['barred flagtail', '249', '64', '16'],
          ['streaky rockskipper', '125', '139', '610'],
          ['blackspotted rockskipper', '83', '74', '31'],
          ['Cocos frillgoby', '50', '64', '90'],
        ],
      },
      bodyStart: 'Lin-Tai Ho and colleagues tracked fish populations',
    },
  },
  'sat-cmp-2023-j10-int-02-module-1': {
    12: {
      table: {
        title: 'Minimum and Maximum Depths of Stony Coral Species in Caribbean and Indo-Pacific Waters',
        headers: ['Species', 'Minimum depth (meters)', 'Maximum depth (meters)'],
        rows: [
          ['Cycloseris tenuis', '1', '27'],
          ['Acropora caroliniana', '10', '25'],
          ['Acropora anthocercis', '5', '10'],
          ['Agaricia fragilis', '10', '102'],
        ],
      },
      bodyStart: 'Some scientists have suggested that as ocean temperatures rise',
    },
  },
  'sat-cmp-2023-j10-int-02-module-2': {
    11: {
      table: {
        title: 'Simulated Change in Annual Aquifer Input and Irrigation Output if Precipitation Concentration Increases as Climate Models Predict',
        headers: ['Baseline concentration of annual precipitation', '% change in water entering aquifers', '% change in surface water used for irrigation', '% change in groundwater used for irrigation'],
        rows: [
          ['Precipitation is currently somewhat concentrated', '4.9', '0.4', '0.9'],
          ['Precipitation is currently evenly distributed', '11.0', '9.0', '7.9'],
        ],
      },
      bodyStart: 'Some climate models for the western United States',
    },
  },

  // ── 2023-11 (K11) ───────────────────────────────────────────────────────────
  'sat-cmp-2023-k11-int-01-module-2': {
    13: {
      table: {
        title: 'Simulated Change in Annual Aquifer Input and Irrigation Output if Precipitation Concentration Increases as Climate Models Predict',
        headers: ['Baseline concentration of annual precipitation', '% change in water entering aquifers', '% change in surface water used for irrigation', '% change in groundwater used for irrigation'],
        rows: [
          ['Precipitation is currently somewhat concentrated', '4.9', '0.4', '0.9'],
          ['Precipitation is currently evenly distributed', '11.0', '9.0', '7.9'],
        ],
      },
      bodyStart: 'Some climate models for the western United States',
    },
  },

  // ── 2023-12 (L12) ───────────────────────────────────────────────────────────
  'sat-cmp-2023-l12-int-01-module-1': {
    11: {
      table: {
        title: 'Total Areas of Five Tribal Nations around the United States',
        headers: ['Tribal nation', 'Location', 'Area (square miles)'],
        rows: [
          ["Tohono O'odham Nation", 'Arizona', '4,453'],
          ['Crow Tribe', 'Montana', '3,606'],
          ['Leech Lake Band of Ojibwe', 'Minnesota', '1,311'],
          ['Yakama Nation', 'Washington', '2,188'],
          ['Muscogee Nation', 'Oklahoma', '4,867'],
        ],
      },
      bodyStart: 'In terms of total area, the Muscogee Nation',
    },
    13: {
      table: {
        title: 'Dated Ages of Lunar Samples from Select Missions',
        headers: ['Mission name', 'Year', 'Landing site', 'Approximate age of lunar samples (billions of years)'],
        rows: [
          ['Apollo 11', '1969', 'Mare Tranquillitatis', '3.6'],
          ['Apollo 15', '1971', 'Mare Imbrium', '3.3'],
          ['Apollo 17', '1972', 'Mare Serenitatis', '3.8'],
          ["Chang'e 5", '2020', 'Oceanus Procellarum', '2.0'],
        ],
      },
      bodyStart: 'The Apollo program missions were spaceflights',
    },
  },
  'sat-cmp-2023-l12-int-02-module-1': {
    11: {
      table: {
        title: 'Impact of Four Key Industries on Oklahoma Economy in 2017',
        headers: ['Industry', 'Approximate total contribution by industry', 'Number of people employed by industry', 'Average contribution per employee by industry'],
        rows: [
          ['Administration/waste', '$5,830,600,000', '96,964', '$60,132'],
          ['Construction', '$6,797,300,000', '77,247', '$87,994'],
          ['Transportation/warehousing', '$12,414,600,000', '52,891', '$234,720'],
          ['Tribal economic activity', '$7,312,400,000', '51,674', '$141,510'],
        ],
      },
      bodyStart: 'The Cherokee Nation, the Quapaw Tribe, and the more than thirty',
    },
    13: {
      table: {
        title: 'Days per Winter That Lakes Have Surface Ice',
        headers: ['Lake', 'Latitude (degrees)', '1980-81', '1985-86', '1990-91', '1995-96', '2000-01', '2005-06'],
        rows: [
          ['Kalmarinjärvi', '62.79', '198', '172', '175', '184', '131', '152'],
          ['Lake Neusiedl', '47.82', '77', '86', '87', '128', '50', '104'],
          ['Mirror Lake', '43.94', '122', '129', '125', '136', '141', '119'],
        ],
      },
      bodyStart: 'It is common for freshwater lakes near or above a latitude of 45',
    },
  },
  'sat-cmp-2023-l12-int-02-module-2': {
    10: {
      table: {
        title: 'Pyramids in Egypt and the Americas',
        headers: ['Pyramid', 'Country', 'Height (meters)', 'Age (years before present)'],
        rows: [
          ['The Pyramid of the Sun', 'Mexico', '71.2', '2,100'],
          ['The Pyramid of Djedefre', 'Egypt', '67', '4,500 to 4,600'],
          ['The Pyramid of Userkaf', 'Egypt', '49', '4,400 to 4,500'],
          ['El Castillo', 'Belize', '40', '1,100 to 1,400'],
        ],
      },
      bodyStart: 'A student is writing an essay about four pyramids',
    },
    11: {
      table: {
        title: 'Studies of the Effects of Tilling vs. No Tilling on Crop Yields',
        headers: ['Authors', 'Crop', 'Crop yield with tilling (kilograms per hectare)', 'Crop yield with no tilling (kilograms per hectare)'],
        rows: [
          ['Salem Alhajj Ali and colleagues', 'winter wheat', '3,700', '5,300'],
          ['Nayasha Kafesu and colleagues', 'maize', '3,078', '3,574'],
          ['G.F. Botta and colleagues', 'soybeans', '3,300', '2,700'],
          ['Laila Nazirah and colleagues', 'rice', '4,370', '2,450'],
        ],
      },
      bodyStart: 'Laila Nazirah and colleagues found that tilling',
    },
  },
  'sat-cmp-2023-l12-int-03-module-1': {
    12: {
      table: {
        title: 'Contributions of Three Key Industries to Oklahoma Economy in 2017',
        headers: ['Industries', 'Approximate Contribution'],
        rows: [
          ['Tribal economic activity', '$7,312,400,000'],
          ['Construction', '$6,797,300,000'],
          ['Health care', '$13,727,300,000'],
        ],
      },
      bodyStart: 'The Choctaw Nation, the Citizen Potawatori Nation',
    },
    13: {
      table: {
        title: 'Peering at Adult Orangutans by Immature Orangutans',
        headers: ['Individuals', 'Site', 'Sex', 'Total number of peering events observed', "Proportion of peering events directed at immigrants to immature individual's home region"],
        rows: [
          ['1', 'Suaq', 'female', '17', '0.41'],
          ['2', 'Suaq', 'female', '23', '0.13'],
          ['8', 'Tuanan', 'male', '1', '1.00'],
          ['16', 'Suaq', 'male', '80', '0.84'],
        ],
      },
      bodyStart: 'One way that young orangutans acquire foraging skills',
    },
  },
  'sat-cmp-2023-l12-int-03-module-2': {
    9: {
      table: {
        title: 'Pyramids in Egypt and the Americas',
        headers: ['Pyramid', 'Country', 'Height (meters)', 'Age (years before present)'],
        rows: [
          ['The Tikal Temple IV', 'Guatemala', '70', '1,300'],
          ['The Pyramid of the Moon', 'Mexico', '42', '2,100'],
          ['The Pyramid of Neferikare', 'Egypt', '54', '4,400 to 4,500'],
          ['The Buried Pyramid', 'Egypt', '7', '4,600 to 4,700'],
        ],
      },
      bodyStart: 'A student is writing an essay about four pyramids',
    },
    10: {
      table: {
        title: 'Studies of the Effects of Tilling vs. No Tilling on Crop Yields',
        headers: ['Authors', 'Crop', 'Crop yield with tilling (kilograms per hectare)', 'Crop yield with no tilling (kilograms per hectare)'],
        rows: [
          ['Eduardo Martinez and colleagues', 'winter wheat', '4,829', '2,894'],
          ['Fuseini Issaka and colleagues', 'rice', '6,400', '6,300'],
          ['Roberto Izauraide and colleagues', 'spring barley', '1,676', '2,515'],
          ['Igor Bogunovic and colleagues', 'maize', '3,884', '5,716'],
        ],
      },
      bodyStart: 'Eduardo Martinez and colleagues found that tilling',
    },
  },
  'sat-cmp-2023-l12-int-04-module-1': {
    10: {
      table: {
        title: 'Impact of Four Industries on Oklahoma Economy in 2017',
        headers: ['Industry', 'Approximate total contribution by industry', 'Number of people employed by industry', 'Average contribution per employee by industry'],
        rows: [
          ['Retail', '$10,738,800,000', '179,208', '$59,924'],
          ['Manufacturing', '$16,707,500,000', '128,122', '$130,403'],
          ['Transportation/warehousing', '$12,414,600,000', '52,891', '$234,720'],
          ['Tribal economic activity', '$7,312,400,000', '51,674', '$141,510'],
        ],
      },
      bodyStart: 'The Chickasaw Nation, the Seminole Nation, and the more than thirty',
    },
    11: {
      table: {
        title: 'Studies of Cougar Population Density',
        headers: ['Study authors', 'Study publication year', 'Location', 'Minimum density (cougars per 100 square kilometers)', 'Maximum density (cougars per 100 square kilometers)'],
        rows: [
          ['David M. Choate et al.', '2006', 'Utah (United States)', '5.59', '10.24'],
          ['Randy D. Johnson', '2017', 'North Dakota (United States)', '0.45', '2.78'],
          ['A.J. Noss et al.', '2012', 'Bolivia', '0.36', '7.99'],
          ['K.M. Proffitt et al.', '2015', 'Montana (United States)', '3.20', '5.60'],
        ],
      },
      bodyStart: 'Studies of the population density of cougars',
    },
    13: {
      table: {
        title: 'Days per Winter That Lakes Have Surface Ice',
        headers: ['Lake', 'Latitude (degrees)', '1980-81', '1985-86', '1990-91', '1995-96', '2000-01', '2005-06'],
        rows: [
          ['Lake Kegonsa', '42.97', '94', '116', '104', '113', '124', '101'],
          ['Näckten', '62.913', '177', '168', '144', '174', '133', '134'],
          ['Lake Baikal', '51.85', '96', '118', '92', '103', '127', '109'],
        ],
      },
      bodyStart: 'It is common for freshwater lakes near or above a latitude of 45',
    },
  },

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

  // ── 2024-03 (C3) ────────────────────────────────────────────────────────────
  'sat-cmp-2024-c3-int-01-module-1': {
    11: {
      table: {
        title: 'Total Areas of Five Pueblo Nations in New Mexico',
        headers: ['Tribal nation', 'Area (square miles)'],
        rows: [
          ['Pueblo of Tesuque', '26.9'],
          ['Pueblo of Santa Ana', '101.1'],
          ['Pueblo de San Ildefonso', '47.3'],
          ['Pueblo of Acoma', '595.7'],
          ['Santa Clara Pueblo', '77.1'],
        ],
      },
      bodyStart: 'There are nineteen Pueblo tribal nations',
    },
    13: {
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
          ['The Lives of Others', '$11,286,112', '$223,000', 'February 9, 2007', 'Florian Henckel von Donnersmarck', 'Yes'],
          ['Baahubali 2: The Conclusion', '$20,186,659', '$10,430,497', 'April 28, 2017', 'S.S. Rajamouli', 'No'],
          ["Pan's Labyrinth", '$37,634,615', '$568,641', 'December 29, 2006', 'Guillermo del Toro', 'Yes'],
          ["Huevos: Little Rooster's Egg-cellent Adventure", '$9,080,818', '$3,124,702', 'September 4, 2015', 'Gabriel Riva Palacio Alatriste and Rodolfo Riva Palacio Alatriste', 'No'],
        ],
      },
      bodyStart: 'Many films in a language other than English',
    },
  },
  'sat-cmp-2024-c3-int-02-module-1': {
    11: {
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
          ['Crouching Tiger, Hidden Dragon', '$128,078,872', '$663,205', 'December 8, 2000', 'Ang Lee', 'Yes'],
          ['Eat Drink Man Woman', '$7,294,403', '$155,512', 'August 3, 1994', 'Ang Lee', 'Yes'],
          ['Iron Monkey', '$14,694,904', '$6,014,653', 'October 12, 2001', 'Yuen Woo-ping', 'No'],
          ['The Girl Who Played with Fire', '$7,638,241', '$904,998', 'July 9, 2010', 'Daniel Alfredson', 'No'],
        ],
      },
      bodyStart: 'Many films in a language other than English',
    },
    12: {
      table: {
        title: 'Numbers of the 23 Non-native Tree Species Reported and the Insect and Fungus Threats to Them',
        headers: ['Country', 'Trees', 'Fungi', 'Insects'],
        rows: [
          ['Lithuania', '8', '12', '7'],
          ['Poland', '10', '25', '105'],
          ['Austria', '13', '51', '50'],
        ],
      },
      bodyStart: 'Elisabeth Pötzelsberger and colleagues gathered data',
    },
    14: {
      table: {
        title: 'Days per Winter That Lakes Have Surface Ice',
        headers: ['Lake', 'Latitude (degrees)', '1980-81', '1985-86', '1990-91', '1995-96', '2000-01', '2005-06'],
        rows: [
          ['Spirit Lake', '43.46', '102', '135', '121', '134', '147', '126'],
          ['Lake Kegonsa', '42.97', '94', '116', '104', '113', '124', '101'],
          ['Näckten', '62.913', '177', '168', '144', '174', '133', '134'],
        ],
      },
      bodyStart: 'lt is common for freshwater lakes',
    },
  },
  'sat-cmp-2024-c3-int-03-module-1': {
    9: {
      table: {
        title: 'Home Video Games and Computer Games of the 1980s',
        headers: ['Title', 'System(s)', 'Genre', 'Developer'],
        rows: [
          ['The Last Ninja', 'Commodore 64', 'adventure', 'System 3'],
          ['Donkey Kong', 'multiple systems', 'platformer', 'Nintendo R&D1'],
          ['Frogger', 'multiple systems', 'action', 'Konami'],
          ['Super Mario Brothers 2', 'Nintendo Entertainment System', 'platformer', 'Nintendo EAD'],
        ],
      },
      bodyStart: 'A student is writing a research paper',
    },
  },
  'sat-cmp-2024-c3-int-03-module-2': {
    9: {
      table: {
        title: 'Home Video Games and Computer Games of the 1980s',
        headers: ['Title', 'System(s)', 'Genre', 'Developer'],
        rows: [
          ['Frogger', 'multiple systems', 'action', 'Konami'],
          ['Donkey Kong', 'multiple systems', 'platformer', 'Nintendo R&D1'],
          ['R.C. Pro-Am', 'Nintendo Entertainment System', 'racing', 'Rare'],
          ['Where in the World Is Carmen Sandiego?', 'multiple systems', 'education', 'Broderbund'],
        ],
      },
      bodyStart: 'A student is writing a research paper',
    },
  },
  'sat-cmp-2024-c3-int-04-module-1': {
    11: {
      table: {
        title: 'Total Areas of Five Tribal Nations around the United States',
        headers: ['Tribal nation', 'Location', 'Area (square miles)'],
        rows: [
          ['Blackfeet Nation', 'Montana', '2,285'],
          ['Mandan, Hidatsa, and Arikara Nation', 'North Dakota', '1,583'],
          ['Northern Cheyenne Tribe', 'Montana', '707'],
          ['Cherokee Nation', 'Oklahoma', '6,963'],
          ['Muscogee Nation', 'Oklahoma', '4,867'],
        ],
      },
      bodyStart: 'In terms of total area, the Navajo Nation',
    },
    12: {
      table: {
        title: 'Millions of Metric Tons of Copper Mined in 1995 and 2020',
        headers: ['Country', '1995', '2020'],
        rows: [
          ['United States', '1.85', '1.20'],
          ['Mexico', '0.33', '0.73'],
          ['Poland', '0.38', '0.39'],
          ['China', '0.37', '1.72'],
        ],
      },
      bodyStart: 'While doing research for a paper',
    },
    14: {
      table: {
        title: 'Average Hours Worked per Person per Year in 1950 and 2017',
        headers: ['Country', '1950', '2017', 'Change in hours', 'Percent change in hours'],
        rows: [
          ['Mexico', '2,432', '2,255', '-177', '-7%'],
          ['Austria', '2,086', '1,613', '-473', '-23%'],
          ['Brazil', '2,042', '1,709', '-333', '-16%'],
          ['Belgium', '2,106', '1,544', '-562', '-27%'],
        ],
      },
      bodyStart: 'A student in an economics course',
    },
  },
  'sat-cmp-2024-c3-int-04-module-2': {
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
          ['All About My Mother', '$8,272,296', '$50,362', 'November 5, 1999', 'Pedro Almodóvar', 'Yes'],
          ['Amélie', '$33,225,499', '$136,470', 'November 2, 2001', 'Jean-Pierre Jeunet', 'Yes'],
          ['Dhoom 3', '$8,031,955', '$3,423,508', 'December 20, 2013', 'Vijay Krishna Acharya', 'No'],
          ['Kung Fu Hustle', '$17,108,591', '$269,225', 'April 8, 2005', 'Stephen Chow', 'No'],
        ],
      },
      bodyStart: 'Many films in a language other than English',
    },
  },
  'sat-cmp-2024-c3-na-01-module-1': {
    9: {
      table: {
        title: 'Approximate Numbers of Speakers of Four Native Languages',
        headers: ['Language', 'Region', 'Number of speakers'],
        rows: [
          ['Tlingit', 'Alaska Panhandle', '1,240'],
          ['Hopi', 'Southwest', '6,080'],
          ['Mohawk', 'Northeast', '1,950'],
          ['Cherokee', 'Southeast', '11,470'],
        ],
      },
      bodyStart: 'The Cherokee language of the Southeast',
    },
    10: {
      table: {
        title: 'Minimum and Maximum Depths of Stony Coral Species in Caribbean and Indo-Pacific Waters',
        headers: ['Species', 'Minimum depth (meters)', 'Maximum depth (meters)'],
        rows: [
          ['Cycloseris tenuis', '1', '27'],
          ['Acropora caroliniana', '10', '25'],
          ['Acropora anthocercis', '5', '10'],
          ['Agaricia fragilis', '10', '102'],
        ],
      },
      bodyStart: 'Some scientists have suggested',
    },
  },

  // ── 2024-05 (E5) ────────────────────────────────────────────────────────────
  'sat-cmp-2024-e5-int-01-module-1': {
    10: {
      table: {
        title: 'Days per Winter That Lakes Have Surface Ice',
        headers: ['Lake', 'Latitude (degrees)', '1980-81', '1985-86', '1990-91', '1995-96', '2000-01', '2005-06'],
        rows: [
          ['Spirit Lake', '43.46', '102', '135', '121', '134', '147', '126'],
          ['Lake Kegonsa', '42.97', '94', '116', '104', '113', '124', '101'],
          ['Näckten', '62.913', '177', '168', '144', '174', '133', '134'],
        ],
      },
      bodyStart: 'It is common for freshwater lakes',
    },
    11: {
      table: {
        title: 'Impact of Four Key Industries on Oklahoma Economy in 2017',
        headers: [
          'Industry',
          'Approximate total contribution by industry',
          'Number of people employed by industry',
          'Average contribution per employee by industry',
        ],
        rows: [
          ['Tribal economic activity', '$7,312,400,000', '51,674', '$141,510'],
          ['Administration/waste', '$5,830,600,000', '96,964', '$60,132'],
          ['Wholesale trade', '$10,723,400,000', '58,346', '$183,790'],
          ['Construction', '$6,797,300,000', '77,247', '$87,994'],
        ],
      },
      bodyStart: 'The Osage Nation, the Seminole Nation',
    },
  },
  'sat-cmp-2024-e5-int-02-module-1': {
    10: {
      table: {
        title: 'Examples of Hoards found in Ireland and Northern Ireland',
        headers: ['Hoard name', 'Date of contents', 'Year of discovery', 'Description'],
        rows: [
          ['Carrick-on-Suir Hoard', '17th century CE', '2013', 'gold coins'],
          ['Coggalbeg Hoard', '24th-19th century BCE', '1945', 'gold pieces'],
          ['Broighter Hoard', '1st century BCE', '1896', 'gold pieces'],
        ],
      },
      bodyStart: 'For centuries, people in Ireland',
    },
    12: {
      table: {
        title: 'Characteristics of Several Large Stars',
        headers: ['Name of star', 'Mass (solar masses)', 'Distance (light-years)', 'Minimum aperture to detect from Earth (millimeters)'],
        rows: [
          ['Sk -69° 249 A', '119', '160,000', '60'],
          ['VFTS 482', '145', '164,000', '102'],
          ['HSH95-46', '160', '163,000', '203'],
          ['R136a4', '167', '157,000', '152'],
        ],
      },
      bodyStart: 'A telescope allows us to see',
    },
  },
  'sat-cmp-2024-e5-int-02-module-2': {
    10: {
      table: {
        title: 'Members of the Girl Scouts of America, by Age Category, 1992-1995 (in thousands)',
        headers: ['Category', '1992', '1993', '1994', '1995'],
        rows: [
          ['Juniors (8-11 years)', '870', '791', '756', '727'],
          ['Ambassadors (older than 17)', '863', '826', '802', '784'],
          ['Cadettes (11-14 years)', '188', '168', '174', '172'],
          ['Seniors (14-17 years)', '50', '43', '45', '52'],
        ],
      },
      bodyStart: 'The Girl Scouts of America is a youth organization',
    },
  },
  'sat-cmp-2024-e5-na-01-module-2': {
    10: {
      table: {
        title: 'Days per Winter That Lakes Have Surface Ice',
        headers: ['Lake', 'Latitude (degrees)', '1980-81', '1985-86', '1990-91', '1995-96', '2000-01', '2005-06'],
        rows: [
          ['Lake Baikal', '51.85', '96', '118', '92', '103', '127', '109'],
          ['Näckten', '62.913', '177', '168', '144', '174', '133', '134'],
          ['Lake Mendota', '43.1', '93', '107', '88', '119', '115', '95'],
        ],
      },
      bodyStart: 'It is common for freshwater lakes',
    },
  },

  // ── 2024-06 (F6) ────────────────────────────────────────────────────────────
  'sat-cmp-2024-f6-int-01-module-1': {
    12: {
      table: {
        title: 'Studies of the Effects of Tilling vs. No Tilling on Crop Yields',
        headers: ['Authors', 'Crop', 'Crop yield with tilling (kilograms per hectare)', 'Crop yield with no tilling (kilograms per hectare)'],
        rows: [
          ['Danijel Jug and colleagues', 'winter wheat', '4,860', '3,910'],
          ['Carlos Cantero-Martinez and colleagues', 'winter barley', '2,693', '3,136'],
          ['R.K. Jat and colleagues', 'maize', '3,000', '5,200'],
          ['Gevan Behnke and colleagues', 'soybeans', '4,285', '3,798'],
        ],
      },
      bodyStart: 'Danijel Jug and colleagues found that tilling',
    },
  },
  'sat-cmp-2024-f6-int-02-module-1': {
    9: {
      table: {
        title: 'Total Areas of Five Tribal Nations around the United States',
        headers: ['Tribal nation', 'Location', 'Area (square miles)'],
        rows: [
          ['Choctaw Nation', 'Oklahoma', '10,864'],
          ['Hopi Tribe', 'Arizona', '2,533'],
          ["Tohono O'odham Nation", 'Arizona', '4,453'],
          ['Nez Perce Tribe', 'Idaho', '1,204'],
          ['Cheyenne River Sioux Tribe', 'South Dakota', '4,419'],
        ],
      },
      bodyStart: 'A citizen of the Cheyenne River Sioux Tribe',
    },
    10: {
      table: {
        title: 'Numbers of the 23 Non-native Tree Species Reported and the Insect and Fungus Threats to Them',
        headers: ['Country', 'Trees', 'Fungi', 'Insects'],
        rows: [
          ['Finland', '6', '11', '28'],
          ['Poland', '10', '25', '105'],
          ['Austria', '13', '51', '50'],
        ],
      },
      bodyStart: 'Elisabeth Pötzelsberger and colleagues gathered data',
    },
    11: {
      table: {
        title: 'Ranking of Environmental and Sociocultural Benefits of Urban Agriculture (scale of 1 to 25; 1 = highest)',
        headers: ['Social or ecological service', 'Project leaders', 'Stakeholders', 'General public'],
        rows: [
          ['improvement of community building', '17', '12', '10'],
          ['improvement of urban aesthetics and art inspiration', '8', '4', '6'],
          ['enhancement of pollination', '1', '7', '12'],
          ['provision of food', '4', '15', '8'],
          ['provision of medicinal plants', '22', '21', '5'],
        ],
      },
      bodyStart: 'Esther Sanyé-Mengual, Kathrin Specht, and their team',
    },
  },
  'sat-cmp-2024-f6-int-03-module-1': {
    10: {
      table: {
        title: 'Total Areas of Five Tribal Nations around the United States',
        headers: ['Tribal nation', 'Location', 'Area (square miles)'],
        rows: [
          ["Tohono O'odham Nation", 'Arizona', '4,453'],
          ['Standing Rock Sioux Tribe', 'North and South Dakota', '3,662'],
          ['Hopi Tribe', 'Arizona', '2,533'],
          ['Yakama Nation', 'Washington', '2,188'],
          ['Choctaw Nation', 'Oklahoma', '10,864'],
        ],
      },
      bodyStart: 'A citizen of the Standing Rock Sioux Tribe',
    },
    11: {
      table: {
        title: 'Numbers of the 23 Non-native Tree Species Reported and the Insect and Fungus Threats to Them',
        headers: ['Country', 'Trees', 'Fungi', 'Insects'],
        rows: [
          ['Italy', '14', '57', '42'],
          ['Poland', '10', '25', '105'],
          ['Finland', '6', '11', '28'],
        ],
      },
      bodyStart: 'Elisabeth Pötzelsberger and colleagues gathered data',
    },
    12: {
      table: {
        title: 'Ranking of Environmental and Sociocultural Benefits of Urban Agriculture (scale of 1 to 25; 1 = highest)',
        headers: ['Social or ecological service', 'Project leaders', 'Stakeholders', 'General public'],
        rows: [
          ['provision of medicinal plants', '22', '21', '5'],
          ['enhancement of pollination', '1', '7', '12'],
          ['enhancement of carbon sequestration', '17', '22', '21'],
          ['preservation of cultural knowledge and heritage', '8', '15', '13'],
          ['prevention of soil erosion', '13', '11', '23'],
        ],
      },
      bodyStart: 'Esther Sanyé-Mengual, Kathrin Specht, and their team',
    },
  },
  'sat-cmp-2024-f6-int-04-module-1': {
    11: {
      table: {
        title: 'Neighboring Species and Target Species in Various Locations',
        headers: ['Neighboring species', 'Target species', 'Location'],
        rows: [
          ['sticky catchfly', 'common cow-wheat', 'Sweden'],
          ['Bermuda buttercup', 'white rocket', 'Spain'],
          ['Virginia spring beauty', 'star chickweed', 'United States'],
        ],
      },
      bodyStart: 'In a study of interactions between plants',
    },
  },
  'sat-cmp-2024-f6-na-01-module-1': {
    11: {
      table: {
        title: 'Effect of Neighboring Species on Pollinator Visits to Target Species',
        headers: ['Neighboring Species', 'Target Species', 'Effect Value'],
        rows: [
          ['creeping thistle', 'wild radish', '0.2523'],
          ['Elands sourfig', 'Montpellier cistus', '0.3580'],
          ['leafy spurge', 'Lewis flax', '-0.3238'],
        ],
      },
      bodyStart: 'Researchers Carolina Laura Morales and Anna Traveset',
    },
    12: {
      table: {
        title: 'Pyramids in Egypt and the Americas',
        headers: ['Pyramid', 'Country', 'Height (meters)', 'Age (years before present)'],
        rows: [
          ['The Pyramid of Userkaf', 'Egypt', '49', '4,400 to 4,500'],
          ['The Mask Temple', 'Belize', '17', '1,100 to 2,300'],
          ['El Castillo', 'Belize', '40', '1,100 to 1,400'],
          ['The Pyramid of Djedefre', 'Egypt', '67', '4,500 to 4,600'],
        ],
      },
      bodyStart: 'A student is writing an essay about four pyramids',
    },
  },

  // ── 2024-08 (H8) ────────────────────────────────────────────────────────────
  'sat-cmp-2024-h8-int-01-module-1': {
    10: {
      table: {
        title: 'Total Areas of Five Tribal Nations in California',
        headers: ['Tribal nation', 'Location', 'Area (square miles)'],
        rows: [
          ['Agua Caliente Band of Cahuilla Indians', 'Northern California', '53.68'],
          ['La Jolla Band of Luiseño Indians', 'Southern California', '13.50'],
          ['Pala Band of Mission Indians', 'Southern California', '20.35'],
          ['Hoopa Valley Tribe', 'Northern California', '141.68'],
          ['Pauma Band of Luiseño Mission Indians', 'Southern California', '9.36'],
        ],
      },
      bodyStart: 'In what is now the state of California',
    },
    12: {
      table: {
        title: 'Population and Area Data for Four Cities in 2018',
        headers: [
          'City',
          'Country',
          'UN estimate',
          'Reported city proper',
          'City-proper area (square kilometers)',
          'Reported metropolitan',
          'Metropolitan area (square kilometers)',
        ],
        rows: [
          ['Mexico City', 'Mexico', '21,581,000', '9,209,944', '1,485', '21,804,515', '7,866'],
          ['Los Angeles', 'United States', '12,458,000', '3,990,456', '1,214', '13,291,486', '12,562'],
          ['São Paulo', 'Brazil', '21,650,000', '12,252,023', '1,521', '21,734,682', '7,946'],
          ['Kolkata', 'India', '14,681,000', '4,496,694', '205', '14,035,959', '1,886'],
        ],
      },
      bodyStart: 'Population figures for a city can vary significantly',
    },
  },
  'sat-cmp-2024-h8-int-02-module-1': {
    10: {
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
          ['Construction', '$6,797,300,000', '77,247', '$87,994'],
          ['Wholesale trade', '$10,723,400,000', '58,346', '$183,790'],
        ],
      },
      bodyStart: 'The Muscogee Nation and the nearly forty other tribes',
    },
  },
  'sat-cmp-2024-h8-int-02-module-2': {
    10: {
      table: {
        title: 'Home Video Games and Computer Games of the 1980s',
        headers: ['Title', 'Approximate number of units sold worldwide', 'Release year', 'Genre', 'Developer'],
        rows: [
          ['Excitebike', '4,160,000', '1984', 'racing', 'Nintendo R&D1'],
          ['The Last Ninja 2', '5,500,000', '1988', 'action-adventure', 'System 3'],
          ['Zelda II: The Adventure of Link', '4,380,000', '1987', 'action-adventure', 'Nintendo EAD'],
          ['Frogger', '4,100,000', '1982', 'action', 'Konami'],
        ],
      },
      bodyStart: 'A student is writing a paper',
    },
  },
  'sat-cmp-2024-h8-int-03-module-1': {
    11: {
      table: {
        title: 'Total Areas of Five Tribal Nations around the United States',
        headers: ['Tribal nation', 'Location', 'Area (square miles)'],
        rows: [
          ['Crow Tribe', 'Montana', '3,606'],
          ['White Earth Nation', 'Minnesota', '1,167'],
          ["Tohono O'odham Nation", 'Arizona', '4,453'],
          ['Choctaw Nation', 'Oklahoma', '10,864'],
          ['Yakama Nation', 'Washington', '2,188'],
        ],
      },
      bodyStart: 'In terms of total area, the Choctaw Nation',
    },
    12: {
      table: {
        title: 'Pyramids in Egypt and the Americas',
        headers: ['Pyramid', 'Country', 'Height (meters)', 'Age (years before present)'],
        rows: [
          ['The Great Pyramid', 'Mexico', '33', '2,050 to 2,400'],
          ['The Pyramid of Djoser', 'Egypt', '60', '4,600 to 4,700'],
          ['The Pyramid of Sahure', 'Egypt', '47', '4,400 to 4,500'],
          ['El Castillo', 'Belize', '40', '1,100 to 1,400'],
        ],
      },
      bodyStart: 'A student is writing an essay about four pyramids',
    },
    14: {
      table: {
        title: 'Properties of Select Rotating Radio Transients',
        headers: ['Name', 'Right ascension (hours)', 'Period (seconds)', 'Frequency (hertz)'],
        rows: [
          ['J0545-03', '5:45', '1.074', '0.931'],
          ['J1654-2335', '16:54:03', '0.545', '1.834'],
          ['J0103+54', '1:03:37', '0.354', '2.822'],
          ['J0121+53', '1:21', '2.725', '0.367'],
          ['J0614-03', '6:15', '0.136', '7.353'],
        ],
      },
      bodyStart: 'A student is researching rotating radio transients',
    },
  },
  'sat-cmp-2024-h8-int-04-module-1': {
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
          ['Tribal economic activity', '$7,312,400,000', '51,674', '$141,510'],
          ['Finance/insurance', '$7,281,900,000', '56,163', '$129,657'],
          ['Wholesale trade', '$10,723,400,000', '58,346', '$183,790'],
          ['Administration/waste', '$5,830,600,000', '96,964', '$60,132'],
        ],
      },
      bodyStart: 'The Chickasaw Nation and the nearly forty other tribes',
    },
    10: {
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
  },
  'sat-cmp-2024-h8-na-01-module-1': {
    9: {
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
    13: {
      table: {
        title: 'Peering at Adult Orangutans by Immature Orangutans',
        headers: [
          'Individual',
          'Site',
          'Sex',
          'Total number of peering events observed',
          "Proportion of peering events directed at immigrants to immature individual's home region",
        ],
        rows: [
          ['5', 'Suaq', 'female', '1', '0.00'],
          ['6', 'Tuanan', 'female', '6', '0.33'],
          ['10', 'Suaq', 'male', '33', '0.64'],
          ['8', 'Tuanan', 'male', '1', '1.00'],
        ],
      },
      bodyStart: 'One way that young orangutans acquire foraging skills',
    },
  },
  'sat-cmp-2024-h8-na-03-module-1': {
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
    13: {
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
          ['Instructions Not Included', '$44,467,206', '$7,846,426', 'August 30, 2013', 'Eugenio Derbez', 'No'],
          ['The Girl Who Played with Fire', '$7,638,241', '$904,998', 'July 9, 2010', 'Daniel Alfredson', 'No'],
          ['Amélie', '$33,225,499', '$136,470', 'November 2, 2001', 'Jean-Pierre Jeunet', 'Yes'],
          ['All About My Mother', '$8,272,296', '$50,362', 'November 5, 1999', 'Pedro Almodóvar', 'Yes'],
        ],
      },
      bodyStart: 'Many films in a language other than English',
    },
  },
  'sat-cmp-2024-h8-na-03-module-2': {
    11: {
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
          ['October', '67', '44', '1.98', '2.29'],
          ['May', '73', '50', '1.98', '2.27'],
          ['July', '87', '62', '2.02', '2.31'],
          ['September', '80', '54', '1.98', '2.27'],
        ],
      },
      bodyStart: 'Drosophila (fruit flies) have generation times',
    },
  },

  // ── 2024-10 (J10) ───────────────────────────────────────────────────────────
  'sat-cmp-2024-j10-int-01-module-1': {
    10: {
      table: {
        title: 'Millions of Metric Tons of Copper Mined in 1995 and 2020',
        headers: ['Country', '1995', '2020'],
        rows: [
          ['Mexico', '0.33', '0.73'],
          ['United States', '1.85', '1.20'],
          ['Peru', '0.38', '2.15'],
          ['Poland', '0.38', '0.39'],
        ],
      },
      bodyStart: 'While doing research for a paper',
    },
    12: {
      table: {
        title: 'Studies of the Effects of Tilling vs. No Tilling on Crop Yields',
        headers: ['Authors', 'Crop', 'Crop yield with tilling (kilograms per hectare)', 'Crop yield with no tilling (kilograms per hectare)'],
        rows: [
          ['Daniel Jug and colleagues', 'winter wheat', '4,860', '3,910'],
          ['Carlos Cantero-Martínez and colleagues', 'winter barley', '2,693', '3,136'],
          ['R.K. Jat and colleagues', 'maize', '3,000', '5,200'],
          ['Gevan Behnke and colleagues', 'soybeans', '4,285', '3,798'],
        ],
      },
      bodyStart: 'Daniel Jug and colleagues found that tilling',
    },
  },
  'sat-cmp-2024-j10-int-02-module-1': {
    11: {
      table: {
        title: 'Defensive Behavior and Reproductive Traits of Select Bird Species',
        headers: [
          'Scientific name',
          'Common name',
          'Performs broken-wing display?',
          'Length of incubation (days)',
          'Incubation duty',
          'Maximum number of broods per year',
        ],
        rows: [
          ["Bucephala islandica", "Barrow's goldeneye", 'No', '34', '1 parent', '1'],
          ['Numenius arquata', 'Eurasian curlew', 'No', '30', '2 parents', '1'],
          ['Eremophila alpestris', 'horned lark', 'Yes', '12', '1 parent', '3'],
          ['Zenaida asiatica', 'white-winged dove', 'Yes', '14', '2 parents', '2'],
        ],
      },
      bodyStart: 'In an extensive review of existing literature',
    },
    14: {
      table: {
        title: 'Studies of Cougar Population Density',
        headers: [
          'Study authors',
          'Location',
          'Methods',
          'Minimum density (cougars per 100 square kilometers)',
          'Maximum density (cougars per 100 square kilometers)',
          'Density range (difference between minimum and maximum density, cougars per 100 square kilometers)',
        ],
        rows: [
          ['P. Ian Ross and Martin G. Jalkotzy', 'Alberta (Canada)', 'radio-collar tracking', '2.70', '4.70', '2.00'],
          ['Gregory A. Davidson et al.', 'Oregon (United States)', 'scat-detecting dogs', '2.31', '5.50', '3.19'],
          ['David M. Choate et al.', 'Utah (United States)', 'helicopter surveying', '5.59', '10.24', '4.65'],
          ['Rahel Sollmann et al.', 'Florida (United States)', 'infrared camera trapping, GPS tracking of collars', '1.46', '1.51', '0.05'],
        ],
      },
      bodyStart: 'Researchers have used several different methods',
    },
  },
  'sat-cmp-2024-j10-int-02-2-module-1': {
    10: {
      table: {
        title: 'Defensive Behavior and Reproductive Traits of Select Bird Species',
        headers: [
          'Scientific name',
          'Common name',
          'Performs broken-wing display?',
          'Length of incubation (days)',
          'Incubation duty',
          'Maximum number of broods per year',
        ],
        rows: [
          ['Spatula cyanoptera', 'cinnamon teal', 'No', '25', '1 parent', '1'],
          ['Numenius arquata', 'Eurasian curlew', 'No', '30', '2 parents', '1'],
          ['Eremophila alpestris', 'horned lark', 'Yes', '12', '1 parent', '3'],
          ['Coccyzus americanus', 'yellow-billed cuckoo', 'Yes', '14', '2 parents', '2'],
        ],
      },
      bodyStart: 'In an extensive review of existing literature',
    },
  },
  'sat-cmp-2024-j10-int-03-module-1': {
    11: {
      table: {
        title: 'Defensive Behavior and Reproductive Traits of Select Bird Species',
        headers: [
          'Scientific name',
          'Common name',
          'Performs broken-wing display?',
          'Length of incubation (days)',
          'Incubation duty',
          'Maximum number of broods per year',
        ],
        rows: [
          ['Setophaga caerulescens', 'black-throated blue warbler', 'Yes', '13', '1 parent', '3'],
          ['Spatula cyanoptera', 'cinnamon teal', 'No', '25', '1 parent', '1'],
          ['Haematopus ostralegus', 'Eurasian oystercatcher', 'No', '28', '2 parents', '1'],
          ['Zenaida macroura', 'mourning dove', 'Yes', '15', '2 parents', '7'],
        ],
      },
      bodyStart: 'In an extensive review of existing literature',
    },
  },
  'sat-cmp-2024-j10-na-01-module-2': {
    14: {
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
          ['2', 'dark', '3.46', '2.74', '1.85', '2.45'],
        ],
      },
      bodyStart: "Interested in how differences in the color of dogs' irises",
    },
  },
  'sat-cmp-2024-j10-na-02-module-1': {
    11: {
      table: {
        title: 'Neighboring Species and Target Species in Various Locations',
        headers: ['Neighboring species', 'Target species', 'Location'],
        rows: [
          ['musk thistle', 'Peruvian lily', 'Argentina'],
          ['creeping thistle', 'wild radish', 'United Kingdom'],
          ['leafy spurge', 'yellow evening primrose', 'United States'],
        ],
      },
      bodyStart: 'In a study of interactions between plants',
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
          ['October', '67', '44', '1.98', '2.29'],
          ['July', '87', '62', '2.02', '2.31'],
          ['June', '80', '56', '2.01', '2.31'],
          ['May', '73', '50', '1.98', '2.27'],
        ],
      },
      bodyStart: 'Drosophila (fruit flies) have generation times',
    },
  },

  // ── 2024-11 (K11) ───────────────────────────────────────────────────────────
  'sat-cmp-2024-k11-int-01-module-1': {
    11: {
      table: {
        title: 'Orientation of Paired Leaves in Grapevines and Related Species',
        headers: [
          'Species',
          'Total leaf pairs examined',
          'Pairs with opposite-side orientation',
          'Pairs with same-side orientation',
          'Ratio of opposite-side orientations to same-side orientations (n to 1)',
        ],
        rows: [
          ['Vitis labrusca', '383', '287', '96', '2.99'],
          ['Vitis rupestris', '303', '201', '102', '1.97'],
          ['Vitis amurensis', '207', '146', '61', '2.39'],
          ['Vitis x andersonii', '10', '9', '1', '9.00'],
        ],
      },
      bodyStart: 'Many plants have leaves that are larger',
    },
  },
  'sat-cmp-2024-k11-int-01-module-2': {
    8: {
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
          ['October', '67', '44', '1.98', '2.29'],
          ['July', '87', '62', '2.02', '2.31'],
          ['June', '80', '56', '2.01', '2.31'],
          ['May', '73', '50', '1.98', '2.27'],
        ],
      },
      bodyStart: 'Drosophila (fruit flies) have generation times',
    },
  },
  'sat-cmp-2024-k11-int-02-module-1': {
    11: {
      table: {
        title: 'Orientation of Paired Leaves in Grapevines and Related Species',
        headers: [
          'Species',
          'Total leaf pairs examined',
          'Pairs with opposite-side orientation',
          'Pairs with same-side orientation',
          'Ratio of opposite-side orientations to same-side orientations (n to 1)',
        ],
        rows: [
          ['Vitis labrusca', '383', '287', '96', '2.99'],
          ['Vitis rupestris', '303', '201', '102', '1.97'],
          ['Vitis amurensis', '207', '146', '61', '2.39'],
          ['Vitis x andersonii', '10', '9', '1', '9.00'],
        ],
      },
      bodyStart: 'Many plants have leaves that are larger',
    },
  },
  'sat-cmp-2024-k11-int-03-module-1': {
    12: {
      table: {
        title: 'Number of CFUs of Bacteria after Treatment',
        headers: ['Petri dish number', 'CFUs after treatment with saline', 'CFUs after treatment with venom'],
        rows: [
          ['4', '159', '143'],
          ['6', '289', '153'],
        ],
      },
      bodyStart: 'Scientists recently tested whether scorpion venom',
    },
    13: {
      table: {
        title: 'US Hydroelectric Power Plants, 2019',
        headers: ['Plant', 'State', 'Mode', 'Generators in plant', 'Average power generation (MWh/yr)', 'Water source'],
        rows: [
          ['Spearfish', 'South Dakota', 'run-of-river', '2', '2,204', 'Spearfish Creek'],
          ['Sawmill', 'New Hampshire', 'run-of-river', '4', '14,126', 'Androscoggin River'],
          ['Hiwassee Dam', 'North Carolina', 'peaking', '2', '198,220', 'Hiwassee River'],
          ['Superior Falls', 'Michigan', 'run-of-river', '2', '10,693', 'Montreal River'],
        ],
      },
      bodyStart: 'In 2021, Rocío Uría-Martinez, Megan M. Johnson',
    },
  },
  'sat-cmp-2024-k11-int-03-module-2': {
    8: {
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
          ['September', '80', '54', '1.98', '2.27'],
          ['October', '67', '44', '1.98', '2.29'],
          ['May', '73', '50', '1.98', '2.27'],
          ['July', '87', '62', '2.02', '2.31'],
        ],
      },
      bodyStart: 'Drosophila (fruit flies) have generation times',
    },
  },
  'sat-cmp-2024-k11-int-04-module-1': {
    11: {
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
    13: {
      table: {
        title: 'US Hydroelectric Power Plants, 2019',
        headers: ['Plant', 'State', 'Mode', 'Generators in plant', 'Average power generation (MWh/yr)', 'Water source'],
        rows: [
          ['Richard B. Russell', 'Georgia', 'peaking', '8', '394,195', 'Savannah River'],
          ['Warrensburg Hydroelectric', 'New York', 'run-of-river', '1', '12,135', 'Schroon River'],
          ['White River', 'Wisconsin', 'run-of-river', '2', '3,999', 'White River'],
          ['Norway', 'Indiana', 'run-of-river', '4', '19,751', 'Tippecanoe River'],
        ],
      },
      bodyStart: 'In 2021, Rocío Uría-Martínez, Megan M. Johnson',
    },
  },
  'sat-cmp-2024-k11-int-04-module-2': {
    8: {
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
          ['October', '67', '44', '1.98', '2.29'],
          ['July', '87', '62', '2.02', '2.31'],
          ['June', '80', '56', '2.01', '2.31'],
          ['May', '73', '50', '1.98', '2.27'],
        ],
      },
      bodyStart: 'Drosophila (fruit flies) have generation times',
    },
    9: {
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
          ['July', '87', '62', '2.02', '2.31'],
          ['June', '80', '56', '2.01', '2.31'],
          ['May', '73', '50', '1.98', '2.27'],
          ['October', '67', '44', '1.98', '2.29'],
        ],
      },
      bodyStart: 'Drosophila (fruit flies) have generation times',
    },
  },
  'sat-cmp-2024-k11-na-01-module-1': {
    11: {
      table: {
        title: 'Home Video Game Systems of the 1970s and 1980s',
        headers: ['System', 'Manufacturer', 'System type', 'Approximate number of units sold worldwide'],
        rows: [
          ['Amiga', 'Commodore', 'computer', '1,600,000'],
          ['MSX', 'ASCII Corp.', 'computer', '4,000,000'],
          ['TurboGrafx-16', 'NEC', 'console', '2,650,000'],
          ['Atari 2600', 'Atari', 'console', '18,450,000'],
        ],
      },
      bodyStart: 'A student is writing a research paper',
    },
    12: {
      table: {
        title: 'Millions of Metric Tons of Copper Mined in 1995 and 2020',
        headers: ['Country', '1995', '2020'],
        rows: [
          ['Kazakhstan', '0.26', '0.55'],
          ['Indonesia', '0.44', '0.51'],
          ['United States', '1.85', '1.20'],
          ['Chile', '2.49', '5.73'],
        ],
      },
      bodyStart: 'A student is researching copper mining',
    },
  },
  'sat-cmp-2024-k11-na-02-module-1': {
    11: {
      table: {
        title: 'Impact of Three Key Industries on Oklahoma Economy in 2017',
        headers: [
          'Industry',
          'Approximate total contribution by industry',
          'Number of people employed by industry',
          'Average contribution per employee by industry',
        ],
        rows: [
          ['Accommodation/food services', '$5,242,100,000', '150,373', '$34,861'],
          ['Retail', '$10,738,800,000', '179,208', '$59,924'],
          ['Tribal economic activity', '$7,312,400,000', '51,674', '$141,510'],
        ],
      },
      bodyStart: 'The nearly forty tribes located in Oklahoma',
    },
    13: {
      table: {
        title: 'Mean Body Mass of Birds Known to Perform Broken-Wing Display',
        headers: ['Bird', 'Mean body mass (grams)'],
        rows: [
          ['pied-billed grebe', '409'],
          ['common ringed plover', '60'],
          ['common snipe', '126'],
        ],
      },
      bodyStart: 'One antipredator defense that the grey-headed lapwing',
    },
  },

  // ── 2024-12 (L12) ───────────────────────────────────────────────────────────
  'sat-cmp-2024-l12-int-01-module-1': {
    11: {
      table: {
        title: 'Total Areas of Five Hawaiian Home Lands',
        headers: ['Home land', 'Area (square miles)'],
        rows: [
          ['Nanakuli', '3.61'],
          ['Kawaihae', '15.99'],
          ['Kamoku-Kapulena', '7.47'],
          ['Kahikinui', '37.26'],
          ['Waimea', '23.57'],
        ],
      },
      bodyStart: 'Hawaiian home lands are areas of public land',
    },
    14: {
      table: {
        title: 'Population and Population Density of African Countries in 2015',
        headers: ['Country', 'Density (inhabitants/km2)', 'Area (km2)', 'Estimated population'],
        rows: [
          ['Lesotho', '70.3', '30,355', '2,135,000'],
          ['Mali', '14.2', '1,240,000', '17,600,000'],
          ['Zambia', '21.5', '752,614', '16,212,000'],
          ['Benin', '96.6', '112,620', '10,880,000'],
        ],
      },
      bodyStart: 'As the second-most populous continent in the world',
    },
  },
  'sat-cmp-2024-l12-int-01-module-2': {
    11: {
      table: {
        title: 'Studies of Cougar Population Density',
        headers: [
          'Study authors',
          'Location',
          'Methods',
          'Minimum density (cougars per 100 square kilometers)',
          'Maximum density (cougars per 100 square kilometers)',
          'Density range (difference between minimum and maximum density, cougars per 100 square kilometers)',
        ],
        rows: [
          ['P. Ian Ross and Martin G. Jalkotzy', 'Alberta (Canada)', 'radio-collar tracking', '2.70', '4.70', '2.00'],
          ['Gregory A. Davidson et al.', 'Oregon (United States)', 'scat-detecting dogs', '2.31', '5.50', '3.19'],
          ['David M. Choate et al.', 'Utah (United States)', 'helicopter surveying', '5.59', '10.24', '4.65'],
          ['Rahel Sollmann et al.', 'Florida (United States)', 'infrared camera trapping, GPS tracking of collars', '1.46', '1.51', '0.05'],
        ],
      },
      bodyStart: 'Researchers have used several different methods',
    },
  },
  'sat-cmp-2024-l12-int-02-module-1': {
    11: {
      table: {
        title: 'Total Areas of Five Hawaiian Home Lands',
        headers: ['Home land', 'Area (square miles)'],
        rows: [
          ['Kawaihae', '15.99'],
          ['Kamoku-Kapulena', '7.47'],
          ['Kahikinui', '37.26'],
          ['Makuu', '3.44'],
          ['Hoolehua-Palaau', '21.61'],
        ],
      },
      bodyStart: 'Hawaiian home lands are areas of public land',
    },
  },
  'sat-cmp-2024-l12-int-02-module-2': {
    9: {
      table: {
        title: 'Studies of Cougar Population Density',
        headers: [
          'Study authors',
          'Location',
          'Methods',
          'Minimum density (cougars per 100 square kilometers)',
          'Maximum density (cougars per 100 square kilometers)',
          'Density range (difference between minimum and maximum density, cougars per 100 square kilometers)',
        ],
        rows: [
          ['P. Ian Ross and Martin G. Jalkotzy', 'Alberta (Canada)', 'radio-collar tracking', '2.70', '4.70', '2.00'],
          ['Gregory A. Davidson et al.', 'Oregon (United States)', 'scat-detecting dogs', '2.31', '5.50', '3.19'],
          ['David M. Choate et al.', 'Utah (United States)', 'helicopter surveying', '5.59', '10.24', '4.65'],
          ['Rahel Sollmann et al.', 'Florida (United States)', 'infrared camera trapping, GPS tracking of collars', '1.46', '1.51', '0.05'],
        ],
      },
      bodyStart: 'Researchers have used several different methods',
    },
    10: {
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
  'sat-cmp-2024-l12-int-03-module-1': {
    11: {
      table: {
        title: 'Names and Movements of Snakes during Trials',
        headers: ['Name of snake', 'Species name', 'Common name', 'Direction of movement'],
        rows: [
          ['Glory', 'Acanthophis antarcticus', 'common death adder', 'away from sound'],
          ['Bitey Boy', 'Aspidites ramsayi', 'woma python', 'toward sound'],
          ['Boss', 'Oxyuranus scutellatus', 'coastal taipan', 'away from sound'],
        ],
      },
      bodyStart: 'Biologists Christina Zdenek, Damian Candusso',
    },
  },
  'sat-cmp-2024-l12-int-03-module-2': {
    8: {
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
          ['May', '73', '50', '1.98', '2.27'],
          ['July', '87', '62', '2.02', '2.31'],
          ['September', '80', '54', '1.98', '2.27'],
          ['October', '67', '44', '1.98', '2.29'],
        ],
      },
      bodyStart: 'Drosophila (fruit flies) have generation times',
    },
  },
  'sat-cmp-2024-l12-int-04-module-1': {
    10: {
      table: {
        title: 'Names and Movements of Snakes during Trials',
        headers: ['Name of snake', 'Species name', 'Common name', 'Direction of movement'],
        rows: [
          ['Glory', 'Acanthophis antarcticus', 'common death adder', 'away from sound'],
          ['Dorsal Girl', 'Aspidites ramsayi', 'woma python', 'toward sound'],
          ['Squishy', 'Oxyuranus scutellatus', 'coastal taipan', 'away from sound'],
        ],
      },
      bodyStart: 'Biologists Christina Zdenek, Damian Candusso',
    },
  },
  'sat-cmp-2024-l12-na-01-module-1': {
    11: {
      table: {
        title: 'Effect of Neighboring Species on Pollinator Visits to Target Species',
        headers: ['Neighboring species', 'Target species', 'Effect value'],
        rows: [
          ['sticky catchfly', 'common cow-wheat', '0.2379'],
          ['leafy spurge', 'purple locoweed', '-0.8428'],
          ['prickly pear', 'sea heath', '-0.4703'],
          ['Canadian wood betony', 'mayapple', '0.4729'],
        ],
      },
      bodyStart: 'Researchers Carolina Laura Morales and Anna Traveset',
    },
    14: {
      table: {
        title: 'Composition and Fracture Toughness of Five HEAs',
        headers: [
          'HEA identification number',
          'Composition (%)',
          'Fracture toughness (megapascals times the square root of crack length)',
        ],
        rows: [
          ['15', 'chromium (33.33), cobalt (33.33), nickel (33.33)', '265.20'],
          ['7', 'chromium (20), cobalt (20), iron (20), manganese (20), nickel (20)', '219.00'],
          ['25', 'aluminum (1.07), carbon (46.78), chromium (1.07), cobalt (1.07), copper (1.07), iron (1.07), nickel (1.07), tungsten (46.78)', '10.41'],
          ['95', 'aluminum (20), cobalt (20), copper (20), nickel (20), zinc (25)', '4.45'],
          ['51', 'molybdenum (25), niobium (25), tantalum (25), tungsten (25)', '3.30'],
        ],
      },
      bodyStart: 'High-entropy alloys (HEAS) have been observed',
    },
  },
  'sat-cmp-2024-l12-na-02-module-1': {
    11: {
      table: {
        title: 'Numbers of the 23 Non-native Tree Species Reported and the Insect and Fungus Threats to Them',
        headers: ['Country', 'Trees', 'Fungi', 'Insects'],
        rows: [
          ['Great Britain', '18', '290', '120'],
          ['Hungary', '1', '18', '13'],
          ['Switzerland', '11', '43', '78'],
        ],
      },
      bodyStart: 'Elisabeth Pötzelsberger and colleagues gathered data',
    },
  },
  'sat-cmp-2024-l12-na-03-module-1': {
    10: {
      table: {
        title: 'Home Video Game Systems of the 1970s and 1980s',
        headers: ['System', 'Manufacturer', 'Approximate number of units sold worldwide'],
        rows: [
          ['ColecoVision', 'Coleco', '2,000,000'],
          ['Game & Watch', 'Nintendo', '18,600,000'],
          ['Intellivision', 'Mattel', '3,000,000'],
          ['Apple II', 'Apple Inc.', '4,487,000'],
        ],
      },
      bodyStart: 'A student is researching the ColecoVision',
    },
    13: {
      table: {
        headers: [
          'Country',
          'Percent change in exports to US, pre-FTA',
          'Percent change in exports to US, post-FTA',
          'Percent change in total exports, pre-FTA',
          'Percent change in total exports, post-FTA',
        ],
        rows: [
          ['Australia', '8.8', '-2.3', '6.8', '7.1'],
          ['Guatemala', '13.5', '16.7', '13.8', '20.1'],
          ['Jordan', '-5.3', '42.1', '-5.5', '36.7'],
          ['Morocco', '12.7', '42.8', '19.6', '4.9'],
          ['Panama', '-6.8', '7.3', '10.0', '11.0'],
        ],
      },
      bodyStart: 'A 2022 US Department of Agriculture report',
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
