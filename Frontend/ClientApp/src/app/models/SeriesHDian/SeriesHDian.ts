export class SeriesHDian{
  Name: string = "Serie Habilitacion";
  AuthorizationNumber: string = "18760000001";
  Prefix: string = "SETT";
  StartValue: number = 1;
  EndValue: number = 5000000;
  EffectiveValue: number = 1;
  ValidFrom: Date = new Date("2019-01-19T15:00:00");
  ValidTo: Date = new Date("2030-01-19T05:00:00");
  TestSetId: string = "";
  TechnicalKey: string = "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c";
}

export interface SeriesHDian_Response{
  AuthorizationNumber: string;
  CompanyId: string;
  StartValue: number;
  EndValue: number;
  EffectiveValue: number;
  ExternalKey: string;
  Id: string;
  Name: string;
  Prefix: string;
  Status: string;
  TechnicalKey: string;
  TestSetId: string;
  ValidFrom: Date;
  ValidTo: Date;
}
