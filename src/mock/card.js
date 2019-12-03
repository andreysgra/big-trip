import {getRandomArrayItem, getRandomNumber, getRandomDate, shuffle} from '../utils.js';

const POINT_TYPES = [
  `bus`,
  `check-in`,
  `drive`,
  `flight`,
  `restaurant`,
  `ship`,
  `sightseeing`,
  `taxi`,
  `train`,
  `transport`,
  `trip`
];

const CITIES = [
  `Amsterdam`,
  `Rotterdam`,
  `Berlin`,
  `Vienna`,
  `Prague`,
  `Paris`
];

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

const OPTIONS = [
  {
    type: `luggage`,
    title: `Add luggage`,
    price: 10
  },
  {
    type: `comfort`,
    title: `Switch to comfort class`,
    price: 150
  },
  {
    type: `meal`,
    title: `Add meal`,
    price: 2
  },
  {
    type: `seat`,
    title: `Choose seats`,
    price: 9
  }
];

const generatePhotos = () => {
  const count = getRandomNumber(1, 6);

  return [...Array(count)].map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
};

const generateOptions = () => {
  const count = getRandomNumber(0, 3);

  return [...Array(count)].map((it, i) => OPTIONS[i]);
};

const generateDescription = (descriptions) => {
  const count = getRandomNumber(1, 4);

  return shuffle(descriptions.slice())
    .slice(0, count)
    .join(` `);
};

const generateCard = () => {
  const firstDate = getRandomDate(1, 7);
  const secondDate = getRandomDate(1, 7);

  return {
    type: getRandomArrayItem(POINT_TYPES),
    city: getRandomArrayItem(CITIES),
    photos: generatePhotos(),
    options: generateOptions(),
    description: generateDescription(DESCRIPTIONS),
    startDate: Math.min(firstDate, secondDate),
    endDate: Math.max(firstDate, secondDate),
    price: getRandomNumber(10, 200)
  };
};

const generateCards = (count) => {
  return [...Array(count)].map(() => generateCard());
};

export {generateCards};
