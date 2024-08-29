import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexLegend,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexPlotOptions,
  ApexMarkers,
} from 'ng-apexcharts';
import { ReportsHistory } from 'src/app/models/Reports/reports-history';

export type ChartOptions = {
  colors: string[];
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: ApexMarkers; //ApexMarkers;
  stroke: any; //ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: any;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  labels: string[];
};
@Component({
  selector: 'app-history-activations-statistics',
  templateUrl: './history-activations-statistics.component.html',
  styleUrls: ['./history-activations-statistics.component.scss'],
})
export class HistoryActivationsStatisticsComponent implements OnInit {
  //Tables Data
  @Input() reportHistoryData: ReportsHistory[] = [];

  datehistory = '2022 - 2024';
  reportHistory_FE: ReportsHistory[] = [];
  reportHistory_DS: ReportsHistory[] = [];
  reportHistory_NE: ReportsHistory[] = [];
  reportHistory_DE: ReportsHistory[] = [];

  @ViewChild('chart')
  chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  data_moneyFE: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  data_activationsFE: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  data_moneyDS: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  data_activationsDS: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  data_moneyNE: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  data_activationsNE: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  data_moneyDE: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  data_activationsDE: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  async ngOnInit(): Promise<void> {
    this.reportHistory_FE = this.reportHistoryData.filter(
      (x) => x.report_type == 'invoice_activations'
    );
    this.reportHistory_DS = this.reportHistoryData.filter(
      (x) => x.report_type == 'supportdocument_activations'
    );
    this.reportHistory_NE = this.reportHistoryData.filter(
      (x) => x.report_type == 'payroll_activations'
    );
    this.reportHistory_DE = this.reportHistoryData.filter(
      (x) => x.report_type == 'EquivalentDoc_activations'
    );

    //Arma data NE
    await Promise.all(
      this.reportHistory_NE.map(async (company) => {
        let fecha = new Date(company.date.toString());
        var month = fecha.getMonth();
        this.data_moneyNE[month] =
          Number(this.data_moneyNE[month]) +
          Number(company.new_money === undefined ? 0 : company.new_money);
        this.data_activationsNE[month] =
          Number(this.data_activationsNE[month]) +
          Number(company.new_companies === undefined ? 0 : company.new_companies);
      })
    );

    //Arma data FE
    await Promise.all(
      this.reportHistory_FE.map(async (company) => {
        let fecha = new Date(company.date.toString());
        var month = fecha.getMonth();
        this.data_moneyFE[month] =
          Number(this.data_moneyFE[month]) +
          Number(company.new_money === undefined ? 0 : company.new_money);
        this.data_activationsFE[month] =
          Number(this.data_activationsFE[month]) +
          Number(company.new_companies === undefined ? 0 : company.new_companies);
      })
    );

    //Arma data DS
    await Promise.all(
      this.reportHistory_DS.map(async (company) => {
        let fecha = new Date(company.date.toString());
        var month = fecha.getMonth();
        this.data_moneyDS[month] =
          Number(this.data_moneyDS[month]) +
          Number(company.new_money === undefined ? 0 : company.new_money);
        this.data_activationsDS[month] =
          Number(this.data_activationsDS[month]) +
          Number(company.new_companies === undefined ? 0 : company.new_companies);
      })
    );
    
    //Arma data DE
    await Promise.all(
      this.reportHistory_DE.map(async (company) => {
        let fecha = new Date(company.date.toString());
        var month = fecha.getMonth();
        this.data_moneyDE[month] =
          Number(this.data_moneyFE[month]) +
          Number(company.new_money === undefined ? 0 : company.new_money);
        this.data_activationsDE[month] =
          Number(this.data_activationsDE[month]) +
          Number(company.new_companies === undefined ? 0 : company.new_companies);
      })
    );

    this.series[0].data = this.data_moneyFE;
    this.series[1].data = this.data_activationsFE;
    this.series[2].data = this.data_moneyDS;
    this.series[3].data = this.data_activationsDS;
    this.series[4].data = this.data_moneyNE;
    this.series[5].data = this.data_activationsNE;
    this.series[6].data = this.data_moneyDE;
    this.series[7].data = this.data_activationsDE;

    this.changeChart();
  }

