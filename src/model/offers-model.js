export default class OffersModel {
  #offersApiService = null;

  #offers = [];

  constructor(offersApiService) {
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return this.#offers;
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type);
  }

  async init() {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch (err) {
      this.#offers = [];
    }
  }
}
