import {getDayComponent} from './day.js';

const getDaysComponent = () => {
  return `
    <ul class="trip-days">
      ${getDayComponent()}
    </ul>
  `;
};

export {
  getDaysComponent
};
