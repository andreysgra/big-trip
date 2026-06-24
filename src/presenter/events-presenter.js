import TripSortView from '../view/trip-sort-view';
import {render} from '../framework/render';
import TripEventsListView from '../view/trip-events-list-view';
import {sortPointsByDate} from '../utils/point';
import TripEventsListEmptyView from '../view/trip-events-list-empty-view';
import {FilterType} from '../const';
import EventPresenter from './event-presenter';

export default class EventsPresenter {
  #container = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #points = [];

  #tripSorComponent = new TripSortView;
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
      offersModel: this.#offersModel
    });

    eventPresenter.init(point);
  };

  #renderPoints() {
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #renderSort() {
    render(this.#tripSorComponent, this.#container);
  }

  #renderTripEventsList() {
    render(this.#tripEventsListComponent, this.#container);
  }

  #renderTripEventsListEmpty() {
    render(new TripEventsListEmptyView({filterType: FilterType.EVERYTHING}), this.#container);
  }
}
