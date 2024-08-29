import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jsonItemsI } from 'src/app/models/Jsonformat/jsonItems';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { TransactionsUI } from 'src/app/models/Transactions-utilities/transaction';
import { ReportsHistory } from 'src/app/models/Reports/reports-history';
import { Notifications } from 'src/app/models/Notifications/notifications';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

declare var require: any;
const jsonUtilidades= require('src/assets/json/UtilidadesAPI.json');

@Injectable({
  providedIn: 'root'
})

export class UtilidadesAPIService {

  constructor(private http: HttpClient) { }

  Profile(email: string) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'Profiles');
    let dirservice = `${url}${dir?.value}/${email}`;
    return this.http.get<string>(dirservice);
  }

  Profiles() : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'Profiles');
    let dirservice = `${url}${dir?.value}`;
    return this.http.get<string>(dirservice);
  }

  SearchCompany(documentNumber: string) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'SearchCompany');
    let dirservice = `${url}${dir?.value}/${documentNumber}`;
    return this.http.get(dirservice, httpOptions);
  }

  NewCompany(company: any) : Observable<any> {
    const { id, ...companyWithoutId } = company;
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['POST']));
    let dir = jsonvalor.find(option=> option.key == 'NewCompany');
    let dirservice = `${url}${dir?.value}`;
    return this.http.post(dirservice, companyWithoutId, httpOptions);
  }

  UpdateCompany(company: CompanyR_UC) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['PUT']));
    let dir = jsonvalor.find(option=> option.key == 'UpdateCompany');
    let dirservice = `${url}${dir?.value}/${company.id}`;
    return this.http.put(dirservice, company, httpOptions);
  }

  GetCompaniesPending() : Observable<Array<CompanyR_UC>> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'GetCompaniesPending');
    let dirservice = `${url}${dir?.value}`;
    return this.http.get<Array<CompanyR_UC>>(dirservice);
  }

  NewTransaction(transaction: TransactionsUI) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['POST']));
    let dir = jsonvalor.find(option=> option.key == 'Transactions');
    let dirservice = `${url}${dir?.value}`;
    return this.http.post(dirservice, transaction, httpOptions)
  }

  GetDataElements(modulo : string) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'DataElements');
    let dirservice = `${url}${dir?.value}/${modulo}`;
    return this.http.get<any>(dirservice);
  }

  UpdateDataElement(modulo : string, dataelement : any) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['PUT']));
    let dir = jsonvalor.find(option=> option.key == 'DataElements');
    let dirservice = `${url}${dir?.value}/${modulo}`;
    return this.http.put(dirservice, dataelement, httpOptions);
  }

  Transactions_Delete(documentNumber: string) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['PUT']));
    let dir = jsonvalor.find(option=> option.key == 'Transactions_Delete');
    let dirservice = `${url}${dir?.value}${documentNumber}`;
    return this.http.put(dirservice, httpOptions);
  }

  GetDefaultTemplates() : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'DefaultTemplates');
    let dirservice = `${url}${dir?.value}`;
    return this.http.get<any>(dirservice);
  }

  GetReportsHistory() : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'GetReportsHistory');
    let dirservice = `${url}${dir?.value}`;
    return this.http.get<any>(dirservice);
  }

  GetReportsHistory_ById(id: number) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'GetReportsHistory');
    let dirservice = `${url}${dir?.value}/${id}`;
    return this.http.get(dirservice, httpOptions);
  }

  GetReportsHistory_Labels() : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'GetReportsHistory_Labels');
    let dirservice = `${url}${dir?.value}`;
    return this.http.get<any>(dirservice);
  }

  GetReportsHistory_Labels_ByReportType(reportype: string) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'GetReportsHistory_Labels');
    let dirservice = `${url}${dir?.value}/${reportype}`;
    return this.http.get(dirservice, httpOptions);
  }

  NewReportsHistory(reportHistory: ReportsHistory) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['POST']));
    let dir = jsonvalor.find(option=> option.key == 'ReportsHistory');
    let dirservice = `${url}${dir?.value}`;
    return this.http.post(dirservice, reportHistory, httpOptions);
  }

  GetNotifications() : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'GetNotifications');
    let dirservice = `${url}${dir?.value}`;
    return this.http.get<any>(dirservice);
  }

  GetNotificationsByProfile(profile: string) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'GetNotificationsByProfile');
    let dirservice = `${url}${dir?.value}/${profile}`;
    return this.http.get<any>(dirservice);
  }

  NewNotifications(notifications: Array<Notifications>) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['POST']));
    let dir = jsonvalor.find(option=> option.key == 'Notifications');
    let dirservice = `${url}${dir?.value}`;
    return this.http.post(dirservice, notifications, httpOptions);
  }

  DeleteNotificationsByCompanyDocument(companyDocument: string) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['DELETE']));
    let dir = jsonvalor.find(option=> option.key == 'Notifications');
    let dirservice = `${url}${dir?.value}/${companyDocument}`;
    return this.http.delete(dirservice);
  }

  GetCompaniesReportedSalesforce_ByType(type: string) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'CompaniesReportedSalesforce');
    let dirservice = `${url}${dir?.value}/${type}`;
    return this.http.get(dirservice, httpOptions);
  }

  NewCompaniesReportedSalesforce(NewCompaniesSalesForce: Array<any>) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['POST']));
    let dir = jsonvalor.find(option=> option.key == 'CompaniesReportedSalesforce');
    let dirservice = `${url}${dir?.value}`;
    return this.http.post(dirservice, NewCompaniesSalesForce, httpOptions);
  }

  GetCompaniesFromUntil(from: string, until: string) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'GetCompaniesfrom');
    let desde = `desde=${from}`;
    let hasta = `hasta=${until}`;
    let dirservice = `${url}${dir?.value}?${desde}&${hasta}`;
    return this.http.get<any>(dirservice, httpOptions);
  }
}
