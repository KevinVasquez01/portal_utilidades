import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  AuditCompanyCreations,
  AuditCompanyCreationsTable,
} from 'src/app/models/Audit/AuditCompanyCreations';
import { jsonDistI } from 'src/app/models/Jsonformat/jsonDistribuidores';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { AuditCompanyCreationsService } from 'src/app/services/UtilidadesAPI/audit-company-creations.service';
import { DataElementsService } from 'src/app/services/UtilidadesAPI/data-elements.service';

interface topUser {
  User: string;
  Count: number;
}

@Component({
  selector: 'app-audit-company-creations',
  templateUrl: './audit-company-creations.component.html',
  styleUrls: ['./audit-company-creations.component.scss'],
})
export class AuditCompanyCreationsComponent implements OnInit {
  generando = false;
  showresults = false;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  fechaInicio: string = '';
  fechaFin: string = '';

  fechaInicioShow: string = '';
  fechaFinShow: string = '';

  CompaniesAuthorized: AuditCompanyCreations[] = [];
  CompaniesDeleted: AuditCompanyCreations[] = [];

  CompaniesAuthorizedTable: AuditCompanyCreationsTable[] = [];
  CompaniesDeletedTable: AuditCompanyCreationsTable[] = [];

  CompaniesExportTable: AuditCompanyCreationsTable[] = [];

  error = '';

  widgetsData = ['', '', '', '', '', ''];

  //Listado de distribuidores
  listdist: Array<jsonDistI> = [];

  nameExcel: string = ''; //Nombre archivo a exportar

  constructor(
    private _AuditCompanyCreations: AuditCompanyCreationsService,
    private datePipe: DatePipe,
    private _toastProvider: ToastProvider,
    private _dataElementsU: DataElementsService
  ) {}

  ngOnInit(): void {
    this.GetDistributors().catch((result) => {
      this.error = JSON.stringify(result);
      this._toastProvider.dangerMessage(
        `Ocurrió un error al consultar Distribuidores ${JSON.stringify(result)}`
      );
    });
  }

  //Obtiene distribuidores de UtilidadesAPI
  GetDistributors() {
    return new Promise(async (resolve, reject) => {
      this._dataElementsU
        .getDdataelementU('Distribuidores')
        .then(async (result) => {
          //Desde servicio Utilidades
          let distributors: Array<jsonDistI> = JSON.parse(result.json);
          distributors.sort((a, b) => a.Name.localeCompare(b.Name));
          this.listdist = distributors;
          resolve(true);
        })
        .catch(() => {
          //Lee JSON distribuidores
          this.listdist = [];
          reject();
        });
    });
  }

  async generate() {
    this.generando = true;
    let start_report = this.range.controls['start'].hasError(
      'matStartDateInvalid'
    )
      ? new Date()
      : new Date(this.range.controls['start'].value);
    let end_report = this.range.controls['end'].hasError('matStartDateInvalid')
      ? new Date()
      : new Date(this.range.controls['end'].value);

    this.fechaInicio =
      this.datePipe.transform(start_report, 'yyyy-MM-dd') || '';
    this.fechaFin = this.datePipe.transform(end_report, 'yyyy-MM-dd') || '';

    this.fechaInicioShow =
      this.datePipe.transform(start_report, 'dd/MM/yyyy') || '';
    this.fechaFinShow = this.datePipe.transform(end_report, 'dd/MM/yyyy') || '';

    if (this.fechaInicio != '' && this.fechaFin != '') {
      let RAuthorized = await this._AuditCompanyCreations
        .CompaniesAuthorized(this.fechaInicio, this.fechaFin)
        .catch((result) => {
          this.error = JSON.stringify(result);
          this._toastProvider.dangerMessage(
            `Ocurrió un error al consultar Empresas Autorizadas ${JSON.stringify(
              result
            )}`
          );
        });
      let RDeleted = await this._AuditCompanyCreations
        .CompaniesDeleted(this.fechaInicio, this.fechaFin)
        .catch((result) => {
          this.error = JSON.stringify(result);
          this._toastProvider.dangerMessage(
            `Ocurrió un error al consultar Empresas Eliminadas ${JSON.stringify(
              result
            )}`
          );
        });

      this.CompaniesAuthorized = JSON.parse(JSON.stringify(RAuthorized));
      this.CompaniesDeleted = JSON.parse(JSON.stringify(RDeleted));
    }

    this.buildTables();
  }

