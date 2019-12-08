import {createElement} from '../utils.js';

const createTripEventsTemplate = () => {
  return `
    <ul class="trip-events__list"></ul>
  `;
};

export default class TripEvents {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripEventsTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
