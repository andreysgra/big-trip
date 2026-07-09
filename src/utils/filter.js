import {FilterType} from '../const';
import dayjs from 'dayjs';

const dateNow = dayjs();

const isEventFuture = (point) => dayjs(point.dateFrom).isAfter(dateNow);
const isEventPast = (point) => dayjs(point.dateTo).isBefore(dateNow);
const isEventPresent = (point) => (dayjs(point.dateFrom).isBefore(dateNow) ||
  dayjs(point.dateFrom).isSame(dateNow)) && dayjs(point.dateTo).isAfter(dateNow);

export const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter(isEventFuture),
  [FilterType.PRESENT]: (points) => points.filter(isEventPresent),
  [FilterType.PAST]: (points) => points.filter(isEventPast)
};
