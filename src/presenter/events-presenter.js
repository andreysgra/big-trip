import TripSortView from '../view/trip-sort-view';
import {remove, render, RenderPosition, replace} from '../framework/render';
import TripEventsListView from '../view/trip-events-list-view';
import {sortPointsByDate, sortPointsByPrice, sortPointsByTime} from '../utils/point';
import TripEventsListEmptyView from '../view/trip-events-list-empty-view';
import {FilterType, SortType, UpdateType, UserAction} from '../const';
import EventPresenter from './event-presenter';
import NewEventPresenter from './new-event-presenter';
import {getFilter} from '../utils/filter';

export default class EventsPresenter {
  #container = null;

  #eventPresenters = new Map();
  #newEventPresenter = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #currentSortType = SortType.DAY;
  #filterType = '';

  #tripSortComponent = null;
  #tripEventsListComponent = new TripEventsListView();
  #tripEventsListEmptyComponent = null;

  #handleNewEventDestroy = null;

  constructor({container, pointsModel, destinationsModel, offersModel, filterModel, onNewEventDestroy}) {
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#handleNewEventDestroy = onNewEventDestroy;

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get points() {
    this.#filterType = this.#filterModel.getFilter();

    const points = [...this.#pointsModel.points];
    const filteredPoints = getFilter(points, this.#filterType);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortPointsByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
    }

    return filteredPoints.sort(sortPointsByDate);
  }

  createEvent() {
    this.#newEventPresenter = new NewEventPresenter({
      container: this.#tripEventsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#viewActionHandler,
      onDestroy: this.#handleNewEventDestroy
    });

    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this.#newEventPresenter.init();
    this.#eventPresenters.forEach((eventPresenter) => eventPresenter.resetView());
  }

  init() {
    this.#renderBoard();
  }

  #clearBoard({resetSortType = false} = {}) {
    if (this.#newEventPresenter) {
      this.#newEventPresenter.destroy();
    }

    this.#eventPresenters.forEach((eventPresenter) => eventPresenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#tripSortComponent);

    if (this.#tripEventsListEmptyComponent) {
      remove(this.#tripEventsListEmptyComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleModeChange = () => {
    if (this.#newEventPresenter) {
      this.#newEventPresenter.destroy();
    }

    this.#eventPresenters.forEach((eventPresenter) => eventPresenter.resetView());
  };

  #renderBoard() {
    if (this.points.length === 0) {
      this.#renderTripEventsListEmpty();

      return;
    }

    this.#renderSort();
    this.#renderTripEventsList();
    this.#renderPoints();
  }

  #renderPoint = (point) => {
    const eventPresenter = new EventPresenter({
      container: this.#tripEventsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#viewActionHandler,
      onModeChange: this.#handleModeChange
    });

    eventPresenter.init(point);
    this.#eventPresenters.set(point.id, eventPresenter);
  };

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderSort() {
    this.#tripSortComponent = new TripSortView({
      sortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });

    render(this.#tripSortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderTripEventsList() {
    render(this.#tripEventsListComponent, this.#container);
  }

  #renderTripEventsListEmpty() {
    this.#tripEventsListEmptyComponent = new TripEventsListEmptyView({filterType: this.#filterType});
    replace(this.#tripEventsListEmptyComponent, this.#tripEventsListComponent);
  }

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#eventPresenters.has(data.id)) {
          this.#eventPresenters.get(data.id).init(data);
        }
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({
          resetSortType: true
        });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#renderBoard();
        break;
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderSort();
    this.#renderPoints();
  };

  #viewActionHandler = (actionType, updateType, updateFilm) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.update(updateType, updateFilm);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.delete(updateType, updateFilm);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.add(updateType, updateFilm);
        break;
    }
  };
}
