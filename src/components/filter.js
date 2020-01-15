import AbstractComponent from './abstract-component.js';

const FILTER_ID_PREFIX = `filter-`;

const createFilterMarkup = ((filter, isChecked) => {
  const {name} = filter;

  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${name}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${name}"
        ${isChecked ? `checked` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-${name}">
        ${name}
      </label>
    </div>
  `;
});

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    const filtersMarkup = this._filters
      .map((filter) => createFilterMarkup(filter, filter.checked))
      .join(``);

    return `
      <form class="trip-filters" action="#" method="get">
        ${filtersMarkup}
      </form>
    `;
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
