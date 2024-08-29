import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { jsonDistI } from 'src/app/models/Jsonformat/jsonDistribuidores';
import { ResponseI } from 'src/app/models/response.interface';
import { findvirtualoperatorI } from 'src/app/models/VirtualOperator/findvirtualoperator';
import { Voperator } from 'src/app/models/vo';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { APIGetServicePRD } from 'src/app/services/SaphetyApi_PRD/apiget.service';
import { CompaniesPlansPackagesPrdService } from 'src/app/services/SaphetyApi_PRD/companies-plans-packages-prd.service';
import { SearchCompanyPrdService } from 'src/app/services/SaphetyApi_PRD/search-company-prd.service';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';
import { CompaniesPlansPackagesService } from 'src/app/services/SaphetyApi_QA/companies-plans-packages.service';
import { SearchCompanyQaService } from 'src/app/services/SaphetyApi_QA/search-company-qa.service';
import { DataElementsService } from 'src/app/services/UtilidadesAPI/data-elements.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

interface companiesCrud {
  Id: string;
  Document: string;
  Name: string;
  Aliado: string;
  FE: ppResults[];
  DS: ppResults[];
  NE: ppResults[];
  RE: ppResults[];
}

interface ppResults {
  Name: string;
  Description: string;
  PlanType: string;
  DocumentsTotal: number;
  DocumentsConsumed: number;
  RemainingDocuments: number;
  CreationDate: Date;
  ExpirationDate: Date;
}

export interface companiesPlansPackagesDetail {
  Aliado: string;
  'Razón Social': string;
  Documento: string;
  Nombre: string;
  Descripción: string;
  Tipo: string;
  'Total de Documentos': number;
  'Documentos Consumidos': number;
  'Documentos Restantes': number;
  'Fecha de Creación': string;
  'Fecha de Vencimiento': string;
}

export interface companiesPlansPackagesStateExcel {
  Aliado: string;
  'Razón Social': string;
  Documento: string;
  'Facturación Electrónica': string;
  'Documento Soporte': string;
  'Nómina Electrónica': string;
  'Recepción Facturación': string;
}

@Component({
  selector: 'app-companies-plans-packages',
  templateUrl: './companies-plans-packages.component.html',
  styleUrls: ['./companies-plans-packages.component.scss'],
})
export class CompaniesPlansPackagesComponent implements OnInit {
  showresults = false;
  running = false;
  error = false;

  ambiente: any;

  //Listado de OVs
  opvs: Voperator[] = [];
  opvSelected?: Voperator;

  //Listado de distribuidores
  listdist: Array<jsonDistI> = [];
  listdist_Top: Array<jsonDistI> = [];

  //Lista planes y/o paquetes por Empresa
  listCompaniesPlansPackages: companiesCrud[] = [];

  ListCompaniesPlansPackagesExcel: companiesPlansPackagesStateExcel[] = [];
  ListCompaniesPlansPackagesDetail: companiesPlansPackagesDetail[] = [];

  constructor(
    private _toastProvider: ToastProvider,
    private _SearchCompanyPRD: SearchCompanyPrdService,
    private _SearchCompanyQA: SearchCompanyQaService,
    private _dataElementsU: DataElementsService,
    private _getGetDataQA: APIGetServiceQA,
    private _getGetDataPRD: APIGetServicePRD,
    private _planspackagesQA: CompaniesPlansPackagesService,
    private _planspackagesPRD: CompaniesPlansPackagesPrdService
  ) {
    let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '';
  }

