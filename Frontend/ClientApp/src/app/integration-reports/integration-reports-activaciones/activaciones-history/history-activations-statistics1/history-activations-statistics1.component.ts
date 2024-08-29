import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
} from 'ng-apexcharts';
import { ReportsHistory } from 'src/app/models/Reports/reports-history';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-history-activations-statistics1',
  templateUrl: './history-activations-statistics1.component.html',
  styleUrls: ['./history-activations-statistics1.component.scss'],
})
export class HistoryActivationsStatistics1Component implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  //Tables Data
  @Input() reportHistoryData: ReportsHistory[] = [];

  datehistory = '2022';
  reportHistory_FE: ReportsHistory[] = [];
  reportHistory_DS: ReportsHistory[] = [];
  reportHistory_NE: ReportsHistory[] = [];
  reportHistory_RE: ReportsHistory[] = [];

  data_FE: Array<{
    month: number;
    money: number;
    count: number;
    read: boolean;
  }> = [];
  data_moneyFE: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  data_activationsFE: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  data_DS: Array<{
    month: number;
    money: number;
    count: number;
    read: boolean;
  }> = [];
  data_moneyDS: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  data_activationsDS: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  data_NE: Array<{
    month: number;
    money: number;
    count: number;
    read: boolean;
  }> = [];
  data_moneyNE: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  data_activationsNE: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  data_RE: Array<{
    month: number;
    money: number;
    count: number;
    read: boolean;
  }> = [];
  data_moneyRE: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  data_activationsRE: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  categories: string[] = [
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

  constructor(private _currencyPipe: CurrencyPipe) {
    this.chartOptions = {
      series: [
        {
          name: 'Facturación Electrónica',
          data: [],
        },
        {
          name: 'Documento Soporte',
          data: [],
        },
        {
          name: 'Recepción Electrónica',
          data: [],
        },
        {
          name: 'Nómina Electrónica',
          data: [],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          dataLabels: {
            position: 'top',
          },
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
        ],
      },
      yaxis: {
        title: {
          text: 'Dinero Activaciones',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return '$ ' + val;
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + '%';
        },
        offsetY: -15,
        style: {
          fontSize: '9px',
          colors: ['#304758'],
        },
      },
    };
  }

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
    this.reportHistory_RE = this.reportHistoryData.filter(
      (x) => x.report_type == 'reception_activations'
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

    for (let i = 0; this.data_moneyFE.length > i; i++) {
      this.data_FE.push({
        month: i,
        money: this.data_moneyFE[i],
        count: this.data_activationsFE[i],
        read: false,
      });
    }

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

    for (let i = 0; this.data_moneyDS.length > i; i++) {
      this.data_DS.push({
        month: i,
        money: this.data_moneyDS[i],
        count: this.data_activationsDS[i],
        read: false,
      });
    }

    //Arma data RE
    await Promise.all(
      this.reportHistory_RE.map(async (company) => {
        let fecha = new Date(company.date.toString());
        var month = fecha.getMonth();
        this.data_moneyRE[month] =
          Number(this.data_moneyRE[month]) +
          Number(company.new_money === undefined ? 0 : company.new_money);
        this.data_activationsRE[month] =
          Number(this.data_activationsRE[month]) +
          Number(company.new_companies === undefined ? 0 : company.new_companies);
      })
    );

    for (let i = 0; this.data_moneyRE.length > i; i++) {
      this.data_RE.push({
        month: i,
        money: this.data_moneyRE[i],
        count: this.data_activationsRE[i],
        read: false,
      });
    }

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

    for (let i = 0; this.data_moneyNE.length > i; i++) {
      this.data_NE.push({
        month: i,
        money: this.data_moneyNE[i],
        count: this.data_activationsNE[i],
        read: false,
      });
    }

    this.changeChart();
  }

  read(value: number) {
    let lista = this.data_FE.filter((x) => !x.read);
    let find = lista.find((x) => x.money == value);
    if (find) {
      find.read = true;
      return find.count != 0 ? find.count : '';
    }

    lista = this.data_DS.filter((x) => !x.read);
    find = lista.find((x) => x.money == value);
    if (find) {
      find.read = true;
      return find.count != 0 ? find.count : '';
    }

    lista = this.data_RE.filter((x) => !x.read);
    find = lista.find((x) => x.money == value);
    if (find) {
      find.read = true;
      return find.count != 0 ? find.count : '';
    }

    lista = this.data_NE.filter((x) => !x.read);
    find = lista.find((x) => x.money == value);
    if (find) {
      find.read = true;
      return find.count != 0 ? find.count : '';
    }

    return '';
  }

  changeChart() {
    this.chartOptions = {
      series: [
        {
          name: 'Facturación Electrónica',
          data: this.data_moneyFE,
        },
        {
          name: 'Documento Soporte',
          data: this.data_moneyDS,
        },
        {
          name: 'Recepción Electrónica',
          data: this.data_moneyRE,
        },
        {
          name: 'Nómina Electrónica',
          data: this.data_moneyNE,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          dataLabels: {
            position: 'top',
          },
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: this.categories,
      },
      yaxis: {
        title: {
          text: 'Dinero Activaciones',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (value: number) => {
            if (value === 0) {
              return '';
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
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (value: number) => {
          return this.read(value);
        },
        offsetY: -15,
        style: {
          fontSize: '9px',
          colors: ['#304758'],
        },
      },
    };
  }
}
