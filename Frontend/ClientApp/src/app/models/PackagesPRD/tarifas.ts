export interface PrePaidPackages {
  Id: string;
  Description: string;
  Name: string;
  Price: number;
  DocumentQuantity: string;
  ValidityPeriodIndDays: number;
  IsEnabled: boolean;
  CreationDate: Date;
  VirtualOperatorId: string;
  ModulesVirtualOperatorId: string;
  IsAvailableInStore: boolean;
  SKU: string;
}

export interface PostPaidPackages {
  Id: string;
  Description: string;
  Name: string;
  MinimumPrice: number;
  ValidityPeriodIndDays: number;
  IsEnabled: boolean;
  CreationDate: Date;
  VirtualOperatorId: string;
  PlanType: string;
  Invoiceable: boolean;
  SKU: string;
}
