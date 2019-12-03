const renderComponent = (container, component, position = `beforeend`) => {
  container.insertAdjacentHTML(position, component);
};

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getRandomArrayItem = (array) => array[getRandomNumber(0, array.length)];

const getRandomBool = () => Math.random() > 0.5;

const getRandomDate = (startDay, endDay) => {
  const millisecondInDay = 24 * 3600 * 1000;

  return new Date(Date.now() + getRandomNumber(startDay * millisecondInDay, endDay * millisecondInDay));
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let random = Math.floor(Math.random() * (i + 1));
    let temp = array[random];

    array[random] = array[i];
    array[i] = temp;
  }

  return array;
};

export {renderComponent, getRandomNumber, getRandomArrayItem, getRandomBool, getRandomDate, shuffle};
