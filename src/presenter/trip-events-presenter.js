import TripSortView from '../view/trip-sort-view';
import {render} from '../framework/render';
import TripEventsListView from '../view/trip-events-list-view';
import TripEventsItemView from '../view/trip-events-item-view';
import TripEventFormView from '../view/trip-event-form-view';
import {sortPointsByDate} from '../utils/point';

export default class TripEventsPresenter {
  #container = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];
  #tripSorComponent = new TripSortView;
  #tripEventsListComponent = new TripEventsListView();

  constructor(container, pointsModel, destinationsModel, offersModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points].sort(sortPointsByDate);

    render(this.#tripSorComponent, this.#container);
    render(this.#tripEventsListComponent, this.#container);
    render(new TripEventFormView, this.#tripEventsListComponent.element);

    this.#points.forEach((point) => {
      const destination = this.#destinationsModel.getDestination(point.destination);
      const offers = this.#offersModel.getOffers(point.type);

      render(new TripEventsItemView(point, destination, offers), this.#tripEventsListComponent.element);
    });
  }
}