  ngOnInit(): void {
    this.awaitDataElments();
    this.awaitVirtualOperators();
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

  //Espera a que termine de obtener operadores virtuales
  async awaitVirtualOperators() {
    const toastProvider_Function = this._toastProvider;
    await this.getVirtualOperators()
      .finally(() => {
        this.opvSelected = this.opvs.find((x) => x.Alias == 'saphety');
      })
      .catch((result: any) => {
        toastProvider_Function.dangerMessage(
          `Ocurrió un error al obtener los operadores virtuales ${JSON.stringify(
            result
          )}`
        );
      });
  }

  //Operadores
  getVirtualOperators() {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'PRD') {
        let body: findvirtualoperatorI = {
          Id: '',
          SortField: '-CreationDate',
          Alias: 'saphety',
        };
        this._getGetDataPRD.GetVirtualOperators(body).subscribe(
          (data) => {
            let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
            if (dataRespomnsive?.IsValid) {
              let operadores: Voperator[] = JSON.parse(
                JSON.stringify(dataRespomnsive?.ResultData)
              );
              //Agrego operadores a lista
              operadores.forEach((x) =>
                this.opvs.push({ Id: x.Id, Alias: x.Alias, Name: x.Name })
              );
              resolve(operadores);
            } else {
              reject(data['ResultData']);
            }
          },
          (error) => {
            reject(error['ResultData']);
          }
        );
      } else if (this.ambiente == 'QA') {
        let body: findvirtualoperatorI = {
          Id: '',
          SortField: '-CreationDate',
          Alias: '',
        };
        this._getGetDataQA.GetVirtualOperators(body).subscribe(
          (data) => {
            let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
            if (dataRespomnsive?.IsValid) {
              let operadores: Voperator[] = JSON.parse(
                JSON.stringify(dataRespomnsive?.ResultData)
              );
              //Agrego operadores a lista
              operadores.forEach((x) =>
                this.opvs.push({ Id: x.Id, Alias: x.Alias, Name: x.Name })
              );
              resolve(operadores);
            } else {
              reject(data['ResultData']);
            }
          },
          (error) => {
            reject(error['ResultData']);
          }
        );
      }
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

    if (this.opvSelected != undefined) {
      let OVSaphety = this.opvSelected;
      await this.SearchCompanies(OVSaphety).then(async () => {
        let arregloDeArreglos = []; // Aquí almacenamos los nuevos arreglos
        let numArreglos = 30;
        const LONGITUD_PEDAZOS = Math.ceil(
          this.listCompaniesPlansPackages.length / numArreglos
        ); // Partir en arreglos
        for (
          let i = 0;
          i < this.listCompaniesPlansPackages.length;
          i += LONGITUD_PEDAZOS
        ) {
          let pedazo = this.listCompaniesPlansPackages.slice(
            i,
            i + LONGITUD_PEDAZOS >= this.listCompaniesPlansPackages.length
              ? this.listCompaniesPlansPackages.length
              : i + LONGITUD_PEDAZOS
          );
          arregloDeArreglos.push(pedazo);
        }

        function extA(
          arregloDeArreglos: companiesCrud[][],
          number: number
        ): companiesCrud[] {
          if (arregloDeArreglos.length > number) {
            return arregloDeArreglos[number];
          } else {
            return [];
          }
        }

        const promises = [];
        for (let i = 0; i < numArreglos; i++) {
          promises.push(this.SearchPlansPackagesFE(OVSaphety, extA(arregloDeArreglos, i)));
        }

        await Promise.all(promises);
      });
    } else {
      this._toastProvider.dangerMessage(
        'Ocurrió un error al obtener empresas Obtener ID de OV Saphety, por favor intente de nuevo más tarde.'
      );
    }
  }

  async SearchCompanies(VOperator: Voperator) {
    if (this.ambiente == 'PRD') {
      await this.SearhCompanies_PRD(VOperator);
    } else {
      await this.SearhCompanies_QA(VOperator);
    }
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

            this.listCompaniesPlansPackages.push({
              Id: company[i].Id,
              Aliado: DistName,
              Name: company[i].Name,
              Document: company[i].Identification.DocumentNumber,
              FE: [],
              DS: [],
              NE: [],
              RE: [],
            });
          }
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

