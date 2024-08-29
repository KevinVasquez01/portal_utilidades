interface Report_DocumentsInvoice {
  SalesInvoice: number;
  CreditNote: number;
  DebitNote: number;
  Total: number;
}

interface Report_DocumentsDocumentSupport {
  SupportDocument: number;
  SupportDocumentAdjustment: number;
  Total: number;
}

interface Report_DocumentsPayroll {
  NominaIndividual: number;
  NominaIndividualDeAjuste: number;
  Total: number;
}

export interface Report_Documents_M_Aliados {
  Aliado: string;
  Emision_Facturacion: Report_DocumentsInvoice;
  Recepcion_Facturacion: Report_DocumentsInvoice;
  Emision_Nomina: Report_DocumentsPayroll;
}

interface PlanPackage {
  Name: string;
  ExpirationDate: string;
  RemainingDocuments: number | null;
}

export interface Report_Documents_M_Empresa {
  Aliado: string;
  Nombre: string;
  Nit: string;
  Email: string;
  Email_Financiero: string;
  Telefono: string;
  Emision_Facturacion: Report_DocumentsInvoice;
  Recepcion_Facturacion: Report_DocumentsInvoice;
  Emision_DocumentoSoporte: Report_DocumentsDocumentSupport;
  Emision_Nomina: Report_DocumentsPayroll;
  Paquete_Plan_FE: PlanPackage;
  Paquete_Plan_DS: PlanPackage;
  Paquete_Plan_NE: PlanPackage;
  Paquete_Plan_RE: PlanPackage;
}

export interface Report_Documents_ActuallyAction {
  ov: string;
  start: Date;
  end: Date;
  executed: number;
  count: number;
  action: string;
  have_companies: boolean;
}

export interface Report_Documents_topEmisionFE {
  Aliado_OV: string;
  Nombre: string;
  Nit: string;
  'Factura de Venta': number;
  'Nota Crédito': number;
  'Nota Débito': number;
  'Total Emisión FE': number;
}

export interface Report_Documents_topEmisionDS {
  Aliado_OV: string;
  Nombre: string;
  Nit: string;
  'Documento Soporte': number;
  'Nota Ajuste Documento Soporte': number;
  'Total Emisión DS': number;
}

export interface Report_Documents_topEmisionNE {
  Aliado_OV: string;
  Nombre: string;
  Nit: string;
  'Nomina Individual': number;
  'Nomina Individual De Ajuste': number;
  'Total Emisión NE': number;
}

export interface Report_Documents_topRecepcionFE {
  Aliado_OV: string;
  Nombre: string;
  Nit: string;
  'Factura de Venta': number;
  'Nota Crédito': number;
  'Nota Débito': number;
  'Total Recepción NE': number;
}

export interface Report_Documents_topEmisionFE_AliadoOV {
  Aliado_OV: string;
  'Factura de Venta': number;
  'Nota Crédito': number;
  'Nota Débito': number;
  'Total Emisión FE': number;
}

export interface Report_Documents_topEmisionDS_AliadoOV {
  Aliado_OV: string;
  'Documento Soporte': number;
  'Nota Ajuste Documento Soporte': number;
  'Total Emisión DS': number;
}

export interface Report_Documents_topEmisionNE_AliadoOV {
  Aliado_OV: string;
  'Nomina Individual': number;
  'Nomina Individual De Ajuste': number;
  'Total Emisión NE': number;
}

export interface Report_Documents_topRecepcionFE_AliadoOV {
  Aliado_OV: string;
  'Factura de Venta': number;
  'Nota Crédito': number;
  'Nota Débito': number;
  'Total Recepción': number;
}

export interface Report_Documents_topWidgets {
  Aliado_OV: string;
  Nombre: string;
  Nit: string;
  Total: number;
}
