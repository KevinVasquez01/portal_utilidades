import { CompanySaphetyI } from "../Company/Company";

export interface PlanPackage_Companies_Excel {
  Alias_Operador_Virtual: string;
  Nit: number;
}

export interface PlanPackage_Companies_Log {
  company_saphety: CompanySaphetyI | undefined;
  company_excel: PlanPackage_Companies_Excel;
  planpackages: PlanPackage_Companies| undefined;
  log: PlanPackage_logs[];
  general_result: boolean;
}

export interface PlanPackage_logs {
  date: Date;
  module: string;
  message: string;
  status: boolean;
}

export interface PackageModel{
  Id: string,
  CompanyId: string,
  VirtualOperatorId: string,
  CreationDate: string,
  ExpirationDate: string | null,
  Name: string,
  Description: string,
  MinimumPrice: number,
  PlanType: string,
  Invoiceable: boolean,
  ModulesVirtualOperatorId: string,
  SKU: string,
  ValidityPeriodInDays: number,
  OrderNumber: string | null,
  LastUpdateDate: Date,
}

export interface PlanModel{
  Id: string,
  Description: string,
  Name: string,
  DocumentsTotal: number,
  DocumentsConsumed: number,
  RemainingDocuments: number,
  CreationDate: string,
  ExpirationDate: string | null,
  VirtualOperatorId: string,
  ModulesVirtualOperatorId: string,
  SKU: string,
}

export interface PlanPackage_Companies{
  PaquetesFE: Array<PackageModel>,
  PlanesFE: Array<PlanModel>,
  PaquetesDS: Array<PackageModel>,
  PlanesDS: Array<PlanModel>,
  PaquetesNE: Array<PackageModel>,
  PlanesNE: Array<PlanModel>,
  PaquetesRE: Array<PackageModel>,
  PlanesRE: Array<PlanModel>,
}

