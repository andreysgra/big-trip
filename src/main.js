import TripController from './controllers/trip-controller.js';
import MenuComponent from './components/menu.js';
import FilterComponent from './components/filter.js';
import EventsModel from './models/events.js';
import {renderComponent, RenderPosition} from './utils/render.js';
import {FILTERS, MENU_ITEMS} from './const.js';
import {generateEvents} from './mock/event.js';

const tripControls = document.querySelector(`.trip-main__trip-controls`);

renderComponent(tripControls, new MenuComponent(MENU_ITEMS), RenderPosition.AFTERBEGIN);
renderComponent(tripControls, new FilterComponent(FILTERS));

const tripEvents = document.querySelector(`.trip-events`);

const events = generateEvents()
  .slice()
  .sort((a, b) => a.startDate - b.startDate);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const tripController = new TripController(tripEvents, eventsModel);
tripController.render();
