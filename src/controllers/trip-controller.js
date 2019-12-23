import TripInfoComponent from '../components/trip-info.js';
import TripSortComponent, {SortType} from '../components/trip-sort.js';
import TripDaysComponent from '../components/trip-days.js';
import TripDayComponent from '../components/trip-day.js';
import TripEventsComponent from '../components/trip-events.js';
import NoEventsComponent from '../components/no-events.js';
import EventController from './event-controller.js';
import {renderComponent, RenderPosition} from '../utils/render.js';

export default class TripController {
  constructor(container) {
    this._container = container;

    this._events = [];

    this._noEventsComponent = new NoEventsComponent();
    this._tripSortComponent = new TripSortComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._tripSortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderEvents(events, defaultSorting = true) {
    // const eventControllers = [];
    const dates = defaultSorting
      ? [...new Set(events.map((event) => new Date(event.startDate).toDateString()))]
      : [``];

    dates.forEach((date, index) => {
      const tripDayComponent = defaultSorting
        ? new TripDayComponent(date, index + 1)
        : new TripDayComponent();

      renderComponent(this._tripDaysComponent.getElement(), tripDayComponent);

      const tripEventsComponent = new TripEventsComponent();
      renderComponent(tripDayComponent.getElement(), tripEventsComponent);

      events
        .filter((event) => defaultSorting
          ? new Date(event.startDate).toDateString() === date
          : event)
        .forEach((event) => {
          const eventController = new EventController(tripEventsComponent.getElement());

          eventController.render(event);
          // eventControllers.push(eventController);
        });
    });

    // return eventControllers;
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];
    const defaultSorting = sortType === SortType.DEFAULT;

    switch (sortType) {
      case SortType.TIME_DOWN:
        sortedEvents = this._events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
        break;
      case SortType.PRICE_DOWN:
        sortedEvents = this._events.slice().sort((a, b) => b.price - a.price);
        break;
      case SortType.DEFAULT:
        sortedEvents = this._events.slice();
        break;
    }

    this._tripDaysComponent.getElement().innerHTML = ``;
    this._renderEvents(sortedEvents, defaultSorting);
  }

  render(events) {
    this._events = events;

    const container = this._container;

    if (this._events.length === 0) {
      renderComponent(container, this._noEventsComponent);
      return;
    }

    const tripInfo = document.querySelector(`.trip-main__trip-info`);
    renderComponent(tripInfo, new TripInfoComponent(events), RenderPosition.AFTERBEGIN);

    renderComponent(container, this._tripSortComponent);
    renderComponent(container, this._tripDaysComponent);

    this._renderEvents(this._events);

    tripInfo
      .querySelector(`.trip-info__cost-value`)
      .textContent = events.reduce((acc, value) => acc + value.price, 0);
  }
}
