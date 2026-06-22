export default class OffersModel {
  #offers = [];

  constructor(offers) {
    this.#offers = offers;
  }

  get offers() {
    return this.#offers;
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type);
  }
}
