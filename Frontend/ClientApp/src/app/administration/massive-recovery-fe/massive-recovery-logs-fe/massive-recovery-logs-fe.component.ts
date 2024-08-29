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
import { invoicestagingdocuments_results } from 'src/app/models/MassiveRecoveryFE/massiverecoveryFE';
import { ExportService } from '../../export.service';
import { results_massive_recoveriesFE } from '../massive-recovery-run-fe/massive-recovery-run-fe.component';

@Component({
  selector: 'app-massive-recovery-logs-fe',
  templateUrl: './massive-recovery-logs-fe.component.html',
  styleUrls: ['./massive-recovery-logs-fe.component.scss'],
})
export class MassiveRecoveryLogsFeComponent implements OnInit, AfterViewInit {
  @Input() dataEntrante: results_massive_recoveriesFE[] = [];
  @Output() dataSaliente: EventEmitter<boolean> = new EventEmitter(); //Enviar para salir

  invoicestagingdocumentsList!: MatTableDataSource<invoicestagingdocuments_results>;
  displayedColumns: string[] = [
    'VirtualOperatorAlias',
    'DocumentType',
    'DocumentNumber',
    'SupplierIdentification',
    'CreationDate',
    'Status',
    'Description',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(private _export: ExportService) {}
  ngOnInit(): void {
    this.invoicestagingdocumentsList = new MatTableDataSource(this.results());
  }

  ngAfterViewInit(): void {
    this.invoicestagingdocumentsList.paginator = this.paginator;
  }

  results() {
    let results: invoicestagingdocuments_results[] = [];
    for (let i = 0; i < this.dataEntrante.length; i++) {
      let document_result =
        this.dataEntrante[i].document_result != undefined
          ? this.dataEntrante[i].document_result
          : this.dataEntrante[i].document;
      if (document_result != undefined) {
        let result: invoicestagingdocuments_results = {
          Id: document_result.Id,
          VirtualOperatorAlias: document_result.VirtualOperatorAlias,
          DocumentType: document_result.DocumentType,
          SupplierIdentification: document_result.SupplierIdentification,
          DocumentNumber: document_result.DocumentNumber,
          Cufe: document_result.Cufe,
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
    let reportName = `Massive_RecoveryFE_Result_${nowFormatted}`;
    this._export.exportAsExcelFile(
      this.invoicestagingdocumentsList.data,
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
