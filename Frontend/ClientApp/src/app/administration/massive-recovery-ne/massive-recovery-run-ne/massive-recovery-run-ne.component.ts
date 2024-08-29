import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  payrollstagingdocuments,
  payrollstagingdocuments_ErrorMessage,
  payrollstagingdocuments_response,
} from 'src/app/models/MassiveRecoveryNE/massiverecoveryNE';
import { ResponseI } from 'src/app/models/response.interface';
import { APIGetServicePRD } from 'src/app/services/SaphetyApi_PRD/apiget.service';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';
import { UserMovementsService } from 'src/app/services/UtilidadesAPI/user-movements.service';

export interface results_massive_recoveries {
  error: string[];
  document: payrollstagingdocuments;
  document_result?: payrollstagingdocuments;
}

@Component({
  selector: 'app-massive-recovery-run-ne',
  templateUrl: './massive-recovery-run-ne.component.html',
  styleUrls: ['./massive-recovery-run-ne.component.scss'],
})
export class MassiveRecoveryRunNEComponent implements OnInit {
  ambiente: any;

  @Input() dataEntrante: payrollstagingdocuments[] = [];
  @Output() dataSaliente: EventEmitter<Array<results_massive_recoveries>> =
    new EventEmitter(); //Enviar para recuperacion

  recuperados: Array<results_massive_recoveries> = [];
  recuperado_actual = '';
  status_actual = '';
  await_text = {seconds: '', message: ''};

  at_moment = 0;
  actually_index = 0; //ndex de respuestas

  seconds_await = 15; //Segundos de espera consulta resultados

  constructor(
    private _getGetDataQA: APIGetServiceQA,
    private _getGetDataPRD: APIGetServicePRD,
    private _userMovement: UserMovementsService
  ) {
    let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '';
  }

  ngOnInit(): void {
    this.awaitrunRecovery();
  }

  //Espera a que termine de recuperar documento
  async awaitrunRecovery() {
    //Recupera documentos
    for (let i = 0; i < this.dataEntrante.length; i++) {
      let OVAlias =
        this.dataEntrante[i]?.VirtualOperatorAlias.trim().toLocaleLowerCase();
      let DocumentId = this.dataEntrante[i]?.Id;
      this.recuperado_actual = `Recuperando Documento: ${this.dataEntrante[i]?.DocumentNumber} - ${OVAlias}`;
      await this.runRecovery(OVAlias, DocumentId)
        .finally(() => {
          this.recuperados.push({
            error: [],
            document: this.dataEntrante[i],
          });
        })
        .catch((result) => {
          this.recuperados.push({
            error: [JSON.stringify(result)],
            document: this.dataEntrante[i],
          });
        });
    }

    this.at_moment = 1;
    this.recuperado_actual = `Finalizó con Éxito`;

    //Espera n segundos para obtener respuesta
    function timeout() {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    }

    for (let i = 0; i < this.seconds_await; i++) {
      await timeout().finally(() => {
        this.await_text = {seconds: `${this.seconds_await - i} segundos`, message: 'Esperando, para obtener respuesta'};
      });
    }

    this.await_text = {seconds: '', message: ''};

    //Obtiene respuesta
    for (let i = 0; i < this.recuperados.length; i++) {
      if (this.recuperados[i].error.length == 0) {
        let Cune = this.dataEntrante[i]?.Cune;
        this.status_actual = `Obteniendo respuesta de Documento: ${this.dataEntrante[i]?.DocumentNumber} - Cune: ${Cune}`;
        this.actually_index = i;
        await this.searchDocumentByCufeStatusNE(i, Cune).catch((result) => {
          this.recuperados[i].error.push(result);
        });
      }
    }
    this.status_actual = 'Finalizó con éxito';

    this._userMovement.NewUsersMovement(
      `Se recuperaron: ${this.dataEntrante.length} documentos.`
    );

    this.dataSaliente.emit(this.recuperados);
  }

  //Recovery
  runRecovery(OVAlias: string, DocumentId: string) {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'PRD') {
        this._getGetDataPRD
          .RecoveryDocumentStatusNE(OVAlias, DocumentId)
          .subscribe(
            (data) => {
              let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
              if (dataRespomnsive?.IsValid) {
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
        this._getGetDataQA
          .RecoveryDocumentStatusNE(OVAlias, DocumentId)
          .subscribe(
            (data) => {
              let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
              if (dataRespomnsive?.IsValid) {
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

  //Search Documents with filters
  searchDocumentByCufeStatusNE(index: number, Cune: string) {
    return new Promise((resolve, reject) => {
      let Json = {
        Cune: Cune,
        DocumentStagingStatus: [],
        NumberOfRecords: 20,
        SortField: '-CreationDate',
      };
      if (this.ambiente == 'PRD') {
        this._getGetDataPRD.SearchDocumentStatusNE(Json).subscribe(
          async (data) => {
            await this.receive_historic(index, data, Cune)
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
            await this.receive_historic(index, data, Cune)
              .then(() => {
                resolve(true);
              })
              .catch((error) => reject(error));
          },
          (error) => {
            reject(JSON.stringify(error['ResultData']));
          }
        );
      }
    });
  }

  receive_historic(no: number, data: any, Cune: string) {
    return new Promise((resolve, reject) => {
      let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
      if (dataRespomnsive?.IsValid) {
        let results: payrollstagingdocuments_response[] =
          JSON.parse(JSON.stringify(dataRespomnsive?.ResultData)) || [];

        if (results.length > 0) {
          let ErrorMessage: payrollstagingdocuments_ErrorMessage[] =
            JSON.parse(results[0].ErrorMessage) || [];
          let new_payrollstagingdocument: payrollstagingdocuments = {
            Selected: false,
            Id: results[0].Id,
            VirtualOperatorAlias: results[0].VirtualOperatorAlias.toLowerCase(),
            EmployerIdentification: results[0].EmployerIdentification,
            DocumentNumber: results[0].DocumentNumber,
            Cune: results[0].Cune,
            CorrelationDocumentId: results[0].CorrelationDocumentId,
            IsSyncProcess: results[0].IsSyncProcess,
            CreationDate: results[0].CreationDate,
            LastUpdateDate: results[0].LastUpdateDate,
            Status: results[0].Status,
            Error_Description: ErrorMessage[0]?.Description,
            Error_ExplanationValue: ErrorMessage[0]?.ExplanationValues[0],
          };

          this.recuperados[no].document_result = new_payrollstagingdocument;
          resolve(true);
        } else {
          reject(`Documento no encontrado Cune: ${Cune}`);
        }
      } else {
        this.recuperados[no].error.push(
          `Error al validar resultado: ${JSON.stringify(data['ResultData'])}`
        );
        reject(data['ResultData']);
      }
    });
  }
}
