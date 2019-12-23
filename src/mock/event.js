import {getRandomArrayItem, getRandomNumber, getRandomDate, getRandomBool, shuffle} from '../utils/common.js';
import {EVENT_TYPES, CITIES, OFFERS} from '../const.js';

const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
];

const generatePhotos = () => {
  const count = getRandomNumber(1, 6);

  return [...Array(count)].map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
};

const generateOffers = () => {
  const count = getRandomNumber(0, 6);

  return [...Array(count)].map((it, i) => OFFERS[i]);
};

const generateDescription = (descriptions) => {
  const count = getRandomNumber(1, 4);

  return shuffle(descriptions.slice())
    .slice(0, count)
    .join(` `);
};

const generateEvent = () => {
  const firstDate = getRandomDate();
  const secondDate = getRandomDate();

  return {
    type: getRandomArrayItem([...EVENT_TYPES.transfers, ...EVENT_TYPES.activities]),
    city: getRandomArrayItem(CITIES),
    photos: generatePhotos(),
    offers: generateOffers(),
    description: generateDescription(DESCRIPTIONS),
    startDate: Math.min(firstDate, secondDate),
    endDate: Math.max(firstDate, secondDate),
    price: getRandomNumber(10, 200),
    isFavorite: getRandomBool()
  };
};

const generateEvents = (count) => {
  return [...Array(count)]
    .map(() => generateEvent())
    .sort((a, b) => a.startDate - b.startDate);
};


export {generateEvents};
