import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jsonItemsI } from 'src/app/models/Jsonformat/jsonItems';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import {
  HistoryChangesSincoDB,
  HistoryChangesSincoM,
} from './history-changes-sinco-currentcompany';

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
export class HistoryChangesSincoCurrentcompanyService {
  constructor(
    private http: HttpClient,
    private _toastProvider: ToastProvider
  ) {}

  GetHistoryChangesSinco(): Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(
      JSON.stringify(jsonUtilidades['GET'])
    );
    let dir = jsonvalor.find((option) => option.key == 'HistoryChangesSinco');
    let dirservice = `${url}${dir?.value}`;
    return this.http.get(dirservice);
  }

  GetHistoryChangesSincoDocument(document: string): Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(
      JSON.stringify(jsonUtilidades['GET'])
    );
    let dir = jsonvalor.find((option) => option.key == 'HistoryChangesSinco');
    let dirservice = `${url}${dir?.value}/${document}`;
    return this.http.get(dirservice);
  }

  GetHistoryChangesSincoLast(): Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(
      JSON.stringify(jsonUtilidades['GET'])
    );
    let dir = jsonvalor.find(
      (option) => option.key == 'HistoryChangesSincoLast'
    );
    let dirservice = `${url}${dir?.value}`;
    return this.http.get(dirservice);
  }

  PostHistoryChangesSinco(change: HistoryChangesSincoDB): Observable<any> {
    let url = jsonUtilidades['Root'];
    let jsonvalor: Array<jsonItemsI> = JSON.parse(
      JSON.stringify(jsonUtilidades['POST'])
    );
    let dir = jsonvalor.find((option) => option.key == 'HistoryChangesSinco');
    let dirservice = `${url}${dir?.value}`;
    return this.http.post(dirservice, change, httpOptions);
  }

  NewHistoryChangesSinco(change: HistoryChangesSincoDB) {
    return new Promise((resolve, reject) => {
      this.PostHistoryChangesSinco(change).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  LastHistoryChangesSinco() {
    return new Promise((resolve, reject) => {
      this.GetHistoryChangesSincoLast().subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  HistoryChangesSincoByDocument(document: string) {
    return new Promise((resolve, reject) => {
      this.GetHistoryChangesSincoDocument(document).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  classes = [
    'light-info',
    'light-success',
    'light-warning',
    'light-primary',
    'light-inverse',
    'light-danger',
    'light-megna',
  ];

  async getHistory() {
    let changes: HistoryChangesSincoDB[] = [];
    let notes: HistoryChangesSincoM[] = [];
    await this.LastHistoryChangesSinco()
      .then((result) => {
        changes = JSON.parse(JSON.stringify(result));
      })
      .catch((error) => {
        this._toastProvider.dangerMessage(
          `Ocurrió un error al validar el histórico de cambios: ${JSON.stringify(
            error
          )}`
        );
      });

    let classnumber = 0;
    let usedclasses: [{ class: string; user: string }] = [
      { class: '', user: '' },
    ];

    for (let i = 0; changes.length > i; i++) {
      //Clase
      let clase = '';
      let actuallyclass = usedclasses.find(
        (x) => x.user == changes[i].user_creator
      );
      if (actuallyclass != undefined) {
        clase = actuallyclass.class;
      } else {
        usedclasses.push({
          class: this.classes[classnumber],
          user: changes[i].user_creator,
        });
        clase = this.classes[classnumber];
        classnumber =
          this.classes.length > classnumber + 1 ? classnumber + 1 : 0;
      }

      //User Initials
      let user = changes[i].user_creator.toUpperCase().split('@')[0].split('.');
      let initials =
        user.length > 1
          ? user[0].substring(0, 1) + user[1].substring(0, 1)
          : user[0].substring(0, 2);

      notes.push({
        company: changes[i].company_name,
        document: `${changes[i].document_number}${
          changes[i].dv != '' ? '-' + changes[i].dv : ''
        }`,
        user: changes[i].user_creator.split('@')[0],
        class: clase,
        date: changes[i].date_change,
        changes: '',
        initials: initials,
        ismacroplantilla: changes[i].is_macroplantilla,
      });
    }

    return notes;
  }

  async getHistoryCompany(
    documentNumber: string
  ): Promise<HistoryChangesSincoM[]> {
    let changes: HistoryChangesSincoDB[] = [];
    let notes: HistoryChangesSincoM[] = [];
    await this.HistoryChangesSincoByDocument(documentNumber)
      .then((result) => {
        changes = JSON.parse(JSON.stringify(result));
      })
      .catch((error) => {
        this._toastProvider.dangerMessage(
          `Ocurrió un error al validar el histórico de cambios de la Empresa seleccionada: ${JSON.stringify(
            error
          )}`
        );
      });

    let classnumber = 0;
    let usedclasses: [{ class: string; user: string }] = [
      { class: '', user: '' },
    ];

    for (let i = 0; changes.length > i; i++) {
      let changesBody = '';
      //Campo1
      if (changes[i].custom_field1 != '') {
        changesBody += `<div fxLayout="row wrap" class="align-items-center m-b-15"> \
              <div fxFlex.gt-md="25" fxFlex.gt-lg="25" fxFlex="100"> \
              <h4 class="m-0">Campo Personalizable 1</h4> \
              </div> \
              </div> \
              <blockquote> \
              <i>${changes[i].custom_field1}</i> \
              </blockquote>`;
      }

      if (changes[i].custom_field2 != '') {
        changesBody += `<div fxLayout="row wrap" class="align-items-center m-b-15"> \
                <div fxFlex.gt-md="25" fxFlex.gt-lg="25" fxFlex="100"> \
                <h4 class="m-0">Campo Personalizable 2</h4> \
                </div> \
                </div> \
                <blockquote>\
                <i>${changes[i].custom_field2}</i>\
                </blockquote>`;
      }

      if (changes[i].custom_field3 != '') {
        changesBody += `<div fxLayout="row wrap" class="align-items-center m-b-15"> \
                  <div fxFlex.gt-md="25" fxFlex.gt-lg="25" fxFlex="100"> \
                  <h4 class="m-0">Campo Personalizable 3</h4> \
                  </div> \
                  </div> \
                  <blockquote>\
                  <i>${changes[i].custom_field3}</i>\
                  </blockquote>`;
      }

      if (changes[i].is_html) {
        //Otros cambios
        if (changes[i].other_changes != '') {
          changesBody += changes[i].other_changes;
        }
      } else {
        //Otros cambios
        if (changes[i].other_changes != '') {
          changesBody += `<div class="align-items-center m-t-15 m-b-15"> \
                  <span class="font-medium"> Otros cambios </span> \
                  <h6 class="m-t-5 m-b-0">${changes[i].other_changes}</h6> \
                  </div> \
                  <hr />`;
        }
      }

      //Clase
      let clase = '';
      let actuallyclass = usedclasses.find(
        (x) => x.user == changes[i].user_creator
      );
      if (actuallyclass != undefined) {
        clase = actuallyclass.class;
      } else {
        usedclasses.push({
          class: this.classes[classnumber],
          user: changes[i].user_creator,
        });
        clase = this.classes[classnumber];
        classnumber =
          this.classes.length > classnumber + 1 ? classnumber + 1 : 0;
      }

      //User Initials
      let user = changes[i].user_creator.toUpperCase().split('@')[0].split('.');
      let initials =
        user.length > 1
          ? user[0].substring(0, 1) + user[1].substring(0, 1)
          : user[0].substring(0, 2);

      notes.push({
        company: changes[i].company_name,
        document: `${changes[i].document_number}${
          changes[i].dv != '' ? '-' + changes[i].dv : ''
        }`,
        user: changes[i].user_creator.split('@')[0],
        class: clase,
        date: changes[i].date_change,
        changes: changesBody,
        initials: initials,
        ismacroplantilla: changes[i].is_macroplantilla,
      });
    }
    return notes;
  }
}
