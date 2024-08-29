import { formatDate } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { payrollstagingdocuments_results } from 'src/app/models/MassiveRecoveryNE/massiverecoveryNE';
import { ExportService } from '../../export.service';
import { results_massive_recoveries } from '../massive-recovery-run-ne/massive-recovery-run-ne.component';

@Component({
  selector: 'app-massive-recovery-logs-ne',
  templateUrl: './massive-recovery-logs-ne.component.html',
  styleUrls: ['./massive-recovery-logs-ne.component.scss'],
})
export class MassiveRecoveryLogsNeComponent implements OnInit, AfterViewInit {
  @Input() dataEntrante: results_massive_recoveries[] = [];
  @Output() dataSaliente: EventEmitter<boolean> = new EventEmitter(); //Enviar para salir

  payrollstagingdocumentsList!: MatTableDataSource<payrollstagingdocuments_results>;
  displayedColumns: string[] = [
    'VirtualOperatorAlias',
    'DocumentNumber',
    'EmployerIdentification',
    'CreationDate',
    'Status',
    'Description',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(private _export: ExportService) {}
  ngOnInit(): void {
    this.payrollstagingdocumentsList = new MatTableDataSource(this.results());
  }

  ngAfterViewInit(): void {
    this.payrollstagingdocumentsList.paginator = this.paginator;
  }

  results() {
    let results: payrollstagingdocuments_results[] = [];
    for (let i = 0; i < this.dataEntrante.length; i++) {
      let document_result =
        this.dataEntrante[i].document_result != undefined
          ? this.dataEntrante[i].document_result
          : this.dataEntrante[i].document;
      if (document_result != undefined) {
        let result: payrollstagingdocuments_results = {
          Id: document_result.Id,
          VirtualOperatorAlias: document_result.VirtualOperatorAlias,
          EmployerIdentification: document_result.EmployerIdentification,
          DocumentNumber: document_result.DocumentNumber,
          Cune: document_result.Cune,
          CorrelationDocumentId: document_result.CorrelationDocumentId,
          IsSyncProcess: document_result.IsSyncProcess,
          CreationDate: document_result.CreationDate,
          LastUpdateDate: document_result.LastUpdateDate,
          Status:
            this.dataEntrante[i].error.length > 0
              ? this.dataEntrante[i].error[0]
              : document_result.Status,
          Error_Description:
            this.dataEntrante[i].error.length > 1
              ? this.dataEntrante[i].error[1]
              : document_result.Error_Description,
        };

        results.push(result);
      }
    }

    return results;
  }

  exit() {
    this.dataSaliente.emit(true);
  }

  exportExcel(): void {
    let nowFormatted = formatDate(new Date(), 'ddMMyyyy', 'es-CO');
    let reportName = `Massive_Recovery_Result_${nowFormatted}`;
    this._export.exportAsExcelFile(
      this.payrollstagingdocumentsList.data,
      reportName
    );
  }

  styleColor(text: string) {
    if (text == 'RecoverOk') {
      return 'green';
    } else if (text == 'RecoverError') {
      return 'red';
    } else {
      return 'orange';
    }
  }
}
