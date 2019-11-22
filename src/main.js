import {getMenuComponent} from './components/menu.js';
import {getFiltersComponent} from './components/filters.js';
import {getTripInfoComponent} from './components/trip-info.js';
import {getFormEventComponent} from './components/form-event.js';
import {getDaysComponent} from './components/days.js';
import {renderComponent} from './utils.js';

const tripInfo = document.querySelector(`.trip-main__trip-info`);
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEventsComponent = document.querySelector(`.trip-events`);

renderComponent(tripInfo, getTripInfoComponent(), `afterbegin`);
renderComponent(tripControls.firstElementChild, getMenuComponent(), `afterend`);
renderComponent(tripControls, getFiltersComponent());
renderComponent(tripEventsComponent, getFormEventComponent());
renderComponent(tripEventsComponent, getDaysComponent());
