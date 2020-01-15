import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import TripController from './controllers/trip-controller.js';
import FilterController from './controllers/filter-controller.js';
import EventsModel from './models/events-model.js';
import EventModel from './models/event-model.js';
import LoadEvents from './components/load-events.js';
import MenuComponent from './components/menu.js';
import StatisticsComponent from './components/statistics.js';
import {renderComponent, removeComponent, RenderPosition} from './utils/render.js';
import {MenuItem, AUTHORIZATION, END_POINT, STORE_NAME} from './const.js';

const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const pageMainElement = document.querySelector(`.page-main`);

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {})
    .catch((err) => {
      throw new Error(err);
    });
});

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const eventsModel = new EventsModel();

const menuItems = Object.values(MenuItem)
  .map((item) => {
    return {
      name: item,
      active: item === MenuItem.TABLE
    };
  });

const menuComponent = new MenuComponent(menuItems);
const filterController = new FilterController(tripControlsElement, eventsModel);
const tripController = new TripController(tripEventsElement, eventsModel, apiWithProvider);
const loadEvents = new LoadEvents();
const statisticsComponent = new StatisticsComponent(eventsModel);

renderComponent(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
filterController.render();
renderComponent(tripEventsElement, loadEvents);
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

Promise.all([
  apiWithProvider.getDestinations(),
  apiWithProvider.getOffers(),
  apiWithProvider.getEvents()
])
  .then((response) => {
    const [destinations, offers, events] = response;

    tripController.setDestinations(destinations);
    tripController.setOffers(offers);
    eventsModel.setEvents(events);
    tripController.render();
    removeComponent(loadEvents);
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
      .then((events) => {
        eventsModel.setEvents(EventModel.parseEvents(events));
        tripController.updateEvents();
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
