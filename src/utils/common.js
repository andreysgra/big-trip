export const addEscapeEvent = (evt, action) => {
  const isEscKey = evt.key === 'Escape' || evt.key === 'Esc';

  if (isEscKey) {
    action(evt);
  }
};
