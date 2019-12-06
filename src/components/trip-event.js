import {formatTime, formatDuration} from '../utils.js';

const OFFERS_MAX_VIEWING = 3;

const createOffersMarkup = (offers) => {
  return offers
    .slice(OFFERS_MAX_VIEWING)
    .map((offer) => {
      const {title, price} = offer;
      return `
        <li class="event__offer">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </li>
      `;
    })
    .join(``);
};

const getTripEventComponent = (event) => {
  const {type, offers, startDate, endDate, price} = event;

  const offersMarkup = createOffersMarkup(offers);

  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);
  const duration = formatDuration(endDate - startDate);

  return `
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event ${type} icon">
        </div>
        <h3 class="event__title">${type}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
};

export {getTripEventComponent};
