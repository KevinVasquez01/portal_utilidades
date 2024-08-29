import { BreakpointObserver } from '@angular/cdk/layout';
import { formatDate } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Report_Firts_Documents } from 'src/app/models/Reports/Documents/first-documents';

import { ExportService } from '../../../services/export.service';

@Component({
  selector: 'app-other-first-issuance-results',
  templateUrl: './other-first-issuance-results.component.html',
  styleUrls: ['./other-first-issuance-results.component.scss']
})
export class OtherFirstIssuanceResultsComponent implements OnInit, AfterViewInit {

  @Input() table: Report_Firts_Documents[] = []; //Primera emisión y recepción

  displayedColumns = ['ov', 'document', 'nombre', 'FE', 'emisionFE', 'DS', 'emisionDS', 'NE', 'emisionNE', 'RFE', 'recepcionFE'];
  dataSource: MatTableDataSource<Report_Firts_Documents> = new MatTableDataSource();

  startDate_string = '';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);

  constructor(breakpointObserver: BreakpointObserver, private _export: ExportService) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe((result) => {
      this.displayedColumns = result.matches
        ? ['ov', 'document', 'nombre']
        : ['ov', 'document', 'nombre', 'FE', 'emisionFE', 'DS', 'emisionDS', 'NE', 'emisionNE', 'RFE', 'recepcionFE'];
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
    this._export.exportAsExcelFile(this.table, `Primera_Emision_Recepcion_${this.startDate_string}`);
  }

  exportJSON(): void {
    this._export.exportAsJSONFile(this.table, `Primera_Emision_Recepcion_${this.startDate_string}`);
  }
}
