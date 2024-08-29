import { Injectable } from '@angular/core';
import { APIGetServiceQA } from './apiget.service';

@Injectable({
  providedIn: 'root',
})
export class EnablementFeQAService {
  constructor(private _getGetDataQA: APIGetServiceQA) {}

  createFV_Async(template: JSON, opvName: string) {
    return new Promise<any>((resolve, reject) => {
      this._getGetDataQA.EnablementCreateFV(template, opvName).subscribe(
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
      this._getGetDataQA.EnablementCreateNC(template, opvName).subscribe(
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
      this._getGetDataQA.EnablementCreateND(template, opvName).subscribe(
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
      this._getGetDataQA.EnablementSyncStatus(opvName, documentId).subscribe(
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
      this._getGetDataQA
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
