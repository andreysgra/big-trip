import TripInfoPresenter from './presenter/trip-info-presenter';
import TripFiltersPresenter from './presenter/trip-filters-presenter';
import TripEventsPresenter from './presenter/trip-events-presenter';

const bodyElement = document.body;
const tripMainElement = bodyElement.querySelector('.trip-main');
const tripControlsFiltersElement = bodyElement.querySelector('.trip-controls__filters');
const tripEventsElement = bodyElement.querySelector('.trip-events');

const tripInfoPresenter = new TripInfoPresenter(tripMainElement);
const tripFiltersPresenter = new TripFiltersPresenter(tripControlsFiltersElement);
const tripEventsPresenter = new TripEventsPresenter(tripEventsElement);

tripInfoPresenter.init();
tripFiltersPresenter.init();
tripEventsPresenter.init();
