import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CompanySaphetyI } from 'src/app/models/Company/Company';
import { jsonDistI } from 'src/app/models/Jsonformat/jsonDistribuidores';
import { PlanPackage_Companies } from 'src/app/models/PackagesPRD/massiveplanspackages';
import {
  Report_Documents_ActuallyAction,
  Report_Documents_M_Empresa,
  Report_Documents_topEmisionDS,
  Report_Documents_topEmisionDS_AliadoOV,
  Report_Documents_topEmisionFE,
  Report_Documents_topEmisionFE_AliadoOV,
  Report_Documents_topEmisionNE,
  Report_Documents_topEmisionNE_AliadoOV,
  Report_Documents_topRecepcionFE,
  Report_Documents_topRecepcionFE_AliadoOV,
  Report_Documents_topWidgets,
} from 'src/app/models/Reports/Documents/documents-issued';
import { ResponseI } from 'src/app/models/response.interface';
import { findvirtualoperatorI } from 'src/app/models/VirtualOperator/findvirtualoperator';
import { Voperator } from 'src/app/models/vo';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { APIGetServicePRD } from 'src/app/services/SaphetyApi_PRD/apiget.service';
import { SearchCompanyPrdService } from 'src/app/services/SaphetyApi_PRD/search-company-prd.service';
import { SearchPlanPaquetePRDService } from 'src/app/services/SaphetyApi_PRD/search-plan-paquete..service';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';
import { DataElementsService } from 'src/app/services/UtilidadesAPI/data-elements.service';

@Component({
  selector: 'app-documents-issued',
  templateUrl: './documents-issued.component.html',
  styleUrls: ['./documents-issued.component.scss'],
})
export class DocumentsIssuedComponent implements OnInit {
  @Input() report_type = 1; //1 Integración, 2 Masificación

  alias_saphety = 'saphety'; //Se utiliza para omitir operador en Integración y solo buscar alias en Masificación
  opvSaphety: Voperator[] = [];

  //Listado de distribuidores
  listdist: Array<jsonDistI> = [];
  listdist_Top: Array<jsonDistI> = [];

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
  3: Generando Widgets
  4: Mostrar Resultados
  */
  at_moment = { action: 0, error: false }; //Acción actual
  actually_action: Array<Report_Documents_ActuallyAction> = []; //Acción que se está ejecutando actualmente para vista
  errorsAPI: Array<{ message: string; json: string }> = [];

  Documents_M_Empresa: Report_Documents_M_Empresa[] = []; //Documentos Emitidos y Recibidos pos empresa

  start_report: Date = new Date(); //Fecha inicio reporte
  end_report: Date = new Date(); //Fecha fin reporte

  total_OVs: number = 0; //Total de Operadores virtuales seleccionados

  //Widgets
  topEmisionFE: Array<Report_Documents_topEmisionFE> = [];
  topEmisionDS: Array<Report_Documents_topEmisionDS> = [];
  topEmisionNE: Array<Report_Documents_topEmisionNE> = [];
  topRecepcionFE: Array<Report_Documents_topRecepcionFE> = [];

  topEmisionFE_AliadoOV: Array<Report_Documents_topEmisionFE_AliadoOV> = [];
  topEmisionDS_AliadoOV: Array<Report_Documents_topEmisionDS_AliadoOV> = [];
  topEmisionNE_AliadoOV: Array<Report_Documents_topEmisionNE_AliadoOV> = [];
  topRecepcionFE_AliadoOV: Array<Report_Documents_topRecepcionFE_AliadoOV> = [];

  constructor(
    private _getGetDataQA: APIGetServiceQA,
    private _getGetDataPRD: APIGetServicePRD,
    private _toastProvider: ToastProvider,
    private _SearchCompanyPRD: SearchCompanyPrdService,
    private _dataElementsU: DataElementsService,
    private _planopaquetePRD: SearchPlanPaquetePRDService
  ) {
    let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '';

    this.awaitDataElments();
  }

  ngOnInit(): void {}

