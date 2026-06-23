import AbstractView from '../framework/view/abstract-view';
import {FilterType} from '../const';
import dayjs from 'dayjs';
import {capitalizeFirstLetter} from '../utils/common';

const isFilterDisabled = (filterType, points) => {
  const now = dayjs();

  switch (filterType) {
    case FilterType.FUTURE:
      return !points.some((point) => dayjs(point.dateFrom).isAfter(now));
    case FilterType.PRESENT:
      return !points.some((point) =>
        (dayjs(point.dateFrom).isBefore(now) || dayjs(point.dateFrom).isSame(now)) && dayjs(point.dateTo).isAfter(now));
    case FilterType.PAST:
      return !points.some((point) => dayjs(point.dateTo).isBefore(now));
    default:
      return false;
  }
};

const createTripFilterTemplate = (filterType, currentFilter, isDisabled) => `
  <div class="trip-filters__filter">
    <input
      id="filter-${filterType}"
      class="trip-filters__filter-input visually-hidden"
      type="radio"
      name="trip-filter"
      value="${filterType}"
      ${(currentFilter === filterType) ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
    <label class="trip-filters__filter-label" for="filter-${filterType}">${capitalizeFirstLetter(filterType)}</label>
  </div>
`;

const createTripFiltersTemplate = (points) => {
  const filterItems = Object.values(FilterType)
    .map((filterType) => {
      const isDisabled = isFilterDisabled(filterType, points);

      return createTripFilterTemplate(filterType, FilterType.EVERYTHING, isDisabled);
    })
    .join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItems}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};

export default class TripFiltersView extends AbstractView {
  #points = null;

  constructor({points}) {
    super();

    this.#points = points;
  }

  get template() {
    return createTripFiltersTemplate(this.#points);
  }
}
