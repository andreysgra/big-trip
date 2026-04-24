import TripSortView from '../view/trip-sort-view';
import {render} from '../framework/render';
import TripEventsListView from '../view/trip-events-list-view';
import TripEventsItemView from '../view/trip-events-item-view';
import TripEventFormView from '../view/trip-event-form-view';

export default class TripEventsPresenter {
  #container = null;
  #tripSorComponent = new TripSortView;
  #tripEventsListComponent = new TripEventsListView();

  constructor(container) {
    this.#container = container;
  }

  init() {
    render(this.#tripSorComponent, this.#container);
    render(this.#tripEventsListComponent, this.#container);
    render(new TripEventFormView, this.#tripEventsListComponent.element);

    for (let i = 0; i < 3; i++) {
      render(new TripEventsItemView(), this.#tripEventsListComponent.element);
    }
  }
}
