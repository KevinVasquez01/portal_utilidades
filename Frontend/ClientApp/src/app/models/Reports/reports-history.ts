export interface ReportsHistory {
  id?: number
  date: Date;
  user: string;
  report_type: string;
  reportTypeNumber: number;
  json: string;
  new_companies?: number;
  new_money?: number;
}

export interface ReportsHistory_JsonNE {
  jsonOPP: string;
  jsonPROJECT: string;
}

export interface ReportsHistory_JsonFE {
  jsonOPP: string;
  jsonPROJECT: string;
}

export interface ReportsHistory_JsonDS {
  jsonOPP: string;
  jsonPROJECT: string;
}

export interface ReportsHistory_JsonRE {
  jsonOPP: string;
  jsonPROJECT: string;
}

export interface ReportsHistory_JsonDE {
  jsonOPP: string;
  jsonPROJECT: string;
}


