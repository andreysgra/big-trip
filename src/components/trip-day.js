import {createElement} from '../utils.js';

export default class TripDay {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return `
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">1</span>
          <time class="day__date" datetime="2019-03-18">MAR 18</time>
        </div>
      </li>
    `;
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
