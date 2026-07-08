import TripSortView from '../view/trip-sort-view';
import {remove, render, RenderPosition} from '../framework/render';
import TripEventsListView from '../view/trip-events-list-view';
import {sortPointsByDate, sortPointsByPrice, sortPointsByTime} from '../utils/point';
import TripEventsListEmptyView from '../view/trip-events-list-empty-view';
import {FilterType, SortType, UpdateType, UserAction} from '../const';
import EventPresenter from './event-presenter';

export default class EventsPresenter {
  #container = null;

  #eventPresenters = new Map();

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #currentSortType = SortType.DAY;

  #tripSortComponent = null;
  #tripEventsListComponent = new TripEventsListView();
  #tripEventsListEmptyComponent = null;

  constructor({container, pointsModel, destinationsModel, offersModel}) {
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#modelEventHandler);
  }

  get points() {
    const points = [...this.#pointsModel.points];

    switch (this.#currentSortType) {
      case SortType.TIME:
        return points.sort(sortPointsByTime);
      case SortType.PRICE:
        return points.sort(sortPointsByPrice);
    }

    return points.sort(sortPointsByDate);
  }

  init() {
    this.#renderBoard();
  }

  #clearBoard({resetSortType = false} = {}) {
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
    this.#tripEventsListEmptyComponent = new TripEventsListEmptyView({filterType: FilterType.EVERYTHING});
    render(this.#tripEventsListEmptyComponent, this.#container);
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
    }
  };
}
