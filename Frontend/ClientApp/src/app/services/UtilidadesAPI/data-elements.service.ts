import { Injectable } from '@angular/core';
import { DataElmentsUI, DataElmentsUC } from 'src/app/models/dataElmenets-utilities/dataElmenets-utilities';
import { UtilidadesAPIService } from './utilidades-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataElementsService {

  constructor(private _UtilAPI: UtilidadesAPIService) { }

  getProfileU(email : string) {
    return new Promise<any>((resolve, reject) => {
      this._UtilAPI.Profile(email).subscribe(data => {
        resolve(data['profile']);
      }, error => {
        reject();
      });
    });
  }

  getDdataelementU(modulo : string) {
    return new Promise<DataElmentsUI>((resolve, reject) => {
      this._UtilAPI.GetDataElements(modulo).subscribe(data => {
        let distribuidores : DataElmentsUI = JSON.parse(JSON.stringify(data));
        if(distribuidores != null){
          resolve(distribuidores);
        }
        else{
          reject();
        }
      }, error => {
        reject(error);
      });
    });
  }

  updateDistribuidores(dataelement: any) {
    return new Promise((resolve, reject) => {
      let json = JSON.stringify(dataelement);
      let DataElement : DataElmentsUC = {module: 'Distribuidores', json: json};
      this._UtilAPI.UpdateDataElement('Distribuidores', DataElement).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updatecompanyRoles(dataelement: any) {
    return new Promise((resolve, reject) => {
      let json = JSON.stringify(dataelement);
      let DataElement : DataElmentsUC = {module: 'companyRoles', json: json};
      this._UtilAPI.UpdateDataElement('companyRoles', DataElement).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateAlliesNames(dataelement: any) {
    return new Promise((resolve, reject) => {
      let json = JSON.stringify(dataelement);
      let DataElement : DataElmentsUC = {module: 'Reports_AlliesNames', json: json};
      this._UtilAPI.UpdateDataElement('Reports_AlliesNames', DataElement).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateAlliesIncludesTopMasificationDocuments(dataelement: any) {
    return new Promise((resolve, reject) => {
      let json = JSON.stringify(dataelement);
      let DataElement : DataElmentsUC = {module: 'Reports_AlliesIncludes_M_Top', json: json};
      this._UtilAPI.UpdateDataElement('Reports_AlliesIncludes_M_Top', DataElement).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateCompanies_reported_Salesforce_NE(dataelement: any) {
    return new Promise((resolve, reject) => {
      let json = JSON.stringify(dataelement);
      let DataElement : DataElmentsUC = {module: 'Companies_reported_Salesforce_NE', json: json};
      this._UtilAPI.UpdateDataElement('Companies_reported_Salesforce_NE', DataElement).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateLast_time_activationsReport_generation_NE(dataelement: any) {
    return new Promise((resolve, reject) => {
      let json = JSON.stringify(dataelement);
      let DataElement : DataElmentsUC = {module: 'Last_time_activationsReport_generation_NE', json: json};
      this._UtilAPI.UpdateDataElement('Last_time_activationsReport_generation_NE', DataElement).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateCompanies_reported_Salesforce_FE(dataelement: any) {
    return new Promise((resolve, reject) => {
      let json = JSON.stringify(dataelement);
      let DataElement : DataElmentsUC = {module: 'Companies_reported_Salesforce_FE', json: json};
      this._UtilAPI.UpdateDataElement('Companies_reported_Salesforce_FE', DataElement).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateLast_time_activationsReport_generation_FE(dataelement: any) {
    return new Promise((resolve, reject) => {
      let json = JSON.stringify(dataelement);
      let DataElement : DataElmentsUC = {module: 'Last_time_activationsReport_generation_FE', json: json};
      this._UtilAPI.UpdateDataElement('Last_time_activationsReport_generation_FE', DataElement).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateLast_time_activationsReport_generation_DE(dataelement: any) {
    return new Promise((resolve, reject) => {
      let json = JSON.stringify(dataelement);
      let DataElement : DataElmentsUC = {module: 'Last_time_activationsReport_generation_DE', json: json};
      this._UtilAPI.UpdateDataElement('Last_time_activationsReport_generation_DE', DataElement).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateLast_time_activationsReport_generation_RE(dataelement: any) {
    return new Promise((resolve, reject) => {
      let json = JSON.stringify(dataelement);
      let DataElement : DataElmentsUC = {module: 'Last_time_activationsReport_generation_RE', json: json};
      this._UtilAPI.UpdateDataElement('Last_time_activationsReport_generation_RE', DataElement).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateCompanies_reported_Salesforce_DS(dataelement: any) {
    return new Promise((resolve, reject) => {
      let json = JSON.stringify(dataelement);
      let DataElement : DataElmentsUC = {module: 'Companies_reported_Salesforce_DS', json: json};
      this._UtilAPI.UpdateDataElement('Companies_reported_Salesforce_DS', DataElement).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateLast_time_activationsReport_generation_DS(dataelement: any) {
    return new Promise((resolve, reject) => {
      let json = JSON.stringify(dataelement);
      let DataElement : DataElmentsUC = {module: 'Last_time_activationsReport_generation_DS', json: json};
      this._UtilAPI.UpdateDataElement('Last_time_activationsReport_generation_DS', DataElement).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getHomeDataElements() {
    return new Promise<any>((resolve, reject) => {
      this._UtilAPI.GetDataElements('homeDataElements').subscribe(data => {
        resolve(data);
      }, error => {
        reject();
      });
    });
  }

  updateHomeDataElements(dataelement: any) {
    return new Promise((resolve, reject) => {
      let json = JSON.stringify(dataelement);
      let DataElement : DataElmentsUC = {module: 'homeDataElements', json: json};
      this._UtilAPI.UpdateDataElement('homeDataElements', DataElement).subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}