  buildTables() {
    if (this.error.length > 0) {
      this.generando = false;
      return;
    }

    let distributors = this.listdist;
    function searchDistributor(id: string) {
      let dist = distributors.find((x) => x.Id == id);
      if (dist != undefined) {
        return dist.Name;
      }
      return 'NINGUNO';
    }

    for (let i = 0; i < this.CompaniesAuthorized.length; i++) {
      this.CompaniesAuthorizedTable.push({
        Fecha: this.datePipe.transform(this.CompaniesAuthorized[i].date, 'dd/MM/yyyy hh:mm') || '',
        Distribuidor: searchDistributor(
          this.CompaniesAuthorized[i].distributor
        ),
        Documento: this.CompaniesAuthorized[i].documentNumber,
        'Razón Social': this.CompaniesAuthorized[i].name,
        Ambientes: this.CompaniesAuthorized[i].ambients,
        Servicios: this.CompaniesAuthorized[i].services,
        Usuario: this.CompaniesAuthorized[i].user,
        Acción: this.CompaniesAuthorized[i].action,
      });
    }

    for (let i = 0; i < this.CompaniesDeleted.length; i++) {
      this.CompaniesDeletedTable.push({
        Fecha: this.datePipe.transform(this.CompaniesDeleted[i].date, 'dd/MM/yyyy hh:mm') || '',
        Distribuidor: searchDistributor(this.CompaniesDeleted[i].distributor),
        Documento: this.CompaniesDeleted[i].documentNumber,
        'Razón Social': this.CompaniesDeleted[i].name,
        Ambientes: this.CompaniesDeleted[i].ambients,
        Servicios: this.CompaniesDeleted[i].services,
        Usuario: this.CompaniesDeleted[i].user,
        Acción: this.CompaniesDeleted[i].action,
      });
    }

    this.CompaniesExportTable = this.CompaniesAuthorizedTable.concat(
      this.CompaniesDeletedTable
    );
    this.nameExcel = `EmpresasAutorizadas_Eliminadas_${this.fechaInicio}_${this.fechaFin}`;

    this.buildTop();
  }

  buildTop() {
    if (this.CompaniesExportTable.length == 0) {
      this.generando = false;
      this.showresults = true;
      return;
    }
    let topAuthorized: topUser[] = [];
    for (let i = 0; i < this.CompaniesAuthorizedTable.length; i++) {
      let exist = topAuthorized.find(
        (x) => x.User == this.CompaniesAuthorizedTable[i].Usuario
      );
      if (exist != undefined) {
        exist.Count++;
      } else {
        topAuthorized.push({
          User: this.CompaniesAuthorizedTable[i].Usuario,
          Count: 1,
        });
      }
    }

    let topDeleted: topUser[] = [];
    for (let i = 0; i < this.CompaniesDeletedTable.length; i++) {
      let exist = topDeleted.find(
        (x) => x.User == this.CompaniesDeletedTable[i].Usuario
      );
      if (exist != undefined) {
        exist.Count++;
      } else {
        topDeleted.push({
          User: this.CompaniesDeletedTable[i].Usuario,
          Count: 1,
        });
      }
    }

    //Ordena de mayor a menor
    topAuthorized.sort(function(a, b){return b.Count-a.Count});
    topDeleted.sort(function(a, b){return b.Count-a.Count});

    function cutUser(user: string) {
      let toreturn = '';
      let split = user.split('@');
      for (let i = 0; i < split[0].length; i++) {
        toreturn += toreturn.length % 18 == 0 ? ` ${split[0][i]}` : split[0][i];
      }
      return toreturn;
    }

    this.widgetsData[0] = this.CompaniesAuthorizedTable.length.toString();
    this.widgetsData[1] = topAuthorized.length > 0 ? cutUser(topAuthorized[0].User): '';
    this.widgetsData[2] = topAuthorized.length > 0 ? topAuthorized[0].Count.toString() : '';
    this.widgetsData[3] = this.CompaniesDeletedTable.length.toString();
    this.widgetsData[4] = topDeleted.length > 0 ? cutUser(topDeleted[0].User) : '';
    this.widgetsData[5] = topDeleted.length > 0 ? topDeleted[0].Count.toString() : '';

    this.generando = false;
    this.showresults = true;
  }

  reset() {
    this.generando = false;
    this.showresults = false;
    this.error = '';
    this.CompaniesAuthorized = [];
    this.CompaniesDeleted = [];
    this.CompaniesAuthorizedTable = [];
    this.CompaniesDeletedTable = [];
    this.CompaniesExportTable = [];
    this.widgetsData = ['', '', '', '', '', ''];
  }
}
