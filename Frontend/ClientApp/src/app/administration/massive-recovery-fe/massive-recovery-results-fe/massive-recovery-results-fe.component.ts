import { formatDate } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { invoicestagingdocuments } from 'src/app/models/MassiveRecoveryFE/massiverecoveryFE';
import { ExportService } from '../../export.service';

@Component({
  selector: 'app-massive-recovery-results-fe',
  templateUrl: './massive-recovery-results-fe.component.html',
  styleUrls: ['./massive-recovery-results-fe.component.scss']
})
export class MassiveRecoveryResultsFeComponent implements OnInit, AfterViewInit
{
  allSelected: boolean = false;

  @Input() dataEntrante: invoicestagingdocuments[] = [];
  @Output() dataSaliente: EventEmitter<Array<invoicestagingdocuments>> =
    new EventEmitter(); //Enviar para recuperacion

  invoicestagingdocumentsList!: MatTableDataSource<invoicestagingdocuments>;
  displayedColumns: string[] = [
    'chk',
    'VirtualOperatorAlias',
    'DocumentType',
    'DocumentNumber',
    'SupplierIdentification',
    'CreationDate',
    'ErrorMessage',
    'Description',
  ];

  @ViewChild(MatSort) sort: MatSort = Object.create(null);
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(private _export: ExportService) {}
  ngOnInit(): void {
    this.invoicestagingdocumentsList = new MatTableDataSource(
      this.dataEntrante
    );
  }

  ngAfterViewInit(): void {
    this.invoicestagingdocumentsList.paginator = this.paginator;
    this.invoicestagingdocumentsList.sort = this.sort;
  }

  filter(filterValue: string): void {
    this.invoicestagingdocumentsList.filter = filterValue.trim().toLowerCase();
  }

  updateAllComplete(): void {
    this.allSelected =
      this.invoicestagingdocumentsList != null &&
      this.invoicestagingdocumentsList.filteredData.every((t) => t.Selected);
  }
  someComplete(): any {
    return (
      this.invoicestagingdocumentsList.filteredData.filter((t) => t.Selected).length > 0 && !this.allSelected
    );
  }

  setAll(selected: boolean): void {
    this.allSelected = selected;
    this.invoicestagingdocumentsList.filteredData.forEach(
      (t) => (t.Selected = selected)
    );
  }

  complete(){
    return (this.invoicestagingdocumentsList.filteredData.filter((t) => t.Selected).length > 0 ? true : false);
  }

  runRecovery() {
    this.dataSaliente.emit(
      this.invoicestagingdocumentsList.filteredData.filter((x) => x.Selected));
  }

  exportExcel(): void {
    let nowFormatted = formatDate(new Date(), 'ddMMyyyy', 'es-CO');
    let reportName = `Massive_RecoveryFE_Search_Result_${nowFormatted}`;
    this._export.exportAsExcelFile(this.invoicestagingdocumentsList.filteredData, reportName);
  }
}
