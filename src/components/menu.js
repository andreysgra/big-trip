const getMenuComponent = (items) => {
  return `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${items
        .map((item, index) => {
          return `<a class="trip-tabs__btn ${index === 0 ? `trip-tabs__btn--active` : ``}" href="#">${item}</a>`;
        })
        .join(``)}
    </nav>
  `;
};

export {
  getMenuComponent
};
