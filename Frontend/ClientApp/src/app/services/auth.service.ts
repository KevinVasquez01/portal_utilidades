import { Injectable } from '@angular/core';
import { LoginI } from '../models/login.interface';
import { ResponseI } from '../models/response.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jsonItemsI } from '../models/Jsonformat/jsonItems';

declare var require: any;
const jsonPRD = require('../../assets/json/SaphetyPRD.json');
const jsonQA = require('../../assets/json/SaphetyQA.json');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;

  constructor(private http: HttpClient) {}

  directionService(ambient: string, direction: string, type: string) {
    let dirservice = '';
    //Obtiene servicio para QA
    if (ambient === 'QA') {
      let url = jsonQA['Root'];
      let jsonvalorget: Array<jsonItemsI> = JSON.parse(
        JSON.stringify(jsonQA[type])
      );
      let dir = jsonvalorget.find((option) => option.key == direction);
      dirservice = url + dir?.value;
    }
    //Obtiene servicio para PRD
    else if (ambient === 'PRD') {
      let url = jsonPRD['Root'];
      let jsonvalorget: Array<jsonItemsI> = JSON.parse(
        JSON.stringify(jsonPRD[type])
      );
      let dir = jsonvalorget.find((option) => option.key == direction);
      dirservice = url + dir?.value;
    }
    return dirservice;
  }

  GetToken(body: LoginI, ambiente: string): Observable<ResponseI> {
    //Obtiene la dirección del servicio gettoken de Saphety ambiente dinámico
    let direction = this.directionService(ambiente, 'gettoken', 'POST');
    //Devuelve respuesta
    return this.http.post<ResponseI>(direction, body);
  }

  CheckUser(ambiente: string): Observable<any> {
    //Obtiene la dirección del servicio account de Saphety ambiente dinámico
    let direction = this.directionService(ambiente, 'account', 'GET');
    let token = localStorage.getItem('token');
    const headers = { Authorization: 'Bearer ' + token };
    let options = { headers: headers };
    return this.http.get<any>(direction, options);
  }
}
