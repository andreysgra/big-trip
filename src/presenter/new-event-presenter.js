import TripEventFormView from '../view/trip-event-form-view';
import {BLANK_POINT, UpdateType, UserAction} from '../const';
import {remove, render, RenderPosition} from '../framework/render';

export default class NewEventPresenter {
  #container = null;

  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = () => null;
  #handleDestroy = () => null;

  #tripEventFormComponent = null;

  constructor({container, destinationsModel, offersModel, onDataChange, onDestroy}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  destroy() {
    if (this.#tripEventFormComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#tripEventFormComponent);
    this.#tripEventFormComponent = null;
  }

  init() {
    if (this.#tripEventFormComponent !== null) {
      return;
    }

    this.#tripEventFormComponent = new TripEventFormView({
      point: {
        ...BLANK_POINT,
        destination: this.#destinationsModel.getDefaultDestinationId()
      },
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      isNewEvent: true,
      onFormSubmit: this.#formSubmitHandler,
      onDeleteButtonClick: this.#deleteButtonClickHandler
    });

    render(this.#tripEventFormComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #deleteButtonClickHandler = () => {
    this.destroy();
  };

  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {
        id: crypto.randomUUID(),
        ...point
      }
    );

    this.destroy();
  };
}
