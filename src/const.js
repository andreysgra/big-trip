export const EventType = {
  TRANSFERS: [
    `bus`,
    `drive`,
    `flight`,
    `ship`,
    `taxi`,
    `train`,
    `transport`
  ],
  ACTIVITIES: [
    `check-in`,
    `restaurant`,
    `sightseeing`
  ]
};

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const SortType = {
  DEFAULT: `event`,
  TIME_DOWN: `time`,
  PRICE_DOWN: `price`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const MenuItem = {
  TABLE: `table`,
  STATS: `stats`
};

export const ChartTitle = {
  MONEY: `money`,
  TRANSPORT: `transport`,
  TIME_SPENT: `time spent`
};

export const EmptyEvent = {
  id: String(Math.round(Date.now() * Math.random())),
  type: `bus`,
  destination: {
    name: ``,
    description: ``,
    pictures: [{
      src: ``,
      description: ``
    }]
  },
  offers: [],
  startDate: Date.now(),
  endDate: Date.now(),
  price: 0,
  isFavorite: false
};
