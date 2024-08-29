import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { CompanySaphetyI } from 'src/app/models/Company/Company';
import {
  Report_Firts_Documents,
  Report_Firts_Documents_action,
  Report_Firts_Documents_OV,
} from 'src/app/models/Reports/Documents/first-documents';
import { ResponseI } from 'src/app/models/response.interface';
import { findvirtualoperatorI } from 'src/app/models/VirtualOperator/findvirtualoperator';
import { Voperator } from 'src/app/models/vo';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { APIGetServicePRD } from 'src/app/services/SaphetyApi_PRD/apiget.service';
import { SearchCompanyPrdService } from 'src/app/services/SaphetyApi_PRD/search-company-prd.service';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';

@Component({
  selector: 'app-other-first-issuance',
  templateUrl: './other-first-issuance.component.html',
  styleUrls: ['./other-first-issuance.component.scss'],
})
export class OtherFirstIssuanceComponent implements OnInit {
  /* Acción actual

  0: Carga Inicial DataElments
  1: Seleccionar filtros para búsqueda
  2: Buscando
  3: Generando Widgets
  4: Mostrar Resultados
  */
  at_moment = { action: 0, error: false }; //Acción actual
  actually_action: Array<Report_Firts_Documents_action> = []; //Acción que se está ejecutando actualmente para vista
  errorsAPI: Array<{ message: string; json: string }> = [];

  Documents_M_Empresa: Report_Firts_Documents[] = []; //Documentos Primera fecha de emisión por empresa
  Empresas_OV_Count: Report_Firts_Documents_OV[] = []; //Conteo Empresas que han enviado documentos por OV

  opvs: Voperator[] = [];
  filteredopvs = this.opvs.slice();
  ambiente: any;

  ovs_companies: Array<{ ov: string; companies: number }> = [];

  sinEmisionText = 'SinEmisión'; //Texto mostrado si empresa no ha emitido
  sinRecepcionText = 'SinRecepción'; //Texto mostrado si empresa no ha recibido

  constructor(
    private _getGetDataQA: APIGetServiceQA,
    private _getGetDataPRD: APIGetServicePRD,
    private _toastProvider: ToastProvider,
    private _SearchCompanyPRD: SearchCompanyPrdService,
    private _datePipe: DatePipe,
  ) {
    let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '';

    this.awaitVirtualOperators();
  }
  ngOnInit(): void {}

  //Espera a que termine de obtener operadores virtuales
  async awaitVirtualOperators() {
    this.at_moment.error = false;
    this.opvs = [];
    const toastProvider_Function = this._toastProvider;
    await this.getVirtualOperators()
      .then(() => {
        this.at_moment.error = false;
        this.at_moment.action = 1;
      })
      .catch((result) => {
        this.at_moment.error = true;
        toastProvider_Function.dangerMessage(
          `Ocurrió un error al obtener los operadores virtuales ${JSON.stringify(
            result
          )}`
        );
      });
  }

