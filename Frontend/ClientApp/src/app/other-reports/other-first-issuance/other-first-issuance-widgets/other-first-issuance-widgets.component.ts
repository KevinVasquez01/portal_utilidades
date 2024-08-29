import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStates,
  ApexGrid,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { Report_Firts_Documents_OV } from 'src/app/models/Reports/Documents/first-documents';

type ApexXAxis = {
  type?: 'category' | 'datetime' | 'numeric';
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

//var colors = ['#219FFA', '#2AFE1F', '#ffb200', '#ff6000', '#4e39e2', '#198114'];

var colors = [
  '#0000FF',
  '#008080',
  '#00FFFF',
  '#008000',
  '#00FF00',
  '#808000',
  '#FFFF00',
  '#800000',
  '#FF0000',
  '#808080',
  '#800080',
  '#FF00FF',
  '#000080',
  '#219FFA',
  '#2AFE1F',
  '#ffb200',
  '#ff6000',
  '#4e39e2',
  '#198114',
  '#CD5C5C',
];

type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  subtitle: ApexTitleSubtitle;
  colors: string[];
  states: ApexStates;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  tooltip: any; //ApexTooltip;
};

declare global {
  interface Window {
    Apex: any;
  }
}

window.Apex = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    shared: false,
  },
  legend: {
    show: false,
  },
};

class top_service {
  ov: string = '';
  count: number = 0;
  total: number = 0;
}

@Component({
  selector: 'app-other-first-issuance-widgets',
  templateUrl: './other-first-issuance-widgets.component.html',
  styleUrls: ['./other-first-issuance-widgets.component.scss'],
})
export class OtherFirstIssuanceWidgetsComponent implements OnInit {
  @Input() dataEntrante: Array<Report_Firts_Documents_OV> = [];

  @ViewChild('chart') chart!: ChartComponent;
  chartOvs!: Partial<ChartOptions>;
  chartServicesOvs!: Partial<ChartOptions>;

  top: {
    EmisionFE: top_service;
    EmisionDS: top_service;
    EmisionNE: top_service;
    RecepcionFE: top_service;
  } = {
    EmisionFE: new top_service(),
    EmisionDS: new top_service(),
    EmisionNE: new top_service(),
    RecepcionFE: new top_service(),
  };

  ngOnInit(): void {
    this.makeCharts(true);
    this.topVOP();
  }

  constructor() {
    this.makeCharts(false);
  }

