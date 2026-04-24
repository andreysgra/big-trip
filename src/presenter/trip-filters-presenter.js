import TripFiltersView from '../view/trip-filters-view';
import {render} from '../framework/render';

export default class TripFiltersPresenter {
  #container = null;
  #tripFiltersComponent = new TripFiltersView();

  constructor(container) {
    this.#container = container;
  }

  init() {
    render(this.#tripFiltersComponent, this.#container);
  }
}
