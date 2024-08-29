import { Component, Input, OnInit } from '@angular/core';
import { Report_Documents_M_Empresa } from 'src/app/models/Reports/Documents/documents-issued';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-documents-issued-result',
  templateUrl: './documents-issued-result.component.html',
  styleUrls: ['./documents-issued-result.component.scss'],
})
export class DocumentsIssuedResultComponent implements OnInit {
  @Input() top_EmisionFE: Report_Documents_M_Empresa[] = [];
  @Input() top_EmisionDS: Report_Documents_M_Empresa[] = [];
  @Input() top_EmisionNE: Report_Documents_M_Empresa[] = [];
  @Input() top_RecepcionFE: Report_Documents_M_Empresa[] = [];
  @Input() top_EmisionFE_Aliados: Report_Documents_M_Empresa[] = [];
  @Input() top_EmisionDS_Aliados: Report_Documents_M_Empresa[] = [];
  @Input() top_EmisionNE_Aliados: Report_Documents_M_Empresa[] = [];
  @Input() top_RecepcionFE_Aliados: Report_Documents_M_Empresa[] = [];

  @Input() report_type: number = 1;
  @Input() startDate: string = '';
  @Input() endDate: string = '';

  @Input() Documents_M_Empresa: Report_Documents_M_Empresa[] = []; //Documentos Emitidos y Recibidos pos empresa

  constructor() {}

  ngOnInit(): void {}

