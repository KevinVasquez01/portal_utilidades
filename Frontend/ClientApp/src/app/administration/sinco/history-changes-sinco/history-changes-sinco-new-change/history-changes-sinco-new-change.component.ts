import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HistoryChangesSincoDB } from '../history-changes-sinco-currentcompany/history-changes-sinco-currentcompany';

@Component({
  selector: 'app-history-changes-sinco-new-change',
  templateUrl: './history-changes-sinco-new-change.component.html',
  styleUrls: ['./history-changes-sinco-new-change.component.scss'],
})
export class HistoryChangesSincoNewChangeComponent {
  values: HistoryChangesSincoDB = {
    date_change: new Date(),
    company_name: '',
    document_number: '',
    dv: '',
    custom_field1: '',
    custom_field2: '',
    custom_field3: '',
    other_changes: '',
    user_creator: '',
    is_macroplantilla: false,
    is_html: false,
  };

  running = false;

  constructor(
    public dialogRef: MatDialogRef<HistoryChangesSincoNewChangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  validate(): boolean {
    let result = true;
    if(this.values.custom_field1 !== ''){
      result = false;
    }
    else if(this.values.custom_field2 !== ''){
      result = false;
    }
    else if(this.values.custom_field3 !== ''){
      result = false;
    }
    else if(this.values.other_changes !== ''){
      result = false;
    }

    return result;
  }

  aceptar() {
    this.data.respuesta = true;
    this.data.change = JSON.stringify(this.values);
  }

  cancelar() {
    this.data.respuesta = false;
  }
}