  //Espera a que termine de obtener operadores virtuales
  async awaitVirtualOperators() {
    this.at_moment.error = false;
    this.opvs = [];
    this.selected_opv = [];
    const toastProvider_Function = this._toastProvider;
    await this.getVirtualOperators()
      .then(() => {
        this.at_moment.error = false;
        this.at_moment.action = 1;
      })
      .finally(() => {
        this.defaultOperator();
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
      this.selected_opvalue = 'all';
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

              //Guarda OV Saphety
              let saphety = operadores.find(
                (x) =>
                  x.Alias.toLowerCase() === this.alias_saphety.toLowerCase()
              );
              if (saphety != undefined) {
                this.opvSaphety.push(saphety);
              }
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
              //Guarda OV Saphety
              let saphety = operadores.find(
                (x) =>
                  x.Alias.toLowerCase() === this.alias_saphety.toLowerCase()
              );
              if (saphety != undefined) {
                this.opvSaphety.push(saphety);
              }
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

  defaultOperator() {
    var operatorselected = this.opvs.find((x) => x.Alias == 'all');
    if (operatorselected != undefined) {
      this.selected_opvalueId = operatorselected.Id;
      this.selected_opvalue = operatorselected.Alias;
      this.opvSelected = operatorselected;
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

  async awaitDataElments() {
    await this.GetDistributors().catch((error) => {
      this.at_moment.error = true;
      this._toastProvider.dangerMessage(
        `Error al obtener Distribuidores: ${error}`
      );
    });
    await this.GetDistributorsIncludesTop().catch((error) => {
      this.at_moment.error = true;
      this._toastProvider.dangerMessage(
        `Error al obtener Aliados incluidos en Top: ${error}`
      );
    });

    await this.awaitVirtualOperators();
  }

  //Generar informe
  async generate() {
    this.at_moment.action = 2;
    if (this.report_type === 1) {
      //Generar integración
      await this.generate_integration();
    } else {
      //Generar masificación
      await this.generate_masification();
    }

    await this.GenerarTop();
  }

  //Generar integración
  async generate_integration() {
    if (this.opvSelected.Alias == 'all') {
      //Consulta empresas de todos los OV
      this.total_OVs = this.opvs.length - 1;
      for (
        let i = 0;
        i < this.opvs.filter((x) => x.Alias != 'all').length;
        i++
      ) {
        await this.SearhCompanies_PRD(
          this.opvs.filter((x) => x.Alias != 'all')[i]
        ).catch(() => {
          this.at_moment.error = true;
          return;
        });
      }
    } else {
      //Consulta empresas de OV Seleccionado
      this.total_OVs = 1;
      await this.SearhCompanies_PRD(this.opvSelected).catch(() => {
        this.at_moment.error = true;
        return;
      });
    }
  }

  //Generar masificación
  async generate_masification() {
    //Consulta empresas de OV Saphety
    if (this.opvSaphety.length > 0) {
      await this.SearhCompanies_PRD(this.opvSaphety[0]).catch(() => {
        this.at_moment.error = true;
      });
    } else {
      this.at_moment.error = true;
    }
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

  //Obtener listado compañías PRD
  SearhCompanies_PRD(VOperator: Voperator) {
    return new Promise(async (resolve, reject) => {
      this.start_report = this.range.controls['start'].hasError(
        'matStartDateInvalid'
      )
        ? new Date()
        : new Date(this.range.controls['start'].value);
      this.end_report = this.range.controls['end'].hasError(
        'matStartDateInvalid'
      )
        ? new Date()
        : new Date(this.range.controls['end'].value);

      // Add a day
      this.end_report.setDate(this.end_report.getDate() + 1);
      // Remove second
      this.end_report.setSeconds(this.end_report.getSeconds() - 1);

      this.actually_action.push({
        ov: VOperator.Name,
        start: this.start_report,
        end: this.end_report,
        executed: 0,
        count: 0,
        action: `Obteniendo compañías OV ${VOperator.Name}`,
        have_companies: true,
      });

      await this._SearchCompanyPRD
        .SearchCompanies_WithoutFilter(VOperator.Alias)
        .then(async (company) => {
          if (company.length > 0) {
            let arregloDeArreglos = []; // Aquí almacenamos los nuevos arreglos
            let numArreglos = 50; // Numero de arreglos
            const LONGITUD_PEDAZOS = Math.ceil(company.length / numArreglos); // Partir en NumArreglos
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
              start: this.start_report,
              end: this.end_report,
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

  async segment_companies(
    VirtualOperator: Voperator,
    company: Array<CompanySaphetyI>
  ) {
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';

    for (let i = 0; i < company.length; i++) {
      let document: Report_Documents_M_Empresa = {
        Aliado: VirtualOperator.Name,
        Nombre: company[i].Name,
        Nit: company[i].Identification.DocumentNumber,
        Email: company[i].Email,
        Email_Financiero: company[i].FinancialSupportEmail,
        Telefono: company[i].Telephone || '',
        Emision_Facturacion: {
          SalesInvoice: 0,
          CreditNote: 0,
          DebitNote: 0,
          Total: 0,
        },
        Recepcion_Facturacion: {
          SalesInvoice: 0,
          CreditNote: 0,
          DebitNote: 0,
          Total: 0,
        },
        Emision_DocumentoSoporte: {
          SupportDocument: 0,
          SupportDocumentAdjustment: 0,
          Total: 0,
        },
        Emision_Nomina: {
          NominaIndividual: 0,
          NominaIndividualDeAjuste: 0,
          Total: 0,
        },
        Paquete_Plan_FE: {
          Name: '',
          ExpirationDate: '',
          RemainingDocuments: null,
        },
        Paquete_Plan_DS: {
          Name: '',
          ExpirationDate: '',
          RemainingDocuments: null,
        },
        Paquete_Plan_NE: {
          Name: '',
          ExpirationDate: '',
          RemainingDocuments: null,
        },
        Paquete_Plan_RE: {
          Name: '',
          ExpirationDate: '',
          RemainingDocuments: null,
        },
      };

      let identification_company = `${company[i].Identification.CountryCode}_${company[i].Identification.DocumentType}_${company[i].Identification.DocumentNumber}`;
      let bodyFE = {
        SuppliersCodes: identification_company ? [identification_company] : [],
        DocumentTypes: [],
        CreationDateStart: this.start_report,
        CreationDateEnd: this.end_report,
        NumberOfRecords: 0,
      };

      let bodyDS = {
        CustomerCodes: identification_company ? [identification_company] : [],
        DocumentTypes: [],
        CreationDateStart: this.start_report,
        CreationDateEnd: this.end_report,
        NumberOfRecords: 0,
      };

      let bodyFEIn = {
        CompanyIds: [company[i].Id],
        DocumentTypes: [],
        CreationDateStart: this.start_report,
        CreationDateEnd: this.end_report,
        NumberOfRecords: 0,
      };

      let bodyNE = {
        Employers: company[i].Id ? [company[i].Id] : [],
        DocumentTypes: [],
        CreationDateStart: this.start_report,
        CreationDateEnd: this.end_report,
        NumberOfRecords: 0,
      };

      let AliasOV = VirtualOperator.Alias;
      let data = await Promise.all([
        //Facturacion Emitida
        this.GetOutbounddocuments(AliasOV, bodyFE, 'SalesInvoice'),
        this.GetOutbounddocuments(AliasOV, bodyFE, 'CreditNote'),
        this.GetOutbounddocuments(AliasOV, bodyFE, 'DebitNote'),
        //Documento soporte Emitido
        this.GetOutbounddocuments(AliasOV, bodyDS, 'SupportDocument'),
        this.GetOutbounddocuments(AliasOV, bodyDS, 'SupportDocumentAdjustment'),
        //Nomina Emitido
        this.GetPayroll(AliasOV, bodyNE, 'NominaIndividual'),
        this.GetPayroll(AliasOV, bodyNE, 'NominaIndividualDeAjuste'),
        //Facturacion Recibido
        this.GetInbounddocuments(AliasOV, bodyFEIn, 'SalesInvoice'),
        this.GetInbounddocuments(AliasOV, bodyFEIn, 'CreditNote'),
        this.GetInbounddocuments(AliasOV, bodyFEIn, 'DebitNote'),
      ]);

      let [
        SalesInvoice,
        CreditNote,
        DebitNote,
        SupportDocument,
        SupportDocumentAdjustment,
        NominaIndividual,
        NominaIndividualDeAjuste,
        InSalesInvoice,
        InCreditNote,
        InDebitNote,
      ] = data;

      //Facturacion Emitida
      document.Emision_Facturacion.SalesInvoice = SalesInvoice;
      document.Emision_Facturacion.CreditNote = CreditNote;
      document.Emision_Facturacion.DebitNote = DebitNote;
      document.Emision_Facturacion.Total =
        SalesInvoice + CreditNote + DebitNote;
      //Documento soporte Emitido
      document.Emision_DocumentoSoporte.SupportDocument = SupportDocument;
      document.Emision_DocumentoSoporte.SupportDocumentAdjustment =
        SupportDocumentAdjustment;
      document.Emision_DocumentoSoporte.Total =
        SupportDocument + SupportDocumentAdjustment;
      //Nomina Emitido
      document.Emision_Nomina.NominaIndividual = NominaIndividual;
      document.Emision_Nomina.NominaIndividualDeAjuste =
        NominaIndividualDeAjuste;
      document.Emision_Nomina.Total =
        NominaIndividual + NominaIndividualDeAjuste;
      //Facturacion Recibido
      document.Recepcion_Facturacion.SalesInvoice = InSalesInvoice;
      document.Recepcion_Facturacion.CreditNote = InCreditNote;
      document.Recepcion_Facturacion.DebitNote = InDebitNote;
      document.Recepcion_Facturacion.Total =
        InSalesInvoice + InCreditNote + InDebitNote;

      //Masificacion
      if (this.report_type === 2) {
        let distribuidor = company[i].DistributorId
          ? this.listdist.find((x) => x.Id == company[i].DistributorId)
          : undefined;
        let DistName = distribuidor != undefined ? distribuidor?.Name : 'PREPAGO';
        document.Aliado = DistName
        this.Update_ActuallyAction(1, `${company[i].Name} - ${DistName}`, true);

        //Planes y paquetes de empresa
        await this._planopaquetePRD
          .obtenerPlanyPaquete(
            AliasOV,
            `${company[i].VirtualOperatorId}`,
            company[i].Id,
            false
          )
          .then((planesypaquetes) => {
            //Planes y Paquetes FE
            if (planesypaquetes.PaquetesFE.length > 0) {
              document.Paquete_Plan_FE.Name =
                planesypaquetes.PaquetesFE[0].Name;
              document.Paquete_Plan_FE.ExpirationDate = planesypaquetes.PaquetesFE[0].ExpirationDate != null ? formatDate(
                planesypaquetes.PaquetesFE[0].ExpirationDate,
                format,
                locale
              ) : '';
            } else if (planesypaquetes.PlanesFE.length > 0) {
              document.Paquete_Plan_FE.Name = planesypaquetes.PlanesFE[0].Name;
              document.Paquete_Plan_FE.ExpirationDate = planesypaquetes.PlanesFE[0].ExpirationDate != null ? formatDate(
                planesypaquetes.PlanesFE[0].ExpirationDate,
                format,
                locale
              ): '';
              document.Paquete_Plan_FE.RemainingDocuments =
                planesypaquetes.PlanesFE[0].RemainingDocuments;
            }

            //Planes y Paquetes DS
            if (planesypaquetes.PaquetesDS.length > 0) {
              document.Paquete_Plan_DS.Name =
                planesypaquetes.PaquetesDS[0].Name;
              document.Paquete_Plan_DS.ExpirationDate = planesypaquetes.PaquetesDS[0].ExpirationDate != null ? formatDate(
                planesypaquetes.PaquetesDS[0].ExpirationDate,
                format,
                locale
              ): '';
            } else if (planesypaquetes.PlanesDS.length > 0) {
              document.Paquete_Plan_DS.Name = planesypaquetes.PlanesDS[0].Name;
              document.Paquete_Plan_DS.ExpirationDate = planesypaquetes.PlanesDS[0].ExpirationDate != null ? formatDate(
                planesypaquetes.PlanesDS[0].ExpirationDate,
                format,
                locale
              ):'';
              document.Paquete_Plan_DS.RemainingDocuments =
                planesypaquetes.PlanesDS[0].RemainingDocuments;
            }

            //Planes y Paquetes NE
            if (planesypaquetes.PaquetesNE.length > 0) {
              document.Paquete_Plan_NE.Name =
                planesypaquetes.PaquetesNE[0].Name;
              document.Paquete_Plan_NE.ExpirationDate = planesypaquetes.PaquetesNE[0].ExpirationDate != null ? formatDate(
                planesypaquetes.PaquetesNE[0].ExpirationDate,
                format,
                locale
              ): '';
            } else if (planesypaquetes.PlanesNE.length > 0) {
              document.Paquete_Plan_NE.Name = planesypaquetes.PlanesNE[0].Name;
              document.Paquete_Plan_NE.ExpirationDate = planesypaquetes.PlanesNE[0].ExpirationDate != null ? formatDate(
                planesypaquetes.PlanesNE[0].ExpirationDate,
                format,
                locale
              ): '';
              document.Paquete_Plan_NE.RemainingDocuments =
                planesypaquetes.PlanesNE[0].RemainingDocuments;
            }

            //Planes y Paquetes RE
            if (planesypaquetes.PaquetesRE.length > 0) {
              document.Paquete_Plan_RE.Name =
                planesypaquetes.PaquetesRE[0].Name;
              document.Paquete_Plan_RE.ExpirationDate = planesypaquetes.PaquetesRE[0].ExpirationDate != null ? formatDate(
                planesypaquetes.PaquetesRE[0].ExpirationDate,
                format,
                locale
              ): '';
            } else if (planesypaquetes.PlanesRE.length > 0) {
              document.Paquete_Plan_RE.Name = planesypaquetes.PlanesRE[0].Name;
              document.Paquete_Plan_RE.ExpirationDate = planesypaquetes.PlanesRE[0].ExpirationDate != null ? formatDate(
                planesypaquetes.PlanesRE[0].ExpirationDate,
                format,
                locale
              ): '';
              document.Paquete_Plan_RE.RemainingDocuments =
                planesypaquetes.PlanesRE[0].RemainingDocuments;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.Update_ActuallyAction(1, `${company[i].Name}`, true);
      }

      this.Documents_M_Empresa.push(document);
    }
  }

  GetOutbounddocuments(
    operatorvirtualId: string,
    body: any,
    DocumentType: string
  ) {
    body.DocumentTypes = [DocumentType];
    return new Promise<number>((resolve, reject) => {
      this._getGetDataPRD
        .GetOutbounddocumentsNumber(body, operatorvirtualId)
        .subscribe(
          (data) => {
            if (data['IsValid']) {
              resolve(
                !isNaN(data['ResultData']['Total'])
                  ? parseInt(data['ResultData']['Total'])
                  : 0
              );
            } else {
              reject(0);
            }
          },
          (error) => {
            this.errorsAPI.push({
              message: `Error GetOutbounddocuments: ${DocumentType} ${JSON.stringify(
                body
              )}`,
              json: JSON.stringify(error),
            });
            reject(0);
          }
        );
    });
  }

  GetInbounddocuments(
    operatorvirtualId: string,
    body: any,
    DocumentType: string
  ) {
    body.DocumentTypes = [DocumentType];
    return new Promise<number>((resolve, reject) => {
      this._getGetDataPRD
        .GetInbounddocumentsNumber(body, operatorvirtualId)
        .subscribe(
          (data) => {
            if (data['IsValid']) {
              resolve(
                !isNaN(data['ResultData']['Total'])
                  ? parseInt(data['ResultData']['Total'])
                  : 0
              );
            } else {
              reject(0);
            }
          },
          (error) => {
            this.errorsAPI.push({
              message: `Error GetInbounddocuments: ${DocumentType} ${JSON.stringify(
                body
              )}`,
              json: JSON.stringify(error),
            });
            reject(0);
          }
        );
    });
  }

  GetPayroll(operatorvirtualId: string, body: any, DocumentType: string) {
    body.DocumentTypes = [DocumentType];
    return new Promise<number>((resolve, reject) => {
      this._getGetDataPRD.GetPayrollNumber(body, operatorvirtualId).subscribe(
        (data) => {
          if (data['IsValid']) {
            resolve(
              !isNaN(data['ResultData']['Total'])
                ? parseInt(data['ResultData']['Total'])
                : 0
            );
          } else {
            reject(0);
          }
        },
        (error) => {
          this.errorsAPI.push({
            message: `Error GetPayroll: ${DocumentType} ${JSON.stringify(
              body
            )}`,
            json: JSON.stringify(error),
          });
          reject(0);
        }
      );
    });
  }

  //Generar Top
  top_EmisionFE: Report_Documents_M_Empresa[] = [];
  top_EmisionDS: Report_Documents_M_Empresa[] = [];
  top_EmisionNE: Report_Documents_M_Empresa[] = [];
  top_RecepcionFE: Report_Documents_M_Empresa[] = [];
  top_EmisionFE_Aliados: Report_Documents_M_Empresa[] = [];
  top_EmisionDS_Aliados: Report_Documents_M_Empresa[] = [];
  top_EmisionNE_Aliados: Report_Documents_M_Empresa[] = [];
  top_RecepcionFE_Aliados: Report_Documents_M_Empresa[] = [];

  W_top_EmisionFE: Report_Documents_topWidgets[] = [];
  W_top_EmisionDS: Report_Documents_topWidgets[] = [];
  W_top_EmisionNE: Report_Documents_topWidgets[] = [];
  W_top_RecepcionFE: Report_Documents_topWidgets[] = [];
  W_top_EmisionFE_Aliados: Report_Documents_topWidgets[] = [];
  W_top_EmisionDS_Aliados: Report_Documents_topWidgets[] = [];
  W_top_EmisionNE_Aliados: Report_Documents_topWidgets[] = [];
  W_top_RecepcionFE_Aliados: Report_Documents_topWidgets[] = [];

  W_top_EmisionFE_total: number = 0;
  W_top_EmisionDS_total: number = 0;
  W_top_EmisionNE_total: number = 0;
  W_top_RecepcionFE_total: number = 0;
  W_top_EmisionFE_Aliados_total: number = 0;
  W_top_EmisionDS_Aliados_total: number = 0;
  W_top_EmisionNE_Aliados_total: number = 0;
  W_top_RecepcionFE_Aliados_total: number = 0;

  startDate_string = '';
  endDate_string = '';

  async OrderDescDocuments(documents: any[], filtro: string) {
    let newDocuments = documents.sort(function (a, b) {
      return b[filtro].Total - a[filtro].Total;
    });
    return newDocuments;
  }

  async GenerarTop() {
    this.at_moment.action = 3; //Generando Widgets

    //Top Emisión FE
    await this.OrderDescDocuments(
      this.Documents_M_Empresa,
      'Emision_Facturacion'
    );
    this.W_top_EmisionFE_total = await this.ArmarTop(
      this.Documents_M_Empresa,
      this.top_EmisionFE,
      'Emision_Facturacion'
    );

    //Top Emisión DS
    await this.OrderDescDocuments(
      this.Documents_M_Empresa,
      'Emision_DocumentoSoporte'
    );
    this.W_top_EmisionDS_total = await this.ArmarTop(
      this.Documents_M_Empresa,
      this.top_EmisionDS,
      'Emision_DocumentoSoporte'
    );

    //Top Emisión NE
    await this.OrderDescDocuments(this.Documents_M_Empresa, 'Emision_Nomina');
    this.W_top_EmisionNE_total = await this.ArmarTop(
      this.Documents_M_Empresa,
      this.top_EmisionNE,
      'Emision_Nomina'
    );

    //Top Recepcion FE
    await this.OrderDescDocuments(
      this.Documents_M_Empresa,
      'Recepcion_Facturacion'
    );
    this.W_top_RecepcionFE_total = await this.ArmarTop(
      this.Documents_M_Empresa,
      this.top_RecepcionFE,
      'Recepcion_Facturacion'
    );

    let Documents_M_Aliados: Report_Documents_M_Empresa[] = [];
    this.Documents_M_Empresa.reduce(function (res: any, value) {
      if (!res[value.Aliado]) {
        res[value.Aliado] = {
          Aliado: value.Aliado,
          Nombre: '',
          Nit: '',
          Email: '',
          Email_Financiero: '',
          Telefono: '',
          Emision_Facturacion: {
            SalesInvoice: 0,
            CreditNote: 0,
            DebitNote: 0,
            Total: 0,
          },
          Recepcion_Facturacion: {
            SalesInvoice: 0,
            CreditNote: 0,
            DebitNote: 0,
            Total: 0,
          },
          Emision_DocumentoSoporte: {
            SupportDocument: 0,
            SupportDocumentAdjustment: 0,
            Total: 0,
          },
          Emision_Nomina: {
            NominaIndividual: 0,
            NominaIndividualDeAjuste: 0,
            Total: 0,
          },
          Paquete_Plan_FE: {
            Name: '',
            ExpirationDate: '',
            RemainingDocuments: null,
          },
          Paquete_Plan_DS: {
            Name: '',
            ExpirationDate: '',
            RemainingDocuments: null,
          },
          Paquete_Plan_NE: {
            Name: '',
            ExpirationDate: '',
            RemainingDocuments: null,
          },
          Paquete_Plan_RE: {
            Name: '',
            ExpirationDate: '',
            RemainingDocuments: null,
          },
        };
        Documents_M_Aliados.push(res[value.Aliado]);
      }
      //Suma Emision FE
      res[value.Aliado].Emision_Facturacion.SalesInvoice +=
        value.Emision_Facturacion.SalesInvoice;
      res[value.Aliado].Emision_Facturacion.CreditNote +=
        value.Emision_Facturacion.CreditNote;
      res[value.Aliado].Emision_Facturacion.DebitNote +=
        value.Emision_Facturacion.DebitNote;
      res[value.Aliado].Emision_Facturacion.Total +=
        value.Emision_Facturacion.Total;

      //Suma Emision DS
      res[value.Aliado].Emision_DocumentoSoporte.SupportDocument +=
        value.Emision_DocumentoSoporte.SupportDocument;
      res[value.Aliado].Emision_DocumentoSoporte.SupportDocumentAdjustment +=
        value.Emision_DocumentoSoporte.SupportDocumentAdjustment;
      res[value.Aliado].Emision_DocumentoSoporte.Total +=
        value.Emision_DocumentoSoporte.Total;

      //Suma Emision NE
      res[value.Aliado].Emision_Nomina.NominaIndividual +=
        value.Emision_Nomina.NominaIndividual;
      res[value.Aliado].Emision_Nomina.NominaIndividualDeAjuste +=
        value.Emision_Nomina.NominaIndividualDeAjuste;
      res[value.Aliado].Emision_Nomina.Total += value.Emision_Nomina.Total;

      //Suma Recepcion FE
      res[value.Aliado].Recepcion_Facturacion.SalesInvoice +=
        value.Recepcion_Facturacion.SalesInvoice;
      res[value.Aliado].Recepcion_Facturacion.CreditNote +=
        value.Recepcion_Facturacion.CreditNote;
      res[value.Aliado].Recepcion_Facturacion.DebitNote +=
        value.Recepcion_Facturacion.DebitNote;
      res[value.Aliado].Recepcion_Facturacion.Total +=
        value.Recepcion_Facturacion.Total;
      return res;
    }, {});

    //Top Emision FE - Aliados
    await this.OrderDescDocuments(Documents_M_Aliados, 'Emision_Facturacion');
    this.W_top_EmisionFE_Aliados_total = await this.ArmarTop(
      Documents_M_Aliados,
      this.top_EmisionFE_Aliados,
      'Emision_Facturacion'
    );

    //Top Emisión DS - Aliados
    await this.OrderDescDocuments(
      Documents_M_Aliados,
      'Emision_DocumentoSoporte'
    );
    this.W_top_EmisionDS_Aliados_total = await this.ArmarTop(
      Documents_M_Aliados,
      this.top_EmisionDS_Aliados,
      'Emision_DocumentoSoporte'
    );

    //Top Emisión NE - Aliados
    await this.OrderDescDocuments(Documents_M_Aliados, 'Emision_Nomina');
    this.W_top_EmisionNE_Aliados_total = await this.ArmarTop(
      Documents_M_Aliados,
      this.top_EmisionNE_Aliados,
      'Emision_Nomina'
    );

    //Top Recepcion FE - Aliados
    await this.OrderDescDocuments(Documents_M_Aliados, 'Recepcion_Facturacion');
    this.W_top_RecepcionFE_Aliados_total = await this.ArmarTop(
      Documents_M_Aliados,
      this.top_RecepcionFE_Aliados,
      'Recepcion_Facturacion'
    );

    //Ordena por Aliado u OV
    this.Documents_M_Empresa.sort((a, b) => b.Aliado.localeCompare(a.Aliado));

    await this.GenerarTopWidgets();
    this.at_moment.action = 4; //Mostrar Resultados
  }

  async ArmarTop(
    documents: any[],
    top_documents: Report_Documents_M_Empresa[],
    type: string
  ) {
    let top_total: number = 0;
    for (let i = 0; i < documents.length; i++) {
      //Masificacion
      if (this.report_type === 2) {
        let find = this.listdist_Top.find(
          (x) =>
            x.Name.toLocaleLowerCase() ===
            documents[i].Aliado.toLocaleLowerCase()
        );
        if (find != undefined) {
          top_documents.push(documents[i]);
        }
      } else {
        top_documents.push(documents[i]);
      }
      top_total += documents[i][type].Total;
    }
    return top_total;
  }

  async ArmarTopWidget(
    topDocuments: any[],
    top_documents: any[],
    type: string
  ) {
    for (let i = 0; i < topDocuments.length; i++) {
      top_documents.push({
        Aliado_OV: topDocuments[i].Aliado,
        Nombre: topDocuments[i].Nombre,
        Nit: topDocuments[i].Nit,
        Total: topDocuments[i][type].Total,
      });

      if (top_documents.length >= 5) {
        break;
      }
    }
  }

  async GenerarTopWidgets() {
    //Widgets Aliados

    //Widget TOP Emision FE
    await this.ArmarTopWidget(
      this.top_EmisionFE,
      this.W_top_EmisionFE,
      'Emision_Facturacion'
    );

    //Widget TOP Emision DS
    await this.ArmarTopWidget(
      this.top_EmisionDS,
      this.W_top_EmisionDS,
      'Emision_DocumentoSoporte'
    );

    //Widget TOP Emision NE
    await this.ArmarTopWidget(
      this.top_EmisionNE,
      this.W_top_EmisionNE,
      'Emision_Nomina'
    );

    //Widget TOP Recepcion FE
    await this.ArmarTopWidget(
      this.top_RecepcionFE,
      this.W_top_RecepcionFE,
      'Recepcion_Facturacion'
    );

    //Widgets AEmpresas

    //Widget TOP Emision FE
    await this.ArmarTopWidget(
      this.top_EmisionFE_Aliados,
      this.W_top_EmisionFE_Aliados,
      'Emision_Facturacion'
    );

    //Widget TOP Emision DS
    await this.ArmarTopWidget(
      this.top_EmisionDS_Aliados,
      this.W_top_EmisionDS_Aliados,
      'Emision_DocumentoSoporte'
    );

    //Widget TOP Emision NE
    await this.ArmarTopWidget(
      this.top_EmisionNE_Aliados,
      this.W_top_EmisionNE_Aliados,
      'Emision_Nomina'
    );

    //Widget TOP Recepcion FE
    await this.ArmarTopWidget(
      this.top_RecepcionFE_Aliados,
      this.W_top_RecepcionFE_Aliados,
      'Recepcion_Facturacion'
    );

    //Fecha informe para Excel
    const format = 'ddMMyyyy';
    const locale = 'en-US';
    this.startDate_string = formatDate(this.start_report, format, locale);
    this.endDate_string = formatDate(this.end_report, format, locale);
  }
}