  //Obtener listado compañías QA
  SearhCompanies_QA(VOperator: Voperator) {
    return new Promise(async (resolve, reject) => {
      GlobalConstants.tokenUserQA = String(localStorage.getItem('token'));
      await this._SearchCompanyQA
        .SearchCompanies_WithoutFilter(VOperator.Alias)
        .then(async (company) => {
          let DistName = '';
          for (let i = 0; i < company.length; i++) {
            let distribuidor = company[i].DistributorId
              ? this.listdist.find((x) => x.Id == company[i].DistributorId)
              : undefined;
            DistName =
              distribuidor != undefined ? distribuidor?.Name : 'PREPAGO';

            this.listCompaniesPlansPackages.push({
              Id: company[i].Id,
              Aliado: DistName,
              Name: company[i].Name,
              Document: company[i].Identification.DocumentNumber,
              FE: [],
              DS: [],
              NE: [],
              RE: [],
            });
          }
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

  async SearchPlansPackagesFE(VOperator: Voperator, array: companiesCrud[]) {
    if (this.ambiente == 'PRD') {
      await this.PlansPackagesFE_PRD(VOperator, array);
    } else if (this.ambiente == 'QA') {
      await this.PlansPackagesFE_QA(VOperator, array);
    }
  }

  //Obtiene Planes y/o Paquetes QA
  PlansPackagesFE_QA(VOperator: Voperator, array: companiesCrud[]) {
    GlobalConstants.tokenUserQA = String(localStorage.getItem('token'));
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < array.length; i++) {
        if(this.error){
          break;
        }
        await Promise.all([
          //Planes FE
          this._planspackagesQA.searchPlansFE(VOperator.Id, array[i].Id),
          //Paquetes FE
          this._planspackagesQA.searchPackagesFE(VOperator.Id, array[i].Id),
          //Planes NE
          this._planspackagesQA.searchPlansNE(
            VOperator.Alias,
            VOperator.Id,
            array[i].Id
          ),
          //Paquetes NE
          this._planspackagesQA.searchPackagesNE(
            VOperator.Alias,
            VOperator.Id,
            array[i].Id
          ),
          //Planes DS
          this._planspackagesQA.searchPlansDS(
            VOperator.Alias,
            VOperator.Id,
            array[i].Id
          ),
          //Paquetes DS
          this._planspackagesQA.searchPackagesDS(
            VOperator.Alias,
            VOperator.Id,
            array[i].Id
          ),
        ])
          .then((data) => {
            let [
              PlanesFE,
              PaquetesFE,
              PlanesNE,
              PaquetesNE,
              PlanesDS,
              PaquetesDS,
            ] = data;

            let plansFE: ppResults[] = JSON.parse(JSON.stringify(PlanesFE));
            let packagesFE: ppResults[] = JSON.parse(
              JSON.stringify(PaquetesFE)
            );

            let plansNE: ppResults[] = JSON.parse(JSON.stringify(PlanesNE));
            let packagesNE: ppResults[] = JSON.parse(
              JSON.stringify(PaquetesNE)
            );

            let plansDS: ppResults[] = JSON.parse(JSON.stringify(PlanesDS));
            let packagesDS: ppResults[] = JSON.parse(
              JSON.stringify(PaquetesDS)
            );

            plansFE.forEach((element) => {
              if (element.PlanType == 'Outbound') {
                array[i].FE.push(element);
              } else if (element.PlanType == 'Inbound') {
                array[i].RE.push(element);
              }
            });

            packagesFE.forEach((element) => {
              if (element.PlanType == 'Outbound') {
                array[i].FE.push(element);
              } else if (element.PlanType == 'Inbound') {
                array[i].RE.push(element);
              }
            });

            plansNE.forEach((element) => {
              array[i].NE.push(element);
            });

            packagesNE.forEach((element) => {
              array[i].NE.push(element);
            });

            plansDS.forEach((element) => {
              array[i].DS.push(element);
            });

            packagesDS.forEach((element) => {
              array[i].DS.push(element);
            });

            //Agrego compañía a excel a exportar
            this.armarCompanyExcel(array[i]);
            resolve(true);
          })
          .catch((error) => {
            this.error = true;
            this._toastProvider.dangerMessage(
              `Ocurrió un error al obtener planes y/o paquetes de empresa ${JSON.stringify(
                error
              )}`
            );
            reject();
          });
      }
    });
  }

  //Obtiene Planes y/o Paquetes PRD
  PlansPackagesFE_PRD(VOperator: Voperator, array: companiesCrud[]) {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < array.length; i++) {
        if(this.error){
          break;
        }
        await Promise.all([
          //Planes FE
          this._planspackagesPRD.searchPlansFE(VOperator.Id, array[i].Id),
          //Paquetes FE
          this._planspackagesPRD.searchPackagesFE(VOperator.Id, array[i].Id),
          //Planes NE
          this._planspackagesPRD.searchPlansNE(
            VOperator.Alias,
            VOperator.Id,
            array[i].Id
          ),
          //Paquetes NE
          this._planspackagesPRD.searchPackagesNE(
            VOperator.Alias,
            VOperator.Id,
            array[i].Id
          ),
          //Planes DS
          this._planspackagesPRD.searchPlansDS(
            VOperator.Alias,
            VOperator.Id,
            array[i].Id
          ),
          //Paquetes DS
          this._planspackagesPRD.searchPackagesDS(
            VOperator.Alias,
            VOperator.Id,
            array[i].Id
          ),
        ])
          .then((data) => {
            let [
              PlanesFE,
              PaquetesFE,
              PlanesNE,
              PaquetesNE,
              PlanesDS,
              PaquetesDS,
            ] = data;

            let plansFE: ppResults[] = JSON.parse(JSON.stringify(PlanesFE));
            let packagesFE: ppResults[] = JSON.parse(
              JSON.stringify(PaquetesFE)
            );

            let plansNE: ppResults[] = JSON.parse(JSON.stringify(PlanesNE));
            let packagesNE: ppResults[] = JSON.parse(
              JSON.stringify(PaquetesNE)
            );

            let plansDS: ppResults[] = JSON.parse(JSON.stringify(PlanesDS));
            let packagesDS: ppResults[] = JSON.parse(
              JSON.stringify(PaquetesDS)
            );

            plansFE.forEach((element) => {
              if (element.PlanType == 'Outbound') {
                array[i].FE.push(element);
              } else if (element.PlanType == 'Inbound') {
                array[i].RE.push(element);
              }
            });

            packagesFE.forEach((element) => {
              if (element.PlanType == 'Outbound') {
                array[i].FE.push(element);
              } else if (element.PlanType == 'Inbound') {
                array[i].RE.push(element);
              }
            });

            plansNE.forEach((element) => {
              array[i].NE.push(element);
            });

            packagesNE.forEach((element) => {
              array[i].NE.push(element);
            });

            plansDS.forEach((element) => {
              array[i].DS.push(element);
            });

            packagesDS.forEach((element) => {
              array[i].DS.push(element);
            });

            //Agrego compañía a excel a exportar
            this.armarCompanyExcel(array[i]);
            resolve(true);
          })
          .catch((error) => {
            this.error = true;
            this._toastProvider.dangerMessage(
              `Ocurrió un error al obtener planes y/o paquetes de empresa ${JSON.stringify(
                error
              )}`
            );
            reject();
          });
      }
    });
  }

  armarCompanyExcel(company: companiesCrud) {
    function unirPPs(array: ppResults[]) {
      let toReturn = '';
      for (let i = 0; i < array.length; i++) {
        toReturn = toReturn.length > 0 ? `;${array[i].Name}` : array[i].Name;
      }
      return toReturn;
    }

    let detail = this.ListCompaniesPlansPackagesDetail;

    //Fecha informe para Excel
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';

    function armarDetail(array: ppResults[], tipo: string) {
      for (let i = 0; i < array.length; i++) {
        detail.push({
          Aliado: company.Aliado,
          'Razón Social': company.Name,
          Documento: company.Document,
          Nombre: array[0].Name,
          Descripción: array[0].Description,
          Tipo: `${tipo} ${array[0].PlanType}`,
          'Total de Documentos': array[0].DocumentsTotal,
          'Documentos Consumidos': array[0].DocumentsConsumed,
          'Documentos Restantes': array[0].RemainingDocuments,
          'Fecha de Creación': formatDate(array[0].CreationDate, format, locale),
          'Fecha de Vencimiento': formatDate(array[0].ExpirationDate, format, locale),
        });
      }
    }

    this.ListCompaniesPlansPackagesExcel.push({
      Aliado: company.Aliado,
      'Razón Social': company.Name,
      Documento: company.Document,
      'Facturación Electrónica': unirPPs(company.FE),
      'Documento Soporte': unirPPs(company.DS),
      'Nómina Electrónica': unirPPs(company.NE),
      'Recepción Facturación': unirPPs(company.RE),
    });

    //Detalle Excel
    armarDetail(company.FE, 'FE');
    armarDetail(company.DS, 'DS');
    armarDetail(company.NE, 'NE');
    armarDetail(company.RE, 'FE');

    if (
      this.ListCompaniesPlansPackagesExcel.length >=
        this.listCompaniesPlansPackages.length ||
      this.error
    ) {
      this.showresults = this.error ? false : true;
      this.running = false;
    }
  }
}
