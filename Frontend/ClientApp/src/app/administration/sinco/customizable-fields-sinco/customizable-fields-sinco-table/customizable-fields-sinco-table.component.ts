import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslationsResources } from 'src/app/models/TranslationsResources/translationsResources';

@Component({
  selector: 'app-customizable-fields-sinco-table',
  templateUrl: './customizable-fields-sinco-table.component.html',
  styleUrls: ['./customizable-fields-sinco-table.component.scss'],
})
export class CustomizableFieldsSincoTableComponent
  implements AfterViewInit, OnInit
{
  displayedColumns = ['id', 'name', 'progress', 'color'];
  dataSource!: MatTableDataSource<DataResults>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);

  retry: boolean = false;
  @Input() finalTranslationsResources: TranslationsResources[] = [];
  @Input() results_finalTranslationsResources: {
    index: number;
    result: boolean;
    description: string;
  }[] = [];

  @Output() retryEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(breakpointObserver: BreakpointObserver) {
    this.displayedColumns = [
      'Clave',
      'Idioma',
      'Descripcion',
      'Resultado',
      'MensajeError',
    ];
  }
  ngOnInit(): void {
    let dataResults: DataResults[] = [];
    for (let i = 0; i < this.results_finalTranslationsResources.length; i++) {
      let iresult = this.finalTranslationsResources.length > i ? i : i-this.finalTranslationsResources.length;
      dataResults.push({
        Clave: this.finalTranslationsResources[iresult].ResourceKey,
        Idioma: this.finalTranslationsResources[iresult].LanguageCode,
        Descripcion: this.finalTranslationsResources[iresult].Description,
        Resultado: this.results_finalTranslationsResources[i].result,
        MensajeError: this.results_finalTranslationsResources[i].description,
      });
    }
    this.retry =
      this.results_finalTranslationsResources.find((x) => !x.result) !=
      undefined;
    this.dataSource = new MatTableDataSource(dataResults);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  reintentar() {
    this.retryEvent.emit(false); //Emite, reintento
  }
}

export interface DataResults {
  Clave: string;
  Idioma: string,
  Descripcion: string;
  Resultado: boolean;
  MensajeError: string;
}
