import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  invoicestagingdocuments,
  invoicestagingdocuments_ErrorMessage,
  invoicestagingdocuments_response,
} from 'src/app/models/MassiveRecoveryFE/massiverecoveryFE';
import { ResponseI } from 'src/app/models/response.interface';
import { APIGetServicePRD } from 'src/app/services/SaphetyApi_PRD/apiget.service';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';
import { UserMovementsService } from 'src/app/services/UtilidadesAPI/user-movements.service';

export interface results_massive_recoveriesFE {
  error: string[];
  document: invoicestagingdocuments;
  document_result?: invoicestagingdocuments;
}

@Component({
  selector: 'app-massive-recovery-run-fe',
  templateUrl: './massive-recovery-run-fe.component.html',
  styleUrls: ['./massive-recovery-run-fe.component.scss'],
})
export class MassiveRecoveryRunFeComponent implements OnInit {
  ambiente: any;

  @Input() dataEntrante: invoicestagingdocuments[] = [];
  @Output() dataSaliente: EventEmitter<Array<results_massive_recoveriesFE>> =
    new EventEmitter(); //Enviar para recuperacion

  recuperados: Array<results_massive_recoveriesFE> = [];
  recuperado_actual = '';
  status_actual = '';
  await_text = { seconds: '', message: '' };

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
    let arregloDeArreglos = []; // Aquí almacenamos los nuevos arreglos
    const LONGITUD_PEDAZOS = Math.ceil(this.dataEntrante.length / 100); // Partir en 100 arreglos
    for (let i = 0; i < this.dataEntrante.length; i += LONGITUD_PEDAZOS) {
      let pedazo = this.dataEntrante.slice(
        i,
        i + LONGITUD_PEDAZOS >= this.dataEntrante.length
          ? this.dataEntrante.length
          : i + LONGITUD_PEDAZOS
      );
      arregloDeArreglos.push(pedazo);
    }

    function extA(
      arregloDeArreglos: invoicestagingdocuments[][],
      number: number
    ): invoicestagingdocuments[] {
      if (arregloDeArreglos.length > number) {
        return arregloDeArreglos[number];
      } else {
        return [];
      }
    }

    const promises = [];
    //Recupera documentos
    for (let i = 0; i < 100; i++) {
      promises.push(this.segment_recovery(extA(arregloDeArreglos, i)));
    }

    await Promise.all(promises);

    this.at_moment = 1;
    this.status_actual = 'Finalizó con éxito';

    this._userMovement.NewUsersMovement(
      `Se recuperaron: ${this.dataEntrante.length} documentos.`
    );

    this.dataSaliente.emit(this.recuperados);
  }

  async segment_recovery(data: invoicestagingdocuments[]) {
    for (let i = 0; i < data.length; i++) {
      let OVAlias = data[i]?.VirtualOperatorAlias.trim().toLocaleLowerCase();
      let DocumentId = data[i]?.Id;
      this.recuperado_actual = `Recuperando Documento: ${data[i]?.DocumentNumber} - ${OVAlias}`;
      await this.runRecovery(OVAlias, DocumentId)
        .finally(() => {
          if (!this.recuperados.find((x) => x.document.Id == data[i].Id)) {
            this.recuperados.push({
              error: [],
              document: data[i],
            });
          }
        })
        .catch((result) => {
          if (!this.recuperados.find((x) => x.document.Id == data[i].Id)) {
            this.recuperados.push({
              error: [JSON.stringify(result)],
              document: data[i],
            });
          }
        });
    }
  }

  //Recovery
  runRecovery(OVAlias: string, DocumentId: string) {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'PRD') {
        this._getGetDataPRD
          .RecoveryDocumentStatusFE(OVAlias, DocumentId)
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
          .RecoveryDocumentStatusFE(OVAlias, DocumentId)
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
  searchDocumentByCufeStatusFE(index: number, Cufe: string) {
    return new Promise((resolve, reject) => {
      let Json = {
        Cufe: Cufe,
        DocumentStagingStatus: [],
        NumberOfRecords: 20,
        SortField: '-CreationDate',
      };
      if (this.ambiente == 'PRD') {
        this._getGetDataPRD.SearchDocumentStatusFE(Json).subscribe(
          async (data) => {
            await this.receive_historic(index, data, Cufe)
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
        this._getGetDataQA.SearchDocumentStatusFE(Json).subscribe(
          async (data) => {
            await this.receive_historic(index, data, Cufe)
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

  receive_historic(no: number, data: any, Cufe: string) {
    return new Promise((resolve, reject) => {
      let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
      if (dataRespomnsive?.IsValid) {
        let results: invoicestagingdocuments_response[] =
          JSON.parse(JSON.stringify(dataRespomnsive?.ResultData)) || [];

        if (results.length > 0) {
          let ErrorMessage: invoicestagingdocuments_ErrorMessage[] =
            JSON.parse(results[0].ErrorMessage) || [];
          let new_invoicestagingdocument: invoicestagingdocuments = {
            Selected: false,
            Id: results[0].Id,
            VirtualOperatorAlias: results[0].VirtualOperatorAlias.toLowerCase(),
            DocumentType: results[0].DocumentType,
            SupplierIdentification: results[0].SupplierIdentification,
            DocumentNumber: results[0].DocumentNumber,
            Cufe: results[0].Cufe,
            CorrelationDocumentId: results[0].CorrelationDocumentId,
            IsSyncProcess: results[0].IsSyncProcess,
            CreationDate: results[0].CreationDate,
            LastUpdateDate: results[0].LastUpdateDate,
            Status: results[0].Status,
            Error_Description: ErrorMessage[0]?.Description,
            Error_ExplanationValue: ErrorMessage[0]?.ExplanationValues[0],
          };

          this.recuperados[no].document_result = new_invoicestagingdocument;
          resolve(true);
        } else {
          reject(`Documento no encontrado Cufe: ${Cufe}`);
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
