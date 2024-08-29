import { AddressSaphetyI } from "../Company/Address";
import { IdentificationSaphetyI } from "../Company/Identification";
import { PersonSaphetyI } from "../Company/Person";

export interface CompanyS_I {
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
  DistributorId: string;
  Id: string;
  VirtualOperatorId: string;
  SelectedOPVName : string;
}
