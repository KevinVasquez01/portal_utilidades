import { Component, Input, OnInit } from '@angular/core';
import { Report_Documents_topWidgets } from 'src/app/models/Reports/Documents/documents-issued';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-documents-isued-widgets',
  templateUrl: './documents-isued-widgets.component.html',
  styleUrls: ['./documents-isued-widgets.component.scss'],
})
export class DocumentsIsuedWidgetsComponent implements OnInit {
  @Input() topRecibido: Array<Report_Documents_topWidgets> = [];
  @Input() totalDocumentos: number = 0;
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() top_companies: boolean = true;
  @Input() widget_number: number = 0;

  single: Array<{ name: string; value: number }> = [];

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#20c997'],
  };

    colores = [
      '#20c997',
      '#fb8c00',
      '#7460ee',
      '#f62d51',
      '#4fc3f7',
      '#2962FF',
      '#49be25',
      '#9925be',
      '#96be25',
      '#6c25be',
    ];

  constructor() {
    // this.topRecibido = [
    //   {
    //     Aliado_OV: 'GLOBAL BPO',
    //     Nombre: 'SEGURIDAD Y VIGILANCIA COLOMBIANA SEVICOL LIMITADA',
    //     Nit: '890204162',
    //     Total: 179104,
    //   },
    //   {
    //     Aliado_OV: 'GLOBAL BPO',
    //     Nombre: 'MASIVO CAPITAL S A S',
    //     Nit: '900394791',
    //     Total: 34705,
    //   },
    //   {
    //     Aliado_OV: 'GLOBAL BPO',
    //     Nombre: 'ASOCIACION SINDICAL DE TRABAJADORES DE COLOMBIA Y LA SALUD',
    //     Nit: '900521307',
    //     Total: 28704,
    //   },
    //   {
    //     Aliado_OV: 'CLIENTE DIRECTO',
    //     Nombre: 'Hospital General de Medellín',
    //     Nit: '890904646',
    //     Total: 23234,
    //   },
    //   {
    //     Aliado_OV: 'SINCO',
    //     Nombre: 'MARIO ALBERTO  HUERTAS COTES',
    //     Nit: '19146113',
    //     Total: 14306,
    //   },
    // ];
  }

  ngOnInit(): void {
    this.colorScheme.domain = [this.colores[this.widget_number]];
    for (let i = 0; i < this.topRecibido.length; i++) {
      this.single.push({
        name: this.topRecibido[i].Aliado_OV,
        value: this.topRecibido[i].Total,
      });
    }
  }
}
