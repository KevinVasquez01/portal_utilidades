import { DatePipe } from '@angular/common';
import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CompanyS_I } from 'src/app/models/SearchCompany/searchCompany';
import {
  Template,
  Template_log,
  Template_sublog,
} from 'src/app/models/Templates/templates';
import {
  TemplateControlI,
  TemplateSaphetyI,
} from 'src/app/models/Templates/templateSaphety';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { APIGetServicePRD } from 'src/app/services/SaphetyApi_PRD/apiget.service';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';
import { UtilidadesAPIService } from 'src/app/services/UtilidadesAPI/utilidades-api.service';

interface Documenttypes {
  Code: string;
  Name: string;
  SubTypes: DocumentSubTypes[];
  isInvoice: boolean;
}

interface DocumentSubTypes {
  Code: string;
  Name: string;
  Included: boolean;
}

@Component({
  selector: 'app-templates-create',
  templateUrl: './templates-create.component.html',
  styleUrls: ['./templates-create.scss'],
})
export class TemplatesCreateComponent implements OnInit, AfterContentChecked {
  documentTypes: Documenttypes[] = [];
  documentsubTypesInvoice: DocumentSubTypes[] = [];
  ambiente: any;

  showSubTypes = false;
  showSubTypes_all_Selected = false;
  step = 0;

  documentTypeSelected: Documenttypes = {
    Code: '',
    Name: '',
    SubTypes: [],
    isInvoice: true,
  };
  documentsubTypesInvoiceSelected!: Documenttypes[];

  defaultTemplates: Template[] = [];
  defaultTemplatesforSelected: Template[] = [];
  templateSelected: Template = {
    id: 0,
    name: '',
    documenttype: '',
    content: '',
  };

  //Alertas
  alertDocumentType = false;
  alertOriginTemplate = false;
  alertCompanies = false;

  //Creando
  creando = false;

  //obteniendo DataElmenets
  gettingDE = false;
  firstgettingDE = true;

  FormGroup = new FormGroup({
    Teamplate: new FormControl('', [Validators.required]),
  });

  creation_Logs: Template_log[] = [];

