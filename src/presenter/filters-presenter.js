import TripFiltersView from '../view/trip-filters-view';
import {remove, render, replace} from '../framework/render';
import {filter} from '../utils/filter';
import {UpdateType} from '../const';

export default class FiltersPresenter {
  #container = null;

  #pointsModel = null;
  #filterModel = null;

  #currentFilter = null;

  #tripFiltersComponent = null;

  constructor({container, pointsModel, filterModel}) {
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.entries(filter)
      .map(([filterName, filterPoints]) => (
        {
          name: filterName,
          count: filterPoints(points).length
        }
      ));
  }

  init() {
    const filters = this.filters;
    const currentFiltersComponent = this.#tripFiltersComponent;

    this.#currentFilter = this.#filterModel.getFilter();

    this.#tripFiltersComponent = new TripFiltersView({
      filters,
      currentFilter: this.#currentFilter,
      onFilterChange: this.#filterChangeHandler
    });

    if (currentFiltersComponent === null) {
      render(this.#tripFiltersComponent, this.#container);
    } else {
      replace(this.#tripFiltersComponent, currentFiltersComponent);
      remove(currentFiltersComponent);
    }
  }

  #filterChangeHandler = (filterType) => {
    if (this.#filterModel.getFilter() === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #modelEventHandler = () => {
    this.init();
  };
}
