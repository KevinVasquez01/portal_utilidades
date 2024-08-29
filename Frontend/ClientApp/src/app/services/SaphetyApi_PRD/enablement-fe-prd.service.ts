import { Injectable } from '@angular/core';
import { APIGetServicePRD } from './apiget.service';

@Injectable({
  providedIn: 'root'
})
export class EnablementFePrdService {
  constructor(private _getGetDataPRD: APIGetServicePRD) {}

  createFV_Async(template: JSON, opvName: string) {
    return new Promise<any>((resolve, reject) => {
      this._getGetDataPRD.EnablementCreateFV(template, opvName).subscribe(
        (data) => {
          if (data['IsValid']) {
            resolve(data['ResultData']);
          } else {
            reject(data['ResultData']);
          }
        },
        (error) => {
          reject(error['error']);
        }
      );
    });
  }

  createNC_Async(template: JSON, opvName: string) {
    return new Promise<any>((resolve, reject) => {
      this._getGetDataPRD.EnablementCreateNC(template, opvName).subscribe(
        (data) => {
          if (data['IsValid']) {
            resolve(data['ResultData']);
          } else {
            reject(data['ResultData']);
          }
        },
        (error) => {
          reject(error['error']);
        }
      );
    });
  }

  createND_Async(template: JSON, opvName: string) {
    return new Promise<any>((resolve, reject) => {
      this._getGetDataPRD.EnablementCreateND(template, opvName).subscribe(
        (data) => {
          if (data['IsValid']) {
            resolve(data['ResultData']);
          } else {
            reject(data['ResultData']);
          }
        },
        (error) => {
          reject(error['error']);
        }
      );
    });
  }

  syncDocument_Status(opvName: string, documentId: string) {
    return new Promise<any>((resolve, reject) => {
      this._getGetDataPRD.EnablementSyncStatus(opvName, documentId).subscribe(
        (data) => {
          if (data['IsValid']) {
            resolve(data['ResultData']);
          } else {
            reject(data['ResultData']);
          }
        },
        (error) => {
          reject(error['error']);
        }
      );
    });
  }

  searchDocuments(
    opvName: string,
    IssueStartDate: Date,
    IssueEndDate: Date,
    TestSetId: string
  ) {
    return new Promise<any>((resolve, reject) => {
      this._getGetDataPRD
        .EnablementSearchDocuments(opvName, IssueStartDate, IssueEndDate, TestSetId)
        .subscribe(
          (data) => {
            if (data['IsValid']) {
              resolve(data['ResultData']);
            } else {
              reject(data['ResultData']);
            }
          },
          (error) => {
            reject(error['error']);
          }
        );
    });
  }
}
