import { Component, OnInit } from '@angular/core';
import { CompanyS_I } from 'src/app/models/SearchCompany/searchCompany';
import { HistoryChangesSincoM } from './history-changes-sinco-currentcompany/history-changes-sinco-currentcompany';

@Component({
  selector: 'app-history-changes-sinco',
  templateUrl: './history-changes-sinco.component.html',
  styleUrls: ['./history-changes-sinco.component.scss'],
})
export class HistoryChangesSincoComponent implements OnInit {
  companyName_Selected: string = '';
  companyDocument_Selected: string = '';
  companyDV_Selected: string = '';

  state: { number: number; error: string } = { number: 0, error: '' };

  constructor() {}

  ngOnInit(): void {}

  receiveCompanySearch(companies: CompanyS_I[]) {
    this.companyName_Selected = companies[0].Name;
    this.companyDocument_Selected = companies[0].Identification.DocumentNumber.trim();
    this.companyDV_Selected = companies[0].Identification.CheckDigit.trim();
    this.state.number = 1;
  }

  receiveCurrentCompanyClose(close: boolean) {
    this.companyName_Selected = '';
    this.companyDocument_Selected = '';
    this.companyDV_Selected = '';
    this.state.number = 0;
  }

  receiveTopChangeCompany(change: HistoryChangesSincoM) {
    this.companyName_Selected = change.company;
    this.companyDocument_Selected = change.document.split('-')[0].trim();
    this.companyDV_Selected = (change.document.split('-').length > 0 ? change.document.split('-')[1] : '').trim();
    this.state.number = 1;
  }
}
