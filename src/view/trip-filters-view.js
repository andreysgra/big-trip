import AbstractView from '../framework/view/abstract-view';
import {capitalizeFirstLetter} from '../utils/common';

const createTripFilterTemplate = ({name, count}, currentFilter) => `
  <div class="trip-filters__filter">
    <input
      id="filter-${name}"
      class="trip-filters__filter-input visually-hidden"
      type="radio"
      name="trip-filter"
      value="${name}"
      ${(currentFilter === name) ? 'checked' : ''}
      ${(count === 0) ? 'disabled' : ''}
    >
    <label class="trip-filters__filter-label" for="filter-${name}">${capitalizeFirstLetter(name)}</label>
  </div>
`;

const createTripFiltersTemplate = (filters, currentFilter) => `
    <form class="trip-filters" action="#" method="get">
      ${filters
    .map((filter) => createTripFilterTemplate(filter, currentFilter))
    .join('')}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;


export default class TripFiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  #handleFilterChange = () => null;

  constructor({filters, currentFilter, onFilterChange}) {
    super();

    this.#filters = filters;
    this.#currentFilter = currentFilter;

    this.#handleFilterChange = onFilterChange;

    this.element.addEventListener('click', this.#filterChangeHandler);
  }

  get template() {
    return createTripFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterChangeHandler = (evt) => {
    if (evt.target.closest('.trip-filters__filter-input')) {
      evt.preventDefault();

      this.#handleFilterChange(evt.target.value);
    }
  };
}
