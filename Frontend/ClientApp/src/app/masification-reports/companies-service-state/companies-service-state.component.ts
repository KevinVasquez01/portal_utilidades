import { Component, OnInit } from '@angular/core';
import { jsonDistI } from 'src/app/models/Jsonformat/jsonDistribuidores';
import { Voperator } from 'src/app/models/vo';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { SearchCompanyPrdService } from 'src/app/services/SaphetyApi_PRD/search-company-prd.service';
import { DataElementsService } from 'src/app/services/UtilidadesAPI/data-elements.service';

export interface companiesServiceWorkerState {
  Aliado: string;
  'Razón Social': string;
  Documento: string;
  'Facturación Electrónica': string;
  'Documento Soporte': string;
  'Nómina Electrónica': string;
  'Recepción Facturación': string;
}

export interface companiesServiceWorkerState_Widgets {
  Aliado: string;
  TotalEmpresas: number;
  FE: number;
  DS: number;
  NE: number;
  RFE: number;
}

@Component({
  selector: 'app-companies-service-state',
  templateUrl: './companies-service-state.component.html',
  styleUrls: ['./companies-service-state.component.scss'],
})
export class CompaniesServiceStateComponent implements OnInit {
  running = false;
  showresults = false;
  error = false;

  companiesState: companiesServiceWorkerState[] = []; //Resultados
  comapniesWidgets: companiesServiceWorkerState_Widgets[] = []; //Widgets

  //Listado de distribuidores
  listdist: Array<jsonDistI> = [];
  listdist_Top: Array<jsonDistI> = [];

  constructor(
    private _toastProvider: ToastProvider,
    private _SearchCompanyPRD: SearchCompanyPrdService,
    private _dataElementsU: DataElementsService
  ) {}

  ngOnInit(): void {
    this.awaitDataElments();
  }

  async awaitDataElments() {
    await this.GetDistributors().catch((error) => {
      this.error = true;
      this._toastProvider.dangerMessage(
        `Error al obtener Distribuidores: ${error}`
      );
    });
    await this.GetDistributorsIncludesTop().catch((error) => {
      this.error = true;
      this._toastProvider.dangerMessage(
        `Error al obtener Aliados incluidos en Top: ${error}`
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
          this.listdist = JSON.parse(result.json);
          resolve(true);
        })
        .catch(() => {
          //Lee JSON distribuidores
          this.listdist = [];
          reject();
        });
    });
  }

  //Obtiene distribuidores Incluidos en TOP de UtilidadesAPI
  GetDistributorsIncludesTop() {
    return new Promise(async (resolve, reject) => {
      this._dataElementsU
        .getDdataelementU('Reports_AlliesIncludes_M_Top')
        .then(async (result) => {
          //Desde servicio Utilidades
          let results: Array<jsonDistI> = JSON.parse(result.json);
          results.sort((a, b) => a.Name.localeCompare(b.Name));
          this.listdist_Top = results;
          resolve(true);
        })
        .catch(() => {
          //Lee JSON distribuidores
          this.listdist = [];
          reject();
        });
    });
  }

  async runReport() {
    this.running = true;
    this.companiesState = [];
    await this.SearhCompanies_PRD({
      Id: '',
      Alias: 'saphety',
      Name: 'Saphety',
    });
  }

  //Obtener listado compañías PRD
  SearhCompanies_PRD(VOperator: Voperator) {
    return new Promise(async (resolve, reject) => {
      await this._SearchCompanyPRD
        .SearchCompanies_WithoutFilter(VOperator.Alias)
        .then(async (company) => {
          let DistName = '';
          for (let i = 0; i < company.length; i++) {
            let distribuidor = company[i].DistributorId
              ? this.listdist.find((x) => x.Id == company[i].DistributorId)
              : undefined;
            DistName =
              distribuidor != undefined ? distribuidor?.Name : 'PREPAGO';
            this.companiesState.push({
              Aliado: DistName,
              'Razón Social': company[i].Name,
              Documento: company[i].Identification.DocumentNumber,
              'Facturación Electrónica': company[i].InvoiceIssuingServiceActive
                ? 'Activo'
                : 'Inactivo',
              'Documento Soporte': company[i]
                .SupportDocumentIssuingServiceActive
                ? 'Activo'
                : 'Inactivo',
              'Nómina Electrónica': company[i].PayrollIssuingServiceActive
                ? 'Activo'
                : 'Inactivo',
              'Recepción Facturación': company[i].InvoiceReceptionServiceActive
                ? 'Activo'
                : 'Inactivo',
            });
          }
          this.buildWidgets();
          resolve(true);
        })
        .catch((error) => {
          this._toastProvider.dangerMessage(
            `Ocurrió un error al obtener empresas PRD: ${
              VOperator.Name
            } - ${JSON.stringify(error)}`
          );
          reject();
        });
    });
  }

  buildWidgets() {
    for (let i = 0; i < this.companiesState.length; i++) {
      if (
        this.listdist_Top.find((x) => x.Name === this.companiesState[i].Aliado)
      ) {
        let found = this.comapniesWidgets.find(
          (x) => x.Aliado === this.companiesState[i].Aliado
        );
        if (found) {
          found.TotalEmpresas++;
          found.FE +=
            this.companiesState[i]['Facturación Electrónica'] !== 'Activo'
              ? 0
              : 1;
          found.DS +=
            this.companiesState[i]['Documento Soporte'] !== 'Activo' ? 0 : 1;
          found.NE +=
            this.companiesState[i]['Nómina Electrónica'] !== 'Activo' ? 0 : 1;
          found.RFE +=
            this.companiesState[i]['Recepción Facturación'] !== 'Activo'
              ? 0
              : 1;
        } else {
          this.comapniesWidgets.push({
            Aliado: this.companiesState[i].Aliado,
            TotalEmpresas: 1,
            FE:
              this.companiesState[i]['Facturación Electrónica'] !== 'Activo'
                ? 0
                : 1,
            DS:
              this.companiesState[i]['Documento Soporte'] !== 'Activo' ? 0 : 1,
            NE:
              this.companiesState[i]['Nómina Electrónica'] !== 'Activo' ? 0 : 1,
            RFE:
              this.companiesState[i]['Recepción Facturación'] !== 'Activo'
                ? 0
                : 1,
          });
        }
      }
    }

    this.comapniesWidgets.sort(function (a, b) {
      return b.TotalEmpresas - a.TotalEmpresas;
    });

    this.companiesState.sort(function (a, b) {
      if (a.Aliado > b.Aliado) {
        return 1;
      }
      else if (a.Aliado < b.Aliado) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    this.showresults = true;
    this.running = false;
  }
}
