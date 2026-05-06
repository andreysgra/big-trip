import AbstractView from '../framework/view/abstract-view';
import {getDateTime} from '../utils/format-date-time';

const BLANK_POINT = {
  basePrice: 0,
  type: 'sightseeing',
  destination: '',
  offers: [],
  dateFrom: new Date(),
  dateTo: Date()
};

const createDestinationListTemplate = (destinations) => {
  const options = destinations
    .map((destination) => `<option value="${destination.name}"></option>`)
    .sort()
    .join('');

  return `
    <datalist id="destination-list-1">${options}</datalist>
  `;
};

const createEventTypesTemplate = (offers, type) => {
  const sortOffersByType = (offerA, offerB) => {
    if (offerA.type < offerB.type) {
      return -1;
    }

    if (offerA.type > offerB.type) {
      return 1;
    }

    return 0;
  };

  return offers
    .sort(sortOffersByType)
    .map((offer) => {
      const isChecked = (offer.type === type) ? 'checked' : '';

      return `
        <div class="event__type-item" style="text-transform: capitalize">
          <input
            id="event-type-${offer.type}-1"
            class="event__type-input  visually-hidden"
            type="radio" name="event-type" value="${offer.type}" ${isChecked}>
          <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">
            ${offer.type}
          </label>
        </div>`;
    })
    .join('');
};

const createOffersTemplate = (offerIds, offersByType) => {
  if (offersByType.offers.length === 0) {
    return '';
  }

  const options = offersByType.offers
    .map((offer) => {
      const isChecked = (offerIds.includes(offer.id)) ? 'checked' : '';

      return `
        <div class="event__offer-selector">
          <input
            class="event__offer-checkbox  visually-hidden"
            id="event-offer-${offer.id}" type="checkbox" name="event-offer" ${isChecked}>
          <label class="event__offer-label" for="event-offer-${offer.id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`;
    })
    .join('');

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${options}
      </div>
    </section>
  `;
};

const createPicturesTemplate = (pictures) =>
  pictures
    .map((picture) =>`<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)
    .join('');

const createTripEventFormTemplate = (point, destinations, offers, offersByType) => {
  const {
    basePrice,
    type,
    destination: destinationId,
    offers: offerIds,
    dateFrom,
    dateTo
  } = point;

  const {name, description, pictures} = destinations.find((destination) => destination.id === destinationId);

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="${type} icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                  ${createEventTypesTemplate(offers, type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">${type}</label>
            <input class="event__input  event__input--destination" id="event-destination-1"
              type="text" name="event-destination" value="${name}" list="destination-list-1">

              ${createDestinationListTemplate(destinations)}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
              value="${getDateTime(dateFrom)}">
              &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
              value="${getDateTime(dateTo)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price"
              value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
          ${createOffersTemplate(offerIds, offersByType)}

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${createPicturesTemplate(pictures)}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>
  `;
};

export default class TripEventFormView extends AbstractView {
  #point = null;
  #destinations = [];
  #offers = [];
  #offersByType = [];
  #handleRollupClick = null;

  constructor({point = BLANK_POINT, destinations, offers, offersByType, onRollupClick}) {
    super();

    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#offersByType = offersByType;
    this.#handleRollupClick = onRollupClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  }

  get template() {
    return createTripEventFormTemplate(this.#point, this.#destinations, this.#offers, this.#offersByType);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };
}