  constructor(private _currencyPipe: CurrencyPipe) {
    this.chartOptions = {
      colors: this.colors,
      series: this.series,
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1, 3],
      },
      stroke: {
        width: [0, 5, 0, 5],
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },
      markers: {
        size: 0
      },
      fill: {
        opacity: [0.85, 1, 0.85, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      labels: this.labels,
      xaxis: {
        categories: this.labels,
      },
      yaxis: [
        /* Dinero Activaciones FE */
        {
          axisBorder: {
            show: true,
            color: this.colors[0],
          },
          labels: {
            formatter: (value) => {
              if (value === undefined) {
                return value;
              }
              let valueShow = '';
              let currencyPipe_transform = this._currencyPipe.transform(
                value,
                'USD'
              );
              if (currencyPipe_transform !== null) {
                valueShow = currencyPipe_transform;
              }

              var lasttrim = valueShow.substr(-2);
              if (lasttrim == '00') {
                valueShow = valueShow.substr(0, valueShow.length - 3);
              }
              return valueShow;
            }
          },
          title: {
            text: 'Dinero Activaciones Facturación'
          }
        },
        /* Nuevas Empresas FE */
        {
          seriesName: 'Nuevas empresas FE',
          opposite: true,
          axisBorder: {
            show: true,
            color: this.colors[1],
          },
          title: {
            text: 'Nuevas Empresas Facturación',
          },
        },
        /* Dinero Activaciones DS */
        {
          axisBorder: {
            show: true,
            color: this.colors[2],
          },
          labels: {
            formatter: (value) => {
              if (value === undefined) {
                return value;
              }
              let valueShow = '';
              let currencyPipe_transform = this._currencyPipe.transform(
                value,
                'USD'
              );
              if (currencyPipe_transform !== null) {
                valueShow = currencyPipe_transform;
              }

              var lasttrim = valueShow.substr(-2);
              if (lasttrim == '00') {
                valueShow = valueShow.substr(0, valueShow.length - 3);
              }
              return valueShow;
            }
          },
          title: {
            text: 'Dinero Activaciones Documento Soporte'
          }
        },
        /* Nuevas Empresas DS */
        {
          seriesName: 'Nuevas empresas DS',
          opposite: true,
          axisBorder: {
            show: true,
            color: this.colors[3],
          },
          title: {
            text: 'Nuevas Empresas Documento Soporte',
          },
        },
          /* Dinero Activaciones DE */
          {
            axisBorder: {
              show: true,
              color: this.colors[6],
            },
            labels: {
              formatter: (value) => {
                if (value === undefined) {
                  return value;
                }
                let valueShow = '';
                let currencyPipe_transform = this._currencyPipe.transform(
                  value,
                  'USD'
                );
                if (currencyPipe_transform !== null) {
                  valueShow = currencyPipe_transform;
                }
  
                var lasttrim = valueShow.substr(-2);
                if (lasttrim == '00') {
                  valueShow = valueShow.substr(0, valueShow.length - 3);
                }
                return valueShow;
              }
            },
            title: {
              text: 'Dinero Activaciones Equivalente'
            }
          },
          /* Nuevas Empresas DE */
          {
            seriesName: 'Nuevas empresas DE',
            opposite: true,
            axisBorder: {
              show: true,
              color: this.colors[7],
            },
            title: {
              text: 'Nuevas Empresas Equivalente',
            },
          },
        /* Dinero Activaciones NE */
        {
          seriesName: 'Dinero Activaciones NE',
          opposite: false,
          axisBorder: {
            show: true,
            color: this.colors[4],
          },
          labels: {
            formatter: (value) => {
              if (value === undefined) {
                return value;
              }
              let valueShow = '';
              let currencyPipe_transform = this._currencyPipe.transform(
                value,
                'USD'
              );
              if (currencyPipe_transform !== null) {
                valueShow = currencyPipe_transform;
              }

              var lasttrim = valueShow.substr(-2);
              if (lasttrim == '00') {
                valueShow = valueShow.substr(0, valueShow.length - 3);
              }
              return valueShow;
            }
          },
          title: {
            text: 'Dinero Activaciones Nómina',
          },
        },
        /* Nuevas Empresas NE */
        {
          seriesName: 'Nuevas empresas NE',
          opposite: true,
          axisBorder: {
            show: true,
            color: this.colors[5],
          },
          title: {
            text: 'Nuevas Empresas Nómina',
          },
        },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60,
        },
      },
    };
  }

  changeChart() {
    this.chartOptions = {
      colors: this.colors,
      series: this.series,
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1, 3, 5],
      },
      stroke: {
        width: [0, 5, 0, 5, 0, 5],
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },
      markers: {
        size: 0
      },
      fill: {
        opacity: [0.85, 1, 0.85, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      labels: this.labels,
      xaxis: {
        categories: this.labels,
      },
      yaxis: [
        /* Dinero Activaciones FE */
        {
          axisBorder: {
            show: true,
            color: this.colors[0],
          },
          labels: {
            formatter: (value) => {
              if (value === undefined) {
                return value;
              }
              let valueShow = '';
              let currencyPipe_transform = this._currencyPipe.transform(
                value,
                'USD'
              );
              if (currencyPipe_transform !== null) {
                valueShow = currencyPipe_transform;
              }

              var lasttrim = valueShow.substr(-2);
              if (lasttrim == '00') {
                valueShow = valueShow.substr(0, valueShow.length - 3);
              }
              return valueShow;
            }
          },
          title: {
            text: 'Dinero Facturación'
          }
        },
        /* Nuevas Empresas FE */
        {
          seriesName: 'Nuevas empresas FE',
          opposite: true,
          axisBorder: {
            show: true,
            color: this.colors[1],
          },
          title: {
            text: 'Nuevas Empresas Facturación',
          },
        },
        /* Dinero Activaciones DS */
        {
          axisBorder: {
            show: true,
            color: this.colors[2],
          },
          labels: {
            formatter: (value) => {
              if (value === undefined) {
                return value;
              }
              let valueShow = '';
              let currencyPipe_transform = this._currencyPipe.transform(
                value,
                'USD'
              );
              if (currencyPipe_transform !== null) {
                valueShow = currencyPipe_transform;
              }

              var lasttrim = valueShow.substr(-2);
              if (lasttrim == '00') {
                valueShow = valueShow.substr(0, valueShow.length - 3);
              }
              return valueShow;
            }
          },
          title: {
            text: 'Dinero Documento Soporte'
          }
        },
        /* Nuevas Empresas DS */
        {
          seriesName: 'Nuevas empresas DS',
          opposite: true,
          axisBorder: {
            show: true,
            color: this.colors[3],
          },
          title: {
            text: 'Nuevas Empresas Documento Soporte',
          },
        },
        /* Dinero Activaciones NE */
        {
          seriesName: 'Dinero Activaciones NE',
          opposite: false,
          axisBorder: {
            show: true,
            color: this.colors[4],
          },
          labels: {
            formatter: (value) => {
              if (value === undefined) {
                return value;
              }
              let valueShow = '';
              let currencyPipe_transform = this._currencyPipe.transform(
                value,
                'USD'
              );
              if (currencyPipe_transform !== null) {
                valueShow = currencyPipe_transform;
              }

              var lasttrim = valueShow.substr(-2);
              if (lasttrim == '00') {
                valueShow = valueShow.substr(0, valueShow.length - 3);
              }
              return valueShow;
            }
          },
          title: {
            text: 'Dinero Nómina',
          },
        },
        /* Nuevas Empresas NE */
        {
          seriesName: 'Nuevas empresas NE',
          opposite: true,
          axisBorder: {
            show: true,
            color: this.colors[5],
          },
          title: {
            text: 'Nuevas Empresas Nómina',
          },
        },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60,
        },
      },
    };
  }

  colors: string[] = ['#219FFA', '#4e39e2', '#2AFE1F', '#198114', '#ffb200', '#ff6000','#d4c527', '#d4c528'];

  labels: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  series: { name: string; type: string; data: number[] }[] = [
    {
      name: 'Dinero FE',
      type: 'column',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: 'Nuevas empresas FE',
      type: 'line',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: 'Dinero DS',
      type: 'column',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: 'Nuevas empresas DS',
      type: 'line',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: 'Dinero NE',
      type: 'column',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: 'Nuevas empresas NE',
      type: 'line',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: 'Dinero DE',
      type: 'column',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: 'Nuevas empresas DE',
      type: 'line',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];
}
