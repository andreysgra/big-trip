import TripController from './controllers/trip-controller.js';
import FilterController from './controllers/filter-controller.js';
import EventsModel from './models/events.js';
import MenuComponent from './components/menu.js';
import StatisticsComponent from './components/statistics.js';
import {renderComponent, RenderPosition} from './utils/render.js';
import {MenuItem} from './const.js';
import {generateEvents} from './mock/event.js';

const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const pageMainElement = document.querySelector(`.page-main`);

const events = generateEvents()
  .slice()
  .sort((a, b) => a.startDate - b.startDate);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const menuItems = Object.values(MenuItem)
  .map((item) => {
    return {
      name: item,
      active: item === MenuItem.TABLE
    };
  });

const menuComponent = new MenuComponent(menuItems);
renderComponent(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);

const filterController = new FilterController(tripControlsElement, eventsModel);
filterController.render();

const tripController = new TripController(tripEventsElement, eventsModel);
tripController.render();

const statisticsComponent = new StatisticsComponent(eventsModel);
renderComponent(pageMainElement.querySelector(`.page-body__container`), statisticsComponent);
statisticsComponent.hide();

document.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, () => {
    tripController.createEvent();
  });

menuComponent.setItemClickHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      menuComponent.setActiveItem(MenuItem.STATS);
      tripController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TABLE:
      menuComponent.setActiveItem(MenuItem.TABLE);
      statisticsComponent.hide();
      tripController.show();
      break;
  }
});
