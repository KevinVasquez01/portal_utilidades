import { Component, Input, OnInit } from '@angular/core';
import {
  Enablement_Documents_Sent,
  Enablement_fe_Struct,
} from 'src/app/models/Enablement/Enablement';

const logDetail: Enablement_Documents_Sent = {
  company_excel: {
    Alias_Operador_Virtual: 'saphety',
    Nit: 80844005,
    TestSetId: 'f70cc3cc-ae31-491c-9512-69e13e23f130',
  },
  company_saphety: undefined,
  serie_H_saphety: undefined,
  sales_invoices: [
    {
      documentId: '4bdf3ff2-5905-4c76-b94d-052a9c72509d',
      documentNumber: 1001,
      isvalid: true,
      statusDescription:
        'Set de prueba con identificador f70cc3cc-ae31-491c-9512-69e13e23f130 se encuentra Aceptado.',
      cufe: '9c8d0f1836b0b5ea82cf06edd9325419b28867e109152242867f2ca478aa9bc76f6b1140b3e5bd5647face8fcbf90552',
    },
    {
      documentId: '9382e3d2-40d9-477f-95c3-15aeba87f141',
      documentNumber: 1002,
      isvalid: false,
      statusDescription:
        'Set de prueba con identificador f70cc3cc-ae31-491c-9512-69e13e23f130 se encuentra Aceptado.',
    },
    {
      documentId: '9382e3d2-40d9-477f-95c3-15aeba87f141',
      documentNumber: 1003,
      isvalid: true,
      statusDescription:
        'Set de prueba con identificador f70cc3cc-ae31-491c-9512-69e13e23f130 se encuentra Aceptado.',
    },
    {
      documentId: '9382e3d2-40d9-477f-95c3-15aeba87f141',
      documentNumber: 1004,
      isvalid: true,
      statusDescription:
        'Set de prueba con identificador f70cc3cc-ae31-491c-9512-69e13e23f130 se encuentra Aceptado.',
    },
    {
      documentId: '9382e3d2-40d9-477f-95c3-15aeba87f141',
      documentNumber: 1005,
      isvalid: true,
      statusDescription:
        'Set de prueba con identificador f70cc3cc-ae31-491c-9512-69e13e23f130 se encuentra Aceptado.',
    },
    {
      documentId: '9382e3d2-40d9-477f-95c3-15aeba87f141',
      documentNumber: 1006,
      isvalid: true,
      statusDescription:
        'Set de prueba con identificador f70cc3cc-ae31-491c-9512-69e13e23f130 se encuentra Aceptado.',
    },
    {
      documentId: '9382e3d2-40d9-477f-95c3-15aeba87f141',
      documentNumber: 1007,
      isvalid: true,
      statusDescription:
        'Set de prueba con identificador f70cc3cc-ae31-491c-9512-69e13e23f130 se encuentra Aceptado.',
    },
    {
      documentId: '9382e3d2-40d9-477f-95c3-15aeba87f141',
      documentNumber: 1008,
      isvalid: true,
      statusDescription:
        'Set de prueba con identificador f70cc3cc-ae31-491c-9512-69e13e23f130 se encuentra Aceptado.',
    },
    {
      documentId: '9382e3d2-40d9-477f-95c3-15aeba87f141',
      documentNumber: 1009,
      isvalid: true,
      statusDescription:
        'Set de prueba con identificador f70cc3cc-ae31-491c-9512-69e13e23f130 se encuentra Aceptado.',
    },
  ],
  debit_notes: [
    {
      documentId: '95f70854-7b41-4470-9128-621e278498b9',
      documentNumber: 1001,
      isvalid: true,
      statusDescription:
        'Set de prueba con identificador f70cc3cc-ae31-491c-9512-69e13e23f130 se encuentra Aceptado.',
      cufe: '76ce24db4eabf48fb4a1fc04fac771b88a7055594c45bd2f39914693b9c642cd6848b318f9fdc6d1b871755990225bd5',
    },
  ],
  credit_notes: [
    {
      documentId: '5476d745-76d8-4b67-97e3-18541a24b6af',
      documentNumber: 1001,
      isvalid: true,
      statusDescription:
        'Set de prueba con identificador f70cc3cc-ae31-491c-9512-69e13e23f130 se encuentra Aceptado.',
      cufe: 'a751a7647fc6081188217562abe5ddbcf3a0466a980754f45cd0d48257dfdf539ea6f573853f79724d37a1e66809027d',
    },
  ],
  enablement_result: true,
};

