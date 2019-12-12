const addLeadZero = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const getRandomArrayItem = (array) => array[getRandomNumber(0, array.length)];

export const getRandomBool = () => Math.random() > 0.5;

export const getRandomDate = () => {
  const day = 24 * 3600 * 1000;

  return getRandomNumber(Date.now(), Date.now() + day * 3);
};

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let random = Math.floor(Math.random() * (i + 1));
    let temp = array[random];

    array[random] = array[i];
    array[i] = temp;
  }

  return array;
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  const day = addLeadZero(date.getDate());
  const month = addLeadZero(date.getMonth() + 1);
  const year = String(date.getFullYear()).slice(2);

  return `${day}/${month}/${year}`;
};

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);

  const hours = addLeadZero(date.getHours());
  const minutes = addLeadZero(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const formatDuration = (time) => {
  const millisecondsInMinute = 60 * 1000;
  const millisecondsInHour = millisecondsInMinute * 60;

  const hours = addLeadZero(Math.floor(time / millisecondsInHour));
  const minutes = addLeadZero(Math.floor(time % millisecondsInHour / millisecondsInMinute));

  return `${hours > 0 ? `${hours}H` : ``} ${minutes}M`;
};

export const addEscapeEvent = (evt, action) => {
  if (evt.key === `Escape` || evt.key === `Esc`) {
    action();
  }
};
