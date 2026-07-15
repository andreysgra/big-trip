import AbstractView from '../framework/view/abstract-view';

const createPointsLoadingView = () => `
  <section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
    <p class="trip-events__msg">Loading...</p>
  </section>
`;

export default class PointsLoadingView extends AbstractView {
  get template() {
    return createPointsLoadingView();
  }
}
