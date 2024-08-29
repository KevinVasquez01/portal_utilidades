import { Injectable } from '@angular/core';
import { CompanySaphetyI } from 'src/app/models/Company/Company';
import { APIGetServiceQA } from './apiget.service';

@Injectable({
  providedIn: 'root'
})
export class SearchCompanyQaService {

  constructor(private _getGetDataQA: APIGetServiceQA) { }

  //Company
  getCompaniesIdQA(virtualOperator: string, documentNumber: string, name: string) {
    return new Promise((resolve, reject) => {
      let body = { Offset: 0, SortField: '-CreationDate', NumberOfRecords: 20, DocumentNumber: documentNumber, Name: name };
      this._getGetDataQA.GetCompaniestoSearch(body, virtualOperator).subscribe(data => {
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

  SearchCompanies(virtualOperator: string, documentNumber: string, name: string) {
    return new Promise<CompanySaphetyI[]>((resolve, reject) => {
      this.getCompaniesIdQA(virtualOperator, documentNumber, name)
        .then((companiesQA: any) => {
          let arrayresult: CompanySaphetyI[] = JSON.parse(JSON.stringify(companiesQA));
          resolve(arrayresult);
        })
        .catch((error) => {
          reject(error);
        })
    });
  }

  //Obtiene lista empresas sin filtro
  getCompaniesId_WithoutFilter(virtualOperator: string) {
    return new Promise((resolve, reject) => {
      let body = { Offset: 0, SortField: '-CreationDate', NumberOfRecords: 9999 };
      this._getGetDataQA.GetCompaniestoSearch_QA(body, virtualOperator).subscribe(data => {
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

  //promesa que retorna lista de empresas sin filtro
  SearchCompanies_WithoutFilter(virtualOperator: string) {
    return new Promise<CompanySaphetyI[]>((resolve, reject) => {
      this.getCompaniesId_WithoutFilter(virtualOperator)
        .then((companiesQA: any) => {
          let arrayresult: CompanySaphetyI[] = JSON.parse(JSON.stringify(companiesQA));
          resolve(arrayresult);
        })
        .catch((error) => {
          reject(error);
        })
    });
  }
}
