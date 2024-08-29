export interface payrollstagingdocuments_response {
  Id: string,
  VirtualOperatorAlias: string,
  EmployerIdentification: string,
  DocumentNumber: string,
  Cune: string,
  CorrelationDocumentId: string,
  IsSyncProcess: string,
  CreationDate: Date,
  LastUpdateDate: Date,
  Status: string,
  ErrorMessage: string
}

export interface payrollstagingdocuments {
  Selected : boolean,
  Id: string,
  VirtualOperatorAlias: string,
  EmployerIdentification: string,
  DocumentNumber: string,
  Cune: string,
  CorrelationDocumentId: string,
  IsSyncProcess: string,
  CreationDate: Date,
  LastUpdateDate: Date,
  Status: string,
  Error_Description: string,
  Error_ExplanationValue: string
}

export interface payrollstagingdocuments_results {
  Id: string,
  VirtualOperatorAlias: string,
  EmployerIdentification: string,
  DocumentNumber: string,
  Cune: string,
  CorrelationDocumentId: string,
  IsSyncProcess: string,
  CreationDate: Date,
  LastUpdateDate: Date,
  Status: string,
  Error_Description: string
}

export interface payrollstagingdocuments_ErrorMessage {
  id: number,
  Code: string,
  Description: string,
  ExplanationValues: string[]
}


