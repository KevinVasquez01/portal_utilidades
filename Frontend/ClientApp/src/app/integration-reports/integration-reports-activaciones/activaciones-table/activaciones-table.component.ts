import { DecimalPipe, formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CreateSupportDocumentOpp } from 'src/app/models/Reports/DS-activation-report/CreateInvoiceOpp';
import { CreateInvoiceOpp } from 'src/app/models/Reports/FE-activation-report/CreateInvoiceOpp';
import { CreatePayrollOpp } from 'src/app/models/Reports/NE-activation-report/CreatePayrollOpp';
import { CreateReceptionOpp } from 'src/app/models/Reports/RE-activation-report/CreateInvoiceOpp';
import { CreateEquivalentOpp } from 'src/app/models/Reports/DE-activation-report/CreateEquivalentOpp';
import { ExportService } from '../../../services/export.service';

@Component({
  selector: 'app-activaciones-table',
  templateUrl: './activaciones-table.component.html',
  styleUrls: ['./activaciones-table.component.scss'],
})
export class ActivacionesTableComponent implements OnInit {
  displayedColumns = [
    'OV.Column1.Name',
    'Column1.Identification.DocumentNumber',
    'OPPORTUNITY NAME',
    'PRICE',
  ];

  @Input() CreateOpp_Table: any[] = []; //Opp
  @Input() CreateProject_Table: any[] = []; //Project

  @Input() report_type: number = 1; //1 FE, 2 NE, 3 DS, 4 RE, 5 DE

  @Input()
  private _FechaInforme: Date = new Date(); //Fecha informe
  public get FechaInforme(): Date {
    return this._FechaInforme;
  }
  public set FechaInforme(value: Date) {
    this._FechaInforme = value;
  }
  nowFormatted = '';
  reportName_Opp = '';
  reportName_Project = '';
  reportName_label_Opp = '';
  reportName_label_Project = '';

  constructor(private _export: ExportService) {}

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  decimalPipe = new DecimalPipe(navigator.language);

  async ngOnInit() {
    //Invoice
    if (this.report_type == 1) {
      this.dataSource = new MatTableDataSource<CreateInvoiceOpp>(
        JSON.parse(JSON.stringify(this.CreateOpp_Table))
      );

      this.reportName_label_Opp = 'CreateInvoiceOpp';
      this.reportName_label_Project = 'CreateInvoiceProject';
    }
    //Payroll
    else if (this.report_type == 2) {
      this.dataSource = new MatTableDataSource<CreatePayrollOpp>(
        JSON.parse(JSON.stringify(this.CreateOpp_Table))
      );
      this.reportName_label_Opp = 'CreatePayrollOpp';
      this.reportName_label_Project = 'CreatePayrollProject';
    }
    //DocumentSupport
    else if (this.report_type == 3) {
      this.dataSource = new MatTableDataSource<CreateSupportDocumentOpp>(
        JSON.parse(JSON.stringify(this.CreateOpp_Table))
      );

      this.reportName_label_Opp = 'CreateSupportDocumentOpp';
      this.reportName_label_Project = 'CreateSupportDocumentProject';
    }
    //Reception
    else if (this.report_type == 4) {
      this.dataSource = new MatTableDataSource<CreateReceptionOpp>(
        JSON.parse(JSON.stringify(this.CreateOpp_Table))
      );

      this.reportName_label_Opp = 'CreateReceptionOpp';
      this.reportName_label_Project = 'CreateReceptionProject';
    }
    //EquivalentDocument
    if (this.report_type == 5) {
      this.dataSource = new MatTableDataSource<CreateEquivalentOpp>(
        JSON.parse(JSON.stringify(this.CreateOpp_Table))
      );

      this.reportName_label_Opp = 'CreateEquivalentOpp';
      this.reportName_label_Project = 'CreateEquivalentProject';
    }

    this.dataSource.paginator = this.paginator;
    this.nowFormatted = formatDate(this.FechaInforme, 'ddMMyyyy', 'es-CO');
    this.reportName_Opp = `${this.reportName_label_Opp}_${this.nowFormatted}-V4`;
    this.reportName_Project = `${this.reportName_label_Project}_${this.nowFormatted}-V4`;
  }

  exportExcel(): void {
    //Opp
    this._export.exportAsExcelFile(this.CreateOpp_Table, this.reportName_Opp);
    //Project
    this._export.exportAsExcelFile(
      this.CreateProject_Table,
      this.reportName_Project
    );
  }

  exportJSON(): void {
    //Opp
    this._export.exportAsJSONFile(this.CreateOpp_Table, this.reportName_Opp);
    //Project
    this._export.exportAsJSONFile(
      this.CreateProject_Table,
      this.reportName_Project
    );
  }
}
