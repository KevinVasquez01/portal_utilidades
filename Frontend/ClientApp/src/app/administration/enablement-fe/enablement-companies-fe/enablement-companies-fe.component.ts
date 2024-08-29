import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  Enablement_Companies,
  Enablement_Documents_Sent,
  Enablement_fe_Struct,
  Enablement_status,
} from 'src/app/models/Enablement/Enablement';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { EnablementFePrdService } from 'src/app/services/SaphetyApi_PRD/enablement-fe-prd.service';
import { SearchPlanPaquetePRDService } from 'src/app/services/SaphetyApi_PRD/search-plan-paquete..service';
import { EnablementFeQAService } from 'src/app/services/SaphetyApi_QA/enablement-fe.service';
import { SearchPlanPaqueteServiceQA } from 'src/app/services/SaphetyApi_QA/search-plan-paquete.service';
import { UserMovementsService } from 'src/app/services/UtilidadesAPI/user-movements.service';
import { CompanyDialogComponent } from '../../company-dialog/company-dialog.component';

interface DocumentReferences {
  DocumentReferred: string;
  IssueDate: Date;
  Type: string;
  DocumentReferredCUFE: string;
}

declare var require: any;
const json_dto_fv = require('./enablement_dto_fv.json');
const json_dto_nd = require('./enablement_dto_nd.json');
const json_dto_nc = require('./enablement_dto_nc.json');

@Component({
  selector: 'app-enablement-companies-fe',
  templateUrl: './enablement-companies-fe.component.html',
  styleUrls: ['./enablement-companies-fe.component.scss'],
})
export class EnablementCompaniesFeComponent implements OnInit {
  @Input() companies_for_enablement: Array<Enablement_Companies> = [];
  @Output() companies_status: EventEmitter<Enablement_status> =
    new EventEmitter(); //Envía log current action
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  columnsToDisplay = [
    'Alias_Operador_Virtual',
    'Nit',
    'Name',
    'ExternalKey',
    'TestSetId',
    'PlanOPaquete',
  ];
  dataSource = new MatTableDataSource<Enablement_Companies>([]);
  ambiente = '';
  is_enabling = false;

  invoices_to_enablement = 8; //Facturas que serán enviadas para habilitación
  first_document = new FormControl('100001', [
    Validators.min(1),
    Validators.max(5000000),
    Validators.required,
  ]);

  companyStatus: Enablement_status = {
    status: [],
  };

  constructor(
    private _toastProvider: ToastProvider,
    private _dialog: MatDialog,
    private _enablementQA: EnablementFeQAService,
    private _enablementPRD: EnablementFePrdService,
    private _PlanPaquetePRD: SearchPlanPaquetePRDService,
    private _PlanPaqueteQA: SearchPlanPaqueteServiceQA,
    private _userMovement: UserMovementsService
  ) {
    let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '';
  }

