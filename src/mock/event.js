import {getRandomNumber, getRandomBool, shuffle} from '../utils/common.js';
import {EventType} from '../const.js';
import {DESCRIPTIONS, CITIES, OFFERS} from './const.js';

const EVENTS_COUNT = 10;
const OFFERS_MAX_COUNT = 5;

const generateDate = () => {
  const day = 24 * 3600 * 1000;

  return Date.now() + getRandomNumber(-day, day * 3);
};

const generateOffers = () => {
  const count = getRandomNumber(0, OFFERS_MAX_COUNT + 1);

  return shuffle(OFFERS.slice())
    .slice(0, count);
};

const generateDescription = (descriptions) => {
  const count = getRandomNumber(1, 4);

  return shuffle(descriptions.slice())
    .slice(0, count)
    .join(` `);
};

const generatePictures = (description) => {
  const count = getRandomNumber(1, 6);

  return [...Array(count)]
    .map(() => {
      return {
        src: `http://picsum.photos/300/150?r=${Math.random()}`,
        description
      };
    });
};

export const Destinations = CITIES.map((city) => {
  return {
    name: city,
    description: generateDescription(DESCRIPTIONS),
    pictures: generatePictures(city)
  };
});

export const Offers = [...EventType.TRANSFERS, ...EventType.ACTIVITIES]
  .map((type) => {
    return {
      type,
      offers: generateOffers()
    };
  });

const generateEvent = () => {
  const firstDate = generateDate();
  const secondDate = generateDate();
  const destination = Destinations[getRandomNumber(0, Destinations.length)];
  const offersList = Offers[getRandomNumber(0, Offers.length)];
  const offersCount = getRandomNumber(0, offersList.offers.length);

  return {
    id: String(new Date() + Math.random()),
    type: offersList.type,
    destination,
    offers: offersList.offers.slice(0, offersCount),
    startDate: Math.min(firstDate, secondDate),
    endDate: Math.max(firstDate, secondDate),
    price: getRandomNumber(10, 200),
    isFavorite: getRandomBool()
  };
};

export const generateEvents = () => {
  return [...Array(EVENTS_COUNT)]
    .map(() => generateEvent());
};
