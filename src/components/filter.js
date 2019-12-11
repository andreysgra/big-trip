import {createElement} from '../utils.js';

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return `
      <form class="trip-filters" action="#" method="get">
        <div class="trip-filters__filter">
          ${this._filters
          .map((filter, index) => {
            return `
              <input id="filter-${filter}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter"
                value="${filter}" ${index === 0 ? `checked` : ``}>
              <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
            `;
          })
          .join(``)}
        </div>
      </form>
    `;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
