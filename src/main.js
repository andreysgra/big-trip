import TripInfoPresenter from './presenter/trip-info-presenter';
import TripFiltersPresenter from './presenter/trip-filters-presenter';
import TripEventsPresenter from './presenter/trip-events-presenter';
import {points} from './mocks/points';
import PointsModel from './model/points-model';
import {destinations} from './mocks/destinations';
import DestinationsModel from './model/destinations-model';
import {offers} from './mocks/offers';
import OffersModel from './model/offers-model';

const bodyElement = document.body;
const tripMainElement = bodyElement.querySelector('.trip-main');
const tripControlsFiltersElement = bodyElement.querySelector('.trip-controls__filters');
const tripEventsElement = bodyElement.querySelector('.trip-events');

const pointsModel = new PointsModel(points);
const destinationsModel = new DestinationsModel(destinations);
const offersModel = new OffersModel(offers);

const tripInfoPresenter = new TripInfoPresenter(tripMainElement);
const tripFiltersPresenter = new TripFiltersPresenter(tripControlsFiltersElement);
const tripEventsPresenter =
  new TripEventsPresenter(tripEventsElement, pointsModel, destinationsModel, offersModel);

tripInfoPresenter.init();
tripFiltersPresenter.init();
tripEventsPresenter.init();
