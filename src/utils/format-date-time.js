import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const getMonthAsStringDay = (date) => dayjs(date).format('MMMM DD');

export const getFullDate = (date) => dayjs(date).format('YYYY-MM-DD');

export const getTime = (date) => dayjs(date).format('HH:mm');

export const getDateDiff = (date1, date2) => {
  const durationDiff = dayjs.duration(dayjs(date2).diff(date1));
  const days = durationDiff.days() ?
    `${durationDiff.days().toString().padStart(2, '0')}D` : '';
  const hours = durationDiff.hours() ?
    `${durationDiff.hours().toString().padStart(2, '0')}H` : '';
  const minutes = durationDiff.minutes() ?
    `${durationDiff.minutes().toString().padStart(2, '0')}M` : '';

  return `${days} ${hours} ${minutes}`.trim();
};

export const getDateTime = (date) => dayjs(date).format('DD/MM/YY HH:mm');
