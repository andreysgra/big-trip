import {createElement} from '../utils.js';
import {getTripEventsComponent} from './trip-events.js';

const createTripDayTemplate = () => {
  return `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="2019-03-18">MAR 18</time>
      </div>
      ${getTripEventsComponent()}
    </li>
  `;
};

export default class TripDay {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripDayTemplate();
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
