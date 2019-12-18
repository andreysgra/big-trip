import AbstractComponent from './abstract-component.js';

export default class TripDay extends AbstractComponent {
  constructor(date = null, count = 0) {
    super();
    this._date = date;
    this._count = count;
  }

  getTemplate() {
    const date = new Date(this._date);
    const month = this._date ? date.toLocaleString(`en-US`, {month: `short`}) : ``;
    const day = this._date ? date.getDate() : ``;
    const datetime = this._date ? date : ``;

    return `
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${this._count || ``}</span>
          <time class="day__date" datetime="${datetime}">
            ${month} ${day}
          </time>
        </div>
      </li>
    `;
  }
}
