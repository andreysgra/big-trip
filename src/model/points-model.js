import Observable from '../framework/observable';

export default class PointsModel extends Observable {
  #points = [];

  constructor(points) {
    super();

    this.#points = points;
  }

  get points() {
    return this.#points;
  }

  update(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }
}
