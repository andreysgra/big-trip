import AbstractSmartComponent from './abstract-smart-component.js';
import {formatDate, formatTime} from '../utils/format.js';
import {OfferType} from '../const.js';
import {Destinations, Offers} from '../mock/event.js';

const createOffersMarkup = (type, offers) => {
  const offersList = Offers.find((offer) => {
    return type === offer.type;
  });

  return offersList.offers
    .map((offer) => {
      const isCheckedOffer = offers.some((it) => it.type === offer.type);

      return `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-1" type="checkbox" name="event-offer-${offer.type}" ${isCheckedOffer ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${offer.type}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
      `;
    })
    .join(``);
};

const createPicturesMarkup = (pictures) => {
  return pictures
    .map((picture) => {
      return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
    })
    .join(``);
};

const createEventTypesMarkup = (types, eventType) => {
  return types
    .map((type) => {
      return `
        <div class="event__type-item">
          <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === eventType ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
        </div>
      `;
    })
    .join(``);
};

const createDestinationMarkup = (destinations) => {
  return destinations
    .map((destination) => {
      return `
        <option value="${destination.name}"></option>
      `;
    })
    .join(``);
};

export default class TripEventEdit extends AbstractSmartComponent {
  constructor(event) {
    super();

    this._event = event;
    this._type = event.type;
    this._destination = Object.assign({}, event.destination);

    this._subscribeOnEvents();

    this._submitHandler = null;
    this._rollupButtonClickHandler = null;
    this._favoriteCheckboxChangeHandler = null;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`)
      .addEventListener(`change`, (evt) => {
        this._type = evt.target.value;

        this.rerender();
      });

    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        const destination = Destinations.find((it) => {
          return it.name === evt.target.value;
        });

        if (!destination) {
          return;
        }

        this._destination = destination;

        this.rerender();
      });
  }

  getTemplate() {
    const {offers, startDate, endDate, price, isFavorite} = this._event;
    const {name, description, pictures} = this._destination;

    const picturesMarkup = createPicturesMarkup(pictures);
    const offersMarkup = createOffersMarkup(this._type, offers);

    const {TRANSFERS, ACTIVITIES} = OfferType;
    const cities = createDestinationMarkup(Destinations);

    return `
      <li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event ${this._type} icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${createEventTypesMarkup(TRANSFERS, this._type)}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${createEventTypesMarkup(ACTIVITIES, this._type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${this._type} at
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${cities}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
              value="${formatDate(startDate)} ${formatTime(startDate)}">
              &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
              value="${formatDate(endDate)} ${formatTime(endDate)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">

          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offersMarkup}
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${picturesMarkup}
              </div>
            </div>
          </section>
        </section>
      </form>
      </li>
    `;
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setRollupButtonClickHandler(this._rollupButtonClickHandler);
    this.setFavoriteCheckboxChangeHandler(this._favoriteCheckboxChangeHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    const event = this._event;

    this._type = event.type;
    this._destination = Object.assign({}, event.destination);
    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement()
      .querySelector(`.event--edit`)
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setRollupButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);

    this._rollupButtonClickHandler = handler;
  }

  setFavoriteCheckboxChangeHandler(handler) {
    this.getElement()
      .querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, handler);

    this._favoriteCheckboxChangeHandler = handler;
  }
}
