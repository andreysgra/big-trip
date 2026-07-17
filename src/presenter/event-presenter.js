import TripEventView from '../view/trip-event-view';
import {remove, render, replace} from '../framework/render';
import {addEscapeEvent} from '../utils/common';
import TripEventFormView from '../view/trip-event-form-view';
import {BLANK_POINT, UpdateType, UserAction} from '../const';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #container = null;

  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = () => null;
  #handleModeChange = () => null;

  #point = BLANK_POINT;
  #mode = Mode.DEFAULT;

  #tripEventComponent = null;
  #tripEventFormComponent = null;

  constructor({container, destinationsModel, offersModel, onDataChange, onModeChange}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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
      onRollupClick: this.#rollupClickHandler,
      onFavoriteButtonClick: this.#favoriteButtonClickHandler
    });

    this.#tripEventFormComponent = new TripEventFormView({
      point: this.#point,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onRollupClick: this.#rollupClickHandler,
      onFormSubmit: this.#formSubmitHandler,
      onDeleteButtonClick: this.#deleteButtonClickHandler
    });

    if (currentTripEventComponent === null || currentTripEventFormComponent === null) {
      render(this.#tripEventComponent, this.#container);

      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripEventComponent, currentTripEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#tripEventFormComponent, currentTripEventFormComponent);
    }

    remove(currentTripEventComponent);
    remove(currentTripEventFormComponent);
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#tripEventComponent.shake();

      return;
    }

    const resetFormState = () => {
      this.#tripEventFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#tripEventFormComponent.shake(resetFormState);
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#tripEventFormComponent.updateElement({
        isDisabled: true,
        isDeleting: true
      });
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#tripEventFormComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#tripEventFormComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#tripEventFormComponent, this.#tripEventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#tripEventComponent, this.#tripEventFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #deleteButtonClickHandler = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #escKeyDownHandler = (evt) => {
    addEscapeEvent(evt, () => {
      this.#tripEventFormComponent.reset(this.#point);
      this.#replaceFormToCard();
    });
  };

  #favoriteButtonClickHandler = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      });
  };

  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #rollupClickHandler = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#replaceCardToForm();
    } else {
      this.#tripEventFormComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };
}
