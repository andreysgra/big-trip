export const addEscapeEvent = (evt, action) => {
  const isEscKey = evt.key === 'Escape' || evt.key === 'Esc';

  if (isEscKey) {
    action(evt);
  }
};

export const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);
