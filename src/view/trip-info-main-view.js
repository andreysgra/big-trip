import AbstractView from '../framework/view/abstract-view';

const createTripInfoMainTemplate = (title, dates) => `
  <div class="trip-info__main">
    <h1 class="trip-info__title">${title}</h1>

    <p class="trip-info__dates">${dates}</p>
  </div>
`;

export default class TripInfoMainView extends AbstractView {
  #title = '';
  #dates = '';

  constructor({title, dates}) {
    super();

    this.#title = title;
    this.#dates = dates;
  }

  get template() {
    return createTripInfoMainTemplate(this.#title, this.#dates);
  }
}
