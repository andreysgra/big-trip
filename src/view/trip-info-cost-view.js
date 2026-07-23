import AbstractView from '../framework/view/abstract-view';

const createTripInfoCostTemplate = (cost) => `
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>
`;

export default class TripInfoCostView extends AbstractView {
  #cost = 0;

  constructor({cost}) {
    super();

    this.#cost = cost;
  }

  get template() {
    return createTripInfoCostTemplate(this.#cost);
  }
}
