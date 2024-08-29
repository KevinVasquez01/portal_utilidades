import { Component, Input, OnInit, ViewChild } from "@angular/core";
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
  ApexTooltip
} from "ng-apexcharts";
import { companiesServiceWorkerState_Widgets } from "../companies-service-state.component";

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
  selector: 'app-companies-service-state-widget',
  templateUrl: './companies-service-state-widget.component.html',
  styleUrls: ['./companies-service-state-widget.component.scss']
})
export class CompaniesServiceStateWidgetComponent implements OnInit {
  @Input() widgets: companiesServiceWorkerState_Widgets[] = []; //Lista de aliados
  widgets2: companiesServiceWorkerState_Widgets[] = []; //Lista windgets 2


  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: []
      },
      yaxis: {
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
        }
      }
    };
  }
  ngOnInit(): void {
    let categories: string[] = [];
    let series: {name: string, data: number[]}[] = [
      {name: 'Total Empresas', data:[]},
      {name: 'Factura Electrónica', data:[]},
      {name: 'Documento Soporte', data:[]},
      {name: 'Nómina Electrónica', data:[]},
      {name: 'Recepción Factura', data:[]}
    ];

    for(let i = 0; i<this.widgets.length; i++){
      if(i<9){
        this.widgets2.push(this.widgets[i]);
      }

      categories.push(this.widgets[i].Aliado);
      series[0].data.push(this.widgets[i].TotalEmpresas);
      series[1].data.push(this.widgets[i].FE);
      series[2].data.push(this.widgets[i].DS);
      series[3].data.push(this.widgets[i].NE);
      series[4].data.push(this.widgets[i].RFE);
    }

    this.chartOptions = {
      series: series,
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: categories
      },
      yaxis: {
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
        }
      }
    };
  }
}
