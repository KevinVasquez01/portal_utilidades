import { DatePipe } from '@angular/common';
import { HostBinding, Injectable } from '@angular/core';
import { CompanyCreationLog, logs } from 'src/app/models/Company-utilities/company-creation-log';
import { CompanyR_UC } from 'src/app/models/Company-utilities/company-r';
import { SeriesEmisionC } from 'src/app/models/SeriesEmision/SeriesEmision';
import { AuthorizeCompanyService } from '../UtilidadesAPI/authorize-company.service';
import { APIGetServiceQA } from './apiget.service';

@Injectable({
  providedIn: 'root'
})
export class SerieEmisionService {
  //Almacena log compañías creadas
  @HostBinding('class.is-open') CompaniesCreated_Log: CompanyCreationLog[] = [];

  constructor(private _getGetDataQA: APIGetServiceQA, private _AuthorizeCS: AuthorizeCompanyService, private _datePipe: DatePipe) {
    this._AuthorizeCS.logCreateCompanies.subscribe(logs => this.CompaniesCreated_Log = logs);
  }

  SearchSerieEmisionDocumentTypes() {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.SearchSerieEmisionDocumentTypes().subscribe(data => {
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

  createSerieE(serieEmision: SeriesEmisionC, virtualOperator: string, companyId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.NewSerieEmision(serieEmision, virtualOperator, companyId).subscribe(data => {
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

  ActivateSerieE(virtualOperator: string, companyId: string, serieId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.ActivateSerieEmision(virtualOperator, companyId, serieId).subscribe(data => {
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

  SearchSerieE(virtualOperator: string, companyId: string) {
    return new Promise((resolve, reject) => {
      this._getGetDataQA.SearchSerieEmision(virtualOperator, companyId).subscribe(data => {
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

  //Serie emision
  async CrearSerieEmision(companyU: CompanyR_UC, virtualOperator: string, documentTypes: { Code: string, Name: string, Serie: SeriesEmisionC, Selected: boolean }[]) {
    let personalizeName = false; //Indica si el nombre proviene de formulario o se concatena fecha con el tipo de documento como nombre
    if (documentTypes.length == 0) {
      documentTypes = [{ Code: 'SalesInvoice', Name: 'SalesInvoice', Serie: new SeriesEmisionC, Selected: true },
      { Code: 'CreditNote', Name: 'CreditNote', Serie: new SeriesEmisionC, Selected: true },
      { Code: 'DebitNote', Name: 'DebitNote', Serie: new SeriesEmisionC, Selected: true },
      { Code: 'SalesInvoiceContingency', Name: 'SalesInvoiceContingency', Serie: new SeriesEmisionC, Selected: true }];

      try {
        await this.SearchSerieEmisionDocumentTypes()
          .then((result) => {
            let newdocumentTypes: { Code: string, Name: string, Serie: SeriesEmisionC, Selected: true }[] = JSON.parse(JSON.stringify(result));
            //newdocumentTypes.forEach(x=> x.Serie = new SeriesEmisionC());
            if (newdocumentTypes.length > 0) {
              documentTypes.splice(0, documentTypes.length);
              documentTypes = newdocumentTypes;
            }
          });
      }
      catch { }
    }
    else{
      personalizeName = true;
    }

    let datetouse = this._datePipe.transform(new Date(), 'yyyyMMddhhmmss');
    var creation = this.CompaniesCreated_Log.find(x => x.Company_Utilities.id === companyU.id) || new CompanyCreationLog();
    //Crear Serie QA
    if (creation.IdCompany_QA != '') {
      await this.SearchSerieE(virtualOperator, creation.IdCompany_QA)
        .then(async result => {
          for await (let documentType of documentTypes) {
            let series: Array<any> = JSON.parse(JSON.stringify(result));
            let serieFound = '';
            if (series.length > 0) {
              let serieDocument = series.find(x => x['DocumentType'] == documentType.Code);
              if (serieDocument != undefined) {
                serieFound = serieDocument['Name'];
              }
            }

            if (serieFound != '') {
              await this.log(creation, `Serie ${documentType.Name}`, true, `La empresa ya cuenta con serie emisión: ${serieFound}.`, true);
            }
            else {
              let serieName = personalizeName ? documentType.Serie.Name : `${documentType.Name}_${datetouse}`;
              if (companyU.dataCreations[0].salesinvoice_included == false) {
                await this.log(creation, `Serie ${documentType.Name}`, true, `No se creó serie de emisión ${documentType.Name}, dado que el usuario no seleccionó servicio de Facturación Electrónica.`, false);
              }
              else {
                let serieEmision: SeriesEmisionC = documentType.Serie == undefined ? new SeriesEmisionC() : JSON.parse(JSON.stringify(documentType.Serie));
                serieEmision.Name = serieName;
                serieEmision.DocumentType = serieEmision.DocumentType == '' ? documentType.Code : serieEmision.DocumentType;

                await this.createSerieE(serieEmision, virtualOperator, creation.IdCompany_QA)
                  .then(async (datareceive) => {
                    await this.log(creation, `Serie ${documentType.Name}`, true, `Se creó serie de emisión ${documentType.Name}`, true);

                    await this.ActivateSerieE(virtualOperator, creation.IdCompany_QA, String(datareceive))
                      .then(async () => {
                        await this.log(creation, `Serie ${documentType.Name}`, true, `Se activó la serie de emisión: ${documentType.Name}.`, true);
                      })
                      .catch(async (err) => {
                        await this.log(creation, `Serie ${documentType.Name}`, false, `Error al crear Activar la serie de emisión: ${documentType.Name}: ${JSON.stringify(err)}`, true);
                      });
                  })
                  .catch(async (err) => {
                    await this.log(creation, `Serie ${documentType.Name}`, false, `Error al crear la serie de emisión: ${documentType.Name}: ${JSON.stringify(err)}`, true);
                  });
              }
            }
          }
        })
        .catch(async (err) => {
          await this.log(creation, `Series de emisión`, false, `Error al consultar y crear las series de emisión: ${JSON.stringify(err)}`, true);
        });

    }
  }

  log(obj: CompanyCreationLog, modulo: string, status: boolean, message: string, isNecessary: boolean) {
    return new Promise((resolve) => {
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
      resolve(true);
    });
  }
}