  ngOnInit(): void {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.data = this.companies_for_enablement;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  confirmacionCrearCompanies() {
    const dialog = this._dialog.open(CompanyDialogComponent, {
      width: '450px',
      data: {
        titulo: 'Habilitar compañías',
        mensaje: `¿Desea habilitar las compañías seleccionadas?`,
        respuesta: false,
      },
    });

    dialog.afterClosed().subscribe(async (resp) => {
      if (resp.respuesta) {
        this.execute_enablement();
      } else {
        this._toastProvider.infoMessage('Habilitación cancelada.');
      }
    });
  }

  async execute_enablement() {
    let enviosAsync: Array<Enablement_Documents_Sent> = [];

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    today.setDate(today.getDate() - 1);
    let IssueStartDate = today;
    let IssueEndDate = tomorrow;

    for (let i = 0; i < this.companies_for_enablement.length; i++) {
      //***********************************/
      //Plan o Paquete
      //***********************************/
      //Si compañia no cuenta con plan o paquete crea uno temporal
      if (this.companies_for_enablement[i].planopaquete == undefined) {
        this.companyStatus.status.push({
          company: this.companies_for_enablement[i].company_saphety?.Name || '',
          nit:
            this.companies_for_enablement[i].company_saphety?.Identification
              .DocumentType +
            ' ' +
            this.companies_for_enablement[i].company_saphety?.Identification
              .DocumentNumber +
            '-' +
            this.companies_for_enablement[i].company_saphety?.Identification
              .CheckDigit,
          current_action: 'Creando Plan de Emisión temporal',
          finalize: false,
          error: false,
        });
        this.current_action_sent();

        if (this.ambiente == 'PRD') {
          await this._PlanPaquetePRD
            .awaitPaqueteE(
              this.companies_for_enablement[i].company_saphety
                ?.VirtualOperatorId || '',
              this.companies_for_enablement[i].company_saphety?.Id || ''
            )
            .then((result) => {
              this.companies_for_enablement[i].planopaquete = result;
            });
        } else {
          await this._PlanPaqueteQA
            .awaitPaqueteE(
              this.companies_for_enablement[i].company_saphety
                ?.VirtualOperatorId || '',
              this.companies_for_enablement[i].company_saphety?.Id || ''
            )
            .then((result) => {
              this.companies_for_enablement[i].planopaquete = result;
            });
        }

        //Si ocurre error al crear planoPaquete
        if (this.companies_for_enablement[i].planopaquete?.error != undefined) {
          this.current_action_notify(
            i,
            `Ocurrió un error al crear Plan o Paquete: ${this.companies_for_enablement[i].planopaquete?.error}`
          );
        } else {
          this.current_action_notify(i, 'Enviando facturas');
        }
      } else {
        this.companyStatus.status.push({
          company: this.companies_for_enablement[i].company_saphety?.Name || '',
          nit:
            this.companies_for_enablement[i].company_saphety?.Identification
              .DocumentType +
            ' ' +
            this.companies_for_enablement[i].company_saphety?.Identification
              .DocumentNumber +
            '-' +
            this.companies_for_enablement[i].company_saphety?.Identification
              .CheckDigit,
          current_action: 'Enviando facturas',
          finalize: false,
          error: false,
        });
        this.current_action_sent();
      }

      //***********************************/
      //Facturas
      //***********************************/
      //Enviar 8 facturas Async
      await this.send_dto_fv(this.companies_for_enablement[i], true, i).then(
        (ids_facturas) => {
          enviosAsync.push({
            company_excel: this.companies_for_enablement[i].company_excel,
            company_saphety: this.companies_for_enablement[i].company_saphety,
            serie_H_saphety: this.companies_for_enablement[i].serie_H_saphety,
            sales_invoices: ids_facturas,
            debit_notes: [],
            credit_notes: [],
            enablement_result: false,
          });
        }
      );
      this.current_action_notify(i, 'Sincronizando Facturas');

      //Sincronizar facturas
      for (let j = 0; j < enviosAsync[i].sales_invoices.length; j++) {
        let invoice = enviosAsync[i].sales_invoices[j];
        if (invoice.isvalid) {
          let result = await this.sync_document_status(
            enviosAsync[i].company_excel.Alias_Operador_Virtual,
            invoice
          );
          //Si el set de pruebas se encuentra habilitado
          if (
            result.statusDescription ==
            `Set de prueba con identificador ${enviosAsync[i].company_excel.TestSetId} se encuentra Aceptado.`
          ) {
            //enviosAsync[i].enablement_result = true;
            result.isvalid = true;
            //break;
          }
        } else {
        }
      }

      this.current_action_notify(i, 'Buscando Facturas y asociando CUFE');
      //Buscar facturas y asociar Cufe
      await this.search_documents(
        enviosAsync[i].company_excel.Alias_Operador_Virtual,
        IssueStartDate,
        IssueEndDate,
        enviosAsync[i].serie_H_saphety?.TestSetId || '',
        enviosAsync[i].sales_invoices
      );

      const facturas_result = enviosAsync[i].sales_invoices.filter(
        (x) => x.isvalid
      );
      enviosAsync[i].enablement_result =
        facturas_result.length >= this.invoices_to_enablement ? true : false;

      //***********************************/
      //Nota Débito
      //***********************************/
      if (enviosAsync[i].enablement_result) {
        this.current_action_notify(i, 'Enviando Nota Débito');

        //Enviar Nota Débito
        await this.send_dto_nd(enviosAsync[i]).then((ids_debitnotes) => {
          enviosAsync[i].debit_notes.push(ids_debitnotes);
        });

        this.current_action_notify(i, 'Sincronizando Nota Débito');

        //Sincronizar notas Débito
        for (let j = 0; j < enviosAsync[i].debit_notes.length; j++) {
          let debit_note = enviosAsync[i].debit_notes[j];
          if (debit_note.isvalid) {
            let result = await this.sync_document_status(
              enviosAsync[i].company_excel.Alias_Operador_Virtual,
              debit_note
            );

            //Si el set de pruebas se encuentra habilitado
            if (
              result.statusDescription ==
              `Set de prueba con identificador ${enviosAsync[i].company_excel.TestSetId} se encuentra Aceptado.`
            ) {
              //enviosAsync[i].enablement_result = true;
              result.isvalid = true;
              //break;
            }
          }
        }
        await this.search_documents(
          enviosAsync[i].company_excel.Alias_Operador_Virtual,
          IssueStartDate,
          IssueEndDate,
          enviosAsync[i].serie_H_saphety?.TestSetId || '',
          enviosAsync[i].debit_notes
        );
      }

      const debitnote_resul = enviosAsync[i].debit_notes.filter(
        (x) => x.isvalid
      );
      enviosAsync[i].enablement_result =
        debitnote_resul.length > 0 ? true : false;

      //***********************************/
      //Nota Crédito
      //***********************************/
      if (enviosAsync[i].enablement_result) {
        this.current_action_notify(i, 'Enviando Nota Crédito');

        //Enviar Nota Crédito
        await this.send_dto_nc(enviosAsync[i]).then((ids_creditnotes) => {
          enviosAsync[i].credit_notes.push(ids_creditnotes);
        });

        this.current_action_notify(i, 'Sincronizando Nota Crédito');

        //Sincronizar notas crédito
        for (let j = 0; j < enviosAsync[i].credit_notes.length; j++) {
          let creditnote = enviosAsync[i].credit_notes[j];
          if (creditnote.isvalid) {
            let result = await this.sync_document_status(
              enviosAsync[i].company_excel.Alias_Operador_Virtual,
              creditnote
            );

            //Si el set de pruebas se encuentra habilitado
            if (
              result.statusDescription ==
              `Set de prueba con identificador ${enviosAsync[i].company_excel.TestSetId} se encuentra Aceptado.`
            ) {
              //enviosAsync[i].enablement_result = true;
              result.isvalid = true;
              //break;
            }
          }
        }

        //Buscar notas crédito y asociar Cufe
        await this.search_documents(
          enviosAsync[i].company_excel.Alias_Operador_Virtual,
          IssueStartDate,
          IssueEndDate,
          enviosAsync[i].serie_H_saphety?.TestSetId || '',
          enviosAsync[i].credit_notes
        );
      }

      const creditnotes_result = enviosAsync[i].credit_notes.filter(
        (x) => x.isvalid
      );
      enviosAsync[i].enablement_result =
        creditnotes_result.length > 0 ? true : false;

      //***********************************/
      //Factura final
      //***********************************/
      if (enviosAsync[i].enablement_result) {
        //Enviar 1 facturas Async
        await this.send_dto_fv(this.companies_for_enablement[i], false, i).then(
          (ids_facturas) => {
            enviosAsync[i].sales_invoices.push(ids_facturas[0]);
          }
        );

        this.current_action_notify(
          i,
          'Sincronizando factura final, validación Habilitación'
        );

        //Sincronizar facturas
        let factura_final =
          enviosAsync[i].sales_invoices[
            enviosAsync[i].sales_invoices.length - 1
          ];
        let result = await this.sync_document_status(
          enviosAsync[i].company_excel.Alias_Operador_Virtual,
          factura_final
        );

        //Si el set de pruebas se encuentra habilitado
        if (
          result.statusDescription ==
          `Set de prueba con identificador ${enviosAsync[i].company_excel.TestSetId} se encuentra Aceptado.`
        ) {
          enviosAsync[i].enablement_result = true;
          result.isvalid = true;
          this.current_action_notify(i, 'Habilitación Finalizada con Éxito.');
          this.companyStatus.status[i].finalize = true;
        } else {
          this.current_action_notify(i, 'Habilitación Finalizada con Errores.');
          this.companyStatus.status[i].finalize = true;
          this.companyStatus.status[i].error = true;
        }
      }

      //***********************************/
      //Plan o Paquete
      //***********************************/
      //Elimina Plan o Paquete temporal
      if (this.companies_for_enablement[i].planopaquete?.createdPU) {
        if (this.companies_for_enablement[i].planopaquete?.error == undefined) {
          await this._PlanPaquetePRD.eliminaPaqueteE(
            this.companies_for_enablement[i].company_saphety
              ?.VirtualOperatorId || '',
            this.companies_for_enablement[i].company_saphety?.Id || '',
            this.companies_for_enablement[i].planopaquete?.id || ''
          );
          this.current_action_notify(i, 'Se eliminó plan o paquete Temporal');
        }
      }

      //***********************************/
      //Error
      //***********************************/
      //Notifica en caso de error
      if (!enviosAsync[i].enablement_result) {
        this.current_action_notify(i, 'Habilitación Finalizada con Errores.');
        this.companyStatus.status[i].finalize = true;
        this.companyStatus.status[i].error = true;
      }

      //***********************************/
      //Notifica movimiento Usuario
      //***********************************/
      let resultfinal =
        enviosAsync[i].sales_invoices[enviosAsync[i].sales_invoices.length - 1];

      this._userMovement.NewUsersMovement(
        `Se habilitó Empresa: ${this.companies_for_enablement[i].company_saphety?.Identification.DocumentNumber}-${this.companies_for_enablement[i].company_saphety?.Identification.CheckDigit} TestSetId: ${this.companies_for_enablement[i].serie_H_saphety?.TestSetId} Resultado Habilitación: ${resultfinal.statusDescription}`
      );
    }
    this.companyStatus.results = enviosAsync; //Indica a padre que termino de habilitar
  }

  send_dto_fv(
    company: Enablement_Companies,
    first_time: boolean,
    companyStatus_index: number
  ) {
    return new Promise<Array<Enablement_fe_Struct>>(async (resolve) => {
      let invoice_no: number = first_time
        ? this.first_document.value
        : this.first_document.value + this.invoices_to_enablement;
      let success_invoices: Array<Enablement_fe_Struct> = [];
      while (
        success_invoices.length < (first_time ? this.invoices_to_enablement : 1)
      ) {
        //Notifica estatus
        this.companyStatus.status[companyStatus_index].current_action =
          first_time
            ? `Enviando Factura: ${invoice_no}`
            : 'Enviando Factura final, validación Habilitación';

        let Json_FV = this.json_saleinvoice(invoice_no, company);
        if (this.ambiente == 'PRD') {
          //Envía facturas a Saphety PRD
          await this._enablementPRD
            .createFV_Async(
              Json_FV,
              company.company_excel.Alias_Operador_Virtual
            )
            .then((result) => {
              let id: string = result['Id'];
              success_invoices.push({
                documentId: id,
                documentNumber: invoice_no,
                isvalid: true,
              });
            })
            .catch((error) => {
              success_invoices.push({
                documentId: '',
                documentNumber: invoice_no,
                statusMessage: JSON.stringify(error),
                isvalid: false,
              });
            });
          invoice_no++;
        } else {
          //Envía facturas a Saphety QA
          await this._enablementQA
            .createFV_Async(
              Json_FV,
              company.company_excel.Alias_Operador_Virtual
            )
            .then((result) => {
              let id: string = result['Id'];
              success_invoices.push({
                documentId: id,
                documentNumber: invoice_no,
                isvalid: true,
              });
            })
            .catch((error) => {
              success_invoices.push({
                documentId: '',
                documentNumber: invoice_no,
                statusMessage: JSON.stringify(error),
                isvalid: false,
              });
            });
          invoice_no++;
        }
      }
      resolve(success_invoices);
    });
  }

  send_dto_nc(company: Enablement_Documents_Sent) {
    return new Promise<Enablement_fe_Struct>(async (resolve) => {
      let creditnote_no: number = this.first_document.value;
      let success_creditnote: Enablement_fe_Struct = {
        documentId: '',
        documentNumber: 0,
        statusMessage: '',
        isvalid: false,
      };

      let invoicesrefered = company.sales_invoices.find(
        (x) => x.cufe != undefined
      );
      if (invoicesrefered != undefined) {
        let DocumentReferences: DocumentReferences = {
          DocumentReferred: invoicesrefered.documentNumber.toString(),
          IssueDate:
            invoicesrefered.issueDate != undefined
              ? invoicesrefered.issueDate
              : new Date(),
          Type: 'InvoiceReference',
          DocumentReferredCUFE: invoicesrefered.cufe || '',
        };

        let Json_NC = this.json_creditnote(
          creditnote_no,
          company,
          DocumentReferences
        );
        if (this.ambiente == 'PRD') {
          //Envía NC a Saphety PRD
          await this._enablementPRD
            .createNC_Async(
              Json_NC,
              company.company_excel.Alias_Operador_Virtual
            )
            .then((result) => {
              let id: string = result['Id'];
              success_creditnote = {
                documentId: id,
                documentNumber: creditnote_no,
                isvalid: true,
              };
            })
            .catch((error) => {
              success_creditnote = {
                documentId: '',
                documentNumber: creditnote_no,
                statusMessage: JSON.stringify(error),
                isvalid: false,
              };
            });
        } else {
          //Envía NC a Saphety QA
          await this._enablementQA
            .createNC_Async(
              Json_NC,
              company.company_excel.Alias_Operador_Virtual
            )
            .then((result) => {
              let id: string = result['Id'];
              success_creditnote = {
                documentId: id,
                documentNumber: creditnote_no,
                isvalid: true,
              };
            })
            .catch((error) => {
              success_creditnote = {
                documentId: '',
                documentNumber: creditnote_no,
                statusMessage: JSON.stringify(error),
                isvalid: false,
              };
            });
        }
      }
      resolve(success_creditnote);
    });
  }

  send_dto_nd(company: Enablement_Documents_Sent) {
    return new Promise<Enablement_fe_Struct>(async (resolve) => {
      let debitnote_no: number = this.first_document.value;
      let success_debitnote: Enablement_fe_Struct = {
        documentId: '',
        documentNumber: 0,
        statusMessage: '',
        isvalid: false,
      };

      let invoicesrefered = company.sales_invoices.find(
        (x) => x.cufe != undefined
      );
      if (invoicesrefered != undefined) {
        let DocumentReferences: DocumentReferences = {
          DocumentReferred: invoicesrefered.documentNumber.toString(),
          IssueDate:
            invoicesrefered.issueDate != undefined
              ? invoicesrefered.issueDate
              : new Date(),
          Type: 'InvoiceReference',
          DocumentReferredCUFE: invoicesrefered.cufe || '',
        };

        let Json_ND = this.json_debitnote(
          debitnote_no,
          company,
          DocumentReferences
        );
        if (this.ambiente == 'PRD') {
          //Envía ND a Saphety PRD
          await this._enablementPRD
            .createND_Async(
              Json_ND,
              company.company_excel.Alias_Operador_Virtual
            )
            .then((result) => {
              let id: string = result['Id'];
              success_debitnote = {
                documentId: id,
                documentNumber: debitnote_no,
                isvalid: true,
              };
            })
            .catch((error) => {
              success_debitnote = {
                documentId: '',
                documentNumber: debitnote_no,
                statusMessage: JSON.stringify(error),
                isvalid: false,
              };
            });
        } else {
          //Envía ND a Saphety QA
          await this._enablementQA
            .createND_Async(
              Json_ND,
              company.company_excel.Alias_Operador_Virtual
            )
            .then((result) => {
              let id: string = result['Id'];
              success_debitnote = {
                documentId: id,
                documentNumber: debitnote_no,
                isvalid: true,
              };
            })
            .catch((error) => {
              success_debitnote = {
                documentId: '',
                documentNumber: debitnote_no,
                statusMessage: JSON.stringify(error),
                isvalid: false,
              };
            });
        }
      }
      resolve(success_debitnote);
    });
  }

  json_saleinvoice(invoice_no: number, company: Enablement_Companies): JSON {
    let newJSON = json_dto_fv;
    newJSON['SeriePrefix'] = company.serie_H_saphety?.Prefix;
    newJSON['SerieNumber'] = invoice_no;
    newJSON['IssueDate'] = new Date();
    newJSON['DueDate'] = new Date();
    newJSON['DeliveryDate'] = new Date();
    newJSON['CorrelationDocumentId'] =
      invoice_no.toString() + new Date().getTime().toString();
    newJSON['SerieExternalKey'] = company.serie_H_saphety?.ExternalKey;

    let identification = company.company_saphety?.Identification;
    let new_identification = {
      Identification: {
        CheckDigit: identification?.CheckDigit,
        CountryCode: identification?.CountryCode,
        DocumentNumber: identification?.DocumentNumber,
        DocumentType: identification?.DocumentType,
      },
    };
    newJSON['IssuerParty'] = new_identification;
    return newJSON;
  }

  json_creditnote(
    creditnote_no: number,
    company: Enablement_Documents_Sent,
    DocumentReferences: DocumentReferences
  ): JSON {
    let newJSON = json_dto_nc;
    newJSON['SeriePrefix'] = company.serie_H_saphety?.Prefix;
    newJSON['SerieNumber'] = creditnote_no;
    newJSON['IssueDate'] = new Date();
    newJSON['DueDate'] = new Date();
    newJSON['DeliveryDate'] = new Date();
    newJSON['CorrelationDocumentId'] =
      creditnote_no.toString() + new Date().getTime().toString();
    newJSON['SerieExternalKey'] = company.serie_H_saphety?.ExternalKey;

    let identification = company.company_saphety?.Identification;
    let new_identification = {
      Identification: {
        CheckDigit: identification?.CheckDigit,
        CountryCode: identification?.CountryCode,
        DocumentNumber: identification?.DocumentNumber,
        DocumentType: identification?.DocumentType,
      },
    };
    newJSON['IssuerParty'] = new_identification;
    newJSON['DocumentReferences'] = [DocumentReferences];

    return newJSON;
  }

  json_debitnote(
    debitnote_no: number,
    company: Enablement_Documents_Sent,
    DocumentReferences: DocumentReferences
  ): JSON {
    let newJSON = json_dto_nd;
    newJSON['SeriePrefix'] = company.serie_H_saphety?.Prefix;
    newJSON['SerieNumber'] = debitnote_no;
    newJSON['IssueDate'] = new Date();
    newJSON['DueDate'] = new Date();
    newJSON['DeliveryDate'] = new Date();
    newJSON['CorrelationDocumentId'] =
      debitnote_no.toString() + new Date().getTime().toString();
    newJSON['SerieExternalKey'] = company.serie_H_saphety?.ExternalKey;

    let identification = company.company_saphety?.Identification;
    let new_identification = {
      Identification: {
        CheckDigit: identification?.CheckDigit,
        CountryCode: identification?.CountryCode,
        DocumentNumber: identification?.DocumentNumber,
        DocumentType: identification?.DocumentType,
      },
    };
    newJSON['IssuerParty'] = new_identification;
    newJSON['DocumentReferences'] = [DocumentReferences];

    return newJSON;
  }

  sync_document_status(opvName: string, document: Enablement_fe_Struct) {
    return new Promise<Enablement_fe_Struct>(async (resolve) => {
      if (this.ambiente == 'PRD') {
        //Sincroniza documentos Saphety PRD
        await this._enablementPRD
          .syncDocument_Status(opvName, document.documentId)
          .then((result) => {
            this.return_message_document_status(document, result, true);
          })
          .catch((error) => {
            this.return_message_document_status(document, error, false);
          });
      } else {
        //Sincroniza documentos Saphety QA
        await this._enablementQA
          .syncDocument_Status(opvName, document.documentId)
          .then((result) => {
            this.return_message_document_status(document, result, true);
          })
          .catch((error) => {
            this.return_message_document_status(document, error, false);
          });
      }
      resolve(document);
    });
  }

  return_message_document_status(
    document: Enablement_fe_Struct,
    json: any,
    result: boolean
  ) {
    //Result Ok
    if (result) {
      let results = json['Result'];
      if (results.length > 0) {
        try {
          document.statusDescription = results[0]['StatusDescription'];
          document.statusMessage = results[0]['StatusMessage'];
        } catch {
          document.statusDescription = JSON.stringify(results);
          document.statusMessage = '';
        }
      } else {
        document.statusDescription = JSON.stringify(results);
        document.statusMessage = '';
      }
      document.isvalid = true;
    }
    //Result KO
    else {
      let results: any;
      try {
        let resultsData = json['ResultData'];
        results = resultsData['Result'];
      } catch {
        results = json['Errors'];
      }

      if (results.length > 0) {
        try {
          document.statusDescription = results[0]['StatusDescription'];
          document.statusMessage =
            results[0]['ErrorMessage'] != null
              ? JSON.stringify(results[0]['ErrorMessage'])
              : '';
        } catch {
          document.statusDescription = JSON.stringify(results);
          document.statusMessage = '';
        }
      } else {
        document.statusDescription = JSON.stringify(results);
        document.statusMessage = '';
      }
      document.isvalid = false;
    }
  }

  search_documents(
    opvName: string,
    IssueStartDate: Date,
    IssueEndDate: Date,
    TestSetId: string,
    documents: Array<Enablement_fe_Struct>
  ) {
    return new Promise<Array<Enablement_fe_Struct>>(async (resolve) => {
      let arrayResult: Array<any> = [];
      if (this.ambiente == 'PRD') {
        //Busca documentos a Saphety PRD
        await this._enablementPRD
          .searchDocuments(opvName, IssueStartDate, IssueEndDate, TestSetId)
          .then((result) => {
            arrayResult = result;
          })
          .catch((error) => {
            arrayResult = error;
          });
      } else {
        //Busca documentos a Saphety QA
        await this._enablementQA
          .searchDocuments(opvName, IssueStartDate, IssueEndDate, TestSetId)
          .then((result) => {
            arrayResult = result;
          })
          .catch((error) => {
            arrayResult = error;
          });
      }

      for (let i = 0; i < arrayResult.length; i++) {
        let document = documents.find(
          (x) => x.documentId == arrayResult[i]['Id']
        );
        if (document != undefined) {
          document.cufe = arrayResult[i]['Cufe'];
          document.issueDate = arrayResult[i]['IssueDate'];
        }
      }

      resolve(documents);
    });
  }

  current_action_sent() {
    this.companies_status.emit(this.companyStatus);
  }

  current_action_notify(index: number, message: string) {
    this.companyStatus.status[index].current_action = message;
  }
}
