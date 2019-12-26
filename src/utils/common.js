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
