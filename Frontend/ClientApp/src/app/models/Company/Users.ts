export interface Roles_SaphetyI{
  CompanyRoleId: string;
  CompanyRoleName: string;
}

export interface identificationRoles_SaphetyI{
  DocumentNumber: string,
  DocumentType: string,
  CountryCode: string,
  CheckDigit: string,
  Code: string
}

export class CompanyMemberships_SaphetyI{
  Roles: Array<Roles_SaphetyI> = [];
  Identification!: identificationRoles_SaphetyI;
  CanEdit: boolean = true;
  VirtualOperatorId: string = '';
  CompanyId: string = '';
  CompanyName: string = '';
  Name: string = '';
}

export class CompanyUsers_Saphety {
  IsBlocked: boolean = true;
  SystemMemberships: Array<any> = [];
  VirtualOperatorMemberships: Array<any> = [];
  CompanyMemberships: Array<CompanyMemberships_SaphetyI> = [];
  Timezone: string = 'America/Bogota';
  LanguageCode: string = 'es-CO';
  Name: string = '';
  Email: string = '';
  Telephone: string = '';
}

export class CompanyUsers_Saphety_Update {
  IsBlocked: boolean = false;
  SystemMemberships: Array<any> = [];
  VirtualOperatorMemberships: Array<any> = [];
  CompanyMemberships: Array<CompanyMemberships_SaphetyI> = [];
  LanguageCode: string = 'es-CO';
  Timezone: string = 'America/Bogota';
  Id : string = '';
  Email: string = '';
  Name: string = '';
  Status: string = '';
  Telephone: string = '';
}
