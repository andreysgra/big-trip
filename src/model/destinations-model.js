export default class DestinationsModel {
  #destinations = [];

  constructor(destinations) {
    this.#destinations = destinations;
  }

  get destinations() {
    return this.#destinations;
  }

  getDestination(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
