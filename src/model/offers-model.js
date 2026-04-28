export default class OffersModel {
  #offers = [];

  constructor(offers) {
    this.#offers = offers;
  }

  getOffers(type) {
    return this.#offers.find((offer) => offer.type === type);
  }
}
