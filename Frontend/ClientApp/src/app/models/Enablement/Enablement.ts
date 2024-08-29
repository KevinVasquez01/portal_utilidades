import { CompanySaphetyI } from '../Company/Company';
import { SeriesHDian_Response } from '../SeriesHDian/SeriesHDian';

export interface Enablement_Companies_Excel {
  Alias_Operador_Virtual: string;
  Nit: number;
  TestSetId: string;
}

export interface logs_enablement {
  date: Date;
  module: string;
  message: string;
  status: boolean;
}

export interface Enablement_Companies {
  company_excel: Enablement_Companies_Excel;
  company_saphety?: CompanySaphetyI;
  serie_H_saphety?: SeriesHDian_Response;
  planopaquete?: Enablement_Companies_PlanOPaquete;
  log: logs_enablement[];
  general_result: boolean;
}

export interface Enablement_fe_Struct {
  documentId: string;
  documentNumber: number;
  cufe?: string;
  issueDate?: Date;
  statusDescription?: string;
  statusMessage?: string;
  isvalid?: boolean;
}

export interface Enablement_Documents_Sent {
  company_excel: Enablement_Companies_Excel;
  company_saphety?: CompanySaphetyI;
  serie_H_saphety?: SeriesHDian_Response;
  sales_invoices: Array<Enablement_fe_Struct>;
  debit_notes: Array<Enablement_fe_Struct>;
  credit_notes: Array<Enablement_fe_Struct>;
  enablement_result: boolean;
}

export interface Enablement_status {
  status: Array<{
    company: string;
    nit: string;
    current_action: string;
    finalize: boolean;
    error: boolean;
  }>;
  results?: Array<Enablement_Documents_Sent>;
}

export interface Enablement_excel{
  Alias_Operador_Virtual: string;
  Nit: string;
  TestSetId: string;
  ExternalKey: string;
  DocumentType: string,
  DocumentNumber: string,
  Cufe: string,
  StatusDescription?: string;
  StatusMessage?: string;
  Isvalid?: boolean;
}

export interface Enablement_Companies_PlanOPaquete{
  createdPU: boolean;
  name: string;
  id: string;
  error?: string;
}
