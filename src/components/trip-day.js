import {createElement} from '../utils.js';

export default class TripDay {
  constructor(date, count) {
    this._date = date;
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    const date = new Date(this._date).toLocaleString(`en-US`, {month: `short`});
    const day = new Date(this._date).getDate();
    return `
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${this._count}</span>
          <time class="day__date" datetime="${new Date(this._date)}">
            ${date} ${day}
          </time>
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
