import AbstractComponent from './abstract-component.js';

const createMenuItemMarkup = ((item, isActive) => {
  const {name} = item;

  return `
    <a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" href="#" data-item-type="${name}">
      ${name}
    </a>
  `;
});

export default class Menu extends AbstractComponent {
  constructor(items) {
    super();
    this._items = items;
  }

  getTemplate() {
    const menuItemsMarkup = this._items
      .map((item) => createMenuItemMarkup(item, item.active))
      .join(``);

    return `
      <nav class="trip-controls__trip-tabs trip-tabs">
        ${menuItemsMarkup}
      </nav>
    `;
  }

  setActiveItem(menuItem) {
    const items = this.getElement().querySelectorAll(`a`);
    items.forEach((item) => item.classList.remove(`trip-tabs__btn--active`));

    const currentItem = [...items].find((item) => item.dataset.itemType === menuItem);
    currentItem.classList.add(`trip-tabs__btn--active`);
  }

  setItemClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      handler(evt.target.dataset.itemType);
    });
  }
}
