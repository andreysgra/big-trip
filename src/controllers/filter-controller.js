import FilterComponent from '../components/filter.js';
import {replaceComponent, renderComponent} from '../utils/render.js';
import {FilterType} from '../const.js';

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  render() {
    const container = this._container;

    const filters = Object.values(FilterType)
      .map((filterType) => {
        return {
          name: filterType,
          checked: filterType === this._activeFilterType
        };
      });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replaceComponent(this._filterComponent, oldComponent);
    } else {
      renderComponent(container, this._filterComponent);
    }
  }
}
