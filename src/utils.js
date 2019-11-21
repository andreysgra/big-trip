const renderComponent = (container, component, position = `beforeend`) => {
  container.insertAdjacentHTML(position, component);
};

export {
  renderComponent
};
