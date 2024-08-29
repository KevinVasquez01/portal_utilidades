import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexLegend,
  ApexResponsive,
  ChartComponent,
  ApexTooltip,
} from 'ng-apexcharts';
import { companiesServiceWorkerState_Widgets } from '../companies-service-state.component';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive | ApexResponsive[];
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-companies-service-state-widgets',
  templateUrl: './companies-service-state-widgets.component.html',
  styleUrls: ['./companies-service-state-widgets.component.scss'],
})
export class CompaniesServiceStateWidgetsComponent implements OnInit {
  @Input() widgets!: companiesServiceWorkerState_Widgets; //Aliado

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {};
  }
  ngOnInit(): void {
    let newWidgets = this.widgets;
    function valueToPercent(value: number, max: number) {
      return (value * 100) / max;
    }

    function valueToNumber(index: number) {
      if (index == 0) {
        return newWidgets.TotalEmpresas;
      } else if (index == 1) {
        return newWidgets.FE;
      } else if (index == 2) {
        return newWidgets.DS;
      } else if (index == 3) {
        return newWidgets.NE;
      } else {
        return newWidgets.RFE;
      }
    }

    function dosDecimales(n: { toString: () => any; }) {
      let t=n.toString();
      let regex=/(\d*.\d{0,2})/;
      return t.match(regex)[0];
    }

    this.chartOptions = {
      series: [
        valueToPercent(this.widgets.TotalEmpresas, this.widgets.TotalEmpresas),
        valueToPercent(this.widgets.FE, this.widgets.TotalEmpresas),
        valueToPercent(this.widgets.DS, this.widgets.TotalEmpresas),
        valueToPercent(this.widgets.NE, this.widgets.TotalEmpresas),
        valueToPercent(this.widgets.RFE, this.widgets.TotalEmpresas),
      ],
      chart: {
        height: 380,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetX: 10,
          offsetY: -10,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 0,
            size: '30%',
            background: 'transparent',
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      labels: [
        'Total Empresas',
        'FE Activas',
        'DS Activas',
        'NE Activas',
        'R FE Activas',
      ],
      legend: {
        show: true,
        floating: true,
        fontSize: '14px',
        position: 'left',
        offsetX: -10,
        offsetY: -10,
        labels: {
          useSeriesColors: true,
        },
        formatter: function (seriesName, opts) {
          return seriesName + ': ' + valueToNumber(opts.seriesIndex);
        },
        itemMargin: {
          horizontal: 0,
        },
      },
      responsive: [
        {
          breakpoint: 280,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
      tooltip: {
        enabled: true,
        x: {
          show: false
        },
        y: {
          formatter: function (value) {
            return dosDecimales(value) + '%';
          },
        },
      },
    };
  }
}
