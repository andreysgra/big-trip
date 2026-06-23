import TripSortView from '../view/trip-sort-view';
import {render, replace} from '../framework/render';
import TripEventsListView from '../view/trip-events-list-view';
import TripEventView from '../view/trip-event-view';
import TripEventFormView from '../view/trip-event-form-view';
import {sortPointsByDate} from '../utils/point';
import {addEscapeEvent} from '../utils/common';
import TripEventsListEmptyView from '../view/trip-events-list-empty-view';
import {FilterType} from '../const';

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

    this.#renderBoard();
  }

  #renderBoard() {
    if (this.#points.length === 0) {
      this.#renderTripEventsListEmpty();

      return;
    }

    this.#renderSort();
    this.#renderTripEventsList();
    this.#renderPoints();
  }

  #renderPoint = (point) => {
    const destination = this.#destinationsModel.getDestination(point.destination);
    const offers = this.#offersModel.getOffersByType(point.type);
    const offersByType = this.#offersModel.getOffersByType(point.type);

    const onEscKeyDown = (evt) => {
      addEscapeEvent(evt, replaceFormToCard);
      document.removeEventListener('keydown', onEscKeyDown);
    };

    const tripEventComponent = new TripEventView({
      point,
      destination,
      offers,
      onRollupClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', onEscKeyDown);
      }
    });

    const tripEventFormComponent = new TripEventFormView({
      point,
      destinations: this.#destinations,
      offers: this.#offers,
      offersByType,
      onRollupClick: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      },
      onFormSubmit: ()=> {
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    });

    function replaceCardToForm() {
      replace(tripEventFormComponent, tripEventComponent);
    }

    function replaceFormToCard() {
      replace(tripEventComponent, tripEventFormComponent);
    }

    render(tripEventComponent, this.#tripEventsListComponent.element);
  };

  #renderPoints() {
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #renderSort() {
    render(this.#tripSorComponent, this.#container);
  }

  #renderTripEventsList() {
    render(this.#tripEventsListComponent, this.#container);
  }

  #renderTripEventsListEmpty() {
    render(new TripEventsListEmptyView({filterType: FilterType.EVERYTHING}), this.#container);
  }
}
