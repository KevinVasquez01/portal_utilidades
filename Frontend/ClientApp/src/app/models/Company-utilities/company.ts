import { CompanyContact_UI } from "./company-contact";
import { CompanyDataCreation_UI } from "./company-datacreation";
import { CompanyResponsibility_UI } from "./company-responsibility";
import { CompanySerieHabilitacion_UI } from "./company-serie-habilitacion";
import { CompanyUsers_U } from "./company-users";

export interface Company_UI {
  documenttype: string;
  countrycode: string;
  documentnumber: string;
  checkdigit: string;
  languagecode: string;
  timezonecode: string;
  taxscheme: string;
  legaltype: string;
  firstname: string;
  familyname: string;
  middlename: string;
  name: string;
  virtualoperator: string;
  distributorid: string;
  namepackageorplan: string;
  packdefault: boolean;
  companyContacts: Array<CompanyContact_UI>;
  companyResponsibilities: Array<CompanyResponsibility_UI>;
  companySeries: Array<CompanySerieHabilitacion_UI>;
  companyDataCreations: Array<CompanyDataCreation_UI>;
  companyUsers: Array<CompanyUsers_U>;
}