interface log_show {
  timeline_inverted: boolean;
  icon: string;
  class: string;
  documents: number;
  title: string;
  documents_list: Array<Enablement_fe_Struct>;
}

@Component({
  selector: 'app-enablement-log-details',
  templateUrl: './enablement-log-details.component.html',
  styleUrls: ['./enablement-log-details.component.scss'],
})
export class EnablementLogDetailsComponent implements OnInit {

  @Input() data_entrante! : Enablement_Documents_Sent;

  stacked = false;
  displayedColumns = ['number', 'description'];

  to_show_list: Array<log_show> = [];
  prefix: string = '';

  detalle!: Enablement_Documents_Sent;

  timeline_inverted = false; //Orden de inversión Timeline

  constructor() {

  }

  ngOnInit(): void {
    this.detalle = this.data_entrante;
    this.prefix = this.detalle.serie_H_saphety?.Prefix || '';

    const lista_facturas = this.detalle.sales_invoices.slice(0, 8);
    let invoices = lista_facturas.filter((x) => !x.isvalid);
    let result_invoices = invoices.length == 0 ? true : false;

    let debitnotes = this.detalle.debit_notes.filter((x) => !x.isvalid);
    let result_debitnotes = debitnotes.length == 0 ? true : false;

    let creditnotes = this.detalle.credit_notes.filter((x) => !x.isvalid);
    let result_creditnotes = creditnotes.length == 0 ? true : false;

    this.to_show_list.push({
      timeline_inverted: this.timeline_inverted,
      icon: result_invoices ? 'fa fa-thumbs-o-up' : this.timeline_inverted ? 'fa fa-hand-o-right' : 'fa fa-hand-o-left',
      class: result_invoices ? 'info':'danger',
      documents: lista_facturas.length,
      title: 'Facturas Enviadas',
      documents_list: lista_facturas,
    });

    this.change_timeline_inverted();

    if (this.detalle.debit_notes.length > 0) {
      this.to_show_list.push({
        timeline_inverted: this.timeline_inverted,
        icon: result_debitnotes ? 'fa fa-thumbs-o-up' : this.timeline_inverted ? 'fa fa-hand-o-right' : 'fa fa-hand-o-left',
        class: result_debitnotes ? 'info':'danger',
        documents: this.detalle.debit_notes.length,
        title: 'Notas Débito Enviadas',
        documents_list: this.detalle.debit_notes,
      });

      this.change_timeline_inverted();
    }

    if (this.detalle.credit_notes.length > 0) {
      this.to_show_list.push({
        timeline_inverted: this.timeline_inverted,
        icon: result_creditnotes ? 'fa fa-thumbs-o-up' : this.timeline_inverted ? 'fa fa-hand-o-right' : 'fa fa-hand-o-left',
        class: result_creditnotes ? 'info':'danger',
        documents: this.detalle.credit_notes.length,
        title: 'Notas Crédito Enviadas',
        documents_list: this.detalle.credit_notes,
      });

      this.change_timeline_inverted();
    }

    if (this.detalle.sales_invoices.length > 8) {
      this.to_show_list.push({
        timeline_inverted: this.timeline_inverted,
        icon: this.detalle.enablement_result ? 'fa fa-thumbs-o-up' : this.timeline_inverted ? 'fa fa-hand-o-right' : 'fa fa-hand-o-left',
        class: this.detalle.enablement_result ? 'info':'danger',
        documents: 0,
        title: 'Resultado de la Habilitación',
        documents_list: [
          this.detalle.sales_invoices[this.detalle.sales_invoices.length - 1],
        ],
      });
    }
  }

  change_timeline_inverted() {
    this.timeline_inverted = this.timeline_inverted ? false : true;
  }
}
