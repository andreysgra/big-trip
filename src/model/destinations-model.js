export default class DestinationsModel {
  #destinations = [];

  constructor(destinations) {
    this.#destinations = destinations;
  }

  getDestination(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
