export interface invoicestagingdocuments_response {
  Id: string;
  VirtualOperatorAlias: string;
  DocumentType: string;
  SupplierIdentification: string;
  DocumentNumber: string;
  Cufe: string;
  CorrelationDocumentId: string;
  IsSyncProcess: string;
  CreationDate: Date;
  LastUpdateDate: Date;
  Status: string;
  ErrorMessage: string;
}

export interface invoicestagingdocuments {
  Selected: boolean;
  Id: string;
  VirtualOperatorAlias: string;
  DocumentType: string;
  SupplierIdentification: string;
  DocumentNumber: string;
  Cufe: string;
  CorrelationDocumentId: string;
  IsSyncProcess: string;
  CreationDate: Date;
  LastUpdateDate: Date;
  Status: string;
  Error_Description: string;
  Error_ExplanationValue: string;
}

export interface invoicestagingdocuments_results {
  Id: string;
  VirtualOperatorAlias: string;
  DocumentType: string;
  SupplierIdentification: string;
  DocumentNumber: string;
  Cufe: string;
  CorrelationDocumentId: string;
  IsSyncProcess: string;
  CreationDate: Date;
  LastUpdateDate: Date;
  Status: string;
  Error_Description: string;
}

export interface invoicestagingdocuments_ErrorMessage {
  id: number;
  Code: string;
  Description: string;
  ExplanationValues: string[];
}
