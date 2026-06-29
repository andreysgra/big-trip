import dayjs from 'dayjs';

export const sortPointsByDate = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

export const sortPointsByTime = (pointA, pointB) =>
  dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom)) - dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));

export const sortPointsByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
