import InfoPresenter from './presenter/info-presenter';
import FiltersPresenter from './presenter/filters-presenter';
import EventsPresenter from './presenter/events-presenter';
import PointsModel from './model/points-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import NewEventButtonView from './view/new-event-button-view';
import {render} from './framework/render';
import FilterModel from './model/filter-model';
import PointsApiService from './api-service/points-api-service';
import {AUTHORIZATION, END_POINT} from './api-service/const';
import DestinationsApiService from './api-service/destinations-api-service';
import OffersApiService from './api-service/offers-api-service';

const bodyElement = document.body;
const tripMainElement = bodyElement.querySelector('.trip-main');
const tripControlsFiltersElement = bodyElement.querySelector('.trip-controls__filters');
const tripEventsElement = bodyElement.querySelector('.trip-events');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const infoPresenter = new InfoPresenter({
  container: tripMainElement
});

const filtersPresenter = new FiltersPresenter({
  container: tripControlsFiltersElement,
  pointsModel,
  filterModel
});

const eventsPresenter = new EventsPresenter({
  container: tripEventsElement,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewEventDestroy: newEventFormCloseHandler
});

const newEventButtonComponent = new NewEventButtonView({
  onClick: newEventButtonClickHandler
});

render(newEventButtonComponent, tripMainElement);


filtersPresenter.init();
eventsPresenter.init();
infoPresenter.init();

destinationsModel.init();
offersModel.init();
pointsModel.init();

function newEventButtonClickHandler() {
  newEventButtonComponent.disable();
  eventsPresenter.createEvent();
}

function newEventFormCloseHandler() {
  newEventButtonComponent.enable();
}
