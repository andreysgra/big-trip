import AbstractSmartComponent from './abstract-smart-component.js';
import {EventType, ChartTitle} from '../const.js';
import {sortObject} from '../utils/common.js';
import Chart from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";

export default class Statistics extends AbstractSmartComponent {
  constructor(eventsModel) {
    super();

    this._eventsModel = eventsModel;
    this._events = null;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts = this._renderCharts.bind(this);
  }

  _getChartConfig(data, title, label) {
    const types = Object.keys(data);

    return {
      type: `horizontalBar`,
      data: {
        labels: types.map((item) => item.toUpperCase()),
        datasets: [
          {
            data: types.map((type) => data[type]),
            backgroundColor: `rgba(21, 141, 235, 0.5)`,
            borderColor: `#158deb`,
            borderWidth: 1,
            borderSkipped: false,
            barThickness: 40,
            minBarLength: 60
          }
        ]
      },
      options: {
        layout: {
          padding: {
            left: 40,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        legend: {
          display: false,
        },
        plugins: {
          datalabels: {
            formatter: label,
            labels: {
              title: {
                anchor: `end`,
                align: `start`,
                color: `#0a64a7`,
                font: {
                  weight: `bold`,
                  size: 16
                }
              }
            }
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              display: false,
              beginAtZero: true
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              fontSize: 14
            }
          }]
        },
        title: {
          display: true,
          position: `left`,
          fontSize: 26,
          fontColor: `#424242`,
          fontStyle: `bold`,
          text: title.toUpperCase()
        },
        tooltips: {
          enabled: false
        },
      },
      plugins: [ChartDataLabels]
    };
  }

  _getMoneyData() {
    const data = this._events.reduce((acc, {type, price}) => {
      const value = acc[type] || 0;
      acc[type] = value + price;

      return acc;
    }, {});

    return sortObject(data);
  }

  _getTimeData() {
    const data = this._events.reduce((acc, {type, startDate, endDate}) => {
      const value = acc[type] || 0;
      acc[type] = value + endDate - startDate;

      return acc;
    }, {});

    Object.keys(data).forEach((type) => {
      data[type] = Math.round(moment.duration(data[type]).asHours());
    });

    return sortObject(data);
  }

  _getTransportData() {
    const data = this._events.reduce((acc, {type}) => {
      const isTransfer = Object.keys(EventType)
        .some((category) => {
          return EventType[category]
            .includes(type) && category === `TRANSFERS`;
        });

      if (isTransfer) {
        const value = acc[type] || 0;
        acc[type] = value + 1;
      }

      return acc;
    }, {});

    return sortObject(data);
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = new Chart(
        moneyCtx,
        this._getChartConfig(this._getMoneyData(),
            ChartTitle.MONEY,
            (value) => `€ ${value}`)
    );

    this._transportChart = new Chart(
        transportCtx,
        this._getChartConfig(this._getTransportData(),
            ChartTitle.TRANSPORT,
            (value) => `${value}x`)
    );

    this._timeChart = new Chart(
        timeCtx,
        this._getChartConfig(this._getTimeData(),
            ChartTitle.TIME_SPENT,
            (value) => `${value}H`)
    );
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }

  getTemplate() {
    return `
      <section class="statistics">
        <h2 class="visually-hidden">Trip statistics</h2>

        <div class="statistics__item statistics__item--money">
          <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--transport">
          <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--time-spend">
          <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
        </div>
      </section>
    `;
  }

  recoveryListeners() {

  }

  rerender() {
    this._events = this._eventsModel.getEventsAll();

    super.rerender();
    this._renderCharts();
  }

  show() {
    super.show();

    this.rerender();
  }
}
