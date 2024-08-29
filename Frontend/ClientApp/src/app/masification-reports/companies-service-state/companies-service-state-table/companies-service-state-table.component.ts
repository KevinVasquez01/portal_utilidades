import { BreakpointObserver } from '@angular/cdk/layout';
import { formatDate } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { companiesServiceWorkerState } from '../companies-service-state.component';
import { ExportService } from '../../../services/export.service';

@Component({
  selector: 'app-companies-service-state-table',
  templateUrl: './companies-service-state-table.component.html',
  styleUrls: ['./companies-service-state-table.component.scss']
})
export class CompaniesServiceStateTableComponent implements OnInit, AfterViewInit {
  @Input() table: companiesServiceWorkerState[] = []; //Lista de empresas con servicios

  displayedColumns = ['Aliado', 'nombre', 'Documento', 'FE', 'DS', 'NE', 'RFE'];
  dataSource: MatTableDataSource<companiesServiceWorkerState> = new MatTableDataSource();

  startDate_string = '';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);

  constructor(breakpointObserver: BreakpointObserver, private _export: ExportService) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe((result) => {
      this.displayedColumns = result.matches
        ? ['Aliado', 'nombre', 'Documento', 'FE', 'DS', 'NE', 'RFE']
        : ['Aliado', 'nombre', 'Documento', 'FE', 'DS', 'NE', 'RFE'];
    });

    //Fecha informe para Excel
    const format = 'ddMMyyyy';
    const locale = 'en-US';
    this.startDate_string = formatDate(new Date(), format, locale);
  }

  ngOnInit(): void {
    this.dataSource.data = this.table;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  exportExcel(): void {
    this._export.exportAsExcelFile(this.table, `Estado_Servicios_por_Empresa_${this.startDate_string}`);
  }

  exportJSON(): void {
    this._export.exportAsJSONFile(this.table, `Estado_Servicios_por_Empresa_${this.startDate_string}`);
  }
}
