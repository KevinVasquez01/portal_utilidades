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
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { payrollstagingdocuments } from 'src/app/models/MassiveRecoveryNE/massiverecoveryNE';
import { ExportService } from '../../export.service';

@Component({
  selector: 'app-massive-recovery-results-ne',
  templateUrl: './massive-recovery-results-ne.component.html',
  styleUrls: ['./massive-recovery-results-ne.component.scss'],
})
export class MassiveRecoveryResultsNeComponent
  implements OnInit, AfterViewInit
{
  allSelected: boolean = false;

  @Input() dataEntrante: payrollstagingdocuments[] = [];
  @Output() dataSaliente: EventEmitter<Array<payrollstagingdocuments>> =
    new EventEmitter(); //Enviar para recuperacion

  payrollstagingdocumentsList!: MatTableDataSource<payrollstagingdocuments>;
  displayedColumns: string[] = [
    'chk',
    'VirtualOperatorAlias',
    'DocumentNumber',
    'EmployerIdentification',
    'CreationDate',
    'ErrorMessage',
    'Description',
  ];

  @ViewChild(MatSort) sort: MatSort = Object.create(null);
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(private _export: ExportService) {}
  ngOnInit(): void {
    this.payrollstagingdocumentsList = new MatTableDataSource(
      this.dataEntrante
    );
  }

  ngAfterViewInit(): void {
    this.payrollstagingdocumentsList.paginator = this.paginator;
    this.payrollstagingdocumentsList.sort = this.sort;
  }

  filter(filterValue: string): void {
    this.payrollstagingdocumentsList.filter = filterValue.trim().toLowerCase();
  }

  updateAllComplete(): void {
    this.allSelected =
      this.payrollstagingdocumentsList != null &&
      this.payrollstagingdocumentsList.filteredData.every((t) => t.Selected);
  }
  someComplete(): any {
    return (
      this.payrollstagingdocumentsList.filteredData.filter((t) => t.Selected).length > 0 && !this.allSelected
    );
  }

  setAll(selected: boolean): void {
    this.allSelected = selected;
    this.payrollstagingdocumentsList.filteredData.forEach(
      (t) => (t.Selected = selected)
    );
  }

  complete(){
    return (this.payrollstagingdocumentsList.filteredData.filter((t) => t.Selected).length > 0 ? true : false);
  }

  runRecovery() {
    this.dataSaliente.emit(
      this.payrollstagingdocumentsList.filteredData.filter((x) => x.Selected));
  }

  exportExcel(): void {
    let nowFormatted = formatDate(new Date(), 'ddMMyyyy', 'es-CO');
    let reportName = `Massive_Recovery_Search_Result_${nowFormatted}`;
    this._export.exportAsExcelFile(this.payrollstagingdocumentsList.filteredData, reportName);
  }
}
