import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogI } from 'src/app/models/dialog.model';

@Component({
  selector: 'app-masification-reports-dialog',
  templateUrl: './masification-reports-dialog.component.html',
  styleUrls: []
})
export class MasificationReportsDialogComponent implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<MasificationReportsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogI) {}

  ngOnInit() {
  }

  aceptar() {
    this.data.respuesta = true;
  }

  cancelar() {
    this.data.respuesta = false;
  }
}
