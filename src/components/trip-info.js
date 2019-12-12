import AbstractComponent from './abstract-component.js';

const SHOWING_CITIES_COUNT = 3;

const getTitle = (events) => {
  if (events.length > SHOWING_CITIES_COUNT) {
    return `${events[0].city} &mdash; ... &mdash; ${events[events.length - 1].city}`;
  } else {
    return events
      .map((event, index) => {
        return `${event.city} ${index < events.length - 1 ? `-` : ``} `;
      })
      .join(``);
  }
};

const getDates = (startDate, endDate) => {
  const month = new Date(startDate).toLocaleString(`en-US`, {month: `short`});
  const startDay = new Date(startDate).getDate();
  const endDay = new Date(endDate).getDate();

  return `${month} ${startDay} &nbsp;&mdash;&nbsp; ${endDay}`;
};

export default class TripInfo extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    const dates = getDates(this._events[0].startDate, this._events[this._events.length - 1].endDate);

    return `
      <div class="trip-info__main">
        <h1 class="trip-info__title">
          ${getTitle(this._events)}
        </h1>

        <p class="trip-info__dates">${dates}</p>
      </div>
    `;
  }
}
