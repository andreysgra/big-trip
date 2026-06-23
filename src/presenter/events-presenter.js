import TripSortView from '../view/trip-sort-view';
import {render} from '../framework/render';
import TripEventsListView from '../view/trip-events-list-view';
import TripEventView from '../view/trip-event-view';
import TripEventFormView from '../view/trip-event-form-view';
import {sortPointsByDate} from '../utils/point';

export default class EventsPresenter {
  #container = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #points = [];
  #destinations = [];
  #offers = [];

  #tripSorComponent = new TripSortView;
  #tripEventsListComponent = new TripEventsListView();

  constructor({container, pointsModel, destinationsModel, offersModel}) {
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points].sort(sortPointsByDate);
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    render(this.#tripSorComponent, this.#container);
    render(this.#tripEventsListComponent, this.#container);

    render(new TripEventFormView({
      point: this.#points[0],
      destinations: this.#destinations,
      offers: this.#offers,
      offersByType: this.#offersModel.getOffersByType(this.#points[0].type)
    }), this.#tripEventsListComponent.element);

    this.#points.forEach((point) => {
      const destination = this.#destinationsModel.getDestination(point.destination);
      const offers = this.#offersModel.getOffersByType(point.type);

      render(new TripEventView({point, destination, offers}), this.#tripEventsListComponent.element);
    });
  }
}
