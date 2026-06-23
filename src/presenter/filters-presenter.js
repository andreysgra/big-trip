import TripFiltersView from '../view/trip-filters-view';
import {render} from '../framework/render';

export default class FiltersPresenter {
  #container = null;

  #pointsModel = null;

  #tripFiltersComponent = null;

  constructor({container, pointsModel}) {
    this.#container = container;

    this.#pointsModel = pointsModel;
  }

  init() {
    this.#tripFiltersComponent = new TripFiltersView({points: this.#pointsModel.points});
    render(this.#tripFiltersComponent, this.#container);
  }
}
