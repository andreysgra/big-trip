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
  #offersModel = null;

  #tripInfoComponent = new TripInfoView();
  #tripInfoMainComponent = null;
  #tripInfoCostComponent = null;

  constructor({container, pointsModel, destinationsModel, offersModel}) {
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#modelEventHandler);
  }

  init() {
    this.#renderTripInfo();
    this.#renderTripInfoMain();
    this.#renderTripInfoCost();
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

  #getTotalCost() {
    const points = [...this.#pointsModel.points];
    const baseCost = points.reduce((acc, point) => acc + point.basePrice, 0);

    const offersCost = points
      .filter((point) => point.offers.length !== 0)
      .map((point) => {
        const item = {
          type: point.type,
          offers: point.offers
        };

        return this.#offersModel.getOffersByType(item.type).offers
          .filter((offer) => item.offers.includes(offer.id));
      })
      .reduce((acc, offer) =>
        acc + offer.reduce((cost, item) => cost + item.price, 0),
      0);

    return baseCost + offersCost;
  }

  #renderTripInfo() {
    render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderTripInfoCost() {
    const cost = this.#getTotalCost();
    const currentTripInfoComponent = this.#tripInfoCostComponent;

    this.#tripInfoCostComponent = new TripInfoCostView({cost});

    if (currentTripInfoComponent === null) {
      render(this.#tripInfoCostComponent, this.#tripInfoComponent.element);
    } else {
      replace(this.#tripInfoCostComponent, currentTripInfoComponent);
      remove(currentTripInfoComponent);
    }
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
        this.#renderTripInfoCost();
        break;
    }
  };
}
