import MenuComponent from './components/menu.js';
import FilterComponent from './components/filter.js';
import TripController from './controllers/trip-controller.js';
import {renderComponent, RenderPosition} from './utils/render.js';
import {FILTERS, MENU_ITEMS} from './const.js';
import {generateEvents} from './mock/event.js';

const EVENTS_COUNT = 10;

const tripControls = document.querySelector(`.trip-main__trip-controls`);

renderComponent(tripControls, new MenuComponent(MENU_ITEMS), RenderPosition.AFTERBEGIN);
renderComponent(tripControls, new FilterComponent(FILTERS));

const tripEvents = document.querySelector(`.trip-events`);

const events = generateEvents(EVENTS_COUNT);

const tripController = new TripController(tripEvents);
tripController.render(events);
