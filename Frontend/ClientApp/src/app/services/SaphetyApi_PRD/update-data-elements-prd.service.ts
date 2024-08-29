import { Injectable } from '@angular/core';
import { companyRoles } from 'src/app/models/dataElmenets-utilities/company-roles-utilities';
import { jsonDistI } from 'src/app/models/Jsonformat/jsonDistribuidores';
import { DataElementsService } from '../UtilidadesAPI/data-elements.service';
import { APIGetServicePRD } from './apiget.service';

interface Distributor {
  Id: string,
  Name: string
}

interface CompanyRoles_Language {
  Name: string,
  Name_Spanish: string
}

declare var require: any;
const jsonCompanyRoles_Language = require('src/assets/json/CompanyRoles_Language.json');

@Injectable({
  providedIn: 'root'
})
export class UpdateDataElementsPRDService {

  constructor(private _SaphApiPRD: APIGetServicePRD, private _DataElementsU: DataElementsService) { }

  UpdateDataElements() {
    return new Promise((resolve, reject) => {
      this.UpdateDistributors()
      .then(()=>{
        this.UpdateCompanyRoles()
        .then(()=> {
          resolve(true);
        })
        .catch(() => reject());
      })
      .catch(() => reject());
    });
  }

  async UpdateDistributors() {
    await this.searchDistribuitors().then(data => {
      let distributors_data: Array<Distributor> = JSON.parse(JSON.stringify(data));
      let distribuidores: Array<jsonDistI> = [];
      distribuidores.push({Id : '0', Name : 'NINGUNO'});
      distributors_data.forEach(x => distribuidores.push({ Id: x.Id, Name: x.Name }));
      if (distribuidores.length > 0) {
        this._DataElementsU.updateDistribuidores(distribuidores);
      }
    });
  }

  async UpdateCompanyRoles() {
    await this.SearchcompanyRoles().then(data => {
      let companyRoles_list: Array<Distributor> = JSON.parse(JSON.stringify(data));
      let companyRoles_Languages: Array<CompanyRoles_Language> = JSON.parse(JSON.stringify(jsonCompanyRoles_Language));
      let newCompanyRoles: Array<companyRoles> = [];
      companyRoles_list.forEach(rol => {
        let exist = companyRoles_Languages.find(x => x.Name == rol.Name);
        if (exist != undefined) {
          newCompanyRoles.push({Id : rol.Id, Name: rol.Name, Name_Spanish: exist.Name_Spanish, selected : false});
        }
      });
      if (newCompanyRoles.length > 0) {
        this._DataElementsU.updatecompanyRoles(newCompanyRoles);
      }
    });
  }

  searchDistribuitors() {
    return new Promise((resolve, reject) => {
      let body = { NumberOfRecords: 9999, Offset: 0 };
      this._SaphApiPRD.SearchDistributors(body).subscribe(data => {
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

  SearchcompanyRoles() {
    return new Promise((resolve, reject) => {
      this._SaphApiPRD.SearchcompanyRoles().subscribe(data => {
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
