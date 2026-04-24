import TripInfoView from '../view/trip-info-view';
import {render, RenderPosition} from '../framework/render';
import TripInfoMainView from '../view/trip-info-main-view';
import TripInfoCostView from '../view/trip-info-cost-view';

export default class TripInfoPresenter {
  #container = null;
  #tripInfoComponent = new TripInfoView();
  #tripInfoMainComponent = new TripInfoMainView();
  #tripInfoCostComponent = new TripInfoCostView();

  constructor(container) {
    this.#container = container;
  }

  init() {
    render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
    render(this.#tripInfoMainComponent, this.#tripInfoComponent.element);
    render(this.#tripInfoCostComponent, this.#tripInfoComponent.element);
  }
}
