import TripEventComponent from '../components/trip-event.js';
import TripEventEditComponent from '../components/trip-event-edit.js';
import {renderComponent, replaceComponent, removeComponent, RenderPosition} from '../utils/render.js';
import {Mode, EmptyEvent} from '../const.js';

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
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyEvent, null);
      }

      this._replaceEditToEvent();
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

  destroy() {
    removeComponent(this._eventEditComponent);
    removeComponent(this._eventComponent);

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  render(event, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._mode = mode;

    this._eventComponent = new TripEventComponent(event);
    this._eventEditComponent = new TripEventEditComponent(event, this._mode);

    this._eventComponent.setRollupButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() =>
      this._onDataChange(this, event, null)
    );

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      const data = this._eventEditComponent.getData();
      this._onDataChange(this, event, data);
    });

    this._eventEditComponent.setRollupButtonClickHandler(() => this._replaceEditToEvent());

    this._eventEditComponent.setFavoriteCheckboxChangeHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {isFavorite: !event.isFavorite}));
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventEditComponent && oldEventComponent) {
          replaceComponent(this._eventComponent, oldEventComponent);
          replaceComponent(this._eventEditComponent, oldEventEditComponent);
          this._replaceEditToEvent();
        } else {
          renderComponent(this._container, this._eventComponent);
        }
        break;
      case Mode.ADDING:
        if (oldEventEditComponent && oldEventComponent) {
          removeComponent(oldEventComponent);
          removeComponent(oldEventEditComponent);
        }

        document.addEventListener(`keydown`, this._onEscKeyDown);
        renderComponent(this._container, this._eventEditComponent, RenderPosition.AFTEREND);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }
}
