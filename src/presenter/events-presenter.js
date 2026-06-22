import TripSortView from '../view/trip-sort-view';
import {render} from '../framework/render';
import TripEventsListView from '../view/trip-events-list-view';
import TripEventView from '../view/trip-event-view';
import TripEventFormView from '../view/trip-event-form-view';

export default class EventsPresenter {
  #container = null;

  #pointsModel = null;
  #points = [];

  #tripSorComponent = new TripSortView;
  #tripEventsListComponent = new TripEventsListView();

  constructor({container, pointsModel}) {
    this.#container = container;

    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    render(this.#tripSorComponent, this.#container);
    render(this.#tripEventsListComponent, this.#container);
    render(new TripEventFormView, this.#tripEventsListComponent.element);

    for (let i = 0; i < 3; i++) {
      render(new TripEventView(), this.#tripEventsListComponent.element);
    }
  }
}
