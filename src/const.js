const EVENT_TYPES = {
  transfers: [
    `bus`,
    `drive`,
    `flight`,
    `ship`,
    `taxi`,
    `train`,
    `transport`
  ],
  activities: [
    `check-in`,
    `restaurant`,
    `sightseeing`
  ]
};

const CITIES = [
  `Amsterdam`,
  `Rotterdam`,
  `Berlin`,
  `Vienna`,
  `Prague`,
  `Paris`
];

const OFFERS = [
  {
    type: `luggage`,
    title: `Add luggage`,
    price: 10
  },
  {
    type: `comfort`,
    title: `Switch to comfort class`,
    price: 150
  },
  {
    type: `meal`,
    title: `Add meal`,
    price: 2
  },
  {
    type: `seats`,
    title: `Choose seats`,
    price: 9
  },
  {
    type: `train`,
    title: `Travel by train`,
    price: 40
  }
];

const FILTERS = [
  `everything`,
  `future`,
  `past`
];

const MENU_ITEMS = [
  `Table`,
  `Stats`
];


export {EVENT_TYPES, CITIES, OFFERS, FILTERS, MENU_ITEMS};
