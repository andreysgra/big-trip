import TripController from './controllers/trip-controller.js';
import FilterController from './controllers/filter-controller.js';
import EventsModel from './models/events.js';
import MenuComponent from './components/menu.js';
import {renderComponent, RenderPosition} from './utils/render.js';
import {MENU_ITEMS} from './const.js';
import {generateEvents} from './mock/event.js';

const tripControls = document.querySelector(`.trip-main__trip-controls`);

const events = generateEvents()
  .slice()
  .sort((a, b) => a.startDate - b.startDate);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

renderComponent(tripControls, new MenuComponent(MENU_ITEMS), RenderPosition.AFTERBEGIN);

const filterController = new FilterController(tripControls, eventsModel);
filterController.render();

const tripEvents = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEvents, eventsModel);
tripController.render();

document.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, () => {
    tripController.createEvent();
  });
