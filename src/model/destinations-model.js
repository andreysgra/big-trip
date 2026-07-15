export default class DestinationsModel {
  #destinationsApiService = null;

  #destinations = [];

  constructor(destinationsApiService) {
    this.#destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  getDestination(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  getDefaultDestinationId() {
    return this.#destinations[0].id;
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }
  }
}
