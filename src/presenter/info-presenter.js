import TripInfoView from '../view/trip-info-view';
import {remove, render, RenderPosition, replace} from '../framework/render';
import TripInfoMainView from '../view/trip-info-main-view';
import TripInfoCostView from '../view/trip-info-cost-view';
import {UpdateType} from '../const';
import {sortPointsByDate} from '../utils/point';
import dayjs from 'dayjs';

export default class InfoPresenter {
  #container = null;

  #pointsModel = null;
  #destinationsModel = null;

  #tripInfoComponent = new TripInfoView();
  #tripInfoMainComponent = null;
  #tripInfoCostComponent = new TripInfoCostView();

  constructor({container, pointsModel, destinationsModel}) {
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#modelEventHandler);
  }

  init() {
    this.#renderTripInfo();
    this.#renderTripInfoMain();
    render(this.#tripInfoCostComponent, this.#tripInfoComponent.element);
  }

  #getInfoDates() {
    const points = [...this.#pointsModel.points].sort(sortPointsByDate);
    const pointsCount = points.length;

    if (pointsCount === 0) {
      return '';
    }

    const startDate = dayjs(points[0].dateFrom);
    const endDate = dayjs(points[pointsCount - 1].dateTo);
    const isSameDate = startDate.isSame(endDate, 'day');

    if (isSameDate) {
      return startDate.format('D MMM');
    }

    return `${startDate.format('D MMM')} &mdash; ${endDate.format('D MMM')}`;
  }

  #getInfoTitle() {
    const points = [...this.#pointsModel.points].sort(sortPointsByDate);
    const pointsCount = points.length;

    switch (pointsCount) {
      case 0:
        return '';
      case 1:
        return this.#destinationsModel.getDestination(points[0].destination).name;
      case 2:
        return `${this.#destinationsModel.getDestination(points[0].destination).name} &mdash;
        ${this.#destinationsModel.getDestination(points[2].destination).name}`;
      case 3:
        return `${this.#destinationsModel.getDestination(points[0].destination).name} &mdash;
        ${this.#destinationsModel.getDestination(points[2].destination).name} &mdash;
        ${this.#destinationsModel.getDestination(points[3].destination).name}`;
      default:
        return `${this.#destinationsModel.getDestination(points[0].destination).name} &mdash; ... &mdash;
        ${this.#destinationsModel.getDestination(points[pointsCount - 1].destination).name}`;
    }
  }

  #renderTripInfo() {
    render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderTripInfoMain() {
    const title = this.#getInfoTitle();
    const dates = this.#getInfoDates();
    const currentTripInfoMainComponent = this.#tripInfoMainComponent;

    this.#tripInfoMainComponent = new TripInfoMainView({title, dates});

    if (currentTripInfoMainComponent === null) {
      render(this.#tripInfoMainComponent, this.#tripInfoComponent.element);
    } else {
      replace(this.#tripInfoMainComponent, currentTripInfoMainComponent);
      remove(currentTripInfoMainComponent);
    }
  }

  #modelEventHandler = (updateType) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#renderTripInfoMain();
        break;
    }
  };
}
