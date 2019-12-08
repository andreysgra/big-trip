import MenuComponent from './components/menu.js';
import FilterComponent from './components/filter.js';
import TripInfo from './components/trip-info.js';
// import {getEventsSort} from './components/trip-sort.js';
// import {getTripDaysComponent} from './components/trip-days.js';
// import {getTripEventComponent} from './components/trip-event.js';
// import {getTripEventEditComponent} from './components/trip-event-edit.js';
import {renderComponent} from './utils.js';
import {FILTERS, MENU_ITEMS, RenderPosition} from './const.js';
import {generateEvents} from './mock/event.js';

const EVENTS_COUNT = 4;

const events = generateEvents(EVENTS_COUNT);

// const getEvents = () => {
//   return events
//     .slice(1, EVENTS_COUNT)
//     .map((event) => getTripEventComponent(event))
//     .join(``);
// };

const tripInfo = document.querySelector(`.trip-main__trip-info`);
renderComponent(tripInfo, new TripInfo(events).getElement(), RenderPosition.AFTERBEGIN);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
// const tripEvents = document.querySelector(`.trip-events`);

renderComponent(tripControls, new MenuComponent(MENU_ITEMS).getElement(), RenderPosition.AFTERBEGIN);
renderComponent(tripControls, new FilterComponent(FILTERS).getElement());

// renderComponent(tripEvents, getEventsSort());
// renderComponent(tripEvents, getTripDaysComponent());

// const tripDay = document.querySelector(`.trip-days__item`);
// const tripEventsList = tripDay.querySelector(`.trip-events__list`);

// renderComponent(tripEventsList, getTripEventEditComponent(events[0]));
// renderComponent(tripEventsList, getEvents());

// const tripCost = events.reduce((acc, value) => acc + value.price, 0);
// tripInfo.querySelector(`.trip-info__cost-value`).textContent = tripCost;
