import TripEventComponent from '../components/trip-event.js';
import TripEventEditComponent from '../components/trip-event-edit.js';
import {renderComponent, replaceComponent} from '../utils/render.js';

export default class EventController {
  constructor(container) {
    this._container = container;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  _replaceEditToEvent() {
    // this._taskEditComponent.reset();

    replaceComponent(this._eventComponent, this._eventEditComponent);
    // this._mode = Mode.DEFAULT;
  }

  _replaceEventToEdit() {
    replaceComponent(this._eventEditComponent, this._eventComponent);
    // this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  render(event) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new TripEventComponent(event);
    this._eventEditComponent = new TripEventEditComponent(event);

    this._eventComponent.setRollupButtonHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler(() => this._replaceEditToEvent());

    if (oldEventEditComponent && oldEventComponent) {
      replaceComponent(this._eventComponent, oldEventComponent);
      replaceComponent(this._eventEditComponent, oldEventEditComponent);
    } else {
      renderComponent(this._container, this._eventComponent);
    }
  }
}
