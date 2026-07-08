import InfoPresenter from './presenter/info-presenter';
import FiltersPresenter from './presenter/filters-presenter';
import EventsPresenter from './presenter/events-presenter';
import PointsModel from './model/points-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import {points} from './mocks/points';
import {destinations} from './mocks/destinations';
import {offers} from './mocks/offers';
import NewEventButtonView from './view/new-event-button-view';
import {render} from './framework/render';

const bodyElement = document.body;
const tripMainElement = bodyElement.querySelector('.trip-main');
const tripControlsFiltersElement = bodyElement.querySelector('.trip-controls__filters');
const tripEventsElement = bodyElement.querySelector('.trip-events');

const pointsModel = new PointsModel(points);
const destinationsModel = new DestinationsModel(destinations);
const offersModel = new OffersModel(offers);

const infoPresenter = new InfoPresenter({
  container: tripMainElement
});

const filtersPresenter = new FiltersPresenter({
  container: tripControlsFiltersElement,
  pointsModel
});

const eventsPresenter = new EventsPresenter({
  container: tripEventsElement,
  pointsModel,
  destinationsModel,
  offersModel,
  onNewEventDestroy: newEventFormCloseHandler
});

const newEventButtonComponent = new NewEventButtonView({
  onClick: newEventButtonClickHandler
});

render(newEventButtonComponent, tripMainElement);

infoPresenter.init();
filtersPresenter.init();
eventsPresenter.init();

function newEventButtonClickHandler() {
  newEventButtonComponent.disable();
  eventsPresenter.createEvent();
}

function newEventFormCloseHandler() {
  newEventButtonComponent.enable();
}
