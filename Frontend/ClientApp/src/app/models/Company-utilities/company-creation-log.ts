import { CompanyR_UC } from "./company-r";
export interface logs{
  date: Date;
  module : string;
  message: string;
  status: boolean;
}

export class CompanyCreationLog {
  IdCompany_PRD: string = '';
  IdCompany_QA: string = '';
  Company_Utilities: CompanyR_UC = new CompanyR_UC();
  Messages_PRD: logs[] = [];
  Messages_QA: logs[] = [];
  General_Result : boolean = false;
}
