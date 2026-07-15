import AbstractView from '../framework/view/abstract-view';

const createErrorMessageTemplate = () => `
    <section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
      <p class="trip-events__msg">Unable to load route information</p>
    </section>
  `;

export default class ErrorMessageView extends AbstractView {
  get template() {
    return createErrorMessageTemplate();
  }
}
