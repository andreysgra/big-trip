import TripInfoComponent from '../components/trip-info.js';
import TripSortComponent from '../components/trip-sort.js';
import TripDaysComponent from '../components/trip-days.js';
import TripDayComponent from '../components/trip-day.js';
import TripEventsComponent from '../components/trip-events.js';
import NoEventsComponent from '../components/no-events.js';
import EventController from './event-controller.js';
import {renderComponent, RenderPosition} from '../utils/render.js';
import {formatFullDate} from '../utils/format.js';
import {SortType} from '../const.js';

export default class TripController {
  constructor(container) {
    this._container = container;

    this._events = [];
    this._eventControllers = [];

    this._noEventsComponent = new NoEventsComponent();
    this._tripSortComponent = new TripSortComponent();
    this._tripDaysComponent = new TripDaysComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._tripSortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderEvents(events, onDataChange, onViewChange, defaultSorting = true) {
    const eventControllers = [];

    const dates = defaultSorting
      ? [...new Set(events.map((event) => formatFullDate(event.startDate)))]
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
          ? formatFullDate(event.startDate) === date
          : event)
        .forEach((event) => {
          const eventController = new EventController(tripEventsComponent.getElement(), onDataChange, onViewChange);

          eventController.render(event);
          eventControllers.push(eventController);
        });
    });

    return eventControllers;
  }

  _onDataChange(eventController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    eventController.render(this._events[index]);
  }

  _onViewChange() {
    this._eventControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];
    const isDefaultSorting = sortType === SortType.DEFAULT;

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
    this._eventControllers = this._renderEvents(sortedEvents, this._onDataChange, this._onViewChange, isDefaultSorting);
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

    this._eventControllers = this._renderEvents(this._events, this._onDataChange, this._onViewChange);

    tripInfo
      .querySelector(`.trip-info__cost-value`)
      .textContent = events
      .reduce((totalCost, value) => totalCost + value.price +
          value.offers
            .reduce((totalOffersCost, offer) => totalOffersCost + offer.price, 0),
      0);
  }
}
