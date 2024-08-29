import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jsonItemsI } from 'src/app/models/Jsonformat/jsonItems';
import { SideBarService } from '../side-bar.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

declare var require: any;
const jsonUtilidades = require('src/assets/json/UtilidadesAPI.json');

@Injectable({
  providedIn: 'root',
})
export class UserMovementsService {
  constructor(
    private http: HttpClient,
    private _sideBarService: SideBarService
  ) {}

  previousModule = '';

  NewMovement(description: string, component: string): Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(
      JSON.stringify(jsonUtilidades['POST'])
    );
    let dir = jsonvalor.find((option) => option.key == 'UsersMovements');
    let dirservice = `${url}${dir?.value}`;
    let user = localStorage.getItem('user') + '';
    let date = new Date();
    //Fecha UTC
    let dateCO = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
    //Fecha Colombia
    dateCO.setHours(dateCO.getHours() - 5);

    let ambient = localStorage.getItem('ambient');

    let body = {
      date: dateCO,
      user: user,
      component: component,
      description: description,
      ambient: ambient == null ? '' : ambient,
    };
    return this.http.post(dirservice, body, httpOptions);
  }

  GetUsersMovements(date: string): Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(
      JSON.stringify(jsonUtilidades['GET'])
    );
    let dir = jsonvalor.find((option) => option.key == 'UsersMovements');
    let dirservice = `${url}${dir?.value}/${date}`;
    return this.http.get(dirservice, httpOptions);
  }

  NewUsersMovement(description: string, component?: string) {
    return new Promise((resolve, reject) => {
      //Si Modulo no especificado, consulta módulo actual reportado por SideBarService
      if (component === undefined) {
        this._sideBarService.currentmodule.subscribe(
          (module) => (component = module)
        );
      }

      if (component === undefined || component === '') {
        resolve('');
      } else {
        this.NewMovement(description, component).subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  }

  ListUsersMovement(from: string) {
    return new Promise((resolve, reject) => {
      this.GetUsersMovements(from).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
