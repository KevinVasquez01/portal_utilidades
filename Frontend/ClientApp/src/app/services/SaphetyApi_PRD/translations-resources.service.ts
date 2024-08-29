import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, retry } from 'rxjs/operators';
import { jsonItemsI } from 'src/app/models/Jsonformat/jsonItems';
import { ResponseI } from 'src/app/models/response.interface';
import { TranslationsResources } from 'src/app/models/TranslationsResources/translationsResources';

declare var require: any;
const jsonPRD = require('src/assets/json/SaphetyPRD.json');

@Injectable({
  providedIn: 'root'
})
export class TranslationsResourcesServicePRD {

  constructor(private http: HttpClient) {}

  searchTranslationsResource(filter: string) {
    return new Promise((resolve, reject) => {
      this.SearchTranslationsResources(filter).subscribe(data => {
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

  createTranslationsResource(resource: TranslationsResources) {
    return new Promise((resolve, reject) => {
      this.AddUpdateTranslationsResources(resource).subscribe(data => {
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

  directionService(direction: string, type: string) {
    let dirservice = '';
    //Obtiene servicio para PRD
    let url = jsonPRD['Root'];
    let jsonvalorget: Array<jsonItemsI> = JSON.parse(
      JSON.stringify(jsonPRD[type])
    );
    let dir = jsonvalorget.find((option) => option.key == direction);
    dirservice = url + dir?.value;
    return dirservice;
  }

  SearchTranslationsResources(filter: string): Observable<ResponseI> {
    let body = {
      CategoryCodeStartsWith: true,
      ApplicationCodeStartsWith: false,
      DescriptionStartsWith: true,
      KeyStartsWith: true,
      ResourceSetCodeStartsWith: true,
      Pagination: {
        Offset: 0,
        NumberOfRecords: 999,
      },
      SortField: null,
      ApplicationCode: 'eInvoiceCO',
      ReturnKeyValuePair: false,
      Key: filter,
    };
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    //Obtiene la dirección del servicio translationsResources de Saphety
    let direction = this.directionService('translationsResources', 'POST');
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, body, options).pipe(
      retry(5), // you retry 5 times
      delay(500) // each retry will start after 0.5 second
    );
  }

  AddUpdateTranslationsResources(resource: TranslationsResources): Observable<ResponseI> {
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    //Obtiene la dirección del servicio translationsResourcesaddOrUpdate de Saphety
    let direction = this.directionService('translationsResourcesaddOrUpdate', 'POST');
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, resource, options).pipe(
      retry(5), // you retry 5 times
      delay(500) // each retry will start after 0.5 second
    );
  }
}
