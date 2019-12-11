import MenuComponent from './components/menu.js';
import FilterComponent from './components/filter.js';
import TripInfoComponent from './components/trip-info.js';
import TripSortComponent from './components/trip-sort.js';
import TripDaysComponent from './components/trip-days.js';
import TripDayComponent from './components/trip-day.js';
import TripEventsComponent from './components/trip-events.js';
import TripEventComponent from './components/trip-event.js';
import TripEventEditComponent from './components/trip-event-edit.js';
import {renderComponent, replaceElement, addEscapeEvent} from './utils.js';
import {FILTERS, MENU_ITEMS, RenderPosition} from './const.js';
import {generateEvents} from './mock/event.js';

const EVENTS_COUNT = 10;

let lastEvent = null;
let lastEditEvent = null;

const events = generateEvents(EVENTS_COUNT);

const dates = [
  ...new Set(events.map((event) => new Date(event.startDate).toDateString()))
];

const renderEvent = (container, event) => {
  const eventComponent = new TripEventComponent(event);
  const eventEditComponent = new TripEventEditComponent(event);

  const replaceEventToEdit = () => {
    replaceElement(container.getElement(), eventComponent.getElement(), eventEditComponent.getElement());

    lastEvent = null;
    lastEditEvent = null;
  };

  const documentEscPressHandler = (evt) => {
    if (container.getElement().contains(eventEditComponent.getElement())) {
      addEscapeEvent(evt, replaceEventToEdit);
    }

    document.removeEventListener(`keydown`, documentEscPressHandler);
  };

  const eventEditHandler = () => {
    if (lastEditEvent) {
      replaceElement(container.getElement(), lastEvent.getElement(), lastEditEvent.getElement());
    }

    replaceElement(container.getElement(), eventEditComponent.getElement(), eventComponent.getElement());

    lastEvent = eventComponent;
    lastEditEvent = eventEditComponent;

    document.addEventListener(`keydown`, documentEscPressHandler);
  };

  const eventSubmitHadler = () => {
    replaceEventToEdit();
  };

  eventComponent.setRollupButtonHandler(eventEditHandler);
  eventEditComponent.setSubmitFormHandler(eventSubmitHadler);

  renderComponent(container.getElement(), eventComponent.getElement());
};

const tripInfo = document.querySelector(`.trip-main__trip-info`);
renderComponent(tripInfo, new TripInfoComponent(events).getElement(), RenderPosition.AFTERBEGIN);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
renderComponent(tripControls, new MenuComponent(MENU_ITEMS).getElement(), RenderPosition.AFTERBEGIN);
renderComponent(tripControls, new FilterComponent(FILTERS).getElement());

const tripEvents = document.querySelector(`.trip-events`);
renderComponent(tripEvents, new TripSortComponent().getElement());

const tripDaysComponent = new TripDaysComponent();
renderComponent(tripEvents, tripDaysComponent.getElement());

dates.forEach((date, index) => {
  const tripDayComponent = new TripDayComponent(date, index + 1);
  renderComponent(tripDaysComponent.getElement(), tripDayComponent.getElement());

  const tripEventsComponent = new TripEventsComponent();
  renderComponent(tripDayComponent.getElement(), tripEventsComponent.getElement());

  events
    .filter((event) => new Date(event.startDate).toDateString() === date)
    .forEach((event) => renderEvent(tripEventsComponent, event));
});

const tripCost = events.reduce((acc, value) => acc + value.price, 0);
tripInfo.querySelector(`.trip-info__cost-value`).textContent = tripCost;
