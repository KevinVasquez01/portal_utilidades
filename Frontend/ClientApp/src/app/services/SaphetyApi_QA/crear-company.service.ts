import { HostBinding, Injectable } from '@angular/core';
import { CompanyCreationLog, logs } from 'src/app/models/Company-utilities/company-creation-log';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { CompanySaphetyI } from 'src/app/models/Company/Company';
import { PersonSaphetyI } from 'src/app/models/Company/Person';
import { AuthorizeCompanyService } from '../UtilidadesAPI/authorize-company.service';
import { APIGetServiceQA } from './apiget.service';

interface Distributor {
  Id: string,
  Name: string
}

@Injectable({
  providedIn: 'root'
})
export class CrearCompanyService {
  //Almacena log compañías creadas
  @HostBinding('class.is-open') CompaniesCreated_Log: CompanyCreationLog[] = [];
  logDistribuidor = '';

  constructor(private _getGetDataQA: APIGetServiceQA, private _AuthorizeCS: AuthorizeCompanyService) {
    this._AuthorizeCS.logCreateCompanies.subscribe(logs => this.CompaniesCreated_Log = logs);
  }

  searchDistributors_QA() {
    return new Promise((resolve, reject) => {
      let body = {
        NumberOfRecords: 999,
        Offset: 0
      };
      this._getGetDataQA.SearchDistributors(body).subscribe(data => {
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

  validateDistributor(Company: CompanyR_UC) {
    return new Promise<string>(async (resolve, reject) => {
      await this.searchDistributors_QA()
        .then(data => {
          let distributors_data: Array<Distributor> = JSON.parse(JSON.stringify(data));
          if (distributors_data.length > 0) {
            let exist = distributors_data.find(x => x.Id == Company.distributorid);
            if (exist != undefined) {
              resolve(exist.Id);
            }
            else {
              if (Company.distributorid != '') {
                this.logDistribuidor = ` No existe Distribuidor Id ${Company.distributorid} en Ambiente QA, por lo que se creó compañía sin Distribuidor.`;
              }
              resolve('');
            }
          }
        })
        .catch(() => reject());
    });
  }

  searchCompany_QA(virtualOperator: string, documentNumber: string) {
    return new Promise((resolve, reject) => {
      let body = { NumberOfRecords: 1, DocumentNumber: documentNumber };
      this._getGetDataQA.GetCompanies(body, virtualOperator).subscribe(data => {
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
      await this.searchCompany_QA(virtualOperator, documentNumber)
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

  //Armar y enviar compañía
  async CrearCompany(Company: CompanyR_UC, virtualOperator: string) {
    return new Promise(async (resolve, reject) => {
      const idCompany = await this.existCompany(virtualOperator, Company.documentnumber);
      if (idCompany != '') {
        await this.newCompanyCreation(Company, idCompany, true, `Empresa ya existe en ambiente QA: ${idCompany}`);
        resolve(idCompany);
      }
      else {
        await this.validateDistributor(Company)
          .then(async (distributor) => {
            let responsabilities: string[] = [];
            let person: PersonSaphetyI = { FirstName: Company.firstname, MiddleName: Company.middlename, FamilyName: Company.familyname };
            for await (let element of Company.responsibilities) {
              responsabilities.push(element.responsabilitytypes);
            }

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

            await this.create_companyQA(SaphetyCompany, virtualOperator)
              .then(async datareceive => {
                await this.newCompanyCreation(Company, `${datareceive}`, true, `Se creó empresa en ambiente QA: ${datareceive}.${this.logDistribuidor}`);
                resolve(datareceive);
              })
              .catch(async err => {
                await this.newCompanyCreation(Company, '', false, `Ocurrió un error al crear la empresa en ambiente QA: ${JSON.stringify(err)}`);
                reject(err);
              });
          });
      }


      await this.existCompany(virtualOperator, Company.documentnumber)
        .then(async idCompany => {


        })
        .catch(async err => {
          await this.newCompanyCreation(Company, '', false, `Ocurrió un error al consultar si existe la empresa en ambiente QA: ${JSON.stringify(err)}`);
          reject(err);
        });
    });
  }

  create_companyQA(companyS: CompanySaphetyI, opv: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.NewCompany(companyS, opv).subscribe(data => {
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
      let nuevolog: logs = { date: new Date(), module: 'Creación Empresa QA', message: message, status: iscreated };

      //Log de compañía actual
      var companyLog = this.CompaniesCreated_Log.find(x => x.Company_Utilities === companyU) || new CompanyCreationLog();
      //Remuevo objeto de array
      this.CompaniesCreated_Log.forEach((value, index) => {
        if (value.Company_Utilities == companyU) {
          this.CompaniesCreated_Log.splice(index, 1)
        };
      });

      companyLog.IdCompany_QA = idCompany;
      if (companyLog.Company_Utilities?.documentnumber == '') {
        companyLog.Company_Utilities = companyU;
      }
      companyLog.General_Result = iscreated;
      companyLog.Messages_QA = [nuevolog];
      //Agrego objeto nuevo
      this.CompaniesCreated_Log.push(companyLog);
      this._AuthorizeCS.changelogCreateCompanies(this.CompaniesCreated_Log);
      resolve(true);
    });
  }
}
