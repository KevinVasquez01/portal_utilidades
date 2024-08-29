import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CompanySaphetyI } from 'src/app/models/Company/Company';
import {
  PlanPackage_Companies,
  PlanPackage_Companies_Excel,
  PlanPackage_Companies_Log,
  PlanPackage_logs,
} from 'src/app/models/PackagesPRD/massiveplanspackages';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { SearchCompanyPrdService } from 'src/app/services/SaphetyApi_PRD/search-company-prd.service';
import { SearchPlanPaquetePRDService } from 'src/app/services/SaphetyApi_PRD/search-plan-paquete..service';
import { SearchCompanyQaService } from 'src/app/services/SaphetyApi_QA/search-company-qa.service';
import { SearchPlanPaqueteServiceQA } from 'src/app/services/SaphetyApi_QA/search-plan-paquete.service';
import { ExportService } from '../../export.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-massive-plans-packages-load-companies',
  templateUrl: './massive-plans-packages-load-companies.component.html',
  styleUrls: ['./massive-plans-packages-load-companies.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class MassivePlansPackagesLoadCompaniesComponent implements OnInit {
  companies_excel: Array<PlanPackage_Companies_Excel> = []; //Excel cargado por usuario
  companies: Array<PlanPackage_Companies_Log> = []; //Compañías a las que se les creará plan o paquete
  companies_log_result: Array<PlanPackage_Companies_Log> = []; //Resultado creación

  @Output() companies_for_massive: EventEmitter<
    Array<PlanPackage_Companies_Log>
  > = new EventEmitter(); //Enviar compañías a componente principal

  example_template: Array<PlanPackage_Companies_Excel> = [
    {
      Alias_Operador_Virtual: 'saphety',
      Nit: 900900900,
    },
  ];

  ambiente = '';
  loading = false;

  constructor(
    private _toastProvider: ToastProvider,
    private _export: ExportService,
    private _SearchCompanyQA: SearchCompanyQaService,
    private _SearchCompanyPRD: SearchCompanyPrdService,
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
    this.companies = [];
    this.companies_log_result = [];

    await this.load_excel(event).finally(async () => {
      if (this.companies_excel.length > 0) {
        await this.load_companies();
      } else {
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
            XLSX.utils.sheet_to_json<PlanPackage_Companies_Excel>(ws);

          resolve(true);
        };
      } catch {
        reject();
      }
    });
  }

  async load_companies() {
    this.companies = [];
    let error = false;
    for(let i =0; i<this.companies_excel.length; i++){
      try {
        let company = await this.search_Company(
          this.companies_excel[i].Alias_Operador_Virtual,
          this.companies_excel[i].Nit.toString(),
          this.companies_excel[i]
        );
        this.companies.push(company);
      } catch {
        this._toastProvider.cautionMessage(
          `El formato del archivo Excel es incorrecto, por favor corríjalo e intente nuevamente.`
        );
        this.companies = [];
        this.loading = false;
        error = true;
      }
    }

    this.companies_log_result = this.companies.filter(
      (x) => x.general_result === false
    );

    if (error) {
      return;
    }

    this.companies_for_massive.emit(
      this.companies.filter((x) => x.general_result === true)
    );
  }

  search_Company(
    Alias_Operador_Virtual: string,
    Nit: string,
    comp_excel: PlanPackage_Companies_Excel
  ) {
    return new Promise<PlanPackage_Companies_Log>(async (resolve) => {
      let company: PlanPackage_Companies_Log = {
        company_saphety: undefined,
        company_excel: comp_excel,
        planpackages: undefined,
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
              company.company_saphety = arrayresult[0];
              company.general_result = true;
              company.planpackages = await this.searchPlanPackagePRD(company);
            } else {
              let log: PlanPackage_logs = {
                date: new Date(),
                module: 'Buscar Compañía',
                message: 'Compañía no encontrada',
                status: false,
              };
              company.general_result = false;
              company.log.push(log);
            }
          })
          .catch((error) => {
            let log: PlanPackage_logs = {
              date: new Date(),
              module: 'Buscar Compañía',
              message: JSON.stringify(error['Errors']),
              status: false,
            };
            company.general_result = false;
            company.log.push(log);
          })
          .finally(() => {
            resolve(company);
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
              company.company_saphety = arrayresult[0];
              company.general_result = true;
              company.planpackages = await this.searchPlanPackageQA(company);
            } else {
              let log: PlanPackage_logs = {
                date: new Date(),
                module: 'Buscar Compañía',
                message: 'Compañía no encontrada',
                status: false,
              };
              company.general_result = false;
              company.log.push(log);
            }
          })
          .catch((error) => {
            let log: PlanPackage_logs = {
              date: new Date(),
              module: 'Buscar Compañía',
              message: JSON.stringify(error['Errors']),
              status: false,
            };
            company.general_result = false;
            company.log.push(log);
          })
          .finally(() => {
            resolve(company);
          });
      }
    });
  }

  exportExcel_Example(): void {
    //Ejemplo
    this._export.exportAsExcelFile(
      this.example_template,
      'Compañias_PlanesPaquetes_Ejemplo'
    );
  }

  async searchPlanPackagePRD(company: PlanPackage_Companies_Log) {
    let company_saphety = company.company_saphety;
    let planesypaquetes: PlanPackage_Companies = {
      PaquetesFE: [],
      PlanesFE: [],
      PaquetesDS: [],
      PlanesDS: [],
      PaquetesNE: [],
      PlanesNE: [],
      PaquetesRE: [],
      PlanesRE: [],
    };
    if (company_saphety != undefined) {
      await this._planopaquetePRD
        .obtenerPlanyPaquete(
          company.company_excel.Alias_Operador_Virtual,
          company_saphety.VirtualOperatorId != undefined
            ? company_saphety.VirtualOperatorId
            : '',
          company_saphety.Id,
          false
        )
        .then((data) => {
          planesypaquetes = data;
        });
      return planesypaquetes;
    }
  }

  async searchPlanPackageQA(company: PlanPackage_Companies_Log) {
    let company_saphety = company.company_saphety;
    let planesypaquetes: PlanPackage_Companies = {
      PaquetesFE: [],
      PlanesFE: [],
      PaquetesDS: [],
      PlanesDS: [],
      PaquetesNE: [],
      PlanesNE: [],
      PaquetesRE: [],
      PlanesRE: [],
    };
    if (company_saphety != undefined) {
      await this._planopaqueteQA
        .obtenerPlanyPaquete(
          company.company_excel.Alias_Operador_Virtual,
          company_saphety.VirtualOperatorId != undefined
            ? company_saphety.VirtualOperatorId
            : '',
          company_saphety.Id,
          false
        )
        .then((data) => {
          planesypaquetes = data;
        });
      return planesypaquetes;
    }
  }

  receiveLogClose(close: boolean) {
    this.companies_log_result = [];
    this.companies_excel = [];
    this.companies = [];
  }

  ngOnInit(): void {}
}
