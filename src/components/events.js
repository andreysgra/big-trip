import {getEventComponent} from './event.js';

const getEventsComponent = (eventsNumber) => {
  return new Array(eventsNumber)
    .fill(getEventComponent())
    .join(``);
};

export {
  getEventsComponent
};