  title = 'Excel';
  ExportTOExcel() {
    let newJson1: any[] = [];
    for (let i = 0; i < this.Documents_M_Empresa.length; i++) {
      if (this.report_type === 1) {
        newJson1.push({
          'Operador Virtual': this.Documents_M_Empresa[i].Aliado,
          'Nombre Empresa': this.Documents_M_Empresa[i].Nombre,
          Nit: this.Documents_M_Empresa[i].Nit,
          Email: this.Documents_M_Empresa[i].Email,
          'Email Financiero': this.Documents_M_Empresa[i].Email_Financiero,
          Teléfono: this.Documents_M_Empresa[i].Telefono,
          'Factura de Venta':
            this.Documents_M_Empresa[i].Emision_Facturacion.SalesInvoice,
          'Nota Débito':
            this.Documents_M_Empresa[i].Emision_Facturacion.DebitNote,
          'Nota Crédito':
            this.Documents_M_Empresa[i].Emision_Facturacion.CreditNote,
          'Total Emisión FE':
            this.Documents_M_Empresa[i].Emision_Facturacion.Total,
          'Documento Soporte':
            this.Documents_M_Empresa[i].Emision_DocumentoSoporte
              .SupportDocument,
          'Nota Ajuste Documento Soporte':
            this.Documents_M_Empresa[i].Emision_DocumentoSoporte
              .SupportDocumentAdjustment,
          'Total Emisión DS':
            this.Documents_M_Empresa[i].Emision_DocumentoSoporte.Total,
          'Nomina Individual':
            this.Documents_M_Empresa[i].Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            this.Documents_M_Empresa[i].Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': this.Documents_M_Empresa[i].Emision_Nomina.Total,
          'R Factura de Venta':
            this.Documents_M_Empresa[i].Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito':
            this.Documents_M_Empresa[i].Recepcion_Facturacion.DebitNote,
          'R Nota Crédito':
            this.Documents_M_Empresa[i].Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE':
            this.Documents_M_Empresa[i].Recepcion_Facturacion.Total,
        });
      } else {
        newJson1.push({
          Aliado: this.Documents_M_Empresa[i].Aliado,
          'Nombre Empresa': this.Documents_M_Empresa[i].Nombre,
          Nit: this.Documents_M_Empresa[i].Nit,
          Email: this.Documents_M_Empresa[i].Email,
          'Email Financiero': this.Documents_M_Empresa[i].Email_Financiero,
          Teléfono: this.Documents_M_Empresa[i].Telefono,
          'Factura de Venta':
            this.Documents_M_Empresa[i].Emision_Facturacion.SalesInvoice,
          'Nota Débito':
            this.Documents_M_Empresa[i].Emision_Facturacion.DebitNote,
          'Nota Crédito':
            this.Documents_M_Empresa[i].Emision_Facturacion.CreditNote,
          'Total Emisión FE':
            this.Documents_M_Empresa[i].Emision_Facturacion.Total,
          'Documento Soporte':
            this.Documents_M_Empresa[i].Emision_DocumentoSoporte
              .SupportDocument,
          'Nota Ajuste Documento Soporte':
            this.Documents_M_Empresa[i].Emision_DocumentoSoporte
              .SupportDocumentAdjustment,
          'Total Emisión DS':
            this.Documents_M_Empresa[i].Emision_DocumentoSoporte.Total,
          'Nomina Individual':
            this.Documents_M_Empresa[i].Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            this.Documents_M_Empresa[i].Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': this.Documents_M_Empresa[i].Emision_Nomina.Total,
          'R Factura de Venta':
            this.Documents_M_Empresa[i].Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito':
            this.Documents_M_Empresa[i].Recepcion_Facturacion.DebitNote,
          'R Nota Crédito':
            this.Documents_M_Empresa[i].Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE':
            this.Documents_M_Empresa[i].Recepcion_Facturacion.Total,
          'Paquete/Plan Emisión FE':
            this.Documents_M_Empresa[i].Paquete_Plan_FE.Name,
          'Fecha Vencimiento FE':
            this.Documents_M_Empresa[i].Paquete_Plan_FE.ExpirationDate,
          'Documentos Restantes FE':
            this.Documents_M_Empresa[i].Paquete_Plan_FE.RemainingDocuments,
          'Paquete/Plan Emisión DS':
            this.Documents_M_Empresa[i].Paquete_Plan_DS.Name,
          'Fecha Vencimiento DS':
            this.Documents_M_Empresa[i].Paquete_Plan_DS.ExpirationDate,
          'Documentos Restantes DS':
            this.Documents_M_Empresa[i].Paquete_Plan_DS.RemainingDocuments,
          'Paquete/Plan Emisión NE':
            this.Documents_M_Empresa[i].Paquete_Plan_NE.Name,
          'Fecha Vencimiento NE':
            this.Documents_M_Empresa[i].Paquete_Plan_NE.ExpirationDate,
          'Documentos Restantes NE':
            this.Documents_M_Empresa[i].Paquete_Plan_NE.RemainingDocuments,
          'Paquete/Plan Recepción FE':
            this.Documents_M_Empresa[i].Paquete_Plan_RE.Name,
          'Fecha Vencimiento Recepción FE':
            this.Documents_M_Empresa[i].Paquete_Plan_RE.ExpirationDate,
          'Documentos Restantes Recepción FE':
            this.Documents_M_Empresa[i].Paquete_Plan_RE.RemainingDocuments,
        });
      }
    }

    let top_empresasFE: any[] = [];
    let top_empresasDS: any[] = [];
    let top_empresasNE: any[] = [];
    let top_empresasRFE: any[] = [];
    let top_aliadosFE: any[] = [];
    let top_aliadosDS: any[] = [];
    let top_aliadosNE: any[] = [];
    let top_aliadosRFE: any[] = [];

    if (this.report_type === 1) {
      top_empresasFE = this.top_EmisionFE.slice(0, 10).map((item) => {
        return {
          'Operador Virtual': item.Aliado,
          'Nombre Empresa': item.Nombre,
          Nit: item.Nit,
          Email: item.Email,
          'Email Financiero': item.Email_Financiero,
          Teléfono: item.Telefono,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });

      top_empresasDS = this.top_EmisionDS.slice(0, 10).map((item) => {
        return {
          'Operador Virtual': item.Aliado,
          'Nombre Empresa': item.Nombre,
          Nit: item.Nit,
          Email: item.Email,
          'Email Financiero': item.Email_Financiero,
          Teléfono: item.Telefono,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });

      top_empresasNE = this.top_EmisionNE.slice(0, 10).map((item) => {
        return {
          'Operador Virtual': item.Aliado,
          'Nombre Empresa': item.Nombre,
          Nit: item.Nit,
          Email: item.Email,
          'Email Financiero': item.Email_Financiero,
          Teléfono: item.Telefono,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });

      top_empresasRFE = this.top_RecepcionFE.slice(0, 10).map((item) => {
        return {
          'Operador Virtual': item.Aliado,
          'Nombre Empresa': item.Nombre,
          Nit: item.Nit,
          Email: item.Email,
          'Email Financiero': item.Email_Financiero,
          Teléfono: item.Telefono,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });

      top_aliadosFE = this.top_EmisionFE_Aliados.slice(0, 10).map((item) => {
        return {
          'Operador Virtual': item.Aliado,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });

      top_aliadosDS = this.top_EmisionDS_Aliados.slice(0, 10).map((item) => {
        return {
          'Operador Virtual': item.Aliado,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });

      top_aliadosNE = this.top_EmisionNE_Aliados.slice(0, 10).map((item) => {
        return {
          'Operador Virtual': item.Aliado,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });

      top_aliadosRFE = this.top_RecepcionFE_Aliados.slice(0, 10).map((item) => {
        return {
          'Operador Virtual': item.Aliado,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });
    } else {
      top_empresasFE = this.top_EmisionFE.slice(0, 10).map((item) => {
        return {
          Aliado: item.Aliado,
          'Nombre Empresa': item.Nombre,
          Nit: item.Nit,
          Email: item.Email,
          'Email Financiero': item.Email_Financiero,
          Teléfono: item.Telefono,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });

      top_empresasDS = this.top_EmisionDS.slice(0, 10).map((item) => {
        return {
          Aliado: item.Aliado,
          'Nombre Empresa': item.Nombre,
          Nit: item.Nit,
          Email: item.Email,
          'Email Financiero': item.Email_Financiero,
          Teléfono: item.Telefono,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });

      top_empresasNE = this.top_EmisionNE.slice(0, 10).map((item) => {
        return {
          Aliado: item.Aliado,
          'Nombre Empresa': item.Nombre,
          Nit: item.Nit,
          Email: item.Email,
          'Email Financiero': item.Email_Financiero,
          Teléfono: item.Telefono,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });

      top_empresasRFE = this.top_RecepcionFE.slice(0, 10).map((item) => {
        return {
          Aliado: item.Aliado,
          'Nombre Empresa': item.Nombre,
          Nit: item.Nit,
          Email: item.Email,
          'Email Financiero': item.Email_Financiero,
          Teléfono: item.Telefono,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });

      top_aliadosFE = this.top_EmisionFE_Aliados.slice(0, 10).map((item) => {
        return {
          Aliado: item.Aliado,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });

      top_aliadosDS = this.top_EmisionDS_Aliados.slice(0, 10).map((item) => {
        return {
          Aliado: item.Aliado,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });

      top_aliadosNE = this.top_EmisionNE_Aliados.slice(0, 10).map((item) => {
        return {
          Aliado: item.Aliado,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });

      top_aliadosRFE = this.top_RecepcionFE_Aliados.slice(0, 10).map((item) => {
        return {
          Aliado: item.Aliado,
          'Factura de Venta': item.Emision_Facturacion.SalesInvoice,
          'Nota Débito': item.Emision_Facturacion.DebitNote,
          'Nota Crédito': item.Emision_Facturacion.CreditNote,
          'Total Emisión FE': item.Emision_Facturacion.Total,
          'Documento Soporte': item.Emision_DocumentoSoporte.SupportDocument,
          'Nota Ajuste Documento Soporte':
            item.Emision_DocumentoSoporte.SupportDocumentAdjustment,
          'Total Emisión DS': item.Emision_DocumentoSoporte.Total,
          'Nomina Individual': item.Emision_Nomina.NominaIndividual,
          'Nomina Individual De Ajuste':
            item.Emision_Nomina.NominaIndividualDeAjuste,
          'Total Emisión NE': item.Emision_Nomina.Total,
          'R Factura de Venta': item.Recepcion_Facturacion.SalesInvoice,
          'R Nota Débito': item.Recepcion_Facturacion.DebitNote,
          'R Nota Crédito': item.Recepcion_Facturacion.CreditNote,
          'R Total Recepción FE': item.Recepcion_Facturacion.Total,
        };
      });
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newJson1);
    const ws1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(top_empresasFE);
    const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(top_empresasDS);
    const ws3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(top_empresasNE);
    const ws4: XLSX.WorkSheet = XLSX.utils.json_to_sheet(top_empresasRFE);
    const ws5: XLSX.WorkSheet = XLSX.utils.json_to_sheet(top_aliadosFE);
    const ws6: XLSX.WorkSheet = XLSX.utils.json_to_sheet(top_aliadosDS);
    const ws7: XLSX.WorkSheet = XLSX.utils.json_to_sheet(top_aliadosNE);
    const ws8: XLSX.WorkSheet = XLSX.utils.json_to_sheet(top_aliadosRFE);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    let etiqueta = this.report_type === 1 ? 'OV' : 'Aliados';
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      `Informe_${this.startDate}_${this.endDate}`
    );
    XLSX.utils.book_append_sheet(wb, ws1, `Top10_Emision_FE`);
    XLSX.utils.book_append_sheet(wb, ws2, `Top10_Emision_DS`);
    XLSX.utils.book_append_sheet(wb, ws3, `Top10_Emision_NE`);
    XLSX.utils.book_append_sheet(wb, ws4, `Top10_Recepcion_FE`);
    XLSX.utils.book_append_sheet(wb, ws5, `Top10_${etiqueta}_Emision_FE`);
    XLSX.utils.book_append_sheet(wb, ws6, `Top10_${etiqueta}_Emision_DS`);
    XLSX.utils.book_append_sheet(wb, ws7, `Top10_${etiqueta}_Emision_NE`);
    XLSX.utils.book_append_sheet(wb, ws8, `Top10_${etiqueta}_Recepcion_FE`);

    XLSX.writeFile(
      wb,
      `Documentos_${this.report_type === 1 ? 'Integracion' : 'Masificacion'}_${
        this.startDate
      }_${this.endDate}.xlsx`,
      { bookType: 'xlsx', bookSST: true, type: 'binary' }
    );
  }
}
