import TripSortView from '../view/trip-sort-view';
import {render, replace} from '../framework/render';
import TripEventsListView from '../view/trip-events-list-view';
import TripEventsItemView from '../view/trip-events-item-view';
import TripEventFormView from '../view/trip-event-form-view';
import {sortPointsByDate} from '../utils/point';
import {addEscapeEvent} from '../utils/common';

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

    render(this.#tripSorComponent, this.#container);
    render(this.#tripEventsListComponent, this.#container);

    this.#points.forEach((point) => this.#renderPoints(point));
  }

  #renderPoints = (point) => {
    const destination = this.#destinationsModel.getDestination(point.destination);
    const offers = this.#offersModel.getOffersByType(point.type);
    const offersByType = this.#offersModel.getOffersByType(point.type);

    const tripEventsItemComponent = new TripEventsItemView(point, destination, offers);
    const tripEventFormComponent = new TripEventFormView(point, this.#destinations,
      this.#offers, offersByType);

    const replaceCardToForm = () => replace(tripEventFormComponent, tripEventsItemComponent);

    const replaceFormToCard = () => replace(tripEventsItemComponent, tripEventFormComponent);

    const onEscKeyDown = (evt) => {
      addEscapeEvent(evt, replaceFormToCard);
      document.removeEventListener('keydown', onEscKeyDown);
    };

    tripEventsItemComponent.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', () => {
        replaceCardToForm();
        document.addEventListener('keydown', onEscKeyDown);
      });

    tripEventFormComponent.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', () => {
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      });

    tripEventFormComponent.element
      .querySelector('.event__save-btn')
      .addEventListener('click', (evt) => {
        evt.preventDefault();
        replaceFormToCard();
      });

    render(tripEventsItemComponent, this.#tripEventsListComponent.element);
  };
}
