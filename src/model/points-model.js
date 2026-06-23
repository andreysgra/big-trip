export default class PointsModel {
  #points = [];

  constructor(points) {
    this.#points = points;
  }

  get points() {
    return this.#points;
  }
}
