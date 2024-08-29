export interface Report_Firts_Documents_action {
  ov: string;
  executed: number;
  count: number;
  action: string;
  have_companies: boolean;
}

export interface Report_Firts_Documents {
  'Operador Virtual': string;
  Documento: string;
  'Razón Social': string;
  Email: string;
  'Email Financiero': string;
  Telefono: string;
  'Servicio FE': string;
  'Servicio Emisión FE': string;
  'Servicio DS': string;
  'Servicio Emisión DS': string;
  'Servicio NE': string;
  'Servicio Emisión NE': string;
  'Servicio R FE': string;
  'Servicio Recepción FE': string;
}

export interface Report_Firts_Documents_OV {
  Operador_Virtual: string;
  Empresas_E_FE: number;
  Empresas_E_DS: number;
  Empresas_E_NE: number;
  Empresas_R_FE: number;
  Total_Empresas: number;
}
