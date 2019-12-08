import {getTripDayComponent} from './trip-day.js';

const getTripDaysComponent = () => {
  return `
    <ul class="trip-days">
      ${getTripDayComponent()}
    </ul>
  `;
};

export {getTripDaysComponent};
