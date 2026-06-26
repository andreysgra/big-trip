import TripEventView from '../view/trip-event-view';
import {remove, render, replace} from '../framework/render';
import {addEscapeEvent} from '../utils/common';
import TripEventFormView from '../view/trip-event-form-view';
import {BLANK_POINT} from '../const';

export default class EventPresenter {
  #container = null;

  #destinationsModel = null;
  #offersModel = null;

  #point = BLANK_POINT;

  #tripEventComponent = null;
  #tripEventFormComponent = null;

  constructor({container, destinationsModel, offersModel}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  destroy() {
    remove(this.#tripEventComponent);
    remove(this.#tripEventFormComponent);
  }

  init(point) {
    this.#point = point;

    const currentTripEventComponent = this.#tripEventComponent;
    const currentTripEventFormComponent = this.#tripEventFormComponent;

    this.#tripEventComponent = new TripEventView({
      point: this.#point,
      destination: this.#destinationsModel.getDestination(point.destination),
      offersByType: this.#offersModel.getOffersByType(point.type),
      onRollupClick: this.#rollupClickHandler
    });

    this.#tripEventFormComponent = new TripEventFormView({
      point: this.#point,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      offersByType: this.#offersModel.getOffersByType(point.type),
      onRollupClick: this.#rollupClickHandler,
      onFormSubmit: this.#formSubmitHandler
    });

    if (currentTripEventComponent === null || currentTripEventFormComponent === null) {
      render(this.#tripEventComponent, this.#container);

      return;
    }

    if (this.#container.contains(currentTripEventComponent.element)) {
      replace(this.#tripEventComponent, currentTripEventComponent);
    }

    if (this.#container.contains(currentTripEventFormComponent.element)) {
      replace(this.#tripEventFormComponent, currentTripEventFormComponent);
    }

    remove(currentTripEventComponent);
    remove(currentTripEventFormComponent);
  }

  #replaceCardToForm() {
    replace(this.#tripEventFormComponent, this.#tripEventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#tripEventComponent, this.#tripEventFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    addEscapeEvent(evt, () => this.#replaceFormToCard());
  };

  #formSubmitHandler = () => {
    this.#replaceFormToCard();
  };

  #rollupClickHandler = () => {
    if (this.#container.contains(this.#tripEventComponent.element)) {
      this.#replaceCardToForm();
    } else {
      this.#replaceFormToCard();
    }
  };
}
