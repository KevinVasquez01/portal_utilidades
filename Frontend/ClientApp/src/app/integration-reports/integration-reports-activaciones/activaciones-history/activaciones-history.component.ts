import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CreateSupportDocumentOpp } from 'src/app/models/Reports/DS-activation-report/CreateInvoiceOpp';
import { CreateSupportDocumentProject } from 'src/app/models/Reports/DS-activation-report/CreateInvoiceProject';
import { CreateInvoiceOpp } from 'src/app/models/Reports/FE-activation-report/CreateInvoiceOpp';
import { CreateInvoiceProject } from 'src/app/models/Reports/FE-activation-report/CreateInvoiceProject';
import { CreatePayrollOpp } from 'src/app/models/Reports/NE-activation-report/CreatePayrollOpp';
import { CreatePayrollProject } from 'src/app/models/Reports/NE-activation-report/CreatePayrollProject';
import { CreateReceptionOpp } from 'src/app/models/Reports/RE-activation-report/CreateInvoiceOpp';
import { CreateReceptionProject } from 'src/app/models/Reports/RE-activation-report/CreateInvoiceProject';
import { CreateEquivalentOpp } from 'src/app/models/Reports/DE-activation-report/CreateEquivalentOpp';
import { CreateEquivalentProject } from 'src/app/models/Reports/DE-activation-report/CreateInvoiceProject';
import {
  ReportsHistory,
  ReportsHistory_JsonDS,
  ReportsHistory_JsonFE,
  ReportsHistory_JsonNE,
  ReportsHistory_JsonRE,
  ReportsHistory_JsonDE,
} from 'src/app/models/Reports/reports-history';
import { ToastProvider } from 'src/app/notifications/toast/toast.provider';
import { ReportsHistoryService } from 'src/app/services/UtilidadesAPI/reports-history.service';
import { WD_struct } from '../activaciones-widgets/activaciones-widgets.component';

@Component({
  selector: 'app-activaciones-history',
  templateUrl: './activaciones-history.component.html',
  styleUrls: ['./activaciones-history.component.scss'],
})
export class ActivacionesHistoryComponent implements OnInit {
  allComplete: boolean = false;

  reportHistoryData: ReportsHistory[] = [];
  displayedColumns: string[] = [
    'report_type',
    'date',
    'user',
    'new_companies',
    'new_money',
    'action',
  ];

  sidePanelOpened = true;
  selectedCategory = 'all';
  selectedOrder = 'date';
  filtereddate = false;
  filtereduser = false;
  filterednewCompanies = false;
  filterednewMoney = false;

  showingDetail = false; //Indica si se muestra detalle
  reportSelected: ReportsHistory = {
    date: new Date(),
    user: '',
    report_type: '',
    reportTypeNumber: 0,
    json: '',
    new_companies: 0,
    new_money: 0,
  };

  Getting_data: boolean = true; //Indica si se están obteniendo datos de inicio
  Getting_data_errors: string[] = []; //Errores al obtener data
  dataSource: MatTableDataSource<ReportsHistory> = new MatTableDataSource();

  //Widgets Data
  WD_company_count: WD_struct[] = [];
  WD_company_money: WD_struct[] = [];
  WD_report_history: { last: string; now: string; value: string } = {
    last: '',
    now: '',
    value: '',
  };

  //Tables Data
  CreatePayrollOpp_Table: CreatePayrollOpp[] = []; //Opp Payroll
  CreatePayrollProject_Table: CreatePayrollProject[] = []; //Project Payroll

  CreateInvoiceOpp_Table: CreateInvoiceOpp[] = []; //Opp Invoice
  CreateInvoiceProject_Table: CreateInvoiceProject[] = []; //Project Invoice

  CreateSupportDocumentOpp_Table: CreateSupportDocumentOpp[] = []; //Opp Invoice
  CreateSupportDocumentProject_Table: CreateSupportDocumentProject[] = []; //Project Invoice

  CreateReceptionOpp_Table: CreateReceptionOpp[] = []; //Opp Invoice
  CreateReceptionProject_Table: CreateReceptionProject[] = []; //Project Invoice

