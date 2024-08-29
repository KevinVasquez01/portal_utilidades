import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { companiesPlansPackagesDetail, companiesPlansPackagesStateExcel } from '../companies-plans-packages.component';

import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-companies-plans-packages-results',
  templateUrl: './companies-plans-packages-results.component.html',
  styleUrls: ['./companies-plans-packages-results.component.scss']
})
export class CompaniesPlansPackagesResultsComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<companiesPlansPackagesStateExcel>;

  @Input() tabla1: companiesPlansPackagesStateExcel[] = [];
  @Input() tabla2: companiesPlansPackagesDetail[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);

  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe((result) => {
      this.displayedColumns = result.matches
        ? ['Aliado', 'Razón Social', 'Documento', 'FE', 'DS', 'NE', 'RE']
        : ['Razón Social', 'Documento', 'FE', 'DS', 'NE', 'RE'];
    });

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.tabla1);
  }
  ngOnInit(): void {
    // Assign the data to the data source for the table to render
    this.dataSource.data = this.tabla1;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  title = 'Excel';
  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tabla1);
    const ws1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tabla2);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      `Planes y Paquetes`
    );
    XLSX.utils.book_append_sheet(wb, ws1, `Detalle Planes Paquetes`);

    //Fecha informe para Excel
    const format = 'ddMMyyyy';
    const locale = 'en-US';

    XLSX.writeFile(
      wb,
      `Saphety_PlanesyPaquetes_${formatDate(new Date, format, locale)}.xlsx`,
      { bookType: 'xlsx', bookSST: true, type: 'binary' }
    );
  }

  exit( ){

  }
}

