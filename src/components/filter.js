const getFiltersComponent = (filters) => {
  return `
    <form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        ${filters
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
};

export {
  getFiltersComponent
};