  CreateEquivalentOpp_Table: CreateEquivalentOpp[] = []; //Opp Equivalent
  CreateEquivalentProject_Table: CreateEquivalentProject[] = []; //Project Equivalent

  constructor(
    private _reportsHistoryU: ReportsHistoryService,
    private _toastProvider: ToastProvider,
    private _datePipe: DatePipe
  ) {}

  async ngOnInit() {
    await this.awaitReportHistory();
  }

  async awaitReportHistory() {
    this.Getting_data_errors = [];
    await this._reportsHistoryU
      .GetReportsHistory_Labels_All()
      .then((result) => {
        this.reportHistoryData = JSON.parse(JSON.stringify(result));

        this.dataSource = new MatTableDataSource<ReportsHistory>(
          this.reportHistoryData
        );
        this.orderblClick('date'); //Ordena por fecha

        this.Getting_data = false;
      })
      .catch((result) => {
        this._toastProvider.dangerMessage(
          `Ocurrió un error al obtener el histórico de informes: ${JSON.stringify(
            result
          )}`
        );
        this.Getting_data_errors.push(JSON.stringify(result));
        return;
      });
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  countType(type: string) {
    let value = 0;
    this.reportHistoryData.forEach((element) => {
      if (element.report_type == type) {
        value++;
      }
    });

    return value;
  }

  filterblClick(val: string): void {
    this.selectedCategory = val;
    if (val === 'all') {
      this.dataSource.data = this.reportHistoryData;
    } else {
      this.dataSource.data = this.reportHistoryData.filter(
        (x) => x.report_type == val
      );
    }
  }

  orderblClick(val: string): void {
    this.dataSource = new MatTableDataSource<ReportsHistory>(
      this.reportHistoryData
    );

    this.selectedOrder = val;

    if (val === 'date') {
      this.filtereddate = this.filtereddate ? false : true;
      if (this.filtereddate) {
        this.dataSource.data.sort(
          (a, b) =>
            Date.parse(b.date.toString()) - Date.parse(a.date.toString())
        );
      } else {
        this.dataSource.data.sort(
          (a, b) =>
            Date.parse(a.date.toString()) - Date.parse(b.date.toString())
        );
      }
    } else if (val === 'user') {
      this.filtereduser = this.filtereduser ? false : true;
      if (this.filtereduser) {
        this.dataSource.data.sort((a, b) => b.user.localeCompare(a.user));
      } else {
        this.dataSource.data.sort((a, b) => a.user.localeCompare(b.user));
      }
    } else if (val === 'new_companies') {
      this.filterednewCompanies = this.filterednewCompanies ? false : true;

      if (this.filterednewCompanies) {
        this.dataSource.data.sort(function (a, b) {
          return (
            (b.new_companies == undefined ? 0 : b.new_companies) -
            (a.new_companies == undefined ? 0 : a.new_companies)
          );
        });
      } else {
        this.dataSource.data.sort(function (a, b) {
          return (
            (a.new_companies == undefined ? 0 : a.new_companies) -
            (b.new_companies == undefined ? 0 : b.new_companies)
          );
        });
      }
    } else if (val === 'new_money') {
      this.filterednewMoney = this.filterednewMoney ? false : true;
      if (this.filterednewMoney) {
        this.dataSource.data.sort(function (a, b) {
          return (
            (b.new_money == undefined ? 0 : b.new_money) -
            (a.new_money == undefined ? 0 : a.new_money)
          );
        });
      } else {
        this.dataSource.data.sort(function (a, b) {
          return (
            (a.new_money == undefined ? 0 : a.new_money) -
            (b.new_money == undefined ? 0 : b.new_money)
          );
        });
      }
    }
  }

  async mostrarDetalle(event: ReportsHistory) {
    this.Getting_data = true;
    this.reportSelected = event;
    await this.BuildWidgets()
      .then(() => {
        this.showingDetail = true;
        this.Getting_data = false;
      })
      .catch(() => {
        this.Getting_data = false;
        return;
      });
  }

  ocultarDetalle() {
    this.reportSelected = {
      date: new Date(),
      user: '',
      report_type: '',
      reportTypeNumber: 0,
      json: '',
      new_companies: 0,
      new_money: 0,
    };

    this.WD_company_count = [];
    this.WD_company_money = [];
    this.WD_report_history = {
      last: '',
      now: '',
      value: '',
    };

    //Tables Data
    this.CreatePayrollOpp_Table = []; //Opp
    this.CreatePayrollProject_Table = []; //Project

    this.showingDetail = false;
  }

  //Construye data para Widgets
  async BuildWidgets() {
    let fecha = this._datePipe.transform(
      this.reportSelected.date,
      'dd/MM/yyyy'
    );
    this.WD_report_history = {
      now: 'Fecha generación',
      last: 'informe',
      value: fecha === null ? '' : fecha,
    };

    await this._reportsHistoryU
      .GetReportsHistory_ById(
        this.reportSelected.id === undefined ? 0 : this.reportSelected.id
      )
      .then((result) => {
        this.reportSelected = JSON.parse(JSON.stringify(result));
        this.reportSelected.reportTypeNumber =
          this.reportSelected.report_type === 'invoice_activations'
            ? 1
            : this.reportSelected.report_type === 'payroll_activations'
            ? 2
            : this.reportSelected.report_type === 'supportdocument_activations'
            ? 3
            : this.reportSelected.report_type === 'reception_activations'
            ? 4
            : this.reportSelected.report_type === 'EquivalentDoc_activations'
            ? 5
            : 0;

        //Invoice Activations
        if (this.reportSelected.reportTypeNumber === 1) {
          let json: ReportsHistory_JsonFE = JSON.parse(
            this.reportSelected.json
          );
          this.CreateInvoiceOpp_Table = JSON.parse(json.jsonOPP);
          this.CreateInvoiceProject_Table = JSON.parse(json.jsonPROJECT);
        }
        //PayRoll Activations
        else if (this.reportSelected.reportTypeNumber === 2) {
          let json: ReportsHistory_JsonNE = JSON.parse(
            this.reportSelected.json
          );
          this.CreatePayrollOpp_Table = JSON.parse(json.jsonOPP);
          this.CreatePayrollProject_Table = JSON.parse(json.jsonPROJECT);
        }
        //Document Support Activations
        else if (this.reportSelected.reportTypeNumber === 3) {
          let json: ReportsHistory_JsonDS = JSON.parse(
            this.reportSelected.json
          );
          this.CreateSupportDocumentOpp_Table = JSON.parse(json.jsonOPP);
          this.CreateSupportDocumentProject_Table = JSON.parse(
            json.jsonPROJECT
          );
        }
        //Reception Activations
        else if (this.reportSelected.reportTypeNumber === 4) {
          let json: ReportsHistory_JsonRE = JSON.parse(
            this.reportSelected.json
          );
          this.CreateReceptionOpp_Table = JSON.parse(json.jsonOPP);
          this.CreateReceptionProject_Table = JSON.parse(
            json.jsonPROJECT
          );
        }
        //Equivalent Document Activations
        else if (this.reportSelected.reportTypeNumber === 5) {
          let json: ReportsHistory_JsonDE = JSON.parse(
            this.reportSelected.json
          );
          this.CreateEquivalentOpp_Table = JSON.parse(json.jsonOPP);
          this.CreateEquivalentProject_Table = JSON.parse(
            json.jsonPROJECT
          );
        }
      })
      .catch((result) => {
        this._toastProvider.dangerMessage(
          `Ocurrió un error al obtener el detalle del informe: ${JSON.stringify(
            result
          )}`
        );
        return;
      });

    //Invoice Activations
    if (this.reportSelected.reportTypeNumber === 1) {
      //Arma data
      await Promise.all(
        this.CreateInvoiceOpp_Table.map(async (company) => {
          //Activaciones Número
          const found = this.WD_company_count.find(
            (x) =>
              x.name.toLocaleLowerCase() ==
              company['OV.Column1.Name'].toLocaleLowerCase()
          );
          if (found === undefined) {
            this.WD_company_count.push({
              name: company['OV.Column1.Name'].toLocaleLowerCase(),
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
              x.name.toLocaleLowerCase() ==
              company['OV.Column1.Name'].toLocaleLowerCase()
          );

          if (foundMoney === undefined) {
            this.WD_company_money.push({
              name: company['OV.Column1.Name'].toLocaleLowerCase(),
              value: company.PRICE,
            });
          } else {
            let indexof = this.WD_company_money.indexOf(foundMoney);
            this.WD_company_money.splice(indexof, 1);
            (foundMoney.value =
              Number(foundMoney.value) + Number(company.PRICE)),
              this.WD_company_money.push(foundMoney);
          }
        })
      );

      await Promise.all(
        this.CreateInvoiceOpp_Table.map(async (company) => {
          company['CLOSE DATE'] = new Date(company['CLOSE DATE']);
        })
      );

      await Promise.all(
        this.CreateInvoiceProject_Table.map(async (company) => {
          company['KICKOFF'] = new Date(company['KICKOFF']);
          company['BASELINE'] = new Date(company['BASELINE']);
          company['NEWDELIVERY'] = new Date(company['NEWDELIVERY']);
          company['ACTUAL DELIVERY'] = new Date(company['ACTUAL DELIVERY']);
        })
      );
    }
    //PayRoll Activations
    else if (this.reportSelected.reportTypeNumber === 2) {
      //Arma data
      await Promise.all(
        this.CreatePayrollOpp_Table.map(async (company) => {
          //Activaciones Número
          const found = this.WD_company_count.find(
            (x) =>
              x.name.toLocaleLowerCase() ==
              company['OV.Column1.Name'].toLocaleLowerCase()
          );
          if (found === undefined) {
            this.WD_company_count.push({
              name: company['OV.Column1.Name'].toLocaleLowerCase(),
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
              x.name.toLocaleLowerCase() ==
              company['OV.Column1.Name'].toLocaleLowerCase()
          );

          if (foundMoney === undefined) {
            this.WD_company_money.push({
              name: company['OV.Column1.Name'].toLocaleLowerCase(),
              value: company.PRICE,
            });
          } else {
            let indexof = this.WD_company_money.indexOf(foundMoney);
            this.WD_company_money.splice(indexof, 1);
            (foundMoney.value =
              Number(foundMoney.value) + Number(company.PRICE)),
              this.WD_company_money.push(foundMoney);
          }
        })
      );

      await Promise.all(
        this.CreatePayrollOpp_Table.map(async (company) => {
          company['CLOSE DATE'] = new Date(company['CLOSE DATE']);
        })
      );

      await Promise.all(
        this.CreatePayrollProject_Table.map(async (company) => {
          company['KICKOFF'] = new Date(company['KICKOFF']);
          company['BASELINE'] = new Date(company['BASELINE']);
          company['NEWDELIVERY'] = new Date(company['NEWDELIVERY']);
          company['ACTUAL DELIVERY'] = new Date(company['ACTUAL DELIVERY']);
        })
      );
    }
    //Document Support Activations
    else if (this.reportSelected.reportTypeNumber === 3) {
      //Arma data
      await Promise.all(
        this.CreateSupportDocumentOpp_Table.map(async (company) => {
          //Activaciones Número
          const found = this.WD_company_count.find(
            (x) =>
              x.name.toLocaleLowerCase() ==
              company['OV.Column1.Name'].toLocaleLowerCase()
          );
          if (found === undefined) {
            this.WD_company_count.push({
              name: company['OV.Column1.Name'].toLocaleLowerCase(),
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
              x.name.toLocaleLowerCase() ==
              company['OV.Column1.Name'].toLocaleLowerCase()
          );

          if (foundMoney === undefined) {
            this.WD_company_money.push({
              name: company['OV.Column1.Name'].toLocaleLowerCase(),
              value: company.PRICE,
            });
          } else {
            let indexof = this.WD_company_money.indexOf(foundMoney);
            this.WD_company_money.splice(indexof, 1);
            (foundMoney.value =
              Number(foundMoney.value) + Number(company.PRICE)),
              this.WD_company_money.push(foundMoney);
          }
        })
      );

      await Promise.all(
        this.CreateSupportDocumentOpp_Table.map(async (company) => {
          company['CLOSE DATE'] = new Date(company['CLOSE DATE']);
        })
      );

      await Promise.all(
        this.CreateSupportDocumentProject_Table.map(async (company) => {
          company['KICKOFF'] = new Date(company['KICKOFF']);
          company['BASELINE'] = new Date(company['BASELINE']);
          company['NEWDELIVERY'] = new Date(company['NEWDELIVERY']);
          company['ACTUAL DELIVERY'] = new Date(company['ACTUAL DELIVERY']);
        })
      );
    }
    //Reception Support Activations
    else if (this.reportSelected.reportTypeNumber === 4) {
      //Arma data
      await Promise.all(
        this.CreateReceptionOpp_Table.map(async (company) => {
          //Activaciones Número
          const found = this.WD_company_count.find(
            (x) =>
              x.name.toLocaleLowerCase() ==
              company['OV.Column1.Name'].toLocaleLowerCase()
          );
          if (found === undefined) {
            this.WD_company_count.push({
              name: company['OV.Column1.Name'].toLocaleLowerCase(),
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
              x.name.toLocaleLowerCase() ==
              company['OV.Column1.Name'].toLocaleLowerCase()
          );

          if (foundMoney === undefined) {
            this.WD_company_money.push({
              name: company['OV.Column1.Name'].toLocaleLowerCase(),
              value: company.PRICE,
            });
          } else {
            let indexof = this.WD_company_money.indexOf(foundMoney);
            this.WD_company_money.splice(indexof, 1);
            (foundMoney.value =
              Number(foundMoney.value) + Number(company.PRICE)),
              this.WD_company_money.push(foundMoney);
          }
        })
      );

      await Promise.all(
        this.CreateReceptionOpp_Table.map(async (company) => {
          company['CLOSE DATE'] = new Date(company['CLOSE DATE']);
        })
      );

      await Promise.all(
        this.CreateReceptionProject_Table.map(async (company) => {
          company['KICKOFF'] = new Date(company['KICKOFF']);
          company['BASELINE'] = new Date(company['BASELINE']);
          company['NEWDELIVERY'] = new Date(company['NEWDELIVERY']);
          company['ACTUAL DELIVERY'] = new Date(company['ACTUAL DELIVERY']);
        })
      );
    }

    //Equivalent Document Activations
    if (this.reportSelected.reportTypeNumber === 5) {
      //Arma data
      await Promise.all(
        this.CreateEquivalentOpp_Table.map(async (company) => {
          //Activaciones Número
          const found = this.WD_company_count.find(
            (x) =>
              x.name.toLocaleLowerCase() ==
              company['OV.Column1.Name'].toLocaleLowerCase()
          );
          if (found === undefined) {
            this.WD_company_count.push({
              name: company['OV.Column1.Name'].toLocaleLowerCase(),
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
              x.name.toLocaleLowerCase() ==
              company['OV.Column1.Name'].toLocaleLowerCase()
          );

          if (foundMoney === undefined) {
            this.WD_company_money.push({
              name: company['OV.Column1.Name'].toLocaleLowerCase(),
              value: company.PRICE,
            });
          } else {
            let indexof = this.WD_company_money.indexOf(foundMoney);
            this.WD_company_money.splice(indexof, 1);
            (foundMoney.value =
              Number(foundMoney.value) + Number(company.PRICE)),
              this.WD_company_money.push(foundMoney);
          }
        })
      );

      await Promise.all(
        this.CreateEquivalentOpp_Table.map(async (company) => {
          company['CLOSE DATE'] = new Date(company['CLOSE DATE']);
        })
      );

      await Promise.all(
        this.CreateEquivalentProject_Table.map(async (company) => {
          company['KICKOFF'] = new Date(company['KICKOFF']);
          company['BASELINE'] = new Date(company['BASELINE']);
          company['NEWDELIVERY'] = new Date(company['NEWDELIVERY']);
          company['ACTUAL DELIVERY'] = new Date(company['ACTUAL DELIVERY']);
        })
      );
    }

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
}
