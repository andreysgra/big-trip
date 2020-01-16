import {EventType} from '../const';

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const getRandomArrayItem = (array) => array[getRandomNumber(0, array.length)];

export const getRandomBool = () => Math.random() > 0.5;

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let random = Math.floor(Math.random() * (i + 1));
    let temp = array[random];

    array[random] = array[i];
    array[i] = temp;
  }

  return array;
};

export const toUpperCaseFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const formatEventTypePlaceholder = (eventType) => {
  const isTransfer = Object.keys(EventType)
    .some((category) => {
      return EventType[category]
        .includes(eventType) && category === `TRANSFERS`;
    });

  return isTransfer
    ? toUpperCaseFirstLetter(`${eventType} to`)
    : toUpperCaseFirstLetter(`${eventType} in`);
};

export const sortObject = (unsortedObject) => {
  const sortedObject = {};

  Object.keys(unsortedObject)
    .sort((a, b) => unsortedObject[b] - unsortedObject[a])
    .forEach((item) => {
      sortedObject[item] = unsortedObject[item];
    });

  return sortedObject;
};
