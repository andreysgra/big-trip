import AbstractView from '../framework/view/abstract-view';
import {NoTripEventsMessage} from '../const';

const createTripEventsListEmptyTemplate = (filterType) => `
  <p class="trip-events__msg">${NoTripEventsMessage[filterType]}</p>
`;

export default class TripEventsListEmptyView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();

    this.#filterType = filterType;
  }

  get template() {
    return createTripEventsListEmptyTemplate(this.#filterType);
  }
}
