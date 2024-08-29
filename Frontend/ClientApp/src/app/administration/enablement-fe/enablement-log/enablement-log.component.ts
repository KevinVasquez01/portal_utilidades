import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Enablement_Documents_Sent,
  Enablement_excel,
} from 'src/app/models/Enablement/Enablement';
import { ExportService } from '../../export.service';

@Component({
  selector: 'app-enablement-log',
  templateUrl: './enablement-log.component.html',
  styleUrls: ['./enablement-log.component.scss'],
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
export class EnablementLogComponent {
  //Almacena log compañías
  @Input() enablement_finalize_log: Array<Enablement_Documents_Sent> = [];
  ambiente = '';
  columnsToDisplay = ['Alias_Operador_Virtual', 'Nit', 'Name', 'TestSetId', 'PlanOPaquete', 'Result'];
  @Output() exit: EventEmitter<boolean> = new EventEmitter();
  expandedElement: Enablement_Documents_Sent | null = null;

  constructor(private _export: ExportService) {
    let ambient = localStorage.getItem('ambient');
    this.ambiente = ambient != undefined ? ambient : '';
  }
  close() {
    this.exit.emit(false); //Cierra log
  }

  exportExcel(): void {
    let excel_list: Array<Enablement_excel> = [];
    for (let i = 0; i < this.enablement_finalize_log.length; i++) {

      const Nit_Empresa =
        this.enablement_finalize_log[i].company_saphety != undefined
          ? this.enablement_finalize_log[i].company_saphety?.Identification
              .DocumentNumber +
            '_' +
            this.enablement_finalize_log[i].company_saphety?.Identification
              .CheckDigit
          : this.enablement_finalize_log[i].company_excel.Nit.toString();

          const prefijo = this.enablement_finalize_log[i].serie_H_saphety?.Prefix ||
          '';

      //Facturas
      for (let j = 0; j < this.enablement_finalize_log[i].sales_invoices.length; j++ ) {
        excel_list.push({
          Alias_Operador_Virtual:
            this.enablement_finalize_log[i].company_excel
              .Alias_Operador_Virtual,
          Nit: Nit_Empresa,
          TestSetId: this.enablement_finalize_log[i].company_excel.TestSetId,
          ExternalKey:
            this.enablement_finalize_log[i].serie_H_saphety?.ExternalKey || '',
          DocumentType: 'SalesInvoice',
          DocumentNumber: prefijo + this.enablement_finalize_log[i].sales_invoices[j].documentNumber,
          StatusDescription:
            this.enablement_finalize_log[i].sales_invoices[j].statusDescription,
          StatusMessage:
            this.enablement_finalize_log[i].sales_invoices[j].statusMessage,
          Isvalid: this.enablement_finalize_log[i].sales_invoices[j].isvalid,
          Cufe: this.enablement_finalize_log[i].sales_invoices[j].cufe || '',
        });
      }

      //Notas Débito
      for (let k = 0; k < this.enablement_finalize_log[i].debit_notes.length; k++ ) {
        excel_list.push({
          Alias_Operador_Virtual:
            this.enablement_finalize_log[i].company_excel
              .Alias_Operador_Virtual,
          Nit: Nit_Empresa,
          TestSetId: this.enablement_finalize_log[i].company_excel.TestSetId,
          ExternalKey:
            this.enablement_finalize_log[i].serie_H_saphety?.ExternalKey || '',
          DocumentType: 'DebitNote',
          DocumentNumber: prefijo + this.enablement_finalize_log[i].debit_notes[k].documentNumber,
          StatusDescription:
            this.enablement_finalize_log[i].debit_notes[k].statusDescription,
          StatusMessage:
            this.enablement_finalize_log[i].debit_notes[k].statusMessage,
          Isvalid: this.enablement_finalize_log[i].debit_notes[k].isvalid,
          Cufe: this.enablement_finalize_log[i].debit_notes[k].cufe || '',
        });
      }

      //Notas Crédito
      for (let l = 0; l < this.enablement_finalize_log[i].debit_notes.length; l++ ) {
        excel_list.push({
          Alias_Operador_Virtual:
            this.enablement_finalize_log[i].company_excel
              .Alias_Operador_Virtual,
          Nit: Nit_Empresa,
          TestSetId: this.enablement_finalize_log[i].company_excel.TestSetId,
          ExternalKey:
            this.enablement_finalize_log[i].serie_H_saphety?.ExternalKey || '',
          DocumentType: 'CreditNote',
          DocumentNumber: prefijo + this.enablement_finalize_log[i].credit_notes[l].documentNumber,
          StatusDescription:
            this.enablement_finalize_log[i].credit_notes[l].statusDescription,
          StatusMessage:
            this.enablement_finalize_log[i].credit_notes[l].statusMessage,
          Isvalid: this.enablement_finalize_log[i].credit_notes[l].isvalid,
          Cufe: this.enablement_finalize_log[i].credit_notes[l].cufe || '',
        });
      }
    }

    let nowFormatted = formatDate(new Date(), 'ddMMyyyy', 'es-CO');
    let name = `${'Habilitacion_FE'}_${nowFormatted}`;
    this._export.exportAsExcelFile(excel_list, name);
  }
}
