import TripFiltersView from '../view/trip-filters-view';
import {render} from '../framework/render';
import {filter} from '../utils/filter';

export default class FiltersPresenter {
  #container = null;

  #pointsModel = null;

  #tripFiltersComponent = null;

  constructor({container, pointsModel}) {
    this.#container = container;

    this.#pointsModel = pointsModel;
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

    this.#tripFiltersComponent = new TripFiltersView({filters});
    render(this.#tripFiltersComponent, this.#container);
  }
}
