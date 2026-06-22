import InfoPresenter from './presenter/info-presenter';
import FiltersPresenter from './presenter/filters-presenter';
import EventsPresenter from './presenter/events-presenter';
import PointsModel from './model/points-model';
import {points} from './mocks/points';

const bodyElement = document.body;
const tripMainElement = bodyElement.querySelector('.trip-main');
const tripControlsFiltersElement = bodyElement.querySelector('.trip-controls__filters');
const tripEventsElement = bodyElement.querySelector('.trip-events');

const pointsModel = new PointsModel(points);

const infoPresenter = new InfoPresenter(tripMainElement);
const filtersPresenter = new FiltersPresenter(tripControlsFiltersElement);
const eventsPresenter = new EventsPresenter({
  container: tripEventsElement,
  pointsModel
});

infoPresenter.init();
filtersPresenter.init();
eventsPresenter.init();
