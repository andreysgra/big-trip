import {getTripEventComponent} from './trip-event.js';
import {getTripEventEditComponent} from './trip-event-edit.js';

const EVENTS_COUNT = 3;

const getEvents = (eventsCount) => {
  return [...Array(eventsCount)]
    .map(() => getTripEventComponent())
    .join(``);
};

const getTripEventsComponent = () => {
  return `
    <ul class="trip-events__list">
      ${getTripEventEditComponent()}
      ${getEvents(EVENTS_COUNT)}
    </ul>
  `;
};

export {getTripEventsComponent};
