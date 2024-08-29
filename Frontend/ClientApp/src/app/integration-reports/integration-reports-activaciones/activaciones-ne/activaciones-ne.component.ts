import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginI } from 'src/app/models/login.interface';
import { AlliesNames } from 'src/app/models/Reports/allies-names';
import { CreatePayrollOpp } from 'src/app/models/Reports/NE-activation-report/CreatePayrollOpp';
import { CreatePayrollProject } from 'src/app/models/Reports/NE-activation-report/CreatePayrollProject';
import { ReportsHistory_JsonNE } from 'src/app/models/Reports/reports-history';
import { ResponseI } from 'src/app/models/response.interface';
import { findvirtualoperatorI } from 'src/app/models/VirtualOperator/findvirtualoperator';
import { AuthService } from 'src/app/services/auth.service';
import { APIGetServicePRD } from 'src/app/services/SaphetyApi_PRD/apiget.service';
import { SearchCompanyPrdService } from 'src/app/services/SaphetyApi_PRD/search-company-prd.service';
import { APIGetServiceQA } from 'src/app/services/SaphetyApi_QA/apiget.service';
import { SearchCompanyQaService } from 'src/app/services/SaphetyApi_QA/search-company-qa.service';
import { DataElementsService } from 'src/app/services/UtilidadesAPI/data-elements.service';
import { ReportsHistoryService } from 'src/app/services/UtilidadesAPI/reports-history.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { WD_struct } from '../activaciones-widgets/activaciones-widgets.component';
import { IntegrationReportsDialogComponent } from '../../integration-reports-dialog/integration-reports-dialog.component';
import { CompanySaphetyI } from 'src/app/models/Company/Company';
import { Voperator } from 'src/app/models/vo';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';

interface errorsAPI {
  message: string;
  json: string;
}

interface CompaniesReported_SalesForce {
  date_activation: Date;
  document_number: string;
  report_type: string;
  user: string;
}

interface companiesFinal_Saphety {
  DocumentType: string;
  DocumentNumber: string;
  CheckDigit: string;
  Name: string;
  Alias_opv: string;
  Name_opv: string;
}

@Component({
  selector: 'app-activaciones-ne',
  templateUrl: './activaciones-ne.component.html',
  styleUrls: ['./activaciones-ne.component.scss'],
})
export class ActivacionesNEComponent implements OnInit {
  opvs_QA: Voperator[] = [];
  opvs_PRD: Voperator[] = [];
  opv_Not_Apply = 'saphety';
  AlliesNames_List: Array<AlliesNames> = []; //Lista de valores de Aliados

  companies_NE_Act: companiesFinal_Saphety[] = []; //Empreas obtenidas API Saphety
  newCompanies_NE: companiesFinal_Saphety[] = []; //Nuevas empresas activas en NE

  errorsAPI: Array<errorsAPI> = [];

  ambient = '';
  actually_action: { ambient: string; action: string } = {
    ambient: '',
    action: '',
  }; //Acción que se está ejecutando actualmente para vista
  Getting_data: boolean = true; //Indica si se están obteniendo datos de inicio
  Getting_data_errors: string[] = []; //Errores al obtener data

  running_report: boolean = false; //Indica si se está ejecutando informe
  end_report: boolean = false; //Indica si el informe ya fue ejecutado

  Companies_reported_Salesforce_NE_List: CompaniesReported_SalesForce[] = []; //Empresas reportadas en SalesForce
  Last_time_activationsReport_generation_NE: Date = new Date(); //Ultima vez que se generó reporte

  //Widgets Data
  WD_total_companies_SalesForce: number = 0;
  WD_company_count: WD_struct[] = [];
  WD_company_money: WD_struct[] = [];
  WD_report_history: { last: string; now: string; value: string } = {
    last: '',
    now: '',
    value: '',
  };