  async makeCharts(includeData: boolean) {
    let data = includeData ? await this.makeData() : [];
    this.chartOvs = {
      series: [
        {
          name: 'ovs',
          data: data,
        },
      ],
      chart: {
        id: 'barOvs',
        height: data.length > 1 ? data.length * 30 + 170 : 200,
        width: '100%',
        type: 'bar',
        events: {
          dataPointSelection: (e, chart, opts) => {
            var servicesChartEl = document.querySelector('#chart-services');
            var ovsChartEl = document.querySelector('#chart-ovs');

            if (opts.selectedDataPoints[0].length === 1) {
              if (servicesChartEl?.classList.contains("active")) {
                this.updateServicesChart(chart, "barServices");
              } else {
                ovsChartEl?.classList.add("chart-services-activated");
                servicesChartEl?.classList.add("active");
                this.updateServicesChart(chart, "barServices");
              }
            } else {
              this.updateServicesChart(chart, "barServices");
            }

            if (opts.selectedDataPoints[0].length === 0) {
              ovsChartEl?.classList.remove("chart-services-activated");
              servicesChartEl?.classList.remove("active");
            }
          },
          updated: (chart) => {
            this.updateServicesChart(chart, 'barServices');
          },
        },
      },
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: true,
          barHeight: '75%',
          dataLabels: {
            position: 'left',
          },
        },
      },
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: ['#000000'],
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex];
        },
        offsetX: 0,
        dropShadow: {
          enabled: false,
        },
      },
      colors: colors,
      states: {
        normal: {
          filter: {
            type: 'desaturate',
          },
        },
        active: {
          allowMultipleDataPointsSelection: true,
          filter: {
            type: 'darken',
            value: 1,
          },
        },
      },
      tooltip: {
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function (val: any, opts: any) {
              return opts.w.globals.labels[opts.dataPointIndex];
            },
          },
        },
      },
      title: {
        text: 'Empresas por Operador Virtual',
        offsetX: 15,
      },
      subtitle: {
        text: '(Haga Click sobre la barra, para ver más detalles)',
        offsetX: 15,
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
    };

    this.chartServicesOvs = {
      series: [
        {
          name: 'services',
          data: [],
        },
      ],
      chart: {
        id: 'barServices',
        height: data.length > 1 ? data.length * 30 + 170 : 200,
        width: '100%',
        type: 'bar',
        stacked: true,
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
          horizontal: false,
        },
      },
      legend: {
        show: false,
      },
      grid: {
        yaxis: {
          lines: {
            show: false,
          },
        },
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      title: {
        text: 'Detalle empresas por Tipo de Servicio, OV Seleccionado.',
        offsetX: 10,
      },
      tooltip: {
        x: {
          formatter: function (val: any, opts: any) {
            return opts.w.globals.seriesNames[opts.seriesIndex];
          },
        },
        y: {
          title: {
            formatter: function (val: any, opts: any) {
              return opts.w.globals.labels[opts.dataPointIndex];
            },
          },
        },
      },
    };
  }

  colorassing(i: number) {
    let numero = i;
    while (numero > 20) {
      numero = numero - 20;
    }
    return numero;
  }

  async makeData() {
    var dataSeries: Array<any> = [];
    let values = this.OrderDescDocuments(this.dataEntrante, 'Total_Empresas');
    for (let i = 0; i < values.length; i++) {
      if (values[i].Total_Empresas > 0) {
        let quarters = [
          {
            x: 'Total Empresas',
            y: this.dataEntrante[i].Total_Empresas,
          },
        ];

        if (values[i].Empresas_E_FE > 0) {
          quarters.push({
            x: 'Emisión FE',
            y: values[i].Empresas_E_FE,
          });
        }

        if (values[i].Empresas_E_DS > 0) {
          quarters.push({
            x: 'Emisión DS',
            y: values[i].Empresas_E_DS,
          });
        }

        if (values[i].Empresas_E_NE > 0) {
          quarters.push({
            x: 'Emisión NE',
            y: values[i].Empresas_E_NE,
          });
        }

        if (values[i].Empresas_R_FE > 0) {
          quarters.push({
            x: 'Recepción FE',
            y: values[i].Empresas_R_FE,
          });
        }

        dataSeries.push({
          x: values[i].Operador_Virtual,
          y: values[i].Total_Empresas,
          color: colors[this.colorassing(i)],
          quarters: quarters,
        });
      }
    }
    return dataSeries;
  }

  async topVOP() {
    //Top Emisión FE
    let data1 = this.OrderDescDocuments(this.dataEntrante, 'Empresas_E_FE');
    this.top.EmisionFE.ov = data1[0]?.Operador_Virtual;
    this.top.EmisionFE.count = data1[0]?.Empresas_E_FE;
    this.top.EmisionFE.total = data1[0]?.Total_Empresas;

    //Top Emisión DS
    let data2 = this.OrderDescDocuments(this.dataEntrante, 'Empresas_E_DS');
    this.top.EmisionDS.ov = data2[0]?.Operador_Virtual;
    this.top.EmisionDS.count = data2[0]?.Empresas_E_DS;
    this.top.EmisionDS.total = data2[0]?.Total_Empresas;

    //Top Emisión NE
    let data3 = this.OrderDescDocuments(this.dataEntrante, 'Empresas_E_NE');
    this.top.EmisionNE.ov = data3[0]?.Operador_Virtual;
    this.top.EmisionNE.count = data3[0]?.Empresas_E_NE;
    this.top.EmisionNE.total = data3[0]?.Total_Empresas;

    //Top Recepción FE
    let data4 = this.OrderDescDocuments(this.dataEntrante, 'Empresas_R_FE');
    this.top.RecepcionFE.ov = data4[0]?.Operador_Virtual;
    this.top.RecepcionFE.count = data4[0]?.Empresas_R_FE;
    this.top.RecepcionFE.total = data4[0]?.Total_Empresas;
  }

  OrderDescDocuments(documents: any[], filtro: string) {
    let newDocuments = documents.sort((a, b) => {
      return b[filtro] - a[filtro];
    });
    return newDocuments;
  }

  shuffleArray(array: any[]) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  updateServicesChart(sourceChart: any, destChartIDToUpdate: any) {
    var series = [];
    var seriesIndex = 0;
    var colors = [];

    if (sourceChart.w.globals.selectedDataPoints[0]) {
      var selectedPoints = sourceChart.w.globals.selectedDataPoints;
      for (var i = 0; i < selectedPoints[seriesIndex].length; i++) {
        var selectedIndex = selectedPoints[seriesIndex][i];
        var ovsSeries = sourceChart.w.config.series[seriesIndex];
        series.push({
          name: ovsSeries.data[selectedIndex].x,
          data: ovsSeries.data[selectedIndex].quarters,
        });
        colors.push(ovsSeries.data[selectedIndex].color);
      }

      if (series.length === 0)
        series = [
          {
            data: [],
          },
        ];

      return window.ApexCharts.exec(destChartIDToUpdate, 'updateOptions', {
        series: series,
        colors: colors,
        fill: {
          colors: colors,
        },
      });
    }
  }

  fxFlexWidgets() {
    let count =
      (this.top.EmisionFE.count > 0 ? 1 : 0) +
      (this.top.EmisionDS.count > 0 ? 1 : 0) +
      (this.top.EmisionNE.count > 0 ? 1 : 0) +
      (this.top.RecepcionFE.count > 0 ? 1 : 0);

    return 100 / count;
  }
}
