import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, retry } from 'rxjs/operators';

declare var require: any;
const jsonQA = require('src/assets/json/SaphetyQA.json');

@Injectable({
  providedIn: 'root'
})
export class CompaniesPlansPackagesService {

  constructor(private http: HttpClient) {}

  GetPackagesFE(virtualOperatorID: string, CompanyID: string): Observable<any> {
    let url = jsonQA['Root'];
    let token = localStorage.getItem('token');
    let headers = { Authorization: `Bearer ${token}` };
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${virtualOperatorID}/companies/${CompanyID}/prepaiddocumentpackagepurchases`;
    //Devuelve respuesta
    return this.http.get<any>(direction, options);
  }

  GetPlansFE(virtualOperatorID: string, CompanyID: string): Observable<any> {
    let url = jsonQA['Root'];
    let token = localStorage.getItem('token');
    let headers = { Authorization: `Bearer ${token}` };
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${virtualOperatorID}/companies/${CompanyID}/companypostpaiddocumentplans`;
    //Devuelve respuesta
    return this.http.get<any>(direction, options);
  }

  GetPackagesNE(body: any, virtualOperator: string, CompanyID: string): Observable<any> {
    let url = jsonQA['Root'];
    let direction = `${url}serviceoffercontrol/${virtualOperator}/payrollpackages/companies/${CompanyID}/search?NumberOfRecords=undefined&Offset=undefined`;
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    return this.http.post<any>(direction, body, options).pipe(
      retry(5), // you retry 5 times
      delay(500) // each retry will start after 0.5 second
    );
  }

  GetPlansNE(body: any, virtualOperator: string, CompanyID: string): Observable<any> {
    let url = jsonQA['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${virtualOperator}/payrollplans/companies/${CompanyID}/search?NumberOfRecords=undefined&Offset=undefined`;
    return this.http.post<any>(direction, body, options).pipe(
      retry(5), // you retry 5 times
      delay(500) // each retry will start after 0.5 second
    );
  }

  GetPackagesDS(body: any, virtualOperator: string, CompanyID: string): Observable<any> {
    let url = jsonQA['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${virtualOperator}/supportdocumentplans/companies/${CompanyID}/search?NumberOfRecords=undefined&Offset=undefined`;
    return this.http.post<any>(direction, body, options).pipe(
      retry(5), // you retry 5 times
      delay(500) // each retry will start after 0.5 second
    );
  }

  GetPlansDS(body: any, virtualOperator: string, CompanyID: string): Observable<any> {
    let url = jsonQA['Root'];
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    let direction = `${url}serviceoffercontrol/${virtualOperator}/supportdocumentpackages/companies/${CompanyID}/search?NumberOfRecords=undefined&Offset=undefined`;
    return this.http.post<any>(direction, body, options).pipe(
      retry(5), // you retry 5 times
      delay(500) // each retry will start after 0.5 second
    );
  }

  searchPackagesFE(virtualOperatorID: string, CompanyID: string) {
    return new Promise((resolve, reject) => {
      this.GetPackagesFE(virtualOperatorID, CompanyID).subscribe(data => {
        if (data['IsValid']) {
          resolve(data['ResultData']);
        }
        else {
          reject(data['ResultData']);
        }
      }, error => {
        reject(error['error']);
      });
    });
  }

  searchPlansFE(virtualOperatorID: string, CompanyID: string) {
    return new Promise((resolve, reject) => {
      this.GetPlansFE(virtualOperatorID, CompanyID).subscribe(data => {
        if (data['IsValid']) {
          resolve(data['ResultData']);
        }
        else {
          reject(data['ResultData']);
        }
      }, error => {
        reject(error['error']);
      });
    });
  }

  searchPackagesNE(virtualOperator: string, virtualOperatorID: string, CompanyID: string) {
    return new Promise((resolve, reject) => {
      let body = {
        CompanyId: CompanyID,
        VirtualOperatorId: virtualOperatorID
      };
      this.GetPackagesNE(body, virtualOperator, CompanyID).subscribe(data => {
        if (data['IsValid']) {
          resolve(data['ResultData']);
        }
        else {
          reject(data['ResultData']);
        }
      }, error => {
        reject(error['error']);
      });
    });
  }

  searchPlansNE(virtualOperator: string, virtualOperatorID: string, CompanyID: string) {
    return new Promise((resolve, reject) => {
      let body = {
        CompanyId: CompanyID,
        VirtualOperatorId: virtualOperatorID
      };
      this.GetPlansNE(body, virtualOperator, CompanyID).subscribe(data => {
        if (data['IsValid']) {
          resolve(data['ResultData']);
        }
        else {
          reject(data['ResultData']);
        }
      }, error => {
        reject(error['error']);
      });
    });
  }

  searchPackagesDS(virtualOperator: string, virtualOperatorID: string, CompanyID: string) {
    return new Promise((resolve, reject) => {
      let body = {
        CompanyId: CompanyID,
        VirtualOperatorId: virtualOperatorID
      };
      this.GetPackagesDS(body, virtualOperator, CompanyID).subscribe(data => {
        if (data['IsValid']) {
          resolve(data['ResultData']);
        }
        else {
          reject(data['ResultData']);
        }
      }, error => {
        reject(error['error']);
      });
    });
  }

  searchPlansDS(virtualOperator: string, virtualOperatorID: string, CompanyID: string) {
    return new Promise((resolve, reject) => {
      let body = {
        CompanyId: CompanyID,
        VirtualOperatorId: virtualOperatorID
      };
      this.GetPlansDS(body, virtualOperator, CompanyID).subscribe(data => {
        if (data['IsValid']) {
          resolve(data['ResultData']);
        }
        else {
          reject(data['ResultData']);
        }
      }, error => {
        reject(error['error']);
      });
    });
  }
}
