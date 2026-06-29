import TripSortView from '../view/trip-sort-view';
import {render, replace} from '../framework/render';
import TripEventsListView from '../view/trip-events-list-view';
import {sortPointsByDate, sortPointsByPrice, sortPointsByTime} from '../utils/point';
import TripEventsListEmptyView from '../view/trip-events-list-empty-view';
import {FilterType, SortType} from '../const';
import EventPresenter from './event-presenter';
import {updateItem} from '../utils/common';

export default class EventsPresenter {
  #container = null;

  #eventPresenters = new Map();

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #points = [];
  #currentSortType = SortType.DAY;

  #tripSortComponent = null;
  #tripEventsListComponent = new TripEventsListView();

  constructor({container, pointsModel, destinationsModel, offersModel}) {
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points].sort(sortPointsByDate);

    this.#renderBoard();
  }

  #clearPoints() {
    this.#eventPresenters.forEach((eventPresenter) => eventPresenter.destroy());
    this.#eventPresenters.clear();
  }

  #handleEventChange = (updateEvent) => {
    this.#points = updateItem(this.#points, updateEvent);
    this.#eventPresenters.get(updateEvent.id).init(updateEvent);
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((eventPresenter) => eventPresenter.resetView());
  };

  #renderBoard() {
    if (this.#points.length === 0) {
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
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange
    });

    eventPresenter.init(point);
    this.#eventPresenters.set(point.id, eventPresenter);
  };

  #renderPoints() {
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #renderSort() {
    if (!this.#tripSortComponent) {
      this.#tripSortComponent = new TripSortView({
        sortType: this.#currentSortType,
        onSortTypeChange: this.#sortTypeChangeHandler
      });

      render(this.#tripSortComponent, this.#container);
    } else {
      const updatedSortComponent = new TripSortView({
        sortType: this.#currentSortType,
        onSortTypeChange: this.#sortTypeChangeHandler
      });

      replace(updatedSortComponent, this.#tripSortComponent);
      this.#tripSortComponent = updatedSortComponent;
    }
  }

  #renderTripEventsList() {
    render(this.#tripEventsListComponent, this.#container);
  }

  #renderTripEventsListEmpty() {
    render(new TripEventsListEmptyView({filterType: FilterType.EVERYTHING}), this.#container);
  }

  #sortPoint = (sortType) => {
    switch (sortType) {
      case SortType.TIME:
        this.#points.sort(sortPointsByTime);
        break;
      case SortType.PRICE:
        this.#points.sort(sortPointsByPrice);
        break;
      default:
        this.#points.sort(sortPointsByDate);
    }

    this.#currentSortType = sortType;
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoint(sortType);
    this.#clearPoints();
    this.#renderSort();
    this.#renderPoints();
  };
}
