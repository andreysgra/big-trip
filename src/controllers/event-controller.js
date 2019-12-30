import TripEventComponent from '../components/trip-event.js';
import TripEventEditComponent from '../components/trip-event-edit.js';
import {renderComponent, replaceComponent} from '../utils/render.js';
import {Mode} from '../const.js';

export default class EventController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._eventEditComponent.reset();

    replaceComponent(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceEventToEdit() {
    this._onViewChange();

    replaceComponent(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  render(event) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new TripEventComponent(event);
    this._eventEditComponent = new TripEventEditComponent(event);

    this._eventComponent.setRollupButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
    });

    this._eventEditComponent.setRollupButtonClickHandler(() => this._replaceEditToEvent());

    this._eventEditComponent.setFavoriteCheckboxChangeHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {isFavorite: !event.isFavorite}));
    });

    if (oldEventEditComponent && oldEventComponent) {
      replaceComponent(this._eventComponent, oldEventComponent);
      replaceComponent(this._eventEditComponent, oldEventEditComponent);
    } else {
      renderComponent(this._container, this._eventComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }
}
