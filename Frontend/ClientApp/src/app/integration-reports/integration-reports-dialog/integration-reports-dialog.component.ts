import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogI } from 'src/app/models/dialog.model';

@Component({
  selector: 'app-integration-reports-dialog',
  templateUrl: './integration-reports-dialog.component.html',
  styleUrls: []
})
export class IntegrationReportsDialogComponent implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<IntegrationReportsDialogComponent>,
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
