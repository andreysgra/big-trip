import TripInfoComponent from '../components/trip-info.js';
import TripSortComponent from '../components/trip-sort.js';
import TripDaysComponent from '../components/trip-days.js';
import TripDayComponent from '../components/trip-day.js';
import TripEventsComponent from '../components/trip-events.js';
import TripEventComponent from '../components/trip-event.js';
import TripEventEditComponent from '../components/trip-event-edit.js';
import NoEventsComponent from '../components/no-events.js';
import {renderComponent, replaceComponent, RenderPosition} from '../utils/render.js';
import {addEscapeEvent} from '../utils/common.js';

let lastEvent = null;
let lastEditEvent = null;

const renderEvent = (container, event) => {
  const eventComponent = new TripEventComponent(event);
  const eventEditComponent = new TripEventEditComponent(event);

  const replaceEventToEdit = () => {
    replaceComponent(lastEvent, lastEditEvent);
    document.removeEventListener(`keydown`, documentEscPressHandler);

    lastEvent = null;
    lastEditEvent = null;
  };

  const documentEscPressHandler = (evt) => {
    if (container.getElement().contains(eventEditComponent.getElement())) {
      addEscapeEvent(evt, replaceEventToEdit);
    }
  };

  const eventEditHandler = () => {
    if (lastEditEvent) {
      replaceEventToEdit();
    }

    replaceComponent(eventEditComponent, eventComponent);

    lastEvent = eventComponent;
    lastEditEvent = eventEditComponent;

    document.addEventListener(`keydown`, documentEscPressHandler);
  };

  const eventSubmitHadler = () => {
    replaceEventToEdit();
  };

  eventComponent.setRollupButtonHandler(eventEditHandler);
  eventEditComponent.setSubmitFormHandler(eventSubmitHadler);

  renderComponent(container.getElement(), eventComponent);
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._noEventsComponent = new NoEventsComponent();
    this._tripSortComponent = new TripSortComponent();
    this._tripDaysComponent = new TripDaysComponent();
  }

  render(events) {
    const container = this._container;

    const dates = [
      ...new Set(events.map((event) => new Date(event.startDate).toDateString()))
    ];

    if (events.length === 0) {
      renderComponent(container, this._noEventsComponent);
      return;
    }

    const tripInfo = document.querySelector(`.trip-main__trip-info`);
    renderComponent(tripInfo, new TripInfoComponent(events), RenderPosition.AFTERBEGIN);

    renderComponent(container, this._tripSortComponent);
    renderComponent(container, this._tripDaysComponent);

    dates.forEach((date, index) => {
      const tripDayComponent = new TripDayComponent(date, index + 1);
      renderComponent(this._tripDaysComponent.getElement(), tripDayComponent);

      const tripEventsComponent = new TripEventsComponent();
      renderComponent(tripDayComponent.getElement(), tripEventsComponent);

      events
        .filter((event) => new Date(event.startDate).toDateString() === date)
        .forEach((event) => renderEvent(tripEventsComponent, event));
    });

    const tripCost = events.reduce((acc, value) => acc + value.price, 0);
    tripInfo.querySelector(`.trip-info__cost-value`).textContent = tripCost;
  }
}
