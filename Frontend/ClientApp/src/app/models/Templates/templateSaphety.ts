import { AddressSaphetyI } from "../Company/Address";
import { IdentificationSaphetyI } from "../Company/Identification";
import { PersonSaphetyI } from "../Company/Person";

export interface TemplateSaphetyI {
  DocumentType: string;
  DocumentSubType: string;
  Content: string;
  Name: string;
}

export interface TemplateControlI {
  DocumentType: string;
  DocumentSubType: string;
  Content: string;
  Name: string;
  CompanyId: string;
  OperatorVirtual: string
}
