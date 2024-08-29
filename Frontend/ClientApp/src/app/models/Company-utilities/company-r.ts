import { CompanyContact_UI } from "./company-contact";
import { CompanyDataCreation_UI } from "./company-datacreation";
import { CompanyResponsibility_UI } from "./company-responsibility";
import { CompanySerieHabilitacion_UI } from "./company-serie-habilitacion";
import { CompanyUsers_U } from "./company-users";

export class CompanyR_UC {
  id: number = 0;
  documenttype: string = '';
  countrycode: string = '';
  documentnumber: string = '';
  checkdigit: string = '';
  languagecode: string = '';
  timezonecode: string = '';
  taxscheme: string = '';
  legaltype: string = '';
  firstname: string = '';
  familyname: string = '';
  middlename: string = '';
  name: string = '';
  virtualoperator: string = '';
  distributorid: string = '';
  namepackageorplan: string = '';
  packdefault: boolean = false;
  contacts: Array<CompanyContact_UI> = [];
  responsibilities: Array<CompanyResponsibility_UI> = [];
  series: Array<CompanySerieHabilitacion_UI> = [];
  dataCreations: Array<CompanyDataCreation_UI> = [];
  users: Array<CompanyUsers_U> = [];
}
