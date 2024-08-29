export interface Template {
  id: number;
  name: string;
  documenttype: string;
  content: string;
}

export interface Template_sublog {
  Date: Date;
  TemplateName: string;
  DocumentType: string;
  Result: boolean;
  Message: string;
}

export interface Template_log {
  Date: Date;
  CompanyName: string;
  OperatorName: string;
  CompanyId: string;
  Result: boolean;
  Logs: Template_sublog[];
}
