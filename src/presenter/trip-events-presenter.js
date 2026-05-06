import TripSortView from '../view/trip-sort-view';
import {render, replace} from '../framework/render';
import TripEventsListView from '../view/trip-events-list-view';
import TripEventsItemView from '../view/trip-events-item-view';
import TripEventFormView from '../view/trip-event-form-view';
import {sortPointsByDate} from '../utils/point';
import {addEscapeEvent} from '../utils/common';
import TripEventsListEmptyView from '../view/trip-events-list-empty-view';
import {FilterType} from '../const';

export default class TripEventsPresenter {
  #container = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #points = [];
  #destinations = [];
  #offers = [];

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
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    if (this.#points.length === 0) {
      render(new TripEventsListEmptyView(FilterType.EVERYTHING), this.#container);

      return;
    }

    render(this.#tripSorComponent, this.#container);
    render(this.#tripEventsListComponent, this.#container);

    this.#points.forEach((point) => this.#renderPoints(point));
  }

  #renderPoints = (point) => {
    const destination = this.#destinationsModel.getDestination(point.destination);
    const offers = this.#offersModel.getOffersByType(point.type);
    const offersByType = this.#offersModel.getOffersByType(point.type);

    const onEscKeyDown = (evt) => {
      addEscapeEvent(evt, replaceFormToCard);
      document.removeEventListener('keydown', onEscKeyDown);
    };

    const tripEventsItemComponent = new TripEventsItemView({
      point, destination, offers, onRollupClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', onEscKeyDown);
      }});

    const tripEventFormComponent = new TripEventFormView({
      point, destinations: this.#destinations, offers: this.#offers,
      offersByType, onRollupClick: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    });

    function replaceCardToForm() {
      replace(tripEventFormComponent, tripEventsItemComponent);
    }

    function replaceFormToCard() {
      replace(tripEventsItemComponent, tripEventFormComponent);
    }

    render(tripEventsItemComponent, this.#tripEventsListComponent.element);
  };
}
