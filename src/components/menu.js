import AbstractComponent from './abstract-component.js';

export default class Menu extends AbstractComponent {
  constructor(items) {
    super();
    this._items = items;
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
}
