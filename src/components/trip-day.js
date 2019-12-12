import AbstractComponent from './abstract-component.js';

export default class TripDay extends AbstractComponent {
  constructor(date, count) {
    super();
    this._date = date;
    this._count = count;
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
}
