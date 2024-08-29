import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jsonItemsI } from 'src/app/models/Jsonformat/jsonItems';

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
export class AuditCompanyCreationsService {

  constructor(private http: HttpClient) { }

  GetCompaniesAuthorized(from: string, until: string) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'AuditCompaniesAuthorized');
    let desde = `desde=${from}`;
    let hasta = `hasta=${until}`;
    let dirservice = `${url}${dir?.value}?${desde}&${hasta}`;
    return this.http.get<string>(dirservice);
  }

  GetCompaniesDeleted(from: string, until: string) : Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(JSON.stringify(jsonUtilidades['GET']));
    let dir = jsonvalor.find(option=> option.key == 'AuditCompaniesDeleted');
    let desde = `desde=${from}`;
    let hasta = `hasta=${until}`;
    let dirservice = `${url}${dir?.value}?${desde}&${hasta}`;
    return this.http.get<string>(dirservice);
  }

  CompaniesAuthorized(from: string, until: string) {
    return new Promise((resolve, reject) => {
      this.GetCompaniesAuthorized(from, until).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  CompaniesDeleted(from: string, until: string) {
    return new Promise((resolve, reject) => {
      this.GetCompaniesDeleted(from, until).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

}
