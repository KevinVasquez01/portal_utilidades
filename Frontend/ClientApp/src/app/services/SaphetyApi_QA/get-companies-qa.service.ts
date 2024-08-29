import { HostBinding, Injectable } from '@angular/core';
import { CompanyCreationLog, logs } from 'src/app/models/Company-utilities/company-creation-log';
import { CompanySaphetyI } from 'src/app/models/Company/Company';
import { AuthorizeCompanyService } from '../UtilidadesAPI/authorize-company.service';
import { APIGetServiceQA } from './apiget.service';

@Injectable({
  providedIn: 'root'
})
export class GetCompaniesQAService {
  //Almacena log compañías creadas
  @HostBinding('class.is-open') CompaniesCreated_Log: CompanyCreationLog[] = [];

  constructor(private _getGetDataQA: APIGetServiceQA, private _AuthorizeCS: AuthorizeCompanyService) {
    this._AuthorizeCS.logCreateCompanies.subscribe(logs => this.CompaniesCreated_Log = logs);
  }

  //Company
  getCompaniesIdQA(getGetDataQA: APIGetServiceQA, virtualOperator: string, documentNumber: string) {
    return new Promise((resolve, reject) => {
      let body = { NumberOfRecords: 1, DocumentNumber: documentNumber };
      getGetDataQA.GetCompanies(body, virtualOperator).subscribe(data => {
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

  async awaitCompanies(virtualOperator: string, element: CompanyCreationLog) {
    //En caso de que la compañía tenga ID QA.
    if (element.IdCompany_QA != '') {
      return;
    }

    await this.getCompaniesIdQA(this._getGetDataQA, virtualOperator, element.Company_Utilities.documentnumber)
      .then((companiesQA: any) => {
        let arrayresult: CompanySaphetyI[] = JSON.parse(JSON.stringify(companiesQA));
        let companyQA = arrayresult.find(x => x.Identification.DocumentNumber == element.Company_Utilities.documentnumber);
        if (companyQA != undefined) {
          //Se asocia company ID QA
          element.IdCompany_QA = companyQA.Id;
          this.addCompanyCreation(element, 'Obtener Id QA', true, 'Se obtuvo Id QA con éxito.', true);
        }
      })
      .catch((error) => {
        this.addCompanyCreation(element, 'Obtener Id QA', false, 'Ocurrió un error al obtener: ' + JSON.stringify(error), true);
      })
  }

  addCompanyCreation(obj: CompanyCreationLog, modulo: string, status: boolean, message: string, isNecessary: boolean) {
    var indice = this.CompaniesCreated_Log.indexOf(obj);
    if (indice != -1) {
      let newLog: logs = { date: new Date(), module: modulo, message: message, status: status };
      obj.Messages_QA.push(newLog);
      obj.General_Result = isNecessary ? (obj.General_Result ? status : obj.General_Result) : obj.General_Result;

      //Elimino objeto a modificar
      this.CompaniesCreated_Log.splice(indice, 1);
      //Agrego nuevo objeto
      this.CompaniesCreated_Log.push(obj);
      this._AuthorizeCS.changelogCreateCompanies(this.CompaniesCreated_Log);
    }
  }
}
