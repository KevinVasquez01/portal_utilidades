export class Packages {
  create: boolean = false;
  FE: Array<Packages_Items> = [];
  DS: Array<Packages_Items> = [];
  NE: Array<Packages_Items> = []; 
  DE: Array<Packages_Items> = [];
}

export interface Packages_Items {
  Id: string;
  Name: string;
  Description: string;
  Price: number;
  PlanType: string;
  IsEnabled: boolean;
  Type: string;
}

export interface virtualOperatorCompanyActivationPlans{
  Id: string;
  VirtualOperatorId: string;
  CreationDate: Date;
  ExpirationDate: Date;
  Name: string;
  Description: string;
  ActivationPrice: number;
  Type: string;
  Invoiceable: boolean;
}

