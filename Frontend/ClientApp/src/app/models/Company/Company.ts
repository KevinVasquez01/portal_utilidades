import { AddressSaphetyI } from "./Address";
import { IdentificationSaphetyI } from "./Identification";
import { PersonSaphetyI } from "./Person";

export interface CompanySaphetyI {
  Identification: IdentificationSaphetyI;
  Address: AddressSaphetyI;
  ResponsabilityTypes: string[];
  Medias: [];
  IsInboundIntegrated: boolean;
  IsOutboundIntegrated: boolean;
  Logo: {};
  Person: PersonSaphetyI;
  LanguageCode: string;
  LegalType: string;
  TimezoneCode: string;
  TaxScheme: string;
  Name: string;
  Email: string;
  FinancialSupportEmail: string;
  Telephone?: string;
  DistributorId : string;
  Id : string;
  VirtualOperatorId? : string;
  InvoiceIssuingServiceActive?: boolean;
  PayrollIssuingServiceActive?: boolean;
  SupportDocumentIssuingServiceActive?: boolean;
  InvoiceReceptionServiceActive?: boolean;
  EquivalentDocumentIssuingServiceActive?: boolean;
  CreationDate?: Date;
}
