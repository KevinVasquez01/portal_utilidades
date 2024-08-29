import { Injectable } from '@angular/core';
import { ReportsHistory } from 'src/app/models/Reports/reports-history';
import { UtilidadesAPIService } from './utilidades-api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsHistoryService {

  constructor(private _UtilAPI: UtilidadesAPIService) { }

  GetReportsHistory_ById(id: number) {
    return new Promise((resolve, reject) => {
      this._UtilAPI.GetReportsHistory_ById(id).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  GetReportsHistory_Labels_All() {
    return new Promise((resolve, reject) => {
      this._UtilAPI.GetReportsHistory_Labels().subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  GetReportsHistory_Labels_ByReportType(reportype: string) {
    return new Promise((resolve, reject) => {
      this._UtilAPI.GetReportsHistory_Labels_ByReportType(reportype).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  NewReportsHistory(reportHistory: ReportsHistory) {
    return new Promise((resolve, reject) => {
      this._UtilAPI.NewReportsHistory(reportHistory).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  GetCompaniesReportedSalesforce_ByType(type: string) {
    return new Promise((resolve, reject) => {
      this._UtilAPI.GetCompaniesReportedSalesforce_ByType(type).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  NewCompaniesReportedSalesforce(array: Array<any>) {
    return new Promise((resolve, reject) => {
      this._UtilAPI.NewCompaniesReportedSalesforce(array).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}
