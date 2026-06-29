export const MAX_OFFERS_COUNT = 3;

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};

export const NoTripEventsMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

export const BLANK_POINT = {
  basePrice: 0,
  type: 'sightseeing',
  destination: '',
  offers: [],
  dateFrom: new Date(),
  dateTo: new Date(),
  isFavorite: false
};