  @Input() companies_to_add: CompanyS_I[] = [];
  @Output() datasaliente: EventEmitter<boolean> = new EventEmitter();
  @Output() logsaliente: EventEmitter<Template_log[]> = new EventEmitter();
  @Output() closesearchcompanies: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private _translate: TranslateService,
    private cdref: ChangeDetectorRef,
    private _toastProvider: ToastProvider,
    private _getDataQA: APIGetServiceQA,
    private _getDataPRD: APIGetServicePRD,
    private _getDataUAPI: UtilidadesAPIService,
    private _datePipe: DatePipe
  ) {
    _translate.setDefaultLang('es');
    let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '';
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  updateAllComplete() {
    this.showSubTypes_all_Selected =
      this.documentTypeSelected.SubTypes != null &&
      this.documentTypeSelected.SubTypes.every((t) => t.Included);
  }

  someComplete(): boolean {
    if (this.documentTypeSelected.SubTypes == null) {
      return false;
    }
    return (
      this.documentTypeSelected.SubTypes.filter((t) => t.Included).length > 0 &&
      !this.showSubTypes_all_Selected
    );
  }

  setAll(completed: boolean) {
    this.showSubTypes_all_Selected = completed;
    if (this.documentTypeSelected.SubTypes == null) {
      return;
    }
    this.documentTypeSelected.SubTypes.forEach((t) => (t.Included = completed));
  }

  ngOnInit(): void {
    this.awaitDataElments();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  async awaitDataElments() {
    this.gettingDE = true;
    await this.GetDocumentSubTypesSalesInvoice().catch((error) =>
      this._toastProvider.dangerMessage(
        `Error al obtener DocumentSubTypesSalesInvoice: ${error}`
      )
    );
    await this.GetDocumentTypesSalesInvoice().catch((error) =>
      this._toastProvider.dangerMessage(
        `Error al obtener DocumentTypesSalesInvoice: ${error}`
      )
    );
    await this.GetDocumentTypesPayRoll().catch((error) =>
      this._toastProvider.dangerMessage(
        `Error al obtener DocumentTypesPayRoll: ${error}`
      )
    );
    await this.GetDefaultTemplates().catch((error) =>
      this._toastProvider.dangerMessage(
        `Error al obtener DefaultTemplates: ${error}`
      )
    );

    this.gettingDE = false;
    this.firstgettingDE = false;
  }

  //Obtiene Tipos de documentos, facturación
  GetDocumentTypesSalesInvoice() {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'PRD') {
        this._getDataPRD.SearchDocumentTypesSalesInvoice().subscribe(
          (data) => {
            if (data['IsValid']) {
              let documentT: Documenttypes[] = JSON.parse(
                JSON.stringify(data['ResultData'])
              );
              documentT.forEach((x) => {
                x.isInvoice = true;
                x.SubTypes = this.documentsubTypesInvoice;
                this.documentTypes.push(x);
              });
              resolve(true);
            } else {
              reject();
            }
          },
          (error) => {
            reject();
          }
        );
      } else if (this.ambiente == 'QA') {
        this._getDataQA.SearchDocumentTypesSalesInvoice().subscribe(
          (data) => {
            if (data['IsValid']) {
              let documentT: Documenttypes[] = JSON.parse(
                JSON.stringify(data['ResultData'])
              );
              documentT.forEach((x) => {
                x.isInvoice = true;
                x.SubTypes = this.documentsubTypesInvoice;
                this.documentTypes.push(x);
              });
              resolve(true);
            } else {
              reject();
            }
          },
          (error) => {
            reject();
          }
        );
      } else {
        reject();
      }
    });
  }

  //Obtiene Sub Tipos de documentos, facturación
  GetDocumentSubTypesSalesInvoice() {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'PRD') {
        this._getDataPRD.SearchDocumentSubTypesSalesInvoice().subscribe(
          (data) => {
            if (data['IsValid']) {
              let documentT: DocumentSubTypes[] = JSON.parse(
                JSON.stringify(data['ResultData'])
              );
              documentT.forEach((x) => {
                this.documentsubTypesInvoice.push(x);
              });
              resolve(true);
            } else {
              reject();
            }
          },
          (error) => {
            reject();
          }
        );
      } else if (this.ambiente == 'QA') {
        this._getDataQA.SearchDocumentSubTypesSalesInvoice().subscribe(
          (data) => {
            if (data['IsValid']) {
              let documentT: DocumentSubTypes[] = JSON.parse(
                JSON.stringify(data['ResultData'])
              );
              documentT.forEach((x) => {
                this.documentsubTypesInvoice.push(x);
              });
              resolve(true);
            } else {
              reject();
            }
          },
          (error) => {
            reject();
          }
        );
      } else {
        reject();
      }
    });
  }

  //Obtiene Tipos de documentos, nómina
  GetDocumentTypesPayRoll() {
    return new Promise((resolve, reject) => {
      if (this.ambiente == 'PRD') {
        this._getDataPRD.SearchDocumentTypesPayRoll().subscribe(
          (data) => {
            if (data['IsValid']) {
              let documentT: Documenttypes[] = JSON.parse(
                JSON.stringify(data['ResultData'])
              );
              documentT.forEach((x) => {
                x.isInvoice = false;
                x.SubTypes = [];
                this.documentTypes.push(x);
              });
              resolve(true);
            } else {
              reject();
            }
          },
          (error) => {
            reject();
          }
        );
      } else if (this.ambiente == 'QA') {
        this._getDataQA.SearchDocumentTypesPayRoll().subscribe(
          (data) => {
            if (data['IsValid']) {
              let documentT: Documenttypes[] = JSON.parse(
                JSON.stringify(data['ResultData'])
              );
              documentT.forEach((x) => {
                x.isInvoice = false;
                x.SubTypes = [];
                this.documentTypes.push(x);
              });
              resolve(true);
            } else {
              reject();
            }
          },
          (error) => {
            reject();
          }
        );
      } else {
        reject();
      }
    });
  }

  ShowSubTypes(event: string) {
    let selected = this.documentTypes.find((x) => x.Code == event);
    if (selected != undefined) {
      this.showSubTypes = selected.SubTypes.length > 0 ? true : false;
      this.documentTypeSelected = selected;
      let defaultTemplates = this.defaultTemplates.filter(
        (x) => x.documenttype == selected?.Code
      );
      this.defaultTemplates
        .filter((x) => x.documenttype == 'any')
        .forEach((y) => defaultTemplates.push(y));
      if (defaultTemplates != undefined) {
        this.defaultTemplatesforSelected = defaultTemplates;
      }
    } else {
      this.showSubTypes = false;
      this.documentTypeSelected = {
        Code: '',
        Name: '',
        SubTypes: [],
        isInvoice: true,
      };
      this.defaultTemplatesforSelected = [];
    }
  }

  GetDefaultTemplates() {
    return new Promise<Template[]>((resolve, reject) => {
      this._getDataUAPI.GetDefaultTemplates().subscribe(
        (data) => {
          let templates: Template[] = JSON.parse(JSON.stringify(data));
          if (templates != null) {
            this.defaultTemplates = templates;
            resolve(templates);
          } else {
            reject();
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  ChangeTemplateSelection(event: Template) {
    if (event.documenttype == 'any') {
      event.content = '';
    }
    this.templateSelected = event;
    this.FormGroup.patchValue({ Teamplate: event.content });
  }

  UploadFile(event: any) {
    if (
      event.target instanceof HTMLInputElement &&
      event.target.files.length > 0
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.templateSelected.content = reader.result as string;
        this.FormGroup.patchValue({ Teamplate: reader.result as string });
      };
      reader.readAsText(event.target.files[0]);
    }
  }

  RemoverCompany(company: CompanyS_I) {
    const index = this.companies_to_add.indexOf(company);
    if (index >= 0) {
      this.companies_to_add.splice(index, 1);
    }
  }

  AddCompanies() {
    this.datasaliente.emit(false);
  }

  async CreateTemplate() {
    if (!this.ValidateTemplate()) {
      return;
    }

    this.closesearchcompanies.emit(true);

    this._toastProvider.infoMessage(
      'Creando Templates para las compañías seleccionadas, por favor no cierre esta ventana.'
    );
    this.creando = true;
    let templates = await this.ArmarTemplate();
    if (this.documentTypeSelected.isInvoice) {
      //Template Invoice
      for await (const template of templates) {
        try {
          this._toastProvider.infoMessage(
            `Creando template: ${template.DocumentType}-${template.DocumentSubType}.`
          );
          await this.SendTemplateInvoice(template);
        } catch {}

        //Ultimo elemento agregado
        if (templates.indexOf(template) == templates.length - 1) {
          this.logsaliente.emit(this.creation_Logs);

          //Reinicia formulario
          this.RestoreForm();
          //Mensaje resultado
          this._toastProvider.successMessage('Se crearon Templates');
        }
      }
    } else {
      // Template PayRoll
      for await (const template of templates) {
        try {
          this._toastProvider.infoMessage(
            `Creando template: ${template.DocumentType}-${template.DocumentSubType}.`
          );
          await this.SendTemplatePayRoll(template);
        } catch {}

        //Ultimo elemento agregado
        if (templates.indexOf(template) == templates.length - 1) {
          this.logsaliente.emit(this.creation_Logs);

          //Reinicia formulario
          this.RestoreForm();
          //Mensaje resultado
          this._toastProvider.successMessage('Se crearon Templates');
        }
      }
    }
  }

  ArmarTemplate() {
    return new Promise<TemplateControlI[]>((resolve) => {
      let date = this._datePipe.transform(new Date(), 'yyyyMMddhhmmss');
      let templates_to_sent: TemplateControlI[] = [];

      this.companies_to_add.forEach((company) => {
        //Log
        let log: Template_log = {
          Date: new Date(),
          CompanyName: company.Name,
          OperatorName: company.SelectedOPVName,
          CompanyId: company.Id,
          Result: false,
          Logs: [],
        };
        this.creation_Logs.push(log);

        //Template
        let template: TemplateControlI = {
          DocumentType: this.documentTypeSelected.Code,
          DocumentSubType: '',
          Content: this.templateSelected.content,
          Name: `${this.documentTypeSelected.Code}_${date}`,
          CompanyId: company.Id,
          OperatorVirtual: company.SelectedOPVName,
        };
        templates_to_sent.push(template);
        this.documentTypeSelected.SubTypes.forEach((subtype) => {
          if (subtype.Included) {
            let newtemplate: TemplateControlI = {
              DocumentType: template.DocumentType,
              DocumentSubType: subtype.Code,
              Content: template.Content,
              Name: `${this.documentTypeSelected.Code}_${subtype.Code}_${date}`,
              CompanyId: template.CompanyId,
              OperatorVirtual: template.OperatorVirtual,
            };
            templates_to_sent.push(newtemplate);
          }
        });
      });
      resolve(templates_to_sent);
    });
  }

  ValidateTemplate() {
    if (this.documentTypeSelected.Code == '') {
      this.alertDocumentType = true;
    } else {
      this.alertDocumentType = false;
    }

    if (this.templateSelected.content == '') {
      this.alertOriginTemplate = true;
    } else {
      this.alertOriginTemplate = false;
    }

    if (this.companies_to_add.length == 0) {
      this.alertCompanies = true;
    } else {
      this.alertCompanies = false;
    }

    if (
      this.alertDocumentType ||
      this.alertOriginTemplate ||
      this.alertCompanies
    ) {
      this._toastProvider.cautionMessage(
        'Por favor diligencie la información faltante'
      );
      return false;
    } else {
      return true;
    }
  }

  SendTemplateInvoice(template: TemplateControlI) {
    return new Promise<string>((resolve, reject) => {
      let template_to_send: TemplateSaphetyI = {
        DocumentType: template.DocumentType,
        DocumentSubType: template.DocumentSubType,
        Content: template.Content,
        Name: template.Name,
      };
      let sublog: Template_sublog = {
        Date: new Date(),
        TemplateName: template.Name,
        DocumentType: template.DocumentType,
        Result: false,
        Message: '',
      };

      if (this.ambiente == 'PRD') {
        this._getDataPRD
          .NewTemplateSalesInvoice(
            template_to_send,
            template.OperatorVirtual,
            template.CompanyId
          )
          .subscribe(
            async (data) => {
              if (data['IsValid']) {
                this.AddSublLog(
                  sublog,
                  true,
                  'Se creó template con éxito',
                  template.CompanyId
                );
                await this.ActivateTemplateInvoice(
                  sublog,
                  template.OperatorVirtual,
                  template.CompanyId,
                  String(data['ResultData'])
                );
                resolve(String(data['ResultData']));
              } else {
                this.AddSublLog(
                  sublog,
                  false,
                  'No fue posible crear template',
                  template.CompanyId
                );
                reject();
              }
            },
            (error) => {
              this.AddSublLog(
                sublog,
                false,
                `Error al crear template: ${JSON.stringify(error)}`,
                template.CompanyId
              );
              reject(error);
            }
          );
      } else if (this.ambiente == 'QA') {
        this._getDataQA
          .NewTemplateSalesInvoice(
            template_to_send,
            template.OperatorVirtual,
            template.CompanyId
          )
          .subscribe(
            async (data) => {
              if (data['IsValid']) {
                this.AddSublLog(
                  sublog,
                  true,
                  'Se creó template con éxito',
                  template.CompanyId
                );
                await this.ActivateTemplateInvoice(
                  sublog,
                  template.OperatorVirtual,
                  template.CompanyId,
                  String(data['ResultData'])
                );
                resolve(String(data['ResultData']));
              } else {
                this.AddSublLog(
                  sublog,
                  false,
                  'No fue posible crear template',
                  template.CompanyId
                );
                reject();
              }
            },
            (error) => {
              this.AddSublLog(
                sublog,
                false,
                `Error al crear template: ${JSON.stringify(error)}`,
                template.CompanyId
              );
              reject(error);
            }
          );
      }
    });
  }

  SendTemplatePayRoll(template: TemplateControlI) {
    return new Promise((resolve, reject) => {
      let template_to_send: TemplateSaphetyI = {
        DocumentType: template.DocumentType,
        DocumentSubType: template.DocumentSubType,
        Content: template.Content,
        Name: template.Name,
      };

      let sublog: Template_sublog = {
        Date: new Date(),
        TemplateName: template.Name,
        DocumentType: template.DocumentType,
        Result: false,
        Message: '',
      };

      if (this.ambiente == 'PRD') {
        this._getDataPRD
          .NewTemplatePayRoll(
            template_to_send,
            template.OperatorVirtual,
            template.CompanyId
          )
          .subscribe(
            async (data) => {
              if (data['IsValid']) {
                this.AddSublLog(
                  sublog,
                  true,
                  'Se creó template con éxito',
                  template.CompanyId
                );
                await this.ActivateTemplatePayRoll(
                  sublog,
                  template.OperatorVirtual,
                  template.CompanyId,
                  String(data['ResultData'])
                );
                resolve(String(data['ResultData']));
              } else {
                this.AddSublLog(
                  sublog,
                  false,
                  'No fue posible crear template',
                  template.CompanyId
                );
                reject();
              }
            },
            (error) => {
              this.AddSublLog(
                sublog,
                false,
                `Error al crear template: ${JSON.stringify(error)}`,
                template.CompanyId
              );
              reject(error);
            }
          );
      } else if (this.ambiente == 'QA') {
        this._getDataQA
          .NewTemplatePayRoll(
            template_to_send,
            template.OperatorVirtual,
            template.CompanyId
          )
          .subscribe(
            async (data) => {
              if (data['IsValid']) {
                this.AddSublLog(
                  sublog,
                  true,
                  'Se creó template con éxito',
                  template.CompanyId
                );
                await this.ActivateTemplatePayRoll(
                  sublog,
                  template.OperatorVirtual,
                  template.CompanyId,
                  String(data['ResultData'])
                );
                resolve(String(data['ResultData']));
              } else {
                this.AddSublLog(
                  sublog,
                  false,
                  'No fue posible crear template',
                  template.CompanyId
                );
                reject();
              }
            },
            (error) => {
              this.AddSublLog(
                sublog,
                false,
                `Error al crear template: ${JSON.stringify(error)}`,
                template.CompanyId
              );
              reject(error);
            }
          );
      }
    });
  }

  ActivateTemplateInvoice(
    sublog: Template_sublog,
    opvName: string,
    companyId: string,
    templateId: string
  ) {
    return new Promise((resolve, reject) => {
      let newlog: Template_sublog = {
        Date: new Date(),
        TemplateName: sublog.TemplateName,
        DocumentType: sublog.DocumentType,
        Result: false,
        Message: '',
      };
      if (this.ambiente == 'PRD') {
        this._getDataPRD
          .ActivateTemplateSalesInvoice(opvName, companyId, templateId)
          .subscribe(
            (data) => {
              if (data['IsValid']) {
                this.AddSublLog(
                  newlog,
                  true,
                  'Se activó template con éxito',
                  companyId
                );
                resolve(true);
              } else {
                this.AddSublLog(
                  newlog,
                  false,
                  'No fue posible activar template',
                  companyId
                );
                reject();
              }
            },
            (error) => {
              this.AddSublLog(
                newlog,
                false,
                `Error al activar template: ${JSON.stringify(error)}`,
                companyId
              );
              reject(error);
            }
          );
      } else if (this.ambiente == 'QA') {
        this._getDataQA
          .ActivateTemplateSalesInvoice(opvName, companyId, templateId)
          .subscribe(
            (data) => {
              if (data['IsValid']) {
                this.AddSublLog(
                  newlog,
                  true,
                  'Se activó template con éxito',
                  companyId
                );
                resolve(true);
              } else {
                this.AddSublLog(
                  newlog,
                  false,
                  'No fue posible activar template',
                  companyId
                );
                reject();
              }
            },
            (error) => {
              this.AddSublLog(
                newlog,
                false,
                `Error al activar template: ${JSON.stringify(error)}`,
                companyId
              );
              reject(error);
            }
          );
      }
    });
  }

  ActivateTemplatePayRoll(
    sublog: Template_sublog,
    opvName: string,
    companyId: string,
    templateId: string
  ) {
    return new Promise((resolve, reject) => {
      let newlog: Template_sublog = {
        Date: new Date(),
        TemplateName: sublog.TemplateName,
        DocumentType: sublog.DocumentType,
        Result: false,
        Message: '',
      };
      if (this.ambiente == 'PRD') {
        this._getDataPRD
          .ActivateTemplatePayRoll(opvName, companyId, templateId)
          .subscribe(
            (data) => {
              if (data['IsValid']) {
                this.AddSublLog(
                  newlog,
                  true,
                  'Se activó template con éxito',
                  companyId
                );
                resolve(true);
              } else {
                this.AddSublLog(
                  newlog,
                  false,
                  'No fue posible activar template',
                  companyId
                );
                reject();
              }
            },
            (error) => {
              this.AddSublLog(
                newlog,
                false,
                `Error al activar template: ${JSON.stringify(error)}`,
                companyId
              );
              reject(error);
            }
          );
      } else if (this.ambiente == 'QA') {
        this._getDataQA
          .ActivateTemplatePayRoll(opvName, companyId, templateId)
          .subscribe(
            (data) => {
              if (data['IsValid']) {
                this.AddSublLog(
                  newlog,
                  true,
                  'Se activó template con éxito',
                  companyId
                );
                resolve(true);
              } else {
                this.AddSublLog(
                  newlog,
                  false,
                  'No fue posible activar template',
                  companyId
                );
                reject();
              }
            },
            (error) => {
              this.AddSublLog(
                newlog,
                false,
                `Error al activar template: ${JSON.stringify(error)}`,
                companyId
              );
              reject(error);
            }
          );
      }
    });
  }

  //Agrega subllog de template a log de empresa
  AddSublLog(
    sublog: Template_sublog,
    result: boolean,
    message: string,
    companyId: string
  ) {
    let log = this.creation_Logs.find((x) => x.CompanyId == companyId);
    if (log != undefined) {
      log.Result = result;
      sublog.Result = result;
      sublog.Message = message;
      log.Logs.push(sublog);
    }
  }

  //Reinicia formulario
  RestoreForm() {
    this.creation_Logs = [];
    this.showSubTypes = false;
    this.showSubTypes_all_Selected = false;
    this.step = 0;

    //Alertas
    this.alertDocumentType = false;
    this.alertOriginTemplate = false;
    this.alertCompanies = false;

    this.documentTypeSelected = {
      Code: '',
      Name: '',
      SubTypes: [],
      isInvoice: true,
    };
    this.templateSelected = { id: 0, name: '', documenttype: '', content: '' };

    this.creando = false;
  }
}
