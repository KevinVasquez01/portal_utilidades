import { HostBinding, Injectable } from '@angular/core';
import { CompanyCreationLog, logs } from 'src/app/models/Company-utilities/company-creation-log';
import { CompanyR_UC } from '../../models/Company-utilities/company-r';
import { SeriesHDian } from '../../models/SeriesHDian/SeriesHDian';
import { AuthorizeCompanyService } from '../UtilidadesAPI/authorize-company.service';
import { APIGetServicePRD } from './apiget.service';

@Injectable({
  providedIn: 'root'
})
export class SerieHDianPRDService {
  //Almacena log compañías creadas
  @HostBinding('class.is-open') CompaniesCreated_Log: CompanyCreationLog[] = [];

  constructor(private _getDataPRD: APIGetServicePRD, private _AuthorizeCS: AuthorizeCompanyService) {
    this._AuthorizeCS.logCreateCompanies.subscribe(logs => this.CompaniesCreated_Log = logs);
  }

  createSerieD(serieHDian: SeriesHDian, virtualOperator: string, companyId: string) {
    return new Promise((resolve, reject) => {
      this._getDataPRD.NewSerieHDian(serieHDian, virtualOperator, companyId).subscribe(data => {
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

  updateSerieD(serieHDian: SeriesHDian, virtualOperator: string, companyId: string, idSerie: string) {
    return new Promise((resolve, reject) => {
      this._getDataPRD.UpdateSerieHDian(serieHDian, virtualOperator, companyId, idSerie).subscribe(data => {
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

  SearchSerieHD(virtualOperator: string, companyId: string) {
    return new Promise<any>((resolve, reject) => {
      this._getDataPRD.SearchSerieHDian(virtualOperator, companyId).subscribe(data => {
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

  //Serie habilitación
  async CrearSerieHDian(companyU: CompanyR_UC, virtualOperator: string) {
    var creation = this.CompaniesCreated_Log.find(x => x.Company_Utilities.id === companyU.id) || new CompanyCreationLog();

    if (companyU.series.length == 0) {
      await this.log(creation, 'Serie Habilitación DIAN', false, 'No se creó, información no proporcionada por el usuario.', false);
    }
    else {
      if (creation.IdCompany_PRD != '') {
        await this.SearchSerieHD(virtualOperator, creation.IdCompany_PRD)
          .then(async result => {
            let serieHDian: SeriesHDian = {
              Name: companyU.series[0].name,
              AuthorizationNumber: companyU.series[0].authorizationnumber,
              Prefix: companyU.series[0].prefix,
              StartValue: companyU.series[0].startvalue,
              EndValue: companyU.series[0].endvalue,
              EffectiveValue: companyU.series[0].efectivevalue,
              ValidFrom: companyU.series[0].validfrom,
              ValidTo: companyU.series[0].validto,
              TestSetId: companyU.series[0].testsetid,
              TechnicalKey: companyU.series[0].technicalkey
            };

            let seriesH: Array<any> = JSON.parse(JSON.stringify(result));
            if (seriesH.length > 0) {
              let idSerie = seriesH[0]['Id'] || '';
              let name = seriesH[0]['Name'] || '';

              await this.updateSerieD(serieHDian, virtualOperator, creation.IdCompany_PRD, idSerie)
                .then(async datareceive => {
                  await this.log(creation, 'Serie Habilitación DIAN', true, `Se actualizó serie de Habilitación DIAN: ${name}`, true);
                })
                .catch(async err => {
                  await this.log(creation, 'Serie Habilitación DIAN', false, `Error al actualizar la serie de Habilitación DIAN ${name}: ${JSON.stringify(err)}`, true);
                });
            }
            else {
              await this.createSerieD(serieHDian, virtualOperator, creation.IdCompany_PRD)
                .then(async datareceive => {
                  await this.log(creation, 'Serie Habilitación DIAN', true, `Se creó serie de Habilitación DIAN: ${datareceive}`, true);
                })
                .catch(async err => {
                  await this.log(creation, 'Serie Habilitación DIAN', false, `Error al crear la serie de Habilitación DIAN: ${JSON.stringify(err)}`, true);
                });
            }
          });
      }
    }
  }

  log(obj: CompanyCreationLog, modulo: string, status: boolean, message: string, isNecessary: boolean) {
    return new Promise((resolve) => {
      var indice = this.CompaniesCreated_Log.indexOf(obj);
      if (indice != -1) {
        let newLog: logs = { date: new Date(), module: modulo, message: message, status: status };
        obj.Messages_PRD.push(newLog);
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
