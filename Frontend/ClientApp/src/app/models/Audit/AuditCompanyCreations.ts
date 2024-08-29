export interface AuditCompanyCreations {
  date: Date;
  distributor: string;
  documentNumber: string;
  name: string;
  ambients: Date;
  action: string;
  services: string;
  user: string;
}

export interface AuditCompanyCreationsTable {
  Fecha: string;
  Distribuidor: string;
  Documento: string;
  'Razón Social': string;
  Ambientes: Date;
  Servicios: string;
  Usuario: string;
  Acción: string;
}
