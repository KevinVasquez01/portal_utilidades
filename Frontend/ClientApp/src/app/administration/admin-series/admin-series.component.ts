import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyS_I } from 'src/app/models/SearchCompany/searchCompany';

@Component({
  selector: 'app-admin-series',
  templateUrl: './admin-series.component.html',
  styleUrls: ['./admin-series.component.scss']
})
export class AdminSeriesComponent implements OnInit {

  search_tittle = 'Adicionar Compañías';
  search_subtittle = 'Seleccione compañías a las que se les crearán Series';
  search_buttontooltip = 'Agregar';

  companies_to_add: CompanyS_I[] = [];
  logs = [];
  searchisclosed = true;
  showlogs = false;

  constructor(private _router: Router) {}
  ngOnInit(): void {
  }

  receiveCompanySearch(companies: CompanyS_I[]) {
    this.companies_to_add = companies;
  }

  receiveCompanySearchClose(close: boolean) {
    this.searchisclosed = close;
  }

  receiveLogs(logs: any) {
    this.logs = logs;
    this.showlogs = true;
  }

  receiveLogClose(close: boolean) {
    this.showlogs = close;
    this.logs = [];
  }

  receiveNewSerie(value: boolean) {
    this.searchisclosed = value;
  }
}
