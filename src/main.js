import {getMenuComponent} from './components/menu.js';
import {getFiltersComponent} from './components/filters.js';
import {getTripInfoComponent} from './components/trip-info.js';
import {getEventsSort} from './components/trip-sort.js';
// import {getEventEditComponent} from './components/trip-event-edit.js';
import {getTripDaysComponent} from './components/trip-days.js';
import {renderComponent} from './utils.js';

const tripInfo = document.querySelector(`.trip-main__trip-info`);
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEventsComponent = document.querySelector(`.trip-events`);

renderComponent(tripInfo, getTripInfoComponent(), `afterbegin`);
renderComponent(tripControls.firstElementChild, getMenuComponent(), `afterend`);
renderComponent(tripControls, getFiltersComponent());
renderComponent(tripEventsComponent, getEventsSort());
// renderComponent(tripEventsComponent, getEventEditComponent());
renderComponent(tripEventsComponent, getTripDaysComponent());