  //Armado tablas
  ReportNE_SalesPerson: string = '';
  ReportNE_OWNER: string = '';
  ReportNE_OPNAME_Text: string = '';
  ReportNE_PNAME_Text: string = '';

  CreatePayrollOpp_Table: CreatePayrollOpp[] = []; //Opp
  CreatePayrollProject_Table: CreatePayrollProject[] = []; //Project

  constructor(
    public _dialog: MatDialog,
    private _reportsHistoryU: ReportsHistoryService,
    private _dataElementsU: DataElementsService,
    private _toastProvider: ToastProvider,
    private _getGetDataQA: APIGetServiceQA,
    private _getGetDataPRD: APIGetServicePRD,
    private _auth: AuthService,
    private _SearchCompanyQA: SearchCompanyQaService,
    private _SearchCompanyPRD: SearchCompanyPrdService,
    private _datePipe: DatePipe
  ) {
    let ambiente = localStorage.getItem('ambient');
    this.ambient = ambiente != undefined ? ambiente : '';
  }

  async ngOnInit() {
    await this.awaitDataElements();
  }

  async awaitDataElements() {
    this.Getting_data_errors = [];
    //Obtiene Tabla de compañías ya reconocidas de UtilidadesAPI
    await this._reportsHistoryU
      .GetCompaniesReportedSalesforce_ByType('payroll_activations')
      .then((result) => {
        this.Companies_reported_Salesforce_NE_List = JSON.parse(
          JSON.stringify(result)
        );
      })
      .catch((error) => this.Getting_data_errors.push(JSON.stringify(error)));
    //Obtiene Fecha ultima generación de informe de UtilidadesAPI
    await this._dataElementsU
      .getDdataelementU('Last_time_activationsReport_generation_NE')
      .then((result) => {
        this.Last_time_activationsReport_generation_NE = JSON.parse(
          result.json
        );
      })
      .catch((error) => this.Getting_data_errors.push(JSON.stringify(error)));

    if (this.Getting_data_errors.length === 0) {
      this.Getting_data = false;
    }
  }

  //Obtiene Token para QA
  GetToken_QA() {
    return new Promise((resolve, reject) => {
      var body: LoginI = {
        userName: GlobalConstants.userQA,
        password: GlobalConstants.passwordQA,
        virtual_operator: '',
      };
      this._auth.GetToken(body, 'QA').subscribe(
        (data) => {
          let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
          if (dataRespomnsive.IsValid) {
            resolve(dataRespomnsive.ResultData.access_token.toString());
          } else {
            reject(data['ResultData']);
          }
        },
        (error) => {
          reject(error['error']);
        }
      );
    });
  }

  //Espera a que termine de obtener operadores virtuales
  async awaitVirtualOperators() {
    await this.getVirtualOperators_PRD().catch((result) => {
      this.errorsAPI.push({
        message: `Ocurrió un error al obtener los operadores virtuales PRD`,
        json: JSON.stringify(result),
      });

      this._toastProvider.dangerMessage(
        `Ocurrió un error al obtener los operadores virtuales PRD: ${JSON.stringify(
          result
        )}`
      );
      return;
    });
    //Se obtiene tokken de usuario QA.
    /* await this.GetToken_QA()
      .then((tokenQA) => {
        //Asigno nuevo token QA
        GlobalConstants.tokenUserQA = String(tokenQA);
      })
      .catch((result) => {
        this.errorsAPI.push({
          message: `Ocurrió un error al obtener token usuario QA`,
          json: JSON.stringify(result),
        });

        return;
      });

    await this.getVirtualOperators_QA().catch((result) => {
      this.errorsAPI.push({
        message: `Ocurrió un error al obtener los operadores virtuales QA`,
        json: JSON.stringify(result),
      });

      this._toastProvider.dangerMessage(
        `Ocurrió un error al obtener los operadores virtuales QA:
        ${JSON.stringify(result)}`
      );
      return;
    }); */
  }

