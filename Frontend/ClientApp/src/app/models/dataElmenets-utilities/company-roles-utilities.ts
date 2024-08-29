export interface companyRoles {
  Id: string;
  Name: string;
  Name_Spanish: string;
  selected: boolean;
}

export interface companyRoles_Description {
  Name: string;
  Description: string;
  Type: string;
  Image: string;
  Permissions: Array<{ value: string }>;
}
