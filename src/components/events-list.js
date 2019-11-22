import {getEventsComponent} from './events.js';

const EVENTS_NUMBER = 3;

const getEventsListComponent = () => {
  return `
    <ul class="trip-events__list">
      ${getEventsComponent(EVENTS_NUMBER)}
    </ul>
  `;
};

export {
  getEventsListComponent
};
