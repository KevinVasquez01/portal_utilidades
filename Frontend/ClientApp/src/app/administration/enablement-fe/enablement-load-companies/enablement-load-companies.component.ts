import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';
import { CompanySaphetyI } from 'src/app/models/Company/Company';
import {
  Enablement_Companies,
  Enablement_Companies_Excel,
  logs_enablement,
} from 'src/app/models/Enablement/Enablement';
import {
  SeriesHDian,
  SeriesHDian_Response,
} from 'src/app/models/SeriesHDian/SeriesHDian';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { SearchCompanyPrdService } from 'src/app/services/SaphetyApi_PRD/search-company-prd.service';
import { SearchPlanPaquetePRDService } from 'src/app/services/SaphetyApi_PRD/search-plan-paquete..service';
import { SerieHDianPRDService } from 'src/app/services/SaphetyApi_PRD/serie-habilitacion-dian-prd.service.service';
import { SearchCompanyQaService } from 'src/app/services/SaphetyApi_QA/search-company-qa.service';
import { SearchPlanPaqueteServiceQA } from 'src/app/services/SaphetyApi_QA/search-plan-paquete.service';
import { SerieHDianService } from 'src/app/services/SaphetyApi_QA/serie-habilitacion-dian.service';
import * as XLSX from 'xlsx';
import { ExportService } from '../../export.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-enablement-load-companies',
  templateUrl: './enablement-load-companies.component.html',
  styleUrls: ['./enablement-load-companies.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EnablementLoadCompaniesComponent {
  companies_excel: Array<Enablement_Companies_Excel> = []; //Excel cargado por usuario
  companies_to_enablement: Array<Enablement_Companies> = []; //Compañías que serán habilitadas
  companies_log_result: Array<Enablement_Companies> = []; //Compañías con errores

  @Output() companies_for_enablement: EventEmitter<Array<Enablement_Companies>> = new EventEmitter(); //Enviar compañías a componente habilitación

  ambiente = '';
  loading = false;

  example_template: Array<Enablement_Companies_Excel> = [
    {
      Alias_Operador_Virtual: 'saphety',
      Nit: 900900900,
      TestSetId: 'abcdfg123456789',
    },
  ];

  dataSource = this.companies_to_enablement;
  columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  expandedElement: Enablement_Companies | null = null;

  constructor(
    private _toastProvider: ToastProvider,
    private _export: ExportService,
    private _SearchCompanyQA: SearchCompanyQaService,
    private _SearchCompanyPRD: SearchCompanyPrdService,
    private _seriesHDian_QAService: SerieHDianService,
    private _seriesHDian_PRDService: SerieHDianPRDService,
    private _planopaqueteQA: SearchPlanPaqueteServiceQA,
    private _planopaquetePRD: SearchPlanPaquetePRDService

  ) {
    let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '';
  }

  async selectFile(event: any) {
    this.loading = true;
    if (event.target.files.length < 1) {
      return;
    }

    this.companies_excel = [];
    this.companies_to_enablement = [];
    this.companies_log_result = [];

    await this.load_excel(event)
    .finally(async () => {
      if (this.companies_excel.length > 0) {
        await this.load_companies();
      }
      else{
        this.companies_log_result = [];
      }
    });
    this.loading = false;
  }

  load_excel(event: any) {
    return new Promise((resolve, reject) => {
      this.companies_excel = [];
      try {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>event.target;
        const reader: FileReader = new FileReader();
        reader.readAsBinaryString(target.files[0]);
        reader.onload = (e: any) => {
          /* create workbook */
          const binarystr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

          /* selected the first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          /* save data */
          this.companies_excel =
            XLSX.utils.sheet_to_json<Enablement_Companies_Excel>(ws);

          resolve(true);
        };
      } catch {
        reject();
      }
    });
  }

  async load_companies() {
    this.companies_to_enablement = [];
    let error = false;
    await Promise.all(
      this.companies_excel.map(async (comp_excel) => {
        try{
          let company_enablement = await this.search_Company(
            comp_excel.Alias_Operador_Virtual,
            comp_excel.Nit.toString(),
            comp_excel
          );
          this.companies_to_enablement.push(company_enablement);
        }
        catch{
          this._toastProvider.cautionMessage(
            `El formato del archivo Excel es incorrecto, por favor corríjalo e intente nuevamente.`
          );
          this.companies_to_enablement = [];
          this.loading = false;
          error = true;
        }
      })
    );

    if(error){
      return;
    }

    //Fecha serieH
    const format = 'yyyyMMddHHmmss';
    const locale = 'en-US';
    let serieHDate = formatDate(new Date(), format, locale);

    await Promise.all(
      this.companies_to_enablement.map(async (company) => {
        let serieH: SeriesHDian = new SeriesHDian();
        serieH.Name = `${serieH.Name}_PU_${serieHDate}`;
        serieH.TestSetId = company.company_excel.TestSetId;

        let companyId = company.company_saphety?.Id;
        if (companyId != undefined) {
          //Busca serie de Habilitacion para crear en caso se no serie con TestSetId cargado en Excel
          await this.search_Serie_H(
            company.company_excel.Alias_Operador_Virtual,
            companyId,
            serieH,
            company
          )
          .then((serie_HDian)=>{
            company.serie_H_saphety = serie_HDian;
          });
        }
      })
    );

    this.companies_log_result = this.companies_to_enablement.filter(x=> x.general_result === false);
    this.companies_for_enablement.emit(this.companies_to_enablement.filter(x=> x.general_result === true));
  }

  exportExcel_Example(): void {
    //Ejemplo
    this._export.exportAsExcelFile(
      this.example_template,
      'Compañias_Habilitacion_Ejemplo'
    );
  }

  search_Company(
    Alias_Operador_Virtual: string,
    Nit: string,
    comp_excel: Enablement_Companies_Excel
  ) {
    return new Promise<Enablement_Companies>(async (resolve) => {
      let company_enablement: Enablement_Companies = {
        company_excel: comp_excel,
        log: [],
        general_result: false,
      };

      if (this.ambiente == 'PRD') {
        await this._SearchCompanyPRD
          .SearchCompanies(Alias_Operador_Virtual, Nit, '')
          .then(async (data) => {
            let arrayresult: CompanySaphetyI[] = JSON.parse(
              JSON.stringify(data)
            );
            if (arrayresult.length > 0) {
              company_enablement.company_saphety = arrayresult[0];
              company_enablement.general_result = true;

              let planopaquete = await this._planopaquetePRD.searchPlanorPackageFV(arrayresult[0].VirtualOperatorId || '', arrayresult[0].Id);
              if(planopaquete != undefined){
                company_enablement.planopaquete = { createdPU: false, name: planopaquete[0]?.['Name'] || '', id: planopaquete[0]?.['Id'] || ''};
              }
            } else {
              let log: logs_enablement = {
                date: new Date(),
                module: 'Buscar Compañía',
                message: 'Compañía no encontrada',
                status: false,
              };
              company_enablement.log.push(log);
              company_enablement.general_result = false;
            }
          })
          .catch((error) => {
            let log: logs_enablement = {
              date: new Date(),
              module: 'Buscar Compañía',
              message: JSON.stringify(error['Errors']),
              status: false,
            };
            company_enablement.log.push(log);
            company_enablement.general_result = false;
          })
          .finally(() => {
            resolve(company_enablement);
          });
      } else if (this.ambiente == 'QA') {
        await this._SearchCompanyQA
          .SearchCompanies(
            comp_excel.Alias_Operador_Virtual,
            comp_excel.Nit.toString(),
            ''
          )
          .then(async (data) => {
            let arrayresult: CompanySaphetyI[] = JSON.parse(
              JSON.stringify(data)
            );
            if (arrayresult.length > 0) {
              company_enablement.company_saphety = arrayresult[0];
              company_enablement.general_result = true;

              let planopaquete = await this._planopaqueteQA.searchPlanorPackageFV(arrayresult[0].VirtualOperatorId || '', arrayresult[0].Id);
              if(planopaquete != undefined){
                company_enablement.planopaquete = { createdPU: false, name: planopaquete[0]?.['Name'] || '', id: planopaquete[0]?.['Id'] || ''};
              }
            } else {
              let log: logs_enablement = {
                date: new Date(),
                module: 'Buscar Compañía',
                message: 'Compañía no encontrada',
                status: false,
              };
              company_enablement.log.push(log);
              company_enablement.general_result = false;
            }
          })
          .catch((error) => {
            let log: logs_enablement = {
              date: new Date(),
              module: 'Buscar Compañía',
              message: JSON.stringify(error['Errors']),
              status: false,
            };
            company_enablement.log.push(log);
            company_enablement.general_result = false;
          })
          .finally(() => {
            resolve(company_enablement);
          });
      }
    });
  }

  search_Serie_H(
    Alias_Operador_Virtual: string,
    CompanyId: string,
    serieH: SeriesHDian,
    company_enablement: Enablement_Companies
  ) {
    return new Promise<SeriesHDian_Response>(async (resolve, reject) => {
      if (this.ambiente == 'PRD') {
        //Busca serie de Habilitación en PRD
        await this._seriesHDian_PRDService
          .SearchSerieHD(Alias_Operador_Virtual, CompanyId)
          .then(async (result) => {
            let seriesH: Array<SeriesHDian_Response> = JSON.parse(
              JSON.stringify(result)
            );
            let found = seriesH.find(
              (x) =>
                x.TestSetId.toLowerCase() ===
                serieH.TestSetId.toLocaleLowerCase()
            );
            if (found == undefined) {
              //crea series de Habilitacion en PRD
              await this._seriesHDian_PRDService
                .createSerieD(serieH, Alias_Operador_Virtual, CompanyId)
                .then(async () => {
                  await this._seriesHDian_PRDService
                  .SearchSerieHD(Alias_Operador_Virtual, CompanyId)
                  .then(async (newresult) => {
                    let seriesH1: Array<SeriesHDian_Response> = JSON.parse(
                      JSON.stringify(newresult)
                    );
                    let found1 = seriesH1.find(
                      (x) =>
                        x.TestSetId.toLowerCase() ===
                        serieH.TestSetId.toLocaleLowerCase()
                    );

                    if(found1 != undefined){
                      await this.add_log(
                        'Crear Serie Habilitación',
                        `Serie de habilitación creada con éxito. ExternalKey: ${found1.ExternalKey}`,
                        true,
                        company_enablement
                      );
                      resolve(found1);
                    }
                    else{
                      await this.add_log(
                        'Obtener Serie Habilitación',
                        `Error al obtener serie de habilitación`,
                        false,
                        company_enablement
                      );
                      reject()
                    }
                  })
                  .catch(async (error)=>{
                    await this.add_log(
                      'Crear Serie Habilitación',
                      `Error: ${JSON.stringify(error)}`,
                      false,
                      company_enablement
                    );
                  });
                })
                .catch(async (error) => {
                  await this.add_log(
                    'Crear Serie Habilitación',
                    `Error: ${JSON.stringify(error)}`,
                    false,
                    company_enablement
                  ).finally(()=>{
                    this._toastProvider.dangerMessage(
                      `Ocurrió un error al intentar Crear Serie Habilitación en ambiente PRD: ${JSON.stringify(error)}`
                    );
                    this.loading = false;
                    reject();
                  });
                });
            }
            else{
              await this.add_log(
                'Crear Serie Habilitación',
                `Compañía cuenta con serie de Habilitación ExternalKey: ${found.ExternalKey}`,
                true,
                company_enablement
              );
              resolve(found);
            }
          })
          .catch((error)=>{
              this._toastProvider.dangerMessage(
                `Ocurrió un error al intentar consultar las Series Habilitación en ambiente PRD: ${JSON.stringify(error)}`
              );
              this.loading = false;
              reject();
          });
      } else if (this.ambiente == 'QA') {
        //Busca series de Habilitacion en QA
        await this._seriesHDian_QAService
          .SearchSerieHD(Alias_Operador_Virtual, CompanyId)
          .then(async (result) => {
            let seriesH: Array<SeriesHDian_Response> = JSON.parse(
              JSON.stringify(result)
            );
            let found = seriesH.find(
              (x) =>
                x.TestSetId.toLowerCase() ===
                serieH.TestSetId.toLocaleLowerCase()
            );
            if (found == undefined) {
              //crea series de Habilitacion en QA
              await this._seriesHDian_QAService
                .createSerieD(serieH, Alias_Operador_Virtual, CompanyId)
                .then(async () => {
                  await this._seriesHDian_QAService
                  .SearchSerieHD(Alias_Operador_Virtual, CompanyId)
                  .then(async (newresult) => {
                    let seriesH1: Array<SeriesHDian_Response> = JSON.parse(
                      JSON.stringify(newresult)
                    );
                    let found1 = seriesH1.find(
                      (x) =>
                        x.TestSetId.toLowerCase() ===
                        serieH.TestSetId.toLocaleLowerCase()
                    );

                    if(found1 != undefined){
                      await this.add_log(
                        'Crear Serie Habilitación',
                        `Serie de habilitación creada con éxito. ExternalKey: ${found1.ExternalKey}`,
                        true,
                        company_enablement
                      );
                      resolve(found1);
                    }
                    else{
                      await this.add_log(
                        'Obtener Serie Habilitación',
                        `Error al obtener serie de habilitación`,
                        false,
                        company_enablement
                      );
                      this.loading = false;
                      reject()
                    }
                  })
                  .catch(async (error)=>{
                    await this.add_log(
                      'Crear Serie Habilitación',
                      `Error: ${JSON.stringify(error)}`,
                      false,
                      company_enablement
                    ).finally(()=>{
                      this._toastProvider.dangerMessage(
                        `Ocurrió un error al intentar Crear Serie Habilitación en ambiente QA: ${JSON.stringify(error)}`
                      );
                      this.loading = false;
                      reject();
                    });
                  });
                })
                .catch(async (error) => {
                  await this.add_log(
                    'Crear Serie Habilitación',
                    `Error: ${JSON.stringify(error)}`,
                    false,
                    company_enablement
                  );
                });
            }
            else{
              await this.add_log(
                'Crear Serie Habilitación',
                `Compañía cuenta con serie de Habilitación ExternalKey: ${found.ExternalKey}`,
                true,
                company_enablement
              );
              resolve(found);
            }
          })
          .catch((error)=>{
            this._toastProvider.dangerMessage(
              `Ocurrió un error al intentar consultar las Series Habilitación en ambiente PRD: ${JSON.stringify(error)}`
            );
            this.loading = false;
            reject();
          });
      }
      reject();
    });
  }

  add_log(
    module: string,
    message: string,
    status: boolean,
    company_enablement: Enablement_Companies
  ) {
    return new Promise(async (resolve) => {
      let log: logs_enablement = {
        date: new Date(),
        module: module,
        message: message,
        status: status,
      };

      //Busca y agrega nuevo log a compañía por habilitar
      let index = this.companies_to_enablement.indexOf(company_enablement);
      if (index >= 0) {
        this.companies_to_enablement[index].log.push(log);
        this.companies_to_enablement[index].general_result = this.companies_to_enablement[index].general_result ? status : this.companies_to_enablement[index].general_result;
      }

      resolve(true);
    });
  }

  receiveLogClose(close: boolean) {
    this.companies_log_result = [];
  }
}
