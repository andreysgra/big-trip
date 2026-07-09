import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {getDateTime} from '../utils/format-date-time';
import {BLANK_POINT} from '../const';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const datePickerOptions = {
  dateFormat: 'd/m/y H:i',
  enableTime: true,
  'time_24hr': true
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

const createOffersTemplate = (offerIds, offers, type) => {
  const availableOffers = offers.find((offer) => offer.type === type).offers;

  if (availableOffers.length === 0) {
    return '';
  }

  const options = availableOffers
    .map((offer) => {
      const isChecked = (offerIds.includes(offer.id)) ? 'checked' : '';

      return `
        <div class="event__offer-selector">
          <input
            class="event__offer-checkbox  visually-hidden"
            id="event-offer-${offer.id}" type="checkbox" name="event-offer" ${isChecked} data-offer-id="${offer.id}">
          <label class="event__offer-label" for="event-offer-${offer.id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;
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

const createTripEventFormTemplate = (state, destinations, offers, isNewEvent) => {
  const {
    basePrice,
    type,
    destination: destinationId,
    offers: offerIds,
    dateFrom,
    dateTo
  } = state;

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
          <button class="event__reset-btn" type="reset">${isNewEvent ? 'Cancel' : 'Delete'}</button>

          ${isNewEvent ? '' : `
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>`}
        </header>

        <section class="event__details">
          ${createOffersTemplate(offerIds, offers, type)}

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

export default class TripEventFormView extends AbstractStatefulView {
  #destinations = [];
  #offers = [];
  #dateStartPicker = null;
  #dateEndPicker = null;
  #isNewEvent = false;

  #handleRollupClick = () => null;
  #handleFormSubmit = () => null;
  #handleDeleteButtonClick = () => null;

  constructor({
    point = BLANK_POINT,
    destinations,
    offers,
    isNewEvent = false,
    onRollupClick = () => null,
    onFormSubmit,
    onDeleteButtonClick
  }) {
    super();

    this.#destinations = destinations;
    this.#offers = offers;
    this.#isNewEvent = isNewEvent;

    this._setState(this.#parseEventToState(point));

    this.#handleRollupClick = onRollupClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteButtonClick = onDeleteButtonClick;

    this._restoreHandlers();
  }

  get template() {
    return createTripEventFormTemplate(this._state, this.#destinations, this.#offers, this.#isNewEvent);
  }

  removeElement() {
    super.removeElement();

    this.#destroyDatePickers();
  }

  reset(point) {
    this.updateElement(this.#parseEventToState(point));
  }

  _restoreHandlers() {
    const rollupButtonElement = this.element.querySelector('.event__rollup-btn');
    const eventOffersElement = this.element.querySelector('.event__available-offers');

    if (rollupButtonElement) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    }

    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-list').addEventListener('change', this.#eventTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler);

    if (eventOffersElement) {
      eventOffersElement.addEventListener('change', this.#offerClickHandler);
    }

    this.#setDatePickers();
  }

  #createDatePicker(element, options) {
    return flatpickr(
      element,
      {
        ...datePickerOptions,
        ...options
      }
    );
  }

  #destroyDatePickers() {
    if (this.#dateStartPicker) {
      this.#dateStartPicker.destroy();
      this.#dateStartPicker = null;
    }

    if (this.#dateEndPicker) {
      this.#dateEndPicker.destroy();
      this.#dateEndPicker = null;
    }
  }

  #parseEventToState(point) {
    return {
      ...point
    };
  }

  #parseStateToEvent(state) {
    return {
      ...state
    };
  }

  #setDatePickers() {
    this.#dateStartPicker = this.#createDatePicker(
      this.element.querySelector('#event-start-time-1'),
      {
        maxDate: this._state.dateTo,
        onChange: this.#eventDateStartChangeHandler
      }
    );

    this.#dateEndPicker = this.#createDatePicker(
      this.element.querySelector('#event-end-time-1'),
      {
        minDate: this._state.dateFrom,
        onChange: this.#eventDateEndChangeHandler
      }
    );
  }

  #eventDateStartChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate
    });
  };

  #eventDateEndChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate
    });
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();

    this.#handleDeleteButtonClick(this.#parseStateToEvent(this._state));
  };

  #destinationInputHandler = (evt) => {
    const selectedDestination = this.#destinations
      .find((destination) => destination.name === evt.target.value);

    if (selectedDestination) {
      this.updateElement({
        destination: selectedDestination.id
      });
    }
  };

  #eventTypeChangeHandler = (evt) => {
    if (evt.target.closest('input[type="radio"]')) {
      this.updateElement({
        type: evt.target.value
      });
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    this.#handleFormSubmit(this.#parseStateToEvent(this._state));
  };

  #priceInputChangeHandler = (evt) => {
    this._setState({
      basePrice: evt.target.value
    });
  };

  #offerClickHandler = (evt) => {
    if (evt.target.closest('input[type="checkbox"]')) {
      const offerId = evt.target.dataset.offerId;

      if (this._state.offers.includes(offerId)) {
        this._setState({
          offers: this._state.offers.filter((item) => item !== offerId)
        });
      } else {
        this._setState({
          offers: [...this._state.offers, offerId]
        });
      }
    }
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();

    this.#handleRollupClick();
  };
}
