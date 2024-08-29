export interface HistoryChangesSincoM {
  company: string;
  document: string;
  user: string;
  initials: string;
  ismacroplantilla: boolean;
  class: string;
  date: Date;
  changes: string;
}

export interface HistoryChangesSincoDB {
  date_change: Date;
  company_name: string;
  document_number: string;
  dv: string;
  custom_field1: string;
  custom_field2: string;
  custom_field3: string;
  other_changes: string;
  user_creator: string;
  is_macroplantilla: boolean;
  is_html: boolean;
}
