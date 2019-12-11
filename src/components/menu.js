import {createElement} from '../utils.js';

export default class Menu {
  constructor(items) {
    this._items = items;
    this._element = null;
  }

  getTemplate() {
    return `
      <nav class="trip-controls__trip-tabs  trip-tabs">
        ${this._items
          .map((item, index) => {
            return `<a class="trip-tabs__btn ${index === 0 ? `trip-tabs__btn--active` : ``}" href="#">${item}</a>`;
          })
          .join(``)}
      </nav>
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