  //Operadores
  getVirtualOperators() {
    function SortArray(x: Voperator, y: Voperator) {
      if (x.Name < y.Name) {
        return -1;
      }
      if (x.Name > y.Name) {
        return 1;
      }
      return 0;
    }

    return new Promise((resolve, reject) => {
      if (this.ambiente == 'PRD') {
        let body: findvirtualoperatorI = {
          Id: '',
          SortField: '-CreationDate',
          Alias: '',
        };
        this._getGetDataPRD.GetVirtualOperators(body).subscribe(
          (data) => {
            let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
            if (dataRespomnsive?.IsValid) {
              let operadores: Voperator[] = JSON.parse(
                JSON.stringify(dataRespomnsive?.ResultData)
              );

              //Ordena alfabeticamente
              operadores = operadores.sort(SortArray);
              //Agrego operadores a lista
              operadores.forEach((x) => {
                this.opvs.push({ Id: x.Id, Alias: x.Alias, Name: x.Name });
                this.filteredopvs.push({
                  Id: x.Id,
                  Alias: x.Alias,
                  Name: x.Name,
                });
              });
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
              //Ordena alfabeticamente
              operadores = operadores.sort(SortArray);
              //Agrego operadores a lista
              operadores.forEach((x) => {
                this.opvs.push({ Id: x.Id, Alias: x.Alias, Name: x.Name });
                this.filteredopvs.push({
                  Id: x.Id,
                  Alias: x.Alias,
                  Name: x.Name,
                });
              });
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

  @ViewChild('select') select!: MatSelect;
  allSelected: boolean = false;
  OVsSelected: Voperator[] = [];

  toggleAllSelection() {
    this.OVsSelected = [];
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => {
        item.select();
        let OV = this.opvs.find((x) => x.Alias === item.value);
        if (OV != undefined) {
          this.OVsSelected.push(OV);
        }
      });
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
      this.OVsSelected = [];
    }
  }
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      let OV = this.opvs.find((x) => x.Alias === item.value);
      if (!item.selected) {
        newStatus = false;
        if (this.OVsSelected.find((x) => x === OV) !== undefined) {
          this.OVsSelected = this.OVsSelected.filter((x) => x !== OV);
        }
      } else {
        if (this.OVsSelected.find((x) => x === OV) === undefined) {
          if (OV != undefined) {
            this.OVsSelected.push(OV);
          }
        }
      }
    });
    this.allSelected = newStatus;
  }

  //Generar informe
  async generate() {
    this.at_moment.action = 2;

    for (let i = 0; i < this.OVsSelected.length; i++) {
      await this.SearhCompanies_PRD(this.OVsSelected[i]).catch(() => {
        this.at_moment.error = true;
        return;
      });
    }

    this.at_moment.action = 3;
    await this.GenerarTop();
    this.at_moment.action = 4;
  }

  //Obtener listado compañías PRD
  SearhCompanies_PRD(VOperator: Voperator) {
    return new Promise(async (resolve, reject) => {
      this.actually_action.push({
        ov: VOperator.Name,
        executed: 0,
        count: 0,
        action: `Obteniendo compañías OV ${VOperator.Name}`,
        have_companies: true,
      });

      await this._SearchCompanyPRD
        .SearchCompanies_WithoutFilter(VOperator.Alias)
        .then(async (company) => {
          //Agrego Cantidad de compañias a OV
          this.ovs_companies.push({
            ov: VOperator.Name,
            companies: company.length,
          });

          if (company.length > 0) {
            let arregloDeArreglos = []; // Aquí almacenamos los nuevos arreglos
            let numArreglos = 50; // Numero de arreglos
            const LONGITUD_PEDAZOS = Math.ceil(company.length / numArreglos); // Partir en Número de arreglos
            for (let i = 0; i < company.length; i += LONGITUD_PEDAZOS) {
              let pedazo = company.slice(
                i,
                i + LONGITUD_PEDAZOS >= company.length
                  ? company.length
                  : i + LONGITUD_PEDAZOS
              );
              arregloDeArreglos.push(pedazo);
            }

            this.actually_action[this.actually_action.length - 1] = {
              ov: VOperator.Name,
              executed: 0,
              count: company.length,
              action: `Obteniendo compañías OV ${VOperator.Name}`,
              have_companies: true,
            };

            function extA(
              arregloDeArreglos: CompanySaphetyI[][],
              number: number
            ): CompanySaphetyI[] {
              if (arregloDeArreglos.length > number) {
                return arregloDeArreglos[number];
              } else {
                return [];
              }
            }

            const promises = [];
            for (let i = 0; i < numArreglos; i++) {
              promises.push(
                this.segment_companies(VOperator, extA(arregloDeArreglos, i))
              );
            }

            await Promise.all(promises);

            resolve(true);
          } else {
            this.Update_ActuallyAction(
              0,
              `No se encontraron compañías.`,
              false
            );
            resolve(true);
          }
        })
        .catch((error) => {
          this.errorsAPI.push({
            message: `Ocurrió un error al obtener empresas PRD: ${VOperator.Name}`,
            json: JSON.stringify(error),
          });
          reject();
        });
    });
  }

  //Actualiza accion actual
  Update_ActuallyAction(
    executed: number,
    action: string,
    have_companies: boolean
  ) {
    this.actually_action[this.actually_action.length - 1].executed += executed;
    this.actually_action[this.actually_action.length - 1].action = action;
    this.actually_action[this.actually_action.length - 1].have_companies =
      have_companies;
  }

  async segment_companies(
    VirtualOperator: Voperator,
    company: Array<CompanySaphetyI>
  ) {
    for (let i = 0; i < company.length; i++) {
      this.Update_ActuallyAction(1, `${company[i].Name}`, true);

      let document: Report_Firts_Documents = {
        'Operador Virtual': VirtualOperator.Name,
        Documento: company[i].Identification.DocumentNumber,
        'Razón Social': company[i].Name,
        Email: company[i].Email,
        'Email Financiero': company[i].FinancialSupportEmail,
        Telefono: company[i].Telephone || '',
        'Servicio FE': company[i].InvoiceIssuingServiceActive
          ? 'Activo'
          : 'Inactivo',
        'Servicio Emisión FE': '',
        'Servicio DS': company[i].SupportDocumentIssuingServiceActive
          ? 'Activo'
          : 'Inactivo',
        'Servicio Emisión DS': '',
        'Servicio NE': company[i].PayrollIssuingServiceActive
          ? 'Activo'
          : 'Inactivo',
        'Servicio Emisión NE': '',
        'Servicio R FE': company[i].InvoiceReceptionServiceActive
          ? 'Activo'
          : 'Inactivo',
        'Servicio Recepción FE': '',
      };

      let identification_company = `${company[i].Identification.CountryCode}_${company[i].Identification.DocumentType}_${company[i].Identification.DocumentNumber}`;
      let bodyFE = {
        SuppliersCodes: identification_company ? [identification_company] : [],
        DocumentTypes: ['SalesInvoice', 'CreditNote', 'DebitNote'],
        NumberOfRecords: 1,
      };

      let bodyDS = {
        CustomerCodes: identification_company ? [identification_company] : [],
        DocumentTypes: ['SupportDocument', 'SupportDocumentAdjustment'],
        NumberOfRecords: 1,
      };

      let bodyFEIn = {
        CompanyIds: [company[i].Id],
        DocumentTypes: ['SalesInvoice', 'CreditNote', 'DebitNote'],
        NumberOfRecords: 1,
        SortField: "CreationDate"
      };

      let bodyNE = {
        Employers: company[i].Id ? [company[i].Id] : [],
        DocumentTypes: ['NominaIndividual', 'NominaIndividualDeAjuste'],
        NumberOfRecords: 1,
      };

      let AliasOV = VirtualOperator.Alias;
      let data = await Promise.all([
        //Facturacion Emitida
        this.GetOutbounddocuments(AliasOV, bodyFE),
        //Documento soporte Emitido
        this.GetOutbounddocuments(AliasOV, bodyDS),
        //Nomina Emitido
        this.GetPayroll(AliasOV, bodyNE),
        //Facturacion Recibido
        this.GetInbounddocuments(AliasOV, bodyFEIn),
      ]);
      let [EmisionFE, EmisionDS, EmisionNE, RecepcionFE] = data;

      //Facturacion Emitida
      document['Servicio Emisión FE'] = EmisionFE;
      //Documento soporte Emitido
      document['Servicio Emisión DS'] = EmisionDS;
      //Nomina Emitido
      document['Servicio Emisión NE'] = EmisionNE;
      //Facturacion Recibido
      document['Servicio Recepción FE'] = RecepcionFE;

      this.Documents_M_Empresa.push(document);
    }
  }

  GetOutbounddocuments(operatorvirtualId: string, body: any) {
    return new Promise<string>((resolve, reject) => {
      this._getGetDataPRD
        .GetOutbounddocuments(body, operatorvirtualId)
        .subscribe(
          (data) => {
            if (data['IsValid']) {
              if (data['ResultData']['Items'].length > 0) {
                let array: any[] = data['ResultData']['Items'];
                try {
                  let CreationDate = new Date(array[0]['CreationDate']);
                  let CreationDateString = `${(CreationDate.getDate() + 100)
                    .toString()
                    .slice(-2)}/${(CreationDate.getMonth() + 101)
                    .toString()
                    .slice(-2)}/${CreationDate.getFullYear()}`;
                  resolve(CreationDateString);
                } catch {
                  resolve(array[0]['CreationDate']);
                }
              } else {
                resolve(this.sinEmisionText);
              }
            } else {
              reject(this.sinEmisionText);
            }
          },
          (error) => {
            this.errorsAPI.push({
              message: `Error GetOutbounddocuments: ${DocumentType} ${JSON.stringify(
                body
              )}`,
              json: JSON.stringify(error),
            });
            reject(JSON.stringify(error));
          }
        );
    });
  }

  GetInbounddocuments(operatorvirtualId: string, body: any) {
    return new Promise<string>((resolve, reject) => {
      this._getGetDataPRD
        .GetInbounddocuments(body, operatorvirtualId)
        .subscribe(
          (data) => {
            if (data['IsValid']) {
              if (data['ResultData']['Items'].length > 0) {
                let array: any[] = data['ResultData']['Items'];
                try {
                  let CreationDate = new Date(array[0]['CreationDate']);
                  let CreationDateString = `${(CreationDate.getDate() + 100)
                    .toString()
                    .slice(-2)}/${(CreationDate.getMonth() + 101)
                    .toString()
                    .slice(-2)}/${CreationDate.getFullYear()}`;
                  resolve(CreationDateString);
                } catch {
                  resolve(array[0]['CreationDate']);
                }
              } else {
                resolve(this.sinRecepcionText);
              }
            } else {
              reject(this.sinRecepcionText);
            }
          },
          (error) => {
            this.errorsAPI.push({
              message: `Error GetOutbounddocuments: ${DocumentType} ${JSON.stringify(
                body
              )}`,
              json: JSON.stringify(error),
            });
            reject(JSON.stringify(error));
          }
        );
    });
  }

  GetPayroll(operatorvirtualId: string, body: any) {
    return new Promise<string>((resolve, reject) => {
      this._getGetDataPRD.GetPayroll(body, operatorvirtualId).subscribe(
        (data) => {
          if (data['IsValid']) {
            if (data['ResultData']['Items'].length > 0) {
              let array: any[] = data['ResultData']['Items'];
              try {
                let CreationDate = new Date(array[0]['CreationDate']);
                let CreationDateString = `${(CreationDate.getDate() + 100)
                  .toString()
                  .slice(-2)}/${(CreationDate.getMonth() + 101)
                  .toString()
                  .slice(-2)}/${CreationDate.getFullYear()}`;
                resolve(CreationDateString);
              } catch {
                resolve(array[0]['CreationDate']);
              }
            } else {
              resolve(this.sinEmisionText);
            }
          } else {
            reject(this.sinEmisionText);
          }
        },
        (error) => {
          this.errorsAPI.push({
            message: `Error GetOutbounddocuments: ${DocumentType} ${JSON.stringify(
              body
            )}`,
            json: JSON.stringify(error),
          });
          reject(JSON.stringify(error));
        }
      );
    });
  }

  async GenerarTop() {
    for (let i = 0; i < this.Documents_M_Empresa.length; i++) {
      let exist = this.Empresas_OV_Count.find(
        (x) =>
          x.Operador_Virtual === this.Documents_M_Empresa[i]['Operador Virtual']
      );
      let companiescount = this.ovs_companies.find(
        (x) => x.ov === this.Documents_M_Empresa[i]['Operador Virtual']
      )?.companies;
      if (exist !== undefined) {
        if (
          this.Documents_M_Empresa[i]['Servicio Emisión FE'] !==
          this.sinEmisionText
        ) {
          exist.Empresas_E_FE++;
        }
        if (
          this.Documents_M_Empresa[i]['Servicio Emisión DS'] !==
          this.sinEmisionText
        ) {
          exist.Empresas_E_DS++;
        }
        if (
          this.Documents_M_Empresa[i]['Servicio Emisión NE'] !==
          this.sinEmisionText
        ) {
          exist.Empresas_E_NE++;
        }
        if (
          this.Documents_M_Empresa[i]['Servicio Recepción FE'] !==
          this.sinRecepcionText
        ) {
          exist.Empresas_R_FE++;
        }
      } else {
        this.Empresas_OV_Count.push({
          Operador_Virtual: this.Documents_M_Empresa[i]['Operador Virtual'],
          Empresas_E_FE:
            this.Documents_M_Empresa[i]['Servicio Emisión FE'] !==
            this.sinEmisionText
              ? 1
              : 0,
          Empresas_E_DS:
            this.Documents_M_Empresa[i]['Servicio Emisión DS'] !==
            this.sinEmisionText
              ? 1
              : 0,
          Empresas_E_NE:
            this.Documents_M_Empresa[i]['Servicio Emisión NE'] !==
            this.sinEmisionText
              ? 1
              : 0,
          Empresas_R_FE:
            this.Documents_M_Empresa[i]['Servicio Recepción FE'] !==
            this.sinRecepcionText
              ? 1
              : 0,
          Total_Empresas: companiescount !== undefined ? companiescount : 0,
        });
      }
    }
  }
}
