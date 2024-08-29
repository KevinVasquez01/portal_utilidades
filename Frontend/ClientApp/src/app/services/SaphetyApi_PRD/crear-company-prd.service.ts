import { HostBinding, Injectable } from '@angular/core';
import { CompanyCreationLog, logs } from 'src/app/models/Company-utilities/company-creation-log';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { CompanySaphetyI } from 'src/app/models/Company/Company';
import { PersonSaphetyI } from 'src/app/models/Company/Person';
import { AuthorizeCompanyService } from '../UtilidadesAPI/authorize-company.service';
import { APIGetServicePRD } from './apiget.service';

interface Distributor {
  Id: string,
  Name: string
}

@Injectable({
  providedIn: 'root'
})
export class CrearCompanyPRDService {
  //Almacena log compañías creadas
  @HostBinding('class.is-open') CompaniesCreated_Log: CompanyCreationLog[] = [];
  logDistribuidor = '';

  constructor(private _getDataPRD: APIGetServicePRD, private _AuthorizeCS: AuthorizeCompanyService) {
    this._AuthorizeCS.logCreateCompanies.subscribe(logs => this.CompaniesCreated_Log = logs);
  }

  searchDistributors_PRD() {
    return new Promise((resolve, reject) => {
      let body = { NumberOfRecords: 9999, Offset: 0 };
      this._getDataPRD.SearchDistributors(body).subscribe(data => {
        if (data.IsValid) {
          resolve(data.ResultData);
        }
        else {
          reject(data.ResultData);
        }
      }, error => {
        reject(error.Errors);
      });
    });
  }

  validateDistributor(Company: CompanyR_UC) {
    return new Promise<string>(async (resolve) => {
        await this.searchDistributors_PRD()
          .then(data => {
            let distributors_data: Array<Distributor> = JSON.parse(JSON.stringify(data));
            if (distributors_data.length > 0) {
              let exist = distributors_data.find(x => x.Id == Company.distributorid);
              if (exist != undefined) {
                resolve(exist.Id);
              }
              else {
                if (Company.distributorid != '') {
                  this.logDistribuidor = ` No existe Distribuidor Id ${Company.distributorid} en Ambiente PRD, por lo que se creó compañía sin Distribuidor.`;
                }
                resolve('');
              }
            }
          });
    });
  }

  searchCompany_PRD(virtualOperator: string, documentNumber: string) {
    return new Promise((resolve, reject) => {
      let body = { NumberOfRecords: 1, DocumentNumber: documentNumber };
      this._getDataPRD.GetCompanies(body, virtualOperator).subscribe(data => {
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

  existCompany(virtualOperator: string, documentNumber: string) {
    return new Promise<string>(async (resolve, reject) => {
        await this.searchCompany_PRD(virtualOperator, documentNumber)
          .then((companies: any) => {
            let arrayresult: CompanySaphetyI[] = JSON.parse(JSON.stringify(companies));
            let company = arrayresult.find(x => x.Identification.DocumentNumber == documentNumber);
            if (company != undefined) {
              resolve(company.Id);
            }
            else {
              resolve('');
            }
          })
          .catch((error) => {
            reject(JSON.stringify(error));
          });
    });
  }

  //Armar y enviar compañía PRD
  async CrearCompanyPRD(Company: CompanyR_UC, virtualOperator: string) {
    return new Promise(async (resolve, reject) => {
      await this.existCompany(virtualOperator, Company.documentnumber)
        .then(async idCompany => {
          if (idCompany != '') {
            await this.newCompanyCreation(Company, idCompany, true, `Empresa ya existe en ambiente PRD: ${idCompany}`);
            resolve(idCompany);
          }
          else {
            await this.validateDistributor(Company)
              .then(async (distributor) => {
                let responsabilities: string[] = [];
                let person: PersonSaphetyI = { FirstName: Company.firstname, MiddleName: Company.middlename, FamilyName: Company.familyname };
                Company.responsibilities.forEach(element => { responsabilities.push(element.responsabilitytypes) });

                let SaphetyCompany: CompanySaphetyI = {
                  Identification: {
                    CountryCode: Company.countrycode,
                    DocumentType: Company.documenttype,
                    DocumentNumber: Company.documentnumber,
                    CheckDigit: Company.checkdigit,
                  },
                  Address: {
                    PostalCode: Company.contacts[0].postalcode,
                    DepartmentCode: Company.contacts[0].departmentcode,
                    CityCode: Company.contacts[0].citycode,
                    AddressLine: Company.contacts[0].addressline,
                    Country: Company.contacts[0].country,
                  },
                  ResponsabilityTypes: responsabilities,
                  Medias: [],
                  IsInboundIntegrated: false,
                  IsOutboundIntegrated: false,
                  Logo: {},
                  Person: person,
                  LanguageCode: Company.languagecode,
                  LegalType: Company.legaltype,
                  TimezoneCode: Company.timezonecode,
                  TaxScheme: Company.taxscheme,
                  Name: Company.name,
                  Email: Company.contacts[0].email,
                  FinancialSupportEmail: Company.contacts[0].financialsupportemail,
                  DistributorId: distributor,
                  Id: ''
                };

                  await this.create_companyPRD(SaphetyCompany, virtualOperator)
                    .then(async datareceive => {
                      await this.newCompanyCreation(Company, `${datareceive}`, true, `Se creó empresa en ambiente PRD: ${datareceive}. ${this.logDistribuidor}`);
                      resolve(datareceive);
                    })
                    .catch(async err => {
                      await this.newCompanyCreation(Company, '', false, `Ocurrió un error al crear la empresa en ambiente PRD: ${JSON.stringify(err)}`);
                      reject(err);
                    });
              });
          }
        })
        .catch(async err => {
          await this.newCompanyCreation(Company, '', false, `Ocurrió un error al consultar si existe la empresa en ambiente PRD: ${JSON.stringify(err)}`);
          reject(err);
        });
    });
  }

  create_companyPRD(companyS: CompanySaphetyI, opv: string) {
    return new Promise((resolve, reject) => {
      this._getDataPRD.NewCompany(companyS, opv).subscribe(data => {
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

  newCompanyCreation(companyU: CompanyR_UC, idCompany: string, iscreated: boolean, message: string) {
    return new Promise((resolve) => {
      let nuevolog: logs = { date: new Date(), module: 'Creación Empresa', message: message, status: iscreated };
      this.CompaniesCreated_Log.push({
        IdCompany_PRD: idCompany,
        IdCompany_QA: '',
        Company_Utilities: companyU,
        General_Result: iscreated,
        Messages_PRD: [nuevolog],
        Messages_QA: []
      });
      this._AuthorizeCS.changelogCreateCompanies(this.CompaniesCreated_Log);
      resolve(true);
    });
  }
}