  //Operadores virtuales PRD
  getVirtualOperators_PRD() {
    return new Promise((resolve, reject) => {
      this.actually_action = {
        ambient: 'Producción (PRD)',
        action: 'Obteniendo lista de operadores Virtuales',
      };
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
            //Agrego operadores a lista
            operadores.forEach((x) =>
              this.opvs_PRD.push({ Id: x.Id, Alias: x.Alias, Name: x.Name })
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
    });
  }

  //Operadores virtuales QA
  getVirtualOperators_QA() {
    return new Promise((resolve, reject) => {
      this.actually_action = {
        ambient: 'Pruebas (QA)',
        action: 'Obteniendo lista de operadores Virtuales',
      };
      let body: findvirtualoperatorI = {
        Id: '',
        SortField: '-CreationDate',
        Alias: '',
      };
      this._getGetDataQA.GetVirtualOperators_QA(body).subscribe(
        (data) => {
          let dataRespomnsive: ResponseI = JSON.parse(JSON.stringify(data));
          if (dataRespomnsive?.IsValid) {
            let operadores: Voperator[] = JSON.parse(
              JSON.stringify(dataRespomnsive?.ResultData)
            );
            //Agrego operadores a lista
            operadores.forEach((x) =>
              this.opvs_QA.push({ Id: x.Id, Alias: x.Alias, Name: x.Name })
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
    });
  }

  //Pregunta ejecutar reporte
  want_Run_Report() {
    const dialog = this._dialog.open(IntegrationReportsDialogComponent, {
      width: '450px',
      data: {
        titulo: `Generar informe Activaciones NE`,
        mensaje: `¿Desea generar informe Activaciones Nómina Electrónica?`,
        respuesta: false,
      },
    });

    dialog.afterClosed().subscribe(async (resp) => {
      if (!resp.respuesta) {
        this._toastProvider.infoMessage('Se canceló la operación.');
        this.running_report = false;
        this.end_report = false;
      } else {
        this.Run_Report();
      }
    });
  }

  //Ejecuta reporte
  async Run_Report() {
    let general_result = true;
    this.running_report = true;
    await this.awaitVirtualOperators().catch(() => {
      general_result = false;
      return;
    });

    //Detiene
    if (!general_result) {
      return;
    }

    //Obtiene Reports_AlliesNames de UtilidadesAPI
    await this._dataElementsU
      .getDdataelementU('Reports_AlliesNames')
      .then((result) => {
        //Desde servicio Utilidades
        this.AlliesNames_List = JSON.parse(result.json);
      })
      .catch((error) => {
        this.errorsAPI.push({
          message: `Ocurrió un error al obtener lista de Valores Aliados`,
          json: JSON.stringify(error),
        });
        general_result = false;
        return;
      });

    //Detiene
    if (!general_result) {
      return;
    }

    //Obtiene ReportNE_SalesPerson de UtilidadesAPI
    await this._dataElementsU
      .getDdataelementU('ReportNE_SalesPerson')
      .then((result) => {
        //Desde servicio Utilidades
        this.ReportNE_SalesPerson = result.json;
      })
      .catch((error) => {
        this.errorsAPI.push({
          message: `Ocurrió un error al obtener ReportNE_SalesPerson`,
          json: JSON.stringify(error),
        });
        general_result = false;
        return;
      });

    //Detiene
    if (!general_result) {
      return;
    }

    //Obtiene ReportNE_OWNER de UtilidadesAPI
    await this._dataElementsU
      .getDdataelementU('ReportNE_OWNER')
      .then((result) => {
        //Desde servicio Utilidades
        this.ReportNE_OWNER = result.json;
      })
      .catch((error) => {
        this.errorsAPI.push({
          message: `Ocurrió un error al obtener ReportNE_OWNER`,
          json: JSON.stringify(error),
        });
        general_result = false;
        return;
      });

    //Detiene
    if (!general_result) {
      return;
    }

    //Obtiene ReportNE_OPNAME_Text de UtilidadesAPI
    await this._dataElementsU
      .getDdataelementU('ReportNE_OPNAME_Text')
      .then((result) => {
        //Desde servicio Utilidades
        this.ReportNE_OPNAME_Text = result.json;
      })
      .catch((error) => {
        this.errorsAPI.push({
          message: `Ocurrió un error al obtener ReportNE_OPNAME_Text`,
          json: JSON.stringify(error),
        });
        general_result = false;
        return;
      });

    //Detiene
    if (!general_result) {
      return;
    }

    //Obtiene ReportNE_PNAME_Text de UtilidadesAPI
    await this._dataElementsU
      .getDdataelementU('ReportNE_PNAME_Text')
      .then((result) => {
        //Desde servicio Utilidades
        this.ReportNE_PNAME_Text = result.json;
      })
      .catch((error) => {
        this.errorsAPI.push({
          message: `Ocurrió un error al obtener ReportNE_PNAME_Text`,
          json: JSON.stringify(error),
        });
        general_result = false;
        return;
      });

    //Detiene
    if (!general_result) {
      return;
    }

    //Get Companies PRD
    await Promise.all(
      this.opvs_PRD.map(async (opv) => {
        await this.SearhCompanies_PRD(opv).catch(() => {
          general_result = false;
          return;
        });
      })
    );

    //Detiene
    if (!general_result) {
      return;
    }

    //Get Companies QA
    /*  await Promise.all(
      this.opvs_QA.map(async (opv) => {
        await this.SearhCompanies_QA(opv).catch(() => {
          console.log(`Ocurrió un error al obtener compañías en QA`);
          general_result = false;
          return;
        });
      })
    ); */

    //Detiene
    if (!general_result) {
      return;
    }

    //Cruza compañías de SaphetyAPI vs TablaMaestra
    this.newCompanies_NE = [];
    await Promise.all(
      this.companies_NE_Act.map(async (result) => {
        let find = this.Companies_reported_Salesforce_NE_List.find(
          (x) => x.document_number == result.DocumentNumber
        );
        if (find === undefined) {
          this.newCompanies_NE.push(result);
        }
      })
    );

    this.actually_action = {
      ambient: 'N/A',
      action: 'Validando datos Obtenidos.',
    };

    await this.BuildWidgets();
    await this.BuildTables();

    this.actually_action = { ambient: '*', action: 'Finalizó con éxito.' };

    this.running_report = this.errorsAPI.length > 0 ? true : false;
    this.end_report = this.errorsAPI.length > 0 ? false : true;
  }

  // Función para calcular los días transcurridos entre dos fechas
  restaFechas = function (f1: string, f2: string) {
    if (f1 === '' || f2 === '') {
      return 0;
    }
    var aFecha1 = f1.split('/');
    var aFecha2 = f2.split('/');
    var fFecha1 = Date.UTC(
      Number(aFecha1[2]),
      Number(aFecha1[1]) - 1,
      Number(aFecha1[0])
    );
    var fFecha2 = Date.UTC(
      Number(aFecha2[2]),
      Number(aFecha2[1]) - 1,
      Number(aFecha2[0])
    );
    var dif = fFecha2 - fFecha1;
    var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    return dias;
  };

  //Construye data para Widgets
  async BuildWidgets() {
    this.WD_total_companies_SalesForce =
      this.Companies_reported_Salesforce_NE_List.length;

    try {
      let now = this._datePipe.transform(new Date(), 'dd/MM/yyyy');
      let last = this._datePipe.transform(
        this.Last_time_activationsReport_generation_NE,
        'dd/MM/yyyy'
      );
      let days = this.restaFechas(
        last === null ? '' : last,
        now === null ? '' : now
      );

      this.WD_report_history = {
        last: last === null ? '' : `Última: ${last}`,
        now: now === null ? '' : `Actual: ${now}`,
        value: `${days} Días`,
      };
    } catch {}

    //Arma data
    await Promise.all(
      this.newCompanies_NE.map(async (company) => {
        //Activaciones Número
        const found = this.WD_company_count.find(
          (x) =>
            x.name.toLocaleLowerCase() == company.Alias_opv.toLocaleLowerCase()
        );
        if (found === undefined) {
          this.WD_company_count.push({
            name: company.Alias_opv.toLocaleLowerCase(),
            value: 1,
          });
        } else {
          let indexof = this.WD_company_count.indexOf(found);
          this.WD_company_count.splice(indexof, 1);
          found.value++;
          this.WD_company_count.push(found);
        }

        //Activaciones Dinero
        const foundMoney = this.WD_company_money.find(
          (x) =>
            x.name.toLocaleLowerCase() == company.Alias_opv.toLocaleLowerCase()
        );
        let valor_Aliado = this.AlliesNames_List.find(
          (x) =>
            x.OV_Name.toLocaleLowerCase() ==
            company.Alias_opv.toLocaleLowerCase()
        );
        if (foundMoney === undefined) {
          this.WD_company_money.push({
            name: company.Alias_opv.toLocaleLowerCase(),
            value:
              valor_Aliado === undefined
                ? 0
                : valor_Aliado.PayRoll_Activation_Value,
          });
        } else {
          let indexof = this.WD_company_money.indexOf(foundMoney);
          this.WD_company_money.splice(indexof, 1);
          (foundMoney.value =
            valor_Aliado === undefined
              ? foundMoney.value
              : Number(foundMoney.value) +
                Number(valor_Aliado.PayRoll_Activation_Value)),
            this.WD_company_money.push(foundMoney);
        }
      })
    );

    //Ordena OV alfabeticamente
    this.WD_company_count.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    this.WD_company_money.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  //Retorna texto de Project u Opp
  ProjectOppLength(i: number, isProject: boolean, maxLength: number): string {
    let toreturn = '';
    if (isProject) {
      let part1 = `${this.ReportNE_PNAME_Text}${this.newCompanies_NE[i].Alias_opv.toUpperCase()}_`;
      let part2 = `_${this.newCompanies_NE[i].DocumentType}_${this.newCompanies_NE[i].DocumentNumber}`;

      //Si quedan menos de 28 caracteres para nombre, corta alias OV
      let sobrante = maxLength - (part1.length + part2.length);
      if(sobrante < 28){
        let Alias_opv = this.newCompanies_NE[i].Alias_opv.substring(0,this.newCompanies_NE[i].Alias_opv.length > 15 ? 15 : this.newCompanies_NE[i].Alias_opv.length);
        part1 = `${this.ReportNE_PNAME_Text}${Alias_opv.toUpperCase()}_`;
        sobrante = maxLength - (part1.length + part2.length);
      }

      let nameCompany = this.newCompanies_NE[i].Name.substring(0, this.newCompanies_NE[i].Name.length > sobrante ? sobrante : this.newCompanies_NE[i].Name.length);
      toreturn = `${part1}${nameCompany}${part2}`;
    } else {
      let part1 = this.ReportNE_OPNAME_Text;
      let part2 = `_${this.newCompanies_NE[i].DocumentType}_${this.newCompanies_NE[i].DocumentNumber}_${this.newCompanies_NE[i].Alias_opv.toUpperCase()}`;

      //Si quedan menos de 68 caracteres para nombre, corta alias OV
      let sobrante = maxLength - (part1.length + part2.length);
      if(sobrante < 68){
        let Alias_opv = this.newCompanies_NE[i].Alias_opv.substring(0,this.newCompanies_NE[i].Alias_opv.length > 15 ? 15 : this.newCompanies_NE[i].Alias_opv.length);
        part2 = `_${this.newCompanies_NE[i].DocumentType}_${this.newCompanies_NE[i].DocumentNumber}_${Alias_opv.toUpperCase()}`;
        sobrante = maxLength - (part1.length + part2.length);
      }
      let nameCompany = this.newCompanies_NE[i].Name.substring(0, this.newCompanies_NE[i].Name.length > sobrante ? sobrante : this.newCompanies_NE[i].Name.length);
      toreturn = `${part1}${nameCompany}${part2}`;
    }
    return toreturn;
  }

  //Data para Tablas y exportacion
  async BuildTables() {
    let fechaInforme = new Date();

    //Arma data CreatePayrollOpp
    this.CreatePayrollOpp_Table = [];
    for (let i = 0; i < this.newCompanies_NE.length; i++) {
      let valor_Aliado = this.AlliesNames_List.find(
        (x) =>
          x.OV_Name.toLocaleLowerCase() ==
          this.newCompanies_NE[i].Alias_opv.toLocaleLowerCase()
      );

      let newOpp: CreatePayrollOpp = {
        'OV.Column1.Name': this.newCompanies_NE[i].Name_opv,
        'OPPORTUNITY NAME': this.ProjectOppLength(i,false,120),
        'Column1.Identification.DocumentNumber':
          this.newCompanies_NE[i].DocumentNumber,
        PRICE:
          valor_Aliado === undefined
            ? Number(0)
            : Number(valor_Aliado.PayRoll_Activation_Value),
        'CLOSE DATE': new Date(fechaInforme),
        'SALES PERSON': this.ReportNE_SalesPerson,
      };
      this.CreatePayrollOpp_Table.push(newOpp);
    }

    //Arma data CreatePayrollProject
    this.CreatePayrollProject_Table = [];
    for(let i = 0; i<this.newCompanies_NE.length; i++){
      let newProject: CreatePayrollProject = {
        'OPPORTUNITY NAME': this.ProjectOppLength(i,false,120),
        'PROJECT NAME': this.ProjectOppLength(i,true,80),
        OWNER: this.ReportNE_OWNER,
        KICKOFF: new Date(fechaInforme),
        BASELINE: new Date(fechaInforme),
        NEWDELIVERY: new Date(fechaInforme),
        'ACTUAL DELIVERY': new Date(fechaInforme),
        '% Excecution': 100,
        'Project Type': 'ActivacionNE',
      };
      this.CreatePayrollProject_Table.push(newProject);
    }

    //Guarda reporte DB
    await this.SaveReport()
      .then(async () => {
        //Actualiza tabla maestra compañías ya reportadas
        await this.UpdateCompanies_reported_Salesforce_NE();
        //Actualiza fecha ultima de generación informe
        await this.UpdateLastTime_Report();

        this._toastProvider.successMessage(
          `Se guardó informe en Base de Datos Correctamente.`
        );
      })
      .catch(() => {
        this._toastProvider.dangerMessage(
          `Ocurrió un error al intentar guardar informe en Base de Datos, por favor genere el informe nuevamente`
        );
      });
  }

  showLog() {
    console.log('Errores:');
    console.log(this.errorsAPI);
  }

  //Obtener listado compañías PRD
  SearhCompanies_PRD(VirtualOperator: Voperator) {
    return new Promise(async (resolve, reject) => {
      await this._SearchCompanyPRD
        .SearchCompanies_WithoutFilter(VirtualOperator.Alias)
        .then(async (data) => {
          if (VirtualOperator.Alias !== this.opv_Not_Apply) {
            this.actually_action = {
              ambient: 'Producción (PRD)',
              action: `Obteniendo compañías operador: ${VirtualOperator.Name}`,
            };
            await Promise.all(
              data.map(async (companyPRD) => {
                this.SearhCompanies_Response(companyPRD, VirtualOperator);
              })
            );
          }

          resolve(true);
        })
        .catch((error) => {
          this.errorsAPI.push({
            message: `Ocurrió un error al obtener empresas PRD: ${VirtualOperator.Name}`,
            json: JSON.stringify(error),
          });
          reject();
        });
    });
  }

  //Obtener listado compañías QA
  SearhCompanies_QA(VirtualOperator: Voperator) {
    return new Promise(async (resolve, reject) => {
      await this._SearchCompanyQA
        .SearchCompanies_WithoutFilter(VirtualOperator.Alias)
        .then(async (data) => {
          if (VirtualOperator.Alias !== this.opv_Not_Apply) {
            this.actually_action = {
              ambient: 'Pruebas (QA)',
              action: `Obteniendo compañías operador: ${VirtualOperator.Name}`,
            };

            await Promise.all(
              data.map(async (companyQA) => {
                this.SearhCompanies_Response(companyQA, VirtualOperator);
              })
            );
          }
          resolve(true);
        })
        .catch((error) => {
          this.errorsAPI.push({
            message: `Ocurrió un error al obtener empresas QA: ${VirtualOperator.Name}`,
            json: JSON.stringify(error),
          });
          reject();
        });
    });
  }

  SearhCompanies_Response(
    company: CompanySaphetyI,
    VirtualOperator: Voperator
  ) {
    let find = this.companies_NE_Act.find(
      (x) => x.DocumentNumber == company.Identification.DocumentNumber
    );
    //Solo agrega empresa a lista si tiene NE activo y no existe en listado
    if (company.PayrollIssuingServiceActive && find === undefined) {
      let company_final: companiesFinal_Saphety = {
        DocumentType: company.Identification.DocumentType,
        DocumentNumber: company.Identification.DocumentNumber,
        CheckDigit: company.Identification.CheckDigit,
        Name: company.Name,
        Alias_opv: VirtualOperator.Alias,
        Name_opv: VirtualOperator.Name,
      };
      this.companies_NE_Act.push(company_final);
    } else {
      //console.log(`Ya existe compañía: ${companyQA.Name} ${companyQA.Identification.DocumentNumber}`);
    }
  }

  //Actualiza fecha ultima generación Informe
  async UpdateLastTime_Report() {
    await this._dataElementsU.updateLast_time_activationsReport_generation_NE(
      new Date()
    );
  }

  //Actualiza Tabla maestra de compañías ya reportadas a SalesForce
  async UpdateCompanies_reported_Salesforce_NE() {
    let fechaInforme = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0
    );

    const newCompanies_reported_Salesforce_NE: CompaniesReported_SalesForce[] =
      [];

    let userfullname = localStorage.getItem('userfullname');
    await Promise.all(
      this.newCompanies_NE.map(async (company) => {
        newCompanies_reported_Salesforce_NE.push({
          date_activation: fechaInforme,
          document_number: company.DocumentNumber,
          report_type: 'payroll_activations',
          user: userfullname != undefined ? userfullname : '',
        });
      })
    );
    await this._reportsHistoryU.NewCompaniesReportedSalesforce(
      newCompanies_reported_Salesforce_NE
    );
  }

  async SaveReport() {
    //company_money
    let totalMoney = 0;
    await Promise.all(
      this.WD_company_money.map(async (company) => {
        totalMoney = Number(totalMoney) + Number(company.value);
      })
    );

    let json: ReportsHistory_JsonNE = {
      jsonOPP: JSON.stringify(this.CreatePayrollOpp_Table),
      jsonPROJECT: JSON.stringify(this.CreatePayrollProject_Table),
    };

    let userfullname = localStorage.getItem('userfullname');

    await this._reportsHistoryU.NewReportsHistory({
      date: new Date(),
      user: userfullname != undefined ? userfullname : '',
      report_type: 'payroll_activations',
      reportTypeNumber: 2,
      json: JSON.stringify(json),
      new_companies: this.newCompanies_NE.length,
      new_money: totalMoney,
    });
  }
}
