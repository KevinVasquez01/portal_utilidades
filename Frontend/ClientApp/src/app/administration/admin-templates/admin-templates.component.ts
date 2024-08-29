import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { Template_log } from 'src/app/models/Templates/templates';
import { CompanyS_I } from 'src/app/models/SearchCompany/searchCompany';

@Component({
  selector: 'app-admin-templates',
  templateUrl: './admin-templates.component.html',
  styleUrls: ['./admin-templates.component.css']
})
export class AdminTemplatesComponent implements OnInit {

  companies_to_add : CompanyS_I[] = [];
  logs: Template_log[] = [];
  searchisclosed = true;
  showlogs = false;

  search_tittle = 'Adicionar Compañías';
  search_subtittle = 'Seleccione compañías a las que se les creará Template';
  search_buttontooltip = 'Agregar a Template';

  constructor(private _router: Router) {}

  ngOnInit(): void {
  }

  receiveCompanySearch(companies : CompanyS_I[]){
    this.companies_to_add = companies;
  }

  receiveCompanyLogs(logs : Template_log[]){
    this.logs = logs;
    this.showlogs = true;
  }

  receiveNewTemplate(value : boolean){
    this.searchisclosed = value;
  }

  receiveCompanySearchClose(close : boolean){
    this.searchisclosed = close;
  }

  receiveLogClose(close : boolean){
    this.showlogs = close;
    this.logs = [];
  }

}
