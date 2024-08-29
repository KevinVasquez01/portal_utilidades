import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  payrollstagingdocuments,
  payrollstagingdocuments_ErrorMessage,
  payrollstagingdocuments_response,
} from 'src/app/models/MassiveRecoveryNE/massiverecoveryNE';
import { ResponseI } from 'src/app/models/response.interface';
import { findvirtualoperatorI } from 'src/app/models/VirtualOperator/findvirtualoperator';
import { Voperator } from 'src/app/models/vo';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { APIGetServicePRD } from 'src/app/services/SaphetyApi_PRD/apiget.service';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';
import { results_massive_recoveries } from './massive-recovery-run-ne/massive-recovery-run-ne.component';

interface DocumentStatusNE {
  Code: string;
  Name: string;
}

@Component({
  selector: 'app-massive-recovery-ne',
  templateUrl: './massive-recovery-ne.component.html',
  styleUrls: ['./massive-recovery-ne.component.scss'],
})
export class MassiveRecoveryNEComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  opvs: Voperator[] = [];
  opvSelected: Voperator = { Id: '', Alias: '', Name: '' };
  selected_opv: Voperator[] = [];
  selected_opvalue = ''; //alias virtual operator
  selected_opvalueId = ''; //id virtual operator
  ambiente: any;

  /* Acción actual

  0: Carga Inicial DataElments
  1: Seleccionar filtros para búsqueda
  2: Buscando
  3: Resultados Busqueda
  4: Recuperando
  5: Resultados de Recuperacion
  */
  at_moment = { action: 0, error: false }; //Acción actual

  documentsatuscodes: DocumentStatusNE[] = []; //payrollstagingdocumentstatus
  documentsatuscodeSelected: DocumentStatusNE = { Code: '', Name: '' };

  payrollstagingdocuments: payrollstagingdocuments[] = [];
  payrollstagingdocumentsRecovery: payrollstagingdocuments[] = [];

  payrollstagingdocuments_results: results_massive_recoveries[] = [];

  constructor(
    private _translate: TranslateService,
    private _getGetDataQA: APIGetServiceQA,
    private _getGetDataPRD: APIGetServicePRD,
    private _toastProvider: ToastProvider
  ) {
    _translate.setDefaultLang('es');
    let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '';
    this.awaitVirtualOperators();
  }

  ngOnInit(): void {}

  //Espera a que termine de obtener operadores virtuales
  async awaitVirtualOperators() {
    this.at_moment.error = false;
    this.opvs = [];
    this.selected_opv = [];
    const toastProvider_Function = this._toastProvider;
    await this.getVirtualOperators()
      .finally(() => {
        this.defaultOperator();
        this.awaitDocumentStatusNE();
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
      this.opvs.push({ Id: 'all', Alias: 'all', Name: 'Todos' });
      this.selected_opv.push({ Id: 'all', Alias: 'all', Name: 'Todos' });
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
                this.selected_opv.push({
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
                this.selected_opv.push({
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

  //Espera a que termine de obtener payrollstagingdocumentstatus
  async awaitDocumentStatusNE() {
    this.documentsatuscodes = [];
    await this.getDocumentStatusNE()
      .finally(() => {
        this.defaultDocumentStatusNE();
        this.at_moment.action = 1;
      })
      .catch((result) => {
        this.at_moment.error = true;
        this._toastProvider.dangerMessage(
          `Ocurrió un error al obtener DataElements: ${JSON.stringify(result)}`
        );
      });
  }

  //Status Documents PayRoll
  getDocumentStatusNE() {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'PRD') {
        this._getGetDataPRD.GetDocumentStatusNE().subscribe(
          (data) => {
            let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
            if (dataRespomnsive?.IsValid) {
              this.documentsatuscodes = JSON.parse(
                JSON.stringify(dataRespomnsive?.ResultData)
              );
              resolve(true);
            } else {
              reject(data['ResultData']);
            }
          },
          (error) => {
            reject(error['ResultData']);
          }
        );
      } else if (this.ambiente == 'QA') {
        this._getGetDataQA.GetDocumentStatusNE().subscribe(
          (data) => {
            let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
            if (dataRespomnsive?.IsValid) {
              this.documentsatuscodes = JSON.parse(
                JSON.stringify(dataRespomnsive?.ResultData)
              );
              resolve(true);
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

  defaultDocumentStatusNE() {
    var result = this.documentsatuscodes.find(
      (x) => x.Code == 'CommToAuthorizedProviderError'
    );
    if (result != undefined) {
      this.documentsatuscodeSelected = result;
    }
  }

  changeDocumentStatusNE(event: any) {
    var DocumentStatusselected = this.documentsatuscodes.find(
      (x) => x.Code == event
    );
    if (DocumentStatusselected != undefined) {
      this.documentsatuscodeSelected = DocumentStatusselected;
    }
  }

  changeOperator(event: any) {
    let operatorselected = this.opvs.find((x) => x.Alias == event);
    if (operatorselected != undefined) {
      this.selected_opvalueId = operatorselected.Id;
      this.selected_opvalue = operatorselected.Alias;
      this.opvSelected = operatorselected;
    }
  }

  // Operadores virtuales
  onKey_opv(event: any) {
    this.selected_opv = this.search_opv(event.target.value);
  }

  search_opv(value: string) {
    let filter = value.toLowerCase();
    return this.opvs.filter((option: { Name: string }) =>
      option.Name.toLowerCase().startsWith(filter)
    );
  }

  defaultOperator() {
    var operatorselected = this.opvs.find((x) => x.Alias == 'all');
    if (operatorselected != undefined) {
      this.selected_opvalueId = operatorselected.Id;
      this.selected_opvalue = operatorselected.Alias;
      this.opvSelected = operatorselected;
    }
  }

  async search_NE() {
    this.at_moment = { action: 2, error: false }; //Acción actual
    let start = this.range.controls['start'].hasError('matStartDateInvalid')
      ? new Date()
      : new Date(this.range.controls['start'].value);
    let end = this.range.controls['end'].hasError('matStartDateInvalid')
      ? new Date()
      : new Date(this.range.controls['end'].value);

    if (start.getFullYear() > 2000 && end.getFullYear() > 2000) {
      end.setDate(end.getDate() + 1);

      await this.searchDocumentStatusNE(
        start,
        end,
        this.documentsatuscodeSelected.Code
      )
        .finally(() => {
          this.at_moment = { action: 3, error: false }; //Acción actual
        })
        .catch((result) => {
          this.at_moment.error = true;
          this._toastProvider.dangerMessage(
            `Ocurrió un error al obtener Documentos: ${JSON.stringify(result)}`
          );
        });
    } else {
      this._toastProvider.cautionMessage(
        `Por favor seleccione un rango de fechas válido`
      );
    }
  }

  dividir_descripcion(description: string[], caracteres: number) {
    let newDescription = '';
    for (var i = 0; i < description.length; i++) {
      for (var j = 0; j < description[i].split('').length; j++) {
        if (j % caracteres == 0) {
          newDescription += ` ${description[i].split('')[j]}`;
        } else {
          newDescription += description[i].split('')[j];
        }
      }
      newDescription += ` `;
    }
    return newDescription;
  }

  //Search Documents with filters
  searchDocumentStatusNE(
    CreationDateStart: Date,
    CreationDateEnd: Date,
    DocumentStagingStatus: string
  ) {
    return new Promise((resolve, reject) => {
      let Json = {
        Offset: 0,
        NumberOfRecords: 999999,
        CreationDateStart: CreationDateStart,
        CreationDateEnd: CreationDateEnd,
        DocumentStagingStatus: [DocumentStagingStatus],
        SortField: '-CreationDate',
      };

      this.payrollstagingdocuments = [];
      if (this.ambiente == 'PRD') {
        this._getGetDataPRD.SearchDocumentStatusNE(Json).subscribe(
          async (data) => {
            console.log(data);
            await this.receive_historic(data)
              .then(() => {
                resolve(true);
              })
              .catch((error) => reject(error));
          },
          (error) => {
            reject(error['ResultData']);
          }
        );
      } else if (this.ambiente == 'QA') {
        this._getGetDataQA.SearchDocumentStatusNE(Json).subscribe(
          async (data) => {
            await this.receive_historic(data)
              .then(() => {
                resolve(true);
              })
              .catch((error) => reject(error));
          },
          (error) => {
            reject(error['ResultData']);
          }
        );
      }
    });
  }

  receive_historic(data: any) {
    return new Promise((resolve, reject) => {
      let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));

      if (dataRespomnsive?.IsValid) {
        let results: payrollstagingdocuments_response[] = JSON.parse(
          JSON.stringify(dataRespomnsive?.ResultData)
        );

        for (let i = 0; i < results.length; i++) {
          try {
            let ErrorMessage: payrollstagingdocuments_ErrorMessage[] =
              JSON.parse(results[i].ErrorMessage) || [];
            if (ErrorMessage.length > 0) {
              ErrorMessage[0].Description = this.dividir_descripcion(
                ErrorMessage[0].Description.split(' '),
                15
              );
            }
            let new_payrollstagingdocument: payrollstagingdocuments = {
              Selected: false,
              Id: results[i].Id,
              VirtualOperatorAlias:
                results[i].VirtualOperatorAlias.toLowerCase(),
              EmployerIdentification: results[i].EmployerIdentification,
              DocumentNumber: results[i].DocumentNumber,
              Cune: results[i].Cune,
              CorrelationDocumentId: results[i].CorrelationDocumentId,
              IsSyncProcess: results[i].IsSyncProcess,
              CreationDate: results[i].CreationDate,
              LastUpdateDate: results[i].LastUpdateDate,
              Status: results[i].Status,
              Error_Description: ErrorMessage[0]?.Description,
              Error_ExplanationValue: ErrorMessage[0]?.ExplanationValues[0],
            };
            if (this.selected_opvalue == 'all') {
              this.payrollstagingdocuments.push(new_payrollstagingdocument);
            } else {
              if (
                this.selected_opvalue.toLowerCase() ==
                results[i].VirtualOperatorAlias.toLowerCase()
              ) {
                this.payrollstagingdocuments.push(new_payrollstagingdocument);
              }
            }
          } catch {}
        }
        resolve(true);
      } else {
        reject(data['ResultData']);
      }
    });
  }

  //Run recovery
  receive_run_recovery(documents_to_recovery: payrollstagingdocuments[]) {
    this.payrollstagingdocumentsRecovery = documents_to_recovery;
    this.at_moment = { action: 4, error: false }; //Acción actual
  }

  //Recibe resultados recuperación
  receive_result_recovery(documents_to_recovery: results_massive_recoveries[]) {
    this.payrollstagingdocuments_results = documents_to_recovery;
    this.at_moment = { action: 5, error: false }; //Acción actual
  }

  //Cierra resultados
  receive_results_exit(exit: boolean[]) {
    window.location.reload();
  }
}
